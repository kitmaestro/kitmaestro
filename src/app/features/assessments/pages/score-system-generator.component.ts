import { Component, computed, effect, inject, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ClassSection } from '../../../core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { Router, RouterLink } from '@angular/router';
import { PretifyPipe } from '../../../shared/pipes/pretify.pipe';
import { TEACHING_METHODS } from '../../../core/data/teaching-methods';
import { Subject, take, takeUntil } from 'rxjs';
import {
	GradingActivity,
	GroupedGradingActivity,
	ScoreSystem,
} from '../../../core';
import { ScoreSystemComponent } from '../components/score-system.component';
import { IsPremiumComponent } from '../../../shared/ui/is-premium.component';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import {
	askGemini,
	createSystem,
	createSystemSuccess,
	loadBlocks,
	loadEntries,
	loadSections,
	loadSectionsSuccess,
	loadSectionSuccess,
	ScoreSystemDto,
	selectAiIsGenerating,
	selectAiSerializedResult,
	selectAllClassSections,
	selectAllCompetenceEntries,
	selectAllContentBlocks,
	selectAuthUser,
} from '../../../store';
import { selectIsCreating } from '../../../store/score-systems/score-systems.selectors';

const uniq = <T>(arr: T[]) => [...new Set(arr)];

@Component({
	selector: 'app-score-system-generator',
	imports: [
		MatSnackBarModule,
		MatButtonModule,
		MatInputModule,
		MatSelectModule,
		MatFormFieldModule,
		ReactiveFormsModule,
		RouterLink,
		PretifyPipe,
		ScoreSystemComponent,
		IsPremiumComponent,
		MatIconModule,
	],
	template: `
		<app-is-premium>
			<div style="padding: 24px;">
				<div
					style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;"
				>
					<h2>Generador de Sistemas de Calificaci&oacute;n</h2>
					<a
						mat-button
						[routerLink]="[
							'/assessments',
							'grading-systems',
							'list',
						]"
					>
						<mat-icon>list</mat-icon>
						Mis Sistemas
					</a>
				</div>
				<div>
					<div style="margin-top: 24px">
						<form [formGroup]="form" (ngSubmit)="onSubmit()">
							<div>
								<mat-form-field appearance="outline">
									<mat-label>Secci&oacute;n</mat-label>
									<mat-select
										formControlName="section"
										(selectionChange)="
											onSectionChange($event)
										"
									>
										@for (
											section of sections();
											track section._id
										) {
											<mat-option [value]="section._id">{{
												section.name
											}}</mat-option>
										}
									</mat-select>
								</mat-form-field>
							</div>
							<div>
								<mat-form-field appearance="outline">
									<mat-label>Asignatura</mat-label>
									<mat-select
										formControlName="subject"
										(selectionChange)="
											onSubjectChange($event)
										"
									>
										@if (form.get('section')?.value) {
											@for (
												subject of subjects;
												track subject
											) {
												<mat-option [value]="subject">{{
													subject | pretify
												}}</mat-option>
											}
										}
									</mat-select>
								</mat-form-field>
							</div>
							<div>
								<mat-form-field appearance="outline">
									<mat-label>Contenido</mat-label>
									<mat-select
										formControlName="content"
										multiple
										(selectionChange)="
											onConceptChange($event)
										"
									>
										@if (
											form.get('section')?.value &&
											form.get('subject')?.value
										) {
											@for (
												content of contents;
												track content
											) {
												<mat-option [value]="content">
													{{ content }}
												</mat-option>
											}
										}
									</mat-select>
								</mat-form-field>
							</div>
							<div>
								<mat-form-field appearance="outline">
									<mat-label
										>Estilo de Ense&ntilde;anza</mat-label
									>
									<mat-select formControlName="style">
										@for (style of styles; track $index) {
											<mat-option [value]="style.name">
												{{ style.name }}
											</mat-option>
										}
									</mat-select>
								</mat-form-field>
							</div>
							<div style="text-align: end">
								<button
									[disabled]="
										form.invalid || generating() || saving()
									"
									mat-button
									type="submit"
								>
									<mat-icon>bolt</mat-icon>
									{{
										generating()
											? 'Generando...'
											: scoreSystem
												? 'Regenerar'
												: 'Generar'
									}}
								</button>
								@if (scoreSystem) {
									<button
										[disabled]="saving() || generating()"
										type="button"
										mat-flat-button
										(click)="saveSystem()"
										style="margin-left: 12px"
									>
										<mat-icon>save</mat-icon>
										Guardar
									</button>
								}
							</div>
						</form>
					</div>
				</div>
			</div>

			@if (scoreSystem && section) {
				<app-score-system [scoreSystem]="scoreSystem" />
			}
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

		table {
			border-collapse: collapse;
		}

		.shadow {
			box-shadow: 10px 10px 14px 0px rgba(0, 0, 0, 0.75);
			-webkit-box-shadow: 10px 10px 14px 0px rgba(0, 0, 0, 0.75);
			-moz-box-shadow: 10px 10px 14px 0px rgba(0, 0, 0, 0.75);
		}
	`,
})
export class ScoreSystemGeneratorComponent implements OnInit, OnDestroy {
	#store = inject(Store);
	#actions$ = inject(Actions);
	private sb = inject(MatSnackBar);
	private fb = inject(FormBuilder);
	private router = inject(Router);
	user = this.#store.selectSignal(selectAuthUser);
	sections = this.#store.selectSignal(selectAllClassSections);
	section: ClassSection | null = null;
	subjects: string[] = [];
	contents: string[] = [];
	contentBlocks = this.#store.selectSignal(selectAllContentBlocks);
	contentBlock = computed(() =>
		this.contentBlocks().filter((block) =>
			(this.form.get('content')?.value || []).includes(block.title),
		),
	);
	competence = this.#store.selectSignal(selectAllCompetenceEntries);
	styles = TEACHING_METHODS;
	generating = this.#store.selectSignal(selectAiIsGenerating);
	generated = this.#store.selectSignal(selectAiSerializedResult);
	saving = this.#store.selectSignal(selectIsCreating);
	scoreSystem: ScoreSystem | null = null;
	grouped: GroupedGradingActivity[] = [];

	pretify = new PretifyPipe().transform;

	#destroy$ = new Subject<void>();

	form = this.fb.group({
		section: ['', Validators.required],
		subject: ['', Validators.required],
		content: [[] as string[], Validators.required],
		style: ['Aprendizaje Basado en Competencias'],
	});

	constructor() {
		effect(() => {
			const result: GradingActivity[] = this.generated();
			const user = this.user();
			const section = this.section;
			const content = this.contentBlock();
			if (result && section && user) {
				const copy = [...result];
				const activities = this.adjustGradingActivities(
					copy.sort(
						(a, b) =>
							a.competence.charCodeAt(0) -
							b.competence.charCodeAt(0),
					),
				);
				this.scoreSystem = {
					activities,
					content,
					section: section,
					user: user,
				} as any;
				this.grouped = this.groupByCompetence(activities);
			}
		});

		effect(() => {
			const contents = this.contentBlocks();
			this.contents = uniq<string>(contents.flatMap((c) => c.concepts));
			this.onConceptChange({ value: '' });
		});
	}

	ngOnInit() {
		this.#store.dispatch(loadSections());
		this.#actions$
			.pipe(ofType(loadSectionsSuccess), takeUntil(this.#destroy$))
			.subscribe(({ sections }) => {
				if (!sections.length) {
					this.sb.open(
						'No tienes sesiones todavia. Primero crea una para poder usar esta herramienta.',
						'Ok',
					);
				}
			});
	}

	ngOnDestroy() {
		this.#destroy$.next();
		this.#destroy$.complete();
	}

	groupByCompetence(
		gradingActivities: GradingActivity[],
	): GroupedGradingActivity[] {
		const grouped = gradingActivities.reduce((acc, activity) => {
			// Si ya existe un grupo con la misma competencia, añade la actividad al grupo
			const existingGroup = acc.find(
				(group) => group.competence === activity.competence,
			);

			if (existingGroup) {
				existingGroup.grading.push(activity);
				existingGroup.total += activity.points;
			} else {
				// Si no existe, crea un nuevo grupo para esta competencia
				acc.push({
					competence: activity.competence,
					grading: [activity],
					total: activity.points,
				});
			}

			return acc;
		}, [] as GroupedGradingActivity[]);

		return grouped;
	}

	adjustGradingActivities(
		gradingActivities: GradingActivity[],
	): GradingActivity[] {
		// Paso 1: Agrupamos por 'competence' y calculamos el total
		const grouped = gradingActivities.reduce((acc, activity) => {
			const existingGroup = acc.find(
				(group) => group.competence === activity.competence,
			);

			if (existingGroup) {
				existingGroup.grading.push(activity);
				existingGroup.total += activity.points;
			} else {
				acc.push({
					competence: activity.competence,
					grading: [activity],
					total: activity.points,
				});
			}

			return acc;
		}, [] as GroupedGradingActivity[]);

		// Paso 2: Ajustar los grupos que tengan un total menor a 100
		const result = grouped.map((group) => {
			const copy = { ...group };
			if (copy.total > 100) {
				copy.grading.sort((a, b) => b.points - a.points);

				while (copy.grading.reduce((l, c) => l + c.points, 0) > 100) {
					copy.grading = copy.grading.slice(0, -1);
				}
				copy.total = 100;
			}
			if (copy.total < 100) {
				// Calculamos la diferencia que falta para llegar a 100
				const difference = 100 - copy.total;

				// Ordenamos las actividades por puntaje ascendente para encontrar las dos menores
				copy.grading.sort((a, b) => a.points - b.points);

				if (copy.grading.length >= 2) {
					// Repartimos la diferencia entre las dos actividades con menor puntaje
					copy.grading[0].points += Math.floor(difference / 2);
					copy.grading[1].points += Math.ceil(difference / 2);
				} else if (copy.grading.length === 1) {
					// Si solo hay una actividad, le sumamos toda la diferencia
					copy.grading[0].points += difference;
				}

				// Actualizamos el total del grupo a 100
				copy.total = 100;
			}
			return copy;
		});

		// Paso 3: Retornar el array plano de GradingActivity con los puntos ajustados
		return result.flatMap((group) => group.grading);
	}

	onSubmit() {
		const section = this.getSection(this.form.get('section')?.value || '');
		const concepts = this.form.get('content')?.value || [];
		const competenceOptions = uniq<string>(
			this.competence().map((c) => c.name),
		);
		const blocks = this.contentBlocks()
			.filter((block) => concepts.includes(block.title))
			.flatMap((block) => block.concepts);
		if (!section) return;
		const question = `Necesito que me ayudes a crear un sistema de calificaciones para evaluar el desarrollo de las competencias necesarias para los contenidos que estoy trabajando en ${section.year.toLowerCase()} grado de ${section.level.toLowerCase()} en el area de ${this.pretify(this.form.get('subject')?.value || '')}, en base a 100 puntos:
Los contenidos que estoy trabajando son estos:
- ${blocks.join('\n- ')}

Mi metodo de enseñanza, va mayormente enfocado hacia el ${this.form.get('style')?.value?.toLowerCase()}.

El sistema de calificaciones tiene que ser un array JSON con esta interfaz:
{
	competence: ${competenceOptions}, // competencia que se trabajara
	activity: string, // actividad o trabajo a realizar
	activityType: 'Grupal' | 'Individual' | 'Autoevaluacion' | 'Coevaluacion',
	criteria: string[], // criterios de evaluacion
	points: number,
}

Aqui cada objeto es una entrada del sistema de calificaciones, donde se especifican: la competencia que se estara trabajando, la actividad que se realizara, el tipo de actividad, los criterios que se van a evaluar y los puntos asignados a dicha actividad.
De esta manera las condiciones para la validez del sistema de calificaciones es que al sumar todos los puntos (todas las propiedades points) de la misma competencia deberia ser igual a 100.
Este sistema de calificacion sera utilizado durante 4 semanas, a lo largo de varias lecciones. Asi que el numero ideal de actividades se encuentra entre 1 a 2 actividades a la semana, osea de 4 a 8 actividades con no mas de 100 puntos asignados en total.
Las actividades que mas realizo con mis estudiantes son las investigaciones, las exposiciones y los informes de lectura o de investigacion.
Algunos puntos 'fijos' son los cuadernos (5 a 15 puntos) y la participacion activa en clase (de 5 a 10 puntos), autoevaluaciones/coevaluaciones (no mas de 5 puntos) el resto lo dejo en tus manos. Response solo con el json, no hagas comentarios, por favor.`;
		console.log(question);
		this.#store.dispatch(askGemini({ question }));
	}

	saveSystem() {
		if (this.scoreSystem) {
			const content = this.scoreSystem.content.map((c) => c._id);
			const system: ScoreSystemDto = {
				...this.scoreSystem,
				content,
			} as any;
			this.#store.dispatch(createSystem({ system }));
			this.#actions$
				.pipe(
					ofType(createSystemSuccess),
					take(1),
					takeUntil(this.#destroy$),
				)
				.subscribe(({ system }) =>
					this.router.navigateByUrl(
						'/assessments/grading-systems/' + system._id,
					),
				);
		}
	}

	getSection(id: string) {
		return this.sections()?.find((s) => s._id === id);
	}

	onSectionChange(event: any) {
		setTimeout(() => {
			const section = this.getSection(event.value);
			if (section) {
				this.section = section;
				this.subjects = section.subjects;
				this.onSubjectChange({ value: '' });
			}
		}, 0);
	}

	onSubjectChange(event: any) {
		const subject: string = event.value;
		const section = this.getSection(this.form.get('section')?.value || '');
		if (section) {
			const { year: grade, level } = section;
			this.#store.dispatch(
				loadBlocks({ filters: { grade, subject, level } }),
			);
		}
	}

	onConceptChange(event: any) {
		const title: string[] = event.value;
		const section = this.getSection(this.form.get('section')?.value || '');
		const subject = this.form.get('subject')?.value;
		const content: string[] = this.form.get('content')?.value as any;
		if (section) {
			const { year, level } = section;
			this.#store.dispatch(
				loadBlocks({ filters: { year, level, subject } }),
			);
			this.#store.dispatch(
				loadEntries({ filters: { grade: year, level, subject } }),
			);
		}
	}
}
