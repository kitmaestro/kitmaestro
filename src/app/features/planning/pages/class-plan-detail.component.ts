import { Component, computed, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PdfService } from '../../../core/services/pdf.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { Subject, tap } from 'rxjs';
import { ClassPlan } from '../../../core';
import { PretifyPipe } from '../../../shared/pipes/pretify.pipe';
import { UserSubscriptionService } from '../../../core/services';
import { AsyncPipe, DatePipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { selectSelectedClassPlan } from '../../../store/class-plans/class-plans.selectors';
import { selectAuthUser, selectAuthUserSettings } from '../../../store/auth/auth.selectors';
import {
	deleteClassPlan,
	downloadClassPlan,
	loadClassPlan,
} from '../../../store/class-plans/class-plans.actions';
import { selectIsPremium } from '../../../store/user-subscriptions/user-subscriptions.selectors';
import { loadCurrentSubscription } from '../../../store';

@Component({
	selector: 'app-class-plan-detail',
	imports: [
		RouterModule,
		MatSnackBarModule,
		MatCardModule,
		MatButtonModule,
		DatePipe,
		PretifyPipe,
		AsyncPipe,
	],
	template: `
		<div class="content-container">
			<div
				style="display: flex; gap: 12px; margin: 24px 0; justify-content: center;"
			>
				<button
					type="button"
					mat-button
					color="link"
					(click)="goBack()"
				>
					Volver
				</button>
				<button
					type="button"
					mat-button
					color="warn"
					style="display: none"
					(click)="deletePlan()"
				>
					Eliminar
				</button>
				<button
					type="button"
					style="display: none"
					mat-button
					color="accent"
					[routerLink]="['/planning', 'class-plans', planId, 'edit']"
				>
					Editar
				</button>
				<button
					type="button"
					mat-button
					color="primary"
					(click)="printPlan()"
				>
					Descargar PDF
				</button>
				<button
					type="button"
					mat-button
					color="primary"
					[attr.title]="
						!isPremium()
							? 'Necesitas una suscripcion para descargar los planes'
							: undefined
					"
					(click)="downloadPlan()"
					[disabled]="printing || !isPremium()"
				>
					Descargar DOCX
				</button>
			</div>
			@if (plan$ | async; as plan) {
				<table>
					<thead>
						@if (settings$ | async; as user) {
							<tr>
								<td style="width: 160px">
									<b>Fecha</b>:
									{{
										plan.date | date: 'dd/MM/yyyy' : 'UTC+4'
									}}
								</td>
								<td style="width: 280px">
									<b>Grado y Sección</b>:
									{{ plan.section.name }}
								</td>
								<td>
									<b>Docente</b>: {{ plan.user.title }}.
									{{ plan.user.firstname }}
									{{ plan.user.lastname }}
								</td>
								<td colspan="2">
									<b>Área Curricular</b>:
									{{ plan.subject || '' | pretify }}
								</td>
							</tr>
						}
						<tr>
							<td colspan="4">
								<b
									>Estrategias y técnicas de
									enseñanza-aprendizaje</b
								>:
								<ul
									style="margin: 0; padding: 0; list-style: none"
								>
									@for (
										strategy of plan.strategies;
										track strategy
									) {
										<li>- {{ strategy }}</li>
									}
								</ul>
							</td>
						</tr>
						<tr>
							<td colspan="4">
								<b>Intencion Pedag&oacute;gica</b>:
								{{ plan.objective }}
							</td>
						</tr>
						<tr>
							<td colspan="4">
								<b>Competencia Específica</b>:
								{{ plan.competence }}
							</td>
						</tr>
						@if (achievementIndicatorInClassPlans() && plan.achievementIndicator) {
							<tr>
								<td colspan="4">
									<b>Indicador de Logro</b>:
									{{ plan.achievementIndicator }}
								</td>
							</tr>
						}
						<tr>
							<th>Momento / Duración</th>
							<th>Actividades</th>
							<th style="width: 18%">
								Organización de los Estudiantes
							</th>
							<th style="width: 15%">Recursos</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>
								<b>Inicio</b> ({{ plan.introduction.duration }}
								Minutos)
							</td>
							<td>
								<ul
									style="margin: 0; padding: 0; list-style: none"
								>
									@for (
										actividad of plan.introduction
											.activities;
										track actividad
									) {
										<li>
											{{ actividad.replaceAll('**', '') }}
										</li>
									}
								</ul>
							</td>
							<td>
								{{ plan.introduction.layout }}
							</td>
							<td>
								<ul
									style="margin: 0; padding: 0; list-style: none"
								>
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
								<b>Desarrollo</b> ({{ plan.main.duration }}
								Minutos)
							</td>
							<td>
								<ul
									style="margin: 0; padding: 0; list-style: none"
								>
									@for (
										actividad of plan.main.activities;
										track actividad
									) {
										<li>
											{{ actividad.replaceAll('**', '') }}
										</li>
									}
								</ul>
							</td>
							<td>
								{{ plan.main.layout }}
							</td>
							<td>
								<ul
									style="margin: 0; padding: 0; list-style: none"
								>
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
							<td>
								<b>Cierre</b> ({{ plan.closing.duration }}
								Minutos)
							</td>
							<td>
								<ul
									style="margin: 0; padding: 0; list-style: none"
								>
									@for (
										actividad of plan.closing.activities;
										track actividad
									) {
										<li>
											{{ actividad.replaceAll('**', '') }}
										</li>
									}
								</ul>
							</td>
							<td>
								{{ plan.closing.layout }}
							</td>
							<td>
								<ul
									style="margin: 0; padding: 0; list-style: none"
								>
									@for (
										recurso of plan.closing.resources;
										track recurso
									) {
										<li>- {{ recurso }}</li>
									}
								</ul>
							</td>
						</tr>
						@if (complementaryActivitiesInClassPlans() && plan.supplementary.activities.length > 0) {
							<tr>
								<td><b>Actividades Complementarias</b></td>
								<td>
									<ul
										style="margin: 0; padding: 0; list-style: none"
									>
										@for (
											actividad of plan.supplementary
												.activities;
											track actividad
										) {
											<li>
												{{
													actividad.replaceAll(
														'**',
														''
													)
												}}
											</li>
										}
									</ul>
								</td>
								<td>
									{{ plan.supplementary.layout }}
								</td>
								<td>
									<ul
										style="margin: 0; padding: 0; list-style: none"
									>
										@for (
											recurso of plan.supplementary
												.resources;
											track recurso
										) {
											<li>- {{ recurso }}</li>
										}
									</ul>
								</td>
							</tr>
						}
						<tr>
							<td colspan="4">
								<b>Vocabulario del día/de la semana</b>:
								{{ plan.vocabulary.join(', ') }}
							</td>
						</tr>
						<tr>
							<td colspan="4">
								<b>Lecturas recomendadas o libro de la semana</b
								>:
								{{ plan.readings }}
							</td>
						</tr>
						<tr>
							<td colspan="4"><b>Observaciones</b>:</td>
						</tr>
					</tbody>
				</table>
			}
		</div>
	`,
	styles: `
		:host {
			display: block;
			margin-bottom: 42px;
		}
		.page {
			padding: 0.5in;
			margin: 42px auto 0;
			background-color: white;
			min-width: 1400px;
		}
		.content-container {
			padding-bottom: 42px;
		}
		.shadow {
			box-shadow: 10px 10px 14px 0px rgba(0, 0, 0, 0.75);
			-webkit-box-shadow: 10px 10px 14px 0px rgba(0, 0, 0, 0.75);
			-moz-box-shadow: 10px 10px 14px 0px rgba(0, 0, 0, 0.75);
		}
		table {
			border-collapse: collapse;
			border: 1px solid gray;
			background-color: white;
			width: 100%;
			min-width: 10in;
		}

		td,
		th {
			border: 1px solid #ccc;
			padding: 8px;
		}
	`,
})
export class ClassPlanDetailComponent implements OnInit {
	route = inject(ActivatedRoute);
	router = inject(Router);
	#store = inject(Store);
	planId = this.route.snapshot.paramMap.get('id') || '';
	plan$ = this.#store.select(selectSelectedClassPlan).pipe(
		tap((plan) => {
			this.plan = plan;
		}),
	);
	settings$ = this.#store.select(selectAuthUser);
	userSubscriptionService = inject(UserSubscriptionService);
	sb = inject(MatSnackBar);
	settings = this.#store.selectSignal(selectAuthUserSettings);
	complementaryActivitiesInClassPlans = computed(() => {
		const settings = this.settings()
		return settings ? settings['complementaryActivitiesInClassPlans'] : false
	})
	achievementIndicatorInClassPlans = computed(() => {
		const settings = this.settings()
		return settings ? settings['achievementIndicatorInClassPlans'] : false
	})
	pdfService = inject(PdfService);
	plan: ClassPlan | null = null;
	printing = false;

	isPremium = this.#store.selectSignal(selectIsPremium);

	pretify = new PretifyPipe().transform;

	destroy$ = new Subject<void>();

	ngOnInit() {
		this.#store.dispatch(loadClassPlan({ planId: this.planId }));
		this.#store.dispatch(loadCurrentSubscription());
	}

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
		await this.#store.dispatch(downloadClassPlan({ plan: this.plan }));
		this.printing = false;
	}

	deletePlan() {
		this.#store.dispatch(deleteClassPlan({ planId: this.planId }));
		this.router.navigateByUrl('/planning/class-plans');
	}

	goBack() {
		window.history.back();
	}
}
