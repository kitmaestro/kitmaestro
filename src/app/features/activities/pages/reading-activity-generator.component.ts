import { Component, inject, OnInit } from '@angular/core';
import { ReadingActivityService } from '../../../core/services';
import { ReadingActivity } from '../../../core/interfaces';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PretifyPipe } from '../../../shared/pipes/pretify.pipe';
import { ReadingActivityDetailComponent } from './reading-activity-detail.component';
import { DatePipe } from '@angular/common';

@Component({
	selector: 'app-reading-activities',
	imports: [
		RouterLink,
		MatCardModule,
		MatButtonModule,
		MatIconModule,
		MatTableModule,
		MatSnackBarModule,
		DatePipe,
		PretifyPipe,
		MatDialogModule,
	],
	template: `
		<mat-card>
			<mat-card-header>
				<mat-card-title>Actividades de Lectura Guiada</mat-card-title>
				<span style="flex: 1 1 auto"></span>
				<a
					routerLink="/guided-reading-generator"
					mat-mini-fab
					color="primary"
				>
					<mat-icon>add</mat-icon>
				</a>
			</mat-card-header>
			<mat-card-content>
				Las actividades de lectura guiada incluyen un texto para leer y
				preguntas abiertas que fomentan la reflexión. Este método es
				efectivo para desarrollar y evaluar la comprensión lectora de
				los estudiantes, permitiendo una interacción crítica con el
				contenido.
			</mat-card-content>
		</mat-card>
		<table
			mat-table
			[dataSource]="activities"
			class="mat-elevation-z8"
			style="margin-top: 24px"
		>
			<ng-container matColumnDef="creationDate">
				<th mat-header-cell *matHeaderCellDef>Fecha de Creación</th>
				<td mat-cell *matCellDef="let element">
					{{ element.createdAt | date: 'dd/MM/yyyy' }}
				</td>
			</ng-container>
			<ng-container matColumnDef="title">
				<th mat-header-cell *matHeaderCellDef>T&iacute;tulo</th>
				<td mat-cell *matCellDef="let element">{{ element.title }}</td>
			</ng-container>
			<ng-container matColumnDef="section">
				<th mat-header-cell *matHeaderCellDef>Grado Objetivo</th>
				<td mat-cell *matCellDef="let element">
					{{ element.section.name }}
				</td>
			</ng-container>
			<ng-container matColumnDef="level">
				<th mat-header-cell *matHeaderCellDef>Proceso Cognitivo</th>
				<td mat-cell *matCellDef="let element">
					{{ element.level | pretify }}
				</td>
			</ng-container>
			<ng-container matColumnDef="questions">
				<th mat-header-cell *matHeaderCellDef>Preguntas</th>
				<td mat-cell *matCellDef="let element">
					{{ element.questions.length }}
				</td>
			</ng-container>
			<ng-container matColumnDef="actions">
				<th mat-header-cell *matHeaderCellDef>Acciones</th>
				<td mat-cell *matCellDef="let element">
					<button
						(click)="deleteActivity(element._id)"
						color="warn"
						mat-icon-button
					>
						<mat-icon>delete</mat-icon>
					</button>
					<!-- <button color="accent" mat-icon-button>
						<mat-icon>edit</mat-icon>
					</button> -->
					<button
						(click)="downloadActivity(element)"
						[disabled]="printing"
						color="primary"
						mat-icon-button
					>
						<mat-icon>download</mat-icon>
					</button>
					<button
						(click)="openActivity(element)"
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
export class ReadingActivityGeneratorComponent implements OnInit {
	private activityService = inject(ReadingActivityService);
	private sb = inject(MatSnackBar);
	private dialog = inject(MatDialog);

	printing = false;
	public activities: ReadingActivity[] = [];
	public displayedColumns = [
		'section',
		'creationDate',
		'level',
		'title',
		'questions',
		'actions',
	];

	ngOnInit() {
		this.loadActivities();
	}

	loadActivities() {
		const sus = this.activityService.findAll().subscribe({
			next: (activities) => {
				sus.unsubscribe();
				if (activities.length) {
					this.activities = activities;
				}
			},
		});
	}

	openActivity(activity: ReadingActivity) {
		this.dialog.open(ReadingActivityDetailComponent, {
			data: activity,
			width: '90%',
			maxWidth: '1200px',
		});
	}

	pretify(str: string) {
		return new PretifyPipe().transform(str);
	}

	deleteActivity(id: string) {
		this.activityService.delete(id).subscribe((res) => {
			if (res.deletedCount === 1) {
				this.sb.open('Se ha eliminado la actividad', 'Ok', {
					duration: 2500,
				});
				this.loadActivities();
			}
		});
	}

	async downloadActivity(activity: ReadingActivity) {
		this.printing = true;
		await this.activityService.download(activity);
		this.printing = false;
	}
}
