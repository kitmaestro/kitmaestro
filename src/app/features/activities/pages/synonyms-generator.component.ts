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
import { MarkdownComponent } from 'ngx-markdown';
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

@Component({
	selector: 'app-synonyms-generator', // Component selector
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
		<div class="synonyms-generator-card">
			<div>
				<h2>Generador de Sinónimos</h2>
			</div>

			<div>
				@if (!showResult()) {
					<form
						[formGroup]="synonymsForm"
						(ngSubmit)="onSubmit()"
						class="synonyms-form"
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
								<mat-label>Cantidad de Palabras</mat-label>
								<input
									matInput
									type="number"
									formControlName="quantity"
									required
									min="1"
									max="20"
								/>
								@if (
									quantityCtrl?.invalid &&
									quantityCtrl?.touched
								) {
									@if (quantityCtrl?.hasError('required')) {
										<mat-error
											>Indica la cantidad.</mat-error
										>
									}
									@if (quantityCtrl?.hasError('min')) {
										<mat-error>Mínimo 1 palabra.</mat-error>
									}
									@if (quantityCtrl?.hasError('max')) {
										<mat-error
											>Máximo 20 palabras.</mat-error
										>
									}
								}
							</mat-form-field>

							<mat-form-field
								appearance="outline"
								class="form-field"
							>
								<mat-label>Dificultad</mat-label>
								<mat-select
									formControlName="difficulty"
									required
								>
									@for (
										level of difficultyLevels;
										track level
									) {
										<mat-option [value]="level">{{
											level
										}}</mat-option>
									}
								</mat-select>
								@if (
									difficultyCtrl?.invalid &&
									difficultyCtrl?.touched
								) {
									<mat-error
										>Selecciona la dificultad.</mat-error
									>
								}
							</mat-form-field>
						</div>

						<div class="form-row">
							<mat-form-field
								appearance="outline"
								class="form-field full-width-field"
							>
								<mat-label
									>Tema Específico (Opcional)</mat-label
								>
								<input
									matInput
									formControlName="topic"
									placeholder="Ej: El clima, Emociones, Herramientas"
								/>
							</mat-form-field>
						</div>

						<div class="form-actions">
							<button
								mat-flat-button
								color="primary"
								type="submit"
								[disabled]="
									synonymsForm.invalid || isGenerating()
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
										<mat-icon>find_replace</mat-icon>
										Generar Sinónimos
									</ng-container>
								}
							</button>
						</div>
					</form>
				}

				@if (showResult()) {
					<div class="synonyms-result">
						<h3>Sinónimos Generados:</h3>
						<div class="synonyms-result-content">
							<markdown [data]="generatedSynonyms()" />
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
									!generatedSynonyms() ||
									generatedSynonyms().startsWith(
										'Ocurrió un error'
									)
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
			.synonyms-generator-card {
				margin: 0 auto;
				padding: 15px 25px 25px 25px;
			}
			.synonyms-form {
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
			.synonyms-result {
				margin-top: 20px;
			}
			.synonyms-result h3 {
				margin-bottom: 15px;
			}
			.synonyms-result-content {
				background-color: #f9fbe7; /* Light lime background */
				border: 1px solid #f0f4c3;
				border-left: 5px solid #afb42b; /* Lime accent */
				padding: 25px 35px;
				min-height: 200px;
				box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
				line-height: 1.8; /* More spacing for lists */
				font-family:
					'Verdana', Geneva, Tahoma, sans-serif; /* Clean sans-serif */
				font-size: 11pt;
				margin-bottom: 20px;
				max-width: 100%;
				white-space: pre-wrap; /* Preserve formatting */
			}
			/* Style potential word/synonym pairs */
			.synonyms-result-content strong {
				/* Example: Bold text for original word */
				display: inline-block; /* Or block if needed */
				margin-right: 5px;
				font-weight: bold;
			}
			.synonyms-result-content br + strong {
				/* Add space before new word */
				margin-top: 1em;
				display: block;
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
export class SynonymsGeneratorComponent implements OnInit, OnDestroy {
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
	generatedSynonyms = signal<string>(''); // Stores the AI response string
	sections = signal<ClassSection[]>([]);
	availableSubjects = signal<string[]>([]);

	// --- Form Definition ---
	synonymsForm = this.#fb.group({
		section: ['', Validators.required],
		subject: [{ value: '', disabled: true }, Validators.required],
		quantity: [
			5,
			[Validators.required, Validators.min(1), Validators.max(20)],
		], // Default 5
		difficulty: ['Medio', Validators.required], // Default value
		topic: [''], // Optional topic
	});

	// --- Fixed Select Options ---
	readonly difficultyLevels = ['Fácil', 'Medio', 'Difícil'];

	// --- Lifecycle Management ---
	#destroy$ = new Subject<void>();

	// --- OnInit ---
	ngOnInit(): void {
		this.#loadSections();
		this.#listenForSectionChanges();
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

	/** Updates subjects based on selected section */
	#listenForSectionChanges(): void {
		this.sectionCtrl?.valueChanges
			.pipe(
				takeUntil(this.#destroy$),
				distinctUntilChanged(),
				tap((sectionId) => {
					this.subjectCtrl?.reset();
					this.subjectCtrl?.disable();
					this.availableSubjects.set([]);
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

	#handleError(error: any, defaultMessage: string): Observable<never> {
		console.error(defaultMessage, error);
		this.#snackBar.open(defaultMessage, 'Cerrar', { duration: 5000 });
		this.isGenerating.set(false); // Ensure loading stops on error
		return EMPTY;
	}

	/** Maps user selection to prompt instructions for difficulty */
	#getDifficultyInstruction(difficultySelection: string): string {
		switch (difficultySelection) {
			case 'Fácil':
				return 'palabras comunes y sinónimos muy directos y conocidos';
			case 'Medio':
				return 'palabras de uso estándar con una mezcla de sinónimos comunes y algunos menos frecuentes';
			case 'Difícil':
				return 'palabras menos comunes o más específicas, con sinónimos más variados y precisos, quizás incluyendo lenguaje figurado si aplica';
			default:
				return 'palabras de uso estándar con sinónimos de dificultad media';
		}
	}

	// --- Public Methods ---

	/** Formats section display name */
	getSectionDisplay(section: ClassSection): string {
		return `${this.#pretify(section.year || '')} ${section.name || ''} (${this.#pretify(section.level || 'Nivel no especificado')})`;
	}

	/** Handles form submission */
	async onSubmit(): Promise<void> {
		if (this.synonymsForm.invalid) {
			this.synonymsForm.markAllAsTouched();
			this.#snackBar.open(
				'Por favor, completa todos los campos requeridos.',
				'Cerrar',
				{ duration: 3000 },
			);
			return;
		}

		this.isGenerating.set(true);
		this.generatedSynonyms.set('');
		this.showResult.set(false);

		const formValue = this.synonymsForm.getRawValue();
		const selectedSection = this.sections().find(
			(s) => s._id === formValue.section,
		);

		// Construct the prompt for generating synonyms
		const prompt = `Eres un lexicógrafo experto y profesor de lengua, especializado en adaptar el vocabulario a diferentes niveles educativos.
      Necesito que generes una lista de palabras con sus respectivos sinónimos para una clase.

      Contexto e Instrucciones:
      - Audiencia: Estudiantes de ${this.#pretify(selectedSection?.level || 'Nivel no especificado')}, ${this.#pretify(selectedSection?.year || 'Grado no especificado')}. Las palabras y los sinónimos deben ser apropiados para su edad y nivel de comprensión.
      - Asignatura: ${this.#pretify(formValue.subject || '')}. Las palabras seleccionadas deben estar preferentemente relacionadas con esta materia.
      ${formValue.topic ? `- Tema Específico (Opcional): Si es posible, enfoca la selección de palabras en el tema "${formValue.topic}".` : ''}
      - Cantidad de Palabras: Genera ${formValue.quantity} palabras distintas.
      - Dificultad: Selecciona ${this.#getDifficultyInstruction(formValue.difficulty!)}. Tanto la palabra original como los sinónimos deben ajustarse a esta dificultad.
      - **Formato Obligatorio:** Para CADA palabra, presenta primero la palabra original y LUEGO, en una línea separada, una lista de 3 a 5 sinónimos apropiados. Usa este formato EXACTO:
          Palabra: [Palabra Original Aquí]
          Sinónimos: [Sinónimo 1], [Sinónimo 2], [Sinónimo 3], ...
       (Deja dos líneas en blanco entre cada entrada de palabra/sinónimos).

      IMPORTANTE: Asegúrate de que los sinónimos sean realmente equivalentes en significado (o muy cercanos) en el contexto probable. No incluyas saludos ni despedidas.`;

		try {
			const result = await firstValueFrom(
				this.#aiService.geminiAi(prompt),
			);
			this.generatedSynonyms.set(
				result?.response || 'No se pudieron generar los sinónimos.',
			);
			this.showResult.set(true);
		} catch (error) {
			this.generatedSynonyms.set(
				'Ocurrió un error al generar los sinónimos. Por favor, inténtalo de nuevo.',
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
		this.generatedSynonyms.set('');
		// Reset form to defaults
		this.synonymsForm.reset({
			section: '',
			subject: '',
			quantity: 5,
			difficulty: 'Medio',
			topic: '',
		});
		this.synonymsForm.get('subject')?.disable();
		this.availableSubjects.set([]); // Clear available subjects
	}

	/** Downloads the generated synonyms as DOCX */
	downloadDocx(): void {
		const synonymsText = this.generatedSynonyms();
		if (!synonymsText || synonymsText.startsWith('Ocurrió un error'))
			return;

		const formValue = this.synonymsForm.getRawValue();
		const section = this.sections().find(
			(s) => s._id === formValue.section,
		);

		// Sanitize filename parts
		const sectionName = (section?.name || 'Seccion').replace(
			/[^a-z0-9]/gi,
			'_',
		);
		const subjectName = this.#pretify(
			formValue.subject || 'Asignatura',
		).replace(/[^a-z0-9]/gi, '_');
		const topicName = (formValue.topic || 'Sinonimos')
			.substring(0, 15)
			.replace(/[^a-z0-9]/gi, '_');

		const filename = `Sinonimos_${sectionName}_${subjectName}_${topicName}.docx`;

		// Create paragraphs, trying to format Word/Synonyms
		const paragraphs: Paragraph[] = [];
		// Split by the "Palabra:" marker, keeping the delimiter attached to the following block
		const wordBlocks = synonymsText.split(/\n\s*\n\s*(?=Palabra:)/);

		wordBlocks.forEach((block, index) => {
			if (block.trim().length === 0) return;

			const lines = block.trim().split('\n');
			const wordLine = lines.find((l) => l.trim().startsWith('Palabra:'));
			const synonymsLine = lines.find((l) =>
				l.trim().startsWith('Sinónimos:'),
			);

			const word = wordLine?.replace('Palabra:', '').trim();
			const synonyms = synonymsLine?.replace('Sinónimos:', '').trim();

			if (word) {
				paragraphs.push(
					new Paragraph({
						children: [
							new TextRun({ text: word, bold: true, size: 24 }),
						], // Make word bold and slightly larger
						spacing: { before: index > 0 ? 240 : 0, after: 60 }, // Add space before new word
					}),
				);
			}
			if (synonyms) {
				paragraphs.push(
					new Paragraph({
						children: [
							new TextRun({ text: synonyms, italics: true }),
						], // Italicize synonyms
						spacing: { after: 200 }, // Space after synonyms list
						indent: { left: 360 }, // Indent synonyms slightly
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
							text: `Lista de Sinónimos`,
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
							text: `Asignatura: ${formValue.subject}`,
							alignment: AlignmentType.CENTER,
							style: 'SubtleEmphasis',
						}),
						new Paragraph({
							text: `Dificultad: ${formValue.difficulty}`,
							alignment: AlignmentType.CENTER,
							style: 'SubtleEmphasis',
						}),
						...(formValue.topic
							? [
									new Paragraph({
										text: `Tema Guía: ${formValue.topic}`,
										alignment: AlignmentType.CENTER,
										style: 'SubtleEmphasis',
									}),
								]
							: []),
						new Paragraph({ text: '', spacing: { after: 400 } }), // Extra space
						...paragraphs, // Add the generated word/synonym paragraphs
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
		return this.synonymsForm.get('section');
	}
	get subjectCtrl(): AbstractControl | null {
		return this.synonymsForm.get('subject');
	}
	get quantityCtrl(): AbstractControl | null {
		return this.synonymsForm.get('quantity');
	}
	get difficultyCtrl(): AbstractControl | null {
		return this.synonymsForm.get('difficulty');
	}
	get topicCtrl(): AbstractControl | null {
		return this.synonymsForm.get('topic');
	}
}
