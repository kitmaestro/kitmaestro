import { AfterViewInit, Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BankAccountComponent } from '../../../shared/ui/bank-account.component';
import { MatListModule } from '@angular/material/list';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { UserSubscription } from '../../../core/interfaces/user-subscription';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { UserSubscriptionService } from '../../../core/services/user-subscription.service';

declare const paypal: any;

@Component({
	selector: 'app-buy-subscription',
	imports: [
		MatCardModule,
		MatButtonModule,
		MatIconModule,
		MatDialogModule,
		MatListModule,
		MatSnackBarModule,
		MatSlideToggleModule,
		MatBadgeModule,
		RouterModule,
		RouterModule,
	],
	template: `
		<div class="text-center">
			<h1>Precios de Suscripción a KitMaestro</h1>
		</div>

		<!-- <div id="zf-widget-root-id"></div> -->

		<table>
			<thead>
				<tr>
					<th>Características</th>
					<th>Educador Básico</th>
					<th>Docente Pro</th>
					<th>
						<mat-icon style="color: #ffd740">favorite</mat-icon>
						<div>Plan Innovador</div>
					</th>
					<th>Plan Maestro</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>Precio Mensual</td>
					<td>RD$0</td>
					<td>RD$599</td>
					<td>RD$1,199</td>
					<td>RD$2,399</td>
				</tr>
				<tr>
					<td>Precio Anual (2 meses gratis)</td>
					<td>N/A</td>
					<td>RD$5,999</td>
					<td>RD$11,999</td>
					<td>RD$23,999</td>
				</tr>
				<tr>
					<td>Generación de planes diarios</td>
					<td>5/mes</td>
					<td>Ilimitado</td>
					<td>Ilimitado</td>
					<td>Ilimitado</td>
				</tr>
				<tr>
					<td>Generador de calificaciones</td>
					<td>1 clase (20 alumnos máx.)</td>
					<td>Ilimitado</td>
					<td>Ilimitado</td>
					<td>Ilimitado</td>
				</tr>
				<tr>
					<td>Generador de unidades de aprendizaje</td>
					<td>
						<mat-icon style="color: #f44336; font-weight: bold"
							>close</mat-icon
						>
					</td>
					<td>
						<mat-icon style="color: #4caf50; font-weight: bold"
							>check</mat-icon
						>
					</td>
					<td>
						<mat-icon style="color: #4caf50; font-weight: bold"
							>check</mat-icon
						>
					</td>
					<td>
						<mat-icon style="color: #4caf50; font-weight: bold"
							>check</mat-icon
						>
					</td>
				</tr>
				<tr>
					<td>Calculadora de promedio</td>
					<td>
						<mat-icon style="color: #f44336; font-weight: bold"
							>close</mat-icon
						>
					</td>
					<td>
						<mat-icon style="color: #4caf50; font-weight: bold"
							>check</mat-icon
						>
					</td>
					<td>
						<mat-icon style="color: #4caf50; font-weight: bold"
							>check</mat-icon
						>
					</td>
					<td>
						<mat-icon style="color: #4caf50; font-weight: bold"
							>check</mat-icon
						>
					</td>
				</tr>
				<tr>
					<td>Generador de asistencia</td>
					<td>
						<mat-icon style="color: #f44336; font-weight: bold"
							>close</mat-icon
						>
					</td>
					<td>Hasta 3 clases (100 alumnos)</td>
					<td>Ilimitado</td>
					<td>Ilimitado</td>
				</tr>
				<tr>
					<td>Generación de rúbricas y sistemas de calificación</td>
					<td>
						<mat-icon style="color: #f44336; font-weight: bold"
							>close</mat-icon
						>
					</td>
					<td>
						<mat-icon style="color: #4caf50; font-weight: bold"
							>check</mat-icon
						>
					</td>
					<td>
						<mat-icon style="color: #4caf50; font-weight: bold"
							>check</mat-icon
						>
					</td>
					<td>
						<mat-icon style="color: #4caf50; font-weight: bold"
							>check</mat-icon
						>
					</td>
				</tr>
				<tr>
					<td>Gestión de horarios de clases</td>
					<td>Básico (2 horarios máx.)</td>
					<td>Básico</td>
					<td>Avanzado</td>
					<td>Avanzado</td>
				</tr>
				<tr>
					<td>Generador de plantillas de planificación</td>
					<td>
						<mat-icon style="color: #f44336; font-weight: bold"
							>close</mat-icon
						>
					</td>
					<td>
						<mat-icon style="color: #4caf50; font-weight: bold"
							>check</mat-icon
						>
					</td>
					<td>
						<mat-icon style="color: #4caf50; font-weight: bold"
							>check</mat-icon
						>
					</td>
					<td>
						<mat-icon style="color: #4caf50; font-weight: bold"
							>check</mat-icon
						>
					</td>
				</tr>
				<tr>
					<td>Generador de exámenes</td>
					<td>
						<mat-icon style="color: #f44336; font-weight: bold"
							>close</mat-icon
						>
					</td>
					<td>
						<mat-icon style="color: #f44336; font-weight: bold"
							>close</mat-icon
						>
					</td>
					<td>
						<mat-icon style="color: #4caf50; font-weight: bold"
							>check</mat-icon
						>
					</td>
					<td>
						<mat-icon style="color: #4caf50; font-weight: bold"
							>check</mat-icon
						>
					</td>
				</tr>
				<tr>
					<td>Generadores de ejercicios matemáticos y lingüísticos</td>
					<td>
						<mat-icon style="color: #f44336; font-weight: bold"
							>close</mat-icon
						>
					</td>
					<td>
						<mat-icon style="color: #f44336; font-weight: bold"
							>close</mat-icon
						>
					</td>
					<td>
						<mat-icon style="color: #4caf50; font-weight: bold"
							>check</mat-icon
						>
					</td>
					<td>
						<mat-icon style="color: #4caf50; font-weight: bold"
							>check</mat-icon
						>
					</td>
				</tr>
				<tr>
					<td>Galería de recursos (subir y monetizar)</td>
					<td>Solo recursos gratuitos</td>
					<td>
						<mat-icon style="color: #f44336; font-weight: bold"
							>close</mat-icon
						>
					</td>
					<td>
						<mat-icon style="color: #4caf50; font-weight: bold"
							>check</mat-icon
						>
					</td>
					<td>
						<mat-icon style="color: #4caf50; font-weight: bold"
							>check</mat-icon
						>
					</td>
				</tr>
				<tr>
					<td>Gestión avanzada de clases y asignaturas (Google Classroom)</td>
					<td>
						<mat-icon style="color: #f44336; font-weight: bold"
							>close</mat-icon
						>
					</td>
					<td>
						<mat-icon style="color: #f44336; font-weight: bold"
							>close</mat-icon
						>
					</td>
					<td>
						<mat-icon style="color: #4caf50; font-weight: bold"
							>check</mat-icon
						>
					</td>
					<td>
						<mat-icon style="color: #4caf50; font-weight: bold"
							>check</mat-icon
						>
					</td>
				</tr>
				<tr>
					<td>Generador de registros anecdóticos</td>
					<td>
						<mat-icon style="color: #f44336; font-weight: bold"
							>close</mat-icon
						>
					</td>
					<td>
						<mat-icon style="color: #f44336; font-weight: bold"
							>close</mat-icon
						>
					</td>
					<td>
						<mat-icon style="color: #4caf50; font-weight: bold"
							>check</mat-icon
						>
					</td>
					<td>
						<mat-icon style="color: #4caf50; font-weight: bold"
							>check</mat-icon
						>
					</td>
				</tr>
				<tr>
					<td>
						Generación de proyectos grupales, guías de debate, escritura
						creativa
					</td>
					<td>
						<mat-icon style="color: #f44336; font-weight: bold"
							>close</mat-icon
						>
					</td>
					<td>
						<mat-icon style="color: #f44336; font-weight: bold"
							>close</mat-icon
						>
					</td>
					<td>
						<mat-icon style="color: #f44336; font-weight: bold"
							>close</mat-icon
						>
					</td>
					<td>
						<mat-icon style="color: #4caf50; font-weight: bold"
							>check</mat-icon
						>
					</td>
				</tr>
				<tr>
					<td>Generación de lecturas guiadas y ejercicios avanzados</td>
					<td>
						<mat-icon style="color: #f44336; font-weight: bold"
							>close</mat-icon
						>
					</td>
					<td>
						<mat-icon style="color: #f44336; font-weight: bold"
							>close</mat-icon
						>
					</td>
					<td>
						<mat-icon style="color: #f44336; font-weight: bold"
							>close</mat-icon
						>
					</td>
					<td>
						<mat-icon style="color: #4caf50; font-weight: bold"
							>check</mat-icon
						>
					</td>
				</tr>
				<tr>
					<td>Acceso a herramientas avanzadas de IA</td>
					<td>
						<mat-icon style="color: #f44336; font-weight: bold"
							>close</mat-icon
						>
					</td>
					<td>
						<mat-icon style="color: #f44336; font-weight: bold"
							>close</mat-icon
						>
					</td>
					<td>
						<mat-icon style="color: #f44336; font-weight: bold"
							>close</mat-icon
						>
					</td>
					<td>
						<mat-icon style="color: #4caf50; font-weight: bold"
							>check</mat-icon
						>
					</td>
				</tr>
				<tr>
					<td>Analíticas avanzadas del desempeño del alumnado</td>
					<td>
						<mat-icon style="color: #f44336; font-weight: bold"
							>close</mat-icon
						>
					</td>
					<td>
						<mat-icon style="color: #f44336; font-weight: bold"
							>close</mat-icon
						>
					</td>
					<td>
						<mat-icon style="color: #f44336; font-weight: bold"
							>close</mat-icon
						>
					</td>
					<td>
						<mat-icon style="color: #4caf50; font-weight: bold"
							>check</mat-icon
						>
					</td>
				</tr>
				<tr>
					<td>Soporte prioritario 24/7</td>
					<td>
						<mat-icon style="color: #f44336; font-weight: bold"
							>close</mat-icon
						>
					</td>
					<td>
						<mat-icon style="color: #f44336; font-weight: bold"
							>close</mat-icon
						>
					</td>
					<td>
						<mat-icon style="color: #f44336; font-weight: bold"
							>close</mat-icon
						>
					</td>
					<td>
						<mat-icon style="color: #4caf50; font-weight: bold"
							>check</mat-icon
						>
					</td>
				</tr>
			</tbody>
		</table>

		<!-- <div class="pricing-table-container">
			@for (plan of pricingPlans; track $index) {
				<mat-card class="pricing-card" [class.standard]="$index === 1">
					<mat-card-content>
						<mat-slide-toggle [checked]="monthlyPricing" (change)="monthlyPricing = !monthlyPricing"></mat-slide-toggle>
						<p>{{ monthlyPricing ? 'Pago Mensual' : 'Pago Anual' }}</p>
						<h2 style="margin: 0 auto;" mat-card-title>{{ plan.name }}</h2>
						@if (plan.price.month.original > 0 && !monthlyPricing) {
							<h2 style="margin: 0 auto; text-decoration: line-through; color: #f44336;" mat-card-subtitle>{{ (monthlyPricing ? plan.price.month.original : plan.price.year.original) | currency : 'USD' }}</h2>
						}
						<h2 style="margin: 0 auto;" mat-card-subtitle>{{ plan.price.month.now === 0 ? 'Gratis' : ((monthlyPricing ? plan.price.month.now : plan.price.year.now) | currency : 'USD') }}</h2>
						@if (monthlyPricing && $index === 1) {
							<mat-icon style="color: #673ab7;">verified</mat-icon>
						}
						<ul style="margin-bottom: 12px;">
							@for(feature of plan.features; track feature) {
								<li>{{ feature }}</li>
							}
						</ul>
						@if ($index === 1) {
							<div [class.hidden]="monthlyPricing" id="paypal-button-container-P-52T24700U3639062UM4OD5MY"></div>
							<div [class.hidden]="!monthlyPricing" id="paypal-button-container-P-2EE66704US3183602M4OD3PA"></div>
							@if (monthlyPricing) {
								<a style="width: 100%;" [href]="links.blackfriday.standard.monthly" target="_blank" rel="noopener noreferrer" mat-raised-button color="primary">Suscribeme</a>
							} @else {
								<a style="width: 100%;" [href]="links.blackfriday.standard.yearly" target="_blank" rel="noopener noreferrer" mat-raised-button color="primary">Suscribeme</a>
							}
						} @else if ($index === 2) {
							<div [class.hidden]="monthlyPricing" id="paypal-button-container-P-18K0318878962562NM4OWONQ"></div>
							<div [class.hidden]="!monthlyPricing" id="paypal-button-container-P-65554646XG739770LM4OWNZI"></div>
							@if (monthlyPricing) {
								<a style="width: 100%;" [href]="links.blackfriday.premium.monthly" target="_blank" rel="noopener noreferrer" mat-raised-button color="primary">Suscribeme</a>
							} @else {
								<a style="width: 100%;" [href]="links.blackfriday.premium.yearly" target="_blank" rel="noopener noreferrer" mat-raised-button color="primary">Suscribeme</a>
							}
						} @else {
						<button style="width: 100%; margin-top: auto;" mat-raised-button color="primary" (click)="buyPlan(plan)">{{ plan.buttonText }}</button>
						}
				</mat-card-content>
			</mat-card>
			}
		</div> -->

		<mat-card style="display: none">
			<mat-card-content>
				<div class="text-center">
					<h2>
						Adquiere un paquete de suscripción y disfruta de los siguientes
						beneficios:
					</h2>
					<ul style="list-style: none">
						<li>
							Al adquirir la suscripción premium, recibirás un código de
							afiliado exclusivo para compartir con tus colegas.
						</li>
						<li>
							Cada vez que alguien se registre con tu código, obtendrá un
							descuento del 20% en su suscripción.
						</li>
						<li>
							Como agradecimiento por tu recomendación, recibirás el 20%
							del costo la suscripci&oacute;n de cada usuario que se
							registre con tu código.
						</li>
					</ul>
				</div>
			</mat-card-content>
		</mat-card>
	`,
	styles: `
		h3 {
			font-weight: bold;
		}

		p {
			font-size: 16px;
			line-height: 1.5;
			font-family: Roboto, sans-serif;
			margin-top: 20px;
			margin-bottom: 20px;
		}

		.text-center {
			text-align: center;
		}

		.pricing-grid {
			display: grid;
			gap: 12px;
			grid-template-columns: 1fr;
			text-align: center;

			.standard {
				background-color: #ffd740 !important;
			}

			@media screen and (min-width: 1200px) {
				grid-template-columns: repeat(3, 1fr);
			}
		}

		.pricing-table-container {
			display: flex;
			justify-content: center;
			gap: 20px;
			flex-wrap: wrap;
			margin: 20px 0;
		}

		.pricing-card {
			width: 300px;
			text-align: center;
		}

		.pricing-card mat-card-title {
			font-size: 24px;
			font-weight: bold;
		}

		.pricing-card mat-card-subtitle {
			font-size: 20px;
			color: #666;
		}

		.pricing-card ul {
			list-style: none;
			padding: 0;
		}

		.pricing-card li {
			margin: 8px 0;
		}

		mat-card-actions {
			display: flex;
			justify-content: center;
		}

		.hidden {
			display: none;
		}

		td,
		th {
			vertical-align: middle;
			text-align: center;
			padding: 6px;
			border: 1px solid #ccc;
		}

		tr td:first-child,
		tr th:first-child {
			text-align: start;
		}

		tr td:nth-child(4),
		tr th:nth-child(4) {
			background-color: #673ab7;
			border-color: white;
			color: white;
		}

		table {
			width: 100%;
			border-collapse: collapse;
			border: 1px solid #ccc;
		}
	`,
})
export class BuySubscriptionComponent implements OnInit, AfterViewInit {
	private dialog = inject(MatDialog);
	private sb = inject(MatSnackBar);
	private router = inject(Router);
	private userSubscriptionService = inject(UserSubscriptionService);
	alreadyPremium = false;
	subscription$: Observable<UserSubscription> =
		this.userSubscriptionService.checkSubscription();
	loading = true;
	monthlyPricing = false;
	script: any = null;

	links = {
		blackfriday: {
			standard: {
				yearly: 'https://www.paypal.com/webapps/billing/plans/subscribe?plan_id=P-93026442NP193262GM5AFP7Q',
				monthly:
					'https://www.paypal.com/webapps/billing/plans/subscribe?plan_id=P-5KR33576CF752782RM5AFRTI',
			},
			premium: {
				yearly: 'https://www.paypal.com/webapps/billing/plans/subscribe?plan_id=P-9UM88252AL146524LM5AF5YQ',
				monthly:
					'https://www.paypal.com/webapps/billing/plans/subscribe?plan_id=P-31K00861C1627213SM5AF7TA',
			},
		},
		regular: {
			standard: {
				yearly: 'https://www.paypal.com/webapps/billing/plans/subscribe?plan_id=P-52T24700U3639062UM4OD5MY',
				monthly:
					'https://www.paypal.com/webapps/billing/plans/subscribe?plan_id=P-2EE66704US3183602M4OD3PA',
			},
			premium: {
				yearly: 'https://www.paypal.com/webapps/billing/plans/subscribe?plan_id=P-18K0318878962562NM4OWONQ',
				monthly:
					'https://www.paypal.com/webapps/billing/plans/subscribe?plan_id=P-65554646XG739770LM4OWNZI',
			},
		},
	};

	pricingPlans = [
		{
			name: 'Plan Básico',
			price: {
				month: {
					original: 0,
					now: 0,
				},
				year: {
					original: 0,
					now: 0,
				},
			},
			features: [
				'Calculadora de Promedios',
				'Calculadora de Asistencia',
				'Hojas de Ejercicios',
				'Lista de Pendientes',
				'Administra tus Cursos',
				'Registro Anecdótico',
				'Plantillas de Planificación',
				'Galería de Recursos Educativos',
			],
			buttonText: 'Empezar',
		},
		{
			name: 'Plan Estándar',
			price: {
				month: {
					original: 600,
					// now: 3.75,
					now: 399,
				},
				year: {
					original: 4800,
					// now: 24.99,
					now: 2999,
				},
			},
			features: [
				'Todo del Plan Básico',
				'Planes Diarios',
				'Planes de Unidad',
				'Generador de Calificaciones',
				'Generador de Asistencia',
				'Conversaciones en Inglés',
				'Generador de Actividades',
				'Generador de Aspectos Trabajados',
				'Instrumentos de Evaluación',
				'Sistemas de Calificación',
				'Gestion de Horario',
			],
			buttonText: 'Suscríbeme',
		},
		{
			name: 'Plan Premium',
			price: {
				month: {
					original: 2400,
					// now: 11.25,
					now: 999,
				},
				year: {
					original: 14000,
					// now: 112.49,
					now: 8999,
				},
			},
			features: [
				'Todo del Plan Estándar',
				'Recursos Educativos Premium',
				'Planes Automatizados',
				'Planes de Efemerides',
				'Hasta 5 profesores',
				'Docente Adicional $2.99/mes',
				'Soporte Prioritario',
			],
			buttonText: 'Más Información',
		},
	];

	buyPlan(plan: any) {
		if (plan.name === 'Plan Premium') {
			const a = document.createElement('a');
			const text = encodeURIComponent(
				`Hola!\nMe interesa un plan premium de KitMaestro. Me puedes informar al respecto?`,
			);
			a.href = `https://web.whatsapp.com/send?text=${text}`;
			a.target = '_blank';
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
		} else if (plan.name === 'Plan Estándar') {
			// process payment
		} else {
			this.router.navigate(['/']).then(() => {
				if (this.alreadyPremium) {
					this.sb.open(
						'Tu cuenta volvera a ser gratuita una vez llegue tu dia de facturacion. Regresa pronto!',
						'Ok',
						{ duration: 2500 },
					);
				} else {
					this.sb.open(
						'Tu cuenta ya es gratuita. Te esperamos del lado premium!',
						'Ok',
						{ duration: 2500 },
					);
				}
			});
		}
	}

	subscribe(plan: string, method: string, days: number, amount: number) {
		const sub = this.userSubscriptionService
			.subscribe(plan, method, days, amount)
			.subscribe((result) => {
				sub.unsubscribe();
				console.log(result);
				this.alertSuccess();
			});
	}

	renderButtons() {
		const style = {
			shape: 'rect',
			color: 'gold',
			layout: 'vertical',
			label: 'subscribe',
		};
		const plans = [
			{
				plan_id: 'P-18K0318878962562NM4OWONQ',
				name: 'Premium Yearly',
				days: 365,
				price: 149.99,
			},
			{
				plan_id: 'P-52T24700U3639062UM4OD5MY',
				name: 'Premium Yearly Standard',
				days: 365,
				price: 49.99,
			},
			{
				plan_id: 'P-65554646XG739770LM4OWNZI',
				name: 'Premium Monthly',
				days: 30,
				price: 14.99,
			},
			{
				plan_id: 'P-2EE66704US3183602M4OD3PA',
				name: 'Premium Monthly Standard',
				days: 30,
				price: 4.99,
			},
		];
		plans.forEach((plan) => {
			paypal
				.Buttons({
					style,
					createSubscription: (data: any, actions: any) =>
						actions.subscription.create({ plan_id: plan.plan_id }),
					onApprove: () =>
						this.subscribe(
							plan.name,
							'PayPal',
							plan.days,
							plan.price,
						),
				})
				.render(`#paypal-button-container-${plan.plan_id}`);
		});
	}

	ngAfterViewInit(): void {
		// setTimeout(() => this.renderButtons(), 0);
	}

	loadScript() {
		return new Promise((resolve, reject) => {
			//load script
			this.script = document.createElement('script');
			this.script.type = 'text/javascript';
			this.script.src =
				'https://js.zohostatic.com/books/zfwidgets/assets/js/zf-widget.js';
			this.script.id = 'zf-pricing-table';
			this.script.dataset.digest =
				'2-95ce2c643a93915e4414ee32022e96100489a80773ede99b72a9aeba00aafbd7922440bc604ebb1fb737c2b253195bdf7d83ce4d81667ad587551cfd218224f5';
			this.script.dataset.product_url = 'https://billing.zoho.com';
			console.log(this.script);
			if (this.script.readyState) {
				this.script.onreadystatechange = () => {
					if (
						this.script.readyState === 'loaded' ||
						this.script.readyState === 'complete'
					) {
						this.script.onreadystatechange = null;
						resolve({ loaded: true, status: 'Loaded' });
					}
				};
			} else {
				this.script.onload = () => {
					resolve({ loaded: true, status: 'Loaded' });
				};
			}
			this.script.onerror = (error: any) =>
				resolve({ loaded: false, status: 'Loaded' });
			document.getElementsByTagName('head')[0].appendChild(this.script);
		});
	}

	ngOnInit(): void {
		// this.loadScript();
		this.subscription$.subscribe({
			next: (subscription) => {
				this.loading = false;
				this.alreadyPremium = subscription.status === 'active';
			},
			error: (err) => {
				console.log(err);
			},
		});
	}

	showBankAccount() {
		this.dialog.open(BankAccountComponent, {});
	}

	alertSuccess() {
		this.sb.open(
			'Su suscripción premium ha sido procesada. Su suscripción será activada en un plazo de 0 a 6 horas tras la confirmación.',
			undefined,
			{ duration: 5000 },
		);
	}
}
