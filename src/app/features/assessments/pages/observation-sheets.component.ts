import { Component, inject, OnInit } from '@angular/core';
import { ObservationGuide } from '../../../core/interfaces/observation-guide';
import { ObservationGuideService } from '../../../core/services/observation-guide.service';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
	selector: 'app-observation-sheets',
	imports: [
		MatTableModule,
		MatSnackBarModule,
		MatButtonModule,
		MatIconModule,
		RouterLink,
		DatePipe,
		MatCardModule,
	],
	template: `
		<mat-card-title>Gu&iacute;as de Observaci&oacute;n</mat-card-title>
		<table
			mat-table
			[dataSource]="assessments"
			class="mat-elevation-z8"
			style="margin-top: 24px"
		>
			<ng-container matColumnDef="title">
				<th mat-header-cell *matHeaderCellDef>T&iacute;tulo</th>
				<td mat-cell *matCellDef="let element">{{ element.title }}</td>
			</ng-container>
			<ng-container matColumnDef="date">
				<th mat-header-cell *matHeaderCellDef>Fecha</th>
				<td mat-cell *matCellDef="let element">
					{{ element.date | date: "dd/MM/yyyy" }}
				</td>
			</ng-container>
			<ng-container matColumnDef="section">
				<th mat-header-cell *matHeaderCellDef>Curso</th>
				<td mat-cell *matCellDef="let element">{{ element.section.name }}</td>
			</ng-container>
			<ng-container matColumnDef="individual">
				<th mat-header-cell *matHeaderCellDef>Individual</th>
				<td mat-cell *matCellDef="let element">
					{{ element.individual ? "Si" : "No" }}
				</td>
			</ng-container>
			<ng-container matColumnDef="actions">
				<th mat-header-cell *matHeaderCellDef>Acciones</th>
				<td mat-cell *matCellDef="let element">
					<button
						(click)="deleteAssessment(element._id)"
						color="warn"
						mat-icon-button
					>
						<mat-icon>delete</mat-icon>
					</button>
					<!-- <button color="accent" mat-icon-button>
							<mat-icon>edit</mat-icon>
						</button> -->
					<button
						[routerLink]="['/assessments/observation-sheets', element._id]"
						color="primary"
						mat-icon-button
					>
						<mat-icon>open_in_new</mat-icon>
					</button>
				</td>
			</ng-container>

			<tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
			<tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
		</table>
`,
})
export class ObservationSheetsComponent implements OnInit {
	private guideService = inject(ObservationGuideService);
	private sb = inject(MatSnackBar);

	displayedColumns = ['title', 'date', 'section', 'individual', 'actions'];

	assessments: ObservationGuide[] = [];

	ngOnInit(): void {
		this.loadGuides();
	}

	loadGuides() {
		this.guideService.findAll().subscribe((guides) => {
			if (guides.length) {
				this.assessments = guides;
			}
		});
	}

	deleteAssessment(id: string) {
		this.guideService.delete(id).subscribe(() => {
			this.sb.open('Se ha eliminado el intrumento', 'Ok', {
				duration: 2500,
			});
			this.loadGuides();
		});
	}
}
