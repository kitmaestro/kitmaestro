import { Component, effect, inject } from '@angular/core'
import { MatCardModule } from '@angular/material/card'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatListModule } from '@angular/material/list'
import { MatTooltipModule } from '@angular/material/tooltip'
import { RouterLink } from '@angular/router'
import { DatePipe } from '@angular/common'
import { Store } from '@ngrx/store'
import { deleteEvaluation, loadEvaluations, selectAllEvaluations, selectAuthUser } from '../../../store'

@Component({
	selector: 'app-diagnostic-evaluations',
	imports: [
		MatCardModule,
		MatButtonModule,
		MatIconModule,
		RouterLink,
		DatePipe,
		MatTooltipModule,
		MatListModule,
	],
	template: `
		<div>
			<div class="header">
				<h2 class="title">
					Mis Evaluaciones Diagnósticas
				</h2>
				<a
					mat-flat-button
					color="primary"
					routerLink="/assessments/diagnostic-evaluation-generator"
				>
					Crear Nueva Evaluación
				</a>
			</div>
			<div>
				@if (evaluations().length === 0) {
					<div class="no-evaluations">
						<p>No tienes evaluaciones guardadas.</p>
						<a
							mat-flat-button
							color="primary"
							routerLink="/assessments/diagnostic-evaluation-generator"
						>
							Crear Nueva Evaluación
						</a>
					</div>
				}
				@if (evaluations().length > 0) {
					<div class="evaluations-list">
						<table style="width: 100%; margin-bottom: 16px;">
							<thead>
								<tr>
									<th style="text-align: left;">Título</th>
									<th style="text-align: left;">
										Asignatura - Curso
									</th>
									<th style="text-align: left;">
										Fecha de Creación
									</th>
									<th style="text-align: right;">Acciones</th>
								</tr>
							</thead>
							<tbody>
								@for (eval of evaluations(); track eval._id) {
									<tr>
										<td>{{ eval.title }}</td>
										<td>
											{{ eval.subject }} -
											{{ eval.schoolYear }}
										</td>
										@if (eval.createdAt) {
											<td>
												Creada el:
												{{
													eval.createdAt
														| date: 'medium'
												}}
											</td>
										}
										<td>
											<div
												style="display: flex; justify-content: flex-end; gap: 8px;"
											>
												<button
													mat-icon-button
													color="warn"
													(click)="
														deleteEvaluation(
															eval._id!
														)
													"
													matTooltip="Eliminar Evaluación"
												>
													<mat-icon>delete</mat-icon>
												</button>
												<button
													mat-icon-button
													color="primary"
													[routerLink]="[
														'/assessments/diagnostic-evaluations',
														eval._id,
													]"
													matTooltip="Ver Evaluación"
												>
													<mat-icon
														>open_in_new</mat-icon
													>
												</button>
											</div>
										</td>
									</tr>
								}
							</tbody>
						</table>
					</div>
				}
			</div>
		</div>
	`,
	styles: `
		.evaluations-list,
		.no-evaluations {
			padding: 16px 0;
		}

		.no-evaluations {
			text-align: center;
		}

		div.header {
			padding-bottom: 16px;
			display: flex;
			justify-content: space-between;
			align-items: center;
		}

		table {
			border-collapse: collapse;
			width: 100%;
			// zebra striping
			thead tr {
				background-color: #1976d2;
				color: white;

				th {
					padding: 8px;
					font-weight: bold;
				}
			}
			tbody {
				tr:nth-child(odd) {
					background-color: #f9f9f9;
				}
				tr:nth-child(even) {
					background-color: #fff;
				}
			}
		}
	`,
})
export class DiagnosticEvaluationsComponent {
	#store = inject(Store)
	user = this.#store.selectSignal(selectAuthUser)
	evaluations = this.#store.selectSignal(selectAllEvaluations)

	constructor() {
		effect(() => {
			const user = this.user()
			if (!user) return
			this.#store.dispatch(loadEvaluations({ filters: { user: user._id } }))
		})
	}

	deleteEvaluation(id: string) {
		if (!confirm('¿Estás seguro de que deseas eliminar esta evaluación?')) {
			return
		}
		this.#store.dispatch(deleteEvaluation({ id }))
	}
}
