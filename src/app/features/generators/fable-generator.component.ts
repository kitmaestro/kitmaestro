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
import { AiService } from '../../core/services/ai.service';
import { ClassSectionService } from '../../core/services/class-section.service'; // Correct path
import { ClassSection } from '../../core/interfaces/class-section'; // Correct path
import { PretifyPipe } from '../../shared/pipes/pretify.pipe';

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

@Component({
	selector: 'app-fable-generator', // Component selector
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
		<mat-card class="fable-generator-card">
			<mat-card-header>
				<mat-card-title>Generador de Fábulas</mat-card-title>
				<mat-card-subtitle
					>Crea fábulas con moralejas para tus
					clases</mat-card-subtitle
				>
			</mat-card-header>

			<mat-card-content>
				@if (!showResult()) {
					<form
						[formGroup]="fableForm"
						(ngSubmit)="onSubmit()"
						class="fable-form"
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
								<mat-label>Longitud Deseada</mat-label>
								<mat-select formControlName="length" required>
									@for (len of fableLengths; track len) {
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
									>Tema o Moraleja (Opcional)</mat-label
								>
								<input
									matInput
									formControlName="topic"
									placeholder="Ej: La honestidad, El esfuerzo, La astucia"
								/>
							</mat-form-field>
						</div>

						<div class="form-actions">
							<button
								mat-raised-button
								color="primary"
								type="submit"
								[disabled]="fableForm.invalid || isGenerating()"
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
										<mat-icon>pets</mat-icon> Generar Fábula
									</ng-container>
								}
							</button>
						</div>
					</form>
				}

				@if (showResult()) {
					<div class="fable-result">
						<h3>Fábula Generada:</h3>
						<div
							class="fable-result-content"
							[innerHTML]="
								generatedFable()
									.replaceAll(
										'

',
										'<br><br>'
									)
									.replaceAll(
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
									!generatedFable() ||
									generatedFable().startsWith(
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
			.fable-generator-card {
				margin: 0 auto;
				padding: 15px 25px 25px 25px;
			}
			.fable-form {
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
			.fable-result {
				margin-top: 20px;
			}
			.fable-result h3 {
				margin-bottom: 15px;
			}
			.fable-result-content {
				background-color: #f0f4f8; /* Slightly different background */
				border: 1px solid #d6e2eb;
				border-left: 5px solid #1a73e8; /* Blue accent */
				padding: 30px 40px;
				min-height: 250px;
				box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
				line-height: 1.7;
				font-family:
					'Georgia', 'Times New Roman', Times, serif; /* Serif font */
				font-size: 12pt;
				margin-bottom: 20px;
				max-width: 100%;
				white-space: pre-wrap; /* Preserve paragraphs */
			}
			/* Style the moral if possible (depends on AI output format) */
			.fable-result-content p:last-child {
				/* Try to target the last paragraph as moral */
				font-style: italic;
				margin-top: 1.5em;
				border-top: 1px dashed #aaa;
				padding-top: 1em;
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
export class FableGeneratorComponent implements OnInit, OnDestroy {
	// --- Dependencies ---
	#fb = inject(FormBuilder);
	#aiService = inject(AiService);
	#sectionService = inject(ClassSectionService);
	#snackBar = inject(MatSnackBar);

	#pretify = new PretifyPipe().transform;

	// --- State Signals ---
	isLoadingSections = signal(false);
	isGenerating = signal(false);
	showResult = signal(false);
	generatedFable = signal<string>(''); // Stores the AI response string
	sections = signal<ClassSection[]>([]);

	// --- Form Definition ---
	fableForm = this.#fb.group({
		section: ['', Validators.required],
		length: ['Corto', Validators.required], // Default value
		vocabulary: ['Medio', Validators.required], // Default value
		topic: [''], // Optional topic or moral
	});

	// --- Fixed Select Options (Reused) ---
	readonly fableLengths = ['Muy Corto', 'Corto', 'Extenso'];
	readonly vocabularyLevels = ['Reducido', 'Medio', 'Amplio'];

	// --- Lifecycle Management ---
	#destroy$ = new Subject<void>();

	// --- OnInit ---
	ngOnInit(): void {
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

	/** Maps user selection to prompt instructions for length (reused) */
	#getLengthInstruction(lengthSelection: string): string {
		switch (lengthSelection) {
			case 'Muy Corto':
				return 'muy corta (aproximadamente 2-3 párrafos breves)';
			case 'Corto':
				return 'corta (aproximadamente 4-5 párrafos)';
			case 'Extenso':
				return 'extensa (aproximadamente 6-8 párrafos)';
			default:
				return 'corta (aproximadamente 4-5 párrafos)';
		}
	}

	/** Maps user selection to prompt instructions for vocabulary (reused) */
	#getVocabularyInstruction(vocabularySelection: string): string {
		switch (vocabularySelection) {
			case 'Reducido':
				return 'un vocabulario sencillo y común, fácil de entender';
			case 'Medio':
				return 'un vocabulario estándar, apropiado para la edad/grado indicado';
			case 'Amplio':
				return 'un vocabulario un poco más rico y descriptivo';
			default:
				return 'un vocabulario estándar, apropiado para la edad/grado indicado';
		}
	}

	// --- Public Methods ---

	/** Formats section display name */
	getSectionDisplay(section: ClassSection): string {
		return `${this.#pretify(section.year || '')} ${section.name || ''} (${this.#pretify(section.level || 'Nivel no especificado')})`;
	}

	/** Handles form submission */
	async onSubmit(): Promise<void> {
		if (this.fableForm.invalid) {
			this.fableForm.markAllAsTouched();
			this.#snackBar.open(
				'Por favor, completa todos los campos requeridos.',
				'Cerrar',
				{ duration: 3000 },
			);
			return;
		}

		this.isGenerating.set(true);
		this.generatedFable.set('');
		this.showResult.set(false);

		const formValue = this.fableForm.getRawValue();
		const selectedSection = this.sections().find(
			(s) => s._id === formValue.section,
		);

		// Construct the prompt for generating the fable
		const prompt = `Eres un escritor experto en fábulas clásicas y modernas para niños y jóvenes.
      Necesito que escribas una fábula original con una moraleja clara.

      Contexto e Instrucciones:
      - Audiencia: Estudiantes de ${this.#pretify(selectedSection?.level || 'Nivel no especificado')}, ${this.#pretify(selectedSection?.year || 'Grado no especificado')}. La fábula debe ser apropiada para su edad y nivel de comprensión.
      - Personajes: Preferiblemente animales u objetos personificados.
      - Longitud Deseada: La fábula debe ser ${this.#getLengthInstruction(formValue.length!)}.
      - Nivel de Vocabulario: Utiliza ${this.#getVocabularyInstruction(formValue.vocabulary!)}.
      ${formValue.topic ? `- Tema o Moraleja Sugerida: Incorpora la idea o moraleja de "${formValue.topic}" en la historia.` : '- Moraleja: Puedes elegir una moraleja clásica o inventar una apropiada (ej: sobre el esfuerzo, la honestidad, la amistad, la prudencia, etc.).'}
      - Estructura: La fábula debe tener una narrativa clara (inicio, desarrollo, final) que conduzca a la moraleja.
      - **Moraleja Explícita:** Al final de la fábula, incluye **obligatoriamente** la moraleja de forma clara y concisa, precedida por la palabra "Moraleja:".
      - Formato: Escribe la fábula en párrafos bien separados (usa doble salto de línea entre párrafos). No incluyas un título. No incluyas saludos ni despedidas.

      IMPORTANTE: Asegúrate de que la historia ilustre claramente la moraleja final.`;

		try {
			const result = await firstValueFrom(
				this.#aiService.geminiAi(prompt),
			);
			this.generatedFable.set(
				result?.response || 'No se pudo generar la fábula.',
			);
			this.showResult.set(true);
		} catch (error) {
			this.generatedFable.set(
				'Ocurrió un error al generar la fábula. Por favor, inténtalo de nuevo.',
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
		this.generatedFable.set('');
		// Reset form to defaults
		this.fableForm.reset({
			section: '',
			length: 'Corto',
			vocabulary: 'Medio',
			topic: '',
		});
	}

	/** Downloads the generated fable as DOCX */
	downloadDocx(): void {
		const fableText = this.generatedFable();
		if (!fableText || fableText.startsWith('Ocurrió un error')) return;

		const formValue = this.fableForm.getRawValue();
		const section = this.sections().find(
			(s) => s._id === formValue.section,
		);

		// Sanitize filename parts
		const sectionName = (section?.name || 'Seccion').replace(
			/[^a-z0-9]/gi,
			'_',
		);
		const topicName = (formValue.topic || 'Fabula')
			.substring(0, 20)
			.replace(/[^a-z0-9]/gi, '_');

		const filename = `Fabula_${sectionName}_${topicName}.docx`;

		// Create paragraphs, trying to identify the moral
		let moralParagraph: Paragraph | null = null;
		const bodyParagraphs = fableText
			.split(/\n\s*\n/) // Split by one or more empty lines
			.filter((p) => p.trim().length > 0)
			.map((paragraphText) => {
				const trimmedText = paragraphText.trim();
				if (trimmedText.toLowerCase().startsWith('moraleja:')) {
					moralParagraph = new Paragraph({
						children: [
							new TextRun({
								text: trimmedText,
								bold: true,
								italics: true,
							}),
						], // Style moral
						spacing: { before: 240, after: 120 }, // Add space before moral
					});
					return null; // Remove it from the main body flow
				}
				return new Paragraph({
					children: [new TextRun(trimmedText)],
					spacing: { after: 120 }, // Spacing after paragraph
					indent: { firstLine: 720 }, // Indent first line
				});
			})
			.filter((p) => p !== null) as Paragraph[]; // Filter out the null where moral was found

		// Add the moral at the end if found
		if (moralParagraph) {
			bodyParagraphs.push(moralParagraph);
		}

		// Create the document
		const doc = new Document({
			sections: [
				{
					properties: {},
					children: [
						new Paragraph({
							text: `Fábula Generada`,
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
										text: `Tema/Moraleja Guía: ${formValue.topic}`,
										alignment: AlignmentType.CENTER,
										style: 'SubtleEmphasis',
									}),
								]
							: []),
						new Paragraph({ text: '', spacing: { after: 400 } }), // Extra space
						...bodyParagraphs, // Add the generated fable paragraphs (moral included at the end)
					],
				},
			],
			styles: {
				// Reusing styles from story generator
				paragraphStyles: [
					{
						id: 'Normal',
						name: 'Normal',
						run: { font: 'Georgia', size: 24 }, // 12pt
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
		return this.fableForm.get('section');
	}
	get lengthCtrl(): AbstractControl | null {
		return this.fableForm.get('length');
	}
	get vocabularyCtrl(): AbstractControl | null {
		return this.fableForm.get('vocabulary');
	}
	get topicCtrl(): AbstractControl | null {
		return this.fableForm.get('topic');
	}
}
