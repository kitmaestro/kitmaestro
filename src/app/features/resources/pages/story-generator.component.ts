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
import {
	Subject,
	firstValueFrom,
	takeUntil,
	tap,
	catchError,
	EMPTY,
	finalize,
	Observable,
} from 'rxjs';

// Angular Material Modules
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input'; // Needed for topic input
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';

// --- Core Services & Interfaces (Using new structure paths) ---
import { ClassSection } from '../../../core';
import { ClassSectionService, AiService } from '../../../core/services';

// --- DOCX Generation ---
import {
	Document,
	Packer,
	Paragraph,
	TextRun,
	AlignmentType,
	HeadingLevel,
} from 'docx'; // Import Indent
import { saveAs } from 'file-saver';
import { Store } from '@ngrx/store';
import { selectIsPremium } from '../../../store/user-subscriptions/user-subscriptions.selectors';
import { loadCurrentSubscription } from '../../../store';
import { MarkdownComponent } from 'ngx-markdown';

@Component({
	selector: 'app-story-generator', // Component selector
	standalone: true,
	imports: [
		ReactiveFormsModule,
		MatFormFieldModule,
		MatSelectModule,
		MatInputModule,
		MatButtonModule,
		MatProgressSpinnerModule,
		MatSnackBarModule,
		MarkdownComponent,
		MatIconModule,
	],
	// --- Inline Template ---
	template: `
		<div class="story-generator-card">
			<div>
				<h2>Generador de Cuentos</h2>
			</div>

			<div>
				@if (!showResult()) {
					<form
						[formGroup]="storyForm"
						(ngSubmit)="onSubmit()"
						class="story-form"
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
											<mat-option [value]="section._id">{{ section.name }}</mat-option>
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
								<mat-label>Longitud Deseada</mat-label>
								<mat-select formControlName="length" required>
									@for (len of storyLengths; track len) {
										<mat-option [value]="len">{{
											len
										}}</mat-option>
									}
								</mat-select>
								@if (
									lengthCtrl?.invalid && lengthCtrl?.touched
								) {
									<mat-error
										>Selecciona la longitud.</mat-error
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
									>Tema del cuento (Opcional)</mat-label
								>
								<input
									matInput
									formControlName="topic"
									placeholder="Ej: La amistad, El espacio, Un animal fantástico"
								/>
							</mat-form-field>
						</div>

						<div class="form-actions">
							<button
								mat-flat-button
								color="primary"
								type="submit"
								[disabled]="storyForm.invalid || isGenerating()"
							>
								<mat-icon>auto_stories</mat-icon>
								{{ isGenerating() ? 'Generando...' : 'Generar Cuento' }}
							</button>
						</div>
					</form>
				}

				@if (showResult()) {
					<div class="story-result">
						<h3>Cuento Generado:</h3>
						<div class="story-result-content">
							<markdown [data]="generatedStory()" />
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
									!generatedStory() ||
									generatedStory().startsWith(
										'Ocurrió un error'
									) || !isPremium()
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
			.story-generator-card {
				margin: 0 auto;
				padding: 15px 25px 25px 25px;
			}
			.story-form {
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
			.story-result {
				margin-top: 20px;
			}
			.story-result h3 {
				margin-bottom: 15px;
			}
			.story-result-content {
				background-color: #fff; /* White background for story */
				border: 1px solid #dee2e6;
				padding: 30px 40px;
				min-height: 250px;
				box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
				line-height: 1.7; /* Good spacing for reading */
				font-family:
					'Georgia', 'Times New Roman', Times, serif; /* Serif font for stories */
				font-size: 12pt; /* Standard reading size */
				margin-bottom: 20px;
				max-width: 100%;
				white-space: pre-wrap; /* Preserve paragraphs from AI */
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
export class StoryGeneratorComponent implements OnInit, OnDestroy {
	#store = inject(Store)
	#fb = inject(FormBuilder);
	#aiService = inject(AiService);
	#sectionService = inject(ClassSectionService);
	#snackBar = inject(MatSnackBar);

	isPremium = this.#store.selectSignal(selectIsPremium);

	// --- State Signals ---
	isLoadingSections = signal(false);
	isGenerating = signal(false);
	showResult = signal(false);
	generatedStory = signal<string>(''); // Stores the AI response string
	sections = signal<ClassSection[]>([]);

	// --- Form Definition ---
	storyForm = this.#fb.group({
		section: ['', Validators.required],
		length: ['Corto', Validators.required], // Default value
		vocabulary: ['Medio', Validators.required], // Default value
		topic: [''], // Optional topic
	});

	// --- Fixed Select Options ---
	readonly storyLengths = ['Muy Corto', 'Corto', 'Extenso'];
	readonly vocabularyLevels = ['Reducido', 'Medio', 'Amplio'];

	// --- Lifecycle Management ---
	#destroy$ = new Subject<void>();

	// --- OnInit ---
	ngOnInit(): void {
		this.#loadSections();
		this.#store.dispatch(loadCurrentSubscription())
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

	/** Maps user selection to prompt instructions for length */
	#getLengthInstruction(lengthSelection: string): string {
		switch (lengthSelection) {
			case 'Muy Corto':
				return 'muy corto (aproximadamente 2-3 párrafos)';
			case 'Corto':
				return 'corto (aproximadamente 4-5 párrafos)';
			case 'Extenso':
				return 'extenso (aproximadamente 6-8 párrafos, sin exceder 10 párrafos)';
			default:
				return 'corto (aproximadamente 4-5 párrafos)'; // Default case
		}
	}

	/** Maps user selection to prompt instructions for vocabulary */
	#getVocabularyInstruction(vocabularySelection: string): string {
		switch (vocabularySelection) {
			case 'Reducido':
				return 'un vocabulario sencillo y común, fácil de entender para niños pequeños o principiantes';
			case 'Medio':
				return 'un vocabulario estándar, apropiado para la edad/grado indicado, con alguna palabra nueva ocasional';
			case 'Amplio':
				return 'un vocabulario rico y variado, introduciendo algunas palabras más complejas o descriptivas de forma natural';
			default:
				return 'un vocabulario estándar, apropiado para la edad/grado indicado'; // Default case
		}
	}

	// --- Public Methods ---

	/** Formats section display name */
	getSectionDisplay(section: ClassSection): string {
		return `${section.year || ''} ${section.name || ''} (${section.level || 'Nivel no especificado'})`;
	}

	/** Handles form submission */
	async onSubmit(): Promise<void> {
		if (this.storyForm.invalid) {
			this.storyForm.markAllAsTouched();
			this.#snackBar.open(
				'Por favor, completa todos los campos requeridos.',
				'Cerrar',
				{ duration: 3000 },
			);
			return;
		}

		this.isGenerating.set(true);
		this.generatedStory.set('');
		this.showResult.set(false);

		const formValue = this.storyForm.getRawValue();
		const selectedSection = this.sections().find(
			(s) => s._id === formValue.section,
		);

		// Construct the prompt for generating the story
		const prompt = `Eres un escritor creativo especializado en cuentos infantiles y juveniles.
      Necesito que escribas un cuento original y atractivo para una clase.

      Contexto e Instrucciones:
      - Audiencia: Estudiantes de ${selectedSection?.level || 'Nivel no especificado'}, ${selectedSection?.year || 'Grado no especificado'}. El cuento debe ser apropiado para su edad y nivel de comprensión.
      - Longitud Deseada: El cuento debe ser ${this.#getLengthInstruction(formValue.length!)}.
      - Nivel de Vocabulario: Utiliza ${this.#getVocabularyInstruction(formValue.vocabulary!)}.
      ${formValue.topic ? `- Tema a Incluir: Incorpora sutilmente el tema "${formValue.topic}" en la trama o mensaje del cuento.` : '- Tema: Puedes elegir un tema apropiado y positivo (amistad, valentía, curiosidad, naturaleza, etc.).'}
      - Estructura: El cuento debe tener un inicio, desarrollo y final claros.
      - Tono: Generalmente positivo y entretenido, puede incluir elementos de fantasía, aventura, humor o enseñanza moral simple.
      - Formato: Escribe el cuento en párrafos bien separados (usa doble salto de línea entre párrafos). No incluyas un título a menos que surja muy naturalmente del texto. No incluyas saludos, despedidas ni notas del autor.

      IMPORTANTE: Enfócate en crear una narrativa interesante y coherente, adecuada para los estudiantes especificados.`;

		try {
			const result = await firstValueFrom(
				this.#aiService.geminiAi(prompt),
			);
			this.generatedStory.set(
				result?.response || 'No se pudo generar el cuento.',
			);
			this.showResult.set(true);
		} catch (error) {
			this.generatedStory.set(
				'Ocurrió un error al generar el cuento. Por favor, inténtalo de nuevo.',
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
		this.generatedStory.set('');
		// Reset form to defaults
		this.storyForm.reset({
			section: '',
			length: 'Corto',
			vocabulary: 'Medio',
			topic: '',
		});
	}

	/** Downloads the generated story as DOCX */
	downloadDocx(): void {
		const storyText = this.generatedStory();
		if (!storyText || storyText.startsWith('Ocurrió un error')) return;

		const formValue = this.storyForm.getRawValue();
		const section = this.sections().find(
			(s) => s._id === formValue.section,
		);

		// Sanitize filename parts
		const sectionName = (section?.name || 'Seccion').replace(
			/[^a-z0-9]/gi,
			'_',
		);
		const topicName = (formValue.topic || 'Cuento')
			.substring(0, 20)
			.replace(/[^a-z0-9]/gi, '_');

		const filename = `Cuento_${sectionName}_${topicName}.docx`;

		// Create paragraphs, splitting by double newline primarily, then single
		const paragraphs = storyText
			.split(/\n\s*\n/) // Split by one or more empty lines
			.filter((p) => p.trim().length > 0)
			.map(
				(paragraph) =>
					new Paragraph({
						children: [new TextRun(paragraph.trim())],
						spacing: { after: 120 }, // Spacing after paragraph (6pt)
						indent: { firstLine: 720 }, // Indent first line (0.5 inch = 720)
					}),
			);

		// Create the document
		const doc = new Document({
			sections: [
				{
					properties: {},
					children: [
						new Paragraph({
							text: `Cuento Generado`,
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
							text: `Longitud: ${formValue.length}`,
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
										text: `Tema: ${formValue.topic}`,
										alignment: AlignmentType.CENTER,
										style: 'SubtleEmphasis',
									}),
								]
							: []),
						new Paragraph({ text: '', spacing: { after: 400 } }), // Extra space
						...paragraphs, // Add the generated story paragraphs
					],
				},
			],
			styles: {
				// Use default styles but define paragraph font/size
				paragraphStyles: [
					{
						id: 'Normal',
						name: 'Normal',
						run: {
							font: 'Georgia', // Match display font
							size: 24, // 12pt
						},
					},
					{
						id: 'SubtleEmphasis',
						name: 'Subtle Emphasis',
						basedOn: 'Normal',
						run: {
							italics: true,
							color: '5A5A5A',
							size: 20, // 10pt
						},
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
		return this.storyForm.get('section');
	}
	get lengthCtrl(): AbstractControl | null {
		return this.storyForm.get('length');
	}
	get vocabularyCtrl(): AbstractControl | null {
		return this.storyForm.get('vocabulary');
	}
	get topicCtrl(): AbstractControl | null {
		return this.storyForm.get('topic');
	}
}
