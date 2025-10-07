import { Component, inject, signal } from '@angular/core';
import {
	DiagnosticEvaluationService,
	UserService,
} from '../../core/services';
import { GeneratedEvaluation, User } from '../../core/interfaces';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { IsPremiumComponent } from '../../shared/ui/is-premium.component';

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
			<mat-card>
				<mat-card-header class="header">
					<h2 class="title" mat-card-title>
						Mis Evaluaciones Diagnósticas
					</h2>
					<a
						mat-flat-button
						color="primary"
						routerLink="/diagnostic-evaluation-generator"
					>
						Crear Nueva Evaluación
					</a>
				</mat-card-header>
				<mat-card-content>
					@if (evaluations().length === 0) {
						<div class="no-evaluations">
							<p>No tienes evaluaciones guardadas.</p>
							<a
								mat-flat-button
								color="primary"
								routerLink="/diagnostic-evaluation-generator"
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
														color="primary"
														[routerLink]="[
															'/diagnostic-evaluations',
															eval._id,
														]"
														matTooltip="Ver Evaluación"
													>
														<mat-icon
															>open_in_new</mat-icon
														>
													</button>
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
												</div>
											</td>
										</tr>
									}
								</tbody>
							</table>
						</div>
					}
				</mat-card-content>
			</mat-card>
	`,
	styles: `
		.evaluations-list,
		.no-evaluations {
			padding: 16px 0;
		}

		.no-evaluations {
			text-align: center;
		}

		mat-card-header.header {
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
	private diagnosticEvaluationService = inject(DiagnosticEvaluationService);
	private UserService = inject(UserService);

	User = signal<User | null>(null);

	evaluations = signal<GeneratedEvaluation[]>([]);

	ngOnInit() {
		this.loadUser();
	}

	loadUser() {
		this.UserService.getSettings().subscribe({
			next: (settings) => {
				this.User.set(settings);
				this.loadEvaluations();
			},
			error: (err) => console.error('Error loading user settings', err),
		});
	}

	loadEvaluations() {
		console.log({ user: this.User()?._id });
		this.diagnosticEvaluationService
			.findAll({ user: this.User()?._id })
			.subscribe({
				next: (evaluations) => {
					this.evaluations.set(evaluations);
				},
				error: (err) => console.error('Error loading evaluations', err),
			});
	}

	deleteEvaluation(id: string) {
		if (!confirm('¿Estás seguro de que deseas eliminar esta evaluación?')) {
			return;
		}
		this.diagnosticEvaluationService.delete(id).subscribe({
			next: () => {
				this.evaluations.set(
					this.evaluations().filter((e) => e._id !== id),
				);
			},
			error: (err) => console.error('Error deleting evaluation', err),
		});
	}
}
