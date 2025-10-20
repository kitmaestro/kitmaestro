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
	distinctUntilChanged,
	Observable,
} from 'rxjs';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
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
import { loadSections, selectAllClassSections } from '../../../store/class-sections';
import { MarkdownComponent } from 'ngx-markdown';

const NUMBER_TYPE_FRACTIONS = 'Solo Fracciones';

@Component({
	selector: 'app-division-generator',
	standalone: true,
	imports: [
		ReactiveFormsModule,
		MatFormFieldModule,
		MatSelectModule,
		MatButtonModule,
		MatProgressSpinnerModule,
		MatSnackBarModule,
		MatIconModule,
		PretifyPipe,
		MarkdownComponent,
	],
	template: `
		<div class="division-generator-card">
			<div>
				<h2>Generador de Operaciones de División</h2>
			</div>

			<div>
				@if (!showResult()) {
					<form
						[formGroup]="divisionForm"
						(ngSubmit)="onSubmit()"
						class="division-form"
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
											<mat-option [value]="section._id"
												>{{ section.name }} ({{
													section.level | pretify
												}})</mat-option
											>
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
								<mat-label>Nivel de Dificultad</mat-label>
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
								class="form-field"
							>
								<mat-label>Tipos de Números</mat-label>
								<mat-select
									formControlName="numberType"
									required
								>
									@for (type of numberTypes; track type) {
										<mat-option [value]="type">{{
											type
										}}</mat-option>
									}
								</mat-select>
								@if (
									numberTypeCtrl?.invalid &&
									numberTypeCtrl?.touched
								) {
									<mat-error
										>Selecciona el tipo de
										números.</mat-error
									>
								}
							</mat-form-field>

							<mat-form-field
								appearance="outline"
								class="form-field"
							>
								<mat-label>Tipo de Resultado</mat-label>
								<mat-select formControlName="resultType">
									@for (type of resultTypes; track type) {
										<mat-option [value]="type">{{
											type
										}}</mat-option>
									}
								</mat-select>
								@if (
									resultTypeCtrl?.hasError('required') &&
									resultTypeCtrl?.touched
								) {
									<mat-error
										>Selecciona el tipo de
										resultado.</mat-error
									>
								}
								@if (resultTypeCtrl?.disabled) {
									<mat-hint
										>No aplica para fracciones</mat-hint
									>
								}
							</mat-form-field>
						</div>

						<div class="form-actions">
							<button
								mat-raised-button
								color="primary"
								type="submit"
								[disabled]="
									divisionForm.invalid || isGenerating()
								"
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
										<mat-icon>calculate</mat-icon> Generar
										Divisiones
									</ng-container>
								}
							</button>
						</div>
					</form>
				}

				@if (showResult()) {
					<div class="division-result">
						<h3>Operaciones de División Generadas:</h3>
						<markdown
							class="division-result-content"
							[data]="generatedDivisions()"
						/>

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
									!generatedDivisions() ||
									generatedDivisions().startsWith(
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
	styles: [
		`
			:host {
				display: block;
			}
			.division-generator-card {
				margin: 0 auto;
				padding: 15px 25px 25px 25px;
			}
			.division-form {
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
			.division-result {
				margin-top: 20px;
			}
			.division-result h3 {
				margin-bottom: 15px;
			}
			.division-result-content {
				background-color: #f8f9fa;
				border: 1px solid #dee2e6;
				padding: 20px 30px;
				min-height: 200px;
				box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
				line-height: 1.8; /* More spacing for operations */
				font-family:
					'Consolas', 'Courier New', monospace; /* Monospace for alignment */
				font-size: 11pt;
				margin-bottom: 20px;
				max-width: 100%;
				white-space: pre-wrap; /* Preserve formatting */
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
export class DivisionGeneratorComponent implements OnInit, OnDestroy {
	// --- Dependencies ---
	#fb = inject(FormBuilder)
	#aiService = inject(AiService)
	#store = inject(Store)
	#snackBar = inject(MatSnackBar)

	// --- State Signals ---
	isLoadingSections = signal(false)
	isGenerating = signal(false)
	showResult = signal(false)
	generatedDivisions = signal<string>('') // Stores the AI response string
	sections = this.#store.selectSignal(selectAllClassSections)
	// availableSubjects = signal<string[]>([]) // Subject not needed for this component
	#pretify = new PretifyPipe().transform

	// --- Form Definition ---
	divisionForm = this.#fb.group({
		section: ['', Validators.required],
		difficulty: ['Intermedio', Validators.required], // Default value
		numberType: ['Solo Naturales', Validators.required], // Default value
		resultType: [{ value: 'Exacto', disabled: false }, Validators.required], // Default value, initially enabled
	})

	// --- Fixed Select Options ---
	readonly difficultyLevels = ['Básico', 'Intermedio', 'Avanzado']
	readonly numberTypes = [
		'Solo Naturales',
		'Naturales y Enteros',
		NUMBER_TYPE_FRACTIONS,
	]
	readonly resultTypes = ['Exacto', 'Inexacto']

	// --- Lifecycle Management ---
	#destroy$ = new Subject<void>()

	// --- OnInit ---
	ngOnInit(): void {
		this.#store.dispatch(loadSections())
		this.#loadSections()
		this.#listenForNumberTypeChanges() // Setup listener for conditional logic
	}

	// --- OnDestroy ---
	ngOnDestroy(): void {
		this.#destroy$.next()
		this.#destroy$.complete()
	}

	// --- Private Methods ---

	/** Loads sections */
	#loadSections(): void {
		this.isLoadingSections.set(true)
		// Use findSections as requested by the user
		this.#store
			.select(selectAllClassSections)
			.pipe(
				takeUntil(this.#destroy$),
				catchError((error) =>
					this.#handleError(error, 'Error al cargar las secciones.'),
				),
				tap(() => this.isLoadingSections.set(false)),
			)
			.subscribe()
	}

	/** Enables/disables resultType based on numberType */
	#listenForNumberTypeChanges(): void {
		this.numberTypeCtrl?.valueChanges
			.pipe(
				takeUntil(this.#destroy$),
				distinctUntilChanged(), // Only react on actual change
			)
			.subscribe((value) => {
				if (value === NUMBER_TYPE_FRACTIONS) {
					this.resultTypeCtrl?.disable()
					this.resultTypeCtrl?.clearValidators() // Remove required validator
					this.resultTypeCtrl?.reset() // Optionally clear the value
				} else {
					this.resultTypeCtrl?.enable()
					this.resultTypeCtrl?.setValidators(Validators.required) // Add required validator back
				}
				this.resultTypeCtrl?.updateValueAndValidity() // Apply changes
			})
	}

	#handleError(error: any, defaultMessage: string): Observable<never> {
		console.error(defaultMessage, error)
		this.#snackBar.open(defaultMessage, 'Cerrar', { duration: 5000 })
		return EMPTY
	}

	// --- Public Methods ---

	/** Formats section display name */
	getSectionDisplay(section: ClassSection): string {
		return `${this.#pretify(section.year) || ''} ${section.name || ''} (${this.#pretify(section.level) || 'Nivel no especificado'})`
	}

	/** Handles form submission */
	async onSubmit(): Promise<void> {
		if (this.divisionForm.invalid) {
			this.divisionForm.markAllAsTouched()
			this.#snackBar.open(
				'Por favor, completa todos los campos requeridos.',
				'Cerrar',
				{ duration: 3000 },
			)
			return
		}

		this.isGenerating.set(true)
		this.generatedDivisions.set('')
		this.showResult.set(false)

		const formValue = this.divisionForm.getRawValue() // Use getRawValue to include disabled controls if needed later
		const selectedSection = this.sections().find(
			(s) => s._id === formValue.section,
		)

		// Construct the prompt for generating division problems
		const prompt = `Eres un generador experto de ejercicios matemáticos para estudiantes.
      Necesito una lista de operaciones de división adecuadas para una clase.

      Contexto:
      - Nivel Educativo: ${this.#pretify(selectedSection?.level || 'No especificado')}
      - Año/Grado: ${this.#pretify(selectedSection?.year || 'No especificado')}
      - Nivel de Dificultad Solicitado: ${formValue.difficulty}
      - Tipos de Números a Incluir: ${formValue.numberType}
      ${formValue.numberType !== NUMBER_TYPE_FRACTIONS ? `- Tipo de Resultado Deseado: ${formValue.resultType}` : ''}

      Instrucciones para Generar las Divisiones:
      1.  **Cantidad:** Genera una lista enumerada de 15 a 20 operaciones de división.
      2.  **Formato:** Presenta cada operación claramente, por ejemplo: "Dividendo / Divisor = ?" o "A ÷ B = ?". Si el resultado es inexacto y se pidió, indica cómo mostrar el residuo (ej: "23 / 5 = ? R ?"). Para fracciones, usa el formato "(a/b) / (c/d) = ?".
      3.  **Adecuación:** Las operaciones deben ser apropiadas para el nivel educativo (grado/año) y la dificultad seleccionada.
          * **Básico:** Números pequeños, divisores comunes, resultados exactos (si se pidió).
          * **Intermedio:** Números más grandes, variedad de divisores, puede incluir resultados inexactos (si se pidió). Para fracciones, denominadores comunes o simples.
          * **Avanzado:** Números grandes, divisores menos obvios, resultados inexactos más frecuentes (si se pidió). Para fracciones, distintos denominadores, fracciones impropias.
      4.  **Tipos de Números:** Asegúrate de usar solo los tipos de números especificados (Naturales, Enteros, Fracciones). Si son enteros, incluye números negativos en dividendo y/o divisor según la dificultad.
      5.  **Tipo de Resultado:** Si no son fracciones, genera divisiones que resulten en respuestas exactas o inexactas según lo solicitado.
      6.  **Salida:** Devuelve únicamente la lista de operaciones, una por línea, sin títulos, explicaciones, saludos o despedidas.`

		try {
			const result = await firstValueFrom(
				this.#aiService.geminiAi(prompt),
			)
			this.generatedDivisions.set(
				result?.response || 'No se pudieron generar las operaciones.',
			)
			this.showResult.set(true)
		} catch (error) {
			this.generatedDivisions.set(
				'Ocurrió un error al generar las operaciones. Por favor, inténtalo de nuevo.',
			)
			this.showResult.set(true) // Show error in result area
			this.#handleError(error, 'Error al contactar el servicio de IA')
		} finally {
			this.isGenerating.set(false)
		}
	}

	goBack(): void {
		this.showResult.set(false)
		this.generatedDivisions.set('')
		this.divisionForm.reset({
			section: '',
			difficulty: 'Intermedio',
			numberType: 'Solo Naturales',
			resultType: 'Exacto',
		})
		this.resultTypeCtrl?.enable()
		this.resultTypeCtrl?.setValidators(Validators.required)
		this.resultTypeCtrl?.updateValueAndValidity()
	}

	downloadDocx(): void {
		const divisionsText = this.generatedDivisions()
		if (!divisionsText || divisionsText.startsWith('Ocurrió un error'))
			return

		const formValue = this.divisionForm.getRawValue()
		const section = this.sections().find(
			(s) => s._id === formValue.section,
		)

		const sectionName = (section?.name || 'Seccion').replace(
			/[^a-z0-9]/gi,
			'_',
		)
		const difficultyName = (formValue.difficulty || 'Dificultad').replace(
			/[^a-z0-9]/gi,
			'_',
		)
		const numberTypeName = (formValue.numberType || 'Numeros')
			.substring(0, 15)
			.replace(/[^a-z0-9]/gi, '_')

		const filename = `Divisiones_${sectionName}_${difficultyName}_${numberTypeName}.docx`

		const paragraphs = divisionsText
			.split('\n')
			.filter((line) => line.trim().length > 0)
			.map(
				(line) =>
					new Paragraph({
						children: [new TextRun(line.trim())],
						spacing: { line: 360 },
					}),
			)

		const doc = new Document({
			sections: [
				{
					properties: {},
					children: [
						new Paragraph({
							text: `Ejercicios de División`,
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
							text: `Dificultad: ${formValue.difficulty}`,
							alignment: AlignmentType.CENTER,
							style: 'SubtleEmphasis',
						}),
						new Paragraph({
							text: `Tipo de Números: ${formValue.numberType}`,
							alignment: AlignmentType.CENTER,
							style: 'SubtleEmphasis',
						}),
						...(formValue.numberType !== NUMBER_TYPE_FRACTIONS
							? [
									new Paragraph({
										text: `Tipo de Resultado: ${formValue.resultType}`,
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
						run: {
							font: 'Calibri',
							size: 22,
						},
					},
					{
						id: 'SubtleEmphasis',
						name: 'Subtle Emphasis',
						basedOn: 'Normal',
						run: {
							italics: true,
							color: '5A5A5A',
							size: 20,
						},
					},
				],
			},
		})

		Packer.toBlob(doc)
			.then((blob) => {
				saveAs(blob, filename)
			})
			.catch((error) => {
				console.error('Error creating DOCX file:', error)
				this.#snackBar.open(
					'Error al generar el archivo DOCX.',
					'Cerrar',
					{ duration: 3000 },
				)
			})
	}

	get sectionCtrl(): AbstractControl | null {
		return this.divisionForm.get('section')
	}
	get difficultyCtrl(): AbstractControl | null {
		return this.divisionForm.get('difficulty')
	}
	get numberTypeCtrl(): AbstractControl | null {
		return this.divisionForm.get('numberType')
	}
	get resultTypeCtrl(): AbstractControl | null {
		return this.divisionForm.get('resultType')
	}
}
