import { Component, inject, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { EstimationScaleService } from '../../../core/services/estimation-scale.service';
import { EstimationScale } from '../../../core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';

@Component({
	selector: 'app-estimation-scales',
	imports: [
		MatTableModule,
		MatSnackBarModule,
		MatButtonModule,
		MatIconModule,
		RouterLink,
		MatCardModule,
	],
	template: `
		<mat-card-title>Escala de Estimaci&oacute;n</mat-card-title>

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
			<ng-container matColumnDef="section">
				<th mat-header-cell *matHeaderCellDef>Curso</th>
				<td mat-cell *matCellDef="let element">{{ element.section.name }}</td>
			</ng-container>
			<ng-container matColumnDef="subject">
				<th mat-header-cell *matHeaderCellDef>Asignatura</th>
				<td mat-cell *matCellDef="let element">{{ element.subject }}</td>
			</ng-container>
			<ng-container matColumnDef="activity">
				<th mat-header-cell *matHeaderCellDef>Actividad</th>
				<td mat-cell *matCellDef="let element">{{ element.activity }}</td>
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
						[routerLink]="['/assessments/estimation-scales', element._id]"
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
export class EstimationScalesComponent implements OnInit {
	private scaleService = inject(EstimationScaleService);
	private sb = inject(MatSnackBar);

	displayedColumns = ['title', 'section', 'subject', 'activity', 'actions'];

	assessments: EstimationScale[] = [];

	ngOnInit(): void {
		this.loadInstruments();
	}

	loadInstruments() {
		this.scaleService.findAll().subscribe((scales) => {
			if (scales.length) {
				this.assessments = scales;
			}
		});
	}

	deleteAssessment(id: string) {
		this.scaleService.delete(id).subscribe(() => {
			this.sb.open('Se ha eliminado el intrumento', 'Ok', {
				duration: 2500,
			});
			this.loadInstruments();
		});
	}
}
