import { Component, effect, inject, input, OnInit } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'
import { MatIconModule } from '@angular/material/icon'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatSelectModule } from '@angular/material/select'
import {
	FormArray,
	FormBuilder,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms'
import { Rubric } from '../../../core'
import { Router, RouterLink } from '@angular/router'
import { ClassSection } from '../../../core'
import { PretifyPipe } from '../../../shared/pipes/pretify.pipe'
import { RubricComponent } from '../components/rubric.component'
import { UnitPlan } from '../../../core/models'
import { Subject, takeUntil } from 'rxjs'
import { IsPremiumComponent } from '../../../shared/ui/is-premium.component'
import { Store } from '@ngrx/store'
import { Actions, ofType } from '@ngrx/effects'
import { askGemini, createRubric, createRubricSuccess, loadBlocks, loadBlocksSuccess, loadEntries, loadSections, loadStudentsBySection, loadSubjectConceptLists, selectAiIsGenerating, selectAiSerializedResult, selectAllClassSections, selectAllCompetenceEntries, selectAllContentBlocks } from '../../../store'
import { selectAllLists } from '../../../store/subject-concept-lists/subject-concept-lists.selectors'
import { selectSectionStudents } from '../../../store/students/students.selectors'

@Component({
	selector: 'app-rubric-generator',
	imports: [
		ReactiveFormsModule,
		MatSelectModule,
		MatSnackBarModule,
		MatButtonModule,
		MatIconModule,
		MatFormFieldModule,
		MatInputModule,
		RouterLink,
		PretifyPipe,
		RubricComponent,
		IsPremiumComponent,
	],
	template: `
		<app-is-premium>
			<div>
				<div
					style="justify-content: space-between; align-items: center; display: flex;"
				>
					<h2>Generador de Rúbricas</h2>
					<button mat-button type="button" routerLink="/assessments/rubrics">
						<mat-icon>assignment</mat-icon>
						Mis R&uacute;bricas
					</button>
				</div>
				<div>
					<form
						[formGroup]="rubricForm"
						(ngSubmit)="onSubmit()"
						style="margin-top: 24px"
					>
						<div>
							<mat-form-field appearance="outline">
								<mat-label>T&iacute;tulo</mat-label>
								<input formControlName="title" matInput />
							</mat-form-field>
						</div>
						<div class="grid-3-cols">
							@if (sections().length) {
								<mat-form-field
									style="max-width: 100%"
									appearance="outline"
								>
									<mat-label>Curso</mat-label>
									<mat-select
										formControlName="section"
										(selectionChange)="
											onSelectSection($event)
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
							} @else {
								@if (!loading) {
									<div>
										<div>
											Para usar esta herramienta, primero
											tienes que crear una secci&oacute;n.
										</div>
										<div>
											<button
												mat-raised-button
												color="accent"
												type="button"
												[routerLink]="['/sections']"
											>
												Crear Una Secci&oacute;n
											</button>
										</div>
									</div>
								}
							}
							<mat-form-field appearance="outline">
								<mat-label>Asignatura</mat-label>
								<mat-select
									formControlName="subject"
									(selectionChange)="onSubjectSelect($event)"
								>
									@for (subject of subjects; track subject) {
										<mat-option [value]="subject">{{
											subject | pretify
										}}</mat-option>
									}
								</mat-select>
							</mat-form-field>
							<mat-form-field appearance="outline">
								<mat-label>Contenido</mat-label>
								<mat-select
									formControlName="content"
									(selectionChange)="onConceptSelect($event)"
								>
									@for (
										list of subjectConceptLists();
										track list
									) {
										@for (
											concept of list.concepts;
											track concept
										) {
											<mat-option [value]="concept">{{
												concept
											}}</mat-option>
										}
									}
								</mat-select>
							</mat-form-field>
							<mat-form-field appearance="outline">
								<mat-label>Tipo de R&uacute;brica</mat-label>
								<mat-select formControlName="rubricType">
									@for (type of rubricTypes; track type) {
										<mat-option [value]="type.id">{{
											type.label
										}}</mat-option>
									}
								</mat-select>
							</mat-form-field>
							<div>
								<mat-form-field appearance="outline">
									<mat-label>Evidencia o Actividad</mat-label>
									<input
										formControlName="activity"
										matInput
									/>
								</mat-form-field>
							</div>
							<div style="display: flex; gap: 12px">
								<mat-form-field appearance="outline">
									<mat-label>Calificación Mínima</mat-label>
									<input
										formControlName="minScore"
										matInput
									/>
								</mat-form-field>
								<mat-form-field appearance="outline">
									<mat-label>Calificación Máxima</mat-label>
									<input
										formControlName="maxScore"
										matInput
									/>
								</mat-form-field>
							</div>
						</div>
						<div>
							<mat-form-field appearance="outline">
								<mat-label>Indicadores de Logro</mat-label>
								<mat-select
									multiple
									formControlName="achievementIndicators"
								>
									@for (
										indicator of achievementIndicators;
										track indicator
									) {
										<mat-option [value]="indicator">{{
											indicator
										}}</mat-option>
									}
								</mat-select>
							</mat-form-field>
						</div>
						<div
							style="
								display: flex;
								justify-content: space-between;
								align-items: center;
							"
						>
							<h3>Niveles de desempe&ntilde;o</h3>
							<button
								type="button"
								mat-button
								[disabled]="rubricLevels.controls.length > 4"
								color="accent"
								(click)="addRubricLevel()"
							>
								<mat-icon>add</mat-icon>
								Agregar
							</button>
						</div>
						<div formArrayName="levels">
							@for (
								level of rubricLevels.controls;
								track $index
							) {
								<div
									style="
										display: grid;
										gap: 12px;
										grid-template-columns: 1fr 42px;
									"
								>
									<mat-form-field appearance="outline">
										<mat-label
											>Nivel #{{ $index + 1 }}</mat-label
										>
										<input
											[formControlName]="$index"
											matInput
										/>
									</mat-form-field>
									<button
										(click)="deleteLevel($index)"
										type="button"
										mat-icon-button
										color="warn"
										style="margin-top: 8px"
									>
										<mat-icon>delete</mat-icon>
									</button>
								</div>
							}
						</div>
						@if (
							rubric &&
							rubric.rubricType === 'Analítica (Global)' &&
							students.length === 0
						) {
							<div
								style="
									text-align: center;
									padding: 20px;
									background-color: #46a7f5;
									color: white;
									margin-bottom: 15px;
								"
							>
								Ya que no tienes alumnos registrados en esta
								secci&oacute;n, te hemos dejado espacios en
								blanco. Para mejores resultados, ve a la
								secci&oacute;n y registra tus estudiantes.
								<br />
								<br />
								<button
									[routerLink]="['/sections', rubric.section]"
									type="button"
									mat-raised-button
									color="link"
								>
									Detalles de la Secci&oacute;n
								</button>
							</div>
						}
						<div style="text-align: end">
							<button
								type="button"
								[disabled]="!rubric"
								mat-flat-button
								color="accent"
								style="margin-right: 12px;"
								(click)="save()"
							>
								<mat-icon>save</mat-icon>
								Guardar
							</button>
							<button
								type="submit"
								[disabled]="rubricForm.invalid || generating()"
								mat-button
								[color]="rubric ? 'link' : 'primary'"
							>
								<mat-icon>bolt</mat-icon>
								{{
									generating()
										? 'Generando...'
										: rubric
											? 'Regenerar'
											: 'Generar'
								}}
							</button>
						</div>
					</form>
				</div>
			</div>

			@if (rubric) {
				<div
					style="
						margin-top: 24px;
						width: fit-content;
						margin-left: auto;
						margin-right: auto;
					"
				>
					<div style="width: fit-content">
						<app-rubric [rubric]="rubric"></app-rubric>
					</div>
				</div>
			}
		</app-is-premium>
	`,
	styles: `
		.grid-3-cols {
			display: grid;
			gap: 12px;
			grid-template-columns: 1fr;

			@media screen and (min-width: 960px) {
				grid-template-columns: repeat(2, 1fr);
			}

			@media screen and (min-width: 1200px) {
				grid-template-columns: repeat(3, 1fr);
			}

			& > div {
				max-width: 100%;
			}
		}

		mat-form-field {
			width: 100%;
			max-width: 100%;
		}

		mat-select,
		select,
		input,
		textarea {
			max-width: 100%;
		}

		table {
			border-collapse: collapse;
			border: 1px solid #ccc;
		}

		td,
		tr,
		th {
			border: 1px solid #ccc;
		}

		td,
		th {
			padding: 12px;
		}
	`,
})
export class RubricGeneratorComponent implements OnInit {
	#store = inject(Store)
	#actions$ = inject(Actions)
	private sb = inject(MatSnackBar)
	private fb = inject(FormBuilder)
	private router = inject(Router)

	private pretify = (new PretifyPipe()).transform

	unitPlan = input<UnitPlan | null>(null)

	sections = this.#store.selectSignal(selectAllClassSections)
	subjects: string[] = []
	contentBlocks = this.#store.selectSignal(selectAllContentBlocks)
	competenceEntries = this.#store.selectSignal(selectAllCompetenceEntries)
	subjectConceptLists = this.#store.selectSignal(selectAllLists)
	achievementIndicators: string[] = []

	aiResult = this.#store.selectSignal(selectAiSerializedResult)

	// selected data
	section: ClassSection | null = null

	competence: string[] = []

	rubricTypes = [
		{ id: 'SINTETICA', label: 'Sintética (Una rubrica por estudiante)' },
		{
			id: 'ANALITICA',
			label: 'Analítica (Una rubrica para todos los estudiantes)',
		},
	]

	rubric: Rubric | null = null

	generating = this.#store.selectSignal(selectAiIsGenerating)
	loading = true

	students = this.#store.selectSignal(selectSectionStudents)

	#destroy$ = new Subject<void>()

	rubricForm = this.fb.group({
		title: [''],
		minScore: [
			40,
			[Validators.required, Validators.min(0), Validators.max(100)],
		],
		maxScore: [
			100,
			[Validators.required, Validators.min(5), Validators.max(100)],
		],
		section: ['', Validators.required],
		subject: ['', Validators.required],
		content: ['', Validators.required],
		activity: ['', Validators.required],
		scored: [true],
		rubricType: ['SINTETICA', Validators.required],
		achievementIndicators: [[] as string[]],
		levels: this.fb.array([
			this.fb.control('Receptivo'),
			this.fb.control('Resolutivo'),
			this.fb.control('Autónomo'),
			this.fb.control('Estratégico'),
		]),
	})

	constructor() {
		effect(() => {
			const result: {
				title?: string
				activity?: string
				criteria: {
					indicator: string
					maxScore: number
					criterion: { name: string, score: number }[]
				}[]
			} = this.aiResult()
			if (!result) return

			if (result.activity) {
				this.rubricForm.patchValue({
					title: result.title,
					activity: result.activity,
				})
			} else {
				const {title, rubricType, section, achievementIndicators, activity, levels} = this.rubricForm.getRawValue()
	
				const rubric: any = {
					criteria: result.criteria,
					title: result.title ? result.title : title,
					rubricType,
					section,
					competence: this.competence,
					achievementIndicators,
					activity,
					progressLevels: levels,
					user: this.section?.user,
				}
				this.rubric = rubric
			}
		})
		effect(() => {
			const competenceEntries = this.competenceEntries()
			if (competenceEntries.length) {
				this.competence = competenceEntries.flatMap((entry) => entry.entries)
			}
		})
	}

	ngOnInit() {
		this.#store.dispatch(loadSections())
		const unitPlan = this.unitPlan()
		if (unitPlan) {
			this.rubricForm.patchValue({
				section: unitPlan.section._id,
				subject: unitPlan.subjects[0] || '',
				content: unitPlan.contents.length
					? unitPlan.contents[0].concepts.length
						? unitPlan.contents[0].concepts[0]
						: ''
					: '',
				activity: `Evaluación del plan de unidad: ${unitPlan.title}`,
				achievementIndicators: unitPlan.contents.flatMap(
					(c) => c.achievement_indicators,
				),
			})
			this.onSelectSection({ value: unitPlan.section._id })
			this.onSubjectSelect({ value: unitPlan.subjects[0] })
			if (
				unitPlan.contents.length &&
				unitPlan.contents[0].concepts.length
			)
				this.onConceptSelect({
					value: unitPlan.contents[0].concepts[0],
				})
		}
	}

	ngOnDestroy() {
		this.#destroy$.next()
		this.#destroy$.complete()
	}

	loadContentBlocks() {
		this.loading = true
	}

	onSelectSection(event: any) {
		const id = event.value
		const section = this.sections().find((s) => s._id === id)
		if (section) {
			this.section = section
			this.subjects = section.subjects
		}
	}

	onSubjectSelect(event: any) {
		const subject = event.value
		if (this.section) {
			this.#store.dispatch(loadSubjectConceptLists({
				filters: {
					subject,
					grade: this.section.year,
					level: this.section.level,
				}
			}))
		}
	}

	onConceptSelect(event: any) {
		const concept = event.value
		const subject = this.rubricForm.get('subject')?.value || ''
		if (this.section) {
			const question = `Necesito que me sugieras un titulo breve y conciso para una rubrica de evaluacion para ${this.pretify(subject)} de ${this.pretify(this.section.year)} de ${this.pretify(this.section.level)} (Republica Dominicana), cuyo contenido es "${concept}". El titulo debe ser en maximo 8 palabras y debe resumir el contenido a evaluar. Tambien vas a sugerir una actividad a realizar, esta tambien debe ser breve y concisa, en maximo 12 palabras. Tu respuesta debe ser un json valido con esta interfaz: { title: string activity: string }. Evita incluir "Rubrica", "Evaluacion", la asignatura o el grado en el titulo, simplemente el titulo de la actividad que se va a realizar, algunos ejemplos validos son: "Comunicamos las conclusiones de nuestros experimentos de fosilización", "Leemos y aprendemos con el cuento 'La sombrilla que perdió los colores'" o "Escribiendo cuentos sobre el futuro". Evita explicar la actividad, esta debe ser suficientemente sugerente para que un docente, incluso sin experiencia, la entienda.`
			this.#store.dispatch(askGemini({ question }))
			this.#store.dispatch(loadEntries({ filters: {
				subject,
				grade: this.section.year,
				level: this.section.level,
			} }))
			this.#store.dispatch(loadBlocks({ filters: {
				subject,
				year: this.section.year,
				level: this.section.level,
				title: concept,
			}}))
			this.#actions$.pipe(ofType(loadBlocksSuccess), takeUntil(this.#destroy$)).subscribe(({ blocks }) => {
					blocks.forEach((block) => {
						const indicators: string[] = []
						block.achievement_indicators.forEach((indicator) => {
							if (!indicators.includes(indicator)) {
								indicators.push(indicator)
							}
						})
						this.achievementIndicators = indicators
						this.rubricForm.patchValue({
							achievementIndicators: indicators.slice(0, 3),
						})
					})
			})
		}
	}

	onSubmit() {
		this.loadStudents()
		this.createRubric(this.rubricForm.value)
	}

	loadStudents() {
		const { section: sectionId } = this.rubricForm.value
		if (sectionId) {
			this.#store.dispatch(loadStudentsBySection({ sectionId }))
		}
	}

	save() {
		const rubric: any = this.rubric
		if (this.unitPlan()) rubric.unitPlan = this.unitPlan()?._id

		this.#store.dispatch(createRubric({ rubric }))
		this.#actions$.pipe(ofType(createRubricSuccess), takeUntil(this.#destroy$)).subscribe((res) => {
			this.router.navigate(['/assessments', 'rubrics', res.rubric._id]).then(() => {
				this.sb.open('El instrumento ha sido guardado.', 'Ok', {
					duration: 2500,
				})
			})
		})
	}

	createRubric(formValue: any) {
		const {
			title,
			minScore,
			maxScore,
			section,
			subject,
			content,
			activity,
			scored,
			rubricType,
			levels,
			achievementIndicators,
		} = formValue
		if (!this.section) return
		const data: any = {
			title,
			minScore,
			maxScore,
			level: this.section.level,
			grade: this.section.year,
			section,
			subject: this.pretify(subject),
			content,
			activity,
			scored,
			rubricType,
			achievementIndicators,
			competence: this.competence,
			levels,
		}
		const question = `Necesito que me construyas en contenido de una rubrica ${rubricType === 'SINTETICA' ? 'Sintética (Una rubrica por estudiante)' : 'Analítica (Una rubrica para todos los estudiantes)'} para evaluar el contenido de "${content}" de ${data.subject} de ${this.section.year} grado de educación ${this.section.level}.
La rubrica sera aplicada tras esta actividad/evidencia: ${activity}.${scored ? ' La rubrica tendra un valor de ' + minScore + ' a ' + maxScore + ' puntos.' : ''}
Los criterios a evaluar deben estar basados en estos indicadores de logro:
- ${achievementIndicators.join('\n- ')}
Cada criterio tendra ${levels.length} niveles de desempeño: ${levels.map((el: string, i: number) => i + ') ' + el).join(', ')}.
Tu respuesta debe ser un json valido con esta interfaz:
{${title ? '' : '\n\ttitle: string'}
  criteria: { // un objeto 'criteria' por cada indicador/criterio a evaluar
    indicator: string, // indicador a evaluar
    maxScore: number, // maxima calificacion para este indicador
    criterion: { // array de niveles de desempeño del estudiante acorde a los niveles proporcionados
      name: string, // criterio que debe cumplir (descripcion, osea que si el indicador es 'Lee y comprende el cuento', un criterio seria 'Lee el cuento deficientemente', otro seria 'Lee el cuento pero no comprende su contenido' y otro seria 'Lee el cuento de manera fluida e interpreta su contenido')
      score: number, // calificacion a asignar
    }[]
  }[]
}`
		this.#store.dispatch(askGemini({ question }))
	}

	addRubricLevel() {
		this.rubricLevels.push(this.fb.control(''))
	}

	deleteLevel(pos: number) {
		this.rubricLevels.removeAt(pos)
	}

	yearIndex(grade: string): number {
		return [
			'PRIMERO',
			'SEGUNDO',
			'TERCERO',
			'CUARTO',
			'QUINTO',
			'SEXTO',
		].indexOf(grade)
	}

	get rubricLevels() {
		return this.rubricForm.get('levels') as FormArray
	}
}
