import { Component, inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { AiService } from '../../../core/services/ai.service';
import { ClassSectionService } from '../../../core/services/class-section.service';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../core';
import { UnitPlan } from '../../../core/models';
import { UnitPlanService } from '../../../core/services/unit-plan.service';
import { Router, RouterModule } from '@angular/router';
import { ClassSection } from '../../../core';
import { CompetenceService } from '../../../core/services/competence.service';
import { CompetenceEntry } from '../../../core';
import { MainTheme } from '../../../core';
import { MainThemeService } from '../../../core/services/main-theme.service';
import {
	classroomProblems,
	classroomResources,
	generateMultigradeActivitySequencePrompt,
	generateMultigradeLearningSituationPrompt,
	mainThemeCategories,
	schoolEnvironments,
} from '../../../config/constants';
import { forkJoin, takeUntil, tap } from 'rxjs';
import { ContentBlockService } from '../../../core/services/content-block.service';
import { ContentBlock } from '../../../core';
import { TEACHING_METHODS } from '../../../core/data/teaching-methods';
import { PretifyPipe } from '../../../shared/pipes/pretify.pipe';
import { CommonModule } from '@angular/common';
import { IsPremiumComponent } from '../../../shared/ui/is-premium.component';
import { createPlan, createPlanSuccess } from '../../../store/unit-plans';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';

@Component({
	selector: 'app-multigrade-unit-plan-generator',
	standalone: true,
	imports: [
		CommonModule,
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
		IsPremiumComponent,
		RouterModule,
	],
	template: `
		<app-is-premium>
			<mat-card>
				<mat-card-header class="header">
					<h2 class="title" mat-card-title>
						Generador de Unidades de Aprendizaje (Multigrado)
					</h2>
					<button
						class="title-button"
						mat-flat-button
						[routerLink]="['/unit-plans', 'list']"
						color="accent"
					>
						Ver mis Planes
					</button>
				</mat-card-header>
				<mat-card-content>
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
										<mat-select
											formControlName="mainThemeCategory"
											required
										>
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
										<mat-select
											formControlName="environment"
											required
										>
											@for (
												env of environments;
												track $index
											) {
												<mat-option [value]="env">{{
													env
												}}</mat-option>
											}
										</mat-select>
									</mat-form-field>
									<mat-form-field appearance="outline">
										<mat-label>Grados</mat-label>
										<mat-select
											formControlName="classSections"
											required
											multiple
											(selectionChange)="onSectionSelect()"
										>
											@for (
												section of allClassSections;
												track section._id
											) {
												<mat-option [value]="section._id">{{
													section.name
												}}</mat-option>
											}
										</mat-select>
									</mat-form-field>
									<mat-form-field appearance="outline">
										<mat-label>Asignatura Común</mat-label>
										<mat-select
											formControlName="subject"
											required
											(selectionChange)="onSubjectSelect()"
										>
											@for (
												subject of commonSubjects;
												track subject.id
											) {
												<mat-option [value]="subject.id">{{
													subject.label
												}}</mat-option>
											}
										</mat-select>
									</mat-form-field>
								</div>

								<!-- Dynamic Content Blocks per Grade -->
								@for (
									section of selectedClassSections;
									track section._id
								) {
									<div>
										<h4 class="bold">
											Contenidos para {{ section.name }}
										</h4>
										<mat-form-field appearance="outline">
											<mat-label
												>Seleccionar Contenidos</mat-label
											>
											<mat-select
												[formControlName]="
													'content_' + section._id
												"
												multiple
												required
											>
												@for (
													content of contentBlocksBySection.get(
														section._id
													);
													track content._id
												) {
													<mat-option
														[value]="content._id"
														>{{
															content.title
														}}</mat-option
													>
												}
											</mat-select>
										</mat-form-field>
									</div>
								}

								<div class="flex-on-md">
									<div style="flex: 1 1 auto">
										<mat-form-field appearance="outline">
											<mat-label
												>Tipo de Situaci&oacute;n</mat-label
											>
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
										learningSituationForm.value
											.situationType === 'realityProblem'
									) {
										<div style="flex: 1 1 auto">
											<mat-form-field appearance="outline">
												<mat-label
													>Problema a Abordar</mat-label
												>
												<mat-select
													formControlName="reality"
													required
												>
													@for (
														problem of problems;
														track $index
													) {
														<mat-option
															[value]="problem"
															>{{
																problem
															}}</mat-option
														>
													}
												</mat-select>
											</mat-form-field>
										</div>
									}
									@if (
										learningSituationForm.value
											.situationType === 'reality'
									) {
										<div style="flex: 1 1 auto">
											<mat-form-field appearance="outline">
												<mat-label
													>Realidad del Curso</mat-label
												>
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
									<div
										style="margin-top: 16px; margin-bottom: 16px"
									>
										<h3 style="font-weight: bold">
											Situaci&oacute;n de Aprendizaje:
											{{ learningSituationTitle.value }}
										</h3>
										<mat-form-field appearance="outline">
											<mat-label>T&iacute;tulo</mat-label>
											<input
												type="text"
												matInput
												[formControl]="
													learningSituationTitle
												"
											/>
										</mat-form-field>
										<mat-form-field appearance="outline">
											<mat-label
												>Situaci&oacute;n de
												Aprendizaje</mat-label
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
										mat-raised-button
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
											mat-raised-button
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
								<ng-template matStepLabel
									>Delimitaci&oacute;n</ng-template
								>
								<div style="padding-top: 16px">
									<div>
										<mat-form-field appearance="outline">
											<mat-label>Duraci&oacute;n</mat-label>
											<mat-select
												formControlName="duration"
												required
											>
												@for (
													n of [].constructor(6);
													track $index
												) {
													<mat-option [value]="$index + 1"
														>{{ $index + 1 }} Semana{{
															$index > 0 ? 's' : ''
														}}</mat-option
													>
												}
											</mat-select>
										</mat-form-field>
									</div>
									<div>
										<mat-form-field appearance="outline">
											<mat-label
												>Metodolog&iacute;a
												Principal</mat-label
											>
											<mat-select
												formControlName="teaching_method"
												required
											>
												@for (
													method of teachingMethods;
													track $index
												) {
													<mat-option
														[value]="method.name"
														>{{
															method.name
														}}</mat-option
													>
												}
											</mat-select>
										</mat-form-field>
									</div>
									<div style="margin-bottom: 16px">
										<mat-label>Recursos Disponibles</mat-label>
										<mat-chip-listbox
											formControlName="resources"
											multiple
											(selectionChange)="
												onResourceChange($event)
											"
										>
											@for (
												resource of resources;
												track resource
											) {
												<mat-chip-option>{{
													resource
												}}</mat-chip-option>
											}
										</mat-chip-listbox>
									</div>
								</div>
								<div style="text-align: end">
									<button mat-raised-button matStepperPrevious>
										Anterior
									</button>
									<button
										style="margin-left: 8px"
										mat-raised-button
										(click)="generateActivities()"
										matStepperNext
									>
										Siguiente
									</button>
								</div>
							</form>
						</mat-step>
						<mat-step>
							<ng-template matStepLabel
								>Secuencia Did&aacute;ctica</ng-template
							>
							<div style="padding-top: 16px">
								@if (activitiesByGrade.length) {
									@for (
										gradeActivities of activitiesByGrade;
										track gradeActivities.grade_level
									) {
										<div class="grade-activities-container">
											<h3>
												Actividades para
												{{ gradeActivities.grade_level }}
											</h3>
											<div class="flex-on-md">
												<div
													style="flex: 1 1 auto; width: 100%"
												>
													<h4>
														Actividades de
														Ense&ntilde;anza
													</h4>
													<ul>
														@for (
															activity of gradeActivities.teacher_activities;
															track activity
														) {
															<li>{{ activity }}</li>
														}
													</ul>
												</div>
												<div
													style="flex: 1 1 auto; width: 100%"
												>
													<h4>
														Actividades de Aprendizaje
													</h4>
													<ul>
														@for (
															activity of gradeActivities.student_activities;
															track activity
														) {
															<li>{{ activity }}</li>
														}
													</ul>
												</div>
												<div
													style="flex: 1 1 auto; width: 100%"
												>
													<h4>
														Actividades de
														Evaluaci&oacute;n
													</h4>
													<ul>
														@for (
															activity of gradeActivities.evaluation_activities;
															track activity
														) {
															<li>{{ activity }}</li>
														}
													</ul>
												</div>
											</div>
										</div>
									}
								}
							</div>
							<div style="text-align: end">
								<button mat-raised-button matStepperPrevious>
									Anterior
								</button>
								<button
									[disabled]="generating"
									style="margin-left: 8px"
									mat-raised-button
									type="button"
									color="accent"
									(click)="generateActivities()"
								>
									@if (generating) {
										<span>Generando...</span>
									} @else {
										@if (activitiesByGrade.length) {
											<span>Regenerar</span>
										} @else {
											<span>Generar</span>
										}
									}
								</button>
								@if (activitiesByGrade.length) {
									<button
										style="margin-left: 8px"
										color="primary"
										mat-raised-button
										(click)="fillFinalForm()"
										type="button"
									>
										Guardar
									</button>
								}
							</div>
						</mat-step>
					</mat-stepper>
				</mat-card-content>
			</mat-card>
		</app-is-premium>
	`,
	styles: [
		`
			mat-card-header.header {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 24px;
			}
			mat-form-field {
				width: 100%;
			}
			.cols-2 {
				display: grid;
				gap: 16px;
				grid-template-columns: 1fr;
			}
			@media screen and (min-width: 960px) {
				.cols-2 {
					grid-template-columns: repeat(2, 1fr);
				}
				.flex-on-md {
					display: flex;
					gap: 16px;
					margin-top: 16px;
				}
			}
			.grade-activities-container {
				border: 1px solid #e0e0e0;
				border-radius: 8px;
				padding: 16px;
				margin-bottom: 16px;
			}
			.bold {
				font-weight: bold;
			}
		`,
	],
})
export class MultigradeUnitPlanGeneratorComponent implements OnInit {
	private aiService = inject(AiService);
	#store = inject(Store)
	#actions$ = inject(Actions)
	private fb = inject(FormBuilder);
	private sb = inject(MatSnackBar);
	private classSectionService = inject(ClassSectionService);
	private UserService = inject(UserService);
	private contentBlockService = inject(ContentBlockService);
	private mainThemeService = inject(MainThemeService);
	private unitPlanService = inject(UnitPlanService);
	private competenceService = inject(CompetenceService);
	private router = inject(Router);

	generating = false;
	User: User | null = null;
	allClassSections: ClassSection[] = [];
	selectedClassSections: ClassSection[] = [];
	commonSubjects: { id: string; label: string }[] = [];
	contentBlocksBySection = new Map<string, ContentBlock[]>();
	competence = new Map<string, CompetenceEntry[]>();
	mainThemes = new Map<string, MainTheme[]>();

	public mainThemeCategories = mainThemeCategories;
	public environments = schoolEnvironments;
	public problems = classroomProblems;
	public resources = classroomResources;
	public teachingMethods = TEACHING_METHODS;
	public situationTypes = [
		{ id: 'realityProblem', label: 'Problema Real' },
		{ id: 'reality', label: 'Basada en mi Realidad' },
		{ id: 'fiction', label: 'Ficticia' },
	];

	learningSituationTitle = this.fb.control('');
	learningSituation = this.fb.control('');
	strategies = this.fb.array<string[]>([]);

	activitiesByGrade: {
		grade_level: string;
		teacher_activities: string[];
		student_activities: string[];
		evaluation_activities: string[];
	}[] = [];
	instruments: string[] = [];
	resourceList: string[] = [];

	plan: UnitPlan | null = null;

	learningSituationForm = this.fb.group({
		classSections: [[] as string[], Validators.required],
		subject: ['', Validators.required],
		mainThemeCategory: ['Salud y Bienestar', Validators.required],
		situationType: ['realityProblem', Validators.required],
		reality: ['Falta de disciplina', Validators.required],
		environment: ['Salón de clases', Validators.required],
	});

	unitPlanForm = this.fb.group({
		duration: [4, Validators.required],
		teaching_method: [
			'Aprendizaje Basado en Competencias',
			Validators.required,
		],
		resources: [['Pizarra', 'Libros de texto', 'Cuadernos']],
	});

	pretifyPipe = new PretifyPipe();

	ngOnInit(): void {
		this.UserService
			.getSettings()
			.subscribe((settings) => (this.User = settings));
		this.classSectionService.findSections().subscribe({
			next: (value) => {
				if (value.length) {
					this.allClassSections = value;
				} else {
					this.sb.open(
						'Para usar esta herramienta, necesitas crear al menos una sección.',
						'Ok',
					);
					this.router.navigate(['/']);
				}
			},
		});
		this.#actions$.pipe(
			ofType(createPlanSuccess),
			tap(({ plan }) => {
				this.router
					.navigate(['/unit-plans', plan._id])
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

	onSectionSelect(): void {
		const selectedIds =
			this.learningSituationForm.get('classSections')?.value || [];
		this.selectedClassSections = this.allClassSections.filter((s) =>
			selectedIds.includes(s._id),
		);

		// Remove old dynamic controls
		Object.keys(this.learningSituationForm.controls).forEach(
			(key: string) => {
				if (key.startsWith('content_')) {
					(this.learningSituationForm as any).removeControl(key);
				}
			},
		);

		// Add new dynamic controls
		this.selectedClassSections.forEach((section) => {
			this.learningSituationForm.addControl(
				('content_' + section._id) as any,
				this.fb.control([], Validators.required),
			);
		});

		this.calculateCommonSubjects();
		this.learningSituationForm.get('subject')?.reset();
		this.contentBlocksBySection.clear();
		this.onSubjectSelect();
	}

	calculateCommonSubjects(): void {
		if (this.selectedClassSections.length === 0) {
			this.commonSubjects = [];
			return;
		}

		const subjectSets = this.selectedClassSections.map(
			(section) => new Set(section.subjects),
		);
		const firstSet = subjectSets[0];
		const commonSubjectIds = [...firstSet].filter((subjectId) =>
			subjectSets.every((set) => set.has(subjectId)),
		);

		this.commonSubjects = commonSubjectIds.map((id) => ({
			id: id,
			label: this.pretifyPipe.transform(id),
		}));
	}

	onSubjectSelect(): void {
		this.loadContentBlocks();
	}

	loadContentBlocks(): void {
		const subject = this.learningSituationForm.get('subject')?.value;
		if (!subject || this.selectedClassSections.length === 0) return;

		const observables = this.selectedClassSections.map((section) => {
			return this.contentBlockService.findAll({
				level: section.level,
				year: section.year,
				subject,
			});
		});

		forkJoin(observables).subscribe((results) => {
			this.contentBlocksBySection.clear();
			results.forEach((blocks, index) => {
				const sectionId = this.selectedClassSections[index]._id;
				this.contentBlocksBySection.set(
					sectionId,
					blocks.sort((a, b) => a.order - b.order),
				);
			});
		});

		const competence$ = this.selectedClassSections.map((section) =>
			this.competenceService.findAll({
				level: section.level,
				grade: section.year,
				subject,
			}),
		);

		forkJoin(competence$).subscribe((results) => {
			this.contentBlocksBySection.clear();
			results.forEach((entries, index) => {
				const sectionId = this.selectedClassSections[index]._id;
				this.competence.set(sectionId, entries);
			});
		});

		const mainThemes$ = this.selectedClassSections.map((section) =>
			this.mainThemeService.findAll({
				level: section.level,
				year: section.year,
				subject,
			}),
		);

		forkJoin(mainThemes$).subscribe((results) => {
			this.contentBlocksBySection.clear();
			results.forEach((themes, index) => {
				const sectionId = this.selectedClassSections[index]._id;
				this.mainThemes.set(sectionId, themes);
			});
		});
	}

	onResourceChange(event: any) {
		localStorage.setItem(
			'available-resources',
			JSON.stringify(event.value),
		);
	}

	getSelectedContentsText(): string {
		const subject = this.learningSituationForm.get('subject')?.value;
		if (!subject) return '';

		return this.selectedClassSections
			.map((section) => {
				const contentIds =
					this.learningSituationForm.get('content_' + section._id)
						?.value || [];
				const contents =
					this.contentBlocksBySection
						.get(section._id)
						?.filter((cb) => contentIds.includes(cb._id)) || [];

				if (contents.length === 0)
					return `Para ${section.name}:\nNo se han seleccionado contenidos.`;

				const concepts = contents
					.flatMap((c) => c.concepts)
					.join('\n- ');
				const procedures = contents
					.flatMap((c) => c.procedures)
					.join('\n- ');
				const attitudes = contents
					.flatMap((c) => c.attitudes)
					.join('\n- ');

				return `Para ${section.name}:\nConceptuales:\n- ${concepts}\n\nProcedimentales:\n- ${procedures}\n\nActitudinales:\n- ${attitudes}`;
			})
			.join('\n\n---\n\n');
	}

	generateLearningSituation(): void {
		if (this.learningSituationForm.invalid) {
			this.sb.open(
				'Por favor, completa todos los campos requeridos.',
				'Ok',
				{ duration: 3000 },
			);
			return;
		}

		const { environment, situationType, reality, mainThemeCategory } =
			this.learningSituationForm.value;
		const contentsText = this.getSelectedContentsText();
		const gradesText = this.selectedClassSections
			.map((s) => s.name)
			.join(', ');

		const prompt = generateMultigradeLearningSituationPrompt
			.replace('niveles_y_grados', gradesText)
			.replace('ambiente_operativo', environment!)
			.replace('situacion_o_problema', reality!)
			.replace('contenido_especifico_por_grado', contentsText)
			.replace('theme_axis', mainThemeCategory!);

		this.generating = true;
		this.aiService.geminiAi(prompt).subscribe({
			next: (res) => {
				this.generating = false;
				try {
					const extract = res.response.slice(
						res.response.indexOf('{'),
						res.response.lastIndexOf('}') + 1,
					);
					const result = JSON.parse(extract);
					this.learningSituationTitle.setValue(result.title);
					this.learningSituation.setValue(result.content);
					this.strategies.clear();
					result.strategies.forEach((s: string) =>
						this.strategies.push(this.fb.control(s)),
					);
				} catch (error) {
					this.sb.open(
						'Error al procesar la respuesta de la IA. Inténtalo de nuevo.',
						'Ok',
					);
				}
			},
			error: () => {
				this.generating = false;
				this.sb.open(
					'Ocurrió un error al generar la situación de aprendizaje.',
					'Ok',
				);
			},
		});
	}

	generateActivities(): void {
		this.generating = true;
		const { duration, resources, teaching_method } =
			this.unitPlanForm.value;
		const gradesText = this.selectedClassSections
			.map((s) => s.name)
			.join(', ');
		const contentsText = this.getSelectedContentsText();
		const subjectName = this.pretifyPipe.transform(
			this.learningSituationForm.get('subject')?.value || '',
		);

		const prompt = generateMultigradeActivitySequencePrompt
			.replace('niveles_y_grados', gradesText)
			.replace('unit_duration', `${duration}`)
			.replace('content_list_por_grado', contentsText)
			.replace('resource_list', (resources || []).join('\n- '))
			.replace('teaching_style', teaching_method!)
			.replace(
				'theme_axis',
				this.learningSituationForm.get('mainThemeCategory')?.value!,
			)
			.replace('learning_situation', this.learningSituation.value || '')
			.replace('subject_name', subjectName);

		this.aiService.geminiAi(prompt).subscribe({
			next: (res) => {
				this.generating = false;
				try {
					const extract = res.response.slice(
						res.response.indexOf('{'),
						res.response.lastIndexOf('}') + 1,
					);
					const result = JSON.parse(extract);
					this.activitiesByGrade = result.activities_by_grade;
					this.instruments = result.instruments;
					this.resourceList = result.resources;
				} catch (e) {
					this.sb.open(
						'Error al procesar las actividades generadas. Inténtalo de nuevo.',
						'Ok',
					);
				}
			},
			error: () => {
				this.generating = false;
				this.sb.open(
					'Ocurrió un error al generar las actividades.',
					'Ok',
				);
			},
		});
	}

	fillFinalForm(): void {
		const flatActivities = (type: 'teacher' | 'student' | 'evaluation') => {
			return this.activitiesByGrade.map((g) => ({
				subject: this.learningSituationForm.get('subject')?.value || '',
				// Agregamos el grado a la actividad para diferenciarla
				activities: g[`${type}_activities`].map(
					(act) => `(${g.grade_level}) ${act}`,
				),
			}));
		};

		const uniqueCompetence: string[] = [];
		for (let entry of this.competence.entries()) {
			const [sectionId, competence] = entry;
			competence.forEach((comp) => {
				if (!uniqueCompetence.includes(comp._id)) {
					uniqueCompetence.push(comp._id);
				}
			});
		}

		const mainThemes: string[] = [];
		for (let entry of this.mainThemes.entries()) {
			const [sectionId, mainTheme] = entry;
			mainTheme.forEach((theme) => {
				if (!mainThemes.includes(theme._id)) {
					mainThemes.push(theme._id);
				}
			});
		}

		const plan: any = {
			user: this.User?._id,
			sections: this.learningSituationForm.get('classSections')?.value,
			duration: this.unitPlanForm.value.duration,
			learningSituation: this.learningSituation.value,
			title: this.learningSituationTitle.value,
			mainThemeCategory:
				this.learningSituationForm.get('mainThemeCategory')?.value,
			mainThemes,
			subjects: [this.learningSituationForm.get('subject')?.value],
			strategies: this.strategies.value,
			contents: this.selectedClassSections.flatMap(
				(section) =>
					this.learningSituationForm.get('content_' + section._id)
						?.value || [],
			),
			resources: this.resourceList,
			instruments: this.instruments,
			competence: uniqueCompetence,
			teacherActivities: flatActivities('teacher'),
			studentActivities: flatActivities('student'),
			evaluationActivities: flatActivities('evaluation'),
		};
		this.plan = plan;
		console.log('Sent to api:', plan);
		this.savePlan();
	}

	savePlan(): void {
		const plan: any = this.plan
		if (this.plan) {
			this.#store.dispatch(createPlan({ plan }))
		}
	}
}
