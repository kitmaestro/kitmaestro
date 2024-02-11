import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BankAccountComponent } from '../bank-account/bank-account.component';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';

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
  price = '0.00';

  ngOnInit(): void {
    this.http.get < { date: string, dop: number }>('https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/usd/dop.json').subscribe({
      next: (price) => {
        this.price = (price.dop * 35).toFixed(2);
      }
    })
  }

  showBankAccount() {
    this.dialog.open(BankAccountComponent, {
    })
  }
}
