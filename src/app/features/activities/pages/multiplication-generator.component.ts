import { Component, OnInit, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';
import { PdfService } from '../../../core/services/pdf.service';
import { shuffle } from 'lodash';
import { formatNumber } from '@angular/common';

@Component({
	selector: 'app-multiplication',
	imports: [
		MatCardModule,
		MatButtonModule,
		MatListModule,
		MatSelectModule,
		MatFormFieldModule,
		MatInputModule,
		MatChipsModule,
		ReactiveFormsModule,
		MatSnackBarModule,
	],
	template: `
		<mat-card style="margin-bottom: 24px">
			<mat-card-header>
				<h2>
					Generador de Ejercicios de Multiplicaci&oacute;n
				</h2>
			</mat-card-header>
			<mat-card-content>
				<form
					[formGroup]="multiplicationsForm"
					(ngSubmit)="generateMultiplications()"
				>
					<div style="display: flex; gap: 16px">
						<div style="max-width: 25%; flex: 1 1 auto">
							<mat-form-field appearance="outline">
								<mat-label>T&iacute;tulo</mat-label>
								<input
									type="text"
									formControlName="title"
									matInput
								/>
							</mat-form-field>
						</div>
						<div style="max-width: 25%; flex: 1 1 auto">
							<mat-form-field appearance="outline">
								<mat-label>Conjunto Num&eacute;rico</mat-label>
								<mat-select formControlName="numericalSet">
									<mat-option value="natural"
										>Naturales</mat-option
									>
									<mat-option value="integer"
										>Enteros</mat-option
									>
								</mat-select>
							</mat-form-field>
						</div>
						<div style="max-width: 25%; flex: 1 1 auto">
							<mat-form-field appearance="outline">
								<mat-label>Orientaci&oacute;n</mat-label>
								<mat-select formControlName="orientation">
									<mat-option value="horizontal"
										>Horizontal</mat-option
									>
									<mat-option value="vertical"
										>Vertical</mat-option
									>
								</mat-select>
							</mat-form-field>
						</div>
						<div style="max-width: 25%; flex: 1 1 auto">
							<mat-form-field appearance="outline">
								<mat-label>Cantidad de Factores</mat-label>
								<input
									type="number"
									formControlName="addends"
									matInput
								/>
							</mat-form-field>
						</div>
					</div>
					<div style="display: flex; gap: 16px">
						<div style="max-width: 25%; flex: 1 1 auto">
							<mat-form-field appearance="outline">
								<mat-label
									>Cantidad de D&iacute;gitos
									(m&iacute;nimo)</mat-label
								>
								<input
									type="number"
									formControlName="minDigits"
									min="2"
									matInput
								/>
							</mat-form-field>
						</div>
						<div style="max-width: 25%; flex: 1 1 auto">
							<mat-form-field appearance="outline">
								<mat-label
									>Cantidad de D&iacute;gitos
									(m&aacute;ximo)</mat-label
								>
								<input
									type="number"
									formControlName="maxDigits"
									min="2"
									matInput
								/>
							</mat-form-field>
						</div>
						<div style="max-width: 25%; flex: 1 1 auto">
							<mat-form-field appearance="outline">
								<mat-label>Cantidad de Ejercicios</mat-label>
								<input
									matInput
									formControlName="size"
									type="number"
									min="1"
									max="25"
								/>
							</mat-form-field>
						</div>
						<div style="max-width: 25%; flex: 1 1 auto">
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
					</div>
					@if (multiplications.length) {
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
					}
					@if (multiplications.length) {
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
					<button
						[disabled]="multiplicationsForm.invalid"
						type="submit"
						mat-raised-button
						color="primary"
					>
						{{ multiplications.length ? 'Regenerar' : 'Generar' }}
					</button>
				</form>
			</mat-card-content>
		</mat-card>

		@if (multiplications.length) {
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
						<div
							class="page"
							id="multiplications"
							style="padding: 12px"
						>
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
									{{
										multiplicationsForm.get('title')?.value
									}}
								</h5>
							</div>
							<br />
							<div style="margin-bottom: 42px; display: flex">
								@if (
									multiplicationsForm.get('name')?.value ===
									true
								) {
									<div><b>Nombre</b>:</div>
									<div class="blank"></div>
								}
								@if (
									multiplicationsForm.get('grade')?.value ===
									true
								) {
									<div style="margin-left: 12px">
										<b>Grado</b>:
									</div>
									<div class="blank"></div>
								}
								@if (
									multiplicationsForm.get('date')?.value ===
									true
								) {
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
									gap: 16px;
								"
							>
								@for (line of multiplications; track $index) {
									@if (
										multiplicationsForm.get('orientation')
											?.value === 'vertical'
									) {
										<div
											style="display: flex; align-items: center"
											(click)="changeFactor($index)"
										>
											<div>
												<b
													>{{
														($index + 1)
															.toString()
															.padStart(2, '0')
													}})</b
												>
											</div>
											<div
												style="
													border-bottom: 1px solid black;
													margin-left: 12px;
													letter-spacing: 3px;
													font-family: serif;
												"
											>
												@for (n of line; track $index) {
													<div
														style="text-align: right"
													>
														@if (
															$index ===
															line.length - 1
														) {
															<span
																style="
																	display: inline-block;
																	margin-right: auto;
																"
																>&times;</span
															>
														}
														{{ n }}
													</div>
												}
											</div>
										</div>
									} @else {
										<div
											style="
												display: flex;
												justify-content: space-between;
											"
										>
											<div
												(click)="changeFactor($index)"
												style="margin-left: 12px"
											>
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
														>{{
															line.join(' × ')
														}}</span
													></b
												>=
											</div>
										</div>
									}
								}
							</div>
						</div>
					</mat-card-content>
				</mat-card>
				<mat-card>
					<mat-card-content>
						<div
							class="page"
							id="multiplications-solution"
							style="padding: 12px"
						>
							<div
								style="text-align: center; margin-bottom: 24px"
							>
								<h4 style="margin-bottom: 0">
									{{
										multiplicationsForm.get('title')?.value
									}}
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
								@for (line of multiplications; track $index) {
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
													>{{
														line.join(' × ')
													}}</span
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
export class MultiplicationGeneratorComponent implements OnInit {
	fb = inject(FormBuilder);
	UserService = inject(UserService);
	pdfService = inject(PdfService);
	sb = inject(MatSnackBar);

	teacherName = '';
	schoolName = '';
	multiplications: number[][] = [];

	multiplicationsForm = this.fb.group({
		title: ['Multiplicación'],
		numericalSet: ['natural'],
		orientation: ['horizontal'],
		addends: [2, Validators.min(2)],
		minDigits: [2],
		maxDigits: [2],
		size: [10],
		name: [false],
		grade: [false],
		date: [false],
	});

	ngOnInit() {
		this.UserService.getSettings().subscribe((settings) => {
			this.teacherName = `${settings.title}. ${settings.firstname} ${settings.lastname}`;
			// this.schoolName = settings.schoolName;
		});
	}

	generateFactor(min: number, max: number): number {
		const digits =
			min === max ? min : Math.round(Math.random() * (max - min)) + min;
		let str =
			this.multiplicationsForm.get('numericalSet')?.value === 'integer'
				? Math.round(Math.random())
					? ''
					: '-'
				: '';

		for (let i = 0; i < digits; i++) {
			if (i === 0) {
				str += shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9])[0];
			} else {
				str += shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 0])[0];
			}
		}

		return parseInt(str);
	}

	generateMultiplications() {
		const { addends, minDigits, maxDigits, size } =
			this.multiplicationsForm.value;

		if (!addends || !minDigits || !maxDigits || !size) return;

		this.multiplications = [];

		for (let i = 0; i < size; i++) {
			const multiplication: number[] = [];
			const addendQty = Math.round(Math.random() * addends) + 2;
			for (let j = 0; j < addends; j++) {
				multiplication.push(this.generateFactor(minDigits, maxDigits));
			}
			this.multiplications.push(multiplication);
		}
	}

	toggleName() {
		const val = this.multiplicationsForm.get('name')?.value;
		if (!val) {
			this.multiplicationsForm.get('name')?.setValue(true);
		} else {
			this.multiplicationsForm.get('name')?.setValue(false);
		}
	}

	toggleGrade() {
		const val = this.multiplicationsForm.get('grade')?.value;
		if (!val) {
			this.multiplicationsForm.get('grade')?.setValue(true);
		} else {
			this.multiplicationsForm.get('grade')?.setValue(false);
		}
	}

	toggleDate() {
		const val = this.multiplicationsForm.get('date')?.value;
		if (!val) {
			this.multiplicationsForm.get('date')?.setValue(true);
		} else {
			this.multiplicationsForm.get('date')?.setValue(false);
		}
	}

	changeFactor(index: number) {
		const { addends, minDigits, maxDigits, size } =
			this.multiplicationsForm.value;

		if (!addends || !minDigits || !maxDigits || !size) return;

		const multiplication: number[] = [];
		for (let j = 0; j < addends; j++) {
			multiplication.push(this.generateFactor(minDigits, maxDigits));
		}

		this.multiplications[index] = multiplication;
	}

	calculate(arr: number[]) {
		return formatNumber(
			arr.reduce((p, c) => c * p, 1),
			'en',
		);
	}

	print() {
		this.sb.open(
			'Imprimiendo como PDF!, por favor espera un momento.',
			undefined,
			{ duration: 5000 },
		);
		const title =
			this.multiplicationsForm.get('title')?.value || 'Multiplicación';
		this.pdfService.createAndDownloadFromHTML(
			'multiplications',
			`${title}`,
		);
		this.pdfService.createAndDownloadFromHTML(
			'multiplications-solution',
			`${title} - Solución`,
		);
	}
}
