import { Component } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-bank-account',
  standalone: true,
  imports: [
    MatDialogModule,
  ],
  templateUrl: './bank-account.component.html',
  styleUrl: './bank-account.component.scss'
})
export class BankAccountComponent {
  account = {
    number: '4223648491',
    name: 'Otoniel Reyes Galay',
    type: 'Corriente',
    currency: 'Pesos Dominicanos',
    bank: 'BanReservas',
  }
}
