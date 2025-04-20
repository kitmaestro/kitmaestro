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
} from '@angular/forms'; // Use Reactive Forms
import {
	Subject,
	firstValueFrom,
	takeUntil,
	tap,
	catchError,
	EMPTY,
	finalize,
} from 'rxjs'; // RxJS imports

// Angular Material Modules
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon'; // Import MatIconModule

// --- Services ---
// Adjust paths if necessary
import { AiService } from '../services/ai.service';
import { ClassSectionService } from '../services/class-section.service';
import { ClassSection } from '../interfaces/class-section'; // Assuming interfaces are exported here

// --- DOCX Generation ---
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';
import { PretifyPipe } from '../pipes/pretify.pipe';
import { MarkdownComponent } from 'ngx-markdown';

@Component({
	selector: 'app-icebreaker-generator',
	standalone: true,
	imports: [
		// CommonModule, // For @if, @for, async pipe
		ReactiveFormsModule, // Use Reactive Forms
		MatCardModule,
		MatFormFieldModule,
		MatSelectModule,
		MatInputModule,
		MatButtonModule,
		MatProgressSpinnerModule,
		MatSnackBarModule,
		MatIconModule, // Import MatIconModule
		PretifyPipe,
		MarkdownComponent,
	],
	// --- Inline Template ---
	template: `
		<mat-card class="icebreaker-card">
			<mat-card-header>
				<mat-card-title>Generador de Rompehielos</mat-card-title>
				<mat-card-subtitle
					>Crea actividades dinámicas para iniciar tus
					clases</mat-card-subtitle
				>
			</mat-card-header>

			<mat-card-content>
				@if (!showResult()) {
					<form
						[formGroup]="icebreakerForm"
						(ngSubmit)="onSubmit()"
						class="icebreaker-form"
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
								class="form-field"
							>
								<mat-label>Tipo de Actividad</mat-label>
								<mat-select
									formControlName="activityType"
									required
								>
									@for (type of activityTypes; track type) {
										<mat-option [value]="type">{{
											type
										}}</mat-option>
									}
								</mat-select>
								@if (
									activityTypeCtrl?.invalid &&
									activityTypeCtrl?.touched
								) {
									<mat-error
										>Selecciona un tipo de
										actividad.</mat-error
									>
								}
							</mat-form-field>

							<mat-form-field
								appearance="outline"
								class="form-field"
							>
								<mat-label>Tema del día (Opcional)</mat-label>
								<input matInput formControlName="topic" />
							</mat-form-field>
						</div>

						<div class="form-actions">
							<button
								mat-raised-button
								color="primary"
								type="submit"
								[disabled]="
									icebreakerForm.invalid || isGenerating()
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
										<mat-icon>auto_awesome</mat-icon>
										Generar Rompehielos
									</ng-container>
								}
							</button>
						</div>
					</form>
				}

				@if (showResult()) {
					<div class="icebreaker-result">
						<h3>Actividad Rompehielos Generada:</h3>
						<div class="icebreaker-result-page">
							@if (generatedIcebreaker()) {
								<markdown
									[data]="generatedIcebreaker()"
								></markdown>
							}
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
									!generatedIcebreaker() ||
									generatedIcebreaker().startsWith(
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
				/* No host padding/margin as requested */
			}

			.icebreaker-card {
				margin: 0 auto; /* Center the card if container allows */
				padding: 15px 25px 25px 25px;
			}

			.icebreaker-form {
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
				min-width: 250px; /* Adjust min-width */
			}

			.form-actions {
				display: flex;
				justify-content: flex-end;
				margin-top: 20px;
			}

			.form-actions button mat-icon,
			.result-actions button mat-icon {
				margin-right: 5px;
				vertical-align: middle; /* Align icon nicely */
			}

			.icebreaker-result {
				margin-top: 20px;
			}

			.icebreaker-result h3 {
				margin-bottom: 15px;
				/* Consider using theme color if theme is properly set up */
				/* color: mat.get-theme-color(...); */
			}

			.icebreaker-result-page {
				background-color: #fff;
				border: 1px solid #e0e0e0;
				padding: 30px 40px; /* Slightly less padding than previous */
				min-height: 250px;
				box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
				line-height: 1.6;
				font-family:
					'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; /* More modern font */
				font-size: 11pt;
				margin-bottom: 20px;
				max-width: 100%;
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
	encapsulation: ViewEncapsulation.None, // Optional: Use None if global styles should apply easily, or Emulated (default)
})
export class IcebreakerGeneratorComponent implements OnInit, OnDestroy {
	// --- Dependencies ---
	#fb = inject(FormBuilder);
	#aiService = inject(AiService);
	#sectionService = inject(ClassSectionService);
	#snackBar = inject(MatSnackBar);
	#pretify = new PretifyPipe();

	// --- State Signals ---
	isLoadingSections = signal(false);
	isGenerating = signal(false);
	showResult = signal(false);
	generatedIcebreaker = signal<string>('');
	sections = signal<ClassSection[]>([]);
	availableSubjects = signal<string[]>([]);

	// --- Form Definition ---
	icebreakerForm = this.#fb.group({
		section: ['', Validators.required],
		subject: [{ value: '', disabled: true }, Validators.required], // Start disabled
		activityType: ['', Validators.required],
		topic: [''], // Optional
	});

	// --- Fixed Data ---
	readonly activityTypes = [
		'Presentación personal',
		'Juego grupal',
		'Actividad lúdica para animación',
		'Dinámica de integración',
		'Preguntas creativas',
		'Actividad de movimiento corto',
	];

	// --- Lifecycle Management ---
	#destroy$ = new Subject<void>();

	// --- OnInit: Load initial data and set up listeners ---
	ngOnInit(): void {
		this.#loadSections();
		this.#listenForSectionChanges();
	}

	// --- OnDestroy: Clean up subscriptions ---
	ngOnDestroy(): void {
		this.#destroy$.next();
		this.#destroy$.complete();
	}

	// --- Private Methods ---

	/** Loads sections from the service */
	#loadSections(): void {
		this.isLoadingSections.set(true);
		this.#sectionService
			.findSections()
			.pipe(
				takeUntil(this.#destroy$),
				tap((sections) => this.sections.set(sections || [])), // Store sections
				catchError((error) => {
					console.error('Error loading sections:', error);
					this.#snackBar.open(
						'Error al cargar las secciones.',
						'Cerrar',
						{ duration: 5000 },
					);
					return EMPTY; // Prevent observable chain from completing on error
				}),
				finalize(() => this.isLoadingSections.set(false)), // Stop loading indicator
			)
			.subscribe(); // Subscribe to trigger the observable
	}

	/** Listens for changes in the selected section to update subjects */
	#listenForSectionChanges(): void {
		this.sectionCtrl?.valueChanges
			.pipe(
				takeUntil(this.#destroy$),
				tap((sectionId) => {
					// Reset subject and available subjects when section changes
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
							this.subjectCtrl?.enable(); // Enable subject selector
						} else {
							this.availableSubjects.set([]); // Ensure it's empty if no subjects
							this.subjectCtrl?.disable(); // Keep disabled if no subjects
						}
					} else {
						this.subjectCtrl?.disable(); // Disable if no section is selected
					}
				}),
			)
			.subscribe();
	}

	// --- Public Methods ---

	/** Formats section data for display in the select dropdown */
	getSectionDisplay(section: ClassSection): string {
		return `${section.name} (${this.#pretify.transform(section.level)})`;
	}

	/** Handles form submission to generate the icebreaker */
	async onSubmit(): Promise<void> {
		if (this.icebreakerForm.invalid) {
			this.icebreakerForm.markAllAsTouched(); // Show validation errors
			return;
		}

		this.isGenerating.set(true);
		this.generatedIcebreaker.set('');
		this.showResult.set(false);

		const formValue = this.icebreakerForm.getRawValue(); // Get all values, including disabled ones
		const selectedSection = this.sections().find(
			(s) => s._id === formValue.section,
		);

		// Construct the prompt
		const prompt = `Eres un asistente experto en pedagogía y dinámicas de grupo.
      Necesito una actividad rompehielos creativa y divertida para una clase.
      Contexto:
      - Nivel Educativo: ${selectedSection?.level || 'No especificado'}
      - Año/Grado: ${selectedSection?.year || 'No especificado'}
      - Nombre de la Sección: ${selectedSection?.name || 'No especificada'}
      - Asignatura: ${formValue.subject}
      - Tipo de Actividad Deseada: ${formValue.activityType}
      ${formValue.topic ? `- Tema Opcional del Día: ${formValue.topic}` : ''}

      Instrucciones:
      - Describe la actividad paso a paso de forma clara y concisa.
      - Indica los materiales necesarios (si aplica, prioriza pocos o ninguno).
      - Menciona la duración estimada (corta, 5-10 minutos).
      - Asegúrate de que sea apropiada para el nivel educativo y fomente la participación/interacción.
      - No incluyas saludos ni despedidas, solo la descripción de la actividad.`;

		try {
			const result = await firstValueFrom(
				this.#aiService.geminiAi(prompt),
			);
			this.generatedIcebreaker.set(
				result?.response || 'No se pudo generar la actividad.',
			);
			this.showResult.set(true); // Show the result view
		} catch (error) {
			console.error('Error generating icebreaker:', error);
			this.generatedIcebreaker.set(
				'Ocurrió un error al generar la actividad. Por favor, inténtalo de nuevo.',
			);
			this.showResult.set(true); // Show error in the result area
			this.#snackBar.open(
				'Error al contactar el servicio de IA',
				'Cerrar',
				{ duration: 5000 },
			);
		} finally {
			this.isGenerating.set(false);
		}
	}

	/** Resets the form and goes back to the form view */
	goBack(): void {
		this.showResult.set(false);
		this.generatedIcebreaker.set('');
		this.icebreakerForm.reset();
		// Ensure subject control is disabled after reset
		this.subjectCtrl?.disable();
		this.availableSubjects.set([]);
	}

	/** Downloads the generated icebreaker as a DOCX file */
	downloadDocx(): void {
		const icebreakerText = this.generatedIcebreaker();
		if (!icebreakerText || icebreakerText.startsWith('Ocurrió un error'))
			return;

		const formValue = this.icebreakerForm.getRawValue();
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
		const activityType = (formValue.activityType || 'Tipo')
			.substring(0, 15)
			.replace(/[^a-z0-9]/gi, '_');

		const filename = `Rompehielos_${sectionName}_${subjectName}_${activityType}.docx`;

		// Create paragraphs, splitting by newline characters
		const paragraphs = icebreakerText.split('\n').map(
			(line) =>
				new Paragraph({
					children: [new TextRun(line)],
					spacing: { after: 200 }, // Add some spacing after paragraphs
				}),
		);

		// Create the document
		const doc = new Document({
			sections: [
				{
					properties: {}, // Default page properties (Letter size)
					children: [
						new Paragraph({
							children: [
								new TextRun({
									text: `Rompehielos Generado`,
									bold: true,
									size: 28,
								}),
							],
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
						new Paragraph({
							children: [
								new TextRun({
									text: `Tipo: ${formValue.activityType}`,
									size: 24,
								}),
							],
							spacing: { after: 400 },
						}),
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
		return this.icebreakerForm.get('section');
	}
	get subjectCtrl(): AbstractControl | null {
		return this.icebreakerForm.get('subject');
	}
	get activityTypeCtrl(): AbstractControl | null {
		return this.icebreakerForm.get('activityType');
	}
}
