import { Component, importProvidersFrom, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UserService } from '../../../core/services/user.service';
import { PdfService } from '../../../core/services/pdf.service';

@Component({
	selector: 'app-equations',
	imports: [
		ReactiveFormsModule,
		MatCardModule,
		MatButtonModule,
		MatIconModule,
		MatSelectModule,
		MatFormFieldModule,
		MatInputModule,
		MatSnackBarModule,
		MatSliderModule,
		MatChipsModule,
	],
	template: `
		<mat-card>
			<mat-card-header>
				<h2>Generador de Ecuaciones</h2>
			</mat-card-header>
			<mat-card-content>
				<form
					[formGroup]="exerciseForm"
					(ngSubmit)="generateExercises()"
				>
					<div>
						<mat-form-field appearance="outline">
							<mat-label>T&iacute;tulo</mat-label>
							<input formControlName="title" matInput />
						</mat-form-field>
					</div>

					<div>
						<mat-form-field appearance="outline">
							<mat-label>Tipo de ecuación</mat-label>
							<mat-select formControlName="equationType">
								<mat-option value="linear">Lineal</mat-option>
								<mat-option value="quadratic"
									>Cuadrática</mat-option
								>
							</mat-select>
						</mat-form-field>
					</div>

					<div>
						<mat-form-field appearance="outline">
							<mat-label for="difficulty"
								>Nivel de dificultad</mat-label
							>
							<mat-select
								id="difficulty"
								formControlName="difficulty"
							>
								<mat-option value="basic">Básico</mat-option>
								<mat-option value="intermediate"
									>Intermedio</mat-option
								>
								<mat-option value="advanced"
									>Avanzado</mat-option
								>
							</mat-select>
						</mat-form-field>
					</div>

					<div>
						<mat-form-field appearance="outline">
							<mat-label for="numExercises"
								>Número de ejercicios</mat-label
							>
							<input
								matInput
								type="number"
								id="numExercises"
								formControlName="numExercises"
								min="1"
								max="20"
							/>
						</mat-form-field>
					</div>

					<div>
						<mat-label for="valueRange">Rango de valores</mat-label>
						<div>
							<mat-slider min="-100" max="100" step="1" discrete>
								<input
									formControlName="valueRangeMin"
									matSliderStartThumb
								/>
								<input
									formControlName="valueRangeMax"
									matSliderEndThumb
								/>
							</mat-slider>
						</div>
					</div>

					<div style="margin-bottom: 12px">
						<mat-label>Campos a Incluir:</mat-label>
						<mat-chip-set>
							<mat-chip-option
								[selected]="true"
								(selectionChange)="toggleName()"
								>Nombre</mat-chip-option
							>
							<mat-chip-option
								[selected]="true"
								(selectionChange)="toggleGrade()"
								>Grado</mat-chip-option
							>
							<mat-chip-option
								[selected]="true"
								(selectionChange)="toggleDate()"
								>Fecha</mat-chip-option
							>
						</mat-chip-set>
					</div>
					@if (exercises.length) {
						<div
							style="
								padding: 20px;
								background-color: #46a7f5;
								color: white;
								margin-bottom: 15px;
							"
						>
							Para reemplazar cualquiera de los ejercicios
							generados, haz click sobre &eacute;l.
						</div>
						<button
							mat-raised-button
							style="margin-right: 12px"
							(click)="print()"
							color="accent"
							type="button"
						>
							Imprimir
						</button>
					}

					<button
						mat-raised-button
						color="primary"
						[disabled]="exerciseForm.invalid"
						type="submit"
					>
						Generar Ejercicios
					</button>
				</form>
			</mat-card-content>
		</mat-card>

		@if (exercises.length > 0) {
			<div
				style="
					display: grid;
					grid-template-columns: 1fr 1fr;
					gap: 24px;
					margin-top: 24px;
				"
			>
				<mat-card>
					<mat-card-content>
						<div class="page" id="equations" style="padding: 12px">
							<div style="text-align: center">
								<h3
									style="
										margin-bottom: 0;
										font-weight: bold;
										font-size: large;
									"
								>
									{{ schoolName }}
								</h3>
								<h4 style="margin-bottom: 0">
									{{ teacherName }}
								</h4>
								<h5
									style="font-size: medium; margin-bottom: 24px"
								>
									{{ exerciseForm.get('title')?.value }}
								</h5>
							</div>
							<br />
							<div style="margin-bottom: 42px; display: flex">
								@if (exerciseForm.get('name')?.value === true) {
									<div><b>Nombre</b>:</div>
									<div class="blank"></div>
								}
								@if (
									exerciseForm.get('grade')?.value === true
								) {
									<div style="margin-left: 12px">
										<b>Grado</b>:
									</div>
									<div class="blank"></div>
								}
								@if (exerciseForm.get('date')?.value === true) {
									<div style="margin-left: 12px">
										<b>Fecha</b>:
									</div>
									<div
										style="max-width: 25%"
										class="blank"
									></div>
								}
							</div>
							<div
								style="
									display: grid;
									grid-template-columns: repeat(2, 1fr);
									gap: 42px;
								"
							>
								@for (line of exercises; track $index) {
									<div
										style="
											display: flex;
											gap: 12px;
											align-items: center;
										"
										(click)="changeEquation($index)"
									>
										<b
											>{{
												($index + 1)
													.toString()
													.padStart(2, '0')
											}})</b
										>
										<div [innerHTML]="line"></div>
									</div>
								}
							</div>
						</div>
					</mat-card-content>
				</mat-card>
				<mat-card style="display: none">
					<mat-card-content>
						<div
							class="page"
							id="equations-solution"
							style="padding: 12px"
						>
							<div
								style="text-align: center; margin-bottom: 24px"
							>
								<h4 style="margin-bottom: 0">
									{{ exerciseForm.get('title')?.value }}
								</h4>
								<h5
									style="font-size: medium; margin-bottom: 24px"
								>
									Hoja de Respuestas
								</h5>
							</div>
							<div
								style="display: flex; flex-direction: column; gap: 16px"
							>
								@for (line of exercises; track $index) {
									<div
										style="
											display: flex;
											justify-content: space-between;
										"
									>
										<div style="margin-left: 12px">
											<b
												>{{
													($index + 1)
														.toString()
														.padStart(2, '0')
												}})
												<span
													style="
														letter-spacing: 3px;
														font-family: serif;
													"
													>{{ line }}</span
												></b
											>=
										</div>
										<div
											style="
												max-width: 50%;
												margin-left: auto;
												text-align: start;
											"
											class="blank"
										>
											{{ calculate(line) }}
										</div>
									</div>
								}
							</div>
						</div>
					</mat-card-content>
				</mat-card>
			</div>
		}
	`,
	styles: `
		mat-form-field,
		mat-slider {
			width: 100%;
		}

		@media screen and (min-width: 1200px) {
			mat-form-field,
			mat-slider {
				width: 60%;
			}
		}

		.board {
			display: flex;
			flex-direction: column;
			width: fit-content;
			margin: 0 auto;
		}

		.line {
			display: flex;
		}

		.tile {
			border: 1px solid #aaa;
			display: flex;
			align-items: center;
			justify-content: center;
			min-width: 40px;
			aspect-ratio: 1/1;
			height: auto;
			text-transform: uppercase;
		}

		table {
			border-collapse: collapse;
			width: min-content;

			td {
				border: 1px solid black;
				padding: 12px 16px;
				width: fit-content;
				text-transform: uppercase;
			}
		}

		.blank {
			border-bottom: 1px solid black;
			flex: 1 1 auto;
			width: 100%;
		}

		.page {
			width: 8in;
			margin: 0 auto;
		}

		* {
			box-sizing: border-box;
		}
	`,
})
export class EquationsGeneratorComponent implements OnInit {
	fb = inject(FormBuilder);
	UserService = inject(UserService);
	pdfService = inject(PdfService);
	sb = inject(MatSnackBar);

	teacherName = '';
	schoolName = '';
	exercises: string[] = [];

	exerciseForm: FormGroup = this.fb.group({
		title: ['Resuelve estas ecuaciones'],
		equationType: ['linear'],
		difficulty: ['basic'],
		numExercises: [10],
		valueRangeMin: [-10],
		valueRangeMax: [10],
		name: [false],
		grade: [false],
		date: [false],
	});

	constructor() {}

	ngOnInit(): void {
		this.UserService.getSettings().subscribe((settings) => {
			this.teacherName = `${settings.title}. ${settings.firstname} ${settings.lastname}`;
			// this.schoolName = settings.schoolName;
		});
	}

	generateExercises(): void {
		const formValues = this.exerciseForm.value;
		this.exercises = this.createExercises(formValues);
	}

	createExercises(formValues: any): string[] {
		const exercises: string[] = [];
		const numExercises = formValues.numExercises;
		const minValue = formValues.valueRangeMin;
		const maxValue = formValues.valueRangeMax;

		for (let i = 0; i < numExercises; i++) {
			let equation = '';
			switch (formValues.equationType) {
				case 'linear':
					const m = this.getRandomInt(minValue, maxValue);
					const b = this.getRandomInt(minValue, maxValue);
					equation = `y = ${m}x + ${b}`;
					break;
				case 'quadratic':
					const a = this.getRandomInt(minValue, maxValue);
					const bQuad = this.getRandomInt(minValue, maxValue);
					const c = this.getRandomInt(minValue, maxValue);
					equation = `${a}x<sup>2</sup> + ${bQuad}x + ${c} = 0`;
					break;
				// Agrega más casos para otros tipos de ecuaciones
			}
			exercises.push(equation);
		}

		return exercises;
	}

	getRandomInt(min: number, max: number): number {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	toggleName() {
		const val = this.exerciseForm.get('name')?.value;
		if (!val) {
			this.exerciseForm.get('name')?.setValue(true);
		} else {
			this.exerciseForm.get('name')?.setValue(false);
		}
	}

	toggleGrade() {
		const val = this.exerciseForm.get('grade')?.value;
		if (!val) {
			this.exerciseForm.get('grade')?.setValue(true);
		} else {
			this.exerciseForm.get('grade')?.setValue(false);
		}
	}

	toggleDate() {
		const val = this.exerciseForm.get('date')?.value;
		if (!val) {
			this.exerciseForm.get('date')?.setValue(true);
		} else {
			this.exerciseForm.get('date')?.setValue(false);
		}
	}

	changeEquation(index: number) {
		const { valueRangeMin, valueRangeMax, equationType } =
			this.exerciseForm.value;

		if (!valueRangeMin || !valueRangeMax || !equationType) return;

		const config = {
			numExercises: 1,
			valueRangeMin,
			valueRangeMax,
			equationType,
		};
		const exercise = this.createExercises(config);
		this.exercises[index] = exercise[0];
	}

	calculate(exercise: string) {
		return '';
	}

	print() {
		const linear = this.exerciseForm.get('equationType')?.value;
		this.sb.open(
			'Imprimiendo como PDF!, por favor espera un momento.',
			undefined,
			{ duration: 5000 },
		);
		const title =
			this.exerciseForm.get('title')?.value ||
			`Ecuaciones ${linear ? 'Lineales' : 'Cuatraticas'}`;
		this.pdfService.createAndDownloadFromHTML('equations', `${title}`);
		// this.pdfService.createAndDownloadFromHTML("equations-solution", `${title} - Solución`);
	}
}
