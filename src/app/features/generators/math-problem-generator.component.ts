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
	Observable,
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

// --- Core Services & Interfaces (Using new structure paths) ---
import { AiService } from '../../core/services/ai.service';
import { ClassSectionService } from '../../core/services/class-section.service';
import { SubjectConceptListService } from '../../core/services/subject-concept-list.service';
import { ClassSection } from '../../core/interfaces/class-section';
import { PretifyPipe } from '../../shared/pipes/pretify.pipe';

// --- DOCX Generation ---
import { Document, Packer, Paragraph, AlignmentType, HeadingLevel } from 'docx'; // Import Numbering
import { saveAs } from 'file-saver';

// --- Constants ---
const OTHER_TOPIC_VALUE = 'Otro'; // Constant for the 'Other' option value
const MATH_SUBJECT = 'Matemática'; // Hardcoded subject for fetching topics

@Component({
	selector: 'app-math-problem-generator', // Component selector
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
	],
	// --- Inline Template ---
	template: `
		<mat-card class="math-problem-card">
			<mat-card-header>
				<mat-card-title
					>Generador de Problemas Matemáticos</mat-card-title
				>
				<mat-card-subtitle
					>Crea problemas contextualizados para tus clases de
					matemáticas</mat-card-subtitle
				>
			</mat-card-header>

			<mat-card-content>
				@if (!showResult()) {
					<form
						[formGroup]="mathProblemForm"
						(ngSubmit)="onSubmit()"
						class="math-problem-form"
					>
						<div class="form-row">
							<mat-form-field
								appearance="outline"
								class="form-field"
							>
								<mat-label>Curso/Sección (Grado)</mat-label>
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
											<mat-option [value]="section._id">{{
												getSectionDisplay(section)
											}}</mat-option>
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
								<mat-label>Tema Matemático</mat-label>
								<mat-select
									formControlName="topicConcept"
									required
								>
									@if (isLoadingTopics()) {
										<mat-option disabled
											><mat-spinner
												diameter="20"
												class="inline-spinner"
											></mat-spinner>
											Cargando temas...</mat-option
										>
									} @else {
										@for (
											topic of availableTopics();
											track topic
										) {
											<mat-option [value]="topic">{{
												topic
											}}</mat-option>
										}
										@if (
											!availableTopics().length &&
											sectionCtrl?.valid &&
											!isLoadingTopics()
										) {
											<mat-option disabled
												>No hay temas para esta
												sección.</mat-option
											>
											<mat-option [value]="'Otro'">{{
												'Otro'
											}}</mat-option>
										} @else if (
											availableTopics().length > 1 ||
											!isLoadingTopics()
										) {
											<mat-option [value]="'Otro'">{{
												'Otro'
											}}</mat-option>
										}
									}
									@if (!sectionCtrl?.valid) {
										<mat-option disabled
											>Selecciona una sección
											primero.</mat-option
										>
									}
								</mat-select>
								@if (
									topicConceptCtrl?.invalid &&
									topicConceptCtrl?.touched
								) {
									<mat-error
										>Selecciona o escribe un
										tema.</mat-error
									>
								}
							</mat-form-field>
						</div>

						<div class="form-row">
							@if (topicConceptCtrl?.value === 'Otro') {
								<mat-form-field
									appearance="outline"
									class="form-field full-width-field"
								>
									<mat-label
										>Escribe el tema matemático
										personalizado</mat-label
									>
									<input
										matInput
										formControlName="customTopic"
										required
										placeholder="Ej: Regla de tres simple, Teorema de Pitágoras"
									/>
									@if (
										customTopicCtrl?.invalid &&
										customTopicCtrl?.touched
									) {
										<mat-error
											>Ingresa el tema
											personalizado.</mat-error
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
									mathProblemForm.invalid || isGenerating()
								"
							>
								@if (isGenerating()) {
									<div
										[style]="{
											display: 'flex',
											alignItems: 'center',
										}"
									>
										<mat-spinner
											diameter="20"
											color="accent"
											class="inline-spinner"
										></mat-spinner>
										Generando...
									</div>
								} @else {
									<ng-container>
										<mat-icon>functions</mat-icon> Generar
										Problemas
									</ng-container>
								}
							</button>
						</div>
					</form>
				}

				@if (showResult()) {
					<div class="math-problem-result">
						<h3>Problemas Matemáticos Generados:</h3>
						<div
							class="math-problem-result-content"
							[innerHTML]="
								generatedProblems().replaceAll(
									'
',
									'<br>'
								)
							"
						></div>

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
									!generatedProblems() ||
									generatedProblems().startsWith(
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
				display: block;
			}
			.math-problem-card {
				margin: 0 auto;
				padding: 15px 25px 25px 25px;
			}
			.math-problem-form {
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
			.full-width-field {
				flex-basis: 100%;
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
			.math-problem-result {
				margin-top: 20px;
			}
			.math-problem-result h3 {
				margin-bottom: 15px;
			}
			.math-problem-result-content {
				background-color: #f3f3f3; /* Neutral light grey */
				border: 1px solid #dcdcdc;
				border-left: 5px solid #607d8b; /* Blue Grey accent */
				padding: 25px 35px;
				min-height: 250px;
				box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
				line-height: 1.7;
				font-family: 'Arial', sans-serif; /* Standard sans-serif */
				font-size: 11pt;
				margin-bottom: 20px;
				max-width: 100%;
				white-space: pre-wrap; /* Preserve formatting */
			}
			/* Style potential list numbers if AI uses them */
			.math-problem-result-content p[style*='text-indent'] {
				/* Example for indented paragraphs */
				margin-left: 20px;
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
export class MathProblemGeneratorComponent implements OnInit, OnDestroy {
	// --- Dependencies ---
	#fb = inject(FormBuilder);
	#aiService = inject(AiService);
	#sectionService = inject(ClassSectionService);
	#conceptService = inject(SubjectConceptListService);
	#snackBar = inject(MatSnackBar);

	#pretify = new PretifyPipe().transform;

	// --- State Signals ---
	isLoadingSections = signal(false);
	isLoadingTopics = signal(false); // Loading state for topics
	isGenerating = signal(false);
	showResult = signal(false);
	generatedProblems = signal<string>(''); // Stores the AI response string
	sections = signal<ClassSection[]>([]);
	availableTopics = signal<string[]>([]); // For the topic dropdown

	// --- Form Definition ---
	mathProblemForm = this.#fb.group({
		section: ['', Validators.required],
		topicConcept: [{ value: '', disabled: true }, Validators.required],
		customTopic: [{ value: '', disabled: true }], // Initially disabled, conditionally required
	});

	// --- Lifecycle Management ---
	#destroy$ = new Subject<void>();

	// --- Computed Values ---
	// Determine the final topic to use for the prompt
	finalTopic = computed(() => {
		const concept = this.topicConceptCtrl?.value;
		const custom = this.customTopicCtrl?.value;
		return concept === OTHER_TOPIC_VALUE ? custom?.trim() : concept;
	});

	// --- OnInit ---
	ngOnInit(): void {
		this.#loadSections();
		this.#listenForSectionChanges();
		this.#listenForTopicConceptChanges(); // Listen for 'Other' selection
	}

	// --- OnDestroy ---
	ngOnDestroy(): void {
		this.#destroy$.next();
		this.#destroy$.complete();
	}

	// --- Private Methods ---

	/** Loads sections */
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

	/** Loads Math topics when a section is selected */
	#loadMathTopics(sectionId: string): void {
		const selectedSection = this.sections().find(
			(s) => s._id === sectionId,
		);
		if (!selectedSection) return;

		this.isLoadingTopics.set(true);
		this.availableTopics.set([]); // Clear previous topics
		this.topicConceptCtrl?.disable(); // Keep disabled while loading

		const filterParams = {
			level: selectedSection.level,
			grade: selectedSection.year,
			subject: 'MATEMATICA',
		};

		this.#conceptService
			.findAll(filterParams)
			.pipe(
				takeUntil(this.#destroy$),
				map((conceptLists) => {
					const concepts =
						conceptLists?.flatMap((list) => list.concepts || []) ||
						[];
					return [...new Set(concepts)]; // Unique concepts
				}),
				catchError((error) =>
					this.#handleError(
						error,
						'Error al cargar los temas de matemática.',
					),
				),
				finalize(() => this.isLoadingTopics.set(false)),
			)
			.subscribe((topics) => {
				this.availableTopics.set(topics);
				this.topicConceptCtrl?.enable(); // Enable topic selector
			});
	}

	/** Listens for changes in the selected section */
	#listenForSectionChanges(): void {
		this.sectionCtrl?.valueChanges
			.pipe(
				takeUntil(this.#destroy$),
				distinctUntilChanged(),
				tap((sectionId) => {
					// Reset dependent fields
					this.topicConceptCtrl?.reset();
					this.topicConceptCtrl?.disable();
					this.customTopicCtrl?.reset();
					this.customTopicCtrl?.disable();
					this.availableTopics.set([]);

					if (sectionId) {
						this.#loadMathTopics(sectionId); // Load topics for the selected section
					}
				}),
			)
			.subscribe();
	}

	/** Listens for changes in the selected topic/concept */
	#listenForTopicConceptChanges(): void {
		this.topicConceptCtrl?.valueChanges
			.pipe(takeUntil(this.#destroy$), distinctUntilChanged())
			.subscribe((value) => {
				if (value === OTHER_TOPIC_VALUE) {
					this.customTopicCtrl?.enable();
					this.customTopicCtrl?.setValidators(Validators.required);
				} else {
					this.customTopicCtrl?.disable();
					this.customTopicCtrl?.clearValidators();
					this.customTopicCtrl?.reset();
				}
				this.customTopicCtrl?.updateValueAndValidity();
			});
	}

	#handleError(error: any, defaultMessage: string): Observable<never> {
		console.error(defaultMessage, error);
		this.#snackBar.open(defaultMessage, 'Cerrar', { duration: 5000 });
		return EMPTY;
	}

	// --- Public Methods ---

	/** Formats section display name */
	getSectionDisplay(section: ClassSection): string {
		return `${this.#pretify(section.year || '')} ${section.name || ''} (${this.#pretify(section.level || 'Nivel no especificado')})`;
	}

	/** Handles form submission */
	async onSubmit(): Promise<void> {
		if (this.mathProblemForm.invalid) {
			this.mathProblemForm.markAllAsTouched();
			this.#snackBar.open(
				'Por favor, completa todos los campos requeridos.',
				'Cerrar',
				{ duration: 3000 },
			);
			return;
		}

		this.isGenerating.set(true);
		this.generatedProblems.set('');
		this.showResult.set(false);

		const formValue = this.mathProblemForm.getRawValue();
		const selectedSection = this.sections().find(
			(s) => s._id === formValue.section,
		);
		const topic = this.finalTopic(); // Use computed signal

		if (!topic) {
			this.#snackBar.open(
				'Por favor, selecciona o introduce un tema matemático válido.',
				'Cerrar',
				{ duration: 3000 },
			);
			this.isGenerating.set(false);
			return;
		}

		// Construct the prompt for generating math problems
		const prompt = `Eres un profesor de matemáticas experto en crear problemas contextualizados y realistas para estudiantes.
      Necesito que generes una lista de problemas matemáticos para una clase.

      Contexto e Instrucciones:
      - Audiencia: Estudiantes de ${this.#pretify(selectedSection?.level || 'Nivel no especificado')}, ${this.#pretify(selectedSection?.year || 'Grado no especificado')}. Los problemas deben ser apropiados para su edad y nivel de habilidad matemática.
      - Tema Matemático Central: Los problemas deben poder resolverse aplicando principalmente el concepto o tema de "${topic}".
      - Contexto Realista: Basa los problemas en situaciones de la vida cotidiana o escenarios comprensibles para los estudiantes (ej: compras, medidas, tiempo, juegos, etc.). Evita escenarios demasiado abstractos.
      - Claridad y Precisión: Cada problema debe estar bien planteado, con información suficiente y una pregunta clara.
      - Cantidad: Genera al menos 5 problemas distintos relacionados con el tema.
      - Formato: Presenta los problemas como una lista numerada.
      - Medidas: Para las unidades de medida, usa el sistema métrico, para el dinero, usa pesos dominicanos (RD$).

      IMPORTANTE: Asegúrate de que los problemas sean resolubles con el tema indicado y adecuados para el nivel del curso. No incluyas las soluciones. No incluyas saludos ni despedidas.`;

		try {
			const result = await firstValueFrom(
				this.#aiService.geminiAi(prompt),
			);
			this.generatedProblems.set(
				result?.response || 'No se pudieron generar los problemas.',
			);
			this.showResult.set(true);
		} catch (error) {
			this.generatedProblems.set(
				'Ocurrió un error al generar los problemas. Por favor, inténtalo de nuevo.',
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
		this.generatedProblems.set('');
		// Reset form
		this.mathProblemForm.reset({
			section: '',
			topicConcept: '',
			customTopic: '',
		});
		this.availableTopics.set([]); // Clear available topics
		// Ensure controls are properly disabled after reset
		this.topicConceptCtrl?.disable();
		this.customTopicCtrl?.disable();
	}

	/** Downloads the generated problems as DOCX */
	downloadDocx(): void {
		const problemsText = this.generatedProblems();
		if (!problemsText || problemsText.startsWith('Ocurrió un error'))
			return;

		const formValue = this.mathProblemForm.getRawValue();
		const section = this.sections().find(
			(s) => s._id === formValue.section,
		);
		const topic = this.finalTopic();

		// Sanitize filename parts
		const sectionName = (section?.name || 'Seccion').replace(
			/[^a-z0-9]/gi,
			'_',
		);
		const topicName = (topic || 'Problemas')
			.substring(0, 20)
			.replace(/[^a-z0-9]/gi, '_');

		const filename = `ProblemasMat_${sectionName}_${topicName}.docx`;

		// Create paragraphs, attempting to use numbering for list items
		const paragraphs = problemsText
			.split('\n')
			.filter((line) => line.trim().length > 0)
			.map((line, index) => {
				const trimmedLine = line.trim();
				// Basic check if line starts like a list item number (e.g., "1.", "1)")
				if (trimmedLine.match(/^(\d+\.|\d+\))\s+/)) {
					return new Paragraph({
						text: trimmedLine.replace(/^(\d+\.|\d+\))\s+/, ''), // Remove number marker
						numbering: {
							reference: 'default-numbering', // Use a reference ID
							level: 0, // Indentation level
						},
						spacing: { after: 120 },
					});
				} else {
					// Treat as regular text, potentially part of the previous problem
					return new Paragraph({
						text: trimmedLine,
						spacing: { after: 120 },
						indent: { left: 720 }, // Indent non-numbered lines slightly
					});
				}
			});

		// Create the document with numbering configuration
		const doc = new Document({
			numbering: {
				// Define the numbering scheme
				config: [
					{
						reference: 'default-numbering', // Reference ID used in paragraphs
						levels: [
							{
								level: 0,
								format: 'decimal', // e.g., 1, 2, 3
								text: '%1.', // Format: 1., 2., 3.
								alignment: AlignmentType.START,
								style: {
									paragraph: {
										indent: { left: 720, hanging: 360 }, // Standard indentation
									},
								},
							},
						],
					},
				],
			},
			sections: [
				{
					properties: {},
					children: [
						new Paragraph({
							text: `Problemas Matemáticos`,
							heading: HeadingLevel.HEADING_1,
							alignment: AlignmentType.CENTER,
							spacing: { after: 100 },
						}),
						new Paragraph({
							text: `Tema: ${topic}`,
							heading: HeadingLevel.HEADING_2,
							alignment: AlignmentType.CENTER,
							spacing: { after: 300 },
						}),
						new Paragraph({
							text: `Curso: ${this.getSectionDisplay(section!)}`,
							alignment: AlignmentType.CENTER,
							style: 'SubtleEmphasis',
						}),
						new Paragraph({ text: '', spacing: { after: 400 } }), // Extra space
						...paragraphs, // Add the generated problem paragraphs
					],
				},
			],
			styles: {
				// Reusing styles
				paragraphStyles: [
					{
						id: 'Normal',
						name: 'Normal',
						run: { font: 'Arial', size: 22 }, // 11pt
					},
					{
						id: 'SubtleEmphasis',
						name: 'Subtle Emphasis',
						basedOn: 'Normal',
						run: { italics: true, color: '5A5A5A', size: 20 }, // 10pt
					},
				],
			},
		});

		// Generate blob and trigger download
		Packer.toBlob(doc)
			.then((blob) => {
				saveAs(blob, filename);
			})
			.catch((error) => {
				console.error('Error creating DOCX file:', error);
				this.#snackBar.open(
					'Error al generar el archivo DOCX.',
					'Cerrar',
					{ duration: 3000 },
				);
			});
	}

	// --- Getters for easier access to form controls ---
	get sectionCtrl(): AbstractControl | null {
		return this.mathProblemForm.get('section');
	}
	get topicConceptCtrl(): AbstractControl | null {
		return this.mathProblemForm.get('topicConcept');
	}
	get customTopicCtrl(): AbstractControl | null {
		return this.mathProblemForm.get('customTopic');
	}
}
