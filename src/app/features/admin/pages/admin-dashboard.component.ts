import { Component, inject } from '@angular/core';
import { UserSettingsService } from '../../../core/services/user-settings.service';
import { UserSubscriptionService } from '../../../core/services/user-subscription.service';
import { UnitPlanService } from '../../../core/services/unit-plan.service';
import { ClassPlansService } from '../../../core/services/class-plans.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AsyncPipe } from '@angular/common';
import { map, of, switchMap } from 'rxjs';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
	selector: 'app-admin-dashboard',
	imports: [
		MatCardModule,
		MatButtonModule,
		MatIconModule,
		RouterLink,
		AsyncPipe,
	],
	template: `
		<mat-card>
			<mat-card-header>
				<mat-card-title>Panel de Administraci&oacute;n</mat-card-title>
			</mat-card-header>
			<mat-card-content> </mat-card-content>
			<mat-card-actions>
				<div style="display: flex; gap: 12px;">
					<button
						mat-flat-button
						color="primary"
						type="button"
						routerLink="/admin/content-blocks"
					>
						Bloques de Cotenido
					</button>
					<button
						mat-flat-button
						color="primary"
						type="button"
						routerLink="/admin/main-themes"
					>
						Ejes Transversales
					</button>
					<button
						mat-flat-button
						color="primary"
						type="button"
						routerLink="/admin/competence-entries"
					>
						Competencias
					</button>
				</div>
			</mat-card-actions>
		</mat-card>

		<div class="grid">
			<mat-card routerLink="/admin/users">
				<mat-card-header style="justify-content: center">
					<mat-card-title>Usuarios Registrados</mat-card-title>
				</mat-card-header>
				<mat-card-content>
					<p class="giant-text">{{ users$ | async }}</p>
				</mat-card-content>
			</mat-card>
			<mat-card>
				<mat-card-header style="justify-content: center">
					<mat-card-title>Suscripciones</mat-card-title>
				</mat-card-header>
				<mat-card-content>
					<p class="giant-text">{{ subscriptions$ | async }}</p>
				</mat-card-content>
			</mat-card>
			<mat-card>
				<mat-card-header style="justify-content: center">
					<mat-card-title>Unidades Generadas</mat-card-title>
				</mat-card-header>
				<mat-card-content>
					<p class="giant-text">{{ unitPlans$ | async }}</p>
				</mat-card-content>
			</mat-card>
			<mat-card>
				<mat-card-header style="justify-content: center">
					<mat-card-title>Planes Diarios</mat-card-title>
				</mat-card-header>
				<mat-card-content>
					<p class="giant-text">{{ classPlans$ | async }}</p>
				</mat-card-content>
			</mat-card>
		</div>
		<!-- <div style="margin-bottom: 12px;">
			<mat-card>
				<mat-card-header style="justify-content: center">
					<mat-card-title>Ingresos por Subscripcion Hasta Hoy</mat-card-title>
				</mat-card-header>
				<mat-card-content>
					<p class="giant-text">{{ dopRate | currency : 'dop' : 'RD$' }}</p>
			</mat-card-content>
			</mat-card>
		</div>
		<div style="margin-top: 12px; margin-bottom: 12px;">
			<mat-card>
				<mat-card-header style="justify-content: center">
					<mat-card-title>Media de Pago por usuario</mat-card-title>
				</mat-card-header>
				<mat-card-content>
					<p class="giant-text">{{ dopRate / subs | currency : 'dop' : 'RD$' }}</p>
			</mat-card-content>
			</mat-card>
		</div> -->
	`,
	styles: `
		.grid {
			display: grid;
			grid-template-columns: 1fr;
			gap: 12px;
			margin-top: 12px;
			margin-bottom: 12px;

			@media screen and (min-width: 720px) {
				grid-template-columns: 1fr 1fr;
			}

			@media screen and (min-width: 960px) {
				grid-template-columns: 1fr 1fr;
			}

			@media screen and (min-width: 1200px) {
				grid-template-columns: 1fr 1fr 1fr 1fr;
			}
		}

		.giant-text {
			font-size: 5em;
			font-weight: thin;
			padding: 21px;
			margin: 21px;
			text-align: center;
		}

		mat-card {
			cursor: pointer;
		}
	`,
})
export class AdminDashboardComponent {
	#userService = inject(UserSettingsService);
	#unitPlanService = inject(UnitPlanService);
	#classPlanService = inject(ClassPlansService);
	#subscriptionService = inject(UserSubscriptionService);
	http = inject(HttpClient);

	endpoint =
		'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json';
	dopRate = 0;
	subs = 0;

	users$ = this.#userService.countUsers().pipe(map((res) => res.users));
	unitPlans$ = this.#unitPlanService.countPlans().pipe(map((e) => e.plans));
	classPlans$ = this.#classPlanService.countPlans().pipe(map((e) => e.plans));
	subscriptions$ = this.#subscriptionService.countSubscriptions().pipe(
		map((e) => {
			this.subs = e.subscriptions;
			return e.subscriptions;
		}),
	);
	revenue$ = this.#subscriptionService
		.findAll()
		.pipe(map((e) => e.reduce((acc, sub) => acc + sub.amount, 0)));

	async fetchRate() {
		of(await (await fetch(this.endpoint)).json())
			.pipe(
				map((res: any) => {
					console.log(res);
					return res.usd.dop;
				}),
				switchMap((dopRate) =>
					this.revenue$.pipe(map((rev) => rev * dopRate)),
				),
			)
			.subscribe((res) => {
				this.dopRate = res;
			});
	}

	ngOnInit() {
		this.fetchRate();
	}
}
