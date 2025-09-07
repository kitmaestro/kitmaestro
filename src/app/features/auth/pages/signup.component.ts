import { Component, inject, isDevMode, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BiIconComponent } from '../../../shared/ui/bi-icon.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { RecoverComponent } from './recover.component';
import { AuthService } from '../../../core/services/auth.service';
import { environment } from '../../../../environments/environment';

@Component({
	selector: 'app-signup',
	imports: [
		ReactiveFormsModule,
		MatButtonModule,
		MatCardModule,
		MatIconModule,
		MatFormFieldModule,
		MatInputModule,
		MatSnackBarModule,
		BiIconComponent,
		RouterModule,
		MatCheckboxModule,
		MatDialogModule,
	],
	template: `
		<div class="flex-wrapper">
			<mat-card class="signup-card">
				<mat-card-header>
					<div
						style="display: flex; justify-content: center; width: 100%"
					>
						<h2 mat-card-title>Reg&iacute;strate</h2>
					</div>
				</mat-card-header>
				<mat-card-content>
					<img
						src="/assets/base.png"
						style="display: block; margin: 0 auto 12px; width: 96px"
					/>
					<!-- <img src="/assets/teach.svg" class="teach-svg" alt=""> -->
					<form [formGroup]="signupForm" (ngSubmit)="onSubmit()">
						<mat-form-field appearance="outline">
							<mat-label>Email</mat-label>
							<input
								type="email"
								matInput
								formControlName="email"
							/>
						</mat-form-field>
						<mat-form-field appearance="outline">
							<mat-label>Contrase&ntilde;a</mat-label>
							<input
								type="password"
								matInput
								formControlName="password"
							/>
						</mat-form-field>
						<mat-form-field appearance="outline">
							<mat-label>Confirma tu Contrase&ntilde;a</mat-label>
							<input
								required
								type="password"
								matInput
								[formControl]="confirmation"
							/>
						</mat-form-field>
						<mat-checkbox
							required
							class="example-margin"
							formControlName="acceptConditions"
							>He le&iacute;do y acepto los
							<a
								target="_blank"
								href="https://kitmaestro.com/conditions.html"
								>t&eacute;rminos y condiciones</a
							>
							y la
							<a
								href="https://kitmaestro.com/privacy-policy.html"
								target="_blank"
								>pol&iacute;tica de privacidad</a
							>
							de KitMaestro</mat-checkbox
						>
						<div
							style="margin: 12px 0; display: flex; flex-direction: column; gap: 12px;"
						>
							<button
								[disabled]="
									loading ||
									signupForm.invalid ||
									!validConfirmation
								"
								mat-flat-button
								color="primary"
								type="submit"
							>
								Registrarme Ahora
							</button>
							<a
								mat-button
								[href]="
									apiUrl +
									(referrer ? '?ref=' + referrer : '')
								"
								><bi-icon icon="google"></bi-icon> Continuar con
								Google</a
							>
							<button
								style="display: none"
								mat-flat-button
								color="link"
								(click)="signupWithFacebook()"
								type="button"
							>
								<bi-icon icon="facebook"></bi-icon> Continuar
								con Facebook
							</button>
						</div>
					</form>
				</mat-card-content>
				<mat-card-actions>
					<div
						style="width: 100%; padding: 0 6px; text-align: center"
					>
						Ya tienes cuenta?
						<a [routerLink]="['/auth', 'login']"
							>Inicia Sesi&oacute;n</a
						>
					</div>
					<!-- <a mat-flat-button style="margin-right: auto;" color="accent" target="_blank" href="https://wa.me/+18094659650?text=Hola!+Quiero+solicitar+una+cuenta+de+KitMaestro.+Me+puedes+dar+más+información?">Solicitar Cuenta</a> -->
				</mat-card-actions>
			</mat-card>
		</div>
	`,
	styles: `
		.flex-wrapper {
			display: flex;
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			justify-content: center;
			align-items: center;
			background-image: url('/assets/teacher.jpg');
			background-attachment: fixed;
			background-position: center;
			background-repeat: no-repeat;
			background-size: cover;
		}

		mat-form-field {
			width: 100%;
		}

		.signup-card {
			position: absolute;
			top: 0;
			left: 0;
			bottom: 0;
			right: 0;

			form {
				display: flex;
				flex-direction: column;
				justify-content: end;
				min-height: fit-content;

				button {
					width: 100%;
					display: block;
				}
			}

			@media screen and (min-width: 760px) {
				position: static;
				width: 480px;
				margin-left: 64px;
				margin-right: auto;
			}
		}

		.teach-svg {
			display: block;
			width: 50%;
			margin: 42px auto;
		}
	`,
})
export class SignupComponent implements OnInit {
	private sb = inject(MatSnackBar);
	private fb = inject(FormBuilder);
	private modal = inject(MatDialog);
	private router = inject(Router);
	private route = inject(ActivatedRoute);
	private authService = inject(AuthService);
	public user$ = this.authService.profile();
	private plan = this.route.snapshot.queryParamMap.get('plan');
	apiUrl = environment.apiUrl + 'auth/google';

	loading = false;

	confirmation = this.fb.control('');

	signupForm = this.fb.group({
		email: ['', [Validators.required, Validators.email]],
		password: ['', Validators.required],
		acceptConditions: [false, Validators.required],
	});

	constructor() {}

	referrer = '';

	ngOnInit() {
		const referrer =
			localStorage.getItem('ref') ||
			this.route.snapshot.queryParamMap.get('ref');
		if (referrer) {
			this.referrer = referrer;
			localStorage.setItem('ref', referrer);
		}
	}

	recoverPassword() {
		this.modal.open(RecoverComponent, { width: '100%', maxWidth: '480px' });
	}

	signupWithGoogle() {
		window.location.href =
			(isDevMode()
				? 'http://localhost:3000/auth/google'
				: 'https://api.kitmaestro.com/auth/google') + this.referrer
				? `?ref=${this.referrer}`
				: '';
	}

	signupWithFacebook() {
		// signInWithPopup(this.auth, new FacebookAuthProvider()).then((res) => {
		//   this.store.dispatch(loginWithGoogle({ email: res.user.email || '', displayName: res.user.displayName || '', photoURL: res.user.photoURL || '' }))
		//   this.user$.subscribe({
		//     next: user => {
		//       if (user) {
		//         const next = this.route.snapshot.queryParamMap.get('next')
		//         this.router.navigate([...next?.split('/') || '/app'], { queryParamsHandling: 'preserve' }).then(() => {
		//           this.sb.open('Bienvenid@ a KitMaestro', 'Ok', { duration: 2500 });
		//         })
		//       }
		//     },
		//     error: err => {
		//       console.log(err)
		//       this.sb.open('Ha ocurrido un error al acceder con tu cuenta. Inténtalo nuevamente, por favor.', 'Ok', { duration: 2500 })
		//     }
		//   })
		// })
	}

	get validConfirmation() {
		return (
			this.confirmation.value !== '' &&
			this.confirmation.value === this.signupForm.get('password')?.value
		);
	}

	onSubmit() {
		if (this.signupForm.valid) {
			const { email, password } = this.signupForm.value;
			this.loading = true;
			if (email && password) {
				this.authService
					.signup({
						email,
						password,
						ref: this.referrer ? this.referrer : undefined,
						plan: this.plan ? this.plan : undefined,
					})
					.subscribe({
						next: () => {
							const next =
								this.route.snapshot.queryParamMap.get('next');
							this.router
								.navigate(
									next && next != '/'
										? next.split('/')
										: ['/profile'],
									{ queryParamsHandling: 'preserve' },
								)
								.then(() => {
									this.sb.open(
										`Bienvenid@ a KitMaestro! Empieza por completar tu perfil.`,
										undefined,
										{ duration: 2500 },
									);
									this.loading = false;
								});
						},
						error: (err) => {
							console.log(err);
							this.sb.open(
								'Error al registrarte. Inténtalo de nuevo por favor.',
								'Ok',
								{ duration: 2500 },
							);
							this.loading = false;
						},
					});
			}
		}
	}
}
