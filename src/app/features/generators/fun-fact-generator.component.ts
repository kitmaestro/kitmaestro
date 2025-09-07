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
} from 'docx'; // Import Bullet
import { saveAs } from 'file-saver';

@Component({
	selector: 'app-fun-fact-generator', // Component selector
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
		PretifyPipe,
	],
	// --- Inline Template ---
	template: `
		<mat-card class="fun-fact-generator-card">
			<mat-card-header>
				<mat-card-title
					>Generador de Curiosidades (Fun Facts)</mat-card-title
				>
				<mat-card-subtitle
					>Despierta el interés con datos
					sorprendentes</mat-card-subtitle
				>
			</mat-card-header>

			<mat-card-content>
				@if (!showResult()) {
					<form
						[formGroup]="funFactForm"
						(ngSubmit)="onSubmit()"
						class="fun-fact-form"
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
										<mat-option
											[value]="subject | pretify"
											>{{ subject | pretify }}</mat-option
										>
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
									>Tema Específico (Opcional)</mat-label
								>
								<input
									matInput
									formControlName="topic"
									placeholder="Ej: Los planetas, El cuerpo humano, Figuras geométricas"
								/>
							</mat-form-field>
						</div>

						<div class="form-actions">
							<button
								mat-raised-button
								color="primary"
								type="submit"
								[disabled]="
									funFactForm.invalid || isGenerating()
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
										<mat-icon>lightbulb_outline</mat-icon>
										Generar Curiosidades
									</ng-container>
								}
							</button>
						</div>
					</form>
				}

				@if (showResult()) {
					<div class="fun-fact-result">
						<h3>Curiosidad(es) Generada(s):</h3>
						<div
							class="fun-fact-result-content"
							[innerHTML]="
								generatedFunFacts().replaceAll(
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
									!generatedFunFacts() ||
									generatedFunFacts().startsWith(
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
			.fun-fact-generator-card {
				margin: 0 auto;
				padding: 15px 25px 25px 25px;
			}
			.fun-fact-form {
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
			.fun-fact-result {
				margin-top: 20px;
			}
			.fun-fact-result h3 {
				margin-bottom: 15px;
			}
			.fun-fact-result-content {
				background-color: #e3f2fd; /* Light blue background */
				border: 1px solid #bbdefb;
				border-left: 5px solid #2196f3; /* Blue accent */
				padding: 25px 35px;
				min-height: 150px;
				box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
				line-height: 1.7;
				font-family:
					'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; /* Clean sans-serif */
				font-size: 11pt;
				margin-bottom: 20px;
				max-width: 100%;
				white-space: pre-wrap; /* Preserve formatting */
			}
			/* Style potential list items if AI uses them */
			.fun-fact-result-content ul,
			.fun-fact-result-content ol {
				padding-left: 25px;
				margin-top: 10px;
				margin-bottom: 10px;
			}
			.fun-fact-result-content li {
				margin-bottom: 8px;
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
export class FunFactGeneratorComponent implements OnInit, OnDestroy {
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
	generatedFunFacts = signal<string>(''); // Stores the AI response string
	sections = signal<ClassSection[]>([]);
	availableSubjects = signal<string[]>([]);

	// --- Form Definition ---
	funFactForm = this.#fb.group({
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
					// Reset dependent fields
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
		return EMPTY;
	}

	// --- Public Methods ---

	/** Formats section display name */
	getSectionDisplay(section: ClassSection): string {
		return `${this.#pretify(section.year || '')} ${section.name || ''} (${this.#pretify(section.level || 'Nivel no especificado')})`;
	}

	/** Handles form submission */
	async onSubmit(): Promise<void> {
		if (this.funFactForm.invalid) {
			this.funFactForm.markAllAsTouched();
			this.#snackBar.open(
				'Por favor, completa todos los campos requeridos.',
				'Cerrar',
				{ duration: 3000 },
			);
			return;
		}

		this.isGenerating.set(true);
		this.generatedFunFacts.set('');
		this.showResult.set(false);

		const formValue = this.funFactForm.getRawValue();
		const selectedSection = this.sections().find(
			(s) => s._id === formValue.section,
		);

		// Construct the prompt for generating fun facts
		const prompt = `Eres un experto encontrando datos curiosos (fun facts) fascinantes y educativos para niños y jóvenes.
      Necesito generar algunas curiosidades para usar en una clase, ya sea como gancho inicial o para re-captar la atención.

      Contexto e Instrucciones:
      - Audiencia: Estudiantes de ${this.#pretify(selectedSection?.level || 'Nivel no especificado')}, ${this.#pretify(selectedSection?.year || 'Grado no especificado')}. Las curiosidades deben ser apropiadas para su edad, sorprendentes pero fáciles de entender.
      - Asignatura: ${this.#pretify(formValue.subject || '')}. Las curiosidades deben estar relacionadas con esta materia.
      ${formValue.topic ? `- Tema Específico (Opcional): Si es posible, relaciona las curiosidades directamente con el tema "${formValue.topic}".` : ''}
      - Objetivo: Generar interés, despertar la curiosidad sobre la asignatura o el tema, y ser memorables.
      - Cantidad: Genera 2 o 3 datos curiosos distintos.
      - Formato: Presenta cada dato de forma concisa y clara. Puedes usar viñetas o una lista numerada. Evita explicaciones largas, enfócate en el dato sorprendente.
      - Tono: Entusiasta, como si estuvieras compartiendo un secreto interesante.

      IMPORTANTE: Verifica la veracidad de los datos (haz tu mejor esfuerzo por generar datos reales y contrastables). No incluyas saludos ni despedidas.`;

		try {
			const result = await firstValueFrom(
				this.#aiService.geminiAi(prompt),
			);
			this.generatedFunFacts.set(
				result?.response || 'No se pudieron generar las curiosidades.',
			);
			this.showResult.set(true);
		} catch (error) {
			this.generatedFunFacts.set(
				'Ocurrió un error al generar las curiosidades. Por favor, inténtalo de nuevo.',
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
		this.generatedFunFacts.set('');
		// Reset form
		this.funFactForm.reset({
			section: '',
			subject: '', //{ value: '', disabled: true }, // Reset subject to disabled state
			topic: '',
		});
		this.funFactForm.get('subject')?.disable();
		this.availableSubjects.set([]); // Clear available subjects
	}

	/** Downloads the generated fun facts as DOCX */
	downloadDocx(): void {
		const funFactsText = this.generatedFunFacts();
		if (!funFactsText || funFactsText.startsWith('Ocurrió un error'))
			return;

		const formValue = this.funFactForm.getRawValue();
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
		const topicName = (formValue.topic || 'Curiosidades')
			.substring(0, 15)
			.replace(/[^a-z0-9]/gi, '_');

		const filename = `Curiosidades_${sectionName}_${subjectName}_${topicName}.docx`;

		// Create paragraphs, attempting to use bullets for list items
		const paragraphs = funFactsText
			.split('\n')
			.filter((line) => line.trim().length > 0)
			.map((line) => {
				const trimmedLine = line.trim();
				// Basic check if line starts like a list item
				if (trimmedLine.match(/^(\*|-|\d+\.)\s+/)) {
					return new Paragraph({
						text: trimmedLine.replace(/^(\*|-|\d+\.)\s+/, ''), // Remove bullet marker
						bullet: { level: 0 },
						spacing: { after: 120 },
					});
				} else {
					return new Paragraph({
						text: trimmedLine,
						spacing: { after: 120 },
					});
				}
			});

		// Create the document
		const doc = new Document({
			sections: [
				{
					properties: {},
					children: [
						new Paragraph({
							text: `Curiosidades Generadas`,
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
						...paragraphs, // Add the generated fun fact paragraphs
					],
				},
			],
			styles: {
				// Reusing styles
				paragraphStyles: [
					{
						id: 'Normal',
						name: 'Normal',
						run: { font: 'Segoe UI', size: 22 }, // 11pt
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
		return this.funFactForm.get('section');
	}
	get subjectCtrl(): AbstractControl | null {
		return this.funFactForm.get('subject');
	}
	get topicCtrl(): AbstractControl | null {
		return this.funFactForm.get('topic');
	}
}
