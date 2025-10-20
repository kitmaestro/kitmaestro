import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { User } from '../../../core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UserSubscriptionService } from '../../../core/services/user-subscription.service';
import { ClassSectionService } from '../../../core/services/class-section.service';
import { UserSubscription } from '../../../core';
import { MatCardModule } from '@angular/material/card';
import { sha512_256 } from 'js-sha512';
import { DatePipe } from '@angular/common';
import { PretifyPipe } from '../../../shared/pipes/pretify.pipe';
import { ClassSection } from '../../../core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
	MatDialogRef,
	MAT_DIALOG_DATA,
	MatDialog,
	MatDialogModule,
} from '@angular/material/dialog';
import { SCHOOL_SUBJECT } from '../../../core/enums/school-subject.enum';
import { Store } from '@ngrx/store';
import { loadUser, updateUser } from '../../../store/users/users.actions';
import { selectAuthUser } from '../../../store/auth/auth.selectors';
import { selectUsersCurrentUser } from '../../../store/users/users.selectors';

@Component({
	selector: 'app-section-creator',
	imports: [
		MatFormFieldModule,
		MatSelectModule,
		MatButtonModule,
		FormsModule,
		MatInputModule,
		MatDialogModule,
		PretifyPipe,
	],
	template: `
		<h3 mat-dialog-title>Crear Sección</h3>
		<mat-dialog-content>
			<form>
				<mat-form-field appearance="outline">
					<mat-label>Nivel</mat-label>
					<mat-select [(ngModel)]="level" name="level">
						<mat-option value="PRIMARIA">Primaria</mat-option>
						<mat-option value="SECUNDARIA">Secundaria</mat-option>
					</mat-select>
				</mat-form-field>
				<mat-form-field appearance="outline">
					<mat-label>Grado</mat-label>
					<mat-select [(ngModel)]="year" name="year">
						@for (grade of grades; track grade.value) {
							<mat-option [value]="grade.value">{{
								grade.label
							}}</mat-option>
						}
					</mat-select>
				</mat-form-field>
				<mat-form-field appearance="outline">
					<mat-label>Nombre</mat-label>
					<input matInput [(ngModel)]="name" name="name" />
				</mat-form-field>
				<mat-form-field appearance="outline">
					<mat-label>Asignaturas</mat-label>
					<mat-select multiple [(ngModel)]="subjects" name="subjects">
						@for (subject of subjectOptions; track $index) {
							<mat-option [value]="subject">{{
								subject | pretify
							}}</mat-option>
						}
					</mat-select>
				</mat-form-field>
				<button mat-flat-button color="primary" (click)="onSubmit()">
					Crear
				</button>
			</form>
		</mat-dialog-content>
	`,
	styles: [
		`
			form {
				display: grid;
				margin-top: 12px;
				grid-template-columns: 1fr 1fr;
				gap: 12px;
			}
		`,
	],
})
class SectionCreatorComponent {
	private dialogRef = inject(MatDialogRef<SectionCreatorComponent>)
	private data = inject<ClassSection>(MAT_DIALOG_DATA)

	user = signal('');
	level = signal('');
	year = signal('');
	name = signal('');
	subjects = signal<string[]>([]);

	grades = [
		{ value: 'PRIMERO', label: 'Primero' },
		{ value: 'SEGUNDO', label: 'Segundo' },
		{ value: 'TERCERO', label: 'Tercero' },
		{ value: 'CUARTO', label: 'Cuarto' },
		{ value: 'QUINTO', label: 'Quinto' },
		{ value: 'SEXTO', label: 'Sexto' },
	];
	subjectOptions = Object.values(SCHOOL_SUBJECT);

	ngOnInit() {
		if (this.data.user) this.user.set(this.data.user._id);
		if (this.data.level) this.level.set(this.data.level);
		if (this.data.year) this.year.set(this.data.year);
		if (this.data.name) this.name.set(this.data.name);
		if (this.data.subjects) this.subjects.set(this.data.subjects);
	}

	onSubmit() {
		this.dialogRef.close({
			...this.data,
			user: this.user(),
			level: this.level(),
			year: this.year(),
			name: this.name(),
			subjects: this.subjects(),
		});
	}
}

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
		MatIconModule,
	],
	template: `
		@if (user) {
			<div>
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
				<h2>{{ user.title }}. {{ user.firstname }} {{ user.lastname }}</h2>
				<div>Miembro desde el {{ user.createdAt | date: 'dd/MM/yyyy' }}</div>
			<div>
				<h3>Información Personal</h3>
				<p><b>Sexo</b>: {{ user.gender }}</p>
				<p><b>Nombre(s)</b>: {{ user.firstname }}</p>
				<p><b>Apellido(s)</b>: {{ user.lastname }}</p>
				<p><b>Título Alcanzado</b>: {{ user.title }}</p>
				@if (activeUser(); as activeUser) {
					@if (activeUser.email === 'orgalay.dev@gmail.com') {
						<p><b>Email</b>: {{ user.email }}</p>
						@if (user.phone) {
							<p>
								<b>Teléfono</b>:
								<a [href]="waLink(user)" target="_blank">{{
									user.phone
								}}</a>
							</p>
						}
						<div style="display: flex; gap: 12px;">
							<div style="flex: 1 auto auto;">
								<mat-form-field appearance="outline">
									<mat-label>Contrase&ntilde;a</mat-label>
									<input
										matInput
										[formControl]="newPassword"
									/>
								</mat-form-field>
							</div>
							<div style="">
								<button
									mat-flat-button
									(click)="updatePassword()"
									[disabled]="!newPassword.value"
								>
									Cambiar Contrase&ntilde;a
								</button>
							</div>
						</div>
					}
				}
				<p><b>Codigo de Referencia</b>: {{ user.refCode }}</p>
				<div style="margin-top: 20px; margin-bottom: 20px;">
					<button
						mat-raised-button
						color="accent"
						(click)="exportContact()"
					>
						<mat-icon>save_alt</mat-icon>
						Exportar Contacto
					</button>
				</div>

				@if (activeUser(); as activeUser) {
					@if (activeUser.email === 'orgalay.dev@gmail.com') {
						<p><b>Escuela</b>: {{ user.schoolName }} - Distrito {{ user.regional }}-{{ user.district }}</p>
						<p><b>Regional</b>: {{ user.regional }}</p>
						<p><b>Distrito</b>: {{ user.district }}</p>

						<h3>Secciones</h3>
						@for (section of classSections; track $index) {
							<div
								style="display: flex; gap: 12px; align-items: center; margin-bottom: 12px"
							>
								<p>
									{{ $index + 1 }}. {{ section.name }} ({{
										section.year | pretify
									}}
									de {{ section.level | pretify }})
								</p>
								<button
									mat-icon-button
									(click)="editSection(section)"
								>
									<mat-icon>edit</mat-icon>
								</button>
								<button
									mat-icon-button
									(click)="deleteSection(section._id)"
								>
									<mat-icon>delete</mat-icon>
								</button>
							</div>
						}

						<h3>Suscripción</h3>
						@if (subscription) {
							@if (subscription.subscriptionType === 'FREE') {
								<p>Usuario Gratuito</p>
							} @else {
								<p>
									{{ subscription.subscriptionType }} hasta
									{{
										subscription.endDate
											| date: 'dd/MM/yyyy'
									}}
								</p>
							}
						}
						<form
							[formGroup]="subscriptionForm"
							(ngSubmit)="onSubmit()"
						>
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
										<mat-select
											formControlName="subscriptionType"
										>
											<mat-option value="Plan Basico"
												>Plan Básico</mat-option
											>
											<mat-option value="Plan Plus"
												>Plan Plus</mat-option
											>
											<mat-option value="Plan Premium"
												>Plan Premium</mat-option
											>
											<mat-option value="FREE"
												>Gratuito</mat-option
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
										<mat-label
											>Fecha de Finalización</mat-label
										>
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
							<button mat-flat-button type="submit">
								Guardar
							</button>
						</form>
					}
				}
			</div>
			</div>
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
	private store = inject(Store);
	private userId = this.route.snapshot.paramMap.get('id') || '';
	private subscriptionService = inject(UserSubscriptionService);
	private sectionService = inject(ClassSectionService);
	private dialog = inject(MatDialog);

	user: User | null = null;
	subscription: UserSubscription | null = null;
	classSections: ClassSection[] = [];
	gravatarUrl = '';
	activeUser = this.store.selectSignal(selectAuthUser)

	newPassword = this.fb.control('');

	subscriptionForm = this.fb.group({
		user: [''],
		subscriptionType: ['Premium Básico'],
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

	loadSubscription() {
		this.subscriptionService.findByUser(this.userId).subscribe({
			next: (subscription) => {
				this.subscription = subscription;
				const {
					user,
					subscriptionType,
					status,
					startDate,
					endDate,
					method,
					amount,
				} = subscription;
				const start = new Date(startDate).toISOString().split('T')[0];
				const end = new Date(endDate).toISOString().split('T')[0];
				this.subscriptionForm.patchValue({
					user,
					subscriptionType,
					status,
					startDate: start,
					endDate: end,
					method,
					amount,
				});
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
		const userId = this.userId
		this.store.dispatch(loadUser({ userId }))
		this.store.select(selectUsersCurrentUser).subscribe(user => {
			if (user) {
				this.user = user
				this.subscriptionForm.get('user')?.setValue(userId)
				this.gravatarUrl = 'https://gravatar.com/avatar/' + sha512_256(user.email.toLowerCase().trim())
				this.loadSubscription()
				this.loadSections()
			}
		})
	}

	ngOnInit() {
		this.loadUser();
	}

	onSubmit() {
		const subscription: UserSubscription = this.subscriptionForm
			.value as unknown as UserSubscription;
		this.subscriptionService.create(subscription).subscribe(() => {
			this.loadUser();
			this.sb.open('Suscripción creada exitosamente', 'Ok', {
				duration: 2500,
			});
		});
	}

	editSection(section: ClassSection) {
		const ref = this.dialog.open(SectionCreatorComponent, {
			data: section,
		});
		ref.afterClosed().subscribe((result) => {
			if (result) {
				this.sectionService
					.updateSection(result._id, result)
					.subscribe(() => {
						this.loadSections();
						this.sb.open('Sección actualizada exitosamente', 'Ok', {
							duration: 2500,
						});
					});
			}
		});
	}

	addSection(schoolId: string) {
		const data = {
			school: schoolId,
			user: this.userId,
		};
		const ref = this.dialog.open(SectionCreatorComponent, {
			data,
		});
		ref.afterClosed().subscribe((result) => {
			if (result) {
				this.sectionService.addSection(result).subscribe((section) => {
					this.classSections.push(section);
					this.sb.open('Sección creada exitosamente', 'Ok', {
						duration: 2500,
					});
				});
			}
		});
	}

	deleteSection(id: string) {
		this.sectionService.deleteSection(id).subscribe(() => {
			this.loadSections();
			this.sb.open('Sección eliminada exitosamente', 'Ok', {
				duration: 2500,
			});
		});
	}

	/**
	 * Genera un archivo CSV con los datos del usuario para importarlo
	 * como contacto en Google Contacts o HubSpot.
	 */
	exportContact() {
		if (!this.user) {
			this.sb.open('Los datos del usuario aún no se han cargado.', 'Ok', {
				duration: 3000,
			});
			return;
		}

		// Encabezados estándar para Google Contacts.
		const headers = [
			'Name',
			'Given Name',
			'Family Name',
			'E-mail 1 - Value',
			'Phone 1 - Value',
		];

		const fullName =
			`${this.user.firstname || ''} ${this.user.lastname || ''}`.trim();

		const userRow = [
			fullName,
			(this.user.firstname || '') + ' Profe',
			this.user.lastname || '',
			this.user.email || '',
			this.user.phone || '',
		];

		// Función para escapar comillas y comas para mantener la integridad del CSV.
		const escapeCsvField = (field: string) => {
			if (field === null || field === undefined) {
				return '';
			}
			let escapedField = field.toString().replace(/"/g, '""');
			if (
				escapedField.includes(',') ||
				escapedField.includes('"') ||
				escapedField.includes('\n')
			) {
				escapedField = `"${escapedField}"`;
			}
			return escapedField;
		};

		// Construye el contenido del CSV.
		const csvContent = [
			headers.join(','),
			userRow.map(escapeCsvField).join(','),
		].join('\n');

		// Crea un Blob y simula un clic para descargar el archivo.
		const blob = new Blob([csvContent], {
			type: 'text/csv;charset=utf-8;',
		});
		const link = document.createElement('a');

		const url = URL.createObjectURL(blob);
		link.setAttribute('href', url);

		// Crea un nombre de archivo seguro.
		const filename =
			`contacto_${this.user.firstname}_${this.user.lastname}.csv`
				.replace(/[^a-z0-9_.]/gi, '_')
				.toLowerCase();
		link.setAttribute('download', filename);

		link.style.visibility = 'hidden';
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url); // Libera la memoria del objeto URL.
	}

	updatePassword() {
		const password: string = this.newPassword.getRawValue() || '';
		if (password && this.user)
			this.store.dispatch(updateUser({ userId: this.user._id, data: { password } }))
	}
}
