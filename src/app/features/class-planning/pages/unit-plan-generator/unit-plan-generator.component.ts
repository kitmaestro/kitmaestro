import { Component, inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { AiService } from '../../../../core/services/ai.service';
import { ClassSectionService } from '../../../../core/services/class-section.service';
import { UserSettingsService } from '../../../../core/services/user-settings.service';
import { UserSettings } from '../../../../core/interfaces/user-settings';
import { UnitPlan } from '../../../../core/interfaces/unit-plan';
import { UnitPlanService } from '../../../../core/services/unit-plan.service';
import { Router, RouterModule } from '@angular/router';
import { ClassSection } from '../../../../core/interfaces/class-section';
import { CompetenceService } from '../../../../core/services/competence.service';
import { CompetenceEntry } from '../../../../core/interfaces/competence-entry';
import { MainTheme } from '../../../../core/interfaces/main-theme';
import { MainThemeService } from '../../../../core/services/main-theme.service';
import {
	classroomProblems,
	classroomResources,
	generateActivitySequencePrompt,
	generateLearningSituationPrompt,
	generateStrategiesPrompt,
	mainThemeCategories,
	schoolEnvironments,
} from '../../../../config/constants';
import { forkJoin } from 'rxjs';
import { ContentBlockService } from '../../../../core/services/content-block.service';
import { ContentBlock } from '../../../../core/interfaces/content-block';
import { TEACHING_METHODS } from '../../../../core/data/teaching-methods';
import { PretifyPipe } from '../../../../shared/pipes/pretify.pipe';
import { UserSubscriptionService } from '../../../../core/services/user-subscription.service';

@Component({
	selector: 'app-unit-plan-generator',
	imports: [
		ReactiveFormsModule,
		MatSnackBarModule,
		MatCardModule,
		MatStepperModule,
		MatFormFieldModule,
		MatSelectModule,
		MatInputModule,
		MatButtonModule,
		MatIconModule,
		MatChipsModule,
		RouterModule,
		PretifyPipe,
	],
	templateUrl: './unit-plan-generator.component.html',
	styleUrl: './unit-plan-generator.component.scss',
})
export class UnitPlanGeneratorComponent implements OnInit {
	private aiService = inject(AiService);
	private mainThemeService = inject(MainThemeService);
	private fb = inject(FormBuilder);
	private sb = inject(MatSnackBar);
	private classSectionService = inject(ClassSectionService);
	private userSettingsService = inject(UserSettingsService);
	userSubscriptionService = inject(UserSubscriptionService);
	private contentBlockService = inject(ContentBlockService);
	private unitPlanService = inject(UnitPlanService);
	private competenceService = inject(CompetenceService);
	private router = inject(Router);
	private _evaluationCriteria: CompetenceEntry[] = [];
	working = true;

	userSettings: UserSettings | null = null;

	public mainThemeCategories = mainThemeCategories;
	public environments = schoolEnvironments;
	public problems = classroomProblems;
	public resources = classroomResources;

	classSections: ClassSection[] = [];

	generating = false;

	// TODO: start using this
	strategyOptions = [];

	learningSituationTitle = this.fb.control('');
	learningSituation = this.fb.control('');
	learningCriteria = this.fb.array<string[]>([]);
	strategies = this.fb.array<string[]>([]);
	teacher_activities: { subject: string; activities: string[] }[] = [];
	student_activities: { subject: string; activities: string[] }[] = [];
	evaluation_activities: { subject: string; activities: string[] }[] = [];
	instruments = this.fb.array<string[]>([]);
	resourceList = this.fb.array<string[]>([]);
	mainTheme = this.fb.control<string>('Salud y Bienestar');
	mainThemes: MainTheme[] = [];
	contentBlocks: ContentBlock[] = [];

	public teachingMethods = TEACHING_METHODS;

	plan: UnitPlan | null = null;

	situationTypes = [
		{ id: 'realityProblem', label: 'Problema Real' },
		{ id: 'reality', label: 'Basada en mi Realidad' },
		{ id: 'fiction', label: 'Ficticia' },
	];

	learningSituationForm = this.fb.group({
		classSection: [''],
		subjects: [[] as string[]],
		spanishContent: [''],
		mathContent: [[] as string[]],
		societyContent: [''],
		scienceContent: [[] as string[]],
		englishContent: [''],
		frenchContent: [''],
		religionContent: [[] as string[]],
		physicalEducationContent: [[] as string[]],
		artisticEducationContent: [[] as string[]],
		situationType: ['realityProblem'],
		reality: ['Falta de disciplina'],
		environment: ['Salón de clases'],
	});

	unitPlanForm = this.fb.group({
		duration: [4],
		teaching_method: ['Aprendizaje Basado en Competencias'],
		fundamentalCompetence: [
			[
				'Comunicativa',
				'Pensamiento Lógico, Creativo y Crítico; Resolución de Problemas; Ciencia y Tecnología',
				'Ética y Ciudadana; Personal y Espiritual; Ambiental y de Salud',
			],
		],
		specificCompetence: [[]],
		activities: this.fb.array([]),
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

	activitiesForm = this.fb.array([
		this.fb.group({
			bloomLevel: ['knowledge'],
			title: [''],
			description: [''],
		}),
	]);

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
				this.unitPlanService.findAll().subscribe((plans) => {
					const createdThisWeek = plans.filter(
						(plan: any) => +new Date(plan.createdAt) > +lastMonday,
					).length;
					this.classSectionService
						.findSections()
						.subscribe((sections) => {
							const subjects = sections
								.map(
									(section) =>
										section.subjects.filter(
											(s) => s !== 'TALLERES_OPTATIVOS',
										).length,
								)
								.reduce((l, c) => l + c, 0);
							if (
								subscription.subscriptionType === 'FREE' ||
								createdThisWeek === subjects
							) {
								this.router.navigateByUrl('/').then(() => {
									this.sb.open(
										'Haz alcanzado el limite de planes de esta semana. Contrata el plan premium para eliminar las restricciones o vuelve la proxima semana.',
										'Ok',
										{ duration: 5000 },
									);
								});
							}
						});
				});
			});
		this.userSettingsService.getSettings().subscribe({
			next: (settings) => {
				this.userSettings = settings;
			},
		});
		const availableResourcesStr = localStorage.getItem(
			'available-resources',
		);
		if (availableResourcesStr) {
			const resources = JSON.parse(availableResourcesStr) as string[];
			this.unitPlanForm.get('resources')?.setValue(resources);
		}
		this.classSectionService.findSections().subscribe({
			next: (value) => {
				if (value.length) {
					this.classSections = value;
					this.learningSituationForm
						.get('classSection')
						?.setValue(value[0]._id || '');
					if (value[0].subjects.length === 1) {
						this.learningSituationForm
							.get('subjects')
							?.setValue([value[0].subjects[0]]);
						this.onSubjectSelect();
					}
				} else {
					this.sb.open(
						'Para usar esta herramienta, necesitas crear al menos una seccion.',
						'Ok',
					);
				}
			},
		});
	}

	onSectionSelect() {
		setTimeout(() => {
			const subjects = this.classSection?.subjects;
			if (subjects && subjects.length === 1) {
				this.learningSituationForm
					.get('subjects')
					?.setValue([subjects[0]]);
				this.onSubjectSelect();
			}
		});
	}

	onSubjectSelect() {
		setTimeout(() => {
			this.loadMainThemes();
		}, 0);
	}

	onResourceChange(event: any) {
		setTimeout(() => {
			const resources = JSON.stringify(event.value);
			localStorage.setItem('available-resources', resources);
		}, 0);
	}

	loadMainThemes() {
		if (!this.classSection) return;

		const { level, year } = this.classSection;
		const { subjects } = this.learningSituationForm.value as any;
		const category = this.mainTheme.value as string;
		forkJoin<MainTheme[][]>(
			subjects.map((subject: string) =>
				this.mainThemeService.findAll({
					level,
					year,
					subject,
					category,
				}),
			),
		).subscribe((result) => {
			this.mainThemes = result.flat();
		});
		forkJoin<ContentBlock[][]>(
			subjects.map((subject: string) =>
				this.contentBlockService.findAll({ level, year, subject }),
			),
		).subscribe((result) => {
			this.contentBlocks = result
				.flat()
				.sort((a, b) => a.order - b.order);
		});
	}

	getSelectedContentsId() {
		const {
			spanishContent,
			mathContent,
			frenchContent,
			englishContent,
			scienceContent,
			societyContent,
			religionContent,
			artisticEducationContent,
			physicalEducationContent,
		} = this.learningSituationForm.value;
		const selected = [
			spanishContent,
			englishContent,
			frenchContent,
			societyContent,
			mathContent,
			scienceContent,
			religionContent,
			physicalEducationContent,
			artisticEducationContent,
		]
			.flat()
			.filter((s) => s?.length !== 0);
		return selected;
	}

	getSelectedContents() {
		const ids = this.getSelectedContentsId();
		const selected = this.contentBlocks.filter((b) => ids.includes(b._id));
		return selected;
	}

	generateActivities() {
		const { duration, resources } = this.unitPlanForm.value;

		const contents = this.getSelectedContents()
			.map((c) => {
				return `${this.pretifySubject(c.subject)}:\nConceptuales:\n- ${c.concepts.join('\n- ')}\n\nProcedimentales:\n- ${c.procedures.join('\n- ')}\n\nActitudinales:\n- ${c.attitudes.join('\n- ')}`;
			})
			.join('\n');

		const text = generateActivitySequencePrompt
			.replace('classroom_year', `${this.classSectionYear.toLowerCase()}`)
			.replace(
				'classroom_level',
				`${this.classSectionLevel.toLowerCase()}`,
			)
			.replace(
				'teaching_style',
				`${this.unitPlanForm.get('teaching_method')?.value}`,
			)
			.replace('unit_duration', `${duration}`)
			.replace('content_list', contents)
			.replace(
				'theme_axis',
				(this.mainTheme.value || 'Salud y Bienestar').toLowerCase(),
			)
			.replace('resource_list', (resources || []).join('\n- '))
			.replace('learning_situation', this.learningSituation.value || '')
			.replace(
				'subject_list',
				`${this.learningSituationForm.value.subjects?.map((s) => this.pretifySubject(s)).join(',\n- ')}`,
			)
			.replace(
				'subject_type',
				`${this.learningSituationForm.value.subjects?.map((s) => `'${s}'`).join(' | ')}`,
			)
			.replace(
				'subject_type',
				`${this.learningSituationForm.value.subjects?.map((s) => `'${s}'`).join(' | ')}`,
			)
			.replace(
				'subject_type',
				`${this.learningSituationForm.value.subjects?.map((s) => `'${s}'`).join(' | ')}`,
			);

		this.generating = true;

		this.aiService.geminiAi(text).subscribe({
			next: (response) => {
				try {
					this.generating = false;
					// const answer = response.candidates.map(c => c.content.parts.map(p => p.text).join('\n')).join('\n');
					const answer = response.response;
					const start = answer.indexOf('{');
					const end = answer.lastIndexOf('}') + 1;
					const extract = answer.slice(start, end);
					// const activities: { teacher_activities: { subject: string, activities: string[]}[], student_activities: { subject: string, activities: string[]}[], evaluation_activities: { subject: string, activities: string[]}[], instruments: string[], resources: string[] } = JSON.parse(response.response.slice(start, -3));
					const activities: {
						teacher_activities: {
							subject: string;
							activities: string[];
						}[];
						student_activities: {
							subject: string;
							activities: string[];
						}[];
						evaluation_activities: {
							subject: string;
							activities: string[];
						}[];
						instruments: string[];
						resources: string[];
					} = JSON.parse(extract);
					this.instruments.clear();
					this.resourceList.clear();
					this.teacher_activities = activities.teacher_activities;
					this.student_activities = activities.student_activities;
					this.evaluation_activities =
						activities.evaluation_activities;
					activities.instruments.forEach((list) => {
						this.instruments.push(this.fb.control(list));
					});
					activities.resources.forEach((resource) => {
						this.resourceList.push(this.fb.control(resource));
					});
				} catch (error) {
					console.log(error);
					this.generating = false;
					this.sb.open(
						'Ha ocurrido un error generando las actividades. Haz click en generar para intentarlo de nuevo.',
						'Ok',
						{ duration: 2500 },
					);
				}
			},
			error: (err) => {
				this.sb.open(
					'Hubo un error generando las actividades. Intentalo de nuevo',
					undefined,
					{ duration: 2500 },
				);
				console.log(err.message);
				this.generating = false;
			},
		});
	}

	fillFinalForm() {
		const plan: any = {
			user: this.userSettings?._id,
			section: this.classSection?._id,
			duration: this.unitPlanForm.value.duration || 4,
			learningSituation: this.learningSituation.value,
			title: this.learningSituationTitle.value,
			competence: this.competence.map((c) => c._id),
			mainThemeCategory: this.mainTheme.value,
			mainThemes: this.mainThemes.map((t) => t._id),
			subjects: this.learningSituationForm.value.subjects,
			strategies: this.strategies.value,
			contents: this.getSelectedContentsId(),
			resources: this.resourceList.value,
			instruments: this.instruments.value,
			teacherActivities: this.teacher_activities,
			studentActivities: this.student_activities,
			evaluationActivities: this.evaluation_activities,
		};
		this.plan = plan;
		this.savePlan();
	}

	savePlan() {
		if (this.plan) {
			this.unitPlanService.create(this.plan).subscribe({
				next: (plan) => {
					if (plan) {
						this.router
							.navigate(['/unit-plans', plan._id])
							.then(() => {
								this.sb.open(
									'Tu unidad de aprendizaje ha sido guardada!',
									'Ok',
									{ duration: 2500 },
								);
							});
					}
				},
			});
		}
	}

	generateLearningSituation() {
		const { environment, situationType, reality } =
			this.learningSituationForm.value;

		if (!environment || !reality || !situationType) return;

		const contents = this.getSelectedContents()
			.map((c) => {
				return `${this.pretifySubject(c.subject)}:\nConceptuales:\n- ${c.concepts.join('\n- ')}\n\nProcedimentales:\n- ${c.procedures.join('\n- ')}\n\nActitudinales:\n- ${c.attitudes.join('\n- ')}`;
			})
			.join('\n');
		this.competenceService.findAll().subscribe((competence) => {
			const subjects = this.learningSituationForm.value
				.subjects as string[];
			this._evaluationCriteria = competence.filter((c) => {
				return (
					c.grade === this.classSectionYear &&
					c.level === this.classSectionLevel &&
					subjects.includes(c.subject)
				);
			});
		});

		const text = generateLearningSituationPrompt
			.replace(
				'nivel_y_grado',
				`${this.classSectionYear.toLowerCase()} de ${this.classSectionLevel.toLowerCase()}`,
			)
			.replace('centro_educativo', this.classSection?.school.name || '')
			.replace(
				'nivel_y_grado',
				`${this.classSectionYear.toLowerCase()} de ${this.classSectionLevel.toLowerCase()}`,
			)
			.replace('section_name', this.classSectionName)
			.replace('ambiente_operativo', environment)
			.replace(
				'theme_axis',
				(this.mainTheme.value || 'Salud y Bienestar').toLowerCase(),
			)
			.replace(
				'situacion_o_problema',
				situationType === 'fiction'
					? 'situacion, problema o evento ficticio'
					: reality,
			)
			.replace(
				'condicion_inicial',
				'Los alumnos aun no saben nada sobre el tema',
			)
			.replace('contenido_especifico', contents);

		this.generating = true;

		this.aiService.geminiAi(text).subscribe({
			next: (res) => {
				this.generating = false;
				const { response } = res;
				const extract = response.slice(
					response.indexOf('{'),
					response.lastIndexOf('}') + 1,
				);
				const learningSituation: {
					title: string;
					content: string;
					learningCriteria: string[];
					strategies: string[];
				} = JSON.parse(extract);
				this.learningSituationTitle.setValue(learningSituation.title);
				this.learningSituation.setValue(learningSituation.content);
				this.strategies.clear();
				if (
					learningSituation.strategies &&
					learningSituation.strategies.length
				) {
					learningSituation.strategies.forEach((strategy) => {
						this.strategies.push(this.fb.control(strategy));
					});
				} else {
					const query = generateStrategiesPrompt
						.replace(
							'nivel_y_grado',
							`${this.classSectionYear.toLowerCase()} de educacion ${this.classSectionLevel.toLowerCase()}`,
						)
						.replace('situacion_de_ap', learningSituation.content)
						.replace(
							'theme_axis',
							(
								this.mainTheme.value || 'Salud y Bienestar'
							).toLowerCase(),
						)
						.replace('contenido_especifico', contents);
					this.aiService.geminiAi(query).subscribe({
						next: (response) => {
							console.log(response.response);
							const result: string[] = JSON.parse(
								response.response.slice(
									response.response.indexOf('['),
									response.response.lastIndexOf(']') + 1,
								),
							);
							result.forEach((strategy) => {
								this.strategies.push(this.fb.control(strategy));
							});
						},
					});
				}
			},
			error: (err) => {
				this.generating = false;
				this.sb.open(
					'Ha ocurrido un problema al generar la situacion. Intentalo de nuevo, por favor.',
					'Ok',
					{ duration: 2500 },
				);
				console.log(err.message);
			},
		});
	}

	formatedLevel(levelOrYear: string): string {
		return (
			(levelOrYear[0] || '').toUpperCase() +
			levelOrYear.toLowerCase().slice(1)
		).replace('_', ' ');
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

	get classSectionSubjects() {
		if (this.learningSituationForm.value.classSection) {
			return [];
		}
		return [];
	}

	get classSection() {
		const { classSection } = this.learningSituationForm.value;
		return this.classSections.find((s) => s._id === classSection) || null;
	}

	get classSectionSchoolName() {
		if (this.classSection) {
			return this.classSection.school.name;
		}
		return '';
	}

	get classSectionName() {
		if (this.classSection) {
			return this.classSection.name;
		}
		return '';
	}

	get classSectionYear() {
		if (this.classSection) {
			return this.classSection.year;
		}
		return '';
	}

	get classSectionLevel() {
		if (this.classSection) {
			return this.classSection.level;
		}
		return '';
	}

	get competence(): CompetenceEntry[] {
		return this._evaluationCriteria
			.filter((c) => {
				const { subjects } = this.learningSituationForm.value as any;
				return (
					c.grade === this.classSectionYear &&
					c.level === this.classSectionLevel &&
					subjects.includes(c.subject)
				);
			})
			.map((c) => ({
				...c,
				entries: [this.randomCompetence(c.entries)],
			}));
	}

	randomCompetence(categorized: string[]): string {
		const random = Math.round(Math.random() * (categorized.length - 1));
		return categorized[random];
	}

	randomCriteria(categorized: string[]): string {
		const random = Math.round(Math.random() * (categorized.length - 1));
		return categorized[random];
	}

	mainThemeByGrade(themes: {
		Primero: string[];
		Segundo: string[];
		Tercero: string[];
		Cuarto: string[];
		Quinto: string[];
		Sexto: string[];
	}): string {
		let random = 0;
		switch (this.yearIndex(this.classSectionYear)) {
			case 0:
				random = Math.round(
					Math.random() * (themes.Primero.length - 1),
				);
				return themes.Primero[random];
			case 1:
				random = Math.round(
					Math.random() * (themes.Segundo.length - 1),
				);
				return themes.Segundo[random];
			case 2:
				random = Math.round(
					Math.random() * (themes.Tercero.length - 1),
				);
				return themes.Tercero[random];
			case 3:
				random = Math.round(Math.random() * (themes.Cuarto.length - 1));
				return themes.Cuarto[random];
			case 4:
				random = Math.round(Math.random() * (themes.Quinto.length - 1));
				return themes.Quinto[random];
			case 5:
				random = Math.round(Math.random() * (themes.Sexto.length - 1));
				return themes.Sexto[random];
			default:
				return '';
		}
	}

	get subjectNames(): string[] {
		const formValue: any = this.learningSituationForm.value;
		return formValue.subjects.map((subject: string) =>
			this.pretifySubject(subject),
		);
	}

	removeDuplicates(strings: string[]): string[] {
		const seen = new Set<string>();

		return strings.filter((str) => {
			if (!seen.has(str)) {
				seen.add(str);
				return true;
			}
			return false;
		});
	}

	pretifySubject(subject: string) {
		if (subject === 'LENGUA_ESPANOLA') {
			return 'Lengua Española';
		}
		if (subject === 'MATEMATICA') {
			return 'Matemática';
		}
		if (subject === 'CIENCIAS_SOCIALES') {
			return 'Ciencias Sociales';
		}
		if (subject === 'CIENCIAS_NATURALES') {
			return 'Ciencias de la Naturaleza';
		}
		if (subject === 'INGLES') {
			return 'Inglés';
		}
		if (subject === 'FRANCES') {
			return 'Francés';
		}
		if (subject === 'FORMACION_HUMANA') {
			return 'Formación Integral Humana y Religiosa';
		}
		if (subject === 'EDUCACION_FISICA') {
			return 'Educación Física';
		}
		if (subject === 'EDUCACION_ARTISTICA') {
			return 'Educación Artística';
		}
		return 'Talleres Optativos';
	}

	get subjects(): { id: string; label: string }[] {
		const subjectsFromClassSection = this.classSection?.subjects;
		if (subjectsFromClassSection && subjectsFromClassSection.length) {
			return subjectsFromClassSection.map((sId) => ({
				id: sId,
				label: this.pretifySubject(sId),
			}));
		}
		return [];
	}
}
