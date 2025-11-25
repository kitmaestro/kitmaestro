import {
	Component,
	signal,
	inject,
	ChangeDetectionStrategy,
	OnInit,
	OnDestroy,
	ViewEncapsulation,
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
import { AiService } from '../../../core/services/ai.service';
import { ClassSectionService } from '../../../core/services/class-section.service';
import { ClassSection } from '../../../core';
import { PretifyPipe } from '../../../shared/pipes/pretify.pipe';

// --- DOCX Generation ---
import {
	Document,
	Packer,
	Paragraph,
	TextRun,
	AlignmentType,
	HeadingLevel,
} from 'docx';
import { saveAs } from 'file-saver';
import { MarkdownComponent } from 'ngx-markdown';
import { Store } from '@ngrx/store';
import { selectIsPremium } from '../../../store/user-subscriptions/user-subscriptions.selectors';
import { loadCurrentSubscription } from '../../../store';

@Component({
	selector: 'app-riddle-generator', // Component selector
	standalone: true,
	imports: [
		MarkdownComponent,
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
		<div class="riddle-generator-card">
			<div>
				<h2>Generador de Adivinanzas</h2>
			</div>

			<div>
				@if (!showResult()) {
					<form
						[formGroup]="riddleForm"
						(ngSubmit)="onSubmit()"
						class="riddle-form"
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
												section.name
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
								<mat-label>Complejidad</mat-label>
								<mat-select formControlName="length" required>
									@for (len of riddleLengths; track len) {
										<mat-option [value]="len">{{
											len
										}}</mat-option>
									}
								</mat-select>
								@if (
									lengthCtrl?.invalid && lengthCtrl?.touched
								) {
									<mat-error
										>Selecciona la complejidad.</mat-error
									>
								}
							</mat-form-field>
						</div>

						<div class="form-row">
							<mat-form-field
								appearance="outline"
								class="form-field"
							>
								<mat-label>Nivel de Vocabulario</mat-label>
								<mat-select
									formControlName="vocabulary"
									required
								>
									@for (
										level of vocabularyLevels;
										track level
									) {
										<mat-option [value]="level">{{
											level
										}}</mat-option>
									}
								</mat-select>
								@if (
									vocabularyCtrl?.invalid &&
									vocabularyCtrl?.touched
								) {
									<mat-error
										>Selecciona el nivel de
										vocabulario.</mat-error
									>
								}
							</mat-form-field>

							<mat-form-field
								appearance="outline"
								class="form-field"
							>
								<mat-label
									>Tema o Respuesta (Opcional)</mat-label
								>
								<input
									matInput
									formControlName="topic"
									placeholder="Ej: Frutas, Herramientas, El Sol"
								/>
							</mat-form-field>
						</div>

						<div class="form-actions">
							<button
								mat-flat-button
								color="primary"
								type="submit"
								[disabled]="
									riddleForm.invalid || isGenerating()
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
										<mat-icon>help_outline</mat-icon>
										Generar Adivinanzas
									</ng-container>
								}
							</button>
						</div>
					</form>
				}

				@if (showResult()) {
					<div class="riddle-result">
						<h3>Adivinanza(s) Generada(s):</h3>
						<div class="riddle-result-content">
							<markdown [data]="generatedRiddles()" />
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
									!generatedRiddles() ||
									generatedRiddles().startsWith(
										'Ocurrió un error'
									) ||
									!isPremium()
								"
							>
								<mat-icon>download</mat-icon> Descargar
							</button>
						</div>
					</div>
				}
			</div>
		</div>
	`,
	// --- Inline Styles ---
	styles: [
		`
			:host {
				display: block;
			}
			.riddle-generator-card {
				margin: 0 auto;
				padding: 15px 25px 25px 25px;
			}
			.riddle-form {
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
			.riddle-result {
				margin-top: 20px;
			}
			.riddle-result h3 {
				margin-bottom: 15px;
			}
			.riddle-result-content {
				background-color: #e8f5e9; /* Light green background */
				border: 1px solid #c8e6c9;
				border-left: 5px solid #4caf50; /* Green accent */
				padding: 25px 35px;
				min-height: 150px;
				box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
				line-height: 1.7;
				font-family:
					'Verdana', Geneva, Tahoma, sans-serif; /* Clean sans-serif */
				font-size: 11pt;
				margin-bottom: 20px;
				max-width: 100%;
				white-space: pre-wrap; /* Preserve formatting */
			}
			/* Try to style Answer if AI uses a consistent format */
			.riddle-result-content br + span[style*='bold'] {
				/* Example: Bold text after a break */
				display: block;
				margin-top: 0.5em;
				font-weight: bold;
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
export class RiddleGeneratorComponent implements OnInit, OnDestroy {
	#store = inject(Store);
	#fb = inject(FormBuilder);
	#aiService = inject(AiService);
	#sectionService = inject(ClassSectionService);
	#snackBar = inject(MatSnackBar);

	#pretify = new PretifyPipe().transform;

	isPremium = this.#store.selectSignal(selectIsPremium);

	// --- State Signals ---
	isLoadingSections = signal(false);
	isGenerating = signal(false);
	showResult = signal(false);
	generatedRiddles = signal<string>(''); // Stores the AI response string
	sections = signal<ClassSection[]>([]);

	// --- Form Definition ---
	riddleForm = this.#fb.group({
		section: ['', Validators.required],
		length: ['Corta', Validators.required], // Renamed to complexity, using 'length' internally
		vocabulary: ['Medio', Validators.required], // Default value
		topic: [''], // Optional topic or answer
	});

	// --- Fixed Select Options ---
	// Reusing 'length' options but label is 'Complejidad'
	readonly riddleLengths = ['Muy Corta', 'Corta', 'Extensa'];
	readonly vocabularyLevels = ['Reducido', 'Medio', 'Amplio'];

	// --- Lifecycle Management ---
	#destroy$ = new Subject<void>();

	// --- OnInit ---
	ngOnInit(): void {
		this.#store.dispatch(loadCurrentSubscription());
		this.#loadSections();
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

	#handleError(error: any, defaultMessage: string): Observable<never> {
		console.error(defaultMessage, error);
		this.#snackBar.open(defaultMessage, 'Cerrar', { duration: 5000 });
		return EMPTY;
	}

	/** Maps user selection to prompt instructions for complexity */
	#getComplexityInstruction(lengthSelection: string): string {
		switch (lengthSelection) {
			case 'Muy Corta':
				return 'muy sencilla (pocas pistas, respuesta bastante obvia)';
			case 'Corta':
				return 'de complejidad media (algunas pistas, requiere pensar un poco)';
			case 'Extensa':
				return 'más compleja o elaborada (más pistas, requiere más ingenio, puede usar metáforas simples)';
			default:
				return 'de complejidad media';
		}
	}

	/** Maps user selection to prompt instructions for vocabulary (reused) */
	#getVocabularyInstruction(vocabularySelection: string): string {
		switch (vocabularySelection) {
			case 'Reducido':
				return 'un vocabulario sencillo y común';
			case 'Medio':
				return 'un vocabulario estándar, apropiado para la edad';
			case 'Amplio':
				return 'un vocabulario un poco más variado o figurado';
			default:
				return 'un vocabulario estándar, apropiado para la edad';
		}
	}

	// --- Public Methods ---

	/** Formats section display name */
	getSectionDisplay(section: ClassSection): string {
		return `${this.#pretify(section.year || '')} ${section.name || ''} (${this.#pretify(section.level || 'Nivel no especificado')})`;
	}

	/** Handles form submission */
	async onSubmit(): Promise<void> {
		if (this.riddleForm.invalid) {
			this.riddleForm.markAllAsTouched();
			this.#snackBar.open(
				'Por favor, completa todos los campos requeridos.',
				'Cerrar',
				{ duration: 3000 },
			);
			return;
		}

		this.isGenerating.set(true);
		this.generatedRiddles.set('');
		this.showResult.set(false);

		const formValue = this.riddleForm.getRawValue();
		const selectedSection = this.sections().find(
			(s) => s._id === formValue.section,
		);

		// Construct the prompt for generating the riddle
		const prompt = `Eres un creador experto de adivinanzas ingeniosas para niños y jóvenes.
      Necesito que generes algunas adivinanzas originales y divertidas para una clase.

      Contexto e Instrucciones:
      - Audiencia: Estudiantes de ${selectedSection?.level || 'Nivel no especificado'}, ${selectedSection?.year || 'Grado no especificado'}. Las adivinanzas deben ser apropiadas para su edad y capacidad de razonamiento.
      - Complejidad Deseada: ${this.#getComplexityInstruction(formValue.length!)}.
      - Nivel de Vocabulario: Utiliza ${this.#getVocabularyInstruction(formValue.vocabulary!)}.
      ${formValue.topic ? `- Tema o Respuesta Sugerida: La adivinanza (o al menos una de ellas) debe tratar sobre "${formValue.topic}" o tener esa palabra como respuesta.` : ''}
      - Cantidad: Genera 2 o 3 adivinanzas distintas.
      - **Formato Obligatorio:** Para CADA adivinanza, presenta primero el texto de la adivinanza y LUEGO, en una línea separada y claramente identificada, la respuesta. Usa este formato EXACTO:
          Adivinanza:
          [Texto de la adivinanza aquí, puede tener varias líneas]

          Respuesta: [Respuesta aquí]
       (Deja una línea en blanco entre la adivinanza y la respuesta, y dos líneas en blanco entre adivinanzas distintas si generas más de una).
      - Estilo: Pueden ser en verso o prosa corta. Deben ser intrigantes y hacer pensar.

      IMPORTANTE: Asegúrate de que la respuesta sea coherente con las pistas de la adivinanza. No incluyas saludos ni despedidas.`;

		try {
			const result = await firstValueFrom(
				this.#aiService.geminiAi(prompt),
			);
			this.generatedRiddles.set(
				result?.response || 'No se pudieron generar las adivinanzas.',
			);
			this.showResult.set(true);
		} catch (error) {
			this.generatedRiddles.set(
				'Ocurrió un error al generar las adivinanzas. Por favor, inténtalo de nuevo.',
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
		this.generatedRiddles.set('');
		// Reset form to defaults
		this.riddleForm.reset({
			section: '',
			length: 'Corta', // Corresponds to complexity
			vocabulary: 'Medio',
			topic: '',
		});
	}

	/** Downloads the generated riddles as DOCX */
	downloadDocx(): void {
		const riddlesText = this.generatedRiddles();
		if (!riddlesText || riddlesText.startsWith('Ocurrió un error')) return;

		const formValue = this.riddleForm.getRawValue();
		const section = this.sections().find(
			(s) => s._id === formValue.section,
		);

		// Sanitize filename parts
		const sectionName = (section?.name || 'Seccion').replace(
			/[^a-z0-9]/gi,
			'_',
		);
		const topicName = (formValue.topic || 'Adivinanzas')
			.substring(0, 15)
			.replace(/[^a-z0-9]/gi, '_');
		const complexityName = (formValue.length || 'Media').replace(
			/[^a-z0-9]/gi,
			'_',
		);

		const filename = `Adivinanzas_${sectionName}_${complexityName}_${topicName}.docx`;

		// Create paragraphs, trying to format Riddle/Answer
		const paragraphs: Paragraph[] = [];
		const riddleBlocks = riddlesText.split(/\n\s*\n\s*Adivinanza:/); // Split by "Adivinanza:" preceded by empty lines

		riddleBlocks.forEach((block, index) => {
			if (block.trim().length === 0 && index === 0) return; // Skip potential empty first block

			const parts = block.split(/\n\s*Respuesta:/); // Split each block into riddle and answer
			const riddlePart = (
				index === 0 && !block.trim().startsWith('Adivinanza:')
					? block.split(/\n\s*Respuesta:/)[0]
					: parts[0]
			)
				.replace(/^Adivinanza:/, '')
				.trim();
			const answerPart = parts.length > 1 ? parts[1].trim() : null;

			if (riddlePart) {
				paragraphs.push(
					new Paragraph({
						children: [
							new TextRun({
								text: 'Adivinanza:',
								bold: true,
								break: 1,
							}),
							new TextRun({ text: riddlePart, break: 1 }),
						],
						spacing: { after: 120, before: index > 0 ? 240 : 0 }, // Add space before new riddle
					}),
				);
			}
			if (answerPart) {
				paragraphs.push(
					new Paragraph({
						children: [
							new TextRun({ text: 'Respuesta:', bold: true }),
							new TextRun({
								text: ` ${answerPart}`,
								italics: true,
							}),
						],
						spacing: { after: 120 },
					}),
				);
			}
		});

		// Create the document
		const doc = new Document({
			sections: [
				{
					properties: {},
					children: [
						new Paragraph({
							text: `Adivinanzas Generadas`,
							heading: HeadingLevel.HEADING_1,
							alignment: AlignmentType.CENTER,
							spacing: { after: 300 },
						}),
						new Paragraph({
							text: `Curso: ${this.getSectionDisplay(section!)}`,
							alignment: AlignmentType.CENTER,
							style: 'SubtleEmphasis',
						}),
						new Paragraph({
							text: `Complejidad: ${formValue.length}`,
							alignment: AlignmentType.CENTER,
							style: 'SubtleEmphasis',
						}),
						new Paragraph({
							text: `Vocabulario: ${formValue.vocabulary}`,
							alignment: AlignmentType.CENTER,
							style: 'SubtleEmphasis',
						}),
						...(formValue.topic
							? [
									new Paragraph({
										text: `Tema/Respuesta Guía: ${formValue.topic}`,
										alignment: AlignmentType.CENTER,
										style: 'SubtleEmphasis',
									}),
								]
							: []),
						new Paragraph({ text: '', spacing: { after: 400 } }), // Extra space
						...paragraphs, // Add the generated riddle paragraphs
					],
				},
			],
			styles: {
				// Reusing styles
				paragraphStyles: [
					{
						id: 'Normal',
						name: 'Normal',
						run: { font: 'Verdana', size: 22 }, // 11pt
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
		return this.riddleForm.get('section');
	}
	get lengthCtrl(): AbstractControl | null {
		return this.riddleForm.get('length');
	} // Maps to complexity
	get vocabularyCtrl(): AbstractControl | null {
		return this.riddleForm.get('vocabulary');
	}
	get topicCtrl(): AbstractControl | null {
		return this.riddleForm.get('topic');
	}
}
