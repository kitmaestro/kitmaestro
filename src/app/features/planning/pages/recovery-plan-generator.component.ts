import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { Subject } from 'rxjs';
import { PretifyPipe } from '../../../shared/pipes/pretify.pipe';
import { ClassSection, CompetenceEntry, RecoveryPlan } from '../../../core/models';
import {
	askGemini,
	askGeminiSuccess,
	createRecoveryPlan,
	createRecoveryPlanSuccess,
} from '../../../store/recovery-plans';
import { loadSections } from '../../../store/class-sections/class-sections.actions';
import { selectAllClassSections } from '../../../store/class-sections/class-sections.selectors';
import { selectAllStudents } from '../../../store/students/students.selectors';
import { loadStudents } from '../../../store/students/students.actions';
import { RecoveryPlanComponent } from '../components/recovery-plan.component';
import { CompetenceService } from '../../../core/services';

@Component({
	selector: 'app-recovery-plan-generator',
	templateUrl: './recovery-plan-generator.component.html',
	standalone: true,
	imports: [
		CommonModule,
		ReactiveFormsModule,
		MatSnackBarModule,
		MatStepperModule,
		MatFormFieldModule,
		MatSelectModule,
		MatInputModule,
		MatButtonModule,
		MatIconModule,
		MatChipsModule,
		RouterModule,
		PretifyPipe,
		RecoveryPlanComponent,
	],
})
export class RecoveryPlanGeneratorComponent implements OnInit {
	#fb = inject(FormBuilder);
	#store = inject(Store);
	#actions$ = inject(Actions);
	#snackBar = inject(MatSnackBar);
	#router = inject(Router);
	#competenceService = inject(CompetenceService);

	destroy$ = new Subject<void>();

	classSections$ = this.#store.select(selectAllClassSections);
	students$ = this.#store.select(selectAllStudents);
	classSections: ClassSection[] = [];
	competences: CompetenceEntry[] = [];

	generating = false;
	generatedPlan: RecoveryPlan | null = null;

	diagnosticTypes = [
		'Los estudiantes no lograron desarrollar las competencias necesarias',
		'Los estudiantes no presentaron algunas asignaciones',
		'Los estudiantes necesitan reforzar los temas',
		'Otra',
	];

	actors = ['Director/a', 'Padres', 'Asistente', 'Consejo de Curso'];

	subjects = [
		'LENGUA_ESPANOLA',
		'MATEMATICA',
		'CIENCIAS_SOCIALES',
		'CIENCIAS_NATURALES',
		'INGLES',
		'FRANCES',
		'EDUCACION_ARTISTICA',
		'EDUCACION_FISICA',
		'FORMACION_HUMANA',
	];

	periods = ['p1', 'p2', 'p3', 'p4'];

	generatorForm = this.#fb.group({
		classSection: [''],
		subject: [''],
		period: [''],
		diagnosticType: [''],
		diagnostic: [''],
		students: [[] as string[]],
		achievementIndicators: [[] as string[]],
		actors: [[] as string[]],
		notes: [''],
	});

	ngOnInit(): void {
		this.#store.dispatch(loadSections());
		this.classSections$.subscribe(sections => this.classSections = sections);

		this.generatorForm.get('classSection')?.valueChanges.subscribe((sectionId) => {
			if (sectionId) {
				this.#store.dispatch(loadStudents({ sectionId }));
				this.loadCompetences();
			}
		});

		this.generatorForm.get('subject')?.valueChanges.subscribe(() => {
			this.loadCompetences();
		});

		this.#actions$.pipe(ofType(askGeminiSuccess)).subscribe(({ response }) => {
			this.generating = false;
			try {
				const content = JSON.parse(response.response);
				this.generatedPlan = content as RecoveryPlan;
			} catch (e) {
				this.#snackBar.open(
					'Error al procesar la respuesta del AI. Intenta de nuevo.',
					'Ok',
					{ duration: 3000 }
				);
			}
		});

		this.#actions$.pipe(ofType(createRecoveryPlanSuccess)).subscribe(({ recoveryPlan }) => {
			this.#router.navigate(['/planning/recovery-plans', recoveryPlan._id]);
		});
	}

	loadCompetences() {
		const sectionId = this.generatorForm.get('classSection')?.value;
		const subject = this.generatorForm.get('subject')?.value;
		if (sectionId && subject) {
			const section = this.classSections.find(s => s._id === sectionId);
			if (section) {
				this.#competenceService.findAll({ level: section.level, grade: section.year, subject }).subscribe(competences => {
					this.competences = competences;
				});
			}
		}
	}

	generate() {
		this.generating = true;
		const formValue = this.generatorForm.value;
		const prompt = this.buildPrompt(formValue);
		this.#store.dispatch(askGemini({ prompt }));
	}

	save() {
		if (this.generatedPlan) {
			this.#store.dispatch(createRecoveryPlan({ recoveryPlan: this.generatedPlan }));
		}
	}

	buildPrompt(formValue: any): string {
		// Build the prompt for the AI
		return `Genera un plan de recuperación con los siguientes datos: ${JSON.stringify(formValue)}. Devuelve un JSON con la estructura del RecoveryPlan.`;
	}
}
