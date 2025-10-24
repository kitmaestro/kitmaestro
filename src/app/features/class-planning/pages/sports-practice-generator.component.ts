import {
	Component,
	signal,
	inject,
	ChangeDetectionStrategy,
	OnInit,
	OnDestroy,
	ViewEncapsulation,
	computed,
} from '@angular/core'
import {
	FormBuilder,
	ReactiveFormsModule,
	Validators,
	AbstractControl,
} from '@angular/forms'
import { CommonModule } from '@angular/common'
import {
	Subject,
	takeUntil,
	tap,
	filter,
	distinctUntilChanged,
} from 'rxjs'

import { MatFormFieldModule } from '@angular/material/form-field'
import { MatSelectModule } from '@angular/material/select'
import { MatInputModule } from '@angular/material/input'
import { MatButtonModule } from '@angular/material/button'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'
import { MatIconModule } from '@angular/material/icon'

import { ClassSection } from '../../../core'

import { Document, Packer, Paragraph, TextRun } from 'docx'
import { saveAs } from 'file-saver'
import { MarkdownComponent } from 'ngx-markdown'
import { PretifyPipe } from '../../../shared/pipes/pretify.pipe'
import { IsPremiumComponent } from '../../../shared/ui/is-premium.component'
import { Store } from '@ngrx/store'
import {
	loadSections,
	selectAllClassSections,
	selectIsLoadingSections,
} from '../../../store/class-sections'
import { askGemini, loadSubjectConceptLists, selectAiIsGenerating, selectAiResult } from '../../../store'
import { selectAllLists, selectIsLoadingManyConcepts } from '../../../store/subject-concept-lists/subject-concept-lists.selectors'

const OTHER_DISCIPLINE_VALUE = 'Otra'

@Component({
	selector: 'app-sports-practice-generator',
	standalone: true,
	imports: [
		CommonModule,
		ReactiveFormsModule,
		MatFormFieldModule,
		MatSelectModule,
		MatInputModule,
		MatButtonModule,
		MatProgressSpinnerModule,
		MatSnackBarModule,
		MatIconModule,
		MarkdownComponent,
		PretifyPipe,
		IsPremiumComponent,
	],
	// --- Inline Template ---
	template: `
		<app-is-premium>
			<div class="sports-practice-card">
				<div>
					<h2>Generador de Prácticas Deportivas</h2>
				</div>

				<div>
					@if (!showResult()) {
						<form
							[formGroup]="sportsPracticeForm"
							(ngSubmit)="onSubmit()"
							class="sports-practice-form"
						>
							<div class="form-row">
								<mat-form-field
									appearance="outline"
									class="form-field"
								>
									<mat-label>Curso/Sección</mat-label>
									<mat-select
										formControlName="section"
										required
									>
										@if (isLoadingSections()) {
											<mat-option disabled
												><mat-spinner
													diameter="20"
													class="inline-spinner"
												></mat-spinner>
												Cargando...</mat-option
											>
										} @else {
											@for (
												section of sections();
												track section._id
											) {
												<mat-option
													[value]="section._id"
													>{{ section.name }} ({{
														section.level | pretify
													}})</mat-option
												>
											}
											@if (
												!sections().length &&
												!isLoadingSections()
											) {
												<mat-option disabled
													>No se encontraron
													secciones.</mat-option
												>
											}
										}
									</mat-select>
									@if (
										sectionCtrl?.invalid &&
										sectionCtrl?.touched
									) {
										<mat-error
											>Selecciona una sección.</mat-error
										>
									}
								</mat-form-field>

								<mat-form-field
									appearance="outline"
									class="form-field"
								>
									<mat-label>Asignatura</mat-label>
									<mat-select
										formControlName="subject"
										required
									>
										@for (
											subject of availableSubjects();
											track subject
										) {
											<mat-option [value]="subject">{{
												subject | pretify
											}}</mat-option>
										}
										@if (
											!availableSubjects().length &&
											sectionCtrl?.valid
										) {
											<mat-option disabled
												>No hay asignaturas para esta
												sección.</mat-option
											>
										}
										@if (!sectionCtrl?.valid) {
											<mat-option disabled
												>Selecciona una sección
												primero.</mat-option
											>
										}
									</mat-select>
									@if (
										subjectCtrl?.invalid &&
										subjectCtrl?.touched
									) {
										<mat-error
											>Selecciona una
											asignatura.</mat-error
										>
									}
								</mat-form-field>
							</div>

							<div class="form-row">
								<mat-form-field
									appearance="outline"
									class="form-field"
								>
									<mat-label
										>Disciplina Deportiva /
										Concepto</mat-label
									>
									<mat-select
										formControlName="disciplineConcept"
										required
									>
										@if (isLoadingConcepts()) {
											<mat-option disabled
												><mat-spinner
													diameter="20"
													class="inline-spinner"
												></mat-spinner>
												Cargando...</mat-option
											>
										} @else {
											@for (concept of availableConcepts(); track concept) {
												<mat-option [value]="concept">{{ concept }}</mat-option>
											}
											@if (
												!availableConcepts().length &&
												subjectCtrl?.valid &&
												!isLoadingConcepts()
											) {
												<mat-option disabled
													>No hay
													conceptos/disciplinas para
													esta
													asignatura/grado.</mat-option
												>
												<mat-option [value]="'Otra'">{{
													'Otra'
												}}</mat-option>
											} @else if (
												availableConcepts().length > 1
											) {
												<mat-option [value]="'Otra'">{{
													'Otra'
												}}</mat-option>
											}
										}
										@if (!subjectCtrl?.valid) {
											<mat-option disabled
												>Selecciona sección y asignatura
												primero.</mat-option
											>
										}
									</mat-select>
									@if (
										disciplineConceptCtrl?.invalid &&
										disciplineConceptCtrl?.touched
									) {
										<mat-error
											>Selecciona o escribe una
											disciplina.</mat-error
										>
									}
								</mat-form-field>

								@if (disciplineConceptCtrl?.value === 'Otra') {
									<mat-form-field
										appearance="outline"
										class="form-field"
									>
										<mat-label
											>Escribe la disciplina
											personalizada</mat-label
										>
										<input
											matInput
											formControlName="customDiscipline"
											required
											placeholder="Ej: Ultimate Frisbee, Yoga Infantil"
										/>
										@if (
											customDisciplineCtrl?.invalid &&
											customDisciplineCtrl?.touched
										) {
											<mat-error
												>Ingresa la disciplina
												personalizada.</mat-error
											>
										}
									</mat-form-field>
								}
							</div>

							<div class="form-actions">
								<button
									mat-button
									color="primary"
									type="submit"
									[disabled]="
										sportsPracticeForm.invalid ||
										isGenerating()
									"
								>
									@if (isGenerating()) {
										<div style="display: flex; gap: 8px;">
											<mat-spinner
												diameter="20"
												color="accent"
												class="inline-spinner"
											></mat-spinner>
											<span> Generando... </span>
										</div>
									} @else {
										<ng-container>
											<mat-icon>fitness_center</mat-icon>
											Generar Plan de Práctica
										</ng-container>
									}
								</button>
							</div>
						</form>
					}

					@if (showResult()) {
						@if (isGenerating()) {
							<div style="display: flex; gap: 8px;">
								<mat-spinner
									diameter="20"
									color="accent"
									class="inline-spinner"
								></mat-spinner>
								<span> Generando... </span>
							</div>
						} @else {
							<div class="sports-practice-result">
								<h3>Plan de Práctica Generado:</h3>
								<div class="sports-practice-result-page">
									@if (generatedPlan()) {
										<markdown [data]="generatedPlan()" />
									}
								</div>

								<div class="result-actions">
									<button
										mat-button
										color="primary"
										(click)="goBack()"
									>
										<mat-icon>arrow_back</mat-icon> Volver
									</button>
									<button
										mat-flat-button
										color="primary"
										(click)="downloadDocx()"
										[disabled]="
											!generatedPlan() ||
											generatedPlan()?.startsWith(
												'Ocurrió un error'
											)
										"
									>
										<mat-icon>download</mat-icon> Descargar
										(.docx)
									</button>
								</div>
							</div>
						}
					}
				</div>
			</div>
		</app-is-premium>
	`,
	// --- Inline Styles ---
	styles: [
		`
			:host {
				display: block; /* No host padding/margin */
			}
			.sports-practice-card {
				/* No max-width */
				margin: 0 auto;
				padding: 15px 25px 25px 25px;
			}
			.sports-practice-form {
				margin-top: 16px;
				display: flex;
				flex-direction: column;
				gap: 15px;
			}
			.form-row {
				display: flex;
				gap: 15px;
				flex-wrap: wrap;
			}
			.form-field {
				flex: 1;
				min-width: 250px;
			}
			.form-actions {
				display: flex;
				justify-content: flex-end;
				margin-top: 20px;
			}
			.form-actions button mat-icon,
			.result-actions button mat-icon {
				margin-right: 5px;
				vertical-align: middle;
			}
			.inline-spinner {
				display: inline-block;
				margin-right: 8px;
				vertical-align: middle;
			}
			.sports-practice-result {
				margin-top: 20px;
			}
			.sports-practice-result h3 {
				margin-bottom: 15px;
			}
			.sports-practice-result-page {
				background-color: #fff;
				border: 1px solid #e0e0e0;
				padding: 30px 40px;
				min-height: 300px;
				box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
				line-height: 1.6;
				font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
				font-size: 11pt;
				margin-bottom: 20px;
				max-width: 100%;
				white-space: pre-wrap; /* Preserve whitespace for plans */
			}
			.result-actions {
				display: flex;
				justify-content: space-between;
				margin-top: 20px;
				flex-wrap: wrap;
				gap: 10px;
			}
		`,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
})
export class SportsPracticeGeneratorComponent implements OnInit, OnDestroy {
	#fb = inject(FormBuilder)
	#store = inject(Store)
	#snackBar = inject(MatSnackBar)
	#pretify = new PretifyPipe().transform

	isLoadingSections = this.#store.selectSignal(selectIsLoadingSections)
	isLoadingConcepts = this.#store.selectSignal(selectIsLoadingManyConcepts)
	isGenerating = this.#store.selectSignal(selectAiIsGenerating)
	showResult = signal(false)
	generatedPlan = this.#store.selectSignal(selectAiResult)
	sections = this.#store.selectSignal(selectAllClassSections)
	allConcepts = this.#store.selectSignal(selectAllLists)
	availableSubjects = signal<string[]>([])
	availableConcepts = computed(() => this.allConcepts().flatMap((c) => c.concepts))

	sportsPracticeForm = this.#fb.group({
		section: ['', Validators.required],
		subject: [{ value: '', disabled: true }, Validators.required],
		disciplineConcept: [{ value: '', disabled: true }, Validators.required],
		customDiscipline: [{ value: '', disabled: true }],
	})

	#destroy$ = new Subject<void>()

	finalDiscipline = computed(() => {
		const concept = this.disciplineConceptCtrl?.value
		const custom = this.customDisciplineCtrl?.value
		return concept === OTHER_DISCIPLINE_VALUE ? custom?.trim() : concept
	})

	ngOnInit(): void {
		this.#store.dispatch(loadSections())
		this.#listenForSectionChanges()
		this.#listenForSubjectChanges()
		this.#listenForDisciplineConceptChanges()
	}

	ngOnDestroy(): void {
		this.#destroy$.next()
		this.#destroy$.complete()
	}

	#listenForSectionChanges(): void {
		this.sectionCtrl?.valueChanges
			.pipe(
				takeUntil(this.#destroy$),
				tap((sectionId) => {
					this.subjectCtrl?.reset()
					this.subjectCtrl?.disable()
					this.disciplineConceptCtrl?.reset()
					this.disciplineConceptCtrl?.disable()
					this.customDisciplineCtrl?.reset()
					this.customDisciplineCtrl?.disable()

					if (sectionId) {
						const selectedSection = this.sections().find(
							(s) => s._id === sectionId,
						)
						if (selectedSection?.subjects?.length) {
							this.availableSubjects.set(
								selectedSection.subjects,
							)
							this.subjectCtrl?.enable()
						}
					}
				}),
			)
			.subscribe()
	}

	#listenForSubjectChanges(): void {
		this.subjectCtrl?.valueChanges
			.pipe(
				takeUntil(this.#destroy$),
				filter((subject) => !!subject && !!this.sectionCtrl?.value),
				distinctUntilChanged(),
				tap((subject) => {
					this.disciplineConceptCtrl?.reset()
					this.disciplineConceptCtrl?.disable()
					this.customDisciplineCtrl?.reset()
					this.customDisciplineCtrl?.disable()
					const section = this.sections()?.find((s) => s._id === this.sectionCtrl?.value)
					if (!section) return

					this.#store.dispatch(loadSubjectConceptLists({
						filters: {
							level: section.level,
							grade: section.year,
							subject,
						}
					}))
					this.disciplineConceptCtrl?.enable()
				}),
			)
			.subscribe()
	}

	#listenForDisciplineConceptChanges(): void {
		this.disciplineConceptCtrl?.valueChanges
			.pipe(
				takeUntil(this.#destroy$),
				distinctUntilChanged(),
			)
			.subscribe((value) => {
				if (value === OTHER_DISCIPLINE_VALUE) {
					this.customDisciplineCtrl?.enable()
					this.customDisciplineCtrl?.setValidators(
						Validators.required,
					)
				} else {
					this.customDisciplineCtrl?.disable()
					this.customDisciplineCtrl?.clearValidators()
					this.customDisciplineCtrl?.reset()
				}
				this.customDisciplineCtrl?.updateValueAndValidity()
			})
	}

	getSectionDisplay(section: ClassSection): string {
		return `${section.year || ''} ${section.name || ''} (${section.level || 'Nivel no especificado'})`
	}

	async onSubmit(): Promise<void> {
		if (this.sportsPracticeForm.invalid) {
			this.sportsPracticeForm.markAllAsTouched()
			return
		}

		this.showResult.set(false)

		const formValue = this.sportsPracticeForm.getRawValue()
		const selectedSection = this.sections().find(
			(s) => s._id === formValue.section,
		)
		const discipline = this.finalDiscipline()

		if (!discipline) {
			this.#snackBar.open(
				'Por favor, selecciona o introduce una disciplina válida.',
				'Cerrar',
				{ duration: 3000 },
			)
			return
		}

		const prompt = `Eres un asistente experto en educación física y planificación deportiva pedagógica.
Necesito crear un plan de práctica o guía de entrenamiento detallada para una clase, diseñada específicamente para que un profesor SIN EXPERIENCIA PREVIA en la disciplina pueda impartirla con éxito.

Contexto de la Clase:
- Nivel Educativo: ${this.#pretify(selectedSection?.level || 'No especificado')}
- Año/Grado: ${this.#pretify(selectedSection?.year || 'No especificado')}
- Asignatura Contenedora: ${this.#pretify(formValue.subject || '')}
- Disciplina Deportiva Específica: ${discipline}

Instrucciones para el Plan:
1.  **Objetivo Claro:** Define un objetivo simple y alcanzable para una sesión de clase (ej: introducción a las reglas básicas, práctica de un fundamento específico).
2.  **Calentamiento (Warm-up):** Describe ejercicios de calentamiento sencillos y seguros, apropiados para la edad/nivel (5-10 min).
3.  **Parte Principal (Main Activity):** Detalla paso a paso los ejercicios o actividades principales para enseñar/practicar la disciplina. Explica CÓMO hacer cada ejercicio de forma muy clara (como si hablaras con alguien que nunca lo ha hecho). Usa lenguaje simple. Divide en sub-pasos si es necesario. Incluye posibles puntos clave o errores comunes a evitar. (20-30 min).
4.  **Vuelta a la Calma (Cool-down):** Sugiere ejercicios de estiramiento suaves o una actividad relajante final (5 min).
5.  **Materiales:** Lista los materiales mínimos necesarios (conos, balones, etc.).
6.  **Adaptaciones/Variaciones:** Si es posible, sugiere 1-2 adaptaciones simples para diferentes niveles de habilidad dentro de la clase.
7.  **Enfoque:** Prioriza la seguridad, la participación, la diversión y el aprendizaje básico sobre la técnica avanzada.
8.  **Formato:** Estructura la respuesta claramente con títulos (Calentamiento, Parte Principal, etc.). Usa párrafos cortos y listas.

IMPORTANTE: El lenguaje debe ser extremadamente claro y directo, asumiendo CERO conocimiento previo del profesor sobre ${discipline}. Solo devuelve el plan, sin saludos ni despedidas ya que sera impreso tal cual, y no debe ser visto como un chat, sino como un documento especial, redactado por un docente.`

		this.#store.dispatch(askGemini({ question: prompt }))
		this.showResult.set(true)
	}

	goBack(): void {
		this.showResult.set(false)
		this.sportsPracticeForm.reset()
		this.subjectCtrl?.disable()
		this.disciplineConceptCtrl?.disable()
		this.customDisciplineCtrl?.disable()
		this.availableSubjects.set([])
	}

	downloadDocx(): void {
		const planText = this.generatedPlan()
		if (!planText || planText.startsWith('Ocurrió un error')) return

		const formValue = this.sportsPracticeForm.getRawValue()
		const section = this.sections().find(
			(s) => s._id === formValue.section,
		)
		const discipline = this.finalDiscipline()

		const sectionName = (section?.name || 'Seccion').replace(
			/[^a-z0-9]/gi,
			'_',
		)
		const subjectName = (formValue.subject || 'Asignatura').replace(
			/[^a-z0-9]/gi,
			'_',
		)
		const disciplineName = (discipline || 'Disciplina')
			.substring(0, 20)
			.replace(/[^a-z0-9]/gi, '_')

		const filename = `PlanPractica_${sectionName}_${subjectName}_${disciplineName}.docx`

		const paragraphs = planText.split('\n').map(
			(line) =>
				new Paragraph({
					children: [new TextRun(line)],
					spacing: { after: 180 },
				}),
		)

		const doc = new Document({
			sections: [
				{
					properties: {},
					children: [
						new Paragraph({
							children: [
								new TextRun({
									text: `Plan de Práctica Deportiva`,
									bold: true,
									size: 28,
								}),
							],
							spacing: { after: 300 },
						}),
						new Paragraph({
							children: [
								new TextRun({
									text: `Disciplina: ${discipline}`,
									bold: true,
									size: 26,
								}),
							],
							spacing: { after: 200 },
						}),
						new Paragraph({
							children: [
								new TextRun({
									text: `Sección: ${this.getSectionDisplay(section!)}`,
									size: 24,
								}),
							],
							spacing: { after: 100 },
						}),
						new Paragraph({
							children: [
								new TextRun({
									text: `Asignatura: ${formValue.subject}`,
									size: 24,
								}),
							],
							spacing: { after: 400 },
						}),
						...paragraphs,
					],
				},
			],
		})

		Packer.toBlob(doc)
			.then((blob) => {
				saveAs(blob, filename)
			})
			.catch((error) => {
				console.error('Error creating DOCX file:', error)
				this.#snackBar.open(
					'Error al generar el archivo DOCX',
					'Cerrar',
					{ duration: 3000 },
				)
			})
	}

	get sectionCtrl(): AbstractControl | null {
		return this.sportsPracticeForm.get('section')
	}
	get subjectCtrl(): AbstractControl | null {
		return this.sportsPracticeForm.get('subject')
	}
	get disciplineConceptCtrl(): AbstractControl | null {
		return this.sportsPracticeForm.get('disciplineConcept')
	}
	get customDisciplineCtrl(): AbstractControl | null {
		return this.sportsPracticeForm.get('customDiscipline')
	}
}
