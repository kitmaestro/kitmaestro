import { Component, inject, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ClassSectionService } from '../../../../core/services/class-section.service';
import { AiService } from '../../../../core/services/ai.service';
import { UserSettingsService } from '../../../../core/services/user-settings.service';
import { UserSettings } from '../../../../core/interfaces/user-settings';
import { PdfService } from '../../../../core/services/pdf.service';
import { MatChipsModule } from '@angular/material/chips';
import { ClassPlan } from '../../../../core/interfaces/class-plan';
import { ClassPlansService } from '../../../../core/services/class-plans.service';
import { Router, RouterModule } from '@angular/router';
import { CompetenceService } from '../../../../core/services/competence.service';
import { ClassSection } from '../../../../core/interfaces/class-section';
import { classPlanPrompt, classroomResources } from '../../../../config/constants';
import { CompetenceEntry } from '../../../../core/interfaces/competence-entry';
import { ClassPlanComponent } from '../class-plan/class-plan.component';
import { UserSubscriptionService } from '../../../../core/services/user-subscription.service';
import { PretifyPipe } from '../../../../shared/pipes/pretify.pipe';

@Component({
	selector: 'app-class-plan-generator',
	imports: [
		ReactiveFormsModule,
		MatFormFieldModule,
		MatSelectModule,
		MatSnackBarModule,
		MatButtonModule,
		MatIconModule,
		MatInputModule,
		MatCardModule,
		MatChipsModule,
		RouterModule,
		ClassPlanComponent,
	],
	templateUrl: './class-plan-generator.component.html',
	styleUrl: './class-plan-generator.component.scss',
})
export class ClassPlanGeneratorComponent implements OnInit {
	sb = inject(MatSnackBar);
	fb = inject(FormBuilder);
	classSectionService = inject(ClassSectionService);
	compService = inject(CompetenceService);
	aiService = inject(AiService);
	userSettingsService = inject(UserSettingsService);
	private userSubscriptionService = inject(UserSubscriptionService);
	pdfService = inject(PdfService);
	classPlanService = inject(ClassPlansService);
	router = inject(Router);
	datePipe = new DatePipe('en');

	todayDate = new Date(Date.now() - 4 * 60 * 60 * 1000)
		.toISOString()
		.split('T')[0];
	classSections: ClassSection[] = [];
	userSettings: UserSettings | null = null;
	subjects: string[] = [];
	generating = false;
	plan: ClassPlan | null = null;
	section: ClassSection | null = null;

	competence: CompetenceEntry[] = [];
	competenceString = '';

	bloomLevels = [
		{ id: 'knowledge', label: 'Recordar' },
		{ id: 'understanding', label: 'Aprender' },
		{ id: 'application', label: 'Aplicar' },
		{ id: 'analysis', label: 'Analizar' },
		{ id: 'evaluation', label: 'Evaluar' },
		{ id: 'creation', label: 'Crear' },
	];

	teachingStyles: { id: string; label: string }[] = [
		{ id: 'tradicional', label: 'Docente Tradicional' },
		{
			id: 'innovador (soy tradicional pero trato de innovar algunas pequeñas cosas como utilizar estrategias modernas)',
			label: 'Docente Innovador(a)',
		},
		{ id: 'dinámico', label: 'Docente Dinámico(a)' },
		{
			id: 'adaptado a la educacion 3.0',
			label: 'Docente 3.0 (Facilitador/a de procesos)',
		},
		{
			id: 'adaptado a la educacion 4.0',
			label: 'Docente 4.0 (Facilitador/a innovador)',
		},
	];

	resources = classroomResources;

	planForm = this.fb.group({
		classSection: ['', Validators.required],
		date: [this.todayDate, Validators.required],
		subject: ['', Validators.required],
		duration: [90, Validators.required],
		topics: ['', Validators.required],
		bloomLevel: ['knowledge', Validators.required],
		teachingStyle: ['tradicional'],
		resources: [
			[
				'Pizarra',
				'Libros de texto',
				'Cuadernos',
				'Lápices y bolígrafos',
				'Materiales de arte (papel, colores, pinceles)',
				'Cuadernos de ejercicios',
			],
		],
	});

	private planPrompt = classPlanPrompt;

	ngOnInit(): void {
		this.userSettingsService
			.getSettings()
			.subscribe((settings) => (this.userSettings = settings));
		this.userSubscriptionService
			.checkSubscription()
			.subscribe((subscription) => {
				if (
					subscription.subscriptionType
						.toLowerCase()
						.includes('premium')
				)
					return;
				// determine day of the week and date of last monday (or today) count plans made this week, subjects they have and calculate just 1 plan by subject a week
				const today = new Date();
				const dayOfTheWeek = today.getDay();
				const lastMonday =
					dayOfTheWeek === 1
						? today
						: new Date(
								today.setDate(
									today.getDate() - (7 - dayOfTheWeek),
								),
							);
				this.classPlanService.findAll().subscribe((plans) => {
					const createdThisWeek = plans.filter(
						(plan: any) => +new Date(plan.createdAt) > +lastMonday,
					).length;
					const createdThisMonth = plans.filter(
						(plan: any) =>
							+new Date(plan.createdAt).getMonth ===
							new Date().getMonth(),
					).length;
					if (
						(subscription.subscriptionType
							.toLowerCase()
							.includes('standard') &&
							createdThisWeek === 32) ||
						(subscription.subscriptionType === 'FREE' &&
							createdThisMonth === 5)
					) {
						this.router.navigateByUrl('/').then(() => {
							this.sb.open(
								'Haz alcanzado el limite de planes diarios de esta semana. Contrata el plan premium para eliminar las restricciones o vuelve la proxima semana.',
								'Ok',
								{ duration: 5000 },
							);
						});
					}
				});
			});
		const availableResourcesStr = localStorage.getItem(
			'available-resources',
		);
		if (availableResourcesStr) {
			const resources = JSON.parse(availableResourcesStr) as string[];
			this.planForm.get('resources')?.setValue(resources);
		}
		this.classSectionService.findSections().subscribe((sections) => {
			this.classSections = sections;
			if (sections.length) {
				this.planForm
					.get('classSection')
					?.setValue(sections[0]._id || '');
				this.onSectionSelect();
				if (sections[0].subjects.length === 1) {
					this.planForm
						.get('subject')
						?.setValue(sections[0].subjects[0]);
					this.onSubjectSelect();
				}
			}
		});
	}

	onSectionSelect() {
		setTimeout(() => {
			const sectionId = this.planForm.get('classSection')?.value;
			const section = this.classSections.find((s) => s._id === sectionId);
			if (section) {
				this.section = section;
				this.subjects = section.subjects;
			} else {
				this.section = null;
			}
		}, 0);
	}

	onResourceChange(event: any) {
		setTimeout(() => {
			const resources = JSON.stringify(event.value);
			localStorage.setItem('available-resources', resources);
		}, 0);
	}

	onSubjectSelect() {
		setTimeout(() => {
			if (this.section) {
				const { level, year } = this.section;
				const { subject } = this.planForm.value;
				if (!level || !year || !subject) return;
				this.compService
					.findAll({ subject, level, grade: year })
					.subscribe({
						next: (entries) => {
							this.competence = entries;
						},
					});
			}
		}, 0);
	}

	onSubmit() {
		if (this.planForm.valid) {
			const {
				classSection,
				subject,
				duration,
				bloomLevel,
				resources,
				teachingStyle,
				topics,
			} = this.planForm.value;

			const sectionLevel = this.classSections.find(
				(cs) => cs._id === classSection,
			)?.level;
			const sectionYear = this.classSections.find(
				(cs) => cs._id === classSection,
			)?.year;

			if (
				sectionLevel &&
				sectionYear &&
				subject &&
				duration &&
				topics &&
				resources &&
				this.competence
			) {
				this.generating = true;
				const competence_string = this.competence
					.map((c) => c.entries)
					.flat()
					.join('\n- ');
				const text = this.planPrompt
					.replace('class_subject', this.pretify(subject))
					.replace('class_duration', duration.toString())
					.replace(
						'class_topics',
						`${topics} (proceso cognitivo de la taxonomia de bloom: ${this.pretifyBloomLevel(bloomLevel || '')})`,
					)
					.replace('class_year', sectionYear)
					.replace('class_level', sectionLevel)
					.replace('teaching_style', teachingStyle || 'tradicional')
					.replace('plan_resources', resources.join(', '))
					.replace('plan_compentece', competence_string);

				this.aiService.geminiAi(text).subscribe({
					next: (response) => {
						this.generating = false;
						const date = this.planForm.value.date;
						const extract = response.response.slice(
							response.response.indexOf('{'),
							response.response.lastIndexOf('}') + 1,
						);
						console.log(extract);
						const plan: any = JSON.parse(extract);
						plan.user = this.userSettings?._id;
						plan.section = this.section?._id;
						plan.date = new Date(date ? date : this.todayDate);
						plan.subject = this.planForm.value.subject;
						this.plan = plan;
						if (sectionLevel === 'PRIMARIA') {
							if (sectionYear === 'PRIMERO') {
							} else if (sectionYear === 'SEGUNDO') {
							} else if (sectionYear === 'TERCERO') {
							} else if (sectionYear === 'CUARTO') {
							} else if (sectionYear === 'QUINTO') {
							} else {
							}
						} else {
						}
					},
					error: (error) => {
						this.sb.open(
							'Ha ocurrido un error generando tu plan: ' +
								error.message,
							undefined,
							{ duration: 5000 },
						);
					},
				});
			} else {
				this.sb.open(
					'Completa el formulario antes de proceder.',
					undefined,
					{ duration: 3000 },
				);
			}
		}
	}

	savePlan() {
		if (this.plan) {
			this.classPlanService.addPlan(this.plan).subscribe((saved) => {
				if (saved._id) {
					this.router
						.navigate(['/class-plans', saved._id])
						.then(() => {
							this.sb.open('Tu plan ha sido guardado!', 'Ok', {
								duration: 2500,
							});
						});
				}
			});
		}
	}

	downloadPlan() {}

	printPlan() {
		const date = this.datePipe.transform(
			this.planForm.value.date,
			'dd-MM-YYYY',
		);
		this.sb.open(
			'La descarga empezara en un instante. No quites esta pantalla hasta que finalicen las descargas.',
			'Ok',
			{ duration: 3000 },
		);
		this.pdfService.createAndDownloadFromHTML(
			'class-plan',
			`Plan de Clases de ${this.pretify(this.planForm.value.subject || '')} para ${this.classSectionName} - ${date}`,
			false,
		);
	}

	pretify(str: string) {
		return new PretifyPipe().transform(str);
	}

	yearIndex(year: string): number {
		return year === 'PRIMERO'
			? 0
			: year === 'SEGUNDO'
				? 1
				: year === 'TERCERO'
					? 2
					: year === 'CUARTO'
						? 3
						: year === 'QUINTO'
							? 4
							: 5;
	}

	randomCompetence(categorized: any): string {
		let random = 0;
		switch (this.yearIndex(this.classSectionYear)) {
			case 0:
				random = Math.round(
					Math.random() *
						(categorized.Primero.competenciasEspecificas.length -
							1),
				);
				return categorized.Primero.competenciasEspecificas[random];
			case 1:
				random = Math.round(
					Math.random() *
						(categorized.Segundo.competenciasEspecificas.length -
							1),
				);
				return categorized.Segundo.competenciasEspecificas[random];
			case 2:
				random = Math.round(
					Math.random() *
						(categorized.Tercero.competenciasEspecificas.length -
							1),
				);
				return categorized.Tercero.competenciasEspecificas[random];
			case 3:
				random = Math.round(
					Math.random() *
						(categorized.Cuarto.competenciasEspecificas.length - 1),
				);
				return categorized.Cuarto.competenciasEspecificas[random];
			case 4:
				random = Math.round(
					Math.random() *
						(categorized.Quinto.competenciasEspecificas.length - 1),
				);
				return categorized.Quinto.competenciasEspecificas[random];
			case 5:
				random = Math.round(
					Math.random() *
						(categorized.Sexto.competenciasEspecificas.length - 1),
				);
				return categorized.Sexto.competenciasEspecificas[random];
			default:
				return '';
		}
	}

	pretifyBloomLevel(level: string) {
		if (level === 'knowledge') return 'Recordar';
		if (level === 'understanding') return 'Comprender';
		if (level === 'application') return 'Aplicar';
		if (level === 'analysis') return 'Analizar';
		if (level === 'evaluation') return 'Evaluar';

		return 'Crear';
	}

	get sectionSubjects() {
		const subjects = this.classSections.find(
			(s) => s._id === this.planForm.get('classSection')?.value,
		)?.subjects as any as string[];
		if (subjects && subjects.length) {
			return subjects;
		}
		return [];
	}

	get classSectionName() {
		const name = this.classSections.find(
			(s) => s._id === this.planForm.get('classSection')?.value,
		)?.name;
		if (name) {
			return name;
		}
		return '';
	}

	get classSectionLevel() {
		const level = this.classSections.find(
			(s) => s._id === this.planForm.get('classSection')?.value,
		)?.level;
		if (level) {
			return level;
		}
		return '';
	}

	get classSectionYear() {
		const year = this.classSections.find(
			(s) => s._id === this.planForm.get('classSection')?.value,
		)?.year;
		if (year) {
			return year;
		}
		return '';
	}
}
