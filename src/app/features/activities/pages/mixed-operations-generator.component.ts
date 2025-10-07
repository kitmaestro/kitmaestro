import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MathExerciseComponent } from '../../../shared/ui/math-exercise.component';
import { AuthService } from '../../../core/services/auth.service';
import { PdfService } from '../../../core/services/pdf.service';

export type MathOperationType =
	| 'addition'
	| 'subtraction'
	| 'multiplication'
	| 'division';

export interface MathOperation {
	type: MathOperationType;
	operands: number[];
}

export interface MathExercise {
	operations: MathOperation[];
}

@Component({
	selector: 'app-mixed-operations',
	imports: [
		MatCardModule,
		MatInputModule,
		MatChipsModule,
		MatButtonModule,
		MatSelectModule,
		MatSnackBarModule,
		MatFormFieldModule,
		ReactiveFormsModule,
		MathExerciseComponent,
	],
	template: `
				<mat-card>
			<mat-card-header>
				<h2 mat-card-title>Generador de Operaciones Mixtas</h2>
			</mat-card-header>
			<mat-card-content>
				<div style="margin-top: 24px">
					<form [formGroup]="generatorForm" (ngSubmit)="onSubmit()">
						<div>
							<mat-form-field>
								<mat-label>Cant. de Ejercicios</mat-label>
								<input formControlName="size" type="text" matInput />
							</mat-form-field>
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
						<div>
							@if (exercises.length) {
								<button
									type="button"
									(click)="print()"
									style="margin-right: 12px"
									mat-raised-button
									color="accent"
								>
									Imprimir
								</button>
							}
							<button mat-flat-button type="submit">
								{{ exercises.length > 0 ? "Regenerar" : "Generar" }}
							</button>
						</div>
					</form>
				</div>
			</mat-card-content>
		</mat-card>

		@if (exercises.length) {
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
						<div class="page" id="exercises" style="padding: 12px">
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
								<h4 style="margin-bottom: 0">{{ teacherName }}</h4>
								<h5 style="font-size: medium; margin-bottom: 24px">
									Calcula las Siguientes Divisiones
								</h5>
							</div>
							<br />
							<div style="margin-bottom: 42px; display: flex">
								@if (generatorForm.get("name")?.value === true) {
									<div><b>Nombre</b>:</div>
									<div class="blank"></div>
								}
								@if (generatorForm.get("grade")?.value === true) {
									<div style="margin-left: 12px"><b>Grado</b>:</div>
									<div class="blank"></div>
								}
								@if (generatorForm.get("date")?.value === true) {
									<div style="margin-left: 12px"><b>Fecha</b>:</div>
									<div style="max-width: 20%" class="blank"></div>
								}
							</div>
							<div
								style="display: flex; flex-direction: column; gap: 16px"
							>
								@for (exercise of exercises; track $index) {
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
														.padStart(2, "0")
												}})
												<app-math-exercise
													[exercise]="exercise"
												/> </b
											>=
										</div>
										<div
											style="max-width: 50%; margin-left: auto"
											class="blank"
										></div>
									</div>
								}
							</div>
						</div>
					</mat-card-content>
				</mat-card>
				<mat-card style="display: none">
					<mat-card-content>
						<div class="page" id="exercises-solution" style="padding: 12px">
							<div style="text-align: center; margin-bottom: 24px">
								<h4 style="margin-bottom: 0">
									Calcula las Siguientes Sumas
								</h4>
								<h5 style="font-size: medium; margin-bottom: 24px">
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
														.padStart(2, "0")
												}})
												<app-math-exercise
													[exercise]="line" /></b
											>=
										</div>
										<div
											style="
												max-width: 50%;
												margin-left: auto;
												text-align: center;
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
				mat-form-field {
			width: 100%;
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

		mat-form-field {
			width: 100%;
		}

		* {
			box-sizing: border-box;
		}
	`,
})
export class MixedOperationsGeneratorComponent implements OnInit {
	private fb = inject(FormBuilder);
	private authService = inject(AuthService);
	private pdfService = inject(PdfService);
	private sb = inject(MatSnackBar);

	schoolName = '';
	teacherName = '';

	generatorForm = this.fb.group({
		digits: [2],
		size: [10],
		name: [false],
		grade: [false],
		date: [false],
	});
	exercises: MathExercise[] = [];

	ngOnInit() {
		this.authService.profile().subscribe((user) => {
			this.teacherName = `${user.title}. ${user.firstname} ${user.lastname}`;
		});
	}

	onSubmit() {
		const formData: any = this.generatorForm.value;
		this.exercises = this.generateMathExercises(formData.size);
	}

	generateMathExercises(n: number): MathExercise[] {
		const exercises: MathExercise[] = [];

		for (let i = 0; i < n; i++) {
			const exercise: MathExercise = {
				operations: [],
			};

			const numOperations = Math.floor(Math.random() * 4) + 2; // Generate 1 to 3 operations per exercise

			for (let j = 0; j < numOperations; j++) {
				const operation: MathOperation = {
					type: (
						[
							'addition',
							'subtraction',
							'multiplication',
							'division',
						] as MathOperationType[]
					)[Math.floor(Math.random() * 4)],
					operands: [],
				};

				const numOperands = Math.floor(Math.random() * 1) + 1; // Generate 2 to 4 operands per operation

				for (let k = 0; k < numOperands; k++) {
					operation.operands.push(
						Math.floor(Math.random() * 100) + 1,
					); // Generate random operands between 0 and 99
				}

				exercise.operations.push(operation);
			}

			exercises.push(exercise);
		}

		console.log(exercises);

		return exercises;
	}

	calculate(exercise: MathExercise): number {
		let result = 0;
		const operands: number[][] = exercise.operations.map((o) => o.operands);
		const operations = exercise.operations.flatMap((o) => o.type);

		operands.forEach((operand, i) => {
			for (const n of operand) {
				switch (operations[i]) {
					case 'addition':
						result = result + n;
						break;
					case 'subtraction':
						result = result - n;
						break;
					case 'multiplication':
						result = result === 0 ? n : result * n;
						break;
					case 'division':
						result = result === 0 ? n : n > 0 ? result / n : 0;
						break;
				}
			}
		});

		return result;
	}

	toggleName() {
		const val = this.generatorForm.get('name')?.value;
		if (!val) {
			this.generatorForm.get('name')?.setValue(true);
		} else {
			this.generatorForm.get('name')?.setValue(false);
		}
	}

	toggleGrade() {
		const val = this.generatorForm.get('grade')?.value;
		if (!val) {
			this.generatorForm.get('grade')?.setValue(true);
		} else {
			this.generatorForm.get('grade')?.setValue(false);
		}
	}

	toggleDate() {
		const val = this.generatorForm.get('date')?.value;
		if (!val) {
			this.generatorForm.get('date')?.setValue(true);
		} else {
			this.generatorForm.get('date')?.setValue(false);
		}
	}

	getOperatorSymbol(type: string): string {
		switch (type) {
			case 'addition':
				return '+';
			case 'subtraction':
				return '-';
			case 'multiplication':
				return '×';
			case 'division':
				return '÷';
			default:
				return '';
		}
	}

	print() {
		this.sb.open(
			'Imprimiendo como PDF!, por favor espera un momento.',
			undefined,
			{ duration: 5000 },
		);
		this.pdfService.createAndDownloadFromHTML(
			'exercises',
			`Ejercicios mixtos`,
		);
		this.pdfService.createAndDownloadFromHTML(
			'exercises-solution',
			`Ejercicios mixtos - Solucion`,
		);
	}
}
