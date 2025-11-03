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
	Observable,
	firstValueFrom,
	takeUntil,
	tap,
	catchError,
	EMPTY,
} from 'rxjs';

// Angular Material Modules
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';

// --- Core Services & Interfaces (Using new structure paths) ---
import { AiService } from '../../../core/services/ai.service';
import { ClassSection } from '../../../core';
import { PretifyPipe } from '../../../shared/pipes/pretify.pipe';

// --- DOCX Generation ---
import { MarkdownComponent } from 'ngx-markdown';
import {
	Document,
	Packer,
	Paragraph,
	TextRun,
	AlignmentType,
	HeadingLevel,
} from 'docx';
import { saveAs } from 'file-saver';
import { Store } from '@ngrx/store';
import {
	loadCurrentSubscription,
	loadSections,
	selectAllClassSections,
} from '../../../store';
import { selectIsPremium } from '../../../store/user-subscriptions/user-subscriptions.selectors';

@Component({
	selector: 'app-expository-article-generator', // Component selector
	standalone: true,
	imports: [
		ReactiveFormsModule,
		MatFormFieldModule,
		MatSelectModule,
		MatInputModule,
		MatButtonModule,
		MatProgressSpinnerModule,
		MatSnackBarModule,
		MatIconModule,
		MarkdownComponent,
	],
	// --- Inline Template ---
	template: `
		<div class="expository-article-card">
			<div>
				<h2>Generador de Artículo Expositivo</h2>
			</div>

			<div>
				@if (!showResult()) {
					<form
						[formGroup]="articleForm"
						(ngSubmit)="onSubmit()"
						class="article-form"
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
											<mat-option [value]="section._id">
												{{ section.name }}
											</mat-option>
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
								<mat-label>Complejidad del Artículo</mat-label>
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
								<mat-label>Tema del Artículo</mat-label>
								<input
									matInput
									formControlName="topic"
									required
									placeholder="Ej: El sistema solar, Los volcanes, La fotosíntesis"
								/>
								@if (topicCtrl?.invalid && topicCtrl?.touched) {
									<mat-error>El tema es requerido.</mat-error>
								}
							</mat-form-field>
						</div>

						<div class="form-actions">
							<button
								mat-flat-button
								color="primary"
								type="submit"
								[disabled]="
									articleForm.invalid || isGenerating()
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
										<mat-icon>article</mat-icon> Generar
										Artículo
									</ng-container>
								}
							</button>
						</div>
					</form>
				}

				@if (showResult()) {
					<div class="article-result">
						<h3>Artículo Expositivo Generado:</h3>
						<div class="article-result-content">
							<markdown [data]="generatedArticle()" />
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
								(click)="downloadDocx()"
								[disabled]="
									!generatedArticle() ||
									generatedArticle().startsWith(
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
			.expository-article-card {
				margin: 0 auto;
				padding: 15px 25px 25px 25px;
			}
			.article-form {
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
			/* .full-width-field { flex-basis: 100%; } */ /* Topic field takes half width now */
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
			.article-result {
				margin-top: 20px;
			}
			.article-result h3 {
				margin-bottom: 15px;
			}
			.article-result-content {
				background-color: #f5f5f5; /* Neutral grey background */
				border: 1px solid #e0e0e0;
				border-left: 5px solid #757575; /* Grey accent */
				padding: 30px 40px;
				min-height: 300px;
				box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
				line-height: 1.7;
				font-family: 'Arial', sans-serif; /* Standard sans-serif */
				font-size: 11pt;
				margin-bottom: 20px;
				max-width: 100%;
				white-space: pre-wrap; /* Preserve paragraphs */
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
export class ExpositoryArticleGeneratorComponent implements OnInit, OnDestroy {
	#fb = inject(FormBuilder);
	#aiService = inject(AiService);
	#store = inject(Store);
	#snackBar = inject(MatSnackBar);

	#pretify = new PretifyPipe().transform;

	// --- State Signals ---
	isLoadingSections = signal(false);
	isGenerating = signal(false);
	showResult = signal(false);
	generatedArticle = signal<string>('');
	sections = this.#store.selectSignal(selectAllClassSections);

	isPremium = this.#store.selectSignal(selectIsPremium);

	// --- Form Definition ---
	articleForm = this.#fb.group({
		section: ['', Validators.required],
		complexity: ['Media', Validators.required], // Default value
		vocabulary: ['Medio', Validators.required], // Default value
		topic: ['', Validators.required], // Topic is required
	});

	// --- Fixed Select Options ---
	readonly complexityLevels = ['Básica', 'Media', 'Avanzada'];
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
		this.#store.dispatch(loadSections());
		this.#store
			.select(selectAllClassSections)
			.pipe(
				takeUntil(this.#destroy$),
				catchError((error) =>
					this.#handleError(error, 'Error al cargar las secciones.'),
				),
				tap(() => this.isLoadingSections.set(false)),
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
			case 'Básica':
				return 'con una estructura simple (introducción corta, 1-2 párrafos de desarrollo con ideas principales, conclusión breve), frases cortas y directas';
			case 'Media':
				return 'con una estructura estándar (introducción, varios párrafos de desarrollo con algunos detalles o ejemplos, conclusión), frases de longitud variada';
			case 'Avanzada':
				return 'bien estructurado (introducción, desarrollo detallado en varios párrafos con explicaciones más profundas, ejemplos o datos, conclusión sólida), usando quizás frases más complejas';
			default:
				return 'con una estructura estándar (introducción, varios párrafos de desarrollo, conclusión)';
		}
	}

	/** Maps user selection to prompt instructions for vocabulary (reused) */
	#getVocabularyInstruction(vocabularySelection: string): string {
		switch (vocabularySelection) {
			case 'Reducido':
				return 'un vocabulario básico y común, evitando tecnicismos';
			case 'Medio':
				return 'un vocabulario estándar para la edad, explicando términos clave si es necesario';
			case 'Amplio':
				return 'un vocabulario más preciso y variado, incluyendo términos específicos del tema (explicándolos si son complejos)';
			default:
				return 'un vocabulario estándar para la edad';
		}
	}

	// --- Public Methods ---

	/** Formats section display name */
	getSectionDisplay(section: ClassSection): string {
		return `${this.#pretify(section.year || '')} ${section.name || ''} (${this.#pretify(section.level || 'Nivel no especificado')})`;
	}

	/** Handles form submission */
	async onSubmit(): Promise<void> {
		if (this.articleForm.invalid) {
			this.articleForm.markAllAsTouched();
			this.#snackBar.open(
				'Por favor, completa todos los campos requeridos.',
				'Cerrar',
				{ duration: 3000 },
			);
			return;
		}

		this.isGenerating.set(true);
		this.generatedArticle.set('');
		this.showResult.set(false);

		const formValue = this.articleForm.getRawValue();
		const selectedSection = this.sections().find(
			(s) => s._id === formValue.section,
		);

		// Construct the prompt for generating the expository article
		const prompt = `Eres un redactor experto en crear textos expositivos claros y educativos para diferentes edades.
      Necesito que escribas un artículo expositivo ejemplar sobre un tema específico.

      Contexto e Instrucciones:
      - Audiencia: Estudiantes de ${this.#pretify(selectedSection?.level || 'Nivel no especificado')}, ${this.#pretify(selectedSection?.year || 'Grado no especificado')}. El artículo debe ser comprensible y adecuado para su nivel.
      - Tema (Requerido): El artículo debe tratar sobre "${formValue.topic}". Explica o informa sobre este tema de manera objetiva.
      - Complejidad del Artículo: El artículo debe ser de complejidad ${this.#getComplexityInstruction(formValue.complexity!)}.
      - Nivel de Vocabulario: Utiliza ${this.#getVocabularyInstruction(formValue.vocabulary!)}.
      - Estructura Expositiva: Organiza el artículo claramente con:
          1. Introducción: Presenta el tema y el propósito del artículo.
          2. Desarrollo: Expón la información en varios párrafos lógicos, usando hechos, ejemplos o explicaciones claras.
          3. Conclusión: Resume los puntos principales o cierra la idea general.
      - Tono: Mantén un tono objetivo, informativo y neutral.
      - Formato: Escribe el artículo en párrafos bien separados (usa doble salto de línea entre párrafos). Puedes usar un título simple relacionado con el tema. No incluyas saludos ni despedidas.

      IMPORTANTE: Enfócate en la claridad, la precisión de la información (haz tu mejor esfuerzo por ser factual) y la estructura lógica del texto expositivo.`;

		try {
			const result = await firstValueFrom(
				this.#aiService.geminiAi(prompt),
			);
			this.generatedArticle.set(
				result?.response || 'No se pudo generar el artículo.',
			);
			this.showResult.set(true);
		} catch (error) {
			this.generatedArticle.set(
				'Ocurrió un error al generar el artículo. Por favor, inténtalo de nuevo.',
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
		this.generatedArticle.set('');
		// Reset form to defaults
		this.articleForm.reset({
			section: '',
			complexity: 'Media',
			vocabulary: 'Medio',
			topic: '',
		});
	}

	/** Downloads the generated article as DOCX */
	downloadDocx(): void {
		const articleText = this.generatedArticle();
		if (!articleText || articleText.startsWith('Ocurrió un error')) return;

		const formValue = this.articleForm.getRawValue();
		const section = this.sections().find(
			(s) => s._id === formValue.section,
		);

		// Sanitize filename parts
		const sectionName = (section?.name || 'Seccion').replace(
			/[^a-z0-9]/gi,
			'_',
		);
		const topicName = (formValue.topic || 'Articulo')
			.substring(0, 20)
			.replace(/[^a-z0-9]/gi, '_');
		const complexityName = (formValue.complexity || 'Media').replace(
			/[^a-z0-9]/gi,
			'_',
		);

		const filename = `Articulo_${sectionName}_${complexityName}_${topicName}.docx`;

		// Create paragraphs, splitting by double newline
		const paragraphs = articleText
			.split(/\n\s*\n/) // Split by one or more empty lines
			.filter((p) => p.trim().length > 0)
			.map(
				(paragraph) =>
					new Paragraph({
						children: [new TextRun(paragraph.trim())],
						spacing: { after: 120 }, // Spacing after paragraph (6pt)
						// indent: { firstLine: 720 }, // Optional: Indent first line
					}),
			);

		// Create the document
		const doc = new Document({
			sections: [
				{
					properties: {},
					children: [
						// Optional: Try to extract a title if the AI provided one on the first line
						// new Paragraph({ text: `Artículo Expositivo: ${formValue.topic}`, heading: HeadingLevel.HEADING_1, alignment: AlignmentType.CENTER, spacing: { after: 300 } }),
						new Paragraph({
							text: `Artículo Expositivo`,
							heading: HeadingLevel.HEADING_1,
							alignment: AlignmentType.CENTER,
							spacing: { after: 100 },
						}),
						new Paragraph({
							text: `Tema: ${formValue.topic}`,
							heading: HeadingLevel.HEADING_2,
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
							text: `Vocabulario: ${formValue.vocabulary}`,
							alignment: AlignmentType.CENTER,
							style: 'SubtleEmphasis',
						}),
						new Paragraph({ text: '', spacing: { after: 400 } }), // Extra space
						...paragraphs, // Add the generated article paragraphs
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
		return this.articleForm.get('section');
	}
	get complexityCtrl(): AbstractControl | null {
		return this.articleForm.get('complexity');
	}
	get vocabularyCtrl(): AbstractControl | null {
		return this.articleForm.get('vocabulary');
	}
	get topicCtrl(): AbstractControl | null {
		return this.articleForm.get('topic');
	}
}
