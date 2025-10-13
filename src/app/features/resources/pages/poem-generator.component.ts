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
	firstValueFrom,
	takeUntil,
	tap,
	catchError,
	EMPTY,
	finalize,
	Observable,
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
import { ClassSection } from '../../../core/interfaces/class-section';
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

@Component({
	selector: 'app-poem-generator', // Component selector
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
		<mat-card class="poem-generator-card">
			<mat-card-header>
				<mat-card-title>Generador de Poesía</mat-card-title>
				<mat-card-subtitle
					>Crea poemas originales para inspirar a tus
					estudiantes</mat-card-subtitle
				>
			</mat-card-header>

			<mat-card-content>
				@if (!showResult()) {
					<form
						[formGroup]="poemForm"
						(ngSubmit)="onSubmit()"
						class="poem-form"
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
									@for (len of poemLengths; track len) {
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
								<mat-label>Tema del poema (Opcional)</mat-label>
								<input
									matInput
									formControlName="topic"
									placeholder="Ej: La lluvia, Los sueños, El color azul"
								/>
							</mat-form-field>
						</div>

						<div class="form-actions">
							<button
								mat-raised-button
								color="primary"
								type="submit"
								[disabled]="poemForm.invalid || isGenerating()"
							>
								@if (isGenerating()) {
									<div [style]="{ display: 'flex' }">
										<mat-spinner
											diameter="20"
											color="accent"
											class="inline-spinner"
										></mat-spinner>
										Generando...
									</div>
								} @else {
									<ng-container>
										<mat-icon>edit</mat-icon> Generar Poesía
									</ng-container>
								}
							</button>
						</div>
					</form>
				}

				@if (showResult()) {
					<div class="poem-result">
						<h3>Poema Generado:</h3>
						<div
							class="poem-result-content"
							[innerHTML]="
								generatedPoem().replaceAll(
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
									!generatedPoem() ||
									generatedPoem().startsWith(
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
			.poem-generator-card {
				margin: 0 auto;
				padding: 15px 25px 25px 25px;
			}
			.poem-form {
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
			.poem-result {
				margin-top: 20px;
			}
			.poem-result h3 {
				margin-bottom: 15px;
			}
			.poem-result-content {
				background-color: #f8f9fa; /* Light background */
				border: 1px solid #dee2e6;
				border-left: 5px solid #6f42c1; /* Different accent color (purple) */
				padding: 25px 35px;
				min-height: 200px;
				box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
				line-height: 1.8; /* More spacing for poetry */
				font-family:
					'Garamond', 'Times New Roman', Times, serif; /* Classic serif font */
				font-size: 12pt;
				margin-bottom: 20px;
				max-width: 100%;
				white-space: pre-wrap; /* Preserve stanzas/lines from AI */
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
export class PoemGeneratorComponent implements OnInit, OnDestroy {
	// --- Dependencies ---
	#fb = inject(FormBuilder);
	#aiService = inject(AiService);
	#sectionService = inject(ClassSectionService);
	#snackBar = inject(MatSnackBar);

	// --- State Signals ---
	isLoadingSections = signal(false);
	isGenerating = signal(false);
	showResult = signal(false);
	generatedPoem = signal<string>(''); // Stores the AI response string
	sections = signal<ClassSection[]>([]);

	#pretify = new PretifyPipe().transform;

	// --- Form Definition ---
	poemForm = this.#fb.group({
		section: ['', Validators.required],
		length: ['Corto', Validators.required], // Default value
		vocabulary: ['Medio', Validators.required], // Default value
		topic: [''], // Optional topic
	});

	// --- Fixed Select Options (Reused from Story Generator logic) ---
	readonly poemLengths = ['Muy Corto', 'Corto', 'Extenso'];
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

	/** Maps user selection to prompt instructions for length (adapted for stanzas) */
	#getLengthInstruction(lengthSelection: string): string {
		switch (lengthSelection) {
			case 'Muy Corto':
				return 'muy corto (aproximadamente 2-3 estrofas)';
			case 'Corto':
				return 'corto (aproximadamente 4-5 estrofas)';
			case 'Extenso':
				return 'extenso (aproximadamente 6-8 estrofas)';
			default:
				return 'corto (aproximadamente 4-5 estrofas)'; // Default case
		}
	}

	/** Maps user selection to prompt instructions for vocabulary (reused) */
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
		return `${this.#pretify(section.year)} ${section.name} (${this.#pretify(section.level || 'Nivel no especificado')})`;
	}

	/** Handles form submission */
	async onSubmit(): Promise<void> {
		if (this.poemForm.invalid) {
			this.poemForm.markAllAsTouched();
			this.#snackBar.open(
				'Por favor, completa todos los campos requeridos.',
				'Cerrar',
				{ duration: 3000 },
			);
			return;
		}

		this.isGenerating.set(true);
		this.generatedPoem.set('');
		this.showResult.set(false);

		const formValue = this.poemForm.getRawValue();
		const selectedSection = this.sections().find(
			(s) => s._id === formValue.section,
		);

		// Construct the prompt for generating the poem
		const prompt = `Eres un poeta sensible y creativo, capaz de adaptar tu estilo a diferentes edades.
      Necesito que escribas un poema original para una clase.

      Contexto e Instrucciones:
      - Audiencia: Estudiantes de ${selectedSection?.level || 'Nivel no especificado'}, ${selectedSection?.year || 'Grado no especificado'}. El poema debe ser apropiado para su edad, sensibilidad y nivel de comprensión.
      - Longitud Deseada: El poema debe ser ${this.#getLengthInstruction(formValue.length!)}.
      - Nivel de Vocabulario: Utiliza ${this.#getVocabularyInstruction(formValue.vocabulary!)}.
      ${formValue.topic ? `- Tema Central: El poema debe girar en torno al tema "${formValue.topic}".` : '- Tema: Puedes elegir un tema inspirador y apropiado para la edad (naturaleza, emociones, amistad, sueños, aprendizaje, etc.).'}
      - Estilo: Considera usar rima y ritmo de forma natural y agradable para la audiencia indicada, pero siéntete libre de usar verso libre si se ajusta mejor al tema o mensaje. La claridad y la emoción son importantes.
      - Formato: Escribe el poema separando claramente las estrofas (usa doble salto de línea entre estrofas). No incluyas un título a menos que sea esencial. No incluyas saludos, despedidas ni notas del autor.

      IMPORTANTE: Enfócate en crear un poema evocador y bien estructurado, adecuado para los estudiantes especificados.`;

		try {
			const result = await firstValueFrom(
				this.#aiService.geminiAi(prompt),
			);
			this.generatedPoem.set(
				result?.response || 'No se pudo generar el poema.',
			);
			this.showResult.set(true);
		} catch (error) {
			this.generatedPoem.set(
				'Ocurrió un error al generar el poema. Por favor, inténtalo de nuevo.',
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
		this.generatedPoem.set('');
		// Reset form to defaults
		this.poemForm.reset({
			section: '',
			length: 'Corto',
			vocabulary: 'Medio',
			topic: '',
		});
	}

	/** Downloads the generated poem as DOCX */
	downloadDocx(): void {
		const poemText = this.generatedPoem();
		if (!poemText || poemText.startsWith('Ocurrió un error')) return;

		const formValue = this.poemForm.getRawValue();
		const section = this.sections().find(
			(s) => s._id === formValue.section,
		);

		// Sanitize filename parts
		const sectionName = (section?.name || 'Seccion').replace(
			/[^a-z0-9]/gi,
			'_',
		);
		const topicName = (formValue.topic || 'Poema')
			.substring(0, 20)
			.replace(/[^a-z0-9]/gi, '_');

		const filename = `Poema_${sectionName}_${topicName}.docx`;

		// Create paragraphs, splitting by double newline for stanzas
		const paragraphs = poemText
			.split(/\n\s*\n/) // Split by one or more empty lines (stanzas)
			.filter((stanza) => stanza.trim().length > 0)
			.flatMap((stanza) => {
				// Process each stanza
				const lines = stanza
					.trim()
					.split('\n')
					.map(
						(line) => new TextRun({ text: line.trim(), break: 1 }),
					); // Add line breaks within stanza
				return [
					new Paragraph({
						children: lines,
						spacing: { after: 240 }, // Spacing after each stanza (12pt)
						// alignment: AlignmentType.CENTER, // Optional: Center align poem
					}),
				];
			});

		// Create the document
		const doc = new Document({
			sections: [
				{
					properties: {},
					children: [
						new Paragraph({
							text: `Poema Generado`,
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
						...paragraphs, // Add the generated poem paragraphs/stanzas
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
							font: 'Garamond', // Match display font
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
		return this.poemForm.get('section');
	}
	get lengthCtrl(): AbstractControl | null {
		return this.poemForm.get('length');
	}
	get vocabularyCtrl(): AbstractControl | null {
		return this.poemForm.get('vocabulary');
	}
	get topicCtrl(): AbstractControl | null {
		return this.poemForm.get('topic');
	}
}
