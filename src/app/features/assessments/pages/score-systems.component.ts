import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ScoreSystemService } from '../../../core/services/score-system.service';
import { GradingActivity, ScoreSystem } from '../../../core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { PretifyPipe } from '../../../shared/pipes/pretify.pipe';
import { lastValueFrom } from 'rxjs';
import { StudentsService } from '../../../core/services/students.service';

@Component({
	selector: 'app-score-systems',
	imports: [
		RouterLink,
		MatSnackBarModule,
		MatIconModule,
		MatButtonModule,
		MatTableModule,
		PretifyPipe,
	],
	template: `
		<div>
			<div
				style="display: flex; justify-content: space-between; align-items: center;"
			>
				<h2>Sistemas de Calificaci&oacute;n</h2>
				<button
					style="margin-left: auto"
					mat-flat-button
					color="primary"
					routerLink="/assessments/grading-system-generator"
				>
					<mat-icon>add</mat-icon>
					Crear Nuevo
				</button>
			</div>
		</div>

		<table
			mat-table
			[dataSource]="scoreSystems"
			class="mat-elevation-z4"
			style="margin-top: 24px"
		>
			<ng-container matColumnDef="section">
				<th mat-header-cell *matHeaderCellDef>Seccion</th>
				<td mat-cell *matCellDef="let element">
					{{ element.section ? element.section.name : 'Sin seccion' }}
				</td>
			</ng-container>
			<ng-container matColumnDef="subject">
				<th mat-header-cell *matHeaderCellDef>Asignatura</th>
				<td mat-cell *matCellDef="let element">
					{{
						element.content.subject || element.content[0].subject
							| pretify
					}}
				</td>
			</ng-container>
			<ng-container matColumnDef="content">
				<th mat-header-cell *matHeaderCellDef>Contenido</th>
				<td mat-cell *matCellDef="let element">
					{{ element.content.title || element.content[0].title }}
				</td>
			</ng-container>
			<ng-container matColumnDef="competence">
				<th mat-header-cell *matHeaderCellDef>Competencias</th>
				<td mat-cell *matCellDef="let element">
					{{ countCompetence(element.activities) }}
				</td>
			</ng-container>
			<ng-container matColumnDef="activities">
				<th mat-header-cell *matHeaderCellDef>Actividades</th>
				<td mat-cell *matCellDef="let element">
					{{ element.activities.length }}
				</td>
			</ng-container>
			<ng-container matColumnDef="actions">
				<th mat-header-cell *matHeaderCellDef>Acciones</th>
				<td mat-cell *matCellDef="let element">
					<button
						type="button"
						(click)="delete(element.id)"
						color="warn"
						style="display: none"
						mat-icon-button
					>
						<mat-icon>delete</mat-icon>
					</button>
					<button
						type="button"
						(click)="download(element)"
						color="warn"
						mat-icon-button
					>
						<mat-icon>download</mat-icon>
					</button>
					<a
						type="button"
						mat-icon-button
						routerLink="/assessments/grading-systems/{{
							element._id
						}}"
						color="primary"
					>
						<mat-icon>open_in_new</mat-icon>
					</a>
				</td>
			</ng-container>

			<tr mat-header-row *matHeaderRowDef="columns"></tr>
			<tr mat-row *matRowDef="let row; columns: columns"></tr>
		</table>
	`,
})
export class ScoreSystemsComponent implements OnInit {
	private scoreSystemService = inject(ScoreSystemService);
	private studentService = inject(StudentsService);
	private sb = inject(MatSnackBar);
	scoreSystems: ScoreSystem[] = [];
	columns = [
		'section',
		'subject',
		'content',
		// 'competence',
		'activities',
		'actions',
	];

	load() {
		this.scoreSystemService.findAll().subscribe({
			next: (scoreSystems) => {
				this.scoreSystems = scoreSystems;
			},
		});
	}

	ngOnInit() {
		this.load();
	}

	countCompetence(activities: GradingActivity[]) {
		return activities.reduce((prev: string[], curr: GradingActivity) => {
			if (!prev.includes(curr.competence)) {
				prev.push(curr.competence);
			}
			return prev;
		}, [] as string[]).length;
	}

	delete(id: string) {
		this.scoreSystemService.delete(id).subscribe({
			next: (res) => {
				if (res.deletedCount > 0) {
					this.sb.open(
						'Se ha eliminado el sistema de calificacion',
						'Ok',
						{ duration: 2500 },
					);
					this.load();
				}
			},
			error: (err) => {
				console.log(err.message);
				this.sb.open(
					'Ha ocurrido un error al cargar tus sistemas de calificacion. Intentalo de nuevo, por favor.',
					'Ok',
					{ duration: 2500 },
				);
			},
		});
	}

	async download(system: ScoreSystem) {
		if (!system.section) {
			this.sb.open(
				'Este sistema de calificaciones contiene errores. No se puede descargar',
				'Ok',
				{ duration: 2500 },
			);
			return;
		}
		const students = await lastValueFrom(
			this.studentService.findBySection(system.section._id),
		);
		await this.scoreSystemService.download(system, students);
		this.sb.open('Se ha descargado tu sistema de calificacion', 'Ok', {
			duration: 2500,
		});
	}
}
