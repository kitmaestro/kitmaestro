import {
	Component,
	signal,
	inject,
	ChangeDetectionStrategy,
	OnInit,
	OnDestroy,
	ViewEncapsulation,
	AfterViewInit,
	ViewChild,
	ElementRef,
} from '@angular/core';
import {
	FormBuilder,
	ReactiveFormsModule,
	Validators,
	AbstractControl,
	ValidationErrors,
	ValidatorFn,
	FormGroup,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';

// Angular Material Modules
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';

// --- DOCX Generation ---
import {
	Document,
	Packer,
	Paragraph,
	TextRun,
	ImageRun,
	AlignmentType,
	HeadingLevel,
} from 'docx'; // Import ImageRun
import { saveAs } from 'file-saver';
// Note: Buffer might be needed for ImageRun depending on environment/setup.
// If running in Node-like env, Buffer is global. In browser, polyfills might be needed or use alternative methods if Buffer isn't available.
// Assuming Buffer is available for simplicity here.
declare var Buffer: any; // Declare Buffer if not globally recognized by TS

// --- Constants ---
const PIXELS_PER_CM = 37.8; // Approximate pixels per cm (assuming ~96 DPI)
const CM_PER_MM = 0.1;

@Component({
	selector: 'app-number-line-generator',
	standalone: true,
	imports: [
		CommonModule,
		ReactiveFormsModule,
		MatCardModule,
		MatFormFieldModule,
		MatInputModule,
		MatButtonModule,
		MatSnackBarModule,
		MatIconModule,
	],
	// --- Inline Template ---
	template: `
		<div class="number-line-card">
			<div>
				<h2>Generador de Recta Numérica</h2>
			</div>

			<div>
				@if (!showResult()) {
					<form
						[formGroup]="numberLineForm"
						(ngSubmit)="onSubmit()"
						class="number-line-form"
					>
						<div class="form-row">
							<mat-form-field
								appearance="outline"
								class="form-field"
							>
								<mat-label>Número Mínimo</mat-label>
								<input
									matInput
									type="number"
									formControlName="min"
									required
								/>
								@if (
									minCtrl?.hasError('required') &&
									minCtrl?.touched
								) {
									<mat-error
										>El valor mínimo es
										requerido.</mat-error
									>
								}
							</mat-form-field>

							<mat-form-field
								appearance="outline"
								class="form-field"
							>
								<mat-label>Número Máximo</mat-label>
								<input
									matInput
									type="number"
									formControlName="max"
									required
								/>
								@if (
									maxCtrl?.hasError('required') &&
									maxCtrl?.touched
								) {
									<mat-error
										>El valor máximo es
										requerido.</mat-error
									>
								}
								@if (
									numberLineForm.hasError('maxLessThanMin') &&
									maxCtrl?.touched
								) {
									<mat-error
										>El máximo debe ser mayor que el
										mínimo.</mat-error
									>
								}
							</mat-form-field>
						</div>

						<div class="form-actions">
							<button
								mat-flat-button
								color="primary"
								type="submit"
								[disabled]="numberLineForm.invalid"
							>
								<mat-icon>linear_scale</mat-icon> Generar Recta
								Numérica
							</button>
						</div>
					</form>
				}

				<canvas #numberLineCanvas style="display: none;"></canvas>

				@if (showResult() && generatedImageSrc()) {
					<div class="number-line-result">
						<h3>Recta Numérica Generada:</h3>
						<p>
							Puedes hacer clic derecho sobre la imagen para
							copiarla o guardarla.
						</p>
						<div class="image-container">
							<img
								[src]="generatedImageSrc()"
								alt="Recta Numérica Generada"
								class="generated-image"
							/>
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
								[disabled]="!generatedImageSrc()"
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
			.number-line-card {
				margin: 0 auto;
				padding: 15px 25px 25px 25px;
			}
			.number-line-form {
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
				min-width: 200px;
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
			.number-line-result {
				margin-top: 20px;
			}
			.number-line-result h3 {
				margin-bottom: 10px;
			}
			.number-line-result p {
				margin-bottom: 15px;
				font-size: 0.9em;
				color: #555;
			}
			.image-container {
				border: 1px solid #ccc;
				background-color: #f9f9f9; /* Light background for contrast */
				padding: 10px;
				margin-bottom: 20px;
				overflow-x: auto; /* Add scroll if image is too wide */
			}
			.generated-image {
				display: block; /* Prevents extra space below image */
				max-width: 100%; /* Make image responsive */
				height: auto;
				border: 1px solid #eee; /* Slight border on image itself */
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
export class NumberLineGeneratorComponent
	implements OnInit, OnDestroy, AfterViewInit
{
	// --- Dependencies ---
	#fb = inject(FormBuilder);
	#snackBar = inject(MatSnackBar);

	// --- Canvas Reference ---
	@ViewChild('numberLineCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;
	#canvasContext: CanvasRenderingContext2D | null = null;

	// --- State Signals ---
	showResult = signal(false);
	generatedImageSrc = signal<string | null>(null); // Holds the image data URL

	// --- Form Definition ---
	numberLineForm = this.#fb.group(
		{
			min: [-10, [Validators.required, Validators.pattern(/^-?\d+$/)]], // Default min, integer pattern
			max: [10, [Validators.required, Validators.pattern(/^-?\d+$/)]], // Default max, integer pattern
		},
		{ validators: this.#maxValueValidator('min', 'max') },
	); // Add custom cross-field validator

	// --- Lifecycle Management ---
	#destroy$ = new Subject<void>();

	// --- OnInit ---
	ngOnInit(): void {
		// Potentially listen for form changes if needed, but generation is on submit
	}

	// --- AfterViewInit ---
	ngAfterViewInit(): void {
		// Get canvas context after view is initialized
		try {
			this.#canvasContext = this.canvasRef.nativeElement.getContext('2d');
		} catch (e) {
			console.error('Error getting canvas context', e);
			this.#snackBar.open(
				'Error al inicializar el área de dibujo.',
				'Cerrar',
				{ duration: 5000 },
			);
		}
	}

	// --- OnDestroy ---
	ngOnDestroy(): void {
		this.#destroy$.next();
		this.#destroy$.complete();
	}

	// --- Private Methods ---

	/** Custom validator to check if max value is greater than min value */
	#maxValueValidator(
		minControlName: string,
		maxControlName: string,
	): ValidatorFn {
		return (formGroup: AbstractControl): ValidationErrors | null => {
			const minControl = formGroup.get(minControlName);
			const maxControl = formGroup.get(maxControlName);

			if (
				!minControl ||
				!maxControl ||
				!minControl.value ||
				!maxControl.value
			) {
				return null; // Don't validate if controls aren't present or have no value
			}

			const minValue = parseFloat(minControl.value);
			const maxValue = parseFloat(maxControl.value);

			if (!isNaN(minValue) && !isNaN(maxValue) && maxValue <= minValue) {
				// Set error on the form group level
				return { maxLessThanMin: true };
			}

			return null; // Validation passed
		};
	}

	/** Draws the number line and grid onto the canvas */
	#drawNumberLine(min: number, max: number): boolean {
		if (!this.#canvasContext || !this.canvasRef) {
			console.error('Canvas context not available');
			this.#snackBar.open(
				'No se puede dibujar: el contexto del canvas no está listo.',
				'Cerrar',
				{ duration: 4000 },
			);
			return false;
		}
		const ctx = this.#canvasContext;
		const canvas = this.canvasRef.nativeElement;

		// --- Canvas Setup ---
		// Define canvas dimensions (can be adjusted)
		const canvasWidth = 1000; // Wider canvas for better range display
		const canvasHeight = 150;
		canvas.width = canvasWidth;
		canvas.height = canvasHeight;

		// Clear canvas
		ctx.clearRect(0, 0, canvasWidth, canvasHeight);
		ctx.fillStyle = '#FFFFFF'; // White background
		ctx.fillRect(0, 0, canvasWidth, canvasHeight);

		// --- Drawing Parameters ---
		const padding = 40; // Padding around the number line
		const lineY = canvasHeight / 1.8; // Y position of the number line (lower half)
		const drawableWidth = canvasWidth - 2 * padding;
		const range = max - min;
		if (range <= 0) return false; // Should be caught by validator, but double check

		// --- Grid Drawing ---
		ctx.strokeStyle = '#CCCCCC'; // Light grey for grid
		ctx.lineWidth = 1;
		ctx.setLineDash([]); // Solid lines for cm grid

		// Vertical CM lines (Solid)
		for (let x = 0; x <= canvasWidth; x += PIXELS_PER_CM) {
			// ctx.beginPath();
			// ctx.moveTo(x, 0);
			// ctx.lineTo(x, canvasHeight);
			// ctx.stroke();
		}
		// Horizontal CM lines (Solid)
		for (let y = 0; y <= canvasHeight; y += PIXELS_PER_CM) {
			// ctx.beginPath();
			// ctx.moveTo(0, y);
			// ctx.lineTo(canvasWidth, y);
			// ctx.stroke();
		}

		// MM subdivisions (Dashed/Dotted)
		ctx.strokeStyle = '#E0E0E0'; // Lighter grey for mm
		ctx.lineWidth = 0.5;
		ctx.setLineDash([2, 3]); // Dashed lines for mm grid

		// Vertical MM lines
		for (let x = 0; x <= canvasWidth; x += PIXELS_PER_CM * CM_PER_MM) {
			if (x % PIXELS_PER_CM !== 0) {
				// Avoid drawing over cm lines
				ctx.beginPath();
				ctx.moveTo(x, 0);
				ctx.lineTo(x, canvasHeight);
				ctx.stroke();
			}
		}
		// Horizontal MM lines
		for (let y = 0; y <= canvasHeight; y += PIXELS_PER_CM * CM_PER_MM) {
			if (y % PIXELS_PER_CM !== 0) {
				// Avoid drawing over cm lines
				ctx.beginPath();
				ctx.moveTo(0, y);
				ctx.lineTo(canvasWidth, y);
				ctx.stroke();
			}
		}
		ctx.setLineDash([]); // Reset line dash

		// --- Number Line Drawing ---
		ctx.strokeStyle = '#000000'; // Black for number line
		ctx.lineWidth = 1;
		ctx.fillStyle = '#000000';
		ctx.font = '12px Arial';
		ctx.textAlign = 'center';
		ctx.textBaseline = 'top'; // Align text above the line position

		// Draw the main line
		ctx.beginPath();
		ctx.moveTo(padding, lineY);
		ctx.lineTo(canvasWidth - padding, lineY);
		ctx.stroke();

		// Draw arrow heads
		const arrowSize = 8;
		ctx.beginPath();
		ctx.moveTo(padding, lineY);
		ctx.lineTo(padding + arrowSize, lineY - arrowSize / 2);
		ctx.lineTo(padding + arrowSize, lineY + arrowSize / 2);
		ctx.closePath();
		ctx.fill();

		ctx.beginPath();
		ctx.moveTo(canvasWidth - padding, lineY);
		ctx.lineTo(canvasWidth - padding - arrowSize, lineY - arrowSize / 2);
		ctx.lineTo(canvasWidth - padding - arrowSize, lineY + arrowSize / 2);
		ctx.closePath();
		ctx.fill();

		// --- Ticks and Labels ---
		const tickHeight = 10; // Height of major ticks
		// Determine reasonable tick interval based on range
		let interval = 1;
		if (range > 20) interval = Math.ceil(range / 10); // Aim for ~10-20 major ticks
		if (range > 100) interval = Math.ceil(range / 10 / 5) * 5; // Round to nearest 5
		if (range > 500) interval = Math.ceil(range / 10 / 10) * 10; // Round to nearest 10

		for (
			let i = Math.ceil(min / interval) * interval;
			i <= max;
			i += interval
		) {
			// Calculate position on canvas
			const xPos = padding + ((i - min) / range) * drawableWidth;

			// Draw major tick
			ctx.beginPath();
			ctx.moveTo(xPos, lineY - tickHeight / 2);
			ctx.lineTo(xPos, lineY + tickHeight / 2);
			ctx.stroke();

			// Draw label
			ctx.fillText(i.toString(), xPos, lineY + tickHeight / 2 + 5); // Position below tick
		}

		// Optional: Draw minor ticks between major intervals if needed (e.g., if interval > 1)
		if (interval > 1) {
			const minorTickHeight = 5;
			const minorInterval = 1; // Or interval / 2, interval / 5 etc.
			for (let i = Math.ceil(min); i <= max; i += minorInterval) {
				if (i % interval !== 0) {
					// Don't draw over major ticks
					const xPos = padding + ((i - min) / range) * drawableWidth;
					ctx.beginPath();
					ctx.moveTo(xPos, lineY - minorTickHeight / 2);
					ctx.lineTo(xPos, lineY + minorTickHeight / 2);
					ctx.stroke();
				}
			}
		}

		return true; // Drawing successful
	}

	// --- Public Methods ---

	/** Handles form submission */
	onSubmit(): void {
		if (this.numberLineForm.invalid) {
			this.numberLineForm.markAllAsTouched();
			this.#snackBar.open(
				'Por favor, corrige los errores en el formulario.',
				'Cerrar',
				{ duration: 3000 },
			);
			return;
		}

		const min = this.minCtrl?.value;
		const max = this.maxCtrl?.value;

		// Ensure values are numbers (though form validation should handle this)
		if (typeof min !== 'number' || typeof max !== 'number') {
			this.#snackBar.open(
				'Valores mínimo y máximo inválidos.',
				'Cerrar',
				{ duration: 3000 },
			);
			return;
		}

		// Draw on the canvas
		const success = this.#drawNumberLine(min, max);

		if (success && this.canvasRef) {
			// Get data URL from canvas
			try {
				const dataUrl =
					this.canvasRef.nativeElement.toDataURL('image/png');
				this.generatedImageSrc.set(dataUrl);
				this.showResult.set(true);
			} catch (e) {
				console.error('Error generating image from canvas:', e);
				this.#snackBar.open(
					'Error al generar la imagen de la recta.',
					'Cerrar',
					{ duration: 4000 },
				);
				this.generatedImageSrc.set(null);
				this.showResult.set(false);
			}
		} else if (!success) {
			this.#snackBar.open(
				'No se pudo dibujar la recta con los valores proporcionados.',
				'Cerrar',
				{ duration: 4000 },
			);
			this.generatedImageSrc.set(null);
			this.showResult.set(false);
		}
	}

	/** Resets the form and view */
	goBack(): void {
		this.showResult.set(false);
		this.generatedImageSrc.set(null);
		this.numberLineForm.reset({ min: -10, max: 10 }); // Reset to defaults
	}

	/** Downloads the generated number line as DOCX */
	downloadDocx(): void {
		const imageDataUrl = this.generatedImageSrc();
		if (!imageDataUrl) {
			this.#snackBar.open('No hay imagen para descargar.', 'Cerrar', {
				duration: 3000,
			});
			return;
		}

		const formValue = this.numberLineForm.value;
		const filename = `RectaNumerica_${formValue.min}_a_${formValue.max}.docx`;

		try {
			// Extract base64 data
			const base64Data = imageDataUrl.split(',')[1];
			if (!base64Data) throw new Error('Invalid data URL format');

			// Assuming Buffer is available (may need polyfill/alternative in strict browser env)
			const imageBuffer = Buffer.from(base64Data, 'base64');

			// Create the document
			const doc = new Document({
				sections: [
					{
						properties: {},
						children: [
							new Paragraph({
								text: `Recta Numérica (${formValue.min} a ${formValue.max})`,
								heading: HeadingLevel.HEADING_1,
								alignment: AlignmentType.CENTER,
							}),
							new Paragraph({
								// Paragraph to hold the image
								children: [
									new ImageRun({
										data: imageBuffer,
										transformation: {
											// Adjust width/height as needed, maintaining aspect ratio
											// Width in EMU (English Metric Units): 1 inch = 914400 EMU
											// Let's aim for approx 6.5 inches width
											width: 6.5 * 914400,
											height:
												(this.canvasRef.nativeElement
													.height /
													this.canvasRef.nativeElement
														.width) *
												(6.5 * 914400), // Maintain aspect ratio
										},
										type: 'png',
									}),
								],
								alignment: AlignmentType.CENTER, // Center the image paragraph
							}),
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
					console.error('Error packing DOCX file:', error);
					this.#snackBar.open(
						'Error al generar el archivo DOCX.',
						'Cerrar',
						{ duration: 3000 },
					);
				});
		} catch (error) {
			console.error('Error preparing DOCX file:', error);
			this.#snackBar.open(
				'Error al preparar la imagen para el archivo DOCX.',
				'Cerrar',
				{ duration: 4000 },
			);
		}
	}

	// --- Getters for easier access to form controls ---
	get minCtrl(): AbstractControl | null {
		return this.numberLineForm.get('min');
	}
	get maxCtrl(): AbstractControl | null {
		return this.numberLineForm.get('max');
	}
}
