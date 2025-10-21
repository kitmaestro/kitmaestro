import { Component, OnInit, inject } from '@angular/core';
import { formatNumber } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PdfService } from '../../../core/services/pdf.service';
import { shuffle } from 'lodash';
import { Store } from '@ngrx/store';
import { selectAuthUser } from '../../../store/auth/auth.selectors';

@Component({
	selector: 'app-addition',
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
		<div style="margin-bottom: 24px">
			<h2>Generador de Ejercicios de Suma</h2>
			<div>
				<form
					[formGroup]="additionsForm"
					(ngSubmit)="generateAdditions()"
				>
					<div style="display: flex; gap: 16px">
						<div style="min-width: 20%; flex: 1 1 auto;">
							<mat-form-field appearance="outline">
								<mat-label>Cantidad de Sumandos</mat-label>
								<input
									type="number"
									formControlName="addends"
									matInput
								/>
							</mat-form-field>
						</div>
						<div style="min-width: 20%; flex: 1 1 auto;">
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
						<div style="min-width: 20%; flex: 1 1 auto;">
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
						<div style="min-width: 20%; flex: 1 1 auto;">
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
					<div style="width: 100%; margin-bottom: 24px;">
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
					@if (additions.length) {
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
					<div style="display: flex; justify-content: flex-end;">
						@if (additions.length) {
							<button
								type="button"
								(click)="print()"
								style="margin-right: 12px"
								mat-button
							>
								Descargar PDF
							</button>
						}
						<button type="submit" mat-flat-button color="primary">
							{{ additions.length ? 'Regenerar' : 'Generar' }}
						</button>
					</div>
				</form>
			</div>
		</div>

		@if (additions.length) {
			<div
				style="
					display: grid;
					grid-template-columns: 1fr 1fr;
					gap: 24px;
					margin-top: 24px;
					padding-bottom: 42px;
				"
			>
				<mat-card>
					<mat-card-content>
						<div class="page" id="additions" style="padding: 12px">
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
									additionsForm.get('name')?.value === true
								) {
									<div><b>Nombre</b>:</div>
									<div class="blank"></div>
								}
								@if (
									additionsForm.get('grade')?.value === true
								) {
									<div style="margin-left: 12px">
										<b>Grado</b>:
									</div>
									<div class="blank"></div>
								}
								@if (
									additionsForm.get('date')?.value === true
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
								style="display: flex; flex-direction: column; gap: 16px"
							>
								@for (line of additions; track $index) {
									<div
										style="
											display: flex;
											justify-content: space-between;
										"
									>
										<div
											(click)="changeAddend($index)"
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
														line.join(' + ')
													}}</span
												></b
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
				<mat-card>
					<mat-card-content>
						<div
							class="page"
							id="additions-solution"
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
								@for (line of additions; track $index) {
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
														line.join(' + ')
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
export class AdditionGeneratorComponent implements OnInit {
	fb = inject(FormBuilder);
	#store = inject(Store);
	pdfService = inject(PdfService);
	sb = inject(MatSnackBar);

	teacherName = '';
	schoolName = '';
	additions: number[][] = [];

	additionsForm = this.fb.group({
		addends: [2, Validators.min(2)],
		minDigits: [2],
		maxDigits: [2],
		size: [10],
		name: [false],
		grade: [false],
		date: [false],
	});

	ngOnInit() {
		this.#store.select(selectAuthUser).subscribe((settings) => {
			if (!settings) return;
			this.teacherName = `${settings.title}. ${settings.firstname} ${settings.lastname}`;
			this.schoolName = settings.schoolName;
		});
	}

	generateAddend(min: number, max: number): number {
		const digits =
			min === max ? min : Math.round(Math.random() * (max - min)) + min;
		let str = '';

		for (let i = 0; i < digits; i++) {
			if (i === 0) {
				str += shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9])[0];
			} else {
				str += shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 0])[0];
			}
		}

		return parseInt(str);
	}

	generateAdditions() {
		const { addends, minDigits, maxDigits, size } =
			this.additionsForm.value;

		if (!addends || !minDigits || !maxDigits || !size) return;

		this.additions = [];

		for (let i = 0; i < size; i++) {
			const addition: number[] = [];
			const addendQty = Math.round(Math.random() * addends) + 2;
			for (let j = 0; j < addends; j++) {
				addition.push(this.generateAddend(minDigits, maxDigits));
			}
			this.additions.push(addition);
		}
	}

	toggleName() {
		const val = this.additionsForm.get('name')?.value;
		if (!val) {
			this.additionsForm.get('name')?.setValue(true);
		} else {
			this.additionsForm.get('name')?.setValue(false);
		}
	}

	toggleGrade() {
		const val = this.additionsForm.get('grade')?.value;
		if (!val) {
			this.additionsForm.get('grade')?.setValue(true);
		} else {
			this.additionsForm.get('grade')?.setValue(false);
		}
	}

	toggleDate() {
		const val = this.additionsForm.get('date')?.value;
		if (!val) {
			this.additionsForm.get('date')?.setValue(true);
		} else {
			this.additionsForm.get('date')?.setValue(false);
		}
	}

	changeAddend(index: number) {
		const { addends, minDigits, maxDigits, size } =
			this.additionsForm.value;

		if (!addends || !minDigits || !maxDigits || !size) return;

		const addition: number[] = [];
		for (let j = 0; j < addends; j++) {
			addition.push(this.generateAddend(minDigits, maxDigits));
		}

		this.additions[index] = addition;
	}

	calculate(arr: number[]) {
		return formatNumber(
			arr.reduce((p, c) => c + p, 0),
			'en',
		);
	}

	print() {
		this.sb.open(
			'Imprimiendo como PDF!, por favor espera un momento.',
			undefined,
			{ duration: 5000 },
		);
		this.pdfService.createAndDownloadFromHTML('additions', `Suma`);
		this.pdfService.createAndDownloadFromHTML(
			'additions-solution',
			`Suma - Solucion`,
		);
	}
}
