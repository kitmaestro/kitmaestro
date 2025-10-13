import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ScoreSystemService } from '../../../core/services/score-system.service';
import { PdfService } from '../../../core/services/pdf.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import {
	GradingActivity,
	GroupedGradingActivity,
	ScoreSystem,
} from '../../../core/interfaces/score-system';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ScoreSystemComponent } from '../components/score-system.component';
import { MatIconModule } from '@angular/material/icon';
import { PretifyPipe } from '../../../shared/pipes/pretify.pipe';
import { Student } from '../../../core/interfaces/student';
import { StudentsService } from '../../../core/services/students.service';

@Component({
	selector: 'app-score-system-detail',
	imports: [
		RouterLink,
		MatCardModule,
		MatIconModule,
		MatButtonModule,
		MatSnackBarModule,
		ScoreSystemComponent,
	],
	template: `
		<mat-card>
			<mat-card-header>
				<mat-card-title
					>Detalles del Sistema de Calificaci&oacute;n</mat-card-title
				>
				<div style="margin-left: auto">
					<button
						type="button"
						routerLink="/grading-systems/list"
						mat-icon-button
						color="accent"
					>
						<mat-icon>home</mat-icon>
					</button>
					<button
						(click)="deleteScoreSystem()"
						type="button"
						mat-icon-button
						color="warn"
						[disabled]="printing || deleting"
					>
						<mat-icon>delete</mat-icon>
					</button>
					<button
						(click)="print()"
						type="button"
						mat-icon-button
						color="primary"
						[disabled]="printing || deleting"
					>
						<mat-icon>download</mat-icon>
					</button>
				</div>
			</mat-card-header>
			<mat-card-content></mat-card-content>
		</mat-card>

		@if (scoreSystem) {
			<app-score-system [scoreSystem]="scoreSystem"></app-score-system>
		}
	`,
})
export class ScoreSystemDetailComponent implements OnInit {
	private route = inject(ActivatedRoute);
	private router = inject(Router);
	private scoreSystemService = inject(ScoreSystemService);
	private studentsService = inject(StudentsService);
	private pdfService = inject(PdfService);
	private sb = inject(MatSnackBar);
	private id = this.route.snapshot.paramMap.get('id') || '';
	scoreSystem: ScoreSystem | null = null;
	grouped: GroupedGradingActivity[] = [];
	students: Student[] = [];
	printing = false;
	deleting = false;

	load() {
		this.scoreSystemService.find(this.id).subscribe({
			next: (scoreSystem) => {
				this.scoreSystem = scoreSystem;
				this.grouped = this.groupByCompetence(
					this.scoreSystem.activities,
				);
				this.studentsService
					.findBySection(scoreSystem.section._id)
					.subscribe((students) => {
						this.students = students;
					});
			},
			error: (err) => {
				this.router.navigateByUrl('/grading-systems').then(() => {
					this.sb.open(
						'Ha ocurrido un error al cargar este sistema de calificacion.',
						'Ok',
						{ duration: 2500 },
					);
				});
				console.log(err.message);
			},
		});
	}

	ngOnInit() {
		this.load();
	}

	groupByCompetence(
		gradingActivities: GradingActivity[],
	): GroupedGradingActivity[] {
		const grouped = gradingActivities.reduce((acc, activity) => {
			// Si ya existe un grupo con la misma competencia, añade la actividad al grupo
			const existingGroup = acc.find(
				(group) => group.competence === activity.competence,
			);

			if (existingGroup) {
				existingGroup.grading.push(activity);
				existingGroup.total += activity.points;
			} else {
				// Si no existe, crea un nuevo grupo para esta competencia
				acc.push({
					competence: activity.competence,
					grading: [activity],
					total: activity.points,
				});
			}

			return acc;
		}, [] as GroupedGradingActivity[]);

		return grouped;
	}

	adjustGradingActivities(
		gradingActivities: GradingActivity[],
	): GradingActivity[] {
		// Paso 1: Agrupamos por 'competence' y calculamos el total
		const grouped = gradingActivities.reduce((acc, activity) => {
			const existingGroup = acc.find(
				(group) => group.competence === activity.competence,
			);

			if (existingGroup) {
				existingGroup.grading.push(activity);
				existingGroup.total += activity.points;
			} else {
				acc.push({
					competence: activity.competence,
					grading: [activity],
					total: activity.points,
				});
			}

			return acc;
		}, [] as GroupedGradingActivity[]);

		// Paso 2: Ajustar los grupos que tengan un total menor a 100
		grouped.forEach((group) => {
			if (group.total < 100) {
				// Calculamos la diferencia que falta para llegar a 100
				const difference = 100 - group.total;

				// Ordenamos las actividades por puntaje ascendente para encontrar las dos menores
				group.grading.sort((a, b) => a.points - b.points);

				if (group.grading.length >= 2) {
					// Repartimos la diferencia entre las dos actividades con menor puntaje
					group.grading[0].points += Math.floor(difference / 2);
					group.grading[1].points += Math.ceil(difference / 2);
				} else if (group.grading.length === 1) {
					// Si solo hay una actividad, le sumamos toda la diferencia
					group.grading[0].points += difference;
				}

				// Actualizamos el total del grupo a 100
				group.total = 100;
			}
		});

		// Paso 3: Retornar el array plano de GradingActivity con los puntos ajustados
		return grouped.flatMap((group) => group.grading);
	}

	deleteScoreSystem() {
		this.deleting = true;
		this.scoreSystemService.delete(this.id).subscribe({
			next: (res) => {
				if (res.deletedCount > 0) {
					this.router.navigateByUrl('/grading-systems').then(() => {
						this.sb.open(
							'Se ha eliminado el sistema de calificacion',
							'Ok',
							{ duration: 2500 },
						);
					});
					this.deleting = false;
				}
			},
			error: (err) => {
				this.sb.open(
					'Ha ocurrido un error al eliminar el sistema de calificacion',
					'Ok',
					{ duration: 2500 },
				);
				console.log(err.message);
				this.deleting = false;
			},
		});
	}

	pretify(value: string): string {
		return new PretifyPipe().transform(value);
	}

	async print() {
		if (!this.scoreSystem) return;
		this.printing = true;
		this.sb.open(
			'Tu descarga empezara en breve, espera un momento...',
			'Ok',
			{ duration: 2500 },
		);
		await this.scoreSystemService.download(this.scoreSystem, this.students);
		this.printing = false;
	}
}
