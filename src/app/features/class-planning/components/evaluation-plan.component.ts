import { Component, input } from '@angular/core';
import { EvaluationPlan } from '../../../core/models/evaluation-plan';
import { MatTableModule } from '@angular/material/table';
import { PretifyPipe, SimpleList } from '../../../shared';

@Component({
	selector: 'app-evaluation-plan',
	imports: [
		MatTableModule,
		SimpleList,
		PretifyPipe,
	],
	template: `
		@if (plan(); as plan) {
			<div>
				<h2 style="text-align: center">Planificación de la evaluación de las competencias</h2>
				<table>
					<thead>
						<tr>
							<th>
								<div>Área curricular <span style="font-weight: normal;">{{ plan.unitPlan.subjects.join(', ') | pretify }}</span></div>
								<div>Grado <span style="font-weight: normal;">{{ plan.classSection.name }}</span></div>
							</th>
							<th>Tipos de evaluación</th>
							<th>Evaluación según los participantes</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>
								<div>
									<div><b>Competencia específicas del grado</b>:</div>
									@for (comp of plan.competence; track comp) {
										<app-simple-list [items]="comp.entries" />
									}
								</div>
							</td>
							<td><app-simple-list [items]="plan.evaluationTypes" /></td>
							<td><app-simple-list [items]="plan.evaluationParticipants" /></td>
						</tr>
					</tbody>
				</table>
			</div>

			@for (area of plan.evaluationEntries; track $index) {
				<div style="margin-top: 24px; padding-bottom: 24px;">
					@if ($index == 0) {
						<h4 style="text-align: center">{{ area.subject | pretify }}</h4>
					}
					<table style="width: 100%; border-collapse: collapse; margin-top: 8px">
						<tbody>
							<tr>
								<th colspan="4">
									Aspecto de la competencia específica del grado
								</th>
								<th colspan="4">
									Indicadores de Logro
								</th>
								<th colspan="4">
									Criterios
								</th>
							</tr>
							<tr>
								<td colspan="4">
									{{ area.specificCompetenceAspect }}
								</td>
								<td colspan="4">
									<app-simple-list [items]="area.achievementIndicators" />
								</td>
								<td colspan="4">
									<app-simple-list [items]="area.criteria" />
								</td>
							</tr>
							@for (block of area.evaluationBlocks; track block; let i = $index) {
								@if (i == 0) {
									<tr>
										<th style="text-align: center" colspan="12">{{ block.competence | pretify }}</th>
									</tr>
									<tr>
										<th colspan="3">Aspecto del Indicador</th>
										<th colspan="3">Evidencias</th>
										<th colspan="3">Ponderación</th>
										<th colspan="3">Instrumento (s)</th>
									</tr>
								}
								<tr>
									<td colspan="3">{{ block.achievementIndicatorAspect }}</td>
									<td colspan="3"><app-simple-list [items]="block.evidences" /></td>
									<td colspan="3">{{ block.weighting }}</td>
									<td colspan="3">{{ block.instrument }}</td>
								</tr>
							}
						</tbody>
					</table>
				</div>
			}
		}
	`,
	styles: `
		table {
			width: 100%;
			border-collapse: collapse;
		}

		th,
		td {
			border: 1px solid #ccc;
			padding: 8px;
			text-align: left;
		}

		th {
			background-color: #f5f5f5;
			font-weight: bold;
		}
	`,
})
export class EvaluationPlanComponent {
	displayedColumns = [
		'curricularArea',
		'evaluationTypes',
		'evaluationParticipants',
	];
	plan = input<EvaluationPlan | null>(null);
}
