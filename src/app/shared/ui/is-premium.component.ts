import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { map, Observable, tap } from 'rxjs';
import { UserSubscriptionService } from '../../core/services/user-subscription.service';

@Component({
	selector: 'app-is-premium',
	imports: [
		RouterModule,
		CommonModule,
		MatCardModule,
		MatListModule,
		MatButtonModule,
		AsyncPipe,
	],
	template: `
		<div style="margin: 20px">
			<ng-container *ngIf="isPremium$ | async; else buySubscription">
				<ng-content></ng-content>
			</ng-container>

			<ng-template #buySubscription>
				<div *ngIf="!loading">
					<mat-card>
						<mat-card-header>
							<h2>
								¡Bienvenido al Contenido Premium de KitMaestro!
							</h2>
						</mat-card-header>
						<mat-card-content>
							<p>
								Has llegado a un recurso exclusivo disponible
								para nuestros usuarios premium. <br /><br />Con
								tu
								<a
									mat-raised-button
									color="accent"
									[routerLink]="['/buy']"
									>suscripción premium</a
								>
								tendrás acceso ilimitado a herramientas y
								recursos que te ayudarán a potenciar tu labor
								como docente.
							</p>
							<h3>
								¿Por qué actualizar a la suscripción premium?
							</h3>
							<mat-list>
								<mat-list-item>
									Desbloquea todas las herramientas de control
									de datos, asistentes de planificación y
									calculadoras diseñadas especialmente para el
									docente dominicano.
								</mat-list-item>
								<mat-list-item>
									Accede a guías detalladas y generadores de
									contenido que facilitarán tu trabajo diario.
								</mat-list-item>
								<mat-list-item>
									Obtén un código de afiliado para compartir
									con tus colegas y ganar beneficios
									adicionales.
								</mat-list-item>
							</mat-list>
							<p>
								No te pierdas la oportunidad de llevar tu
								experiencia educativa al siguiente nivel.
								¡Adquiere la suscripción premium ahora y
								descubre todo lo que KitMaestro tiene para
								ofrecerte!
							</p>
						</mat-card-content>
					</mat-card>
				</div>
			</ng-template>
		</div>
	`,
})
export class IsPremiumComponent implements OnInit {
	private userSubscriptionService = inject(UserSubscriptionService);

	public isPremium$: Observable<boolean> = this.userSubscriptionService
		.checkSubscription()
		.pipe(
			map(
				(sub) =>
					sub.status === 'active' &&
					!sub.subscriptionType.toLowerCase().includes('free') &&
					+new Date(sub.endDate) > +new Date(),
			),
			tap((premium) => {
				this.loading = false;
				this.onLoaded.emit(premium);
			}),
		);
	public loading = true;

	@Output() onLoaded = new EventEmitter<boolean>();

	ngOnInit() {}
}
