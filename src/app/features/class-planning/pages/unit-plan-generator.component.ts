import { Component, inject, OnInit } from '@angular/core'
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar'
import { FormBuilder, ReactiveFormsModule } from '@angular/forms'
import { MatStepperModule } from '@angular/material/stepper'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatSelectModule } from '@angular/material/select'
import { MatInputModule } from '@angular/material/input'
import { MatChipsModule } from '@angular/material/chips'
import { AiService } from '../../../core/services/ai.service'
import { UnitPlan } from '../../../core/models'
import { Router, RouterModule } from '@angular/router'
import { CompetenceService } from '../../../core/services/competence.service'
import { CompetenceEntry } from '../../../core'
import { MainTheme } from '../../../core'
import { MainThemeService } from '../../../core/services/main-theme.service'
import {
	classroomProblems,
	classroomResources,
	generateActivitySequencePrompt,
	generateLearningSituationPrompt,
	generateStrategiesPrompt,
	mainThemeCategories,
	schoolEnvironments,
} from '../../../config/constants'
import { forkJoin, Subject, tap } from 'rxjs'
import { ContentBlockService } from '../../../core/services/content-block.service'
import { ContentBlock } from '../../../core'
import { TEACHING_METHODS } from '../../../core/data/teaching-methods'
import { PretifyPipe } from '../../../shared/pipes/pretify.pipe'
import { UserSubscriptionService } from '../../../core/services/user-subscription.service'
import { Store } from '@ngrx/store'
import { selectAuthUser } from '../../../store/auth/auth.selectors'
import { selectAllClassSections } from '../../../store/class-sections/class-sections.selectors'
import { loadSections } from '../../../store/class-sections/class-sections.actions'
import { createPlan, createPlanSuccess, selectAllUnitPlans } from '../../../store/unit-plans'
import { Actions, ofType } from '@ngrx/effects'

@Component({
	selector: 'app-unit-plan-generator',
	imports: [
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
	],
	template: `
		<div style="display: flex; align-items: center; margin-bottom: 16px; margin-top: 16px; justify-content: space-between;">
			<h2>
				Generador de Unidades de Aprendizaje
			</h2>
			<div>
				<button
					mat-button
					[routerLink]="['/planning', 'unit-plans', 'list']"
					color="accent"
				>
					Ver mis Planes
				</button>
			</div>
		</div>
		<div>
			<mat-stepper linear #stepper>
				<mat-step [stepControl]="learningSituationForm">
					<form
						[formGroup]="learningSituationForm"
						style="padding-top: 16px"
					>
						<ng-template matStepLabel
							>Situaci&oacute;n de Aprendizaje</ng-template
						>
						<div class="cols-2">
							<mat-form-field appearance="outline">
								<mat-label>Eje Transversal</mat-label>
								<mat-select [formControl]="mainTheme" required>
									@for (
										theme of mainThemeCategories;
										track theme
									) {
										<mat-option [value]="theme">{{
											theme
										}}</mat-option>
									}
								</mat-select>
							</mat-form-field>
							<mat-form-field appearance="outline">
								<mat-label>Ambiente Operativo</mat-label>
								<mat-select formControlName="environment" required>
									@for (env of environments; track $index) {
										<mat-option [value]="env">{{
											env
										}}</mat-option>
									}
								</mat-select>
							</mat-form-field>
							<mat-form-field appearance="outline">
								<mat-label>Grado</mat-label>
								<mat-select
									formControlName="classSection"
									required
									(selectionChange)="onSectionSelect()"
								>
									@for (
										section of classSections();
										track section._id
									) {
										<mat-option [value]="section._id">{{
											section.name
										}}</mat-option>
									}
								</mat-select>
							</mat-form-field>
							<mat-form-field appearance="outline">
								<mat-label>Asignatura(s)</mat-label>
								<mat-select
									formControlName="subjects"
									required
									multiple
									(selectionChange)="onSubjectSelect()"
								>
									@for (subject of subjects; track $index) {
										@if (subject.id !== "TALLERES_OPTATIVOS") {
											<mat-option [value]="subject.id">{{
												subject.label
											}}</mat-option>
										}
									}
								</mat-select>
							</mat-form-field>
						</div>
						@if (
							learningSituationForm.value.subjects?.includes(
								"LENGUA_ESPANOLA"
							)
						) {
							<mat-form-field appearance="outline">
								<mat-label>Contenidos de Lengua Española</mat-label>
								<mat-select
									formControlName="spanishContent"
									required
								>
									@for (
										content of contentBlocks;
										track content._id
									) {
										@if (
											content.subject === "LENGUA_ESPANOLA"
										) {
											<mat-option [value]="content._id">{{
												content.title
											}}</mat-option>
										}
									}
								</mat-select>
							</mat-form-field>
						}
						@if (
							learningSituationForm.value.subjects?.includes(
								"MATEMATICA"
							)
						) {
							<mat-form-field appearance="outline">
								<mat-label>Contenidos de Matemática</mat-label>
								<mat-select
									multiple
									formControlName="mathContent"
									required
								>
									@for (
										content of contentBlocks;
										track content._id
									) {
										@if (content.subject === "MATEMATICA") {
											<mat-option [value]="content._id">{{
												content.title
											}}</mat-option>
										}
									}
								</mat-select>
							</mat-form-field>
						}
						@if (
							learningSituationForm.value.subjects?.includes(
								"CIENCIAS_SOCIALES"
							)
						) {
							<mat-form-field appearance="outline">
								<mat-label
									>Contenidos de Ciencias Sociales</mat-label
								>
								<mat-select
									formControlName="societyContent"
									multiple
									required
								>
									@for (
										content of contentBlocks;
										track content._id
									) {
										@if (
											content.subject === "CIENCIAS_SOCIALES"
										) {
											<mat-option [value]="content._id">{{
												content.title
											}}</mat-option>
										}
									}
								</mat-select>
							</mat-form-field>
						}
						@if (
							learningSituationForm.value.subjects?.includes(
								"CIENCIAS_NATURALES"
							)
						) {
							<mat-form-field appearance="outline">
								<mat-label
									>Contenidos de Ciencias de la
									Naturaleza</mat-label
								>
								<mat-select
									multiple
									formControlName="scienceContent"
									required
								>
									@for (
										content of contentBlocks;
										track content._id
									) {
										@if (
											content.subject === "CIENCIAS_NATURALES"
										) {
											<mat-option [value]="content._id">{{
												content.title
											}}</mat-option>
										}
									}
								</mat-select>
							</mat-form-field>
						}
						@if (
							learningSituationForm.value.subjects?.includes("INGLES")
						) {
							<mat-form-field appearance="outline">
								<mat-label>Contenidos de Inglés</mat-label>
								<mat-select
									formControlName="englishContent"
									required
								>
									@for (
										content of contentBlocks;
										track content._id
									) {
										@if (content.subject === "INGLES") {
											<mat-option [value]="content._id">{{
												content.title
											}}</mat-option>
										}
									}
								</mat-select>
							</mat-form-field>
						}
						@if (
							learningSituationForm.value.subjects?.includes(
								"FRANCES"
							)
						) {
							<mat-form-field appearance="outline">
								<mat-label>Contenidos de Francés</mat-label>
								<mat-select
									formControlName="frenchContent"
									required
								>
									@for (
										content of contentBlocks;
										track content._id
									) {
										@if (content.subject === "FRANCES") {
											<mat-option [value]="content._id">{{
												content.title
											}}</mat-option>
										}
									}
								</mat-select>
							</mat-form-field>
						}
						@if (
							learningSituationForm.value.subjects?.includes(
								"FORMACION_HUMANA"
							)
						) {
							<mat-form-field appearance="outline">
								<mat-label
									>Contenidos de Formación Integral Humana y
									Religiosa</mat-label
								>
								<mat-select
									multiple
									formControlName="religionContent"
									required
								>
									@for (
										content of contentBlocks;
										track content._id
									) {
										@if (
											content.subject === "FORMACION_HUMANA"
										) {
											<mat-option [value]="content._id">{{
												content.title
											}}</mat-option>
										}
									}
								</mat-select>
							</mat-form-field>
						}
						@if (
							learningSituationForm.value.subjects?.includes(
								"EDUCACION_FISICA"
							)
						) {
							<mat-form-field appearance="outline">
								<mat-label
									>Contenidos de Educación Física</mat-label
								>
								<mat-select
									multiple
									formControlName="physicalEducationContent"
									required
								>
									@for (
										content of contentBlocks;
										track content._id
									) {
										@if (
											content.subject === "EDUCACION_FISICA"
										) {
											<mat-option [value]="content._id">{{
												content.title
											}}</mat-option>
										}
									}
								</mat-select>
							</mat-form-field>
						}
						@if (
							learningSituationForm.value.subjects?.includes(
								"EDUCACION_ARTISTICA"
							)
						) {
							<mat-form-field appearance="outline">
								<mat-label
									>Contenidos de Educación Artística</mat-label
								>
								<mat-select
									multiple
									formControlName="artisticEducationContent"
									required
								>
									@for (
										content of contentBlocks;
										track content._id
									) {
										@if (
											content.subject ===
											"EDUCACION_ARTISTICA"
										) {
											<mat-option [value]="content._id">{{
												content.title
											}}</mat-option>
										}
									}
								</mat-select>
							</mat-form-field>
						}
						<div class="flex-on-md">
							<div style="flex: 1 1 auto">
								<mat-form-field appearance="outline">
									<mat-label>Tipo de Situaci&oacute;n</mat-label>
									<mat-select
										formControlName="situationType"
										required
									>
										@for (
											type of situationTypes;
											track $index
										) {
											<mat-option [value]="type.id">{{
												type.label
											}}</mat-option>
										}
									</mat-select>
								</mat-form-field>
							</div>
							@if (
								learningSituationForm.value.situationType ===
								"realityProblem"
							) {
								<div style="flex: 1 1 auto">
									<mat-form-field appearance="outline">
										<mat-label>Problema a Abordar</mat-label>
										<mat-select
											formControlName="reality"
											required
										>
											@for (
												problem of problems;
												track $index
											) {
												<mat-option [value]="problem">{{
													problem
												}}</mat-option>
											}
										</mat-select>
									</mat-form-field>
								</div>
							}
							@if (
								learningSituationForm.value.situationType ===
								"reality"
							) {
								<div style="flex: 1 1 auto">
									<mat-form-field appearance="outline">
										<mat-label>Realidad del Curso</mat-label>
										<input
											matInput
											type="text"
											formControlName="reality"
											required
										/>
									</mat-form-field>
								</div>
							}
						</div>
						@if (learningSituation.value) {
							<div style="margin-top: 16px; margin-bottom: 16px">
								<h3 style="font-weight: bold">
									Situaci&oacute;n de Aprendizaje:
									{{ learningSituationTitle.value }}
								</h3>
								<mat-form-field appearance="outline">
									<mat-label>T&iacute;tulo</mat-label>
									<input
										type="text"
										matInput
										[formControl]="learningSituationTitle"
									/>
								</mat-form-field>
								<mat-form-field appearance="outline">
									<mat-label
										>Situaci&oacute;n de Aprendizaje</mat-label
									>
									<textarea
										rows="8"
										[formControl]="learningSituation"
										matInput
									></textarea>
								</mat-form-field>
							</div>
						}
						<div style="text-align: end">
							<button
								[disabled]="generating"
								mat-button
								type="button"
								color="accent"
								(click)="generateLearningSituation()"
							>
								@if (generating) {
									<span>Generando...</span>
								} @else {
									@if (learningSituation.value) {
										<span>Regenerar</span>
									} @else {
										<span>Generar</span>
									}
								}
							</button>
							@if (learningSituation.value) {
								<button
									style="margin-left: 8px"
									mat-flat-button
									matStepperNext
								>
									Siguiente
								</button>
							}
						</div>
					</form>
				</mat-step>
				<mat-step [stepControl]="unitPlanForm">
					<form [formGroup]="unitPlanForm">
						<ng-template matStepLabel>Delimitaci&oacute;n</ng-template>
						<div style="padding-top: 16px">
							<div>
								<mat-form-field appearance="outline">
									<mat-label>Duraci&oacute;n</mat-label>
									<mat-select formControlName="duration" required>
										@for (
											n of [].constructor(6);
											track $index
										) {
											<mat-option [value]="$index + 1"
												>{{ $index + 1 }} Semana{{
													$index > 0 ? "s" : ""
												}}</mat-option
											>
										}
									</mat-select>
								</mat-form-field>
							</div>
							<div>
								<mat-form-field appearance="outline">
									<mat-label
										>Metodolog&iacute;a Principal</mat-label
									>
									<mat-select
										formControlName="teaching_method"
										required
									>
										@for (
											method of teachingMethods;
											track $index
										) {
											<mat-option [value]="method.name">{{
												method.name
											}}</mat-option>
										}
									</mat-select>
								</mat-form-field>
							</div>
							<div style="margin-bottom: 16px">
								<mat-label>Recursos Disponibles</mat-label>
								<mat-chip-listbox
									formControlName="resources"
									multiple
									(selectionChange)="onResourceChange($event)"
								>
									@for (resource of resources; track resource) {
										<mat-chip-option>{{
											resource
										}}</mat-chip-option>
									}
								</mat-chip-listbox>
							</div>
						</div>
						<div style="text-align: end">
							<button mat-button matStepperPrevious>
								Anterior
							</button>
							<button
								style="margin-left: 8px"
								mat-flat-button
								(click)="generateActivities()"
								matStepperNext
							>
								Siguiente
							</button>
						</div>
					</form>
				</mat-step>
				<mat-step [stepControl]="activitiesForm">
					<ng-template matStepLabel
						>Secuencia Did&aacute;ctica</ng-template
					>
					<div style="padding-top: 16px">
						@if (teacher_activities.length) {
							<div class="flex-on-md">
								<div style="flex: 1 1 auto; width: 100%">
									<h3>Actividades de Ense&ntilde;anza</h3>
									<ul
										style="
											margin: 0;
											padding: 0;
											list-style: none;
										"
									>
										@for (
											list of teacher_activities;
											track list.subject
										) {
											@if (student_activities.length === 1) {
												@for (
													activity of list.activities;
													track activity
												) {
													<li>{{ activity }}</li>
												}
											} @else {
												<h4 class="bold">
													{{ list.subject | pretify }}
												</h4>
												<ul>
													@for (
														activity of list.activities;
														track activity
													) {
														<li>{{ activity }}</li>
													}
												</ul>
											}
										}
									</ul>
								</div>
								<div style="flex: 1 1 auto; width: 100%">
									<h3>Actividades de Aprendizaje</h3>
									<ul
										style="
											margin: 0;
											padding: 0;
											list-style: none;
										"
									>
										@for (
											list of student_activities;
											track list.subject
										) {
											@if (student_activities.length === 1) {
												@for (
													activity of list.activities;
													track activity
												) {
													<li>{{ activity }}</li>
												}
											} @else {
												<h4 class="bold">
													{{ list.subject | pretify }}
												</h4>
												<ul>
													@for (
														activity of list.activities;
														track activity
													) {
														<li>{{ activity }}</li>
													}
												</ul>
											}
										}
									</ul>
								</div>
								<div style="flex: 1 1 auto; width: 100%">
									<h3>Actividades de Evaluaci&oacute;n</h3>
									<ul
										style="
											margin: 0;
											padding: 0;
											list-style: none;
										"
									>
										@for (
											list of evaluation_activities;
											track list.subject
										) {
											@if (student_activities.length === 1) {
												@for (
													activity of list.activities;
													track activity
												) {
													<li>{{ activity }}</li>
												}
											} @else {
												<h4 class="bold">
													{{ list.subject | pretify }}
												</h4>
												<ul>
													@for (
														activity of list.activities;
														track activity
													) {
														<li>{{ activity }}</li>
													}
												</ul>
											}
										}
									</ul>
								</div>
							</div>
						}
					</div>
					<div style="text-align: end">
						<button mat-button matStepperPrevious>
							Anterior
						</button>
						<button
							[disabled]="generating"
							style="margin-left: 8px"
							mat-button
							type="button"
							color="accent"
							(click)="generateActivities()"
						>
							@if (generating) {
								<span>Generando...</span>
							} @else {
								@if (teacher_activities.length) {
									<span>Regenerar</span>
								} @else {
									<span>Generar</span>
								}
							}
						</button>
						@if (teacher_activities.length) {
							<!-- <button style="margin-left: 8px;" mat-raised-button matStepperNext (click)="fillFinalForm()">Siguiente</button> -->
							<button
								style="margin-left: 8px"
								color="primary"
								mat-flat-button
								(click)="fillFinalForm()"
								type="button"
							>
								Guardar
							</button>
						}
					</div>
				</mat-step>
			</mat-stepper>
		</div>
	`,
	styles: `
		mat-form-field {
			width: 100%;
		}

		td,
		th {
			border: 1px solid #ccc;
			padding: 8px;
		}

		td {
			vertical-align: top;
		}

		th {
			font-weight: bold;
			text-align: center;
		}

		.cols-2 {
			display: grid;
			row-gap: 6px;
			column-gap: 16px;
			margin-bottom: 8px;
			grid-template-columns: 1fr;

			@media screen and (min-width: 960px) {
				grid-template-columns: repeat(2, 1fr);
			}
		}

		.flex-on-md {
			display: block;

			@media screen and (min-width: 960px) {
				display: flex;
				gap: 16px;
				margin-top: 16px;
			}
		}

		@media screen and (max-width: 959px) {
			h2.title {
				display: block;
				width: 100%;
				margin-bottom: 12px;
			}

			.title-button {
				display: block;
				width: 100%;
				margin-bottom: 24px;
			}

			.header {
				display: block;
			}
		}

		.title-button {
			margin-left: auto;
		}
	`,
})
export class UnitPlanGeneratorComponent implements OnInit {
	#store = inject(Store)
	#actions$ = inject(Actions)
	private aiService = inject(AiService);
	private mainThemeService = inject(MainThemeService);
	private fb = inject(FormBuilder);
	private sb = inject(MatSnackBar);
	userSubscriptionService = inject(UserSubscriptionService);
	private contentBlockService = inject(ContentBlockService);
	private competenceService = inject(CompetenceService);
	private router = inject(Router);
	private _evaluationCriteria: CompetenceEntry[] = [];

	pretify = new PretifyPipe().transform;
	working = true;

	user = this.#store.selectSignal(selectAuthUser)

	public mainThemeCategories = mainThemeCategories;
	public environments = schoolEnvironments;
	public problems = classroomProblems;
	public resources = classroomResources;

	classSections = this.#store.selectSignal(selectAllClassSections)

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

	destroy$ = new Subject<void>();

	ngOnDestroy() {
		this.destroy$.next();
		this.destroy$.complete();
	}

	ngOnInit(): void {
		this.#store.dispatch(loadSections())
		forkJoin({
			sections: this.#store.select(selectAllClassSections),
			subscription: this.userSubscriptionService.checkSubscription(),
			plans: this.#store.select(selectAllUnitPlans),
		})
		.subscribe({
			next: ({ sections, subscription, plans }) => {
				let maxPlans = 0;
				if (sections.length) {
					maxPlans = sections.flatMap((s) =>
						s.subjects.filter(
							(s) => s !== 'TALLERES_OPTATIVOS',
						),
					).length;
					this.learningSituationForm
						.get('classSection')
						?.setValue(sections[0]._id || '');
					if (sections[0].subjects.length === 1) {
						this.learningSituationForm
							.get('subjects')
							?.setValue([sections[0].subjects[0]]);
						this.onSubjectSelect();
					}
				} else {
					this.router.navigateByUrl('/sections').then(() => {
						this.sb.open(
							'Para poder planificar, primero tienes que crear una seccion',
							'Ok',
							{ duration: 5000 },
						);
					});
					return;
				}
				const sub = subscription.subscriptionType.toLowerCase();
				if (sub == 'plan premium') return;

				const createdThisMonth = plans.filter((plan: any) => {
					const created = new Date(plan.createdAt);
					const thirtyDaysAgo = new Date(
						Date.now() - 1000 * 60 * 60 * 24 * 30,
					);
					return +created > +thirtyDaysAgo;
				}).length;
				if (sub == 'free' && createdThisMonth > 0) {
					this.router
						.navigateByUrl('/planning/unit-plans/list')
						.then(() => {
							this.sb.open(
								'Ya has agotado tu limite de planes para este mes. Para continuar planificando, contrata un plan de pago.',
								'Ok',
								{ duration: 10000 },
							);
						});
					return;
				}
				if (sub == 'plan plus') maxPlans = maxPlans * 2;
				if (createdThisMonth >= maxPlans) {
					this.router.navigateByUrl('/').then(() => {
						this.sb.open(
							'Haz alcanzado el limite de planes de este mes. Mejora tu suscripcion para eliminar las restricciones o vuelve la proxima semana.',
							'Ok',
							{ duration: 5000 },
						);
					});
				}
			},
			error: (err) => {
				console.log(err);
			},
		});
		const availableResourcesStr = localStorage.getItem(
			'available-resources',
		);
		if (availableResourcesStr) {
			const resources = JSON.parse(availableResourcesStr) as string[];
			this.unitPlanForm.get('resources')?.setValue(resources);
		}
		this.#actions$.pipe(
			ofType(createPlanSuccess),
			tap(({ plan }) => {
				this.router
					.navigate(['/planning/unit-plans', plan._id])
					.then(() => {
						this.sb.open(
							'Tu unidad multigrado ha sido guardada!',
							'Ok',
							{ duration: 2500 },
						);
					});
			})
		).subscribe()
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
		const { subjects } = this.learningSituationForm.getRawValue() as any;
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
		const selected: string[] = [
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
			.map((s) => s?.trim())
			.filter((s) => s && s?.length > 0)
			.filter((s) => typeof s == 'string');
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
				return `${this.pretify(c.subject)}:\nConceptuales:\n- ${c.concepts.join('\n- ')}\n\nProcedimentales:\n- ${c.procedures.join('\n- ')}\n\nActitudinales:\n- ${c.attitudes.join('\n- ')}`;
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
				`${this.learningSituationForm.value.subjects?.map((s) => this.pretify(s)).join(',\n- ')}`,
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
		const user = this.user()
		const plan: any = {
			user: user?._id,
			section: this.classSection?._id,
			sections: [],
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
		const plan: any = this.plan
		if (plan) {
			this.#store.dispatch(createPlan({ plan }))
		}
	}

	generateLearningSituation(cb?: any) {
		const { environment, situationType, reality } =
			this.learningSituationForm.value;

		if (!environment || !reality || !situationType) return;

		const contents = this.getSelectedContents()
			.map((c) => {
				return `${this.pretify(c.subject)}:\nConceptuales:\n- ${c.concepts.join('\n- ')}\n\nProcedimentales:\n- ${c.procedures.join('\n- ')}\n\nActitudinales:\n- ${c.attitudes.join('\n- ')}`;
			})
			.join('\n');

		const text = generateLearningSituationPrompt
			.replace(
				'nivel_y_grado',
				`${this.classSectionYear.toLowerCase()} de ${this.classSectionLevel.toLowerCase()}`,
			)
			.replace('centro_educativo', this.user()?.schoolName || '')
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
				if (cb) {
					cb(learningSituation);
				}
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
		const { classSection: sectionId } = this.learningSituationForm.value
		const section = this.classSections().find(cs => cs._id == sectionId)
		return section || null
	}

	get classSectionSchoolName() {
		return this.user()?.schoolName || ''
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
			this.pretify(subject),
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

	get subjects(): { id: string; label: string }[] {
		const subjectsFromClassSection = this.classSection?.subjects;
		if (subjectsFromClassSection && subjectsFromClassSection.length) {
			return subjectsFromClassSection.map((sId) => ({
				id: sId,
				label: this.pretify(sId),
			}));
		}
		return [];
	}
}
