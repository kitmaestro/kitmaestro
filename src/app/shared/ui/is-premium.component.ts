import {
	Component,
	inject,
	OnInit,
	input,
	signal,
	isDevMode,
	ChangeDetectionStrategy,
	effect,
} from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { map } from 'rxjs'
import { UserSubscriptionService } from '../../core/services/user-subscription.service'
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'
import { Store } from '@ngrx/store'
import { selectCurrentSubscription } from '../../store/user-subscriptions/user-subscriptions.selectors'
import { loadCurrentSubscription, subscribe } from '../../store/user-subscriptions/user-subscriptions.actions'
import { MatDialog, MatDialogModule } from '@angular/material/dialog'
import { BankAccountComponent } from './bank-account.component'

declare const paypal: any

type PlanType = 'Plan Basico' | 'Plan Plus' | 'Plan Premium'

interface PricingPlan {
	id: string
	name: string
	code: PlanType
	price: number
	level: number
	features: string[]
	container: string
}

@Component({
	selector: 'app-is-premium',
	imports: [MatCardModule, MatButtonModule, MatSnackBarModule, MatDialogModule],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div class="main-container">
			@if (loading()) {
				<div class="spinner-container">
					<span class="spinner large"></span>
				</div>
			} @else {
				@if (userCanAccess()) {
					<ng-container>
						<ng-content></ng-content>
					</ng-container>
				} @else {
					<div class="upgrade-prompt">
						<header class="upgrade-header">
							<h2>Contenido Premium de KitMaestro</h2>
							<p>
								Para acceder a esta funcionalidad,
								necesitas un plan superior.
								Elige el que mejor se adapte a ti.
							</p>
						</header>
						<div class="plans-wrapper">
							@for (plan of filteredPlans(); track plan.id) {
								<div
									class="plan-card"
									[class.recommended]="
										plan.code === 'Plan Plus'
									"
								>
									@if (plan.code === 'Plan Plus') {
										<div class="recommended-badge">
											Recomendado
										</div>
									}
									<h3 class="plan-name">{{ plan.name }}</h3>
									<div class="plan-price">
										<span class="price-amount"
											>\${{ plan.price }}</span
										>
										<span class="price-period">/mes</span>
									</div>
									<ul class="plan-features">
										@for (
											feature of plan.features;
											track feature
										) {
											<li>{{ feature }}</li>
										}
									</ul>
									<div
										class="paypal-button-container"
										[id]="plan.container"
									></div>
								</div>
							}
						</div>
						<div style="text-align: center;">
							<p>Tambien puedes pagar con transferencia bancaria.</p>
							<button mat-button (click)="openBankAccount()">Ver Cuenta Bancaria</button>
						</div>
					</div>
				}
			}
		</div>
	`,
	styles: `
		:host {
			display: block;
			width: 100%;
		}

		.main-container {
			padding: 1rem;
			width: 100%;
		}

		.spinner-container {
			display: flex;
			justify-content: center;
			align-items: center;
			min-height: 200px;
		}

		.upgrade-prompt {
			width: 100%;
			max-width: 1200px;
			margin: 0 auto;
			padding: 1rem;
			animation: fadeIn 0.5s ease-in-out;
		}

		.upgrade-header {
			text-align: center;
			margin-bottom: 2.5rem;
		}

		.upgrade-header h2 {
			font-size: 2rem;
			font-weight: 600;
			margin-bottom: 0.5rem;
		}

		.upgrade-header p {
			font-size: 1.1rem;
			color: #555;
			max-width: 600px;
			margin: 0 auto;
		}

		.plans-wrapper {
			display: flex;
			flex-wrap: wrap;
			justify-content: center;
			gap: 2rem;
		}

		.plan-card {
			flex: 1 1 300px;
			max-width: 350px;
			border: 1px solid #e0e0e0;
			border-radius: 12px;
			padding: 2rem;
			text-align: center;
			background-color: #ffffff;
			box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
			transition:
				transform 0.3s,
				box-shadow 0.3s;
			position: relative;
			overflow: hidden; /* Para el badge */
		}

		.plan-card:hover {
			transform: translateY(-5px);
			box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
		}

		.plan-card.recommended {
			border-color: #005cbb; /* Color primario de Angular Material */
			border-width: 2px;
		}

		.recommended-badge {
			position: absolute;
			top: 15px;
			right: -45px;
			background-color: #005cbb;
			color: white;
			padding: 6px 40px;
			font-size: 0.8rem;
			font-weight: bold;
			transform: rotate(45deg);
		}

		.plan-name {
			font-size: 1.5rem;
			font-weight: 500;
			margin-bottom: 1rem;
		}

		.plan-price {
			margin-bottom: 1.5rem;
		}

		.price-amount {
			font-size: 2.8rem;
			font-weight: 700;
		}

		.price-period {
			font-size: 1rem;
			color: #777;
			margin-left: 0.25rem;
		}

		.plan-features {
			list-style: none;
			padding: 0;
			margin: 0 0 2rem 0;
			color: #444;
			min-height: 100px;
		}

		.plan-features li {
			padding: 0.5rem 0;
		}

		.paypal-button-container {
			min-height: 50px; /* Espacio para el botón de PayPal */
		}

		/* Animación de entrada */
		@keyframes fadeIn {
			from {
				opacity: 0;
				transform: translateY(10px);
			}
			to {
				opacity: 1;
				transform: translateY(0);
			}
		}

		/* Spinner (sin cambios) */
		.spinner {
			display: inline-block;
			width: 18px;
			height: 18px;
			border: 3px solid rgba(0, 0, 0, 0.1);
			border-radius: 50%;
			border-top-color: #005cbb;
			animation: spin 1s ease-in-out infinite;
		}
		.spinner.large {
			width: 50px;
			height: 50px;
			border-width: 5px;
		}
		@keyframes spin {
			to {
				transform: rotate(360deg);
			}
		}
	`,
})
export class IsPremiumComponent implements OnInit {
	#store = inject(Store)
	#dialog = inject(MatDialog)

	minSubscriptionType = input<PlanType>('Plan Basico')

	loading = signal(true)
	userCanAccess = signal(false)
	filteredPlans = signal<PricingPlan[]>([])

	private buttonsRendered = false

	private allPricingPlans: PricingPlan[] = [
		{
			id: isDevMode()
				? 'P-1S5529330X126793CNCVNPKQ'
				: 'P-6XC51067601278041NCVPXHY',
			name: 'Plan Básico',
			code: 'Plan Basico',
			price: 9.58,
			level: 2,
			features: [
				'500 Créditos/mes',
				'3 Asignaturas',
				'Soporte por Email',
			],
			container: 'basic-plan-button-container',
		},
		{
			id: isDevMode()
				? 'P-1UE72299DR9852449NCVQGVQ'
				: 'P-2A141077RF7045523NCZSTYY',
			name: 'Plan Plus',
			code: 'Plan Plus',
			price: 15.97,
			level: 3,
			features: [
				'1,500 Créditos/mes',
				'5 Asignaturas',
				'Soporte Prioritario',
			],
			container: 'plus-plan-button-container',
		},
		{
			id: isDevMode()
				? 'P-4YU16384DJ898973ENCVQHAY'
				: 'P-4YH83305EL092640VNCVPYFQ',
			name: 'Plan Premium',
			code: 'Plan Premium',
			price: 38.36,
			level: 4,
			features: [
				'Créditos Ilimitados',
				'Integraciones',
				'Funciones Colaborativas',
			],
			container: 'premium-plan-button-container',
		},
	]

	constructor() {
		effect(() => {
			if (!this.loading() && !this.userCanAccess()) {
				setTimeout(() => this.renderPaypalButtons(), 100)
			}
		})
	}

	ngOnInit() {
		this.#store.dispatch(loadCurrentSubscription())
		const requiredLevel = this.getlevelForPlan(this.minSubscriptionType())

		const plansToShow = this.allPricingPlans.filter(
			(p) => p.level >= requiredLevel,
		)
		this.filteredPlans.set(plansToShow)

		this.#store.select(selectCurrentSubscription)
			.pipe(
				map((sub) => {
					if (
						!sub ||
						sub.status !== 'active' ||
						new Date(sub.endDate) < new Date()
					) {
						return false
					}
					const userAccessLevel = this.getlevelForPlan(
						sub.subscriptionType as PlanType,
					)
					return userAccessLevel >= requiredLevel
				}),
			)
			.subscribe((canAccess) => {
				this.userCanAccess.set(canAccess)
				this.loading.set(false)
			})
	}

	openBankAccount() {
		this.#dialog.open(BankAccountComponent)
	}

	private getlevelForPlan(plan: PlanType | 'FREE'): number {
		switch (plan) {
			case 'Plan Basico':
				return 2
			case 'Plan Plus':
				return 3
			case 'Plan Premium':
				return 4
			default:
				return 1
		}
	}

	private renderPaypalButtons() {
		if (this.buttonsRendered) return
		this.buttonsRendered = true

		const style = {
			shape: 'rect',
			color: 'gold',
			layout: 'vertical',
			label: 'subscribe',
		}

		this.filteredPlans().forEach(
			({ id: plan_id, name, code, price, container }) => {
				if (document.getElementById(container)) {
					paypal
						.Buttons({
							style,
							createSubscription: (data: any, actions: any) =>
								actions.subscription.create({ plan_id }),
							onApprove: () =>
								this.handleSubscriptionSuccess(
									code,
									price,
									name,
								),
						})
						.render(`#${container}`)
				}
			},
		)
	}

	private handleSubscriptionSuccess(
		code: PlanType,
		price: number,
		planName: string,
	) {
		this.#store.dispatch(subscribe({ subscriptionType: code, method: 'PayPal', duration: 30, amount: price }))
	}
}
