import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { AuthService, UserSubscriptionService } from '../../../core/services';
import { UserSubscription, User } from '../../../core/interfaces';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { forkJoin } from 'rxjs';

@Component({
    selector: 'app-user-profile',
    imports: [
        MatCardModule,
        MatButtonModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        MatSnackBarModule,
        RouterLink,
        MatIconModule,
        DatePipe,
        ReactiveFormsModule,
    ],
    template: `
        		<h2>Mi Perfil</h2>
		<form [formGroup]="userForm" (ngSubmit)="onSubmit()">
			<h3>Informaci&oacute;n Personal</h3>
			<div class="cols-2">
				<div>
					<mat-form-field appearance="outline">
						<mat-label>Sexo</mat-label>
						<mat-select
							(valueChange)="
								userForm
									.get('title')
									?.setValue(
										gender.value === 'Mujer' ? 'Licda' : 'Licdo'
									)
							"
							formControlName="gender"
							#gender
						>
							<mat-option value="Hombre">Hombre</mat-option>
							<mat-option value="Mujer">Mujer</mat-option>
						</mat-select>
					</mat-form-field>
				</div>
				<div>
					<mat-form-field appearance="outline">
						<mat-label>T&iacute;tulo Alcanzado</mat-label>
						<mat-select formControlName="title">
							@for (title of titles; track $index) {
								<mat-option [value]="title.value">{{
									title.label
								}}</mat-option>
							}
						</mat-select>
					</mat-form-field>
				</div>
			</div>
			<div class="cols-2">
				<div>
					<mat-form-field appearance="outline">
						<mat-label>Nombre(s)</mat-label>
						<input type="text" formControlName="firstname" matInput />
					</mat-form-field>
				</div>
				<div>
					<mat-form-field appearance="outline">
						<mat-label>Apellido(s)</mat-label>
						<input type="text" formControlName="lastname" matInput />
					</mat-form-field>
				</div>
			</div>
			<div class="cols-2">
				<div>
					<mat-form-field appearance="outline">
						<mat-label>Email</mat-label>
						<input type="text" matInput formControlName="email" />
					</mat-form-field>
				</div>
				<div>
					<mat-form-field appearance="outline">
						<mat-label>Tel&eacute;fono</mat-label>
						<input type="text" matInput formControlName="phone" />
					</mat-form-field>
				</div>
			</div>
			<div style="display: none">
				<mat-form-field appearance="outline">
					<mat-label>C&oacute;digo de Referencia</mat-label>
					<input type="text" matInput formControlName="refCode" />
				</mat-form-field>
			</div>
			<div>
				<mat-form-field appearance="outline">
					<mat-label>Nombre de la Escuela</mat-label>
					<input type="text" formControlName="schoolName" matInput />
				</mat-form-field>
			</div>
			<div class="cols-2">
				<div>
					<mat-form-field appearance="outline">
						<mat-label>Regional</mat-label>
						<input type="text" formControlName="regional" matInput />
					</mat-form-field>
				</div>
				<div>
					<mat-form-field appearance="outline">
						<mat-label>Distrito</mat-label>
						<input type="text" formControlName="district" matInput />
					</mat-form-field>
				</div>
			</div>
			<div style="text-align: end">
				<button mat-flat-button type="submit" [disabled]="userForm.invalid" color="primary">
					Guardar
				</button>
			</div>
		</form>

		<mat-card class="profile-card">
			<mat-card-header>
				<mat-card-title>Mi Suscripci&oacute;n</mat-card-title>
			</mat-card-header>
			<mat-card-content>
				<div style="margin-top: 12px">
					<p>
						<b>Plan Actual:</b>
						{{ userSubscription()?.subscriptionType }}
					</p>
					<p>
						<b>Estado:</b>
						{{
							subscriptionIsOver() ? 'Expirada' : userSubscription()?.status == "active"
								? "Activa"
								: "Inactiva"
						}}
					</p>
					<p>
						<b>Miembro desde:</b>
						{{ userSubscription()?.startDate | date }}
					</p>
					<p>
						<b>Proximo Pago:</b>
						{{ userSubscription()?.endDate | date }}
					</p>
				</div>
				<div style="margin-top: 12px">
					<button
						type="button"
						routerLink="/buy"
						color="accent"
						mat-flat-button
					>
						{{
							!userSubscription() ||
							userSubscription()?.subscriptionType == "FREE"
								? "Adquirir Suscripci&oacute;n"
								: "Cambiar mi Plan"
						}}
					</button>
				</div>
			</mat-card-content>
		</mat-card>
		<div style="height: 48px"></div>
    `,
    styles: `
        .profile-card {
            margin: 24px auto;
        }

        .card-actions {
            display: grid;
            grid-template-columns: 1fr;
        }

        mat-form-field {
            width: 100%;
        }

        .cols-2 {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
        }
    `,
})
export class UserProfileComponent implements OnInit {
    private authService = inject(AuthService);
    private userSubscriptionService = inject(UserSubscriptionService);
    private fb = inject(FormBuilder);
    private sb = inject(MatSnackBar);
    public user: User | null = null;

    public alreadyCode = false;
    userSubscription = signal<UserSubscription | null>(null);
    subscriptionIsOver = signal(false);

    userForm = this.fb.group({
        title: ['', [Validators.required]],
        firstname: ['', [Validators.required]],
        lastname: ['', [Validators.required]],
        username: [''],
        email: ['', [Validators.required, Validators.email]],
        gender: ['Hombre'],
        phone: ['', [Validators.required]],
        refCode: [''],
        regional: ['', [Validators.required]],
        district: ['', [Validators.required]],
        schoolName: ['', [Validators.required]],
    });

    titleOptions: {
        Hombre: { value: string; label: string }[];
        Mujer: { value: string; label: string }[];
    } = {
            Hombre: [
                { value: 'Licdo', label: 'Licenciado' },
                { value: 'Mtro', label: 'Maestro' },
                { value: 'Dr', label: 'Doctor' },
            ],
            Mujer: [
                { value: 'Licda', label: 'Licenciada' },
                { value: 'Mtra', label: 'Maestra' },
                { value: 'Dra', label: 'Doctora' },
            ],
        };

    ngOnInit() {
        forkJoin([
            this.userSubscriptionService.checkSubscription(),
            this.authService.profile(),
        ]).subscribe({
            next: ([sub, user]) => {
                this.userSubscription.set(sub)
                if (new Date(sub.endDate) < new Date()) {
                    this.subscriptionIsOver.set(true)
                }
                this.user = user;
                const {
                    title = '',
                    firstname = '',
                    lastname = '',
                    username = '',
                    email = '',
                    gender = '',
                    phone = '',
                    refCode = '',
                    schoolName = '',
                    regional = '',
                    district = '',
                } = user;
                this.userForm.get('gender')?.setValue(gender || 'Hombre');
                this.userForm.setValue({
                    title,
                    firstname,
                    lastname,
                    username,
                    email,
                    gender,
                    phone,
                    refCode,
                    schoolName,
                    regional,
                    district,
                });
                if (user.refCode) {
                    this.userForm.get('refCode')?.disable();
                }
            }
        });
    }

    onSubmit() {
        const profile: any = this.userForm.value;
        this.authService.update(profile).subscribe({
            next: (res) => {
                if (res.modifiedCount === 1) {
                    this.sb.open('Perfil actualizado con exito', 'Ok', {
                        duration: 2500,
                    });
                }
            },
            error: (err) => {
                console.log(err);
                this.sb.open('Hubo un error al guardar', 'Ok', {
                    duration: 2500,
                });
            },
        });
    }

    get titles() {
        const gender = this.userForm.get('gender')?.value;
        if (gender === 'Hombre') {
            return this.titleOptions.Hombre;
        }
        return this.titleOptions.Mujer;
    }
}
