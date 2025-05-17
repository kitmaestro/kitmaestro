import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
	selector: 'app-pass-update',
	imports: [
		RouterModule,
		ReactiveFormsModule,
		MatSnackBarModule,
		MatFormFieldModule,
		MatInputModule,
		MatButtonModule,
		MatCardModule,
		MatIconModule,
	],
	template: `
		<mat-card>
			<mat-card-header>
				<h2 mat-card-title>Recuperar Contrase&ntilde;a</h2>
			</mat-card-header>
			<mat-card-content>
				<img src="/assets/teach.svg" class="teach-svg" alt="" />
				<div>
					<mat-form-field appearance="outline">
						<mat-label>Email</mat-label>
						<input type="email" matInput [formControl]="email" />
					</mat-form-field>
					<mat-form-field appearance="outline">
						<mat-label>Nueva Contrase&ntilde;a</mat-label>
						<input type="password" matInput [formControl]="password" />
					</mat-form-field>
					<mat-form-field appearance="outline">
						<mat-label>Confirma tu Contrase&ntilde;a</mat-label>
						<input type="password" matInput [formControl]="confirmation" />
					</mat-form-field>
					<div
						style="
							margin: 12px 0;
							display: flex;
							flex-direction: column;
							gap: 12px;
						"
					>
						<button
							(click)="onSubmit()"
							[disabled]="
								loading ||
								(email.invalid && password.invalid) ||
								!password.value ||
								password.value !== confirmation.value
							"
							mat-flat-button
							color="primary"
							type="submit"
						>
							Guardar
						</button>
					</div>
				</div>
			</mat-card-content>
		</mat-card>
	`,
	styles: `
		.teach-svg {
			display: block;
			width: 50%;
			margin: 42px auto;
		}

		mat-form-field {
			width: 100%;
		}
	`,
})
export class PassUpdateComponent implements OnInit {
	private route = inject(ActivatedRoute);
	private router = inject(Router);
	private authService = inject(AuthService);
	private fb = inject(FormBuilder);
	private sb = inject(MatSnackBar);

	mode = this.route.snapshot.queryParamMap.get('mode');
	token = this.route.snapshot.queryParamMap.get('token');

	email = this.fb.control(this.route.snapshot.queryParamMap.get('email'), [
		Validators.email,
	]);
	password = this.fb.control('', [Validators.minLength(6)]);
	confirmation = this.fb.control('', [Validators.minLength(6)]);

	loading = true;

	ngOnInit(): void {
		if (this.mode !== 'resetPassword' || !this.token) {
			this.router.navigate(['/auth', 'login']);
			return;
		}
		if (!this.token) return;
		this.email.disable();
		this.loading = false;
	}

	onSubmit() {
		const token = this.token;
		const password = this.password.value;
		const email = this.email.value;

		if (!token || !password || !email) return;

		this.loading = true;

		this.authService.resetPassword(email, token, password).subscribe({
			next: (res: any) => {
				if (res.message === 'Invalid token') {
					this.router.navigate(['/auth', 'login']).then(() => {
						this.sb.open(
							'El token es invalido. Tendras que solicitar otro cambio de contraseña.',
							'Ok',
							{ duration: 2500 },
						);
					});
				} else {
					if (res.modifiedCount > 0) {
						this.router.navigate(['/auth', 'login']).then(() => {
							this.sb.open(
								'Tu clave ha sido actualizada, ya puedes iniciar sesion.',
								'Ok',
								{ duration: 2500 },
							);
						});
					}
				}
			},
			error: (err) => {
				this.sb.open(
					'Hubo un error al actualizar la clave. Intentalo de nuevo.',
					'Ok',
					{ duration: 2500 },
				);
				console.log(err.message);
				this.loading = false;
			},
		});
	}
}
