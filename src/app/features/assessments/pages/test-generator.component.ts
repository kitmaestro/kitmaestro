import { Component, effect, inject, OnInit, signal } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { MatIconModule } from '@angular/material/icon'
import { MatSelectModule } from '@angular/material/select'
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'
import { MatInputModule } from '@angular/material/input'
import { MatFormFieldModule } from '@angular/material/form-field'
import { Router, RouterLink } from '@angular/router'
import { ClassSection } from '../../../core'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { PretifyPipe } from '../../../shared/pipes/pretify.pipe'
import { MarkdownComponent } from 'ngx-markdown'
import { Test } from '../../../core'
import { IsPremiumComponent } from '../../../shared/ui/is-premium.component'
import { Store } from '@ngrx/store'
import { askGemini, askGeminiFailure, createTest, createTestFailed, createTestSuccess, loadSections, selectAiIsGenerating, selectAiResult, selectAllClassSections, selectAuthUser, selectIsLoadingSections } from '../../../store'
import { selectIsCreating } from '../../../store/tests/tests.selectors'
import { filter, Subject, takeUntil } from 'rxjs'
import { Actions, ofType } from '@ngrx/effects'

@Component({
	selector: 'app-test-generator',
	imports: [
		MatCardModule,
		MatButtonModule,
		MatIconModule,
		MatSelectModule,
		MatInputModule,
		MatSnackBarModule,
		MatFormFieldModule,
		ReactiveFormsModule,
		MarkdownComponent,
		RouterLink,
		PretifyPipe,
		IsPremiumComponent,
	],
	template: `
		<app-is-premium>
			<div>
				<div
					style="justify-content: space-between; align-items: center; display: flex;"
				>
					<h2>Generador de Exámenes</h2>
					<button mat-button routerLink="/assessments/tests">
						Mis Ex&aacute;menes
					</button>
				</div>
				<div>
					<div style="margin-top: 24px">
						<form [formGroup]="testForm" (ngSubmit)="onSubmit()">
							<div class="grid-2">
								<div>
									<mat-form-field appearance="outline">
										<mat-label>Grado</mat-label>
										<mat-select
											formControlName="section"
											(selectionChange)="
												onSectionSelect($event)
											"
										>
											@for (
												section of sections();
												track section._id
											) {
												<mat-option
													[value]="section._id"
													>{{
														section.name
													}}</mat-option
												>
											}
										</mat-select>
									</mat-form-field>
								</div>
								<div>
									<mat-form-field appearance="outline">
										<mat-label>Asignatura</mat-label>
										<mat-select formControlName="subject">
											@for (
												subject of subjects;
												track subject
											) {
												<mat-option [value]="subject">{{
													subject | pretify
												}}</mat-option>
											}
										</mat-select>
									</mat-form-field>
								</div>
							</div>
							<div>
								<mat-form-field appearance="outline">
									<mat-label>Tipos de Ejercicios</mat-label>
									<mat-select
										formControlName="items"
										multiple
									>
										@for (
											itemType of itemTypes;
											track itemType
										) {
											<mat-option [value]="itemType">{{
												itemType | pretify
											}}</mat-option>
										}
									</mat-select>
								</mat-form-field>
							</div>
							<div class="grid-2">
								<div>
									<mat-form-field appearance="outline">
										<mat-label
											>Cantidad de
											&Iacute;temes</mat-label
										>
										<input
											type="number"
											matInput
											formControlName="itemQuantity"
										/>
									</mat-form-field>
								</div>
								<div>
									<mat-form-field appearance="outline">
										<mat-label
											>Puntaje M&aacute;ximo</mat-label
										>
										<input
											type="number"
											matInput
											formControlName="maxScore"
										/>
									</mat-form-field>
								</div>
							</div>
							<div>
								<mat-form-field appearance="outline">
									<mat-label
										>Temas (Un tema por
										l&iacute;nea)</mat-label
									>
									<textarea
										matInput
										formControlName="topics"
									></textarea>
								</mat-form-field>
							</div>
							<div style="display: flex; gap: 12px; justify-content: flex-end">
								<button
									mat-flat-button
									[disabled]="!test || saving()"
									(click)="save()"
									type="button"
								>
									<mat-icon>save</mat-icon> Guardar
								</button>
								<button
									mat-button
									[disabled]="testForm.invalid || generating()"
									type="submit"
								>
									<mat-icon>bolt</mat-icon>
									{{ generating() ? 'Generando...' : test ? 'Regenerar' : 'Generar' }}
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
			@if (result()) {
				<div style="margin-top: 24px">
					<div style="max-width: 8.5in; margin: 0 auto">
						<div>
							<div>
								<markdown [data]="result()"></markdown>
							</div>
						</div>
					</div>
				</div>
			}
		</app-is-premium>
	`,
	styles: `
		mat-form-field {
			width: 100%;
		}

		.grid-2 {
			display: grid;
			gap: 12px;
			grid-template-columns: 1fr 1fr;
		}
	`,
})
export class TestGeneratorComponent implements OnInit {
	#store = inject(Store);
	#actions$ = inject(Actions)
	private router = inject(Router)
	private sb = inject(MatSnackBar)
	private fb = inject(FormBuilder)

	loadingSections = this.#store.selectSignal(selectIsLoadingSections)
	generating = this.#store.selectSignal(selectAiIsGenerating)
	saving = this.#store.selectSignal(selectIsCreating)

	sections = this.#store.selectSignal(selectAllClassSections)
	user = this.#store.selectSignal(selectAuthUser)
	subjects: string[] = []
	section = signal<ClassSection | null>(null)
	result = this.#store.selectSignal(selectAiResult)
	test: Test | null = null

	destroy$ = new Subject<void>()

	itemTypes: string[] = [
		'Selección múltiple',
		'Verdadero o falso',
		'Respuesta corta',
		'Preguntas abiertas',
		'Emparejamiento',
		'Completar el espacio en blanco',
		'Pregunta de desarrollo',
		'Casos prácticos',
		'Interpretación de texto',
		'Ordena la oración',
		'Resolución de problemas',
	]

	testForm = this.fb.group({
		section: ['', Validators.required],
		subject: ['', Validators.required],
		topics: ['', Validators.required],
		items: [[] as string[], Validators.required],
		itemQuantity: [
			4,
			[Validators.required, Validators.min(3), Validators.max(10)],
		],
		maxScore: [
			30,
			[Validators.required, Validators.min(1), Validators.max(100)],
		],
	})

	constructor() {
		effect(() => {
			const result = this.result()
			const user = this.user()?._id
			const section = this.section()?._id

			if (result && user && section) {
				const test: any = {
					answers: '',
					body: result,
					section,
					subject: this.testForm.value.subject,
					user,
				}
				this.test = test as Test
			}
		})
	}

	ngOnInit() {
		this.#store.dispatch(loadSections())
	}

	ngOnDestroy() {
		this.destroy$.next()
		this.destroy$.complete()
	}

	onSectionSelect(event: any) {
		const sectionId: string = event.value
		const section = this.sections().find((s) => s._id === sectionId) || null
		if (section) {
			this.section.set(section)
			this.subjects = section.subjects
		}
	}

	pretify(str: string) {
		return new PretifyPipe().transform(str)
	}

	generate(formData: any) {
		const section = this.section()
		const user = this.user()
		if (!section || !user) return

		const d = new Date()
		const currentYear = d.getFullYear()
		const schoolYear =
			d.getMonth() > 7
				? `${currentYear} - ${currentYear + 1}`
				: `${currentYear - 1} - ${currentYear}`
		const question = `Eres un docente de ${this.pretify(section.year)} grado de ${this.pretify(section.level)}. Tienes que diseñar un examen de ${this.pretify(formData.subject)} para tus alumnos. Los tipos de itemes que vas a incluir en el examen son exactamente estos:
- ${formData.items.join('\n- ')}

Puedes poner hasta ${formData.itemQuantity} itemes en el examen.

Los temas que vas a evaluar con el examen son estos:
${formData.topics}

Asigna un puntaje a cada item del examen. El puntaje maximo del examen es de ${formData.maxScore}.
Tu respuesta debe ser en formato markdown, sin recomendaciones solo el examen y sin campos que yo deba agregar, necesito que este listo para imprimir, asi que si tienes que inventar un nombre, o una situacion imaginaria, por mi esta excelente.
Me gustaria qu el encabezado sea, el nombre de el centro en el que trabajo: # ${user.schoolName}
Luego mi nombre: ## ${user.title}. ${user.firstname} ${user.lastname}.
En la tercera linea, el grado en cuestion y el año escolar: ### ${this.pretify(section.name)} - año escolar ${schoolYear}
Y finalmente un espacio para que el alumno coloque su nombre y uno para la fecha.

Al final del examen, incluye un mensaje sencillo pero alentador o un 'Buena suerte'`
		this.#store.dispatch(askGemini({ question }))
		this.#actions$.pipe(ofType(askGeminiFailure),filter(e => !!e), takeUntil(this.destroy$)).subscribe((e) => {
			this.sb.open(e.error || 'Ha ocurrido un error al generar el examen.', 'Ok', { duration: 2500 })
		})
	}

	onSubmit() {
		this.generate(this.testForm.value)
	}

	save() {
		const test: any = this.test
		if (!test) return
		this.#store.dispatch(createTest({ test }))
		this.#actions$.pipe(ofType(createTestFailed),filter(e => !!e), takeUntil(this.destroy$)).subscribe(({ error }) => {
			this.sb.open(error || 'Ha ocurrido un error al guardar el examen.', 'Ok', { duration: 2500 })
		})
		this.#actions$.pipe(ofType(createTestSuccess),filter(e => !!e), takeUntil(this.destroy$)).subscribe(({ test }) => {
				if (test && test._id) {
					this.router.navigate(['/assessments', 'tests', test._id]).then(() => {
						this.sb.open('El examen ha sido guardado.', 'Ok', {
							duration: 2500,
						})
					})
				}
			})
	}
}
