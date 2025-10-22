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
			<div class="alert">
				<b>IMPORTANTE</b>:
				<p>
					En pesos dominicanos, los precios son RD$599, RD$999 y RD$2,399 para los planes B&aacute;sico, Plus y Premium, respectivamente.
				</p>
				<p style="margin: 0;">
					Tras hacer tu dep&oacute;sito, env&iacute;a la captura por <a href="https://wa.me/+18094659650" target="_blank">WhatsApp</a> para que tu plan sea activado.
				</p>
			</div>
		</mat-dialog-content>
	`,
	styles: `
		.alert {
			padding: 16px;
			background: #d7e3ff;
			border-radius: 24px;
			margin-top: 24px;
		}
	`
})
export class BankAccountComponent {
	account2 = {
		number: '4223648491',
		name: 'Otoniel Reyes Galay',
		type: 'Corriente',
		currency: 'Pesos Dominicanos',
		bank: 'BanReservas',
	};
	account = {
		number: '8300062284',
		name: 'Otoniel Reyes Galay',
		type: 'Ahorros',
		currency: 'Pesos Dominicanos',
		bank: 'BanReservas',
	};
}
