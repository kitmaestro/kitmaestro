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
	selector: 'app-song-generator', // Component selector
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
		<div class="song-generator-card">
			<div>
				<h2>Generador de Canciones</h2>
			</div>

			<div>
				@if (!showResult()) {
					<form
						[formGroup]="songForm"
						(ngSubmit)="onSubmit()"
						class="song-form"
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
								<mat-label>Complejidad de la Canción</mat-label>
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
								class="form-field full-width-field"
							>
								<mat-label>Temática de la Canción</mat-label>
								<input
									matInput
									formControlName="topic"
									required
									placeholder="Ej: Día de las Madres, La Amistad, Cuidar el Planeta"
								/>
								@if (topicCtrl?.invalid && topicCtrl?.touched) {
									<mat-error
										>La temática es requerida.</mat-error
									>
								}
							</mat-form-field>
						</div>

						<div class="form-actions">
							<button
								mat-flat-button
								color="primary"
								type="submit"
								[disabled]="songForm.invalid || isGenerating()"
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
										<mat-icon>music_note</mat-icon> Generar
										Canción
									</ng-container>
								}
							</button>
						</div>
					</form>
				}

				@if (showResult()) {
					<div class="song-result">
						<h3>Canción Generada:</h3>
						<div class="song-result-content">
							<markdown [data]="generatedSong()" />
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
									!generatedSong() ||
									generatedSong().startsWith(
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
			.song-generator-card {
				margin: 0 auto;
				padding: 15px 25px 25px 25px;
			}
			.song-form {
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
			.song-result {
				margin-top: 20px;
			}
			.song-result h3 {
				margin-bottom: 15px;
			}
			.song-result-content {
				background-color: #fce4ec; /* Light pink background */
				border: 1px solid #f8bbd0;
				border-left: 5px solid #e91e63; /* Pink accent */
				padding: 25px 35px;
				min-height: 250px;
				box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
				line-height: 1.7;
				font-family:
					'Verdana', Geneva, Tahoma, sans-serif; /* Clean font */
				font-size: 11pt;
				margin-bottom: 20px;
				max-width: 100%;
				white-space: pre-wrap; /* Preserve lines/stanzas */
			}
			/* Style potential chorus/verse markers if AI uses them */
			.song-result-content strong {
				/* Example: Bold text for [Coro] etc. */
				display: block;
				margin-top: 1em;
				margin-bottom: 0.5em;
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
export class SongGeneratorComponent implements OnInit, OnDestroy {
	#store = inject(Store)
	#fb = inject(FormBuilder);
	#aiService = inject(AiService);
	#sectionService = inject(ClassSectionService);
	#snackBar = inject(MatSnackBar);

	#pretify = new PretifyPipe().transform;

	isPremium = this.#store.selectSignal(selectIsPremium)

	// --- State Signals ---
	isLoadingSections = signal(false);
	isGenerating = signal(false);
	showResult = signal(false);
	generatedSong = signal<string>(''); // Stores the AI response string
	sections = signal<ClassSection[]>([]);

	// --- Form Definition ---
	songForm = this.#fb.group({
		section: ['', Validators.required],
		complexity: ['Media / Estructurada', Validators.required], // Default value
		topic: ['', Validators.required], // Topic is required
	});

	// --- Fixed Select Options ---
	readonly complexityLevels = [
		'Simple / Repetitiva',
		'Media / Estructurada',
		'Elaborada / Creativa',
	];

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
	#getComplexityInstruction(complexitySelection: string): string {
		switch (complexitySelection) {
			case 'Simple / Repetitiva':
				return 'muy simple, con vocabulario básico, estructura repetitiva (verso-coro sencillo) y rimas fáciles, ideal para niños pequeños';
			case 'Media / Estructurada':
				return 'con una estructura clara (varias estrofas, coro definido), vocabulario estándar para la edad, rimas y ritmo agradables';
			case 'Elaborada / Creativa':
				return 'más elaborada, con lenguaje más creativo o poético, quizás una estructura menos predecible (puente musical?) y rimas más trabajadas';
			default:
				return 'con una estructura clara (varias estrofas, coro definido), vocabulario estándar para la edad, rimas y ritmo agradables';
		}
	}

	// --- Public Methods ---

	/** Formats section display name */
	getSectionDisplay(section: ClassSection): string {
		return `${this.#pretify(section.year || '')} ${section.name || ''} (${this.#pretify(section.level || 'Nivel no especificado')})`;
	}

	/** Handles form submission */
	async onSubmit(): Promise<void> {
		if (this.songForm.invalid) {
			this.songForm.markAllAsTouched();
			this.#snackBar.open(
				'Por favor, completa todos los campos requeridos.',
				'Cerrar',
				{ duration: 3000 },
			);
			return;
		}

		this.isGenerating.set(true);
		this.generatedSong.set('');
		this.showResult.set(false);

		const formValue = this.songForm.getRawValue();
		const selectedSection = this.sections().find(
			(s) => s._id === formValue.section,
		);

		// Construct the prompt for generating song lyrics
		const prompt = `Eres un compositor y letrista experto en crear canciones originales para público infantil y juvenil, adecuadas para actividades escolares.
Necesito que escribas la letra para una canción original.

Contexto e Instrucciones:
- Audiencia: Estudiantes de ${this.#pretify(selectedSection?.level || 'Nivel no especificado')}, ${this.#pretify(selectedSection?.year || 'Grado no especificado')}. La letra debe ser apropiada para su edad, intereses y nivel de comprensión.
- Complejidad de la Canción: La canción debe ser ${this.#getComplexityInstruction(formValue.complexity!)}.
- Temática Central (Requerida): La canción debe tratar sobre "${formValue.topic}". Desarrolla ideas y mensajes relacionados con este tema.
- Estructura: Organiza la letra claramente en estrofas y un coro (estribillo). Puedes incluir un puente si lo consideras apropiado para la complejidad "Elaborada". Marca claramente cada sección, por ejemplo: [Estrofa 1], [Coro], [Estrofa 2], [Puente], [Coro Final].
- Lenguaje y Tono: Usa un lenguaje positivo y adecuado a la edad. El tono debe ser coherente con la temática (alegre, emotivo, reflexivo, etc.).
- Ritmo y Rima: Intenta que la letra tenga buen ritmo y rimas que funcionen bien musicalmente (sin ser excesivamente forzadas).

IMPORTANTE: Genera la letra de la canción, siguiendo la estructura solicitada sugiriendo una tonalidad y acordes de acompañamiento. No incluyas saludos ni despedidas. Escribe un documento listo para imprimir.`;

		try {
			const result = await firstValueFrom(
				this.#aiService.geminiAi(prompt),
			);
			this.generatedSong.set(
				result?.response ||
					'No se pudo generar la letra de la canción.',
			);
			this.showResult.set(true);
		} catch (error) {
			this.generatedSong.set(
				'Ocurrió un error al generar la canción. Por favor, inténtalo de nuevo.',
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
		this.generatedSong.set('');
		// Reset form to defaults
		this.songForm.reset({
			section: '',
			complexity: 'Media / Estructurada',
			topic: '',
		});
	}

	/** Downloads the generated song lyrics as DOCX */
	downloadDocx(): void {
		const songText = this.generatedSong();
		if (!songText || songText.startsWith('Ocurrió un error')) return;

		const formValue = this.songForm.getRawValue();
		const section = this.sections().find(
			(s) => s._id === formValue.section,
		);

		// Sanitize filename parts
		const sectionName = (section?.name || 'Seccion').replace(
			/[^a-z0-9]/gi,
			'_',
		);
		const topicName = (formValue.topic || 'Cancion')
			.substring(0, 20)
			.replace(/[^a-z0-9]/gi, '_');
		const complexityName = (formValue.complexity || 'Media')
			.substring(0, 10)
			.replace(/[^a-z0-9]/gi, '_');

		const filename = `Cancion_${sectionName}_${complexityName}_${topicName}.docx`;

		// Create paragraphs, trying to format structure markers (like [Coro])
		const paragraphs = songText.split('\n').map((line) => {
			const trimmedLine = line.trim();
			// Check for structure markers like [Coro], [Estrofa 1], etc.
			if (trimmedLine.match(/^\[.*\]$/)) {
				return new Paragraph({
					children: [new TextRun({ text: trimmedLine, bold: true })],
					spacing: { before: 200, after: 100 }, // Add space before/after markers
				});
			} else if (trimmedLine.length > 0) {
				return new Paragraph({
					children: [new TextRun(trimmedLine)],
					spacing: { after: 60 }, // Less spacing between lines within a stanza
				});
			} else {
				// Preserve empty lines between stanzas/sections if AI uses them
				return new Paragraph({ text: '', spacing: { after: 120 } });
			}
		});

		// Create the document
		const doc = new Document({
			sections: [
				{
					properties: {},
					children: [
						new Paragraph({
							text: `Letra de Canción Generada`,
							heading: HeadingLevel.HEADING_1,
							alignment: AlignmentType.CENTER,
							spacing: { after: 300 },
						}),
						new Paragraph({
							text: `Temática: ${formValue.topic}`,
							alignment: AlignmentType.CENTER,
							style: 'SubtleEmphasis',
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
						new Paragraph({ text: '', spacing: { after: 400 } }), // Extra space
						...paragraphs, // Add the generated song paragraphs
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
		return this.songForm.get('section');
	}
	get complexityCtrl(): AbstractControl | null {
		return this.songForm.get('complexity');
	}
	get topicCtrl(): AbstractControl | null {
		return this.songForm.get('topic');
	}
}
