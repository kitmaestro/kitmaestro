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

// --- Services ---
// Using the paths provided by the user
import { AiService } from '../../../core/services/ai.service'; // Assuming standard AI service path
import { ClassSectionService } from '../../../core/services/class-section.service';

// --- Interfaces ---
import { ClassSection } from '../../../core';

// --- DOCX Generation ---
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';
import { PretifyPipe } from '../../../shared/pipes/pretify.pipe';

@Component({
	selector: 'app-tongue-twister-generator', // Component selector
	standalone: true,
	imports: [
		PretifyPipe,
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
		<mat-card class="tongue-twister-card">
			<mat-card-header>
				<mat-card-title>Generador de Trabalenguas</mat-card-title>
				<mat-card-subtitle
					>Crea trabalenguas divertidos para tus
					clases</mat-card-subtitle
				>
			</mat-card-header>

			<mat-card-content>
				@if (!showResult()) {
					<form
						[formGroup]="tongueTwisterForm"
						(ngSubmit)="onSubmit()"
						class="tongue-twister-form"
					>
						<div class="form-row">
							<mat-form-field
								appearance="outline"
								class="form-field"
							>
								<mat-label>Curso/Sección</mat-label>
								<mat-select formControlName="section" required>
									@if (isLoadingSections()) {
										<mat-option disabled>
											<mat-spinner
												diameter="20"
												style="display: inline-block; margin-right: 8px;"
											></mat-spinner>
											Cargando...
										</mat-option>
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
								class="form-field full-width-field"
							>
								<mat-label
									>Tema para el trabalenguas
									(Opcional)</mat-label
								>
								<input
									matInput
									formControlName="topic"
									placeholder="Ej: animales, frutas, números"
								/>
							</mat-form-field>
						</div>

						<div class="form-actions">
							<button
								mat-raised-button
								color="primary"
								type="submit"
								[disabled]="
									tongueTwisterForm.invalid || isGenerating()
								"
							>
								@if (isGenerating()) {
									<mat-spinner
										diameter="20"
										color="accent"
										style="display: inline-block; margin-right: 8px;"
									></mat-spinner>
									Generando...
								} @else {
									<ng-container>
										<mat-icon>record_voice_over</mat-icon>
										Generar Trabalenguas
									</ng-container>
								}
							</button>
						</div>
					</form>
				}

				@if (showResult()) {
					<div class="tongue-twister-result">
						<h3>Trabalenguas Generado:</h3>
						<div
							class="tongue-twister-result-page"
							[innerHTML]="
								generatedTongueTwister().replaceAll(
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
									!generatedTongueTwister() ||
									generatedTongueTwister().startsWith(
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
				/* No host padding/margin */
			}

			.tongue-twister-card {
				/* No max-width */
				margin: 0 auto; /* Center if container allows */
				padding: 15px 25px 25px 25px;
			}

			.tongue-twister-form {
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

			/* Allow topic field to take full width if needed */
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

			.tongue-twister-result {
				margin-top: 20px;
			}

			.tongue-twister-result h3 {
				margin-bottom: 15px;
			}

			.tongue-twister-result-page {
				background-color: #f9f9f9; /* Slightly different background */
				border: 1px solid #e0e0e0;
				padding: 30px 40px;
				min-height: 150px; /* Can be shorter for tongue twisters */
				box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
				line-height: 1.7; /* Slightly more spacing */
				font-family:
					'Comic Sans MS', cursive, sans-serif; /* More playful font */
				font-size: 12pt; /* Slightly larger font */
				margin-bottom: 20px;
				max-width: 100%;
				white-space: pre-wrap; /* Preserve whitespace and line breaks from AI */
			}

			.result-actions {
				display: flex;
				justify-content: space-between;
				margin-top: 20px;
				flex-wrap: wrap;
				gap: 10px;
			}

			button mat-spinner {
				display: inline-block;
				margin-right: 8px;
				vertical-align: middle;
			}
		`,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
})
export class TongueTwisterGeneratorComponent implements OnInit, OnDestroy {
	// --- Dependencies ---
	#fb = inject(FormBuilder);
	#aiService = inject(AiService);
	#sectionService = inject(ClassSectionService); // Use ClassSectionService
	#snackBar = inject(MatSnackBar);
	#pretify = new PretifyPipe();

	// --- State Signals ---
	isLoadingSections = signal(false);
	isGenerating = signal(false);
	showResult = signal(false);
	generatedTongueTwister = signal<string>('');
	sections = signal<ClassSection[]>([]);
	availableSubjects = signal<string[]>([]);

	// --- Form Definition ---
	tongueTwisterForm = this.#fb.group({
		section: ['', Validators.required],
		subject: [{ value: '', disabled: true }, Validators.required],
		topic: [''], // Optional topic
	});

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
				// Assuming getSections exists
				takeUntil(this.#destroy$),
				tap((sections) => this.sections.set(sections || [])),
				catchError((error) => {
					console.error('Error loading sections:', error);
					this.#snackBar.open(
						'Error al cargar las secciones.',
						'Cerrar',
						{ duration: 5000 },
					);
					return EMPTY;
				}),
				finalize(() => this.isLoadingSections.set(false)),
			)
			.subscribe();
	}

	/** Updates subjects based on selected section */
	#listenForSectionChanges(): void {
		this.sectionCtrl?.valueChanges
			.pipe(
				takeUntil(this.#destroy$),
				tap((sectionId) => {
					this.subjectCtrl?.reset();
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
						} else {
							this.availableSubjects.set([]);
							this.subjectCtrl?.disable();
						}
					} else {
						this.subjectCtrl?.disable();
					}
				}),
			)
			.subscribe();
	}

	// --- Public Methods ---

	/** Formats section display name */
	getSectionDisplay(section: ClassSection): string {
		return `${section.name} (${this.#pretify.transform(section.level)})`;
	}

	/** Handles form submission */
	async onSubmit(): Promise<void> {
		if (this.tongueTwisterForm.invalid) {
			this.tongueTwisterForm.markAllAsTouched();
			return;
		}

		this.isGenerating.set(true);
		this.generatedTongueTwister.set('');
		this.showResult.set(false);

		const formValue = this.tongueTwisterForm.getRawValue();
		const selectedSection = this.sections().find(
			(s) => s._id === formValue.section,
		);

		// Construct the prompt for a tongue twister
		const prompt = `Eres un generador experto de trabalenguas divertidos y educativos.
      Necesito un trabalenguas original para una clase.
      Contexto:
      - Nivel Educativo: ${this.#pretify.transform(selectedSection?.level || '') || 'No especificado'}
      - Año/Grado: ${this.#pretify.transform(selectedSection?.year || '') || 'No especificado'}
      - Asignatura: ${this.#pretify.transform(formValue.subject || '')}
      ${formValue.topic ? `- Tema Específico (opcional): ${formValue.topic}` : ''}

      Instrucciones:
      - Crea un trabalenguas corto o de longitud media.
      - Debe ser divertido, pegadizo y un poco desafiante de pronunciar.
      - Asegúrate de que sea apropiado para la edad/nivel educativo indicado.
      - Si se proporcionó un tema, intenta incorporarlo sutilmente en el trabalenguas.
      - Solo devuelve el texto del trabalenguas, sin explicaciones, títulos, saludos ni despedidas.`;

		try {
			const result = await firstValueFrom(
				this.#aiService.geminiAi(prompt),
			);
			// Use pre-wrap in CSS to handle newlines, so just set the raw response
			this.generatedTongueTwister.set(
				result?.response || 'No se pudo generar el trabalenguas.',
			);
			this.showResult.set(true);
		} catch (error) {
			console.error('Error generating tongue twister:', error);
			this.generatedTongueTwister.set(
				'Ocurrió un error al generar el trabalenguas. Por favor, inténtalo de nuevo.',
			);
			this.showResult.set(true);
			this.#snackBar.open(
				'Error al contactar el servicio de IA',
				'Cerrar',
				{ duration: 5000 },
			);
		} finally {
			this.isGenerating.set(false);
		}
	}

	/** Resets the form and view */
	goBack(): void {
		this.showResult.set(false);
		this.generatedTongueTwister.set('');
		this.tongueTwisterForm.reset();
		this.subjectCtrl?.disable();
		this.availableSubjects.set([]);
	}

	/** Downloads the generated tongue twister as DOCX */
	downloadDocx(): void {
		const tongueTwisterText = this.generatedTongueTwister();
		if (
			!tongueTwisterText ||
			tongueTwisterText.startsWith('Ocurrió un error')
		)
			return;

		const formValue = this.tongueTwisterForm.getRawValue();
		const section = this.sections().find(
			(s) => s._id === formValue.section,
		);

		// Sanitize filename parts
		const sectionName = (section?.name || 'Seccion').replace(
			/[^a-z0-9]/gi,
			'_',
		);
		const subjectName = (formValue.subject || 'Asignatura').replace(
			/[^a-z0-9]/gi,
			'_',
		);
		const topicName = (formValue.topic || 'General')
			.substring(0, 15)
			.replace(/[^a-z0-9]/gi, '_');

		const filename = `Trabalenguas_${sectionName}_${subjectName}_${topicName}.docx`;

		// Create paragraphs
		// Use the raw text as the AI might format it with its own line breaks
		const paragraphs = tongueTwisterText.split('\n').map(
			(line) =>
				new Paragraph({
					children: [new TextRun(line)],
					spacing: { after: 150 }, // Less spacing for tongue twisters
				}),
		);

		// Create the document
		const doc = new Document({
			sections: [
				{
					properties: {},
					children: [
						new Paragraph({
							children: [
								new TextRun({
									text: `Trabalenguas Generado`,
									bold: true,
									size: 28,
								}),
							],
							spacing: { after: 300 },
						}),
						new Paragraph({
							children: [
								new TextRun({
									text: `Sección: ${this.getSectionDisplay(section!)}`,
									size: 24,
								}),
							],
							spacing: { after: 100 },
						}),
						new Paragraph({
							children: [
								new TextRun({
									text: `Asignatura: ${formValue.subject}`,
									size: 24,
								}),
							],
							spacing: { after: 100 },
						}),
						...(formValue.topic
							? [
									new Paragraph({
										children: [
											new TextRun({
												text: `Tema: ${formValue.topic}`,
												size: 24,
											}),
										],
										spacing: { after: 400 },
									}),
								]
							: [
									new Paragraph({
										text: '',
										spacing: { after: 400 },
									}),
								]), // Add topic if present or just spacing
						...paragraphs, // Add the generated content paragraphs
					],
				},
			],
		});

		// Generate blob and trigger download
		Packer.toBlob(doc)
			.then((blob) => {
				saveAs(blob, filename);
			})
			.catch((error) => {
				console.error('Error creating DOCX file:', error);
				this.#snackBar.open(
					'Error al generar el archivo DOCX',
					'Cerrar',
					{ duration: 3000 },
				);
			});
	}

	// --- Getters for easier access to form controls ---
	get sectionCtrl(): AbstractControl | null {
		return this.tongueTwisterForm.get('section');
	}
	get subjectCtrl(): AbstractControl | null {
		return this.tongueTwisterForm.get('subject');
	}
}
