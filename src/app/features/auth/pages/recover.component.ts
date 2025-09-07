import { DialogRef } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth.service';

@Component({
	selector: 'app-recover',
	imports: [
		ReactiveFormsModule,
		MatFormFieldModule,
		MatSnackBarModule,
		MatDialogModule,
		MatButtonModule,
		MatInputModule,
		MatIconModule,
	],
	template: `
		<h2 mat-dialog-title>Recuperar Contrase&ntilde;a</h2>
		<mat-dialog-content>
			<p>
				Ingresa tu email debajo, si lo tenemos registrado, te enviaremos
				un correo para que restablezcas tu contrase&ntilde;a.
			</p>
			<mat-form-field style="margin: 12px 0; width: 100%; display: block">
				<mat-label>Email</mat-label>
				<input type="email" [formControl]="email" matInput required />
			</mat-form-field>
			<div style="display: flex; flex-direction: row-reverse; gap: 12px">
				<button
					mat-raised-button
					[disabled]="email.invalid"
					(click)="onSubmit()"
					color="primary"
				>
					Enviar
				</button>
				<button mat-raised-button color="accent" mat-dialog-close>
					Cancelar
				</button>
			</div>
		</mat-dialog-content>
	`,
})
export class RecoverComponent {
	private fb = inject(FormBuilder);
	private sb = inject(MatSnackBar);
	private dialogRef = inject(DialogRef<RecoverComponent>);
	private authService = inject(AuthService);

	email = this.fb.control('', [Validators.email, Validators.required]);

	onSubmit() {
		const email = this.email.value;
		if (!email) return;

		this.authService.recover(email.trim()).subscribe({
			next: (res) => {
				console.log(res);
				this.sb.open(
					'El correo de recuperacion ha sido enviado!',
					'Ok',
					{ duration: 2500 },
				);
				this.dialogRef.close();
			},
			error: (err) => {
				console.log(err.message);
				this.sb.open(
					'Ha ocurrido un problema. Intentalo de nuevo.',
					'Ok',
					{ duration: 2500 },
				);
			},
		});
	}
}
