import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BankAccountComponent } from '../bank-account/bank-account.component';
import { MatListModule } from '@angular/material/list';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { Observable, map } from 'rxjs';
import { UserSubscriptionService } from '../services/user-subscription.service';
import { UserSettingsService } from '../services/user-settings.service';
import { UserSettings } from '../interfaces/user-settings';
import { Auth, authState, User } from '@angular/fire/auth';
import { UserSubscription } from '../interfaces/user-subscription';
import { MatIconModule } from '@angular/material/icon';
import { CurrencyPipe } from '@angular/common';

declare const paypal: any;

@Component({
  selector: 'app-buy-subscription',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    HttpClientModule,
    MatIconModule,
    MatDialogModule,
    MatListModule,
    MatSnackBarModule,
    RouterModule,
    CurrencyPipe,
  ],
  templateUrl: './buy-subscription.component.html',
  styleUrl: './buy-subscription.component.scss',
})
export class BuySubscriptionComponent implements OnInit {
  http = inject(HttpClient);
  dialog = inject(MatDialog);
  sb = inject(MatSnackBar);
  userSettingsService = inject(UserSettingsService);
  userSubscriptionService = inject(UserSubscriptionService);
  usdPrice: Observable<number> = this.http.get<{ date: string, usd: { dop: number } }>('https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json').pipe(
    map(res => res.usd.dop)
  );
  price = '0.00';
  halfYear = '0.00';
  alreadyPremium: boolean = false;
  settings: UserSettings | null = null;
  auth = inject(Auth);
  user$ = authState(this.auth);
  user: User | null = null;
  fullPrice = '';
  groupPrice = '';
  privateDeploy = '';
  loading = true;

  ngOnInit(): void {
    this.usdPrice.subscribe({
      next: (res) => {
        this.price = (res * 35).toFixed(2);
        this.halfYear = (res * 20).toFixed(2);
        this.fullPrice = (res * 49.99).toFixed(2);
        this.groupPrice = (res * 34.99).toFixed(2);
        this.privateDeploy = (res * 2990).toFixed(2);
      }
    })
    this.userSettingsService.getSettings().subscribe(settings => this.settings = settings);
    this.user$.subscribe(user => this.user = user);
    this.userSubscriptionService.subscription$.subscribe({
      next: (subscription) => {
        this.loading = false;
        if (subscription) {
          if (subscription.active) {
            this.alreadyPremium = true;
          } else {
            if (subscription.referral) {
              this.renderDiscountPurchaseButton();
            } else {
              this.renderPurchaseButton();
            }
          }
        } else {
          this.renderPurchaseButton();
        }
      }, error: (err) => {
        this.renderPurchaseButton();
        console.log(err.message)
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

  updateSubscription() {
    this.userSubscriptionService.subscription$.subscribe(sus => {
      if (sus) {
        // update
        sus.active = true;
        sus.purchaseDate = new Date();
        sus.expiresAt = new Date(+(new Date()) + 365);
        sus.method = 'PayPal';
        sus.trial = true;
        sus.paidRef = false;
        sus.refCode = this.user?.email?.split('@')[0] || '';
        sus.refsCount = 0;
        this.userSubscriptionService.updateSubscription(sus)
      } else {
        const subscription: UserSubscription = {
          active : true,
          purchaseDate : new Date(),
          expiresAt : new Date(+(new Date()) + 365),
          method : 'PayPal',
          trial: true,
          paidRef: false,
          refCode : this.user?.email?.split('@')[0] || '',
          refsCount : 0,
          uid: this.user?.uid || '',
          referral: '',
          referries: '',
        } as any as UserSubscription;
        this.userSubscriptionService.subscribe(subscription)
      }
    })
  }

  renderPurchaseButton() {
    paypal.Buttons({
      style: {
        shape: 'pill',
        color: 'gold',
        layout: 'vertical',
        label: 'subscribe'
      },
      createSubscription: (data: any, actions: any) => {
        return actions.subscription.create({
          plan_id: 'P-6BD57811KP573641CM3FUYCA'
        });
      },
      onApprove: (data: any, actions: any) => {
        this.alertSuccess();
        this.updateSubscription();
      }
    }).render('#paypal-button-container-P-6BD57811KP573641CM3FUYCA'); // Renders the PayPal button
  }

  renderDiscountPurchaseButton() {
    paypal.Buttons({
      style: {
        shape: 'rect',
        color: 'gold',
        layout: 'vertical',
        label: 'subscribe'
      },
      createSubscription: (data: any, actions: any) => {
        return actions.subscription.create({
          /* Creates the subscription */
          plan_id: 'P-34132758Y2605242XM3FVFMY'
        });
      },
      onApprove: (data: any, actions: any) => {
        this.alertSuccess();
        this.updateSubscription();
      }
    }).render('#paypal-button-container-P-34132758Y2605242XM3FVFMY');
  }
}
