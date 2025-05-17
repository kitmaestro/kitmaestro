import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UserSettingsService } from '../../../core/services/user-settings.service';
import { UserSettings } from '../../../core/interfaces/user-settings';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UserSubscriptionService } from '../../../core/services/user-subscription.service';
import { SchoolService } from '../../../core/services/school.service';
import { ClassSectionService } from '../../../core/services/class-section.service';
import { UserSubscription } from '../../../core/interfaces/user-subscription';
import { MatCardModule } from '@angular/material/card';
import { sha512_256 } from 'js-sha512';
import { DatePipe } from '@angular/common';
import { School } from '../../../core/interfaces/school';
import { PretifyPipe } from '../../../shared/pipes/pretify.pipe';
import { ClassSection } from '../../../core/interfaces/class-section';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../core/services/auth.service';

@Component({
	selector: 'app-user-details',
	imports: [
		RouterModule,
		ReactiveFormsModule,
		MatSnackBarModule,
		MatCardModule,
		MatFormFieldModule,
		MatInputModule,
		MatSelectModule,
		MatButtonModule,
		PretifyPipe,
		DatePipe,
	],
	template: `
		@if (user) {
			<mat-card>
				<mat-card-header>
					<div
						mat-card-avatar
						class="example-header-image"
						style="width: 72px; height: 72px"
					>
						<a [href]="gravatarUrl" target="_blank">
							<img
								[src]="gravatarUrl"
								alt=""
								style="width: 72px; height: auto; border-radius: 50%"
							/>
						</a>
					</div>
					<mat-card-title
						>{{ user.title }}. {{ user.firstname }}
						{{ user.lastname }}</mat-card-title
					>
					<mat-card-subtitle
						>Miembro desde
						{{ user.createdAt | date: "dd/MM/YYYY" }}</mat-card-subtitle
					>
				</mat-card-header>
				<mat-card-content>
					<h3>Información Personal</h3>
					<p><b>Sexo</b>: {{ user.gender }}</p>
					<p><b>Nombre(s)</b>: {{ user.firstname }}</p>
					<p><b>Apellido(s)</b>: {{ user.lastname }}</p>
					<p><b>Título Alcanzado</b>: {{ user.title }}</p>
					<!-- TODO: Fix up this shit -->
					@if (activeUser && activeUser.email === "orgalay.dev@gmail.com") {
						<p><b>Email</b>: {{ user.email }}</p>
						<p><b>Teléfono</b>: {{ user.phone }}</p>
					}
					<p><b>Codigo de Referencia</b>: {{ user.refCode }}</p>

					@if (activeUser && activeUser.email === "orgalay.dev@gmail.com") {
						<h3>Escuelas</h3>
						@for (school of schools; track $index) {
							<p>
								{{ $index + 1 }}. {{ school.name }} ({{
									school.level | pretify
								}}) Distrito {{ school.regional }}-{{ school.district }}
							</p>
						}

						<h3>Secciones</h3>
						@for (section of classSections; track $index) {
							<p>
								{{ $index + 1 }}. {{ section.name }} ({{
									section.year | pretify
								}}
								de {{ section.level | pretify }}) -
								{{ section.school.name }}
							</p>
						}

						<h3>Suscripción</h3>
						@if (subscription) {
							@if (subscription.subscriptionType === "FREE") {
								<p>Usuario Gratuito</p>
							} @else {
								<p>
									{{ subscription.subscriptionType }} hasta
									{{ subscription.endDate | date: "dd/MM/YYYY" }}
								</p>
							}
						}
						<form [formGroup]="subscriptionForm" (ngSubmit)="onSubmit()">
							<div
								style="
									display: grid;
									gap: 12px;
									grid-template-columns: 1fr 1fr;
								"
							>
								<div>
									<mat-form-field appearance="outline">
										<mat-label>Suscripción</mat-label>
										<mat-select formControlName="subscriptionType">
											<mat-option value="Plan Básico"
												>Plan Básico</mat-option
											>
											<mat-option value="Plan Plus"
												>Plan Plus</mat-option
											>
											<mat-option value="Plan Premium"
												>Plan Premium</mat-option
											>
										</mat-select>
									</mat-form-field>
								</div>
								<div>
									<mat-form-field appearance="outline">
										<mat-label>Estado</mat-label>
										<mat-select formControlName="status">
											<mat-option value="active"
												>Activa</mat-option
											>
											<mat-option value="inactive"
												>Inactiva</mat-option
											>
										</mat-select>
									</mat-form-field>
								</div>
								<div>
									<mat-form-field appearance="outline">
										<mat-label>Fecha de Inicio</mat-label>
										<input
											type="date"
											matInput
											formControlName="startDate"
										/>
									</mat-form-field>
								</div>
								<div>
									<mat-form-field appearance="outline">
										<mat-label>Fecha de Finalización</mat-label>
										<input
											type="date"
											matInput
											formControlName="endDate"
										/>
									</mat-form-field>
								</div>
								<div>
									<mat-form-field appearance="outline">
										<mat-label>Método de Pago</mat-label>
										<input
											type="text"
											matInput
											formControlName="method"
										/>
									</mat-form-field>
								</div>
								<div>
									<mat-form-field appearance="outline">
										<mat-label>Monto Pagado</mat-label>
										<input
											type="number"
											matInput
											formControlName="amount"
										/>
									</mat-form-field>
								</div>
							</div>
							<button mat-flat-button type="submit">Guardar</button>
						</form>
					}
				</mat-card-content>
			</mat-card>
		} @else {
			<mat-card>
				<mat-card-content>
					<div class="hero">Cargando...</div>
				</mat-card-content>
			</mat-card>
		}
	`,
	styles: `
		.hero {
			padding: 48px;
			text-align: center;
		}
		mat-form-field {
			width: 100%;
		}
	`,
})
export class UserDetailsComponent implements OnInit {
	private router = inject(Router);
	private sb = inject(MatSnackBar);
	private fb = inject(FormBuilder);
	private route = inject(ActivatedRoute);
	private userService = inject(UserSettingsService);
	private userId = this.route.snapshot.paramMap.get('id') || '';
	private subscriptionService = inject(UserSubscriptionService);
	private schoolService = inject(SchoolService);
	private sectionService = inject(ClassSectionService);
	private authService = inject(AuthService);

	user: UserSettings | null = null;
	subscription: UserSubscription | null = null;
	schools: School[] = [];
	classSections: ClassSection[] = [];
	gravatarUrl = '';
	activeUser: UserSettings | null = null;

	subscriptionForm = this.fb.group({
		user: [''],
		subscriptionType: ['Plan Básico'],
		status: ['active'],
		startDate: [new Date().toISOString().split('T')[0]],
		endDate: [
			new Date(new Date().valueOf() + 30 * 24 * 60 * 60 * 1000)
				.toISOString()
				.split('T')[0],
		],
		method: ['cash'],
		amount: [0],
	});

	loadSubscription() {
		this.subscriptionService.findByUser(this.userId).subscribe({
			next: (subscription) => {
				this.subscription = subscription;
			},
		});
	}

	loadSchools() {
		this.schoolService.findAll({ user: this.userId }).subscribe({
			next: (schools) => {
				this.schools = schools;
			},
		});
	}

	loadSections() {
		this.sectionService.findAll({ user: this.userId }).subscribe({
			next: (classSections) => {
				this.classSections = classSections;
			},
		});
	}

	loadUser() {
		this.userService.find(this.userId).subscribe({
			next: (user) => {
				this.user = user;
				this.subscriptionForm.get('user')?.setValue(user._id);
				this.gravatarUrl =
					'https://gravatar.com/avatar/' +
					sha512_256(user.email.toLowerCase().trim());
				this.loadSubscription();
				this.loadSchools();
				this.loadSections();
			},
			error: (err) => {
				this.router.navigateByUrl('/').then(() => {
					this.sb.open(
						'Error al cargar el perfil del usuario',
						'Ok',
						{ duration: 2500 },
					);
					console.log(err.message);
				});
			},
		});
	}

	ngOnInit() {
		this.loadUser();
		this.authService.profile().subscribe((user) => {
			this.activeUser = user;
		});
	}

	onSubmit() {
		this.subscriptionService
			.create(this.subscriptionForm.value as any)
			.subscribe(() => {
				this.loadUser();
			});
	}
}
