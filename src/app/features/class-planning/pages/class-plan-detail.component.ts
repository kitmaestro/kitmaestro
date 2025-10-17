import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ClassPlansService } from '../../../core/services/class-plans.service';
import { UserService } from '../../../core/services/user.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PdfService } from '../../../core/services/pdf.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { tap } from 'rxjs';
import { ClassPlan } from '../../../core/interfaces/class-plan';
import { PretifyPipe } from '../../../shared/pipes/pretify.pipe';

@Component({
	selector: 'app-class-plan-detail',
	imports: [
		RouterModule,
		CommonModule,
		MatSnackBarModule,
		MatCardModule,
		MatButtonModule,
		PretifyPipe,
	],
	template: `
		<mat-card>
			<mat-card-content>
				<h2 style="text-align: center">Opciones</h2>
				<div style="display: flex; gap: 12px">
					<button
						type="button"
						mat-raised-button
						color="link"
						(click)="goBack()"
					>
						Volver
					</button>
					<button
						type="button"
						mat-raised-button
						color="warn"
						(click)="deletePlan()"
					>
						Eliminar
					</button>
					<button
						type="button"
						mat-raised-button
						color="accent"
						[routerLink]="['/class-plans', planId, 'edit']"
					>
						Editar
					</button>
					<button
						type="button"
						mat-raised-button
						color="primary"
						(click)="printPlan()"
					>
						Descargar PDF
					</button>
					<button
						type="button"
						mat-raised-button
						color="primary"
						(click)="downloadPlan()"
						[disabled]="printing"
					>
						Descargar DOCX
					</button>
				</div>
			</mat-card-content>
		</mat-card>
		<div class="shadow" *ngIf="plan$ | async as plan">
			<div class="page" id="class-plan">
				<table
					style="
						border-collapse: collapse;
						border: 1px solid gray;
						background-color: white;
						width: 100%;
					"
				>
					<thead>
						<tr *ngIf="settings$ | async as user">
							<td style="width: 160px">
								<b>Fecha</b>:
								{{ plan.date | date: "dd/MM/yyyy" : "UTC+4" }}
							</td>
							<td style="width: 280px">
								<b>Grado y Sección</b>: {{ plan.section.name }}
							</td>
							<td>
								<b>Docente</b>: {{ plan.user.title }}.
								{{ plan.user.firstname }} {{ plan.user.lastname }}
							</td>
							<td colspan="2">
								<b>Área Curricular</b>:
								{{ plan.subject || "" | pretify }}
							</td>
						</tr>
						<tr>
							<td colspan="5">
								<b>Estrategias y técnicas de enseñanza-aprendizaje</b>:
								{{ plan.strategies.join(", ") }}
							</td>
						</tr>
						<tr>
							<td colspan="5">
								<b>Intencion Pedag&oacute;gica</b>: {{ plan.objective }}
							</td>
						</tr>
						<tr>
							<th>Momento / Duración</th>
							<th style="width: 18%">Competencias Especificas</th>
							<th>Actividades</th>
							<th style="width: 18%">Organización de los Estudiantes</th>
							<th style="width: 15%">Recursos</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>
								<b>Inicio</b> ({{ plan.introduction.duration }} Minutos)
							</td>
							<td rowspan="4">{{ plan.competence }}</td>
							<td>
								<ul style="margin: 0; padding: 0; list-style: none">
									@for (
										actividad of plan.introduction.activities;
										track actividad
									) {
										<li>{{ actividad }}</li>
									}
								</ul>
							</td>
							<td>
								{{ plan.introduction.layout }}
							</td>
							<td>
								<ul style="margin: 0; padding: 0; list-style: none">
									@for (
										recurso of plan.introduction.resources;
										track recurso
									) {
										<li>- {{ recurso }}</li>
									}
								</ul>
							</td>
						</tr>
						<tr>
							<td>
								<b>Desarrollo</b> ({{ plan.main.duration }} Minutos)
							</td>
							<td>
								<ul style="margin: 0; padding: 0; list-style: none">
									@for (
										actividad of plan.main.activities;
										track actividad
									) {
										<li>{{ actividad }}</li>
									}
								</ul>
							</td>
							<td>
								{{ plan.main.layout }}
							</td>
							<td>
								<ul style="margin: 0; padding: 0; list-style: none">
									@for (
										recurso of plan.main.resources;
										track recurso
									) {
										<li>- {{ recurso }}</li>
									}
								</ul>
							</td>
						</tr>
						<tr>
							<td><b>Cierre</b> ({{ plan.closing.duration }} Minutos)</td>
							<td>
								<ul style="margin: 0; padding: 0; list-style: none">
									@for (
										actividad of plan.closing.activities;
										track actividad
									) {
										<li>{{ actividad }}</li>
									}
								</ul>
							</td>
							<td>
								{{ plan.closing.layout }}
							</td>
							<td>
								<ul style="margin: 0; padding: 0; list-style: none">
									@for (
										recurso of plan.closing.resources;
										track recurso
									) {
										<li>- {{ recurso }}</li>
									}
								</ul>
							</td>
						</tr>
						<tr>
							<td><b>Actividades Complementarias</b></td>
							<td>
								<ul style="margin: 0; padding: 0; list-style: none">
									@for (
										actividad of plan.supplementary.activities;
										track actividad
									) {
										<li>{{ actividad }}</li>
									}
								</ul>
							</td>
							<td>
								{{ plan.supplementary.layout }}
							</td>
							<td>
								<ul style="margin: 0; padding: 0; list-style: none">
									@for (
										recurso of plan.supplementary.resources;
										track recurso
									) {
										<li>- {{ recurso }}</li>
									}
								</ul>
							</td>
						</tr>
						<tr>
							<td colspan="5">
								<b>Vocabulario del día/de la semana</b>:
								{{ plan.vocabulary.join(", ") }}
							</td>
						</tr>
						<tr>
							<td colspan="5">
								<b>Lecturas recomendadas/ o libro de la semana</b>:
								{{ plan.readings }}
							</td>
						</tr>
						<tr>
							<td colspan="5"><b>Observaciones</b>:</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	`,
	styles: `
		.page {
			padding: 0.5in;
			margin: 42px auto 0;
			background-color: white;
			min-width: 1400px;
		}

		.shadow {
			box-shadow: 10px 10px 14px 0px rgba(0, 0, 0, 0.75);
			-webkit-box-shadow: 10px 10px 14px 0px rgba(0, 0, 0, 0.75);
			-moz-box-shadow: 10px 10px 14px 0px rgba(0, 0, 0, 0.75);
		}

		td,
		th {
			border: 1px solid #ccc;
			padding: 8px;
		}
	`,
})
export class ClassPlanDetailComponent {
	route = inject(ActivatedRoute);
	router = inject(Router);
	planId = this.route.snapshot.paramMap.get('id') || '';
	classPlanService = inject(ClassPlansService);
	plan$ = this.classPlanService.find(this.planId).pipe(
		tap((plan) => {
			this.plan = plan;
		}),
	);
	UserService = inject(UserService);
	settings$ = this.UserService.getSettings();
	sb = inject(MatSnackBar);
	pdfService = inject(PdfService);
	plan: ClassPlan | null = null;
	printing = false;

	pretify = new PretifyPipe().transform;

	printPlan() {
		this.sb.open(
			'La descarga empezara en un instante. No quites esta pantalla hasta que finalicen las descargas.',
			'Ok',
			{ duration: 3000 },
		);
		this.plan$.subscribe((plan) => {
			if (plan) {
				this.pdfService.createAndDownloadFromHTML(
					'class-plan',
					`Plan de Clases ${plan.section.name} de ${plan.section.level.toLowerCase()} - ${this.pretify(plan.subject || '')}`,
					false,
				);
			}
		});
	}

	async downloadPlan() {
		if (!this.plan) {
			this.sb.open(
				'El plan no ha sido encontrado o cargado todavia',
				'Ok',
				{ duration: 2500 },
			);
			return;
		}
		this.printing = true;
		await this.classPlanService.download(this.plan);
		this.printing = false;
	}

	deletePlan() {
		this.classPlanService.deletePlan(this.planId).subscribe((res) => {
			if (res.deletedCount === 1) {
				this.router.navigate(['/class-plans']).then(() => {
					this.sb.open('Se ha eliminado el plan', 'Ok', {
						duration: 2500,
					});
				});
			}
		});
	}

	goBack() {
		window.history.back();
	}
}
