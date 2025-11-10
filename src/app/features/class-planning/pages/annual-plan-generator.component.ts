import { Component, inject, OnInit } from '@angular/core';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { AiService } from '../../../core/services/ai.service';
import { User } from '../../../core';
import { Router, RouterModule } from '@angular/router';
import { ClassSection } from '../../../core';
import { CompetenceService } from '../../../core/services/competence.service';
import { CompetenceEntry } from '../../../core';
import {
	classroomProblems,
	classroomResources,
	generateActivitySequencePrompt,
	generateLearningSituationPrompt,
	mainThemeCategories,
	schoolEnvironments,
} from '../../../config/constants';
import { ContentBlockService } from '../../../core/services/content-block.service';
import { ContentBlock } from '../../../core';
import { PretifyPipe } from '../../../shared/pipes/pretify.pipe';
import { UserSubscriptionService } from '../../../core/services/user-subscription.service';
import { MainTheme } from '../../../core';
import { MainThemeService } from '../../../core/services/main-theme.service';
import { IsPremiumComponent } from '../../../shared/ui/is-premium.component';
import { forkJoin } from 'rxjs';
import {
	createUnitPlan,
	loadUnitPlans,
	selectAllUnitPlans,
	UnitPlanDto,
} from '../../../store/unit-plans';
import { selectAuthUser } from '../../../store/auth/auth.selectors';
import { Store } from '@ngrx/store';
import {
	loadSections,
	selectAllClassSections,
} from '../../../store/class-sections';
import { loadBlocks, loadCurrentSubscription, loadEntries, loadEntriesSuccess, loadThemes, selectAllCompetenceEntries, selectAllContentBlocks } from '../../../store';
import { selectAllThemes } from '../../../store/main-themes/main-themes.selectors';
import { selectCurrentSubscription } from '../../../store/user-subscriptions/user-subscriptions.selectors';

@Component({
	selector: 'app-annual-plan-generator',
	standalone: true,
	imports: [
		ReactiveFormsModule,
		MatSnackBarModule,
		MatFormFieldModule,
		MatSelectModule,
		MatInputModule,
		MatButtonModule,
		MatIconModule,
		MatChipsModule,
		RouterModule,
		IsPremiumComponent,
	],
	template: `
		<app-is-premium minSubscriptionType="Plan Plus">
			<div class="content">
				<div
					style="display: flex; justify-content: space-between; align-items: center;"
				>
					<h2 class="title">Generador de Planificación Anual</h2>
					<button
						class="title-button"
						mat-button
						routerLink="/planning/unit-plans/list"
						color="accent"
					>
						Ver mis Planes
					</button>
				</div>
				<form
					[formGroup]="yearlyPlanForm"
					(ngSubmit)="generateYearlyPlan()"
					style="padding-top: 16px"
				>
					<div class="cols-2">
						<!-- Selector de Grado -->
						<mat-form-field appearance="outline">
							<mat-label>Grado</mat-label>
							<mat-select
								formControlName="classSection"
								(selectionChange)="onSectionOrSubjectChange()"
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
							@if (
								yearlyPlanForm
									.get('classSection')
									?.hasError('required')
							) {
								<mat-error>El grado es requerido.</mat-error>
							}
						</mat-form-field>

						<!-- Selector de Asignatura -->
						<mat-form-field appearance="outline">
							<mat-label>Asignatura</mat-label>
							<mat-select
								formControlName="subject"
								(selectionChange)="onSectionOrSubjectChange()"
							>
								@for (
									subject of subjectsForSelectedSection;
									track subject.id
								) {
									<mat-option [value]="subject.id">{{
										subject.label
									}}</mat-option>
								}
							</mat-select>
							@if (
								yearlyPlanForm
									.get('subject')
									?.hasError('required')
							) {
								<mat-error
									>La asignatura es requerida.</mat-error
								>
							}
						</mat-form-field>

						<!-- Selector de Ambiente Operativo -->
						<mat-form-field appearance="outline">
							<mat-label>Ambiente Operativo</mat-label>
							<mat-select formControlName="environment">
								@for (env of environments; track env) {
									<mat-option [value]="env">{{
										env
									}}</mat-option>
								}
							</mat-select>
						</mat-form-field>

						<!-- Tipo de Situación y Realidad -->
						<mat-form-field appearance="outline">
							<mat-label>Tipo de Situación</mat-label>
							<mat-select formControlName="situationType">
								@for (type of situationTypes; track type.id) {
									<mat-option [value]="type.id">{{
										type.label
									}}</mat-option>
								}
							</mat-select>
						</mat-form-field>

						@if (
							yearlyPlanForm.value.situationType ===
							'realityProblem'
						) {
							<mat-form-field appearance="outline">
								<mat-label>Problema a Abordar</mat-label>
								<mat-select formControlName="reality">
									@for (problem of problems; track problem) {
										<mat-option [value]="problem">{{
											problem
										}}</mat-option>
									}
								</mat-select>
							</mat-form-field>
						}
						@if (yearlyPlanForm.value.situationType === 'reality') {
							<mat-form-field appearance="outline">
								<mat-label>Realidad del Curso</mat-label>
								<input
									matInput
									type="text"
									formControlName="reality"
								/>
							</mat-form-field>
						}
					</div>
					<!-- Recursos Disponibles -->
					<div class="resource-section">
						<mat-label>Recursos Disponibles</mat-label>
						<mat-chip-listbox formControlName="resources" multiple>
							@for (resource of resources; track resource) {
								<mat-chip-option [value]="resource">{{
									resource
								}}</mat-chip-option>
							}
						</mat-chip-listbox>
					</div>

					<div style="text-align: end; margin-top: 24px">
						<button
							mat-flat-button
							color="primary"
							type="submit"
							[disabled]="generating || yearlyPlanForm.invalid"
						>
							<mat-icon>bolt</mat-icon>
							@if (generating) {
								<span
									>Generando... ({{ plansGenerated }} /
									{{ totalPlansToGenerate }})</span
								>
							} @else {
								<span>Generar Planificación Anual</span>
							}
						</button>
					</div>
				</form>
			</div>
		</app-is-premium>
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
export class AnnualPlanGeneratorComponent implements OnInit {
	private aiService = inject(AiService);
	private fb = inject(FormBuilder);
	private sb = inject(MatSnackBar);
	#store = inject(Store);
	private router = inject(Router);
	private pretifyPipe = new PretifyPipe();

	user = this.#store.selectSignal(selectAuthUser);
	classSections = this.#store.selectSignal(selectAllClassSections);
	contentBlocks = this.#store.selectSignal(selectAllContentBlocks);
	competence = this.#store.selectSignal(selectAllCompetenceEntries);
	mainThemes = this.#store.selectSignal(selectAllThemes);

	generating = false;
	plansGenerated = 0;
	totalPlansToGenerate = 6;

	public mainThemeCategories = mainThemeCategories;
	public environments = schoolEnvironments;
	public problems = classroomProblems;
	public resources = classroomResources;
	public situationTypes = [
		{ id: 'realityProblem', label: 'Problema Real' },
		{ id: 'reality', label: 'Basada en mi Realidad' },
		{ id: 'fiction', label: 'Ficticia' },
	];

	yearlyPlanForm = this.fb.group({
		classSection: ['', Validators.required],
		subject: ['', Validators.required],
		environment: ['Salón de clases', Validators.required],
		situationType: ['fiction', Validators.required],
		reality: ['Falta de disciplina', Validators.required],
		resources: [
			['Pizarra', 'Libros de texto', 'Cuadernos', 'Lápices y bolígrafos'],
		],
	});

	ngOnInit(): void {
		this.#store.dispatch(loadUnitPlans({}));
		this.#store.dispatch(loadSections());
		this.#store.dispatch(loadCurrentSubscription());
		const res = localStorage.getItem('available-resources') as string;
		const resources = res ? JSON.parse(res) : null;
		if (resources && Array.isArray(resources) && resources.length > 0) {
			this.yearlyPlanForm.get('resources')?.setValue(resources);
		}
		forkJoin({
			sections: this.#store.select(selectAllClassSections),
			unitPlans: this.#store.select(selectAllUnitPlans),
			subscription: this.#store.select(selectCurrentSubscription),
		}).subscribe({
			next: ({ sections, unitPlans, subscription }) => {
				if (!sections.length) {
					this.router.navigateByUrl('/sections').then(() => {
						this.sb.open(
							'Para usar esta herramienta, necesitas crear al menos una sección.',
							'Ok',
							{ duration: 5000 },
						);
					});
					return;
				}
				const unitPlanLimits =
					subscription?.subscriptionType == 'Plan Premium'
						? sections.length *
							sections.flatMap((s) => s.subjects).length *
							12
						: sections.length *
							sections.flatMap((s) => s.subjects).length *
							6;
				const userPlansThisMonth = unitPlans.filter((plan) => {
					const planDate = new Date(plan.createdAt);
					return (
						planDate <
						new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
					);
				}).length;
				if (userPlansThisMonth >= unitPlanLimits) {
					this.router
						.navigateByUrl('/planning/unit-plans/list')
						.then(() => {
							this.sb.open(
								`Has alcanzado el límite de ${unitPlanLimits} unidades para este mes según tu plan actual.`,
								'Ok',
								{ duration: 7000 },
							);
						});
					return;
				}
			},
			error: (err) => {
				console.log(err);
			},
		});
	}

	onSectionOrSubjectChange(): void {
		const { classSection: sectionId, subject } = this.yearlyPlanForm.value;
		if (!sectionId || !subject) {
			this.#store.dispatch(loadEntriesSuccess({ entries: [] }));
			return;
		}
		
		const section = this.classSections().find((s) => s._id === sectionId);
		if (!section) {
			this.#store.dispatch(loadEntriesSuccess({ entries: [] }));
			return;
		}
		this.#store.dispatch(loadEntries({
			filters: {
				grade: section.year,
				level: section.level,
				subject,
			}
		}))
		this.#store.dispatch(loadThemes({
			filters: {
				level: section.level,
				year: section.year,
				subject,
			}
		}))
		this.#store.dispatch(loadBlocks({
			filters: {
				level: section.level,
				year: section.year,
				subject,
			}
		}))
	}

	async generateYearlyPlan(): Promise<void> {
		if (this.yearlyPlanForm.invalid) {
			this.sb.open(
				'Por favor, completa todos los campos requeridos.',
				'Ok',
				{ duration: 3000 },
			);
			return;
		}
		this.generating = true;
		this.plansGenerated = 0;

		const contentUnits = this.divideContentIntoUnits();
		if (contentUnits.length === 0) {
			this.sb.open(
				'No se encontraron contenidos para la asignatura y grado seleccionados.',
				'Ok',
				{ duration: 3000 },
			);
			this.generating = false;
			return;
		}
		const mainThemes: string[] = [...this.mainThemes().map(t => `${t.category}: ${t.topics.join(' ')}`), `${this.mainThemes()[0].category}: ${this.mainThemes()[0].topics.join(' ')}`]

		for (const unitContents of contentUnits) {
			try {
				const theme = mainThemes.pop() || ''
				await this.generateAndSaveUnitPlan(unitContents, theme);
				this.plansGenerated++;
			} catch (error) {
				console.error('Error generando una unidad:', error);
				this.sb.open(
					`Error al generar la unidad ${this.plansGenerated + 1}. Intentando con la siguiente.`,
					'Ok',
					{ duration: 4000 },
				);
			}
		}

		this.generating = false;
		this.sb.open(
			'¡Planificación anual generada y guardada con éxito!',
			'Ok',
			{ duration: 5000 },
		);
		this.router.navigateByUrl('/planning/unit-plans/list');
	}

	private divideContentIntoUnits(): ContentBlock[][] {
		const totalContents = this.contentBlocks().length;
		const units = 6;
		if (totalContents === 0) return [];

		const baseContentsPerUnit = Math.floor(totalContents / units);
		let remainder = totalContents % units;
		const result: ContentBlock[][] = [];
		let currentIndex = 0;

		for (let i = 0; i < units; i++) {
			let contentsInThisUnit =
				baseContentsPerUnit + (remainder > 0 ? 1 : 0);
			result.push(
				this.contentBlocks().slice(
					currentIndex,
					currentIndex + contentsInThisUnit,
				),
			);
			currentIndex += contentsInThisUnit;
			if (remainder > 0) {
				remainder--;
			}
		}

		return result.filter((unit) => unit.length > 0);
	}

	private async generateAndSaveUnitPlan(
		unitContents: ContentBlock[],
		mainTheme: string,
	): Promise<void> {
		const {
			environment,
			situationType,
			reality,
			resources,
			subject,
		} = this.yearlyPlanForm.value;

		if (resources && resources.length > 0) {
			localStorage.setItem(
				'available-resources',
				JSON.stringify(resources),
			);
		}
		const classSection = this.classSections().find(
			(s) => s._id === this.yearlyPlanForm.value.classSection,
		);

		if (!classSection || !subject)
			throw new Error('Información de sección o asignatura inválida.');

		// 1. Generar Situación de Aprendizaje
		const learningSituationText = this.getLearningSituationPrompt(
			unitContents,
			classSection,
			environment!,
			situationType!,
			reality!,
			mainTheme!,
		);
		const situationResponse = await this.aiService
			.geminiAi(learningSituationText)
			.toPromise();

		const situationJson = this.extractJson(
			situationResponse?.response || '{}',
		);
		const {
			title,
			content: learningSituationContent,
			strategies,
		} = situationJson;

		// 2. Generar Secuencia de Actividades
		const activitiesText = this.getActivitiesPrompt(
			unitContents,
			classSection,
			mainTheme!,
			resources as string[],
			learningSituationContent,
			subject,
		);
		const activitiesResponse = await this.aiService
			.geminiAi(activitiesText)
			.toPromise();
		const activitiesJson = this.extractJson(
			activitiesResponse?.response || '{}',
		);

		const competence = this.competence().map((c) => c._id);
		// 3. Construir y Guardar el Plan
		const plan: Partial<UnitPlanDto> = {
			user: this.user()?._id,
			section: classSection._id,
			duration: 6, // Duración por defecto
			learningSituation: learningSituationContent,
			title: title,
			competence,
			mainThemeCategory: mainTheme,
			mainThemes: this.mainThemes()
				.filter((t) => t.category === mainTheme)
				.map((t) => t._id),
			subjects: [subject],
			strategies: strategies || [],
			contents: unitContents.map((c) => c._id!),
			resources: activitiesJson.resources || [],
			instruments: activitiesJson.instruments || [],
			teacherActivities: activitiesJson.teacher_activities || [],
			studentActivities: activitiesJson.student_activities || [],
			evaluationActivities: activitiesJson.evaluation_activities || [],
		} as any;
		this.#store.dispatch(createUnitPlan({ plan }));
	}

	private getLearningSituationPrompt(
		contents: ContentBlock[],
		classSection: ClassSection,
		environment: string,
		situationType: string,
		reality: string,
		mainTheme: string,
	): string {
		const contentStr = this.formatContentsForPrompt(contents);
		const user = this.user();
		return generateLearningSituationPrompt
			.replace(
				'nivel_y_grado',
				`${classSection.year.toLowerCase()} de ${classSection.level.toLowerCase()}`,
			)
			.replace('centro_educativo', user?.schoolName || '')
			.replace('section_name', classSection.name)
			.replace('ambiente_operativo', environment)
			.replace('theme_axis', mainTheme.toLowerCase())
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
			.replace(
				'[secuencia]',
				`Esta es la unidad ${this.plansGenerated + 1} de 6 del año escolar`,
			)
			.replace('contenido_especifico', contentStr);
	}

	private getActivitiesPrompt(
		contents: ContentBlock[],
		classSection: ClassSection,
		mainTheme: string,
		resources: string[],
		learningSituation: string,
		subject: string,
	): string {
		const contentStr = this.formatContentsForPrompt(contents);
		const subjectPretified = this.pretifyPipe.transform(subject);
		return generateActivitySequencePrompt
			.replace('classroom_year', `${classSection.year.toLowerCase()}`)
			.replace('classroom_level', `${classSection.level.toLowerCase()}`)
			.replace('teaching_style', 'Aprendizaje Basado en Competencias') // Valor por defecto
			.replace('unit_duration', `6`) // Duración por defecto
			.replace('content_list', contentStr)
			.replace('theme_axis', mainTheme.toLowerCase())
			.replace('resource_list', resources.join('\n- '))
			.replace('learning_situation', learningSituation)
			.replace(/subject_list/g, subjectPretified)
			.replace(/subject_type/g, `'${subject}'`);
	}

	private formatContentsForPrompt(contents: ContentBlock[]): string {
		return contents
			.map((c) => {
				return `${this.pretifyPipe.transform(c.subject)}:\nConceptuales:\n- ${c.concepts.join('\n- ')}\n\nProcedimentales:\n- ${c.procedures.join('\n- ')}\n\nActitudinales:\n- ${c.attitudes.join('\n- ')}`;
			})
			.join('\n\n');
	}

	private extractJson(text: string): any {
		try {
			const start = text.indexOf('{');
			const end = text.lastIndexOf('}') + 1;
			const jsonString = text.slice(start, end);
			return JSON.parse(jsonString);
		} catch (error) {
			console.error(
				'Error al parsear JSON de la respuesta de la IA:',
				error,
				'Texto original:',
				text,
			);
			throw new Error(
				'La respuesta de la IA no tenía un formato JSON válido.',
			);
		}
	}

	get classSection(): ClassSection | null {
		const { classSection } = this.yearlyPlanForm.value;
		return this.classSections().find((s) => s._id === classSection) || null;
	}

	get subjectsForSelectedSection(): { id: string; label: string }[] {
		if (!this.classSection) return [];
		return this.classSection.subjects
			.filter((sId) => sId !== 'TALLERES_OPTATIVOS')
			.map((sId) => ({
				id: sId,
				label: this.pretifyPipe.transform(sId),
			}));
	}
}
