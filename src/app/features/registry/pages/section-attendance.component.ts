import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Observable, of } from 'rxjs';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { Attendance } from '../../../core';
import { Student } from '../../../core';
import { ClassSection } from '../../../core';
import { ClassSectionService } from '../../../core/services/class-section.service';

@Component({
	selector: 'app-section-attendance',
	imports: [
		MatCardModule,
		MatButtonModule,
		MatTableModule,
		RouterModule,
		ReactiveFormsModule,
		CommonModule,
		MatPaginatorModule,
		MatIconModule,
	],
	template: `
		<div style="margin: 20px">
			<mat-card>
				<mat-card-header>
					<h2>
						Asistencia en
						<ng-container *ngIf="section$ | async as section">{{
							section.name
						}}</ng-container>
					</h2>
				</mat-card-header>
				<mat-card-content>
					<div style="display: flex; align-items: center">
						<button mat-icon-button (click)="prevMonth()">
							<mat-icon>arrow_back</mat-icon>
						</button>
						<div class="text">
							{{ months[currentMonth] }} de {{ currentYear }}
						</div>
						<button mat-icon-button (click)="nextMonth()">
							<mat-icon>arrow_forward</mat-icon>
						</button>
					</div>
				</mat-card-content>
			</mat-card>

			<table
				mat-table
				class="mat-elevation-z8"
				[dataSource]="attendance$"
			>
				@for (col of cols; track $index) {
					<ng-container [matColumnDef]="col">
						<th mat-header-cell *matHeaderCellDef>{{ col }}</th>
						<td mat-cell *matCellDef="let student">
							{{ student.firstname }}
						</td>
					</ng-container>
				}

				<tr mat-header-row *matHeaderRowDef="displayedCols"></tr>
				<tr mat-row *matRowDef="let row; columns: displayedCols"></tr>
			</table>
		</div>
	`,
	styles: `
		mat-card {
			margin-bottom: 20px;
		}

		.text {
			font-size: 16px;
			font-family: Roboto, sans-serif;
			margin-left: 12px;
			margin-right: 12px;
		}
	`,
})
export class SectionAttendanceComponent {
	private classSectionService = inject(ClassSectionService);
	router = inject(Router);
	route = inject(ActivatedRoute);

	id = this.route.snapshot.paramMap.get('id');
	today = new Date();
	currentYear = this.today.getFullYear();
	currentMonth = this.today.getMonth();

	displayedCols = ['Estudiante'];

	cols: string[] = [];

	section$: Observable<ClassSection> = this.classSectionService.findSection(
		this.id || '',
	);
	students$ = of([]) as Observable<Student[]>;
	attendance$ = of([]) as Observable<Attendance[]>;

	months = [
		'Enero',
		'Febrero',
		'Marzo',
		'Abril',
		'Mayo',
		'Junio',
		'Julio',
		'Agosto',
		'Septiembre',
		'Octubre',
		'Noviembre',
		'Diciembre',
	];

	days = [
		'Domingo',
		'Lunes',
		'Martes',
		'Miercoles',
		'Jueves',
		'Viernes',
		'Sabado',
	];

	setAttendance(attend: string, date: number) {}

	constructor() {
		this.fillTable(this.currentYear, this.currentMonth);
	}

	daysInMonth(month: number, year: number) {
		if ([0, 2, 4, 6, 7, 9, 11].includes(month)) {
			return 31;
		} else if (month === 1) {
			if ((0 === year % 4 && 0 != year % 100) || 0 === year % 400) {
				return 29;
			} else {
				return 28;
			}
		} else {
			return 30;
		}
	}

	fillTable(year: number, month: number) {
		const days = this.daysInMonth(this.currentMonth, this.currentYear);
		const cols = ['Estudiante'];
		for (let i = 0; i < days; i++) {
			const day = new Date(year, month, i + 1).getDay();
			if (day === 0 || day === 6) {
				continue;
			}
			const date =
				['D', 'L', 'M', 'M', 'J', 'V', 'S'][day] +
				' ' +
				String(i + 1).padStart(2, '0');
			cols.push(date);
		}
		this.cols = cols;
		this.displayedCols = cols;
	}

	prevMonth() {
		if (this.currentMonth === 0) {
			this.currentMonth = 11;
			this.currentYear -= 1;
		} else {
			this.currentMonth -= 1;
		}
		this.fillTable(this.currentYear, this.currentMonth);
	}

	nextMonth() {
		if (this.currentMonth === 11) {
			this.currentMonth = 0;
			this.currentYear += 1;
		} else {
			this.currentMonth += 1;
		}
		this.fillTable(this.currentYear, this.currentMonth);
	}
}
