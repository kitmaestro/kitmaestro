import { Component, inject, Input, OnInit } from '@angular/core';
import {
	GradingActivity,
	GroupedGradingActivity,
	ScoreSystem,
} from '../../../core/interfaces/score-system';
import { User } from '../../../core/interfaces';
import { ClassSection } from '../../../core/interfaces/class-section';
import { ContentBlock } from '../../../core/interfaces/content-block';
import { Student } from '../../../core/interfaces/student';
import { MatCardModule } from '@angular/material/card';
import { PretifyPipe } from '../../../shared/pipes/pretify.pipe';
import { StudentsService } from '../../../core/services/students.service';

@Component({
	selector: 'app-score-system',
	imports: [MatCardModule, PretifyPipe],
	template: `
		@if (scoreSystem) {
			<mat-card style="margin-top: 24px">
				<mat-card-content>
					<div class="page" id="score-system">
						<div style="text-align: center">
							<h2 style="margin-bottom: 0">
								{{
									section?.user?.schoolName ||
										scoreSystem.user.schoolName
								}}
							</h2>
							<h2 style="margin-bottom: 0">
								Sistema de Calificaci&oacute;n de
								{{
									(contentBlock && contentBlock.length
										? contentBlock[0].subject
										: content[0].subject
									) | pretify
								}}
							</h2>
							<h3 style="margin-bottom: 0">
								{{ user?.title || scoreSystem.user.title }}.
								{{ user?.firstname || scoreSystem.user.firstname }}
								{{ user?.lastname || scoreSystem.user.lastname }}
							</h3>
							<h3 style="margin-bottom: 0">
								{{
									section?.name ||
										scoreSystem.section.name ||
										"-Sin seccion-"
								}}
							</h3>
							@if (contentBlock && contentBlock.length) {
								<h3>
									|
									@for (c of contentBlock; track $index) {
										{{ c.title + " | " }}
									}
								</h3>
							} @else {
								<h3>
									@for (c of content; track $index) {
										{{ c.title }}
									}
								</h3>
							}
						</div>
						<h3 style="font-weight: bold">
							1. Esquema de Puntuaci&oacute;n
						</h3>
						<table style="table-layout: fixed; margin-bottom: 24px">
							<thead>
								<tr>
									<th>Competencia</th>
									<th>Item o Actividad</th>
									<th>Criterios de Evaluaci&oacute;n</th>
									<th>Puntuaci&oacute;n</th>
								</tr>
							</thead>
							<tbody>
								@for (group of grouped; track group.competence) {
									@for (row of group.grading; track $index) {
										<tr>
											@if ($index === 0) {
												<td
													[attr.rowspan]="
														group.grading.length + 1
													"
												>
													{{ group.competence }}
												</td>
											}
											<td>
												{{ row.activity }} ({{
													row.activityType
												}})
											</td>
											<td>
												<ul
													style="
														margin: 0;
														padding: 0;
														list-style: none;
													"
												>
													@for (
														criterion of row.criteria;
														track $index
													) {
														<li>- {{ criterion }}</li>
													}
												</ul>
											</td>
											<td>{{ row.points }} Puntos</td>
										</tr>
									}
									<tr>
										<td
											colspan="2"
											style="font-weight: bold; text-align: end"
										>
											Total
										</td>
										<td>{{ group.total }} Puntos</td>
									</tr>
								}
							</tbody>
						</table>
						@for (
							group of grouped;
							track group.competence;
							let position = $index
						) {
							<h3 style="font-weight: bold">
								{{ position + 2 }}. Matr&iacute;z de Ponderaci&oacute;n
								{{ position + 1 }}: Competencia {{ group.competence }}
							</h3>
							<table style="table-layout: fixed; margin-bottom: 24px">
								<tbody>
									<tr>
										<td></td>
										<td></td>
										<td
											[attr.colspan]="group.grading.length"
											style="
												text-align: center;
												font-weight: bold;
											"
										>
											Competencia {{ group.competence }}
										</td>
										<td style="font-weight: bold">Total</td>
									</tr>
									<tr>
										<td></td>
										<td></td>
										@for (row of group.grading; track $index) {
											<td
												style="
													line-height: 1.15;
													font-weight: normal;
												"
											>
												{{ row.activity }} ({{
													row.activityType
												}})<br /><b>{{ row.points }} Puntos</b>
											</td>
										}
										<td>{{ group.total }}</td>
									</tr>
									@for (student of students; track $index) {
										<tr>
											<th>{{ $index + 1 }}</th>
											<td>
												{{ student.firstname }}
												{{ student.lastname }}
											</td>
											@for (row of group.grading; track $index) {
												<td></td>
											}
											<td></td>
										</tr>
									}
								</tbody>
							</table>
						}
					</div>
				</mat-card-content>
			</mat-card>
		}
	`,
	styles: `
		.page {
			min-width: 11in;
			padding: 0.75in;
		}

		td,
		th {
			border: 1px solid #ccc;
			padding: 8px;
		}

		table {
			border-collapse: collapse;
		}

		.shadow {
			box-shadow: 10px 10px 14px 0px rgba(0, 0, 0, 0.75);
			-webkit-box-shadow: 10px 10px 14px 0px rgba(0, 0, 0, 0.75);
			-moz-box-shadow: 10px 10px 14px 0px rgba(0, 0, 0, 0.75);
		}
	`,
})
export class ScoreSystemComponent implements OnInit {
	@Input() scoreSystem: ScoreSystem | null = null;
	@Input() user: User | null = null;
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
