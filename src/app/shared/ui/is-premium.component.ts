import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, inject, OnInit, input, signal, isDevMode } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { map, tap } from 'rxjs';
import { UserSubscriptionService } from '../../core/services/user-subscription.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

declare const paypal: any;

@Component({
	selector: 'app-is-premium',
	imports: [
		CommonModule,
		MatCardModule,
		MatButtonModule,
		MatSnackBarModule,
	],
	template: `
		<div style="margin: 20px">
			@if (loading) {
				<p>Cargando...</p>
			} @else {
				@if (userCanAccess()) {
					<ng-container>
						<ng-content></ng-content>
					</ng-container>
				} @else {
					<mat-card>
						<mat-card-header>
							<h2 style="margin: 0 auto;">Contenido Premium de KitMaestro</h2>
						</mat-card-header>
						<mat-card-content>
							<p style="text-align: center;">Para acceder a esta funcionalidad, necesitas una suscripción activa.</p>
							<p style="text-align: center;">Elige el plan que mejor se adapte a tus necesidades y comienza a disfrutar de todas las ventajas que KitMaestro tiene para ofrecerte.</p>
							<p style="font-size: 1.2em; text-align: center;">¿Cuánto vale tu tiempo?</p>
							<p style="font-size: 1.2em; text-align: center;">¿Cuánto vale tu tranquilidad?</p>
							<div style="display: flex; gap: 20px; flex-wrap: wrap; justify-content: center; margin-top: 20px;">
								<div style="min-width: 300px; border: 1px solid #ccc; border-radius: 8px; padding: 16px; width: 300px; box-shadow: 2px 2px 12px rgba(0,0,0,0.1); text-align: center;">
									<div>
										<h2>Plan B&aacute;sico</h2>
										<div>
											<p>Acceso a funciones b&aacute;sicas</p>
										</div>
										<div>
											<h3 style="font-size: 2em;">$9.58<small style="font-weight: normal; font-size: 12pt;">/mes</small></h3>
										</div>
										<div id="basic-plan-button-container">
										</div>
									</div>
								</div>
								<div style="min-width: 300px; border: 1px solid #ccc; border-radius: 8px; padding: 16px; width: 300px; box-shadow: 2px 2px 12px rgba(0,0,0,0.1); text-align: center;">
									<div >
										<h2>Plan Plus</h2>
										<div>
											<p>Acceso a funciones avanzadas</p>
										</div>
										<div>
											<h3 style="font-size: 2em;">$15.97<small style="font-weight: normal; font-size: 12pt;">/mes</small></h3>
										</div>
										<div id="plus-plan-button-container"></div>
									</div>
								</div>
								<div style="min-width: 300px; border: 1px solid #ccc; border-radius: 8px; padding: 16px; width: 300px; box-shadow: 2px 2px 12px rgba(0,0,0,0.1); text-align: center;">
									<div >
										<h2>Plan Premium</h2>
										<div>
											<p>Acceso a todas las funciones</p>
										</div>
										<div>
											<h3 style="font-size: 2em;">$38.36<small style="font-weight: normal; font-size: 12pt;">/mes</small></h3>
										</div>
										<div id="premium-plan-button-container"></div>
									</div>
								</div>
							</div>
						</mat-card-content>
					</mat-card>
				}
			}
		</div>
	`,
})
export class IsPremiumComponent implements OnInit {
	private userSubscriptionService = inject(UserSubscriptionService);
	private sb = inject(MatSnackBar);

	minSubscriptionType = input<'Plan Basico' | 'Plan Plus' | 'Plan Premium'>('Plan Basico');
	subscription$ = this.userSubscriptionService.subscription$;
	loading = true;
	userCanAccess = signal(false);

	@Output() onLoaded = new EventEmitter<boolean>();
	pricingPlans = [
		{
			id: isDevMode()
				? 'P-1S5529330X126793CNCVNPKQ'
				: 'P-6XC51067601278041NCVPXHY',
			name: 'Plan Básico',
			code: 'Plan Basico',
			price: 9.58,
			container: 'basic-plan-button-container',
		},
		{
			// id: isDevMode() ? 'P-1UE72299DR9852449NCVQGVQ' : 'P-14G421255Y3461609NCVPWCQ', # old one
			id: isDevMode()
				? 'P-1UE72299DR9852449NCVQGVQ'
				: 'P-2A141077RF7045523NCZSTYY',
			name: 'Plan Plus',
			code: 'Plan Plus',
			price: 15.97,
			container: 'plus-plan-button-container',
		},
		{
			id: isDevMode()
				? 'P-4YU16384DJ898973ENCVQHAY'
				: 'P-4YH83305EL092640VNCVPYFQ',
			name: 'Plan Premium',
			code: 'Plan Premium',
			price: 38.36,
			container: 'premium-plan-button-container',
		},
	];

	ngOnInit() {
		const minSubscriptionType = this.minSubscriptionType();
		this.subscription$.pipe(
			map((sub) => {
				if (!sub) return false;
				const accessLevel: number =
					sub.subscriptionType == 'FREE' || sub.status !== 'active' || new Date(sub.endDate) < new Date()
						? 1
						: sub.subscriptionType == 'Plan Básico'
							? 2
							: sub.subscriptionType == 'Plan Plus'
								? 3
								: 4;
				const requiredLevel: number =
					minSubscriptionType == 'Plan Basico'
						? 2
						: minSubscriptionType == 'Plan Plus'
							? 3
							: 4;
				return accessLevel >= requiredLevel;
			}),
			tap(() => {
				this.loading = false;
				this.onLoaded.emit(true);
			}),
		).subscribe((isPremium) => { this.userCanAccess.set(isPremium); setTimeout(() => this.renderButtons(), 1500); });
	}

	rendered = false;

	renderButtons() {
		if (this.rendered) return;
		this.rendered = true;
		const style = {
			shape: 'rect',
			color: 'gold',
			layout: 'vertical',
			label: 'subscribe',
		};
		this.pricingPlans
			.filter((p) => p.price)
			.forEach(({ id: plan_id, name, code, price, container }) => {
				const days = 30;
				paypal
					.Buttons({
						style,
						createSubscription: (data: any, actions: any) =>
							actions.subscription.create({ plan_id }),
						onApprove: () =>
							this.userSubscriptionService
								.subscribe(code, 'PayPal', days, price)
								.subscribe(() => this.alertSuccess(name)),
					})
					.render(`#${container}`);
			});
	}

	alertSuccess(plan: string) {
		this.subscription$.subscribe();
		this.sb.open(
			'Tu suscripción ha sido activada. Gracias por apoyar el desarrollo de KitMaestro!',
			'OK',
			{ duration: 5000 },
		);
	}
}
