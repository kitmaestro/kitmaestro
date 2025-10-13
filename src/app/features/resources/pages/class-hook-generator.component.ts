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

// --- Services ---
import { AiService } from '../../../core/services/ai.service';
import { ClassSectionService } from '../../../core/services/class-section.service'; // Service for sections

// --- Interfaces ---
import { ClassSection } from '../../../core/interfaces/class-section';

// --- DOCX Generation ---
import { Document, Packer, Paragraph, TextRun, AlignmentType } from 'docx'; // Import HeadingLevel
import { saveAs } from 'file-saver';
import { MarkdownComponent } from 'ngx-markdown';
import { PretifyPipe } from '../../../shared/pipes/pretify.pipe';

@Component({
	selector: 'app-hook-generator', // Component selector
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
		<mat-card class="hook-generator-card">
			<mat-card-header>
				<mat-card-title
					>Generador de Ganchos para Clases</mat-card-title
				>
				<mat-card-subtitle
					>Crea ideas atractivas para iniciar tus
					lecciones</mat-card-subtitle
				>
			</mat-card-header>

			<mat-card-content>
				@if (!showResult()) {
					<form
						[formGroup]="hookForm"
						(ngSubmit)="onSubmit()"
						class="hook-form"
					>
						<div class="form-row">
							<mat-form-field
								appearance="outline"
								class="form-field"
							>
								<mat-label>Curso/Sección</mat-label>
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
												section.name +
													' (' +
													(section.level | pretify) +
													')'
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
									>Tema de la clase (Opcional)</mat-label
								>
								<input
									matInput
									formControlName="topic"
									placeholder="Ej: El ciclo del agua, La Revolución Francesa"
								/>
							</mat-form-field>
						</div>

						<div class="form-actions">
							<button
								mat-raised-button
								color="primary"
								type="submit"
								[disabled]="hookForm.invalid || isGenerating()"
							>
								@if (isGenerating()) {
									<mat-spinner
										diameter="20"
										color="accent"
										class="inline-spinner"
									></mat-spinner>
									Generando...
								} @else {
									<ng-container>
										<mat-icon>flare</mat-icon> Generar
										Ganchos
									</ng-container>
								}
							</button>
						</div>
					</form>
				}

				@if (showResult()) {
					<div class="hook-result">
						<h3>Ganchos Sugeridos:</h3>
						<div class="hook-result-content">
							<markdown [data]="generatedHooks()" />
						</div>

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
									!generatedHooks() ||
									generatedHooks().startsWith(
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
				display: block; /* No host padding/margin */
			}
			.hook-generator-card {
				/* No max-width */
				margin: 0 auto;
				padding: 15px 25px 25px 25px;
			}
			.hook-form {
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
			.hook-result {
				margin-top: 20px;
			}
			.hook-result h3 {
				margin-bottom: 15px;
			}
			.hook-result-content {
				background-color: #f8f9fa; /* Light background */
				border: 1px solid #dee2e6;
				border-left: 5px solid #0d6efd; /* Accent border */
				padding: 20px 30px;
				min-height: 150px;
				box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
				line-height: 1.7;
				font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
				font-size: 11pt;
				margin-bottom: 20px;
				max-width: 100%;
				white-space: pre-wrap; /* Preserve formatting from AI */
			}
			/* Style potential list items if AI uses them */
			.hook-result-content ul,
			.hook-result-content ol {
				padding-left: 25px;
				margin-top: 10px;
				margin-bottom: 10px;
			}
			.hook-result-content li {
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
export class ClassHookGeneratorComponent implements OnInit, OnDestroy {
	// --- Dependencies ---
	#fb = inject(FormBuilder);
	#aiService = inject(AiService);
	#sectionService = inject(ClassSectionService);
	#snackBar = inject(MatSnackBar);

	// --- State Signals ---
	isLoadingSections = signal(false);
	isGenerating = signal(false);
	showResult = signal(false);
	generatedHooks = signal<string>(''); // Will store the AI response string
	sections = signal<ClassSection[]>([]);
	availableSubjects = signal<string[]>([]);

	// --- Form Definition ---
	hookForm = this.#fb.group({
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
		return `${section.year || ''} ${section.name || ''} (${section.level || 'Nivel no especificado'})`;
	}

	/** Handles form submission to generate hooks */
	async onSubmit(): Promise<void> {
		if (this.hookForm.invalid) {
			this.hookForm.markAllAsTouched();
			return;
		}

		this.isGenerating.set(true);
		this.generatedHooks.set('');
		this.showResult.set(false);

		const formValue = this.hookForm.getRawValue();
		const selectedSection = this.sections().find(
			(s) => s._id === formValue.section,
		);

		// Construct the prompt for generating hooks
		const prompt = `Eres un experto en pedagogía creativa y estrategias de captación de atención en el aula.
      Necesito generar ideas de "ganchos" (hooks) interesantes y variados para iniciar una clase y motivar a los estudiantes.

      Contexto de la Clase:
      - Nivel Educativo: ${selectedSection?.level || 'No especificado'}
      - Año/Grado: ${selectedSection?.year || 'No especificado'}
      - Asignatura: ${formValue.subject}
      ${formValue.topic ? `- Tema Específico de la Clase (opcional): ${formValue.topic}` : ''}

      Instrucciones para Generar Ganchos:
      1.  **Cantidad y Variedad:** Genera entre 3 y 5 ideas de ganchos diferentes. Incluye distintos tipos, por ejemplo:
          * Una pregunta intrigante o provocadora.
          * Un dato curioso o sorprendente relacionado.
          * Una mini-actividad rápida (ej: observación corta, predicción simple).
          * Una conexión inesperada con la vida cotidiana de los estudiantes.
          * Una afirmación controversial (para debatir brevemente).
      2.  **Objetivo:** Cada gancho debe despertar la curiosidad, conectar con conocimientos previos (si aplica) y motivar a los estudiantes a prestar atención a la lección que sigue.
      3.  **Relevancia:** Los ganchos deben ser relevantes para la asignatura y el tema (si se proporcionó), y apropiados para la edad/nivel del curso.
      4.  **Claridad y Brevedad:** Deben ser fáciles de entender y rápidos de implementar (1-3 minutos máximo).
      5.  **Formato:** Presenta las ideas claramente, quizás como una lista numerada o con viñetas.

      IMPORTANTE: Solo devuelve las ideas de los ganchos, sin saludos, despedidas o explicaciones adicionales sobre cómo usarlos (el profesor sabrá).`;

		try {
			const result = await firstValueFrom(
				this.#aiService.geminiAi(prompt),
			);
			// Store the raw response, assuming AI formats it reasonably (like a list)
			this.generatedHooks.set(
				result?.response || 'No se pudieron generar los ganchos.',
			);
			this.showResult.set(true);
		} catch (error) {
			this.generatedHooks.set(
				'Ocurrió un error al generar los ganchos. Por favor, inténtalo de nuevo.',
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
		this.generatedHooks.set('');
		this.hookForm.reset();
		this.subjectCtrl?.disable();
		this.availableSubjects.set([]);
	}

	/** Downloads the generated hooks as DOCX */
	downloadDocx(): void {
		const hooksText = this.generatedHooks();
		if (!hooksText || hooksText.startsWith('Ocurrió un error')) return;

		const formValue = this.hookForm.getRawValue();
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

		const filename = `Ganchos_${sectionName}_${subjectName}_${topicName}.docx`;

		// Create paragraphs, splitting by newline characters
		const paragraphs = hooksText.split('\n').map((line) => {
			// Basic heuristic to make potential list items bold or add bullets
			const trimmedLine = line.trim();
			if (trimmedLine.match(/^(\d+\.|-|\*)\s+/)) {
				// Looks like a list item
				return new Paragraph({
					children: [new TextRun(trimmedLine)],
					bullet: { level: 0 }, // Add bullet point
					spacing: { after: 150 },
				});
			} else if (
				trimmedLine.length > 0 &&
				trimmedLine.length < 80 &&
				!trimmedLine.includes(':')
			) {
				// Potentially a sub-heading/hook title
				return new Paragraph({
					children: [new TextRun({ text: trimmedLine, bold: true })],
					spacing: { after: 180 },
				});
			}
			return new Paragraph({
				// Regular text
				children: [new TextRun(line)],
				spacing: { after: 150 },
			});
		});

		// Create the document
		const doc = new Document({
			sections: [
				{
					properties: {},
					children: [
						new Paragraph({
							children: [
								new TextRun({
									text: `Ganchos para la Clase`,
									bold: true,
									size: 28,
									color: '336699',
								}),
							],
							alignment: AlignmentType.CENTER,
							spacing: { after: 300 },
						}), // Title
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
								]),
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
		return this.hookForm.get('section');
	}
	get subjectCtrl(): AbstractControl | null {
		return this.hookForm.get('subject');
	}
}
