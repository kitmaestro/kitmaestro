import { Component, inject, input, OnInit } from '@angular/core';
import {
	GradingActivity,
	GroupedGradingActivity,
	ScoreSystem,
} from '../../../core';
import { ContentBlock } from '../../../core';
import { PretifyPipe } from '../../../shared/pipes/pretify.pipe';
import { Store } from '@ngrx/store';
import { loadStudentsBySection, selectAuthUser } from '../../../store';
import { selectSectionStudents } from '../../../store/students/students.selectors';

@Component({
	selector: 'app-score-system',
	imports: [PretifyPipe],
	template: `
		@if (scoreSystem(); as system) {
			<div style="margin-top: 24px">
				<div>
					<div class="page" id="score-system">
						<div style="text-align: center">
							<h2 style="margin-bottom: 0">
								{{ user()?.schoolName }}
							</h2>
							<h2 style="margin-bottom: 0">
								Sistema de Calificaci&oacute;n de
								{{ system.content[0].subject || '' | pretify }}
							</h2>
							<h3 style="margin-bottom: 0">
								{{ user()?.title }}.
								{{ user()?.firstname }}
								{{ user()?.lastname }}
							</h3>
							<h3 style="margin-bottom: 0">
								{{ system.section.name || '-Sin seccion-' }}
							</h3>
							@if (system.content.length) {
								<h3>
									|
									@for (c of system.content; track $index) {
										{{ c.title + ' | ' }}
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
								@for (
									group of grouped;
									track group.competence
								) {
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
														<li>
															- {{ criterion }}
														</li>
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
								{{ position + 2 }}. Matr&iacute;z de
								Ponderaci&oacute;n {{ position + 1 }}:
								Competencia {{ group.competence }}
							</h3>
							<table
								style="table-layout: fixed; margin-bottom: 24px"
							>
								<tbody>
									<tr>
										<td></td>
										<td></td>
										<td
											[attr.colspan]="
												group.grading.length
											"
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
										@for (
											row of group.grading;
											track $index
										) {
											<td
												style="
													line-height: 1.15;
													font-weight: normal;
												"
											>
												{{ row.activity }} ({{
													row.activityType
												}})<br /><b
													>{{ row.points }} Puntos</b
												>
											</td>
										}
										<td>{{ group.total }}</td>
									</tr>
									@for (student of students(); track $index) {
										<tr>
											<th>{{ $index + 1 }}</th>
											<td>
												{{ student.firstname }}
												{{ student.lastname }}
											</td>
											@for (
												row of group.grading;
												track row
											) {
												<td></td>
											}
											<td></td>
										</tr>
									}
								</tbody>
							</table>
						}
					</div>
				</div>
			</div>
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
	#store = inject(Store);
	scoreSystem = input<ScoreSystem>();

	user = this.#store.selectSignal(selectAuthUser);
	students = this.#store.selectSignal(selectSectionStudents);

	grouped: GroupedGradingActivity[] = [];

	ngOnInit() {
		const system = this.scoreSystem();
		if (system) {
			this.grouped = this.groupByCompetence(system.activities);
			this.#store.dispatch(
				loadStudentsBySection({ sectionId: system.section._id }),
			);
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
		const system = this.scoreSystem();
		if (system) {
			return [system.content].flat();
		} else {
			return [];
		}
	}
}
