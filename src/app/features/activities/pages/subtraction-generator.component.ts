import { Component, OnInit, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatRadioModule } from '@angular/material/radio';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';
import { PdfService } from '../../../core/services/pdf.service';
import { shuffle } from 'lodash';
import { formatNumber } from '@angular/common';

@Component({
	selector: 'app-subtraction',
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
		MatRadioModule,
	],
	template: `
		<mat-card style="margin-bottom: 24px">
			<mat-card-header>
				<h2 mat-card-title>Generador de Ejercicios de Resta</h2>
			</mat-card-header>
			<mat-card-content>
				<form
					[formGroup]="subtractionsForm"
					(ngSubmit)="generateSubtractions()"
				>
					<div style="display: flex">
						<div style="min-width: 20%; padding-right: 8px">
							<mat-form-field appearance="outline">
								<mat-label>T&iacute;tulo</mat-label>
								<input
									type="text"
									formControlName="title"
									matInput
								/>
							</mat-form-field>
						</div>
						<div
							style="
								min-width: 20%;
								padding-left: 8px;
								padding-right: 8px;
							"
						>
							<mat-form-field appearance="outline">
								<mat-label>Orientaci&oacute;n</mat-label>
								<mat-select formControlName="orientation">
									<mat-option value="vertical"
										>Vertical</mat-option
									>
									<mat-option value="horizontal"
										>Horizontal</mat-option
									>
								</mat-select>
							</mat-form-field>
						</div>
						<div
							style="
								min-width: 20%;
								padding-left: 8px;
								padding-right: 8px;
							"
						>
							<mat-label>Tipo de Resta</mat-label>
							<div>
								<mat-radio-group
									formControlName="subtractionType"
									aria-label="Selecciona un Tipo de Resta"
								>
									<mat-radio-button value="unsigned"
										>Resta Natural</mat-radio-button
									>
									<mat-radio-button value="signed"
										>Resta Entera</mat-radio-button
									>
								</mat-radio-group>
							</div>
						</div>
						<div
							style="
								min-width: 20%;
								padding-left: 8px;
								padding-right: 8px;
							"
						>
							<mat-label>Resultados</mat-label>
							<div>
								<mat-radio-group
									formControlName="results"
									aria-label="Selecciona un Tipo de Resta"
								>
									<mat-radio-button value="positive"
										>Positivos</mat-radio-button
									>
									<mat-radio-button value="any"
										>Cualquiera</mat-radio-button
									>
								</mat-radio-group>
							</div>
						</div>
						<div style="min-width: 20%; padding-left: 8px">
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
					<div style="display: flex; margin-top: 12px">
						<div style="min-width: 25%; padding-right: 8px">
							<mat-form-field appearance="outline">
								<mat-label>Cantidad de Sustraendos</mat-label>
								<input
									type="number"
									formControlName="subtrahendQty"
									matInput
								/>
							</mat-form-field>
						</div>
						<div
							style="
								min-width: 25%;
								padding-left: 8px;
								padding-right: 8px;
							"
						>
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
						<div
							style="
								min-width: 25%;
								padding-left: 8px;
								padding-right: 8px;
							"
						>
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
						<div style="min-width: 25%; padding-left: 8px">
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
					</div>
					@if (subtractions.length) {
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
					@if (subtractions.length) {
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
						[disabled]="subtractionsForm.invalid"
						type="submit"
						mat-raised-button
						color="primary"
					>
						{{ subtractions.length ? 'Regenerar' : 'Generar' }}
					</button>
				</form>
			</mat-card-content>
		</mat-card>

		@if (subtractions.length) {
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
							id="subtractions"
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
									Calcula las Siguientes Sumas
								</h5>
							</div>
							<br />
							<div style="margin-bottom: 42px; display: flex">
								@if (
									subtractionsForm.get('name')?.value === true
								) {
									<div><b>Nombre</b>:</div>
									<div class="blank"></div>
								}
								@if (
									subtractionsForm.get('grade')?.value ===
									true
								) {
									<div style="margin-left: 12px">
										<b>Grado</b>:
									</div>
									<div class="blank"></div>
								}
								@if (
									subtractionsForm.get('date')?.value === true
								) {
									<div style="margin-left: 12px">
										<b>Fecha</b>:
									</div>
									<div
										style="max-width: 20%"
										class="blank"
									></div>
								}
							</div>
							<div
								style="
									display: grid;
									grid-template-columns: repeat(2, 1fr);
									gap: 16px;
									justify-content: space-between;
								"
							>
								@for (line of subtractions; track $index) {
									@if (orientation === 'horizontal') {
										<div
											(click)="changeSustrahend($index)"
											style="
												margin-left: 12px;
												width: 50%;
												min-width: fit-content;
											"
										>
											<b>
												{{
													($index + 1)
														.toString()
														.padStart(2, '0')
												}})
												<span
													style="
														letter-spacing: 3px;
														font-family: serif;
													"
												>
													{{ line.join(' - ') }}
												</span> </b
											>=
										</div>
									} @else {
										<div
											style="display: flex; align-items: center"
											(click)="changeSustrahend($index)"
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
																>-</span
															>
														}
														{{ n }}
													</div>
												}
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
							id="subtractions-solution"
							style="padding: 12px"
						>
							<div
								style="text-align: center; margin-bottom: 24px"
							>
								<h4 style="margin-bottom: 0">
									Calcula las Siguientes Sumas
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
								@for (line of subtractions; track $index) {
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
														line.join(' - ')
													}}</span
												></b
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
export class SubtractionGeneratorComponent implements OnInit {
	fb = inject(FormBuilder);
	UserService = inject(UserService);
	pdfService = inject(PdfService);
	sb = inject(MatSnackBar);

	teacherName = '';
	schoolName = '';
	subtractions: number[][] = [];

	subtractionsForm = this.fb.group({
		title: ['Resta'],
		subtractionType: ['unsigned'],
		subtrahendQty: [2, Validators.min(2)],
		orientation: ['vertical'],
		results: ['positive'],
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

	generateNumber(min: number, max: number): number {
		const digits =
			min === max ? min : Math.round(Math.random() * (max - min)) + min;
		let str =
			this.subtractionsForm.get('subtractionType')?.value === 'signed'
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

	generateSubtractions() {
		const { subtrahendQty, minDigits, maxDigits, size } =
			this.subtractionsForm.value;

		if (!subtrahendQty || !minDigits || !maxDigits || !size) return;

		this.subtractions = [];

		for (let i = 0; i < size; i++) {
			const subtraction: number[] = [];
			for (let j = 0; j < subtrahendQty; j++) {
				subtraction.push(this.generateNumber(minDigits, maxDigits));
			}
			if (this.subtractionsForm.get('results')?.value === 'positive') {
				subtraction.sort((a, b) => b - a);
			}
			this.subtractions.push(subtraction);
		}
	}

	toggleName() {
		const val = this.subtractionsForm.get('name')?.value;
		if (!val) {
			this.subtractionsForm.get('name')?.setValue(true);
		} else {
			this.subtractionsForm.get('name')?.setValue(false);
		}
	}

	toggleGrade() {
		const val = this.subtractionsForm.get('grade')?.value;
		if (!val) {
			this.subtractionsForm.get('grade')?.setValue(true);
		} else {
			this.subtractionsForm.get('grade')?.setValue(false);
		}
	}

	toggleDate() {
		const val = this.subtractionsForm.get('date')?.value;
		if (!val) {
			this.subtractionsForm.get('date')?.setValue(true);
		} else {
			this.subtractionsForm.get('date')?.setValue(false);
		}
	}

	changeSustrahend(index: number) {
		const { subtrahendQty, minDigits, maxDigits, size } =
			this.subtractionsForm.value;

		if (!subtrahendQty || !minDigits || !maxDigits || !size) return;

		const subtraction: number[] = [];
		for (let j = 0; j < subtrahendQty; j++) {
			subtraction.push(this.generateNumber(minDigits, maxDigits));
		}

		if (this.subtractionsForm.get('results')?.value === 'positive') {
			subtraction.sort((a, b) => b - a);
		}
		this.subtractions[index] = subtraction;
	}

	calculate(arr: number[]) {
		let result = arr[0] - arr[1];

		for (let i = 2; i < arr.length; i++) {
			result -= arr[i];
		}

		return formatNumber(result, 'en');
	}

	print() {
		this.sb.open(
			'Imprimiendo como PDF!, por favor espera un momento.',
			undefined,
			{ duration: 5000 },
		);
		const title = this.subtractionsForm.get('title')?.value || '';
		this.pdfService.createAndDownloadFromHTML('subtractions', `${title}`);
		this.pdfService.createAndDownloadFromHTML(
			'subtractions-solution',
			`${title} - Solucion`,
		);
	}

	get orientation(): string {
		return this.subtractionsForm.get('orientation')?.value || 'horizontal';
	}
}
