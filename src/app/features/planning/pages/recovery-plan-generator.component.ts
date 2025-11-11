import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { UpperCasePipe } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { Subject } from 'rxjs';
import { PretifyPipe } from '../../../shared/pipes/pretify.pipe';
import { ClassSection, RecoveryPlan } from '../../../core/models';
import {
	askGemini,
	createRecoveryPlan,
	createRecoveryPlanSuccess,
	loadBlocks,
	loadEntries,
	selectAiIsGenerating,
	selectAiSerializedResult,
	selectAllCompetenceEntries,
	selectAllContentBlocks,
	selectAuthUser,
} from '../../../store';
import { loadSections } from '../../../store/class-sections/class-sections.actions';
import { selectAllClassSections } from '../../../store/class-sections/class-sections.selectors';
import { selectAllStudents } from '../../../store/students/students.selectors';
import { loadStudents } from '../../../store/students/students.actions';
import { RecoveryPlanComponent } from '../components/recovery-plan.component';
import { IsPremiumComponent } from '../../../shared';

@Component({
	selector: 'app-recovery-plan-generator',
	template: `
		<app-is-premium>
			<div style="display: flex; align-items: center; margin-bottom: 16px; margin-top: 16px; justify-content: space-between;">
				<h2>Generador de Planes de Recuperación</h2>
			</div>
			<div>
				<form [formGroup]="generatorForm" style="padding-top: 16px">
				<div class="cols-2">
					<mat-form-field appearance="outline">
					<mat-label>Sección</mat-label>
					<mat-select formControlName="classSection" required>
						@for (section of classSections(); track section._id) {
							<mat-option [value]="section._id">{{ section.name }}</mat-option>
						}
					</mat-select>
					</mat-form-field>

					<mat-form-field appearance="outline">
					<mat-label>Asignatura</mat-label>
					<mat-select formControlName="subject" required>
						@for(subject of subjects(); track subject) {
							<mat-option [value]="subject">{{ subject | pretify }}</mat-option>
						}
					</mat-select>
					</mat-form-field>

					<mat-form-field appearance="outline">
					<mat-label>Período</mat-label>
					<mat-select formControlName="period" required>
						@for(period of periods; track period) {
							<mat-option [value]="period">{{ period | uppercase }}</mat-option>
						}
					</mat-select>
					</mat-form-field>

					<mat-form-field appearance="outline">
					<mat-label>Estudiantes</mat-label>
					<mat-select formControlName="students" multiple required>
						@for(student of students(); track student._id) {
							<mat-option [value]="student._id">{{ student.firstname }} {{ student.lastname }}</mat-option>
						}
					</mat-select>
					</mat-form-field>
				</div>

				<div class="col-1">
					<mat-form-field appearance="outline">
						<mat-label>Tipo de Diagnóstico</mat-label>
						<mat-select formControlName="diagnosticType" required>
							@for(t of diagnosticTypes; track t) {
								<mat-option [value]="t">{{ t }}</mat-option>
							}
						</mat-select>
					</mat-form-field>

					@if (generatorForm.value.diagnosticType === 'Otra') {
						<mat-form-field appearance="outline">
							<mat-label>Diagnóstico Personalizado</mat-label>
							<textarea matInput formControlName="diagnostic"></textarea>
						</mat-form-field>
					}

					<mat-form-field appearance="outline">
						<mat-label>Contenidos Abordados</mat-label>
						<mat-select formControlName="contents" multiple>
							@for(c of contents(); track c) {
								<mat-option [value]="c">{{ c }}</mat-option>
							}
						</mat-select>
					</mat-form-field>

					<mat-form-field appearance="outline">
						<mat-label>Indicadores de Logro</mat-label>
						<mat-select formControlName="achievementIndicators" multiple>
							@for(c of competences(); track c) {
								@for(criterion of c.criteria; track criterion) {
									<mat-option [value]="criterion">{{ criterion }}</mat-option>
								}
							}
						</mat-select>
					</mat-form-field>

					<mat-form-field appearance="outline">
						<mat-label>Actores Involucrados</mat-label>
						<mat-select formControlName="actors" multiple>
							@for(actor of actors; track actor) {
								<mat-option [value]="actor">{{ actor }}</mat-option>
							}
						</mat-select>
					</mat-form-field>

					<mat-form-field appearance="outline">
						<mat-label>Notas Adicionales</mat-label>
						<textarea matInput formControlName="notes"></textarea>
					</mat-form-field>
				</div>

				<div style="text-align: end">
					<button mat-flat-button color="primary" type="button" [disabled]="!generatedPlan()" (click)="save()" style="margin-right: 12px;">
						Guardar
					</button>
					<button mat-button color="primary" type="submit" (click)="generate()" [disabled]="generatorForm.invalid || generating()">
						@if (!generating()) {
							<span>{{ generatedPlan() ? 'Regenerar' : 'Generar' }}</span>
						} @else {
							<span>Generando...</span>
						}
					</button>
				</div>
			</form>
		</div>

		@if (generatedPlan()) {
			<div>
				<app-recovery-plan [recoveryPlan]="generatedPlan()" />
			</div>
		}
	</app-is-premium>
	`,
	styles: `
		.cols-2 {
			display: grid;
			grid-template-columns: 1fr 1fr;
			gap: 16px;
		}
		
		.col-1 {
			display: grid;
			grid-template-columns: 1fr;
			gap: 16px;
		}
	`,
	standalone: true,
	imports: [
		ReactiveFormsModule,
		MatFormFieldModule,
		MatSelectModule,
		UpperCasePipe,
		MatInputModule,
		MatButtonModule,
		MatIconModule,
		MatChipsModule,
		PretifyPipe,
		RecoveryPlanComponent,
		IsPremiumComponent,
	],
})
export class RecoveryPlanGeneratorComponent implements OnInit {
	#fb = inject(FormBuilder);
	#store = inject(Store);
	#actions$ = inject(Actions);
	#router = inject(Router);
	#pretify = (new PretifyPipe()).transform;

	destroy$ = new Subject<void>();

	user = this.#store.selectSignal(selectAuthUser);
	students = this.#store.selectSignal(selectAllStudents);
	classSections = this.#store.selectSignal(selectAllClassSections);
	competences = this.#store.selectSignal(selectAllCompetenceEntries);
	contentBlocks = this.#store.selectSignal(selectAllContentBlocks);

	contents = computed(() => {
		return this.contentBlocks().map(cb => cb.concepts).flat() || []
	})

	selectedSection = signal<ClassSection | null>(null)
	
	subjects = computed(() => {
		const section = this.selectedSection();
		if (!section) return [];
		return section.subjects;
	})

	generating = this.#store.selectSignal(selectAiIsGenerating);
	aiResult = this.#store.selectSignal(selectAiSerializedResult);
	generatedPlan = signal<RecoveryPlan | null>(null);

	diagnosticTypes = [
		'Los estudiantes no lograron desarrollar las competencias necesarias',
		'Los estudiantes no presentaron algunas asignaciones',
		'Los estudiantes necesitan reforzar los temas',
		'Otra',
	];

	actors = ['Director/a', 'Coordinador/a Pedagógico/a', 'Padres', 'Asistente', 'Consejo de Curso'];

	periods = ['p1', 'p2', 'p3', 'p4'];

	generatorForm = this.#fb.group({
		classSection: [''],
		subject: [''],
		period: [''],
		diagnosticType: [''],
		diagnostic: [''],
		students: [[] as string[]],
		contents: [[] as string[]],
		achievementIndicators: [[] as string[]],
		actors: [[] as string[]],
		notes: [''],
	});

	constructor() {
		effect(() => {
			const result = this.aiResult();
			if (result) {
				const {
					period,
					actors,
					subject,
					students,
					achievementIndicators,
				} = this.generatorForm.getRawValue();
				this.generatedPlan.set({
					...result,
					user: this.user()?._id,
					section: this.selectedSection(),
					students: this.students().filter(s => students?.includes(s._id)),
					achievementIndicators,
					competence: this.competences(),
					subject,
					period,
					actors,
				});
			}
		})
	}

	ngOnInit(): void {
		this.#store.dispatch(loadSections());

		this.generatorForm.get('classSection')?.valueChanges.subscribe((section) => {
			if (section) {
				this.#store.dispatch(loadStudents({ filters: { section } }));
				this.selectedSection.set(this.classSections().find(s => s._id === section) || null);
				this.loadCompetences();
			}
		});

		this.generatorForm.get('subject')?.valueChanges.subscribe(() => {
			this.loadCompetences();
		});

		this.#actions$.pipe(ofType(createRecoveryPlanSuccess)).subscribe(({ recoveryPlan }) => {
			this.#router.navigate(['/planning/recovery-plans', recoveryPlan._id]);
		});
	}

	loadCompetences() {
		const section = this.selectedSection();
		const subject = this.generatorForm.get('subject')?.value;
		if (section && subject) {
			this.#store.dispatch(loadEntries({ filters: { level: section.level, grade: section.year, subject } }))
			this.#store.dispatch(loadBlocks({ filters: { level: section.level, year: section.year, subject } }))
		}
	}

	generate() {
		const formValue = this.generatorForm.value;
		const question = this.buildPrompt(formValue);
		this.#store.dispatch(askGemini({ question }));
	}

	save() {
		const recoveryPlan: any = this.generatedPlan();
		const students = this.students().filter(s => this.generatorForm.get('students')?.value?.includes(s._id)).map(s => s._id)
		const user = this.user();
		if (recoveryPlan && user) {
			recoveryPlan.students = students;
			recoveryPlan.user = user._id;
			recoveryPlan.section = this.selectedSection()?._id;
			recoveryPlan.competence = this.competences()?.map(c => c._id);
			recoveryPlan.period = recoveryPlan.period.toUpperCase();
			this.#store.dispatch(createRecoveryPlan({ recoveryPlan }));
		}
	}

	buildPrompt(formValue: any): string {
		const { period, diagnosticType, diagnostic, achievementIndicators, actors, contents, subject, notes, students } = formValue
		const competences = this.competences().map(c => `${c.name} - ${c.criteria.map(criterion => criterion).join(', ')}`).join('\n- ')
		const section = this.selectedSection()
		const user = this.user()
		const studentNames = this.students().filter(s => students.includes(s._id)).map(s => `${s.firstname} ${s.lastname}`).join(', ')
		const evaluatedPeriod = period == 'p1' ? 'Agosto-Octubre' : period == 'p2' ? 'Noviembre-Enero' : period == 'p3' ? 'Febrero-Marzo' : 'Abril-Junio';
		const startingDate = period == 'p1' ? 'Primera semana de noviembre' : period == 'p2' ? 'Primera semana de febrero' : period == 'p3' ? 'Primera semana de abril' : 'Primera semana de junio';
		const endingDate = period == 'p1' ? 'Última semana de noviembre' : period == 'p2' ? 'Última semana de febrero' : period == 'p3' ? 'Última semana de abril' : 'Segunda semana de junio';
		return `Necesito que generes un plan de recuperación en mi nombre, con los siguientes datos:
Curso: ${section?.name}, ${this.#pretify(section?.year || '')} de ${this.#pretify(section?.level || '')}
Asignatura: ${this.#pretify(subject)}
Periodo evaluado: ${evaluatedPeriod}
Razon de la recuperacion tras evaluaciones de periodo: ${diagnosticType === 'Otra' ? diagnostic : diagnosticType}
Contenidos: ${contents.join(', ')}
Indicadores de logro: ${achievementIndicators.join(', ')}
Estudiantes: ${studentNames}
Actores Involucrados En la recuperación (ademas de ${user?.gender == 'Hombre' ? 'el docente' : 'la docente'} y los propios estudiantes): ${actors.join(', ')}
${notes ? `Notas adicionales: ${notes}` : ''}
Competencias:
- ${competences}

Explicacion:
El mecanismo de recuperación por período unifica estos dos aspectos. El plan se diseña en base a los indicadores de logro (lo cualitativo), pero su resultado tiene un impacto numérico (cuantitativo). El propósito de la evaluación de recuperación no es reemplazar la calificación del período, sino completarla.
La práctica estandarizada, documentada en recursos de capacitación docente, establece que la evaluación de recuperación (un proyecto, una prueba, un informe, etc.) se valora con una cantidad de puntos (ej. "10, 15 y 20 puntos"). El resultado de esta evaluación "se sumará a las obtenidas" en el período.
El objetivo de esta suma es cuantitativo: que el estudiante "llegue por lo menos a 70 o pase de 70 a 79" puntos. Este rango de 70-79 corresponde a la "valoración de proceso", el mínimo requerido para aprobar el período. Por lo tanto, el plan de recuperación es una intervención quirúrgica diseñada para nivelar al estudiante y asegurar que alcance el umbral de 70 puntos.

Tu respuesta debe ser un JSON con esta estructura:
{
	startingDate: Date; (${startingDate})
	endingDate: Date; (${endingDate})
	diagnostic: string;
	justification: string;
	generalObjective: string;
	specificObjectives: string[];
	activities: {
		title: string;
		date: Date;
		activities: string[];
		estrategies: string[];
		resources: string[];
		formativeEvaluation: string;
	}[];
	evalutionInstruments: string[];
	successCriteria: string[];
}`;
	}
}
