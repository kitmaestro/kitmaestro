import {
	Component,
	signal,
	inject,
	ChangeDetectionStrategy,
	OnInit,
	OnDestroy,
	ViewEncapsulation,
	computed,
} from '@angular/core';
import {
	FormBuilder,
	ReactiveFormsModule,
	Validators,
	AbstractControl,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
	Subject,
	firstValueFrom,
	takeUntil,
	tap,
	catchError,
	EMPTY,
	finalize,
	switchMap,
	filter,
	map,
	distinctUntilChanged,
} from 'rxjs';

// Angular Material Modules
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';

// --- Services ---
import { AiService } from '../../../core/services/ai.service';
import { ClassSectionService } from '../../../core/services/class-section.service'; // Service for sections
import { SubjectConceptListService } from '../../../core/services/subject-concept-list.service'; // Service for concepts

// --- Interfaces ---
import { ClassSection } from '../../../core/interfaces/class-section';

// --- DOCX Generation ---
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';
import { MarkdownComponent } from 'ngx-markdown';
import { PretifyPipe } from '../../../shared/pipes/pretify.pipe';

// --- Constants ---
const OTHER_DISCIPLINE_VALUE = 'Otra'; // Constant for the 'Other' option value

@Component({
	selector: 'app-sports-practice-generator', // Component selector
	standalone: true,
	imports: [
		CommonModule,
		ReactiveFormsModule,
		MatCardModule,
		MatFormFieldModule,
		MatSelectModule,
		MatInputModule,
		MatButtonModule,
		MatProgressSpinnerModule,
		MatSnackBarModule,
		MatIconModule,
		MarkdownComponent,
		PretifyPipe,
	],
	// --- Inline Template ---
	template: `
		<mat-card class="sports-practice-card">
			<mat-card-header>
				<mat-card-title
					>Generador de Prácticas Deportivas</mat-card-title
				>
				<mat-card-subtitle
					>Obtén planes de entrenamiento detallados para tus
					clases</mat-card-subtitle
				>
			</mat-card-header>

			<mat-card-content>
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
								<mat-select formControlName="section" required>
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
											<mat-option [value]="section._id"
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
									sectionCtrl?.invalid && sectionCtrl?.touched
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
								<mat-select formControlName="subject" required>
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
									subjectCtrl?.invalid && subjectCtrl?.touched
								) {
									<mat-error
										>Selecciona una asignatura.</mat-error
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
									>Disciplina Deportiva / Concepto</mat-label
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
										@for (
											concept of availableConcepts();
											track concept
										) {
											<mat-option [value]="concept">{{
												concept
											}}</mat-option>
										}
										@if (
											!availableConcepts().length &&
											subjectCtrl?.valid &&
											!isLoadingConcepts()
										) {
											<mat-option disabled
												>No hay conceptos/disciplinas
												para esta
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
								mat-raised-button
								color="primary"
								type="submit"
								[disabled]="
									sportsPracticeForm.invalid || isGenerating()
								"
							>
								@if (isGenerating()) {
									<mat-spinner
										diameter="20"
										color="accent"
										class="inline-spinner"
									></mat-spinner>
									Generando...
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
					<div class="sports-practice-result">
						<h3>Plan de Práctica Generado:</h3>
						<div class="sports-practice-result-page">
							@if (generatedPlan()) {
								<markdown [data]="generatedPlan()" />
							}
						</div>

						<div class="result-actions">
							<button
								mat-stroked-button
								color="primary"
								(click)="goBack()"
							>
								<mat-icon>arrow_back</mat-icon> Volver
							</button>
							<button
								mat-raised-button
								color="primary"
								(click)="downloadDocx()"
								[disabled]="
									!generatedPlan() ||
									generatedPlan().startsWith(
										'Ocurrió un error'
									)
								"
							>
								<mat-icon>download</mat-icon> Descargar (.docx)
							</button>
						</div>
					</div>
				}
			</mat-card-content>
		</mat-card>
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
	// --- Dependencies ---
	#fb = inject(FormBuilder);
	#aiService = inject(AiService);
	#sectionService = inject(ClassSectionService);
	#conceptService = inject(SubjectConceptListService); // Renamed for clarity
	#snackBar = inject(MatSnackBar);
	#pretify = new PretifyPipe().transform;

	// --- State Signals ---
	isLoadingSections = signal(false);
	isLoadingConcepts = signal(false); // Separate loading for concepts
	isGenerating = signal(false);
	showResult = signal(false);
	generatedPlan = signal<string>('');
	sections = signal<ClassSection[]>([]);
	availableSubjects = signal<string[]>([]);
	availableConcepts = signal<string[]>([]); // For the discipline dropdown

	// --- Form Definition ---
	sportsPracticeForm = this.#fb.group({
		section: ['', Validators.required],
		subject: [{ value: '', disabled: true }, Validators.required],
		disciplineConcept: [{ value: '', disabled: true }, Validators.required],
		customDiscipline: [{ value: '', disabled: true }], // Initially disabled, conditionally required
	});

	// --- Lifecycle Management ---
	#destroy$ = new Subject<void>();

	// --- Computed Values ---
	// Determine the final discipline to use for the prompt
	finalDiscipline = computed(() => {
		const concept = this.disciplineConceptCtrl?.value;
		const custom = this.customDisciplineCtrl?.value;
		return concept === OTHER_DISCIPLINE_VALUE ? custom?.trim() : concept;
	});

	// --- OnInit ---
	ngOnInit(): void {
		this.#loadSections();
		this.#listenForSectionChanges();
		this.#listenForSubjectChanges(); // Listen for subject to load concepts
		this.#listenForDisciplineConceptChanges(); // Listen for 'Other' selection
	}

	// --- OnDestroy ---
	ngOnDestroy(): void {
		this.#destroy$.next();
		this.#destroy$.complete();
	}

	// --- Private Data Loading and Listener Methods ---

	#loadSections(): void {
		this.isLoadingSections.set(true);
		this.#sectionService
			.findSections()
			.pipe(
				takeUntil(this.#destroy$),
				tap((sections) => this.sections.set(sections || [])),
				catchError((error) =>
					this.#handleError(error, 'Error al cargar las secciones.'),
				),
				finalize(() => this.isLoadingSections.set(false)),
			)
			.subscribe();
	}

	#listenForSectionChanges(): void {
		this.sectionCtrl?.valueChanges
			.pipe(
				takeUntil(this.#destroy$),
				tap((sectionId) => {
					// Reset dependent fields
					this.subjectCtrl?.reset();
					this.subjectCtrl?.disable();
					this.disciplineConceptCtrl?.reset();
					this.disciplineConceptCtrl?.disable();
					this.customDisciplineCtrl?.reset();
					this.customDisciplineCtrl?.disable();
					this.availableSubjects.set([]);
					this.availableConcepts.set([]);

					if (sectionId) {
						const selectedSection = this.sections().find(
							(s) => s._id === sectionId,
						);
						if (selectedSection?.subjects?.length) {
							this.availableSubjects.set(
								selectedSection.subjects,
							);
							this.subjectCtrl?.enable();
						}
					}
				}),
			)
			.subscribe();
	}

	#listenForSubjectChanges(): void {
		this.subjectCtrl?.valueChanges
			.pipe(
				takeUntil(this.#destroy$),
				filter((subject) => !!subject && !!this.sectionCtrl?.value), // Ensure both section and subject are selected
				distinctUntilChanged(), // Avoid redundant calls if subject re-selected
				tap(() => {
					// Reset concept fields before loading new ones
					this.disciplineConceptCtrl?.reset();
					this.disciplineConceptCtrl?.disable();
					this.customDisciplineCtrl?.reset();
					this.customDisciplineCtrl?.disable();
					this.availableConcepts.set([]);
					this.isLoadingConcepts.set(true); // Set loading before async call
				}),
				switchMap((subject) => {
					// Use switchMap to handle async concept loading
					const sectionId = this.sectionCtrl?.value;
					const selectedSection = this.sections().find(
						(s) => s._id === sectionId,
					);
					if (!selectedSection || !subject) {
						return EMPTY; // Should not happen due to filter, but good practice
					}
					const filterParams = {
						level: selectedSection.level,
						grade: selectedSection.year,
						subject: subject,
					};
					return this.#conceptService.findAll(filterParams).pipe(
						takeUntil(this.#destroy$), // Ensure inner observable is also cleaned up
						map((conceptLists) => {
							// Flatten concepts from all returned lists and make unique
							const concepts =
								conceptLists?.flatMap(
									(list) => list.concepts || [],
								) || [];
							return [...new Set(concepts)]; // Unique concepts
						}),
						catchError((error) =>
							this.#handleError(
								error,
								'Error al cargar disciplinas/conceptos.',
							),
						),
						finalize(() => this.isLoadingConcepts.set(false)),
					);
				}),
				tap((concepts) => {
					this.availableConcepts.set(concepts);
					this.disciplineConceptCtrl?.enable(); // Enable concept dropdown
				}),
			)
			.subscribe();
	}

	#listenForDisciplineConceptChanges(): void {
		this.disciplineConceptCtrl?.valueChanges
			.pipe(
				takeUntil(this.#destroy$),
				distinctUntilChanged(), // Only react on actual change
			)
			.subscribe((value) => {
				if (value === OTHER_DISCIPLINE_VALUE) {
					this.customDisciplineCtrl?.enable();
					this.customDisciplineCtrl?.setValidators(
						Validators.required,
					);
				} else {
					this.customDisciplineCtrl?.disable();
					this.customDisciplineCtrl?.clearValidators();
					this.customDisciplineCtrl?.reset(); // Clear value if not 'Other'
				}
				this.customDisciplineCtrl?.updateValueAndValidity(); // Apply changes
			});
	}

	#handleError(error: any, defaultMessage: string) {
		console.error(defaultMessage, error);
		this.#snackBar.open(defaultMessage, 'Cerrar', { duration: 5000 });
		return EMPTY; // Return empty observable to gracefully handle error in chain
	}

	// --- Public Methods ---

	/** Formats section display name */
	getSectionDisplay(section: ClassSection): string {
		return `${section.year || ''} ${section.name || ''} (${section.level || 'Nivel no especificado'})`;
	}

	/** Handles form submission */
	async onSubmit(): Promise<void> {
		if (this.sportsPracticeForm.invalid) {
			this.sportsPracticeForm.markAllAsTouched();
			return;
		}

		this.isGenerating.set(true);
		this.generatedPlan.set('');
		this.showResult.set(false);

		const formValue = this.sportsPracticeForm.getRawValue();
		const selectedSection = this.sections().find(
			(s) => s._id === formValue.section,
		);
		const discipline = this.finalDiscipline(); // Use computed signal

		if (!discipline) {
			this.#snackBar.open(
				'Por favor, selecciona o introduce una disciplina válida.',
				'Cerrar',
				{ duration: 3000 },
			);
			this.isGenerating.set(false);
			return;
		}

		// Construct the prompt for a sports practice plan
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

      IMPORTANTE: El lenguaje debe ser extremadamente claro y directo, asumiendo CERO conocimiento previo del profesor sobre ${discipline}. Solo devuelve el plan, sin saludos ni despedidas.`;

		try {
			const result = await firstValueFrom(
				this.#aiService.geminiAi(prompt),
			);
			this.generatedPlan.set(
				result?.response || 'No se pudo generar el plan de práctica.',
			);
			this.showResult.set(true);
		} catch (error) {
			this.generatedPlan.set(
				'Ocurrió un error al generar el plan. Por favor, inténtalo de nuevo.',
			);
			this.showResult.set(true); // Show error in result area
			this.#handleError(error, 'Error al contactar el servicio de IA');
		} finally {
			this.isGenerating.set(false);
		}
	}

	/** Resets the form and view */
	goBack(): void {
		this.showResult.set(false);
		this.generatedPlan.set('');
		this.sportsPracticeForm.reset();
		// Explicitly disable controls that depend on others
		this.subjectCtrl?.disable();
		this.disciplineConceptCtrl?.disable();
		this.customDisciplineCtrl?.disable();
		this.availableSubjects.set([]);
		this.availableConcepts.set([]);
	}

	/** Downloads the generated plan as DOCX */
	downloadDocx(): void {
		const planText = this.generatedPlan();
		if (!planText || planText.startsWith('Ocurrió un error')) return;

		const formValue = this.sportsPracticeForm.getRawValue();
		const section = this.sections().find(
			(s) => s._id === formValue.section,
		);
		const discipline = this.finalDiscipline();

		// Sanitize filename parts
		const sectionName = (section?.name || 'Seccion').replace(
			/[^a-z0-9]/gi,
			'_',
		);
		const subjectName = (formValue.subject || 'Asignatura').replace(
			/[^a-z0-9]/gi,
			'_',
		);
		const disciplineName = (discipline || 'Disciplina')
			.substring(0, 20)
			.replace(/[^a-z0-9]/gi, '_');

		const filename = `PlanPractica_${sectionName}_${subjectName}_${disciplineName}.docx`;

		// Create paragraphs, splitting by newline characters
		const paragraphs = planText.split('\n').map(
			(line) =>
				new Paragraph({
					children: [new TextRun(line)],
					spacing: { after: 180 }, // Adjust spacing as needed
				}),
		);

		// Create the document
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
						...paragraphs, // Add the generated content paragraphs
					],
				},
			],
		});

		// Generate blob and trigger download
		Packer.toBlob(doc)
			.then((blob) => {
				saveAs(blob, filename);
			})
			.catch((error) => {
				console.error('Error creating DOCX file:', error);
				this.#snackBar.open(
					'Error al generar el archivo DOCX',
					'Cerrar',
					{ duration: 3000 },
				);
			});
	}

	// --- Getters for easier access to form controls ---
	get sectionCtrl(): AbstractControl | null {
		return this.sportsPracticeForm.get('section');
	}
	get subjectCtrl(): AbstractControl | null {
		return this.sportsPracticeForm.get('subject');
	}
	get disciplineConceptCtrl(): AbstractControl | null {
		return this.sportsPracticeForm.get('disciplineConcept');
	}
	get customDisciplineCtrl(): AbstractControl | null {
		return this.sportsPracticeForm.get('customDiscipline');
	}
}
