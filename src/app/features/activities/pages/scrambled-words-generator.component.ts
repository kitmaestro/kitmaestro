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

// --- Core Services & Interfaces (Using new structure paths) ---
import { AiService } from '../../../core/services/ai.service';
import { ClassSectionService } from '../../../core/services/class-section.service';
import { ClassSection } from '../../../core';

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
import {
	loadSections,
	selectAllClassSections,
} from '../../../store/class-sections';
import { PretifyPipe } from '../../../shared';
import { MarkdownComponent } from 'ngx-markdown';

@Component({
	selector: 'app-scrambled-words-generator',
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
		PretifyPipe,
		MatIconModule,
		MarkdownComponent,
	],
	template: `
		<div class="scrambled-words-card">
			<div>
				<h2>Generador de Palabras Desordenadas</h2>
			</div>

			<div>
				@if (!showResult()) {
					<form
						[formGroup]="scrambledWordsForm"
						(ngSubmit)="onSubmit()"
						class="scrambled-words-form"
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
									max="25"
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
											>Máximo 25 palabras.</mat-error
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
									placeholder="Ej: Partes del cuerpo, Colores, Verbos comunes"
								/>
							</mat-form-field>
						</div>

						<div class="form-actions">
							<button
								mat-raised-button
								color="primary"
								type="submit"
								[disabled]="
									scrambledWordsForm.invalid || isGenerating()
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
										<mat-icon>shuffle</mat-icon> Generar
										Palabras Desordenadas
									</ng-container>
								}
							</button>
						</div>
					</form>
				}

				@if (showResult()) {
					<div class="scrambled-words-result">
						<h3>Palabras Desordenadas Generadas:</h3>
						<div class="scrambled-words-content">
							<markdown [data]="generatedScrambledWords()" />
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
									!generatedScrambledWords() ||
									generatedScrambledWords().startsWith(
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
	styles: [
		`
			:host {
				display: block;
			}
			.scrambled-words-card {
				margin: 0 auto;
				padding: 15px 25px 25px 25px;
			}
			.scrambled-words-form {
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
			.scrambled-words-result {
				margin-top: 20px;
			}
			.scrambled-words-result h3 {
				margin-bottom: 15px;
			}
			.scrambled-words-content {
				background-color: #f3e5f5;
				border: 1px solid #e1bee7;
				border-left: 5px solid #9c27b0;
				padding: 25px 35px;
				min-height: 200px;
				box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
				line-height: 1.8;
				font-family: 'Courier New', Courier, monospace;
				font-size: 11pt;
				margin-bottom: 20px;
				max-width: 100%;
				white-space: pre-wrap;
			}
			.scrambled-words-content strong {
				display: inline-block;
				margin-right: 5px;
				font-weight: bold;
			}
			.scrambled-words-content br + strong {
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
export class ScrambledWordsGeneratorComponent implements OnInit, OnDestroy {
	#fb = inject(FormBuilder);
	#aiService = inject(AiService);
	#snackBar = inject(MatSnackBar);
	#store = inject(Store);

	isLoadingSections = signal(false);
	isGenerating = signal(false);
	showResult = signal(false);
	generatedScrambledWords = signal<string>('');
	sections = this.#store.selectSignal(selectAllClassSections);
	availableSubjects = signal<string[]>([]);

	scrambledWordsForm = this.#fb.group({
		section: ['', Validators.required],
		subject: [{ value: '', disabled: true }, Validators.required],
		quantity: [
			10,
			[Validators.required, Validators.min(1), Validators.max(25)],
		],
		difficulty: ['Medio', Validators.required],
		topic: [''],
	});

	readonly difficultyLevels = ['Fácil', 'Medio', 'Difícil'];
	#destroy$ = new Subject<void>();

	ngOnInit(): void {
		this.#store.dispatch(loadSections());
		this.#loadSections();
		this.#listenForSectionChanges();
	}

	ngOnDestroy(): void {
		this.#destroy$.next();
		this.#destroy$.complete();
	}

	#loadSections(): void {
		this.isLoadingSections.set(true);
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
		this.isGenerating.set(false);
		return EMPTY;
	}

	#getDifficultyInstruction(difficultySelection: string): string {
		switch (difficultySelection) {
			case 'Fácil':
				return 'palabras cortas (3-5 letras) y comunes';
			case 'Medio':
				return 'palabras de longitud media (5-8 letras) de uso estándar';
			case 'Difícil':
				return 'palabras más largas (8+ letras) o menos comunes';
			default:
				return 'palabras de longitud y dificultad media';
		}
	}

	getSectionDisplay(section: ClassSection): string {
		return `${section.year || ''} ${section.name || ''} (${section.level || 'Nivel no especificado'})`;
	}

	async onSubmit(): Promise<void> {
		if (this.scrambledWordsForm.invalid) {
			this.scrambledWordsForm.markAllAsTouched();
			this.#snackBar.open(
				'Por favor, completa todos los campos requeridos.',
				'Cerrar',
				{ duration: 3000 },
			);
			return;
		}

		this.isGenerating.set(true);
		this.generatedScrambledWords.set('');
		this.showResult.set(false);

		const formValue = this.scrambledWordsForm.getRawValue();
		const selectedSection = this.sections().find(
			(s) => s._id === formValue.section,
		);

		const prompt = `Eres un creador de juegos de palabras y actividades lingüísticas para estudiantes.
      Necesito que generes una lista de palabras desordenadas (anagramas) para una clase.

      Contexto e Instrucciones:
      - Audiencia: Estudiantes de ${selectedSection?.level || 'Nivel no especificado'}, ${selectedSection?.year || 'Grado no especificado'}. Las palabras deben ser apropiadas para su edad.
      - Asignatura: ${formValue.subject}. Las palabras seleccionadas deben estar preferentemente relacionadas con esta materia.
      ${formValue.topic ? `- Tema Específico (Opcional): Si es posible, enfoca la selección de palabras en el tema "${formValue.topic}".` : ''}
      - Cantidad de Palabras: Genera ${formValue.quantity} palabras distintas.
      - Dificultad: Selecciona ${this.#getDifficultyInstruction(formValue.difficulty!)}.
      - **Formato Obligatorio:** Para CADA palabra, presenta primero la versión desordenada y LUEGO, en una línea separada, la palabra original (la respuesta). Usa este formato EXACTO:
          Desordenada: [Palabra con letras mezcladas aquí]
          Palabra: [Palabra Original Aquí]
       (Deja dos líneas en blanco entre cada entrada de palabra desordenada/original).
      - Mezcla: Asegúrate de que las letras estén bien mezcladas en la versión desordenada.

      IMPORTANTE: No incluyas saludos ni despedidas.`;

		try {
			const result = await firstValueFrom(
				this.#aiService.geminiAi(prompt),
			);
			this.generatedScrambledWords.set(
				result?.response ||
					'No se pudieron generar las palabras desordenadas.',
			);
			this.showResult.set(true);
		} catch (error) {
			this.generatedScrambledWords.set(
				'Ocurrió un error al generar las palabras. Por favor, inténtalo de nuevo.',
			);
			this.showResult.set(true);
			this.#handleError(error, 'Error al contactar el servicio de IA');
		} finally {
			this.isGenerating.set(false);
		}
	}

	goBack(): void {
		this.showResult.set(false);
		this.generatedScrambledWords.set('');
		this.scrambledWordsForm.reset({
			section: '',
			subject: { value: '', disabled: true },
			quantity: 10,
			difficulty: 'Medio',
			topic: '',
		});
		this.availableSubjects.set([]);
	}

	downloadDocx(): void {
		const scrambledText = this.generatedScrambledWords();
		if (!scrambledText || scrambledText.startsWith('Ocurrió un error'))
			return;

		const formValue = this.scrambledWordsForm.getRawValue();
		const section = this.sections().find(
			(s) => s._id === formValue.section,
		);

		const sectionName = (section?.name || 'Seccion').replace(
			/[^a-z0-9]/gi,
			'_',
		);
		const subjectName = (formValue.subject || 'Asignatura').replace(
			/[^a-z0-9]/gi,
			'_',
		);
		const topicName = (formValue.topic || 'PalabrasDes')
			.substring(0, 15)
			.replace(/[^a-z0-9]/gi, '_');

		const filename = `PalabrasDes_${sectionName}_${subjectName}_${topicName}.docx`;

		const paragraphs: Paragraph[] = [];
		const wordBlocks = scrambledText.split(/\n\s*\n\s*(?=Desordenada:)/);

		wordBlocks.forEach((block, index) => {
			if (block.trim().length === 0) return;

			const lines = block.trim().split('\n');
			const scrambledLine = lines.find((l) =>
				l.trim().startsWith('Desordenada:'),
			);
			const wordLine = lines.find((l) => l.trim().startsWith('Palabra:'));

			const scrambled = scrambledLine?.replace('Desordenada:', '').trim();
			const word = wordLine?.replace('Palabra:', '').trim();

			if (scrambled) {
				paragraphs.push(
					new Paragraph({
						children: [
							new TextRun({ text: 'Desordenada:', bold: true }),
							new TextRun({
								text: ` ${scrambled}`,
								font: 'Courier New',
							}),
						],
						spacing: { before: index > 0 ? 240 : 0, after: 60 },
					}),
				);
			}
			if (word) {
				paragraphs.push(
					new Paragraph({
						children: [
							new TextRun({ text: 'Palabra:', bold: true }),
							new TextRun({ text: ` ${word}` }),
						],
						spacing: { after: 200 },
					}),
				);
			}
		});

		const doc = new Document({
			sections: [
				{
					properties: {},
					children: [
						new Paragraph({
							text: `Palabras Desordenadas`,
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
						new Paragraph({ text: '', spacing: { after: 400 } }),
						...paragraphs,
					],
				},
			],
			styles: {
				paragraphStyles: [
					{
						id: 'Normal',
						name: 'Normal',
						run: { font: 'Verdana', size: 22 },
					},
					{
						id: 'SubtleEmphasis',
						name: 'Subtle Emphasis',
						basedOn: 'Normal',
						run: { italics: true, color: '5A5A5A', size: 20 },
					},
				],
			},
		});

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

	get sectionCtrl(): AbstractControl | null {
		return this.scrambledWordsForm.get('section');
	}
	get subjectCtrl(): AbstractControl | null {
		return this.scrambledWordsForm.get('subject');
	}
	get quantityCtrl(): AbstractControl | null {
		return this.scrambledWordsForm.get('quantity');
	}
	get difficultyCtrl(): AbstractControl | null {
		return this.scrambledWordsForm.get('difficulty');
	}
	get topicCtrl(): AbstractControl | null {
		return this.scrambledWordsForm.get('topic');
	}
}
