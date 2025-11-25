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
	catchError,
	EMPTY,
	finalize,
} from 'rxjs';

// Angular Material Modules
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list'; // For displaying selected files

// --- Core Services & Interfaces (Using new structure paths) ---
import { AiService } from '../../../core/services/ai.service'; // Assuming AI service path
// Interfaces for AI response (assuming structure)
import { GradingResult } from '../../../core'; // Example: export interface GradingResult { grade: string; feedback: string; }

// --- DOCX Generation (Not strictly needed here, but kept for consistency if needed later) ---
// import { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel } from 'docx';
// import { saveAs } from 'file-saver';

@Component({
	selector: 'app-image-grader', // Component selector
	standalone: true,
	imports: [
		CommonModule,
		ReactiveFormsModule,
		MatCardModule,
		MatFormFieldModule,
		MatInputModule,
		MatButtonModule,
		MatProgressSpinnerModule,
		MatSnackBarModule,
		MatIconModule,
		MatListModule, // Import MatListModule
	],
	// --- Inline Template ---
	template: `
		<mat-card class="image-grader-card">
			<mat-card-header>
				<mat-card-title
					>Corrector de Actividades con Imágenes</mat-card-title
				>
				<mat-card-subtitle
					>Sube o captura imágenes para obtener calificación y
					feedback</mat-card-subtitle
				>
			</mat-card-header>

			<mat-card-content>
				@if (!showResult()) {
					<form
						[formGroup]="graderForm"
						(ngSubmit)="onSubmit()"
						class="grader-form"
					>
						<div class="file-input-section">
							<button
								type="button"
								mat-stroked-button
								color="primary"
								(click)="fileInput.click()"
							>
								<mat-icon>upload_file</mat-icon> Seleccionar
								Archivos
							</button>
							<input
								#fileInput
								type="file"
								multiple
								accept="image/*"
								(change)="onFileSelected($event)"
								style="display: none;"
							/>

							<button
								type="button"
								mat-stroked-button
								color="accent"
								(click)="triggerCamera()"
								disabled
							>
								<mat-icon>photo_camera</mat-icon> Usar Cámara
								(Próximamente)
							</button>
						</div>

						@if (selectedFiles().length > 0) {
							<mat-list role="list" class="file-list">
								<mat-list-item role="listitem"
									>Archivos Seleccionados:</mat-list-item
								>
								@for (
									file of selectedFiles();
									track file.name
								) {
									<mat-list-item
										role="listitem"
										class="file-item"
									>
										<mat-icon matListItemIcon
											>image</mat-icon
										>
										<div matListItemTitle>
											{{ file.name }}
										</div>
										<div matListItemLine>
											{{ formatBytes(file.size) }}
										</div>
										<button
											type="button"
											mat-icon-button
											color="warn"
											(click)="removeFile(file.name)"
											matListItemMeta
										>
											<mat-icon>cancel</mat-icon>
										</button>
									</mat-list-item>
								}
							</mat-list>
						} @else {
							<p class="no-files-message">
								No hay archivos seleccionados.
							</p>
						}

						<mat-form-field
							appearance="outline"
							class="form-field points-field"
						>
							<mat-label>Puntos Totales (Opcional)</mat-label>
							<input
								matInput
								type="number"
								formControlName="maxPoints"
								min="1"
							/>
							@if (
								maxPointsCtrl?.invalid && maxPointsCtrl?.touched
							) {
								<mat-error
									>Ingresa un número válido de puntos (mayor
									que 0).</mat-error
								>
							}
						</mat-form-field>

						<div class="form-actions">
							<button
								mat-raised-button
								color="primary"
								type="submit"
								[disabled]="
									selectedFiles().length === 0 ||
									isGenerating()
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
										Procesando...
									</div>
								} @else {
									<ng-container>
										<mat-icon>grading</mat-icon> Calificar y
										Generar Feedback
									</ng-container>
								}
							</button>
						</div>
					</form>
				}

				@if (showResult()) {
					<div class="grader-result">
						<h3>Resultado y Feedback:</h3>

						<mat-form-field
							appearance="outline"
							class="result-field"
						>
							<mat-label>Calificación / Resultado</mat-label>
							<input
								matInput
								[value]="gradingResult()?.grade || 'N/A'"
								readonly
							/>
						</mat-form-field>

						<mat-form-field
							appearance="outline"
							class="result-field feedback-field"
						>
							<mat-label>Feedback Generado</mat-label>
							<textarea
								matInput
								cdkTextareaAutosize
								#feedbackArea
								[value]="
									gradingResult()?.feedback ||
									'No se generó feedback.'
								"
								readonly
							></textarea>
						</mat-form-field>

						<div class="result-actions">
							<button
								mat-stroked-button
								color="primary"
								(click)="goBack()"
							>
								<mat-icon>arrow_back</mat-icon> Volver
							</button>
							<div>
								<button
									mat-icon-button
									color="primary"
									(click)="copyFeedback(feedbackArea.value)"
									matTooltip="Copiar Feedback"
								>
									<mat-icon>content_copy</mat-icon>
								</button>
								<button
									mat-icon-button
									color="accent"
									(click)="shareViaWhatsApp()"
									matTooltip="Compartir por WhatsApp"
								>
									<mat-icon>share</mat-icon>
								</button>
							</div>
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
			.image-grader-card {
				margin: 0 auto;
				padding: 15px 25px 25px 25px;
			}
			.grader-form {
				display: flex;
				flex-direction: column;
				gap: 20px;
			} /* Increased gap */
			.file-input-section {
				display: flex;
				gap: 15px;
				flex-wrap: wrap;
				margin-bottom: 10px;
			}
			.file-list {
				max-height: 150px;
				overflow-y: auto;
				border: 1px solid #eee;
				margin-bottom: 15px;
			}
			.file-item {
				font-size: 0.9em;
			}
			.file-item mat-icon[matListItemIcon] {
				margin-right: 8px;
			}
			.no-files-message {
				color: #757575;
				font-style: italic;
				margin: 10px 0 15px 0;
			}
			.points-field {
				max-width: 200px;
			} /* Limit width of points field */
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
			.grader-result {
				margin-top: 20px;
			}
			.grader-result h3 {
				margin-bottom: 15px;
			}
			.result-field {
				width: 100%;
				margin-bottom: 15px;
			}
			.feedback-field textarea {
				min-height: 100px;
			}
			.result-actions {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-top: 20px;
				flex-wrap: wrap;
				gap: 10px;
			}
			.result-actions > div {
				display: flex;
				gap: 10px;
			} /* Group action buttons */
		`,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
})
export class ImageGraderComponent implements OnInit, OnDestroy {
	// --- Dependencies ---
	#fb = inject(FormBuilder);
	#aiService = inject(AiService);
	#snackBar = inject(MatSnackBar);

	// --- State Signals ---
	isGenerating = signal(false);
	showResult = signal(false);
	selectedFiles = signal<File[]>([]); // Store selected files
	gradingResult = signal<GradingResult | null>(null); // Stores grade and feedback

	// --- Form Definition ---
	// Form only controls optional points, file selection is handled separately
	graderForm = this.#fb.group({
		maxPoints: [null, [Validators.min(1)]], // Optional, min value 1 if entered
	});

	// --- Lifecycle Management ---
	#destroy$ = new Subject<void>();

	// --- OnInit ---
	ngOnInit(): void {
		// Initialization if needed
	}

	// --- OnDestroy ---
	ngOnDestroy(): void {
		this.#destroy$.next();
		this.#destroy$.complete();
	}

	// --- Private Methods ---

	#handleError(error: any, defaultMessage: string): Observable<never> {
		console.error(defaultMessage, error);
		this.#snackBar.open(defaultMessage, 'Cerrar', { duration: 5000 });
		this.isGenerating.set(false); // Ensure loading stops on error
		return EMPTY;
	}

	// --- Public Methods ---

	/** Handles file selection from the input */
	onFileSelected(event: Event): void {
		const element = event.currentTarget as HTMLInputElement;
		const fileList: FileList | null = element.files;

		if (fileList) {
			const newFiles = Array.from(fileList);
			// Add new files, preventing duplicates based on name
			const currentFiles = this.selectedFiles();
			const updatedFiles = [...currentFiles];
			newFiles.forEach((newFile) => {
				if (
					!currentFiles.some(
						(existingFile) => existingFile.name === newFile.name,
					)
				) {
					updatedFiles.push(newFile);
				}
			});
			this.selectedFiles.set(updatedFiles);
		}
		// Reset the input value to allow selecting the same file again after removing it
		if (element) element.value = '';
	}

	/** Removes a selected file */
	removeFile(fileName: string): void {
		this.selectedFiles.update((files) =>
			files.filter((file) => file.name !== fileName),
		);
	}

	/** Placeholder for camera functionality */
	triggerCamera(): void {
		this.#snackBar.open(
			'La función de cámara estará disponible próximamente.',
			'Cerrar',
			{ duration: 3000 },
		);
		// TODO: Implement camera access using navigator.mediaDevices.getUserMedia
		// This would involve:
		// 1. Requesting permissions.
		// 2. Streaming video to a <video> element.
		// 3. Drawing a frame from the video onto a hidden <canvas>.
		// 4. Converting the canvas to a Blob or File object.
		// 5. Adding the captured file to the selectedFiles signal.
	}

	/** Formats file size */
	formatBytes(bytes: number, decimals = 2): string {
		if (bytes === 0) return '0 Bytes';
		const k = 1024;
		const dm = decimals < 0 ? 0 : decimals;
		const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return (
			parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
		);
	}

	/** Handles form submission */
	async onSubmit(): Promise<void> {
		if (this.selectedFiles().length === 0) {
			this.#snackBar.open(
				'Por favor, selecciona al menos una imagen.',
				'Cerrar',
				{ duration: 3000 },
			);
			return;
		}
		if (this.graderForm.invalid) {
			this.graderForm.markAllAsTouched(); // Mark points field if invalid
			this.#snackBar.open(
				'Verifica los campos del formulario.',
				'Cerrar',
				{ duration: 3000 },
			);
			return;
		}

		this.isGenerating.set(true);
		this.gradingResult.set(null); // Clear previous result
		this.showResult.set(false);

		const formValue = this.graderForm.getRawValue();
		const filesToProcess = this.selectedFiles();

		// --- Call AI Service (ASSUMPTION) ---
		// This assumes your AiService has a method like this.
		// You might need to convert files to base64 or use FormData depending on your backend.
		try {
			// const result = await firstValueFrom(
			// 	this.#aiService
			// 		.gradeImageActivity(
			// 			filesToProcess,
			// 			formValue.maxPoints ?? undefined,
			// 		)
			// 		.pipe(
			// 			takeUntil(this.#destroy$),
			// 			catchError((error) =>
			// 				this.#handleError(
			// 					error,
			// 					'Error al procesar la actividad.',
			// 				),
			// 			),
			// 			finalize(() => this.isGenerating.set(false)), // Ensure loading stops
			// 		),
			// );
			// if (result) {
			// 	this.gradingResult.set(result);
			// 	this.showResult.set(true);
			// } else {
			// 	// Handle cases where the service might return null/undefined even without throwing
			// 	this.#snackBar.open(
			// 		'No se recibió un resultado válido del servicio.',
			// 		'Cerrar',
			// 		{ duration: 4000 },
			// 	);
			// }
		} catch (error) {
			// Catch potential errors not caught by RxJS catchError (e.g., during promise conversion)
			this.#handleError(
				error,
				'Error inesperado durante la calificación.',
			);
			this.isGenerating.set(false);
		}
	}

	/** Resets the form and view */
	goBack(): void {
		this.showResult.set(false);
		this.gradingResult.set(null);
		this.selectedFiles.set([]);
		this.graderForm.reset();
	}

	/** Copies feedback text to clipboard */
	copyFeedback(feedback: string | undefined): void {
		if (!feedback) {
			this.#snackBar.open('No hay feedback para copiar.', 'Cerrar', {
				duration: 2000,
			});
			return;
		}
		navigator.clipboard
			.writeText(feedback)
			.then(() => {
				this.#snackBar.open(
					'Feedback copiado al portapapeles.',
					'Cerrar',
					{ duration: 2000 },
				);
			})
			.catch((err) => {
				console.error('Error copying text: ', err);
				this.#snackBar.open('Error al copiar el feedback.', 'Cerrar', {
					duration: 3000,
				});
			});
	}

	/** Shares result and feedback via WhatsApp */
	shareViaWhatsApp(): void {
		const result = this.gradingResult();
		if (!result) {
			this.#snackBar.open('No hay resultado para compartir.', 'Cerrar', {
				duration: 3000,
			});
			return;
		}

		const gradeText = result.grade
			? `Calificación: ${result.grade}`
			: 'Calificación no disponible';
		const feedbackText = result.feedback
			? `\n\nFeedback: ${result.feedback}`
			: '\n\nNo se generó feedback.';
		const fullMessage = `${gradeText}${feedbackText}`;

		// Encode message for URL
		const encodedMessage = encodeURIComponent(fullMessage);

		// Construct WhatsApp URL (wa.me is generally preferred)
		const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
		// const whatsappUrl = `whatsapp://send?text=${encodedMessage}`; // Alternative for mobile

		// Open the URL
		window.open(whatsappUrl, '_blank');
	}

	// --- Getters for easier access to form controls ---
	get maxPointsCtrl(): AbstractControl | null {
		return this.graderForm.get('maxPoints');
	}
}
