import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ClassSectionService } from '../../../core/services/class-section.service';
import { AiService } from '../../../core/services/ai.service';
import { PdfService } from '../../../core/services/pdf.service';
import { MatChipsModule } from '@angular/material/chips';
import { ClassPlan } from '../../../core';
import { Router, RouterModule } from '@angular/router';
import { CompetenceService } from '../../../core/services/competence.service';
import { ClassSection } from '../../../core';
import {
	classPlanPrompt,
	classroomResources,
} from '../../../config/constants';
import { CompetenceEntry } from '../../../core';
import { ClassPlanComponent } from '../components/class-plan.component';
import { UserSubscriptionService } from '../../../core/services/user-subscription.service';
import { PretifyPipe } from '../../../shared/pipes/pretify.pipe';
import { Store } from '@ngrx/store';
import { createClassPlan, createClassPlanSuccess, loadClassPlans, loadSections, selectAllClassSections, selectAuthUser, selectClassPlans } from '../../../store';
import { filter, forkJoin, Subject, take, takeUntil, tap } from 'rxjs';
import { Actions, ofType } from '@ngrx/effects';

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
	template: `
		<div class="header">
			<h2 class="title" mat-card-tittle>
				Generador de Plan de Clase (Plan Diario)
			</h2>
			<button
				class="title-button"
				mat-button
				routerLink="/planning/class-plans/list"
				color="accent"
			>
				Ver mis Planes
			</button>
		</div>
		<div>
			<form (ngSubmit)="onSubmit()" [formGroup]="planForm">
				<div class="controls-container-6">
					<mat-form-field appearance="outline">
						<mat-label>Curso</mat-label>
						<mat-select
							formControlName="classSection"
							(selectionChange)="onSectionSelect()"
						>
							@for (section of classSections; track section) {
								<mat-option [value]="section._id">{{
									section.name
								}}</mat-option>
							}
						</mat-select>
					</mat-form-field>
					<mat-form-field appearance="outline">
						<mat-label>Asignatura</mat-label>
						<mat-select
							formControlName="subject"
							(selectionChange)="onSubjectSelect()"
						>
							@for (subject of sectionSubjects; track subject) {
								<mat-option [value]="subject">{{
									pretify(subject)
								}}</mat-option>
							}
						</mat-select>
					</mat-form-field>
					<mat-form-field appearance="outline">
						<mat-label>Fecha</mat-label>
						<input type="date" formControlName="date" matInput />
					</mat-form-field>
					<mat-form-field appearance="outline">
						<mat-label>Proceso Cognitivo</mat-label>
						<mat-select formControlName="bloomLevel">
							@for (level of bloomLevels; track level) {
								<mat-option [value]="level.id">{{
									level.label
								}}</mat-option>
							}
						</mat-select>
					</mat-form-field>
					<mat-form-field appearance="outline">
						<mat-label>Estilo de Enseñanza</mat-label>
						<mat-select formControlName="teachingStyle">
							@for (style of teachingStyles; track style) {
								<mat-option [value]="style.id">{{
									style.label
								}}</mat-option>
							}
						</mat-select>
					</mat-form-field>
					<mat-form-field appearance="outline">
						<mat-label>Tiempo</mat-label>
						<mat-select formControlName="duration">
							@for (minutes of [45, 50, 90]; track minutes) {
								<mat-option [value]="minutes"
									>{{ minutes }} Minutos</mat-option
								>
							}
						</mat-select>
					</mat-form-field>
				</div>
				<div>
					<mat-form-field appearance="outline">
						<mat-label>Temas (Un tema por l&iacute;nea)</mat-label>
						<textarea formControlName="topics" matInput></textarea>
					</mat-form-field>
				</div>
				<div style="margin-bottom: 16px">
					<mat-label>Recursos Disponibles</mat-label>
					<mat-chip-listbox
						formControlName="resources"
						multiple
						(change)="onResourceChange($event)"
					>
						@for (resource of resources; track resource) {
							<mat-chip-option>{{ resource }}</mat-chip-option>
						}
					</mat-chip-listbox>
				</div>
				<div style="margin-top: 12px; text-align: end">
					<!-- <button [disabled]="!plan" type="button" style="margin-right: 12px;" (click)="printPlan()" mat-fab extended color="accent">Descargar <mat-icon>picture_as_pdf</mat-icon></button> -->
					<!-- <button [disabled]="!plan" type="button" style="margin-right: 12px;" (click)="downloadPlan()" mat-fab extended color="accent"><mat-icon>description</mat-icon>Descargar</button> -->
					<button
						[disabled]="!plan"
						type="button"
						style="margin-right: 12px"
						(click)="savePlan()"
						mat-flat-button
						color="primary"
					>
						<mat-icon>save</mat-icon> Guardar
					</button>
					<button
						type="submit"
						[disabled]="generating || planForm.invalid"
						mat-button
					>
						<mat-icon>bolt</mat-icon>
						{{ plan ? "Regenerar" : "Generar" }}
					</button>
				</div>
			</form>
		</div>

		@if (plan) {
			<app-class-plan [plan]="plan" />
			<div style="height: 24px"></div>
		}
	`,
	styles: `
		.header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 24px;
		}

		mat-form-field {
			width: 100%;
		}

		.page {
			padding: 0.5in;
			margin: 42px auto;
			background-color: white;
			min-width: 1400px;
		}

		.shadow {
			box-shadow: 10px 10px 14px 0px rgba(0, 0, 0, 0.75);
			-webkit-box-shadow: 10px 10px 14px 0px rgba(0, 0, 0, 0.75);
			-moz-box-shadow: 10px 10px 14px 0px rgba(0, 0, 0, 0.75);
		}

		td,
		th {
			border: 1px solid #ccc;
			padding: 8px;
		}

		.controls-container-6 {
			display: grid;
			gap: 12px;
			grid-template-columns: 1fr;

			@media screen and (min-width: 960px) {
				grid-template-columns: repeat(2, 1fr);
			}

			@media screen and (min-width: 1200px) {
				grid-template-columns: repeat(3, 1fr);
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
export class ClassPlanGeneratorComponent implements OnInit {
	sb = inject(MatSnackBar)
	fb = inject(FormBuilder)
	#store = inject(Store)
	#actions$ = inject(Actions)
	compService = inject(CompetenceService)
	aiService = inject(AiService)
	private userSubscriptionService = inject(UserSubscriptionService)
	pdfService = inject(PdfService)
	router = inject(Router)
	datePipe = new DatePipe('en')

	classPlans = this.#store.select(selectClassPlans)
	todayDate = new Date(Date.now() - 4 * 60 * 60 * 1000)
		.toISOString()
		.split('T')[0]
	classSections: ClassSection[] = []
	user = this.#store.selectSignal(selectAuthUser)
	subjects = computed<string[]>(() => {
		const section = this.section()
		return section ? section.subjects : []
	})
	generating = false
	plan: ClassPlan | null = null
	section = signal<ClassSection | null>(null)

	competence: CompetenceEntry[] = []
	competenceString = ''

	bloomLevels = [
		{ id: 'knowledge', label: 'Recordar' },
		{ id: 'understanding', label: 'Aprender' },
		{ id: 'application', label: 'Aplicar' },
		{ id: 'analysis', label: 'Analizar' },
		{ id: 'evaluation', label: 'Evaluar' },
		{ id: 'creation', label: 'Crear' },
	]

	teachingStyles: { id: string, label: string }[] = [
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
	]

	resources = classroomResources

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
	})

	private planPrompt = classPlanPrompt

	destroy$ = new Subject<void>()

	ngOnDestroy() {
		this.destroy$.next()
		this.destroy$.complete()
	}

	ngOnInit(): void {
		this.#store.dispatch(loadClassPlans({ }))
		this.#store.dispatch(loadSections())
		forkJoin([
			this.userSubscriptionService.checkSubscription(),
			this.classPlans,
		])
		.pipe(
			filter(([sub]) => !!sub),
			take(1),
			takeUntil(this.destroy$)
		)
		.subscribe(([subscription, plans]) => {
				if (
					subscription.subscriptionType
						.toLowerCase()
						.includes('premium')
				)
					return;
				const today = new Date();
				const dayOfTheWeek = today.getDay();
				const lastMonday = dayOfTheWeek === 1 ? today
					: new Date(
							today.setDate(
								today.getDate() - (7 - dayOfTheWeek),
							),
						);
				const createdThisWeek = plans.filter(
					(plan) =>
						plan.createdAt &&
						+new Date(plan.createdAt) > +lastMonday,
				).length;
				const createdThisMonth = plans.filter(
					(plan) =>
						plan.createdAt &&
						+new Date(plan.createdAt).getMonth() ===
							+new Date().getMonth() &&
						+new Date(plan.createdAt).getFullYear() ===
							+new Date().getFullYear(),
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
		const availableResourcesStr = localStorage.getItem(
			'available-resources',
		);
		if (availableResourcesStr) {
			const resources = JSON.parse(availableResourcesStr) as string[];
			this.planForm.get('resources')?.setValue(resources);
		}
		this.#store.select(selectAllClassSections).subscribe((sections) => {
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
			} else {
				this.router.navigateByUrl('/sections').then(() => {
					this.sb.open(
						'Para poder planificar, primero tienes que crear una seccion',
						'Ok',
						{ duration: 5000 },
					);
				});
			}
		});
		this.#actions$.pipe(
			ofType(createClassPlanSuccess),
			filter(plan => !!plan),
			takeUntil(this.destroy$),
			tap(({ classPlan }) => {
				this.router
					.navigateByUrl(`/planning/class-plans/${classPlan._id}`)
					.then(() => {
						this.sb.open('Tu plan ha sido guardado!', 'Ok', {
							duration: 2500,
						});
					});
			})
		).subscribe()
	}

	onSectionSelect() {
		setTimeout(() => {
			const sectionId = this.planForm.get('classSection')?.value;
			const section = this.classSections.find((s) => s._id === sectionId);
			if (section) {
				this.section.set(section);
			} else {
				this.section.set(null);
			}
		}, 0);
	}

	onResourceChange(event: { value: string[] }) {
		setTimeout(() => {
			const resources = JSON.stringify(event.value);
			localStorage.setItem('available-resources', resources);
		}, 0);
	}

	onSubjectSelect() {
		const section = this.section()
		if (section) {
			const { level, year } = section;
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
						const plan: any = JSON.parse(extract);
						plan.user = this.user()?._id;
						plan.section = this.section()?._id;
						plan.date = new Date(date ? date : this.todayDate);
						plan.subject = this.planForm.value.subject;
						this.plan = plan;
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
		const plan = this.plan
		if (plan) {
			this.#store.dispatch(createClassPlan({ plan }))
		}
	}

	downloadPlan() {}

	printPlan() {
		const date = this.datePipe.transform(
			this.planForm.value.date,
			'dd-MM-yyyy',
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
		return ['PRIMERO', 'SEGUNDO', 'TERCERO', 'CUARTO', 'QUINTO', 'SEXTO'].indexOf(year)
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
