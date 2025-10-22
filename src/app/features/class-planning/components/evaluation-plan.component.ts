import { Component, input } from '@angular/core';
import { EvaluationPlan } from '../../../core/models/evaluation-plan';
import { MatTableModule } from '@angular/material/table';

@Component({
	selector: 'app-evaluation-plan',
	imports: [MatTableModule],
	template: `
		@if (plan(); as plan) {
			<div style="overflow-x: auto;">
				<table
					mat-table
					[dataSource]="plan.evaluationAreas"
					class="mat-elevation-z2"
				>
					<ng-container matColumnDef="curricularArea">
						<th mat-header-cell *matHeaderCellDef>
							Área Curricular
						</th>
						<td mat-cell *matCellDef="let area">
							{{ area.curricularArea }}
						</td>
					</ng-container>

					<ng-container matColumnDef="evaluationTypes">
						<th mat-header-cell *matHeaderCellDef>
							Tipo de Evaluación
						</th>
						<td mat-cell *matCellDef="let area">
							{{ area.evaluationTypes.join(', ') }}
						</td>
					</ng-container>

					<ng-container matColumnDef="evaluationParticipants">
						<th mat-header-cell *matHeaderCellDef>Participantes</th>
						<td mat-cell *matCellDef="let area">
							{{ area.evaluationParticipants.join(', ') }}
						</td>
					</ng-container>

					<tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
					<tr
						mat-row
						*matRowDef="let row; columns: displayedColumns"
					></tr>
				</table>
			</div>

			@for (area of plan.evaluationAreas; track area.curricularArea) {
				<div style="margin-top: 24px">
					<h4>{{ area.curricularArea }}</h4>
					<table
						style="width: 100%; border-collapse: collapse; margin-top: 8px"
					>
						<thead>
							<tr>
								<th
									style="border: 1px solid #ccc; padding: 8px; background: #f5f5f5"
								>
									Aspecto de la Competencia
								</th>
								<th
									style="border: 1px solid #ccc; padding: 8px; background: #f5f5f5"
								>
									Indicadores de Logro
								</th>
								<th
									style="border: 1px solid #ccc; padding: 8px; background: #f5f5f5"
								>
									Criterios
								</th>
								<th
									style="border: 1px solid #ccc; padding: 8px; background: #f5f5f5"
								>
									Evidencias
								</th>
							</tr>
						</thead>
						<tbody>
							@for (
								aspect of area.competenceAspects;
								track aspect.aspect
							) {
								<tr>
									<td
										style="border: 1px solid #ccc; padding: 8px; vertical-align: top"
									>
										{{ aspect.aspect }}
									</td>
									<td
										style="border: 1px solid #ccc; padding: 8px; vertical-align: top"
									>
										<ul
											style="margin: 0; padding-left: 16px"
										>
											@for (
												indicator of aspect.indicators;
												track indicator
											) {
												<li>
													{{ indicator }}
												</li>
											}
										</ul>
									</td>
									<td
										style="border: 1px solid #ccc; padding: 8px; vertical-align: top"
									>
										<ul
											style="margin: 0; padding-left: 16px"
										>
											@for (
												criterion of aspect.criteria;
												track criterion
											) {
												<li>
													{{ criterion }}
												</li>
											}
										</ul>
									</td>
									<td
										style="border: 1px solid #ccc; padding: 8px; vertical-align: top"
									>
										<ul
											style="margin: 0; padding-left: 16px"
										>
											@for (
												evidence of aspect.evidences;
												track evidence.description
											) {
												<li>
													{{ evidence.description }}
													({{ evidence.weighting }}% -
													{{ evidence.instrument }})
												</li>
											}
										</ul>
									</td>
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
