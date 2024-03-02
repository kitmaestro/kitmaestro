import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BankAccountComponent } from '../bank-account/bank-account.component';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-buy-subscription',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    HttpClientModule,
    MatDialogModule,
    MatListModule,
    RouterModule,
  ],
  templateUrl: './buy-subscription.component.html',
  styleUrl: './buy-subscription.component.scss',
})
export class BuySubscriptionComponent implements OnInit {
  http = inject(HttpClient);
  dialog = inject(MatDialog);
  usdPrice: Observable<number> = this.http.get<{ date: string, usd: { dop: number } }>('https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json').pipe(
    map(res => res.usd.dop)
  );
  price = '0.00';
  halfYear = '0.00';

  ngOnInit(): void {
    this.usdPrice.subscribe({
      next: (res) => {
        this.price = (res * 35).toFixed(2);
        this.halfYear = (res * 20).toFixed(2);
      }
    })
  }

  showBankAccount() {
    this.dialog.open(BankAccountComponent, {
    })
  }
}
