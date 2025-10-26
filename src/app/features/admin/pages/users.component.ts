import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { UserSubscriptionService } from '../../../core/services/user-subscription.service';
import { UnitPlanService } from '../../../core/services/unit-plan.service';
import { ClassPlansService } from '../../../core/services/class-plans.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { User } from '../../../core';
import { selectUsersUsers } from '../../../store/users/users.selectors';
import {
	createUser,
	deleteUser,
	loadUsers,
} from '../../../store/users/users.actions';
import { UserDto } from '../../../store/users/users.models';

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
									<mat-option value="Hombre"
										>Hombre</mat-option
									>
									<mat-option value="Mujer">Mujer</mat-option>
								</mat-select>
							</mat-form-field>
						</div>
						<div>
							<mat-form-field appearance="outline">
								<mat-label>Teléfono</mat-label>
								<input
									type="text"
									matInput
									formControlName="phone"
								/>
							</mat-form-field>
						</div>
						<div>
							<mat-form-field appearance="outline">
								<mat-label>Email</mat-label>
								<input
									type="email"
									matInput
									formControlName="email"
								/>
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
				<td
					mat-cell
					*matCellDef="let user"
					routerLink="/admin/users/{{ user._id }}"
				>
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
					<a target="_blank" [href]="waLink(user)">{{
						user.phone
					}}</a>
				</td>
			</ng-container>
			<ng-container matColumnDef="sex">
				<th mat-header-cell *matHeaderCellDef>Sexo</th>
				<td mat-cell *matCellDef="let user">{{ user.gender }}</td>
			</ng-container>
			<ng-container matColumnDef="memberSince">
				<th mat-header-cell *matHeaderCellDef>Miembro desde</th>
				<td mat-cell *matCellDef="let user">
					{{ user.createdAt | date: 'd/M/yyyy, h:mm a' }}
				</td>
			</ng-container>
			<ng-container matColumnDef="actions">
				<th mat-header-cell *matHeaderCellDef>Acciones</th>
				<td mat-cell *matCellDef="let user">
					<button (click)="removeUser(user._id)" mat-icon-button>
						<mat-icon>delete</mat-icon>
					</button>
					<a
						routerLink="/admin/users/{{ user._id }}"
						style="margin-left: 12px"
						mat-icon-button
						><mat-icon>open_in_new</mat-icon></a
					>
				</td>
			</ng-container>

			<tr mat-header-row *matHeaderRowDef="columnsToDisplay"></tr>
			<tr
				mat-row
				*matRowDef="let myRowData; columns: columnsToDisplay"
			></tr>
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
	private store = inject(Store);
	private subscriptionService = inject(UserSubscriptionService);
	private unitPlanService = inject(UnitPlanService);
	private classPlanService = inject(ClassPlansService);
	private fb = inject(FormBuilder);

	columnsToDisplay = [
		'name',
		'sex',
		'email',
		'phone',
		'memberSince',
		'actions',
	];

	users$ = this.store.select(selectUsersUsers);
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

	ngOnInit() {
		this.store.dispatch(loadUsers());
	}

	waLink(user: User): string {
		if (!user.phone || !user.firstname) return '#';
		const phone = user.phone.replace(/\D+/g, ''); // elimina todo lo que no sea dígito
		if (!/^\d{6,15}$/.test(phone)) {
			console.error(
				'Número de teléfono inválido después de limpiar caracteres.',
			);
			return '#';
		}

		const name = (user.firstname || '').trim();
		const messageLines = [
			`Hola${name ? ' ' + name : ''}, ¿todo bien con KitMaestro?
Veo que creaste una cuenta y quería confirmar si pudiste ingresar y crear tu primera planificación.
Si te da algún error o no sabes por dónde empezar, dime y te lo resuelvo en 2 minutos por aquí.
¿Pudiste probarla o quieres que te guíe?`,
		];
		const message = messageLines.join(' ');
		const encoded = encodeURIComponent(message);

		return `https://wa.me/${phone.startsWith('809') || phone.startsWith('809') || phone.startsWith('849') ? '+1' + phone : phone}?text=${encoded}`;
	}

	removeUser(userId: string) {
		this.store.dispatch(deleteUser({ userId }));
	}

	createUser() {
		const user: UserDto = this.userForm.getRawValue() as any;

		this.store.dispatch(createUser({ user }));
	}
}
