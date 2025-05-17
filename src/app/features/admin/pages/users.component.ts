import { Component, inject } from '@angular/core';
import { UserSettingsService } from '../../../core/services/user-settings.service';
import { UserSubscriptionService } from '../../../core/services/user-subscription.service';
import { UnitPlanService } from '../../../core/services/unit-plan.service';
import { ClassPlansService } from '../../../core/services/class-plans.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

@Component({
	selector: 'app-users',
	imports: [
		MatCardModule,
		MatButtonModule,
		MatIconModule,
		MatTableModule,
		RouterLink,
		DatePipe,
		ReactiveFormsModule,
		MatSelectModule,
		MatFormFieldModule,
		MatSnackBarModule,
		MatInputModule,
	],
	template: `
		<mat-card>
			<mat-card-header>
				<mat-card-title>Crear Usuario</mat-card-title>
			</mat-card-header>
			<mat-card-content>
				<form [formGroup]="userForm" (ngSubmit)="createUser()">
					<div class="grid">
						<div>
							<mat-form-field appearance="outline">
								<mat-label>Nombre(s)</mat-label>
								<input
									type="text"
									matInput
									formControlName="firstname"
								/>
							</mat-form-field>
						</div>
						<div>
							<mat-form-field appearance="outline">
								<mat-label>Apellido(s)</mat-label>
								<input
									type="text"
									matInput
									formControlName="lastname"
								/>
							</mat-form-field>
						</div>
						<div>
							<mat-form-field appearance="outline">
								<mat-label>Sexo</mat-label>
								<mat-select formControlName="gender">
									<mat-option value="Hombre">Hombre</mat-option>
									<mat-option value="Mujer">Mujer</mat-option>
								</mat-select>
							</mat-form-field>
						</div>
						<div>
							<mat-form-field appearance="outline">
								<mat-label>Teléfono</mat-label>
								<input type="text" matInput formControlName="phone" />
							</mat-form-field>
						</div>
						<div>
							<mat-form-field appearance="outline">
								<mat-label>Email</mat-label>
								<input type="email" matInput formControlName="email" />
							</mat-form-field>
						</div>
						<div>
							<mat-form-field appearance="outline">
								<mat-label>Contraseña</mat-label>
								<input
									type="password"
									matInput
									formControlName="password"
								/>
							</mat-form-field>
						</div>
					</div>
					<div style="text-align: end">
						<button mat-flat-button color="primary" type="submit">
							Guardar
						</button>
					</div>
				</form>
			</mat-card-content>
		</mat-card>

		<h2>Usuarios del Sistema</h2>

		<table
			mat-table
			[dataSource]="users$"
			class="mat-elevation-z8"
			style="margin-top: 24px"
		>
			<ng-container matColumnDef="name">
				<th mat-header-cell *matHeaderCellDef>Nombre</th>
				<td mat-cell *matCellDef="let user" routerLink="/users/{{ user._id }}">
					{{ user.firstname }} {{ user.lastname }}
				</td>
			</ng-container>
			<ng-container matColumnDef="email">
				<th mat-header-cell *matHeaderCellDef>Email</th>
				<td mat-cell *matCellDef="let user">
					<a href="mailto:{{ user.email }}">{{ user.email }}</a>
				</td>
			</ng-container>
			<ng-container matColumnDef="phone">
				<th mat-header-cell *matHeaderCellDef>Teléfono</th>
				<td mat-cell *matCellDef="let user">
					<a
						target="_blank"
						href="https://wa.me/+1{{
							user.phone?.trim()?.replaceAll('-', '')?.replaceAll(' ', '')
						}}"
						>{{ user.phone }}</a
					>
				</td>
			</ng-container>
			<ng-container matColumnDef="sex">
				<th mat-header-cell *matHeaderCellDef>Sexo</th>
				<td mat-cell *matCellDef="let user">{{ user.gender }}</td>
			</ng-container>
			<ng-container matColumnDef="memberSince">
				<th mat-header-cell *matHeaderCellDef>Miembro desde</th>
				<td mat-cell *matCellDef="let user">
					{{ user.createdAt | date: "dd/MM/YYYY" }}
				</td>
			</ng-container>
			<ng-container matColumnDef="actions">
				<th mat-header-cell *matHeaderCellDef>Acciones</th>
				<td mat-cell *matCellDef="let user">
					<button (click)="deleteUser(user._id)" mat-mini-fab>
						<mat-icon>delete</mat-icon>
					</button>
					<a
						routerLink="/users/{{ user._id }}"
						style="margin-left: 12px"
						mat-mini-fab
						><mat-icon>open_in_new</mat-icon></a
					>
				</td>
			</ng-container>

			<tr mat-header-row *matHeaderRowDef="columnsToDisplay"></tr>
			<tr mat-row *matRowDef="let myRowData; columns: columnsToDisplay"></tr>
		</table>
	`,
	styles: `
		.grid {
			display: grid;
			grid-template-columns: 1fr;
			gap: 12px 24px;

			@media screen and (min-width: 960px) {
				grid-template-columns: 1fr 1fr;
			}

			@media screen and (min-width: 1200px) {
				grid-template-columns: 1fr 1fr 1fr;
			}
		}

		mat-form-field {
			width: 100%;
		}

		form {
			margin-top: 24px;
		}
	`,
})
export class UsersComponent {
	private userService = inject(UserSettingsService);
	private subscriptionService = inject(UserSubscriptionService);
	private unitPlanService = inject(UnitPlanService);
	private classPlanService = inject(ClassPlansService);
	private fb = inject(FormBuilder);
	private sb = inject(MatSnackBar);

	columnsToDisplay = [
		'name',
		'sex',
		'email',
		'phone',
		'memberSince',
		'actions',
	];

	users$ = this.userService.findAll();
	subscriptions$ = this.subscriptionService.findAll();
	unitPlans$ = this.unitPlanService.findAll();
	classPlans$ = this.classPlanService.findAll();

	userForm = this.fb.group({
		firstname: [''],
		lastname: [''],
		gender: [''],
		email: ['', [Validators.email, Validators.required]],
		password: ['', [Validators.required]],
		phone: [''],
	});

	deleteUser(id: string) {
		this.userService.delete(id).subscribe({
			next: (res) => {
				if (res.deletedCount > 0) {
					this.users$ = this.userService.findAll();
				}
			},
		});
	}

	createUser() {
		this.userService.create(this.userForm.value as any).subscribe({
			next: (res) => {
				if (res._id) {
					this.users$ = this.userService.findAll();
				}
			},
			error: (err) => {
				this.sb.open('Usuario no guardado.', 'Ok', { duration: 2500 });
				console.log(err.message);
			},
		});
	}
}
