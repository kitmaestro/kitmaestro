import { Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
	selector: 'app-attendance-calculator',
	imports: [
		MatButtonModule,
		MatIconModule,
		MatTableModule,
		MatCardModule,
		ReactiveFormsModule,
		CommonModule,
	],
	template: `
		<mat-card class="card">
			<mat-card-header>
				<mat-card-title>
					<h2>Calculadora de Porcentaje de Asistencia</h2>
				</mat-card-title>
			</mat-card-header>
			<mat-card-content>
				<h3>Dias Trabajados</h3>
				<div class="form-container">
					<div>
						<button mat-mini-fab color="primary" (click)="less()">
							<mat-icon>remove</mat-icon>
						</button>
					</div>
					<input
						min="1"
						max="25"
						type="number"
						[formControl]="days"
					/>
					<div>
						<button mat-mini-fab color="primary" (click)="plus()">
							<mat-icon>add</mat-icon>
						</button>
					</div>
				</div>
			</mat-card-content>
		</mat-card>

		<table
			mat-table
			[dataSource]="dataSet"
			class="mat-elevation-z8"
			*ngIf="dataSet.length"
		>
			<ng-container matColumnDef="attendance">
				<th mat-header-cell *matHeaderCellDef>Asistencia</th>
				<td mat-cell *matCellDef="let element">{{ element.qty }}</td>
			</ng-container>

			<ng-container matColumnDef="percentage">
				<th mat-header-cell *matHeaderCellDef>Porcentaje</th>
				<td mat-cell *matCellDef="let element">
					{{ element.percentage }}
				</td>
			</ng-container>

			<ng-container matColumnDef="fixed">
				<th mat-header-cell *matHeaderCellDef>
					Ajustado (Redondeo hacia arriba)
				</th>
				<td mat-cell *matCellDef="let element">{{ element.fixed }}</td>
			</ng-container>

			<tr mat-header-row *matHeaderRowDef="labels"></tr>
			<tr mat-row *matRowDef="let row; columns: labels"></tr>
		</table>
	`,
	styles: `
		input::-webkit-outer-spin-button,
		input::-webkit-inner-spin-button {
			-webkit-appearance: none;
			margin: 0;
		}

		input[type='number'] {
			-moz-appearance: textfield;
		}

		tr:nth-child(even) {
			background-color: #f8f8f8;
		}

		.form-container {
			display: flex;
			gap: 16px;
			align-items: center;

			input {
				margin-top: auto;
				margin-bottom: auto;
				font-size: 22pt;
				display: inline-block;
				border: 1px solid #f2f2f2;
				border-radius: 8px;
				padding: 4px 8px;
				text-align: center;
			}
		}

		.card {
			margin-bottom: 16px;
		}
	`,
})
export class AttendanceCalculatorComponent implements OnInit {
	fb = inject(FormBuilder);

	dataSet: { qty: number; percentage: string; fixed: string }[] = [];
	labels = ['attendance', 'percentage', 'fixed'];

	days = this.fb.control(12);

	ngOnInit() {
		this.calculate();
	}

	calculate() {
		const days = this.days.value;
		this.dataSet = [];
		if (days) {
			for (let i = 1; i <= days; i++) {
				const percentage = (i * 100) / days;
				this.dataSet.push({
					qty: i,
					percentage: percentage.toFixed(2) + '%',
					fixed: Math.round(percentage) + '%',
				});
			}
		}
	}

	less() {
		const { value } = this.days;
		if (!value) return;
		this.days.setValue(value - 1);
		this.calculate();
	}

	plus() {
		const { value } = this.days;
		this.days.setValue(value ? value + 1 : 1);
		this.calculate();
	}
}
