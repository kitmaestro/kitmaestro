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
	selector: 'app-proverb-generator', // Component selector
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
		<mat-card class="proverb-generator-card">
			<mat-card-header>
				<mat-card-title>Generador de Refranes</mat-card-title>
				<mat-card-subtitle
					>Encuentra refranes y su significado para tus
					clases</mat-card-subtitle
				>
			</mat-card-header>

			<mat-card-content>
				@if (!showResult()) {
					<form
						[formGroup]="proverbForm"
						(ngSubmit)="onSubmit()"
						class="proverb-form"
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
								<mat-label
									>Complejidad / Familiaridad</mat-label
								>
								<mat-select
									formControlName="complexity"
									required
								>
									@for (
										level of complexityLevels;
										track level
									) {
										<mat-option [value]="level">{{
											level
										}}</mat-option>
									}
								</mat-select>
								@if (
									complexityCtrl?.invalid &&
									complexityCtrl?.touched
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
								<mat-label
									>Nivel de Vocabulario (en
									explicación)</mat-label
								>
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
									>Tema del refrán (Opcional)</mat-label
								>
								<input
									matInput
									formControlName="topic"
									placeholder="Ej: Trabajo, Paciencia, Amistad"
								/>
							</mat-form-field>
						</div>

						<div class="form-actions">
							<button
								mat-raised-button
								color="primary"
								type="submit"
								[disabled]="
									proverbForm.invalid || isGenerating()
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
										<mat-icon>format_quote</mat-icon>
										Generar Refranes
									</ng-container>
								}
							</button>
						</div>
					</form>
				}

				@if (showResult()) {
					<div class="proverb-result">
						<h3>Refrán(es) Generado(s):</h3>
						<div
							class="proverb-result-content"
							[innerHTML]="
								generatedProverbs().replaceAll(
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
									!generatedProverbs() ||
									generatedProverbs().startsWith(
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
			.proverb-generator-card {
				margin: 0 auto;
				padding: 15px 25px 25px 25px;
			}
			.proverb-form {
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
			.proverb-result {
				margin-top: 20px;
			}
			.proverb-result h3 {
				margin-bottom: 15px;
			}
			.proverb-result-content {
				background-color: #fdf8e4; /* Light parchment background */
				border: 1px solid #fcefc7;
				border-left: 5px solid #a0522d; /* Sienna accent */
				padding: 25px 35px;
				min-height: 150px;
				box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
				line-height: 1.7;
				font-family: 'Times New Roman', Times, serif; /* Classic font */
				font-size: 11pt;
				margin-bottom: 20px;
				max-width: 100%;
				white-space: pre-wrap; /* Preserve formatting */
			}
			/* Style the meaning if possible (depends on AI format) */
			.proverb-result-content span[style*='italic'] {
				/* Example: Italic text */
				display: block;
				margin-top: 0.5em;
				font-style: italic;
				color: #555;
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
export class ProverbGeneratorComponent implements OnInit, OnDestroy {
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
	generatedProverbs = signal<string>(''); // Stores the AI response string
	sections = signal<ClassSection[]>([]);

	// --- Form Definition ---
	proverbForm = this.#fb.group({
		section: ['', Validators.required],
		complexity: ['Menos Común / Figurado', Validators.required], // Default value, changed from length
		vocabulary: ['Medio', Validators.required], // Default value
		topic: [''], // Optional topic
	});

	// --- Fixed Select Options ---
	readonly complexityLevels = [
		'Común / Sencillo',
		'Menos Común / Figurado',
		'Complejo / Antiguo',
	]; // Renamed from length
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

	/** Maps user selection to prompt instructions for complexity */
	#getComplexityInstruction(complexitySelection: string): string {
		switch (complexitySelection) {
			case 'Común / Sencillo':
				return 'muy comunes y de significado bastante literal o fácil de deducir';
			case 'Menos Común / Figurado':
				return 'algo menos comunes o que usen lenguaje más figurado';
			case 'Complejo / Antiguo':
				return 'más complejos, quizás más antiguos o con un significado menos obvio';
			default:
				return 'de complejidad y familiaridad media';
		}
	}

	/** Maps user selection to prompt instructions for vocabulary (reused) */
	#getVocabularyInstruction(vocabularySelection: string): string {
		// This applies mainly to the explanation of the meaning
		switch (vocabularySelection) {
			case 'Reducido':
				return 'un vocabulario muy sencillo y directo en la explicación';
			case 'Medio':
				return 'un vocabulario estándar en la explicación, apropiado para la edad';
			case 'Amplio':
				return 'un vocabulario un poco más rico en la explicación';
			default:
				return 'un vocabulario estándar en la explicación';
		}
	}

	// --- Public Methods ---

	/** Formats section display name */
	getSectionDisplay(section: ClassSection): string {
		return `${this.#pretify(section.year || '')} ${section.name || ''} (${this.#pretify(section.level || 'Nivel no especificado')})`;
	}

	/** Handles form submission */
	async onSubmit(): Promise<void> {
		if (this.proverbForm.invalid) {
			this.proverbForm.markAllAsTouched();
			this.#snackBar.open(
				'Por favor, completa todos los campos requeridos.',
				'Cerrar',
				{ duration: 3000 },
			);
			return;
		}

		this.isGenerating.set(true);
		this.generatedProverbs.set('');
		this.showResult.set(false);

		const formValue = this.proverbForm.getRawValue();
		const selectedSection = this.sections().find(
			(s) => s._id === formValue.section,
		);

		// Construct the prompt for generating proverbs
		const prompt = `Eres un experto en el refranero popular y la sabiduría tradicional, capaz de explicar conceptos complejos de forma sencilla.
      Necesito que generes algunos refranes (proverbios) adecuados para estudiantes.

      Contexto e Instrucciones:
      - Audiencia: Estudiantes de ${this.#pretify(selectedSection?.level || 'Nivel no especificado')}, ${this.#pretify(selectedSection?.year || 'Grado no especificado')}. Los refranes y sus explicaciones deben ser apropiados para su edad y comprensión.
      - Complejidad/Familiaridad Deseada: Selecciona refranes ${this.#getComplexityInstruction(formValue.complexity!)}.
      - Nivel de Vocabulario (para la explicación): Explica el significado usando ${this.#getVocabularyInstruction(formValue.vocabulary!)}.
      ${formValue.topic ? `- Tema Relacionado (Opcional): Si es posible, busca refranes relacionados con "${formValue.topic}".` : ''}
      - Cantidad: Genera 2 o 3 refranes distintos.
      - **Formato Obligatorio:** Para CADA refrán, presenta primero el refrán en sí y LUEGO, en una línea separada y claramente identificada, una breve explicación de su significado adaptada a la audiencia. Usa este formato EXACTO:
          Refrán:
          [Texto del refrán aquí]

          Significado: [Explicación breve y clara aquí]
       (Deja una línea en blanco entre el refrán y el significado, y dos líneas en blanco entre refranes distintos si generas más de uno).

      IMPORTANTE: Asegúrate de que la explicación sea correcta y fácil de entender para la edad indicada. No incluyas saludos ni despedidas.`;

		try {
			const result = await firstValueFrom(
				this.#aiService.geminiAi(prompt),
			);
			this.generatedProverbs.set(
				result?.response || 'No se pudieron generar los refranes.',
			);
			this.showResult.set(true);
		} catch (error) {
			this.generatedProverbs.set(
				'Ocurrió un error al generar los refranes. Por favor, inténtalo de nuevo.',
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
		this.generatedProverbs.set('');
		// Reset form to defaults
		this.proverbForm.reset({
			section: '',
			complexity: 'Menos Común / Figurado',
			vocabulary: 'Medio',
			topic: '',
		});
	}

	/** Downloads the generated proverbs as DOCX */
	downloadDocx(): void {
		const proverbsText = this.generatedProverbs();
		if (!proverbsText || proverbsText.startsWith('Ocurrió un error'))
			return;

		const formValue = this.proverbForm.getRawValue();
		const section = this.sections().find(
			(s) => s._id === formValue.section,
		);

		// Sanitize filename parts
		const sectionName = (section?.name || 'Seccion').replace(
			/[^a-z0-9]/gi,
			'_',
		);
		const complexityName = (formValue.complexity || 'Complejidad')
			.substring(0, 10)
			.replace(/[^a-z0-9]/gi, '_');
		const topicName = (formValue.topic || 'Refranes')
			.substring(0, 15)
			.replace(/[^a-z0-9]/gi, '_');

		const filename = `Refranes_${sectionName}_${complexityName}_${topicName}.docx`;

		// Create paragraphs, trying to format Proverb/Meaning
		const paragraphs: Paragraph[] = [];
		const proverbBlocks = proverbsText.split(/\n\s*\n\s*Refrán:/); // Split by "Refrán:" preceded by empty lines

		proverbBlocks.forEach((block, index) => {
			if (block.trim().length === 0 && index === 0) return; // Skip potential empty first block

			const parts = block.split(/\n\s*Significado:/); // Split each block into proverb and meaning
			const proverbPart = (
				index === 0 && !block.trim().startsWith('Refrán:')
					? block.split(/\n\s*Significado:/)[0]
					: parts[0]
			)
				.replace(/^Refrán:/, '')
				.trim();
			const meaningPart = parts.length > 1 ? parts[1].trim() : null;

			if (proverbPart) {
				paragraphs.push(
					new Paragraph({
						children: [
							new TextRun({
								text: 'Refrán:',
								bold: true,
								break: 1,
							}),
							new TextRun({
								text: ` "${proverbPart}"`,
								italics: true,
								break: 1,
							}),
						], // Quote the proverb
						spacing: { after: 100, before: index > 0 ? 240 : 0 }, // Add space before new proverb
					}),
				);
			}
			if (meaningPart) {
				paragraphs.push(
					new Paragraph({
						children: [
							new TextRun({ text: 'Significado:', bold: true }),
							new TextRun({ text: ` ${meaningPart}` }),
						],
						spacing: { after: 200 }, // More space after explanation
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
							text: `Refranes Generados`,
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
							text: `Complejidad: ${formValue.complexity}`,
							alignment: AlignmentType.CENTER,
							style: 'SubtleEmphasis',
						}),
						new Paragraph({
							text: `Vocabulario (Explicación): ${formValue.vocabulary}`,
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
						...paragraphs, // Add the generated proverb paragraphs
					],
				},
			],
			styles: {
				// Reusing styles
				paragraphStyles: [
					{
						id: 'Normal',
						name: 'Normal',
						run: { font: 'Times New Roman', size: 22 }, // 11pt
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
		return this.proverbForm.get('section');
	}
	get complexityCtrl(): AbstractControl | null {
		return this.proverbForm.get('complexity');
	}
	get vocabularyCtrl(): AbstractControl | null {
		return this.proverbForm.get('vocabulary');
	}
	get topicCtrl(): AbstractControl | null {
		return this.proverbForm.get('topic');
	}
}
