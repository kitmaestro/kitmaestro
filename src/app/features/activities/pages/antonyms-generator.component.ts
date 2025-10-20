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
import {
	Subject,
	Observable,
	firstValueFrom,
	takeUntil,
	tap,
	EMPTY,
	distinctUntilChanged,
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
import { ClassSectionStateStatus, loadSections, selectAllClassSections, selectClassSectionsStatus } from '../../../store/class-sections';

@Component({
	selector: 'app-antonyms-generator', // Component selector
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
		PretifyPipe,
	],
	// --- Inline Template ---
	template: `
		<div class="antonyms-generator-card">
			<h2>Generador de Antónimos</h2>

			<div>
				@if (!showResult()) {
					<form
						[formGroup]="antonymsForm"
						(ngSubmit)="onSubmit()"
						class="antonyms-form"
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
									placeholder="Ej: Sentimientos, Tamaños, Acciones"
								/>
							</mat-form-field>
						</div>

						<div class="form-actions">
							<button
								mat-flat-button
								color="primary"
								type="submit"
								[disabled]="
									antonymsForm.invalid || isGenerating()
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
										<mat-icon>compare_arrows</mat-icon>
										Generar Antónimos
									</ng-container>
								}
							</button>
						</div>
					</form>
				}

				@if (showResult()) {
					<div class="antonyms-result">
						<h3>Antónimos Generados:</h3>
						<div
							class="antonyms-result-content"
							[innerHTML]="
								generatedAntonyms().replaceAll(
									'
',
									'<br>'
								)
							"
						></div>

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
									!generatedAntonyms() ||
									generatedAntonyms().startsWith(
										'Ocurrió un error'
									)
								"
							>
								<mat-icon>download</mat-icon> Descargar (.docx)
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
			.antonyms-generator-card {
				margin: 0 auto;
				padding: 15px 25px 25px 25px;
			}
			.antonyms-form {
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
			.antonyms-result {
				margin-top: 20px;
			}
			.antonyms-result h3 {
				margin-bottom: 15px;
			}
			.antonyms-result-content {
				background-color: #fbe9e7; /* Light deep orange background */
				border: 1px solid #ffccbc;
				border-left: 5px solid #ff5722; /* Deep orange accent */
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
			/* Style potential word/antonym pairs */
			.antonyms-result-content strong {
				/* Example: Bold text for original word */
				display: inline-block;
				margin-right: 5px;
				font-weight: bold;
			}
			.antonyms-result-content br + strong {
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
export class AntonymsGeneratorComponent implements OnInit, OnDestroy {
	#store = inject(Store)
	#fb = inject(FormBuilder)
	#aiService = inject(AiService)
	#snackBar = inject(MatSnackBar)
	#pretify = new PretifyPipe().transform

	isLoadingSections = computed(() => {
		const statusSignal = this.#store.selectSignal(selectClassSectionsStatus)
		return statusSignal() === ClassSectionStateStatus.LOADING_SECTIONS
	})
	isGenerating = signal(false)
	showResult = signal(false)
	generatedAntonyms = signal<string>('')
	sections = this.#store.selectSignal(selectAllClassSections)
	availableSubjects = signal<string[]>([])

	antonymsForm = this.#fb.group({
		section: ['', Validators.required],
		subject: [{ value: '', disabled: true }, Validators.required],
		quantity: [
			5,
			[Validators.required, Validators.min(1), Validators.max(20)],
		],
		difficulty: ['Medio', Validators.required],
		topic: [''],
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

	ngOnDestroy(): void {
		this.#destroy$.next();
		this.#destroy$.complete();
	}

	#loadSections(): void {
		this.#store.dispatch(loadSections())
	}

	#listenForSectionChanges(): void {
		this.sectionCtrl?.valueChanges
			.pipe(
				takeUntil(this.#destroy$),
				distinctUntilChanged(),
				tap((sectionId) => {
					this.subjectCtrl?.reset()
					this.subjectCtrl?.disable()
					if (sectionId) {
						const section = this.sections()?.find(cs => cs._id == sectionId)
						if (section) {
							this.availableSubjects.set(section.subjects)
							this.subjectCtrl?.enable()
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
				return 'palabras comunes con antónimos claros y directos';
			case 'Medio':
				return 'palabras de uso estándar con antónimos comunes, quizás algunos menos obvios';
			case 'Difícil':
				return 'palabras menos comunes o más abstractas, con antónimos que requieran mayor comprensión del matiz';
			default:
				return 'palabras de uso estándar con antónimos de dificultad media';
		}
	}

	// --- Public Methods ---

	/** Formats section display name */
	getSectionDisplay(section: ClassSection): string {
		return `${this.#pretify(section.year || '')} ${section.name || ''} (${this.#pretify(section.level || 'Nivel no especificado')})`;
	}

	/** Handles form submission */
	async onSubmit(): Promise<void> {
		if (this.antonymsForm.invalid) {
			this.antonymsForm.markAllAsTouched();
			this.#snackBar.open(
				'Por favor, completa todos los campos requeridos.',
				'Cerrar',
				{ duration: 3000 },
			);
			return;
		}

		this.isGenerating.set(true);
		this.generatedAntonyms.set('');
		this.showResult.set(false);

		const formValue = this.antonymsForm.getRawValue();
		const selectedSection = this.sections().find(
			(s) => s._id === formValue.section,
		);

		// Construct the prompt for generating antonyms
		const prompt = `Eres un lexicógrafo experto y profesor de lengua, especializado en el concepto de antonimia y en adaptar el vocabulario a diferentes niveles educativos.
      Necesito que generes una lista de palabras con sus respectivos antónimos para una clase.

      Contexto e Instrucciones:
      - Audiencia: Estudiantes de ${this.#pretify(selectedSection?.level || 'Nivel no especificado')}, ${this.#pretify(selectedSection?.year || 'Grado no especificado')}. Las palabras y los antónimos deben ser apropiados para su edad y nivel de comprensión.
      - Asignatura: ${this.#pretify(formValue.subject || '')}. Las palabras seleccionadas deben estar preferentemente relacionadas con esta materia.
      ${formValue.topic ? `- Tema Específico (Opcional): Si es posible, enfoca la selección de palabras en el tema "${formValue.topic}".` : ''}
      - Cantidad de Palabras: Genera ${formValue.quantity} palabras distintas.
      - Dificultad: Selecciona ${this.#getDifficultyInstruction(formValue.difficulty!)}. Tanto la palabra original como los antónimos deben ajustarse a esta dificultad.
      - **Formato Obligatorio:** Para CADA palabra, presenta primero la palabra original y LUEGO, en una línea separada, una lista de 1 a 3 antónimos apropiados (a veces solo hay uno claro). Usa este formato EXACTO:
          Palabra: [Palabra Original Aquí]
          Antónimos: [Antónimo 1], [Antónimo 2], ...
       (Deja dos líneas en blanco entre cada entrada de palabra/antónimos).

      IMPORTANTE: Asegúrate de que los antónimos representen un significado opuesto o muy contrastante en el contexto probable. No incluyas saludos ni despedidas.`;

		try {
			const result = await firstValueFrom(
				this.#aiService.geminiAi(prompt),
			);
			this.generatedAntonyms.set(
				result?.response || 'No se pudieron generar los antónimos.',
			);
			this.showResult.set(true);
		} catch (error) {
			this.generatedAntonyms.set(
				'Ocurrió un error al generar los antónimos. Por favor, inténtalo de nuevo.',
			);
			this.showResult.set(true); // Show error in result area
			this.#handleError(error, 'Error al contactar el servicio de IA');
		} finally {
			this.isGenerating.set(false);
		}
	}

	goBack(): void {
		this.showResult.set(false);
		this.generatedAntonyms.set('');
		this.antonymsForm.reset({
			section: '',
			subject: '',
			quantity: 5,
			difficulty: 'Medio',
			topic: '',
		});
		this.antonymsForm.get('subject')?.disable();
	}

	downloadDocx(): void {
		const antonymsText = this.generatedAntonyms();
		if (!antonymsText || antonymsText.startsWith('Ocurrió un error'))
			return;

		const formValue = this.antonymsForm.getRawValue();
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
		const topicName = (formValue.topic || 'Antonimos')
			.substring(0, 15)
			.replace(/[^a-z0-9]/gi, '_');

		const filename = `Antonimos_${sectionName}_${subjectName}_${topicName}.docx`;

		// Create paragraphs, trying to format Word/Antonyms
		const paragraphs: Paragraph[] = [];
		// Split by the "Palabra:" marker, keeping the delimiter attached to the following block
		const wordBlocks = antonymsText.split(/\n\s*\n\s*(?=Palabra:)/);

		wordBlocks.forEach((block, index) => {
			if (block.trim().length === 0) return;

			const lines = block.trim().split('\n');
			const wordLine = lines.find((l) => l.trim().startsWith('Palabra:'));
			const antonymsLine = lines.find((l) =>
				l.trim().startsWith('Antónimos:'),
			); // Changed from Sinónimos

			const word = wordLine?.replace('Palabra:', '').trim();
			const antonyms = antonymsLine?.replace('Antónimos:', '').trim(); // Changed from Sinónimos

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
			if (antonyms) {
				paragraphs.push(
					new Paragraph({
						children: [
							new TextRun({ text: antonyms, italics: true }),
						], // Italicize antonyms
						spacing: { after: 200 }, // Space after antonyms list
						indent: { left: 360 }, // Indent antonyms slightly
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
							text: `Lista de Antónimos`,
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
						...paragraphs, // Add the generated word/antonym paragraphs
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
		return this.antonymsForm.get('section');
	}
	get subjectCtrl(): AbstractControl | null {
		return this.antonymsForm.get('subject');
	}
	get quantityCtrl(): AbstractControl | null {
		return this.antonymsForm.get('quantity');
	}
	get difficultyCtrl(): AbstractControl | null {
		return this.antonymsForm.get('difficulty');
	}
	get topicCtrl(): AbstractControl | null {
		return this.antonymsForm.get('topic');
	}
}
