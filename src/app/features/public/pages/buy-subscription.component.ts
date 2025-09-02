import { Component, OnInit, inject, isDevMode, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { UserSubscription } from '../../../core/interfaces/user-subscription';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { UserSubscriptionService } from '../../../core/services/user-subscription.service';
import { AsyncPipe } from '@angular/common';

declare const paypal: any;

@Component({
	selector: 'app-buy-subscription',
	standalone: true,
	imports: [
		FormsModule,
		MatCardModule,
		MatButtonModule,
		MatIconModule,
		MatListModule,
		MatSnackBarModule,
		MatSlideToggleModule,
		RouterModule,
		AsyncPipe,
	],
	template: `
    <div class="pricing-container">
		<img src="/assets/logo KitMaestro.png" style="max-width: 128px; cursor: pointer;" alt="KitMaestro v4 logo" routerLink="/" />
        <h1>KitMaestro</h1>
      <div class="header">
        <h1>Planes y Precios</h1>
        <p>Elige el plan que mejor se adapte a tus necesidades.</p>
      </div>

      <div class="pricing-grid">
		@for (plan of pricingPlans; track plan.id) {
			<div
			  class="pricing-card"
			  [class.most-popular]="plan.mostPopular"
			>
				@if (plan.mostPopular) {
					<div class="popular-badge">Más Popular</div>
				}
			  <h2>{{ plan.name }}</h2>
			  <div class="price">$
				{{ plan.price }}
				<span class="period">({{ 'RD$' + (rate * plan.price) }})/ mes</span>
			  </div>
			  <p class="description">{{ plan.description }}</p>
			  <ul class="features-list">
				@for (feature of plan.features; track $index) {
					<li>
					  <mat-icon>check_circle</mat-icon> {{ feature }}
					</li>
				}
			  </ul>
			  @if (plan.price) {
				<div [id]="plan.id+'-container'">
					</div>
			  } @else {
				  <button (click)="goFree()" mat-flat-button color="primary" class="cta-button">
					{{ plan.buttonText }}
				  </button>
			  }
			</div>
		}
      </div>
    </div>
  `,
	styles: `
    :host {
      display: flex;
      justify-content: center;
      padding: 40px 20px;
      background-color: #f9fafb;
      font-family: 'Inter', sans-serif;
    }

    .pricing-container {
      width: 100%;
      max-width: 1200px;
      text-align: center;
    }

    .header h1 {
      font-size: 3rem;
      font-weight: 800;
      color: #111827;
      margin-bottom: 16px;
    }

    .header p {
      font-size: 1.125rem;
      color: #6b7280;
      max-width: 600px;
      margin: 0 auto 32px;
    }

    .billing-toggle {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 16px;
      margin-bottom: 48px;
      font-size: 1rem;
      color: #374151;
    }

    .billing-toggle span {
        font-weight: 500;
    }

    .pricing-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 32px;
      justify-content: center;
    }

    /* Estilos para tablets y escritorios */
    @media (min-width: 768px) {
      .pricing-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (min-width: 1200px) {
      .pricing-grid {
        grid-template-columns: repeat(4, 1fr);
      }
    }

    .pricing-card {
      background-color: #ffffff;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 32px;
      text-align: left;
      transition: all 0.3s ease;
      position: relative;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
    }

    .pricing-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
    }

    .pricing-card.most-popular {
      border-color: #6366f1;
      border-width: 2px;
    }

    .popular-badge {
      position: absolute;
      top: -15px;
      left: 50%;
      transform: translateX(-50%);
      background-color: #6366f1;
      color: white;
      padding: 6px 16px;
      border-radius: 9999px;
      font-size: 0.875rem;
      font-weight: 600;
    }

    .pricing-card h2 {
      font-size: 1.5rem;
      font-weight: 700;
      color: #111827;
      margin-bottom: 16px;
    }

    .price {
      font-size: 2.5rem;
      font-weight: 800;
      color: #111827;
      margin-bottom: 8px;
      display: flex;
      align-items: baseline;
    }

    .price .currency {
        font-size: 1.5rem;
        font-weight: 600;
        margin-right: 4px;
    }

    .price .period {
      font-size: 1rem;
      font-weight: 500;
      color: #6b7280;
      margin-left: 8px;
    }

    .description {
        color: #6b7280;
        margin-bottom: 24px;
        min-height: 40px;
    }

    .features-list {
      list-style: none;
      padding: 0;
      margin: 24px 0;
      color: #374151;
    }

    .features-list li {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 12px;
    }

    .features-list mat-icon {
      color: #6366f1;
    }

    .cta-button {
      width: 100%;
      padding: 12px 0;
      font-size: 1rem;
      font-weight: 600;
      border-radius: 8px;
      background-color: #6366f1;
      color: white;
      transition: background-color 0.3s ease;
    }

    .pricing-card:not(.most-popular) .cta-button {
        background-color: #ffffff;
        color: #6366f1;
        border: 2px solid #e5e7eb;
    }

    .pricing-card:not(.most-popular) .cta-button:hover {
        background-color: #f9fafb;
        border-color: #d1d5db;
    }

    .cta-button:hover {
      background-color: #4f46e5;
    }
  `,
})
export class BuySubscriptionComponent implements OnInit {
	private sb = inject(MatSnackBar);
	private router = inject(Router);
	private userSubscriptionService = inject(UserSubscriptionService);

	// Estado para el interruptor de facturación
	billedAnnually = signal(false);
	loading = true;
	alreadyPremium = false;
	subscription$: Observable<UserSubscription> = this.userSubscriptionService.checkSubscription();
	rate = 0
	
	async fetchRate() {
		const response = await fetch('https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json');
		const res: any = await response.json();
		this.rate = res.usd.dop;
	}

	// Datos de los planes de precios, simplificados para el nuevo diseño
	pricingPlans = [
		{
			id: 'FREE',
			name: 'Plan Gratuito',
			code: 'FREE',
			price: 0,
			description: 'Herramientas esenciales para empezar a organizar tus clases.',
			features: [
				'5 planes diarios/mes',
				'1 unidad de aprendizaje/mes',
				'2 instrumentos de evaluacion/mes',
				'Generador de aspectos trabajados',
				'Generador de calificaciones (1 curso)',
			],
			buttonText: 'Comenzar Gratis',
			mostPopular: false,
		},
		{
			id: isDevMode() ? 'P-1S5529330X126793CNCVNPKQ' : 'P-6XC51067601278041NCVPXHY',
			name: 'Plan Básico',
			code: 'BASICO',
			price: 9.58,
			description: 'Ideal para docentes de área que buscan simplificar su vida, ahorrando al menos 5 horas a la semana.',
			features: [
				'Planes de clase(diarios)',
				'Planes de unidad',
				'Instrumentos de evaluación',
				'Manejo de asistencia',
				'Manejo de calificaciones',
				'Actividades didácticas básicas',
				'Aspectos trabajados(registro)',
				'Asistente IA',
				'Galería de recursos didácticos',
			],
			buttonText: 'Elegir Plan Pro',
			mostPopular: false,
		},
		{
			// id: isDevMode() ? 'P-1UE72299DR9852449NCVQGVQ' : 'P-14G421255Y3461609NCVPWCQ', # old one
			id: isDevMode() ? 'P-1UE72299DR9852449NCVQGVQ' : 'P-2A141077RF7045523NCZSTYY',
			name: 'Plan Plus',
			code: 'PLUS',
			price: 15.97,
			description: 'Perfecto para docentes en aula, que imparten 4 o más asignaturas en uno o varios grados, logrando ahorras al menos 10 horas de trabajo cada semana.',
			features: [
				'Todo lo del plan básico',
				'Plan anual de clases',
				'Planes diarios por lote',
				'Planes diarios automáticos',
				'Registro anecdótico',
				'Generador de exámenes',
				'Actividades de comprensión lectora',
				'Actividades de matemática',
				'Actividades de historia y geografía',
				'Actividades de ciencias de la naturaleza',
				'Recursos decorativos para el aula',
				'Actividades para efemérides',
				'Planificación de eventos',
				'Encuestas y retroalimentación',
				'Corrección automática de tareas',
				'Juegos didácticos',
			],
			buttonText: 'Elegir Plan Innovador',
			mostPopular: true,
		},
		{
			id: isDevMode() ? 'P-4YU16384DJ898973ENCVQHAY' : 'P-4YH83305EL092640VNCVPYFQ',
			name: 'Plan Premium',
			code: 'PREMIUM',
			price: 38.36,
			description: 'Perfecto para el docente eficiente e innovador que valora su tiempo al máximo, con este plan, el maestro puede ahorrar hasta 20 horas a la semana.',
			features: [
				'Todo lo del plan Plus',
				'Plan anual de clases',
				'Planes de acción',
				'Planes de mejora',
				'Mensajes automáticos a padres',
				'Boletines de calificación',
				'Informes de rendimiento individual',
				'Taza personalizada *',
				'T-Shirt personalizado *',
				'Asesores de desarrollo personal',
				'Asesores de desarrollo profesional',
				'Caja de suscripción trimestral *',
				'Recursos didácticos gratuitos *',
				// '3 días de resort todo incluido *',
				'Cursos gratuitos en KitMaestro Academy *',
				// '5 entradas a KitMaestro Con *',
			],
			buttonText: 'Contactar Ventas',
			mostPopular: false,
		},
	];

	ngOnInit(): void {
		this.fetchRate();
		this.subscription$.subscribe({
			next: (subscription) => {
				this.loading = false;
				this.alreadyPremium = subscription.status === 'active';
			},
			error: (err) => {
				console.error('Error al verificar la suscripción:', err);
				this.loading = false;
			},
		});
		setTimeout(() => this.renderButtons(), 500);
	}

	renderButtons() {
		const style = {
			shape: 'rect',
			color: 'gold',
			layout: 'vertical',
			label: 'subscribe',
		};
		this.pricingPlans.filter(p => p.price).forEach(({ id: plan_id, name, code, price }) => {
			const days = 30
			paypal
				.Buttons({
					style,
					createSubscription: (data: any, actions: any) => actions.subscription.create({ plan_id }),
					onApprove: () => this.userSubscriptionService.subscribe(code, 'PayPal', days, price).subscribe(() => this.alertSuccess(name)),
				})
				.render(`#${plan_id}-container`);
		});
	}

	goFree() {
		this.userSubscriptionService.subscribe('FREE', 'none', 0, 0).subscribe(() => this.alertSuccess('Gratuito'));
	}

	toggleBillingPeriod(): void {
		console.log('Facturación anual:', this.billedAnnually);
		// Aquí puedes añadir lógica adicional si es necesario cuando cambia el período
	}

	alertSuccess(plan: string) {
		this.router.navigate(plan == 'Gratuito' ? ['/'] : ['/premium-welcome'], { queryParams: { plan: plan } }).then(() => {
			this.sb.open(
				'Serás redirigido para completar tu compra. Tu suscripción se activará tras la confirmación.',
				'OK',
				{ duration: 5000 }
			);
		})
	}
}
