import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PdfService } from '../../../core/services/pdf.service';

@Component({
	selector: 'app-graph-paper',
	imports: [
		MatInputModule,
		MatSelectModule,
		MatCardModule,
		MatFormFieldModule,
		MatButtonModule,
		ReactiveFormsModule,
		MatSnackBarModule,
		MatIconModule,
	],
	template: `
		<mat-card>
			<mat-card-header>
				<h2 mat-card-title>Generador de Papel Cuadriculado</h2>
			</mat-card-header>
			<mat-card-content>
				<form [formGroup]="paperForm">
					<div class="row">
						<div>
							<mat-form-field>
								<mat-label>Cuadros Por Pulgadas</mat-label>
								<input
									type="number"
									min="1"
									formControlName="squaresPerInch"
									matInput
								/>
							</mat-form-field>
						</div>
						<div>
							<mat-form-field>
								<mat-label>Estilo del Borde</mat-label>
								<mat-select formControlName="border">
									@for (
										border of borderOptions;
										track $index
									) {
										<mat-option [value]="border.name">{{
											border.label
										}}</mat-option>
									}
								</mat-select>
							</mat-form-field>
						</div>
					</div>
					<div class="row">
						<div>
							<mat-form-field>
								<mat-label>Grosor del Borde</mat-label>
								<mat-select formControlName="thickness">
									@for (
										thickness of borderThickness;
										track $index
									) {
										<mat-option [value]="thickness.id">{{
											thickness.label
										}}</mat-option>
									}
								</mat-select>
							</mat-form-field>
						</div>
						<div>
							<mat-form-field>
								<mat-label>Color del Borde</mat-label>
								<input
									type="color"
									matInput
									formControlName="color"
								/>
							</mat-form-field>
						</div>
					</div>
				</form>
				<button
					type="button"
					(click)="print()"
					style="margin-right: 12px"
					mat-raised-button
					color="accent"
				>
					Descargar
				</button>
			</mat-card-content>
		</mat-card>

		<mat-card style="margin-top: 24px">
			<mat-card-content>
				<div class="page" id="graph-paper">
					@for (line of lines; track $index) {
						<div class="holder">
							@for (square of squares; track $index) {
								<div
									[style]="
										'border-color: ' +
										paperForm.get('color')?.value +
										'; width: ' +
										8 / squares.length +
										'in;'
									"
									class="square border-{{
										paperForm.get('thickness')?.value
									}} {{ paperForm.get('border')?.value }}"
								></div>
							}
						</div>
					}
				</div>
			</mat-card-content>
		</mat-card>
	`,
	styles: `
		.dotted {
			border-style: dotted;
		}

		.dashed {
			border-style: dashed;
		}

		.solid {
			border-style: solid;
		}

		.double {
			border-style: double;
		}

		.groove {
			border-style: groove;
		}

		.ridge {
			border-style: ridge;
		}

		.inset {
			border-style: inset;
		}

		.outset {
			border-style: outset;
		}

		.border {
			&-1 {
				border-width: 1px;
			}

			&-2 {
				border-width: 2px;
			}

			&-3 {
				border-width: 4px;
			}
		}

		form {
			display: flex;
			gap: 16px;
		}

		.row {
			width: 100%;
			flex: 1 1 auto;
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

		.holder {
			display: flex;
		}

		.square {
			aspect-ratio: 1 / 1;
		}
	`,
})
export class GraphPaperGeneratorComponent {
	private fb = inject(FormBuilder);
	private sb = inject(MatSnackBar);
	private pdfService = inject(PdfService);

	borderOptions = [
		{ name: 'solid', label: 'Sólido' },
		{ name: 'dotted', label: 'Punteado' },
		{ name: 'dashed', label: 'Guiones' },
	];

	borderThickness = [
		{ id: 1, label: 'Delgado' },
		{ id: 2, label: 'Medio' },
		{ id: 3, label: 'Grueso' },
	];

	paperForm = this.fb.group({
		squaresPerInch: [4, Validators.required],
		border: ['solid', Validators.required],
		thickness: [1],
		color: ['#039be5'],
	});

	onSubmit() {}

	get lines() {
		const { squaresPerInch } = this.paperForm.value;
		if (squaresPerInch) {
			const lines = Math.floor(10.5 * squaresPerInch);
			return Array.from({ length: lines });
		}

		return Array.from({ length: 10 });
	}

	get squares() {
		const { squaresPerInch } = this.paperForm.value;
		if (squaresPerInch) {
			const lines = Math.floor(8 * squaresPerInch);
			return Array.from({ length: lines });
		}

		return Array.from({ length: 8 });
	}

	print() {
		this.sb.open(
			'Guardando como PDF!, por favor espera un momento.',
			undefined,
			{ duration: 5000 },
		);
		setTimeout(() => {
			this.pdfService.createAndDownloadFromHTML(
				'graph-paper',
				`Papel Cuadriculado - ${this.paperForm.get('squaresPerInch')?.value} cuadros por pulgada`,
			);
		}, 1000);
	}
}
