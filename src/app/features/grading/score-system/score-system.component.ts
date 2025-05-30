import { Component, inject, Input, OnInit } from '@angular/core';
import {
	GradingActivity,
	GroupedGradingActivity,
	ScoreSystem,
} from '../../../core/interfaces/score-system';
import { UserSettings } from '../../../core/interfaces/user-settings';
import { ClassSection } from '../../../core/interfaces/class-section';
import { ContentBlock } from '../../../core/interfaces/content-block';
import { Student } from '../../../core/interfaces/student';
import { MatCardModule } from '@angular/material/card';
import { PretifyPipe } from '../../../shared/pipes/pretify.pipe';
import { StudentsService } from '../../../core/services/students.service';

@Component({
	selector: 'app-score-system',
	imports: [MatCardModule, PretifyPipe],
	templateUrl: './score-system.component.html',
	styleUrl: './score-system.component.scss',
})
export class ScoreSystemComponent implements OnInit {
	@Input() scoreSystem: ScoreSystem | null = null;
	@Input() user: UserSettings | null = null;
	@Input() section: ClassSection | null = null;
	@Input() contentBlock: ContentBlock[] = [];
	private studentsService = inject(StudentsService);
	grouped: GroupedGradingActivity[] = [];
	students: Student[] = [];

	ngOnInit() {
		if (this.scoreSystem) {
			this.grouped = this.groupByCompetence(this.scoreSystem.activities);
			this.studentsService
				.findBySection(
					this.section?._id || this.scoreSystem.section._id,
				)
				.subscribe({
					next: (students) => {
						this.students = students;
					},
				});
		}
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

	get content(): ContentBlock[] {
		if (this.scoreSystem) {
			if (typeof this.scoreSystem.content.join === 'function') {
				return this.scoreSystem.content;
			} else {
				return [this.scoreSystem.content] as any as ContentBlock[];
			}
		} else {
			return [];
		}
	}
}
