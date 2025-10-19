import { Component, inject, isDevMode, OnInit } from '@angular/core'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { MatIconModule } from '@angular/material/icon'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'
import { ActivatedRoute, Router, RouterModule } from '@angular/router'
import { BiIconComponent } from '../../../shared/ui/bi-icon.component'
import { MatDialog, MatDialogModule } from '@angular/material/dialog'
import { RecoverComponent } from './recover.component'
import { environment } from '../../../../environments/environment'
import { Store } from '@ngrx/store'
import { signIn } from '../../../store/auth/auth.actions'
import { LoginDto } from '../../../store/auth/auth.models'
import { selectSigningIn } from '../../../store/auth/auth.selectors'

@Component({
	selector: 'app-login',
	imports: [
		ReactiveFormsModule,
		MatCardModule,
		MatSnackBarModule,
		MatFormFieldModule,
		MatInputModule,
		MatCheckboxModule,
		MatButtonModule,
		MatIconModule,
		MatDialogModule,
		RouterModule,
		BiIconComponent,
	],
	template: `
		<div class="flex-wrapper">
			<mat-card class="login-card">
				<mat-card-header>
					<div
						style="display: flex; justify-content: center; width: 100%"
					>
						<h2 mat-card-title>Inicia Sesi&oacute;n</h2>
					</div>
				</mat-card-header>
				<mat-card-content>
					<img
						src="/assets/base.png"
						alt="Logo KitMaestro"
						style="display: block; margin: 0 auto 12px; width: 96px"
					/>
					<!-- <img src="/assets/teach.svg" class="teach-svg" alt=""> -->
					<form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
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
						<mat-checkbox formControlName="remember"
							>Recordarme</mat-checkbox
						>
						<div
							style="
								margin: 12px 0;
								display: flex;
								flex-direction: column;
								gap: 12px;
							"
						>
							<button
								[disabled]="loading() || loginForm.invalid"
								mat-flat-button
								color="primary"
								type="submit"
							>
								Entrar
							</button>
							<a
								mat-button
								color="link"
								[href]="
									apiUrl +
									(referrer ? '?ref=' + referrer : '')
								"
							>
								<bi-icon icon="google"></bi-icon>
								Iniciar con Google
							</a>
							<!-- <button mat-flat-button color="link" (click)="loginWithFacebook()" type="button"><bi-icon icon="facebook"></bi-icon> Iniciar con Facebook</button> -->
						</div>
					</form>
					<div style="text-align: center">
						<button
							mat-button
							style="margin-bottom: 12px"
							color="link"
							(click)="recoverPassword()"
						>
							Olvidé mi contrase&ntilde;a
						</button>
						<div>
							Aun no tienes cuenta?
							<a
								style="margin-left: auto; margin-right: 12px"
								[routerLink]="['/auth', 'signup']"
								>Regístrate</a
							>
						</div>
					</div>
				</mat-card-content>
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

		.login-card {
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
export class LoginComponent implements OnInit {
	private store = inject(Store)
	sb = inject(MatSnackBar)
	fb = inject(FormBuilder)
	modal = inject(MatDialog)
	router = inject(Router)
	route = inject(ActivatedRoute)
	apiUrl = environment.apiUrl + 'auth/google'

	loading = this.store.selectSignal(selectSigningIn)
	referrer = ''

	loginForm = this.fb.group({
		email: ['', [Validators.required, Validators.email]],
		password: ['', Validators.required],
		remember: [false],
	});

	ngOnInit() {
		const jwt = this.route.snapshot.paramMap.get('jwt')
		if (jwt) {
			localStorage.setItem('access_token', jwt)
			// const next = this.route.snapshot.queryParamMap.get('next')
			// this.router.navigate([...next?.split('/') || '/'], { queryParamsHandling: 'preserve' }).then(() => {
			// this.sb.open('Bienvenid@ a KitMaestro', 'Ok', { duration: 2500 })
			// })
		}
		const referrer =
			localStorage.getItem('ref') ||
			this.route.snapshot.queryParamMap.get('ref')
		if (referrer) {
			this.referrer = referrer
			localStorage.setItem('ref', referrer)
		}
	}

	recoverPassword() {
		this.modal.open(RecoverComponent, { width: '100%', maxWidth: '480px' })
	}

	loginWithGoogle() {
		window.location.href =
			(isDevMode()
				? 'http://localhost:3000/auth/google'
				: 'https://api.kitmaestro.com/auth/google') + this.referrer
				? `?ref=${this.referrer}`
				: ''
	}

	onSubmit() {
		if (this.loginForm.valid) {
			const { email, password, remember } = this.loginForm.value
			if (email && password) {
				const credentials: LoginDto = { email: email.trim().toLowerCase(), password, remember: remember || false }
				this.store.dispatch(signIn({ credentials }))
			}
		}
	}
}
