import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AiService } from '../../../core/services/ai.service';
import { UserService } from '../../../core/services/user.service';
import { ReadingActivityService } from '../../../core/services/reading-activity.service';
import { User } from '../../../core/interfaces';
import { ClassSectionService } from '../../../core/services/class-section.service';
import { ClassSection } from '../../../core/interfaces/class-section';
import { PretifyPipe } from '../../../shared/pipes/pretify.pipe';
import { Router, RouterModule } from '@angular/router';
import { IsPremiumComponent } from '../../../shared/ui/is-premium.component';
import { NgIf } from '@angular/common';

@Component({
	selector: 'app-reading-activity-generator',
	imports: [
		MatCardModule,
		MatButtonModule,
		MatIconModule,
		ReactiveFormsModule,
		MatSelectModule,
		MatInputModule,
		MatFormFieldModule,
		MatSnackBarModule,
		RouterModule,
		NgIf,
		IsPremiumComponent,
	],
	templateUrl: './reading-activity-generator.component.html',
	styleUrl: './reading-activity-generator.component.scss',
})
export class ReadingActivityGeneratorComponent implements OnInit {
	private fb = inject(FormBuilder);
	private sb = inject(MatSnackBar);
	private aiService = inject(AiService);
	private router = inject(Router);
	private UserService = inject(UserService);
	private acitivtyService = inject(ReadingActivityService);
	private classSectionService = inject(ClassSectionService);

	public User$ = this.UserService.getSettings();
	public user: User | null = null;
	public sections: ClassSection[] = [];
	public section: ClassSection | null = null;

	generating = false;

	saved = false;

	text: {
		textTitle: string;
		textContent: string;
		questions: string[];
		answers: string[];
	} | null = null;

	bloomLevels = [
		'Recordar',
		'Comprender',
		'Aplicar',
		'Analizar',
		'Evaluar',
		'Crear',
	];

	activityForm = this.fb.group({
		section: ['', Validators.required],
		level: ['Recordar'],
		questions: [5, [Validators.min(1), Validators.max(15)]],
	});

	ngOnInit() {
		this.UserService
			.getSettings()
			.subscribe((user) => (this.user = user));
		this.classSectionService.findSections().subscribe({
			next: (sections) => {
				this.sections = sections;
			},
		});
	}

	onSectionSelect(event: any) {
		const id: string = event.value;
		const section = this.sections.find((s) => s._id === id);
		if (section) {
			this.section = section;
		}
	}

	onSubmit() {
		this.generateActivity(this.activityForm.value);
	}

	pretify(str: string) {
		return new PretifyPipe().transform(str);
	}

	generateActivity(form: any) {
		const section = this.sections.find(
			(section) => section._id === form.section,
		);
		if (!section) return;
		const text = `Escribe un texto de un nivel adecuado para alumnos de ${this.pretify(section.year)} grado de ${this.pretify(section.level)} y ${form.questions} preguntas de comprensión lectora adecuadas para trabajar/evaluar el proceso cognitivo de ${form.level.toLowerCase()}. Responde con formato JSON valido con esta interfaz:
{
    "textTitle": string;
    "textContent": string;
    "questions": string[];
    "answers": string[];
}`;
		this.generating = true;
		this.aiService.geminiAi(text).subscribe({
			next: (response) => {
				try {
					const text = JSON.parse(
						response.response.slice(
							response.response.indexOf('{'),
							response.response.lastIndexOf('}') + 1,
						),
					);
					if (text) {
						this.text = text;
						this.saved = false;
					}
				} catch (error) {
					this.sb.open(
						'Ocurrió un problema mientras se generaba la actividad. Inténtalo de nuevo.',
						'Ok',
						{ duration: 2500 },
					);
				}
				this.generating = false;
			},
			error: (error) => {
				this.sb.open(
					'Ocurrió un problema mientras se generaba la actividad. Inténtalo de nuevo.',
					'Ok',
					{ duration: 2500 },
				);
				this.generating = false;
			},
		});
	}

	save() {
		const { section, level } = this.activityForm.value;
		const activity: any = {
			user: this.user?._id,
			section,
			level,
			title: this.text?.textTitle,
			text: this.text?.textContent,
			questions: this.text?.questions,
			answers: this.text?.answers,
		};

		this.acitivtyService.create(activity).subscribe((result) => {
			if (result._id) {
				this.router.navigateByUrl('/guided-reading').then(() => {
					this.sb.open('La actividad ha sido guardada.', 'Ok', {
						duration: 2500,
					});
				});
			}
		});
	}

	get schoolYear(): string {
		const currentMonth = new Date().getMonth() + 1;
		const currentYear = new Date().getFullYear();
		if (currentMonth > 7) {
			return `${currentYear} - ${currentYear + 1}`;
		}
		return `${currentYear - 1} - ${currentYear}`;
	}
}
