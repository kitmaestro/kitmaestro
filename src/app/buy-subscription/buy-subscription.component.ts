import { Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BankAccountComponent } from '../bank-account/bank-account.component';
import { MatListModule } from '@angular/material/list';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { UserSubscription } from '../interfaces/user-subscription';
import { MatIconModule } from '@angular/material/icon';
import { CurrencyPipe } from '@angular/common';
import { CurrencyService } from '../services/currency.service';
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
    RouterModule,
    CurrencyPipe,
  ],
  templateUrl: './buy-subscription.component.html',
  styleUrl: './buy-subscription.component.scss',
})
export class BuySubscriptionComponent implements OnInit {
  private currencyService = inject(CurrencyService);
  private dialog = inject(MatDialog);
  private sb = inject(MatSnackBar);
  private userSubscriptionService = inject(UserSubscriptionService);
  usdPrice: Observable<number> = this.currencyService.convert('usd', 'dop');
  price = '0.00';
  halfYear = '0.00';
  alreadyPremium: boolean = false;
  subscription$: Observable<UserSubscription> = this.userSubscriptionService.checkSubscription();
  fullPrice = '';
  groupPrice = '';
  privateDeploy = '';
  loading = true;

  subscribe() {
    const sub = this.userSubscriptionService.subscribe('Premium Individual', 'cash', 365, 24.99).subscribe(result => {
      console.log(result);
      this.alertSuccess();
      sub.unsubscribe();
    });
  }

  ngOnInit(): void {
    // this.userSubscriptionService.subscribe('Premium Individual', 'PayPal', 365, 49.99).subscribe((result) => {
    //   console.log(result)
    //   this.alertSuccess()
    // })
    // this.subscribe()
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
        console.log(subscription)
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
