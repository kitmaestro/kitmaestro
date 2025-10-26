import {
	Component,
	signal,
	inject,
	computed,
	ChangeDetectionStrategy,
} from '@angular/core';
import { FormsModule } from '@angular/forms'; // Needed for ngModel with signals

// Angular Material Modules
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'; // For error messages

// Service (Assuming this path and method exist)
import { AiService } from '../../../core/services/ai.service'; // Adjust path if necessary

// DOCX generation
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver'; // npm install docx file-saver @types/file-saver
import { MatIconModule } from '@angular/material/icon';

@Component({
	selector: 'app-reflection-generator',
	standalone: true,
	imports: [
		FormsModule, // Import FormsModule for ngModel
		MatCardModule,
		MatFormFieldModule,
		MatSelectModule,
		MatInputModule,
		MatButtonModule,
		MatProgressSpinnerModule,
		MatSnackBarModule,
		MatIconModule,
	],
	template: `
		<mat-card class="reflection-card">
			<mat-card-header>
				<h2>Generador de Reflexión Diaria</h2>
				<mat-card-subtitle
					>Crea reflexiones personalizadas para tus
					estudiantes</mat-card-subtitle
				>
			</mat-card-header>

			<mat-card-content>
				@if (!mostrarReflexion()) {
					<form
						(ngSubmit)="generarReflexion()"
						class="reflection-form"
					>
						<div class="form-row">
							<mat-form-field
								appearance="outline"
								class="form-field"
							>
								<mat-label>Nivel Educativo</mat-label>
								<mat-select
									[(ngModel)]="nivelSeleccionado"
									name="nivel"
									required
									#nivelInput="ngModel"
								>
									@for (nivel of niveles; track nivel) {
										<mat-option [value]="nivel">{{
											nivel
										}}</mat-option>
									}
								</mat-select>
								@if (nivelInput.invalid && nivelInput.touched) {
									<mat-error>Selecciona un nivel.</mat-error>
								}
							</mat-form-field>

							<mat-form-field
								appearance="outline"
								class="form-field"
							>
								<mat-label>Grado</mat-label>
								<mat-select
									[(ngModel)]="gradoSeleccionado"
									name="grado"
									required
									#gradoInput="ngModel"
									[disabled]="!nivelSeleccionado()"
								>
									@for (
										grado of gradosDisponibles();
										track grado
									) {
										<mat-option [value]="grado">{{
											grado
										}}</mat-option>
									}
								</mat-select>
								@if (!nivelSeleccionado()) {
									<mat-hint
										>Selecciona un nivel primero</mat-hint
									>
								}
								@if (gradoInput.invalid && gradoInput.touched) {
									<mat-error>Selecciona un grado.</mat-error>
								}
							</mat-form-field>
						</div>

						<div class="form-row">
							<mat-form-field
								appearance="outline"
								class="form-field theme-select"
							>
								<mat-label>Tema</mat-label>
								<mat-select
									[(ngModel)]="temaSeleccionado"
									name="tema"
									required
									#temaInput="ngModel"
								>
									@for (
										tema of temasPredefinidos();
										track tema
									) {
										<mat-option [value]="tema">{{
											tema
										}}</mat-option>
									}
								</mat-select>
								@if (temaInput.invalid && temaInput.touched) {
									<mat-error
										>Selecciona o escribe un
										tema.</mat-error
									>
								}
							</mat-form-field>

							@if (temaSeleccionado() === 'Otro') {
								<mat-form-field
									appearance="outline"
									class="form-field custom-theme"
								>
									<mat-label
										>Escribe tu tema
										personalizado</mat-label
									>
									<input
										matInput
										[(ngModel)]="temaPersonalizado"
										name="temaPersonalizado"
										required
										#customThemeInput="ngModel"
									/>
									@if (
										customThemeInput.invalid &&
										customThemeInput.touched
									) {
										<mat-error
											>Ingresa un tema
											personalizado.</mat-error
										>
									}
								</mat-form-field>
							}
						</div>

						<div class="form-row">
							<mat-form-field
								appearance="outline"
								class="form-field theme-select"
							>
								<mat-label>Formato</mat-label>
								<mat-select
									[(ngModel)]="formatoSeleccionado"
									name="formato"
									required
									#formatInput="ngModel"
								>
									@for (f of formato; track f) {
										<mat-option [value]="f">{{
											f
										}}</mat-option>
									}
								</mat-select>
								@if (
									formatInput.invalid && formatInput.touched
								) {
									<mat-error
										>Selecciona un formato.</mat-error
									>
								}
							</mat-form-field>
							<mat-form-field
								appearance="outline"
								class="form-field theme-select"
							>
								<mat-label>Tono</mat-label>
								<mat-select
									[(ngModel)]="tonoSeleccionado"
									name="tema"
									required
									#tonoInput="ngModel"
								>
									@for (t of tono; track t) {
										<mat-option [value]="t">{{
											t
										}}</mat-option>
									}
								</mat-select>
								@if (tonoInput.invalid && tonoInput.touched) {
									<mat-error>Selecciona un tono.</mat-error>
								}
							</mat-form-field>
						</div>

						<div class="form-actions">
							<button
								mat-raised-button
								color="primary"
								type="submit"
								[disabled]="
									!esFormularioValido() || estaGenerando()
								"
							>
								@if (estaGenerando()) {
									<mat-spinner
										diameter="20"
										color="accent"
										style="display: inline-block; margin-right: 8px;"
									></mat-spinner>
									Generando...
								} @else {
									Generar Reflexión
								}
							</button>
						</div>
					</form>
				}

				@if (mostrarReflexion()) {
					<div class="reflection-display">
						<h3>Reflexión Generada:</h3>
						<div
							class="carta"
							[innerHTML]="
								reflexionGenerada().replaceAll(
									'
',
									'<br>'
								)
							"
						></div>

						<div class="reflection-actions">
							<button
								mat-stroked-button
								color="primary"
								(click)="volver()"
							>
								<mat-icon>arrow_back</mat-icon> Volver
							</button>
							<button
								mat-raised-button
								color="primary"
								(click)="descargarDocx()"
								[disabled]="
									!reflexionGenerada() ||
									reflexionGenerada().startsWith(
										'Ocurrió un error'
									)
								"
							>
								<mat-icon>download</mat-icon> Descargar
							</button>
						</div>
					</div>
				}
			</mat-card-content>
		</mat-card>
	`,
	styles: `
		@use '@angular/material' as mat; // Import Angular Material theming functions

		.reflection-card {
			margin: 20px auto; // Center the card
			padding: 15px 25px 25px 25px; // Adjust padding inside the card
		}

		.reflection-form {
			display: flex;
			flex-direction: column;
			padding: 16px 0;
			gap: 15px; // Space between form elements/rows
		}

		.form-row {
			display: flex;
			gap: 15px; // Space between fields in a row
			flex-wrap: wrap; // Allow fields to wrap on smaller screens
		}

		.form-field {
			flex: 1; // Allow fields to grow
			min-width: 200px; // Minimum width for fields before wrapping
		}

		// Specific adjustments if needed
		.theme-select {
			// Example: Make theme select slightly larger if needed
			// flex-basis: 250px;
		}
		.custom-theme {
			// Example: Make custom theme input take more space
			flex-grow: 1.5;
		}

		.form-actions {
			display: flex;
			justify-content: flex-end; // Align button to the right
			margin-top: 20px;
		}

		.reflection-display {
			margin-top: 20px;
			h3 {
				margin-bottom: 15px;
				// color: mat.get-theme-color(mat.define-light-theme((color: (primary: mat.$indigo-palette, accent: mat.$pink-palette))), primary); // Use theme color
			}
		}

		// Style the reflection container to look like a page
		.carta {
			background-color: #fff;
			border: 1px solid #e0e0e0;
			padding: 40px 50px; // Generous padding like a document
			min-height: 300px; // Minimum height
			box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
			line-height: 1.6;
			font-family:
				'Times New Roman', Times, serif; // Classic document font
			font-size: 12pt; // Standard document font size
			margin-bottom: 20px;
			// Simulating Letter paper aspect ratio (approximate)
			// width: 8.5in; height: 11in;
			// Using max-width and aspect-ratio for responsiveness might be better
			max-width: 100%; // Ensure it fits container
			// aspect-ratio: 8.5 / 11; // Uncomment if strict aspect ratio is desired
		}

		.reflection-actions {
			display: flex;
			justify-content: space-between; // Space out buttons
			margin-top: 20px;
			flex-wrap: wrap; // Allow buttons to wrap
			gap: 10px;

			button {
				display: inline-flex; // Align icon and text
				align-items: center;
				gap: 5px; // Space between icon and text
			}
		}

		// Style the spinner inside the button
		button mat-spinner {
			display: inline-block;
			margin-right: 8px;
			vertical-align: middle; // Align spinner vertically
		}
	`,
	changeDetection: ChangeDetectionStrategy.OnPush, // Use OnPush for performance with signals
})
export class ReflectionGeneratorComponent {
	// --- Inject Dependencies ---
	#aiService = inject(AiService);
	#snackBar = inject(MatSnackBar);

	// --- Component State Signals ---
	nivelSeleccionado = signal<string>('');
	gradoSeleccionado = signal<string>('');
	formatoSeleccionado = signal<string>('');
	tonoSeleccionado = signal<string>('');
	temaSeleccionado = signal<string>('');
	temaPersonalizado = signal<string>('');
	reflexionGenerada = signal<string>('');
	estaGenerando = signal<boolean>(false);
	mostrarReflexion = signal<boolean>(false);

	// --- Configuration Data ---
	readonly niveles = ['Primaria', 'Secundaria'];
	readonly gradosPrimaria = ['1ro', '2do', '3ro', '4to', '5to', '6to'];
	readonly gradosSecundaria = ['1ro', '2do', '3ro', '4to', '5to', '6to'];
	readonly formato = ['Anécdota', 'Exhortación', 'Frase para analizar'];
	readonly tono = ['Inspirador', 'Amigable', 'Experiencial', 'Informativo'];
	readonly temasPredefinidos = signal<string[]>([
		'Gratitud',
		'Resiliencia',
		'Amistad',
		'Responsabilidad',
		'Empatía',
		'Manejo de emociones',
		'Otro', // Option for custom theme
	]);

	// --- Computed Signals ---
	// Determine available grades based on selected level
	gradosDisponibles = computed(() => {
		switch (this.nivelSeleccionado()) {
			case 'Primaria':
				return this.gradosPrimaria;
			case 'Secundaria':
				return this.gradosSecundaria;
			default:
				return [];
		}
	});

	// Determine the final theme to use (predefined or custom)
	temaFinal = computed(() => {
		return this.temaSeleccionado() === 'Otro'
			? this.temaPersonalizado().trim()
			: this.temaSeleccionado();
	});

	// Check if the form is valid for generation
	esFormularioValido = computed(() => {
		return (
			this.nivelSeleccionado() &&
			this.gradoSeleccionado() &&
			this.temaFinal() &&
			this.tonoSeleccionado() &&
			this.formatoSeleccionado() &&
			!this.estaGenerando() // Prevent generation while already generating
		);
	});

	// --- Methods ---

	/**
	 * Generates the daily reflection by calling the AI service.
	 */
	async generarReflexion(): Promise<void> {
		if (!this.esFormularioValido()) return; // Double check validity

		this.estaGenerando.set(true);
		this.reflexionGenerada.set(''); // Clear previous reflection
		this.mostrarReflexion.set(false); // Hide reflection view initially

		// Construct the prompt for the AI
		const prompt = `Eres un asistente educativo especializado en crear contenido pedagógico.
      Por favor, genera una reflexión diaria significativa para un grupo de estudiantes de ${this.nivelSeleccionado()}
      de ${this.gradoSeleccionado()} grado sobre el tema "${this.temaFinal()}" con un tono ${this.tonoSeleccionado()} en formato de ${this.formatoSeleccionado()}.
      La reflexión debe ser apropiada para su edad (entre ${this.#edadAproximada(this.nivelSeleccionado(), this.gradoSeleccionado())} años),
      fomentar el pensamiento crítico, la introspección y valores positivos.
      Debe ser concisa, clara y fácil de entender. No incluyas saludos ni despedidas, solo el texto de la reflexión.
      Utiliza español neutro o latinoamericano. Evita dirigirte directamente al público, prefiere una narrativa impersonal y/o en tercera persona.`;

		this.#aiService.geminiAi(prompt).subscribe({
			next: (res) => {
				this.reflexionGenerada.set(
					res.response || 'No se pudo generar la reflexión.',
				); // Set reflection or default message
				this.mostrarReflexion.set(true); // Show the reflection view
			},
			error: (err) => {
				console.error('Error generating reflection:', err);
				this.reflexionGenerada.set(
					'Ocurrió un error al generar la reflexión. Por favor, inténtalo de nuevo.',
				);
				this.mostrarReflexion.set(true); // Show error message in the reflection area
				this.#snackBar.open(
					'Error al contactar el servicio de IA',
					'Cerrar',
					{ duration: 5000 },
				);
			},
			complete: () => {
				this.estaGenerando.set(false); // Stop loading indicator
			},
		});
	}

	/**
	 * Resets the form and hides the reflection view.
	 */
	volver(): void {
		this.nivelSeleccionado.set('');
		this.gradoSeleccionado.set('');
		this.temaSeleccionado.set('');
		this.formatoSeleccionado.set('');
		this.tonoSeleccionado.set('');
		this.temaPersonalizado.set('');
		this.reflexionGenerada.set('');
		this.mostrarReflexion.set(false);
		this.estaGenerando.set(false); // Ensure loading is stopped
	}

	/**
	 * Downloads the generated reflection as a DOCX file.
	 */
	descargarDocx(): void {
		const reflexion = this.reflexionGenerada();
		if (!reflexion) return;

		// Sanitize filename
		const nivel = this.nivelSeleccionado().replace(/[^a-z0-9]/gi, '_');
		const grado = this.gradoSeleccionado().replace(/[^a-z0-9]/gi, '_');
		const tema = this.temaFinal()
			.substring(0, 20)
			.replace(/[^a-z0-9]/gi, '_'); // Limit length and sanitize
		const filename = `Reflexion_${nivel}_${grado}_${tema || 'Personalizado'}.docx`;

		// Create paragraphs, splitting by newline characters
		const paragraphs = reflexion.split('\n').map(
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
					children: paragraphs,
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

	/**
	 * Provides an approximate age range based on level and grade for the prompt.
	 * @param nivel - Selected level ('Primaria' or 'Secundaria')
	 * @param grado - Selected grade ('1ro', '2do', etc.)
	 * @returns A string representing the approximate age range (e.g., "6-7").
	 */
	#edadAproximada(nivel: string, grado: string): string {
		const gradoNum = parseInt(grado.charAt(0), 10);
		if (isNaN(gradoNum)) return 'edad apropiada'; // Fallback

		if (nivel === 'Primaria') {
			// Approx ages: 1ro=6, 2do=7, 3ro=8, 4to=9, 5to=10, 6to=11
			return `${5 + gradoNum}-${6 + gradoNum}`;
		} else if (nivel === 'Secundaria') {
			// Approx ages: 1ro=12, 2do=13, 3ro=14, 4to=15, 5to=16, 6to=17
			return `${11 + gradoNum}-${12 + gradoNum}`;
		}
		return 'edad apropiada'; // Fallback
	}
}
