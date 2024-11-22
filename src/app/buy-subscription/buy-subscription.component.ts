import { AfterViewInit, Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BankAccountComponent } from '../bank-account/bank-account.component';
import { MatListModule } from '@angular/material/list';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { UserSubscription } from '../interfaces/user-subscription';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { CurrencyPipe } from '@angular/common';
import { UserSubscriptionService } from '../services/user-subscription.service';

declare const paypal: any;

@Component({
  selector: 'app-buy-subscription',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatListModule,
    MatSnackBarModule,
    MatSlideToggleModule,
    RouterModule,
    CurrencyPipe,
    RouterModule,
  ],
  templateUrl: './buy-subscription.component.html',
  styleUrl: './buy-subscription.component.scss',
})
export class BuySubscriptionComponent implements OnInit, AfterViewInit {
  private dialog = inject(MatDialog);
  private sb = inject(MatSnackBar);
  private router = inject(Router);
  private userSubscriptionService = inject(UserSubscriptionService);
  alreadyPremium: boolean = false;
  subscription$: Observable<UserSubscription> = this.userSubscriptionService.checkSubscription();
  loading = true;
  monthlyPricing = false;
  script: any = null;

  links = {
    blackfriday: {
      standard: {
        yearly: 'https://www.paypal.com/webapps/billing/plans/subscribe?plan_id=P-93026442NP193262GM5AFP7Q',
        monthly: 'https://www.paypal.com/webapps/billing/plans/subscribe?plan_id=P-5KR33576CF752782RM5AFRTI'
      },
      premium: {
        yearly: 'https://www.paypal.com/webapps/billing/plans/subscribe?plan_id=P-9UM88252AL146524LM5AF5YQ',
        monthly: 'https://www.paypal.com/webapps/billing/plans/subscribe?plan_id=P-31K00861C1627213SM5AF7TA'
      }
    },
    regular: {
      standard: {
        yearly: 'https://www.paypal.com/webapps/billing/plans/subscribe?plan_id=P-52T24700U3639062UM4OD5MY',
        monthly: 'https://www.paypal.com/webapps/billing/plans/subscribe?plan_id=P-2EE66704US3183602M4OD3PA'
      },
      premium: {
        yearly: 'https://www.paypal.com/webapps/billing/plans/subscribe?plan_id=P-18K0318878962562NM4OWONQ',
        monthly: 'https://www.paypal.com/webapps/billing/plans/subscribe?plan_id=P-65554646XG739770LM4OWNZI'
      }
    }
  }

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
      buttonText: 'Empezar'
    },
    {
      name: 'Plan Estándar',
      price: {
        month: {
          original: 9.99,
          now: 3.75,
          // now: 4.99,
        },
        year: {
          original: 79.99,
          now: 24.99,
          // now: 49.99,
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
      buttonText: 'Suscríbeme'
    },
    {
      name: 'Plan Premium',
      price: {
        month: {
          original: 39.99,
          now: 11.25,
          // now: 14.99,
        },
        year: {
          original: 349.99,
          now: 112.49,
          // now: 149.99,
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
      buttonText: 'Más Información'
    }
  ];

  buyPlan(plan: any) {
    if (plan.name == 'Plan Premium') {
      const a = document.createElement('a');
      const text = encodeURIComponent(`Hola!\nMe interesa un plan premium de KitMaestro. Me puedes informar al respecto?`)
      a.href = `https://web.whatsapp.com/send?text=${text}`;
      a.target = '_blank';
      document.body.appendChild(a);
      a.click()
      document.body.removeChild(a);
    } else if (plan.name == 'Plan Estándar') {
      // process payment
    } else {
      this.router.navigate(['/']).then(() => {
        if (this.alreadyPremium) {
          this.sb.open('Tu cuenta volvera a ser gratuita una vez llegue tu dia de facturacion. Regresa pronto!', 'Ok', { duration: 2500 });
        } else {
          this.sb.open('Tu cuenta ya es gratuita. Te esperamos del lado premium!', 'Ok', { duration: 2500 });
        }
      });
    }
  }

  subscribe(plan: string, method: string, days: number, amount: number) {
    const sub = this.userSubscriptionService.subscribe(plan, method, days, amount).subscribe(result => {
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
      label: 'subscribe'
    }
    const plans = [
      {
        plan_id: 'P-18K0318878962562NM4OWONQ',
        name: 'Premium Yearly',
        days: 365,
        price: 149.99
      },
      {
        plan_id: 'P-52T24700U3639062UM4OD5MY',
        name: 'Premium Yearly Standard',
        days: 365,
        price: 49.99
      },
      {
        plan_id: 'P-65554646XG739770LM4OWNZI',
        name: 'Premium Monthly',
        days: 30,
        price: 14.99
      },
      {
        plan_id: 'P-2EE66704US3183602M4OD3PA',
        name: 'Premium Monthly Standard',
        days: 30,
        price: 4.99
      }
    ];
    plans.forEach(plan => {
      paypal.Buttons({
        style,
        createSubscription: (data: any, actions: any) => actions.subscription.create({ plan_id: plan.plan_id }),
        onApprove: () => this.subscribe(plan.name, 'PayPal', plan.days, plan.price)
      }).render(`#paypal-button-container-${plan.plan_id}`)
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
        this.script.src = "https://js.zohostatic.com/books/zfwidgets/assets/js/zf-widget.js";
        this.script.id = "zf-pricing-table";
        this.script.dataset.digest = "2-95ce2c643a93915e4414ee32022e96100489a80773ede99b72a9aeba00aafbd7922440bc604ebb1fb737c2b253195bdf7d83ce4d81667ad587551cfd218224f5";
        this.script.dataset.product_url = "https://billing.zoho.com";
        console.log(this.script)
        if (this.script.readyState) {
          this.script.onreadystatechange = () => {
            if (this.script.readyState === "loaded" || this.script.readyState === "complete") {
              this.script.onreadystatechange = null;
              resolve({ loaded: true, status: 'Loaded' });
            }
          };
        } else {
          this.script.onload = () => {
            resolve({ loaded: true, status: 'Loaded' });
          };
        }
        this.script.onerror = (error: any) => resolve({ loaded: false, status: 'Loaded' });
        document.getElementsByTagName('head')[0].appendChild(this.script);
    });
  }

  ngOnInit(): void {
    // this.loadScript();
    this.subscription$.subscribe({
      next: (subscription) => {
        this.loading = false;
        this.alreadyPremium = subscription.status == 'active';
      }, error: (err) => {
        console.log(err)
      }
    })
  }

  showBankAccount() {
    this.dialog.open(BankAccountComponent, {
    })
  }

  alertSuccess() {
    this.sb.open('Su suscripción premium ha sido procesada. Su suscripción será activada en un plazo de 0 a 6 horas tras la confirmación.', undefined, { duration: 5000 });
  }
}
