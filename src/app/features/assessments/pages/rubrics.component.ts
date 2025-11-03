import { Component, inject, OnInit } from '@angular/core';
import { RubricService } from '../../../core/services/rubric.service';
import { Rubric } from '../../../core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';

@Component({
	selector: 'app-rubrics',
	imports: [
		RouterLink,
		MatSnackBarModule,
		MatCardModule,
		MatButtonModule,
		MatIconModule,
		MatTableModule,
	],
	template: `
		<div style="padding-bottom: 24px;">
			<div
				style="justify-content: space-between; align-items: center; display: flex;"
			>
				<h2>Mis R&uacute;bricas</h2>
				<button
					mat-flat-button
					type="button"
					routerLink="/assessments/rubric-generator"
				>
					<mat-icon>add</mat-icon>
					Generar R&uacute;brica
				</button>
			</div>
			<table
				mat-table
				[dataSource]="rubrics"
				class="mat-elevation-z8"
				style="margin-top: 24px"
			>
				<ng-container matColumnDef="title">
					<th mat-header-cell *matHeaderCellDef>T&iacute;tulo</th>
					<td mat-cell *matCellDef="let element">
						{{ element.title }}
					</td>
				</ng-container>
				<ng-container matColumnDef="section">
					<th mat-header-cell *matHeaderCellDef>Curso</th>
					<td mat-cell *matCellDef="let element">
						{{ element.section.name }}
					</td>
				</ng-container>
				<ng-container matColumnDef="activity">
					<th mat-header-cell *matHeaderCellDef>Actividad</th>
					<td mat-cell *matCellDef="let element">
						{{ element.activity }}
					</td>
				</ng-container>
				<ng-container matColumnDef="rubricType">
					<th mat-header-cell *matHeaderCellDef>
						Tipo de R&uacute;brica
					</th>
					<td mat-cell *matCellDef="let element">
						{{
							element.rubricType === 'SINTETICA'
								? 'Sintética (Holística)'
								: 'Analítica (Global)'
						}}
					</td>
				</ng-container>
				<ng-container matColumnDef="actions">
					<th mat-header-cell *matHeaderCellDef>Acciones</th>
					<td mat-cell *matCellDef="let element">
						<button
							(click)="deleteAssessment(element._id)"
							color="warn"
							style="display: none;"
							mat-icon-button
						>
							<mat-icon>delete</mat-icon>
						</button>
						<!-- <button color="accent" mat-icon-button>
								<mat-icon>edit</mat-icon>
							</button> -->
						<button
							[routerLink]="[
								'/assessments',
								'rubrics',
								element._id,
							]"
							color="primary"
							mat-icon-button
						>
							<mat-icon>open_in_new</mat-icon>
						</button>
						<button
							color="primary"
							mat-icon-button
							(click)="download(element)"
						>
							<mat-icon>download</mat-icon>
						</button>
					</td>
				</ng-container>

				<tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
				<tr
					mat-row
					*matRowDef="let row; columns: displayedColumns"
				></tr>
			</table>
		</div>
	`,
})
export class RubricsComponent implements OnInit {
	private rubricService = inject(RubricService);
	private sb = inject(MatSnackBar);

	rubrics: Rubric[] = [];
	displayedColumns = [
		'title',
		'section',
		'activity',
		'rubricType',
		'actions',
	];
	loading = true;

	loadRubrics() {
		this.rubricService.findAll().subscribe({
			next: (rubrics) => {
				if (rubrics.length) {
					this.rubrics = rubrics;
				}
				this.loading = false;
			},
			error: (err) => {
				this.sb.open('Error al cargar', 'Ok', { duration: 2500 });
				console.log(err.message);
				this.loading = false;
			},
		});
	}

	ngOnInit() {
		this.loadRubrics();
	}

	deleteAssessment(id: string) {
		this.loading = true;
		this.rubricService.delete(id).subscribe({
			next: (res) => {
				if (res.deletedCount === 1) {
					this.sb.open('Se ha eliminado la rubrica', 'Ok', {
						duration: 2500,
					});
					this.loadRubrics();
				}
				this.loading = false;
			},
			error: (err) => {
				console.log(err.message);
				this.loading = false;
				this.sb.open(
					'No se ha podido eliminar. Intentalo de nuevo',
					'Ok',
					{ duration: 2500 },
				);
			},
		});
	}

	async download(rubric: any) {
		this.loading = true;
		await this.rubricService.download(rubric);
		this.loading = false;
	}
}
