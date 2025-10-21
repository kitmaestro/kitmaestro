import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { EstimationScaleService } from '../../../core/services/estimation-scale.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PdfService } from '../../../core/services/pdf.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { User } from '../../../core';
import { EstimationScale } from '../../../core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
	selector: 'app-estimation-scale-detail',
	imports: [
		RouterLink,
		MatCardModule,
		MatSnackBarModule,
		MatIconModule,
		MatButtonModule,
	],
	template: `
		@if (estimationScale) {
			<mat-card>
				<mat-card-header>
					<mat-card-title>{{ estimationScale.title }}</mat-card-title>
					<span style="flex: 1 1 auto"></span>
					<a
						routerLink="/assessments/estimation-scales"
						mat-icon-button
						color="link"
						style="margin-right: 8px"
						title="Todas las escalas de estimacion"
					>
						<mat-icon>home</mat-icon>
					</a>
					<button
						mat-icon-button
						color="warn"
						(click)="deleteInstrument()"
						style="margin-right: 8px"
						title="Eliminar esta escala de estimacion"
					>
						<mat-icon>delete</mat-icon>
					</button>
					<!-- <a target="_blank" routerLink="/print-activities/{{id}}" mat-icon-button color="link" style="margin-right: 8px;">
							<mat-icon>print</mat-icon>
						</a> -->
					<button
						(click)="print()"
						mat-icon-button
						color="accent"
						title="Descargar como PDF"
					>
						<mat-icon>download</mat-icon>
					</button>
				</mat-card-header>
				<mat-card-content></mat-card-content>
			</mat-card>
			<mat-card style="margin-top: 24px">
				<mat-card-content>
					<div
						style="width: 8.5in; padding: 0.35in; margin: 0 auto"
						id="estimation-scale"
					>
						<div style="text-align: center">
							<h2 style="margin: 0px">
								{{ estimationScale.user.schoolName }}
							</h2>
							<h3 style="margin: 0px">
								A&ntilde;o Escolar {{ schoolYear }}
							</h3>
							<h3 style="margin: 0px">
								{{ user?.title }}. {{ user?.firstname }}
								{{ user?.lastname }}
							</h3>
							<h2 style="margin: 0px">
								Escala de Estimaci&oacute;n
							</h2>
							<h3 style="margin: 0px">
								{{ estimationScale.title }}
							</h3>
						</div>
						<h3 style="text-align: end">
							{{ estimationScale.section.name }}
						</h3>
						<div
							style="
								display: grid;
								gap: 12px;
								margin-bottom: 12px;
								grid-template-columns: 3fr 1fr;
							"
						>
							<div style="display: flex; gap: 12px">
								<div style="font-weight: bold">Estudiante:</div>
								<div
									style="
										border-bottom: 1px solid black;
										width: 100%;
										flex: 1 1 auto;
									"
								></div>
							</div>
							<div style="display: flex; gap: 12px">
								<div style="font-weight: bold">Fecha:</div>
								<div
									style="
										border-bottom: 1px solid black;
										width: 100%;
										flex: 1 1 auto;
									"
								></div>
							</div>
						</div>
						<h3
							style="
								font-weight: bold;
								margin-bottom: 8px;
								margin-top: 8px;
							"
						>
							Competencias Espec&iacute;ficas
						</h3>
						<ul style="list-style: none; margin: 0; padding: 0">
							@for (
								item of estimationScale.competence;
								track item
							) {
								<li>- {{ item }}</li>
							}
						</ul>
						<h3
							style="
								font-weight: bold;
								margin-bottom: 8px;
								margin-top: 8px;
							"
						>
							Indicadores de Logro
						</h3>
						<ul
							style="list-style: none; margin: 0 0 12px; padding: 0"
						>
							@for (
								item of estimationScale.achievementIndicators;
								track item
							) {
								<li>- {{ item }}</li>
							}
						</ul>
						<p>
							<b>Evidencia o Actividad</b>:
							{{ estimationScale.activity }}
						</p>
						<table>
							<thead>
								<tr>
									<th>Indicador o Criterio</th>
									@for (
										level of estimationScale.levels;
										track level
									) {
										<th>{{ level }}</th>
									}
									<th>Observaciones</th>
								</tr>
							</thead>
							<tbody>
								@for (
									row of estimationScale.criteria;
									track row
								) {
									<tr>
										<td>{{ row }}</td>
										<td></td>
										<td></td>
										<td></td>
										<td></td>
									</tr>
								}
							</tbody>
						</table>
					</div>
				</mat-card-content>
			</mat-card>
		}
	`,
	styles: `
		mat-form-field {
			min-width: 100%;
		}

		.grid-2 {
			display: grid;
			gap: 12px;
			grid-template-columns: 1fr;

			@media screen and (min-width: 960px) {
				grid-template-columns: 1fr 1fr;
			}
		}

		.grid-2-1 {
			display: grid;
			gap: 12px;
			grid-template-columns: 1fr;

			@media screen and (min-width: 960px) {
				grid-template-columns: 2fr 1fr;
			}
		}

		table {
			border-collapse: collapse;
			border: 1px solid #ccc;
			width: 100%;
		}

		td,
		tr,
		th {
			border: 1px solid #ccc;
		}

		td,
		th {
			padding: 12px;
		}
	`,
})
export class EstimationScaleDetailComponent implements OnInit {
	private estimationScaleService = inject(EstimationScaleService);
	private authService = inject(AuthService);
	private pdfService = inject(PdfService);
	private router = inject(Router);
	private route = inject(ActivatedRoute);
	private sb = inject(MatSnackBar);
	private id = this.route.snapshot.paramMap.get('id') || '';

	public user: User | null = null;
	public estimationScale: EstimationScale | null = null;

	public schoolYear =
		new Date().getMonth() > 6
			? `${new Date().getFullYear()} - ${new Date().getFullYear() + 1}`
			: `${new Date().getFullYear() - 1} - ${new Date().getFullYear()}`;

	ngOnInit(): void {
		this.authService.profile().subscribe((user) => {
			if (user) {
				this.user = user;
			}
		});
		this.estimationScaleService.find(this.id).subscribe({
			next: (scale) => {
				if (scale._id) {
					this.estimationScale = scale;
				}
			},
			error: (err) => {
				this.router
					.navigate(['/assessments/estimation-scales'])
					.then(() => {
						this.sb.open(
							'Hubo un error al cargar el documento solicitado.',
							'Ok',
							{ duration: 2500 },
						);
						console.log(err.message);
					});
			},
		});
	}

	deleteInstrument() {
		this.estimationScaleService.delete(this.id).subscribe({
			next: (res) => {
				if (res.deletedCount === 1) {
					this.router
						.navigate(['/assessments/estimation-scales'])
						.then(() => {
							this.sb.open(
								'Se ha eliminado el instrumento',
								'Ok',
								{ duration: 2500 },
							);
						});
				}
			},
			error: (err) => {
				this.sb.open('Error al guardar', 'Ok', { duration: 2500 });
			},
		});
	}

	pretifySubject(name: string) {
		switch (name) {
			case 'LENGUA_ESPANOLA':
				return 'Lengua Española';
			case 'MATEMATICA':
				return 'Matemática';
			case 'CIENCIAS_SOCIALES':
				return 'Ciencias Sociales';
			case 'CIENCIAS_NATURALES':
				return 'Ciencias de la Naturaleza';
			case 'INGLES':
				return 'Inglés';
			case 'FRANCES':
				return 'Francés';
			case 'FORMACION_HUMANA':
				return 'Formación Integral Humana y Religiosa';
			case 'EDUCACION_FISICA':
				return 'Educación Física';
			case 'EDUCACION_ARTISTICA':
				return 'Educación Artística';
			default:
				return 'Talleres Optativos';
		}
	}

	print() {
		if (!this.estimationScale) return;
		this.sb.open(
			'Ya estamos exportando tu instrumento. Espera un momento.',
			'Ok',
			{ duration: 2500 },
		);
		this.pdfService.exportTableToPDF(
			'estimation-scale',
			this.estimationScale.title,
		);
	}
}
