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
import { UserSettings } from '../interfaces/user-settings';
import { UserSubscription } from '../interfaces/user-subscription';
import { MatIconModule } from '@angular/material/icon';
import { CurrencyPipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { userSelector } from '../state/selectors/auth.selector';
import { userSubscriptionSelector } from '../state/selectors/subscription.selectors';
import { checkSubscription } from '../state/actions/subscriptions.actions';

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
  private http = inject(HttpClient);
  private dialog = inject(MatDialog);
  private sb = inject(MatSnackBar);
  private store = inject(Store);
  usdPrice: Observable<number> = this.http.get<{ date: string, usd: { dop: number } }>('https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json').pipe(
    map(res => res.usd.dop)
  );
  price = '0.00';
  halfYear = '0.00';
  alreadyPremium: boolean = false;
  user$: Observable<UserSettings> = this.store.select(userSelector);
  subscription$: Observable<UserSubscription> = this.store.select(userSubscriptionSelector);
  fullPrice = '';
  groupPrice = '';
  privateDeploy = '';
  loading = true;

  ngOnInit(): void {
    this.store.dispatch(checkSubscription())
    this.usdPrice.subscribe({
      next: (res) => {
        this.price = (res * 35).toFixed(2);
        this.halfYear = (res * 20).toFixed(2);
        this.fullPrice = (res * 49.99).toFixed(2);
        this.groupPrice = (res * 34.99).toFixed(2);
        this.privateDeploy = (res * 2990).toFixed(2);
      }
    })
    this.subscription$.subscribe({
      next: (subscription) => {
        this.loading = false;
        // check if already premium
      }, error: (err) => {
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
    // refCode : this.user?.email?.split('@')[0] || '',
    const subscription: UserSubscription = {
      status: 'active',
      startDate: new Date(),
      endDate: new Date(+(new Date()) + 365),
      method: 'PayPal',
      subscriptionType: 'premium trial',
    } as any as UserSubscription;

    // update the subscription here
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
      onApprove: () => {
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
      onApprove: () => {
        this.alertSuccess();
        this.updateSubscription();
      }
    }).render('#paypal-button-container-P-34132758Y2605242XM3FVFMY');
  }
}
