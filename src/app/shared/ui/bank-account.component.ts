import { Component } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
	selector: 'app-bank-account',
	imports: [MatDialogModule],
	template: `
		<h2 mat-dialog-title>Detalles de Cuenta Bancaria</h2>
		<mat-dialog-content>
			<p><b>Entidad Bancaria</b>: {{ account.bank }}</p>
			<p><b>Número de Cuenta</b>: {{ account.number }}</p>
			<p><b>Titular</b>: {{ account.name }}</p>
			<p><b>Tipo de Cuenta</b>: {{ account.type }}</p>
			<p><b>Moneda</b>: {{ account.currency }}</p>
		</mat-dialog-content>
	`,
})
export class BankAccountComponent {
	account = {
		number: '4223648491',
		name: 'Otoniel Reyes Galay',
		type: 'Corriente',
		currency: 'Pesos Dominicanos',
		bank: 'BanReservas',
	};
}
