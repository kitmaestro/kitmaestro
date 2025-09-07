import { Component, inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { UserSettings } from '../../../core/interfaces/user-settings';
import { UpdateService } from '../../../core/services/update.service';

@Component({
	selector: 'app-new',
	imports: [
		MatCardModule,
		MatButtonModule,
		MatFormFieldModule,
		MatSelectModule,
		MatInputModule,
		MatSnackBarModule,
		MatIconModule,
		ReactiveFormsModule,
		RouterModule,
	],
	template: `
		<mat-card>
			<mat-card-header>
				<mat-card-title>Actualizaciones</mat-card-title>
			</mat-card-header>
			<mat-card-content>
				<div style="margin-top: 12px">
					<h2>Crear Nueva Entrada</h2>
					<form [formGroup]="form" (ngSubmit)="onSubmit()">
						<div style="display: flex; gap: 12px; margin-top: 24px">
							<div style="flex: 1 1 auto">
								<mat-form-field appearance="outline">
									<mat-label
										>Tipo de Publicaci&oacute;n</mat-label
									>
									<mat-select formControlName="type">
										@for (
											option of postType;
											track $index
										) {
											<mat-option [value]="option.id">{{
												option.label
											}}</mat-option>
										}
									</mat-select>
								</mat-form-field>
							</div>
							<div style="flex: 1 1 auto">
								<mat-form-field appearance="outline">
									<mat-label>Fecha</mat-label>
									<input
										type="date"
										matInput
										formControlName="date"
									/>
								</mat-form-field>
							</div>
						</div>
						<div>
							<mat-form-field appearance="outline">
								<mat-label>T&iacute;tulo</mat-label>
								<input
									type="text"
									matInput
									formControlName="title"
								/>
							</mat-form-field>
						</div>
						<div>
							<mat-form-field appearance="outline">
								<mat-label>Descripci&oacute;n</mat-label>
								<input
									type="text"
									matInput
									formControlName="description"
								/>
							</mat-form-field>
						</div>
						<div>
							<mat-form-field appearance="outline">
								<mat-label>Contenido</mat-label>
								<textarea
									matInput
									formControlName="content"
									rows="4"
								></textarea>
							</mat-form-field>
						</div>
						<div formArrayName="links">
							<h3>Enlaces</h3>
							@for (control of links.controls; track $index) {
								<div
									[formGroupName]="$index"
									style="
										display: grid;
										gap: 12px;
										grid-template-columns: 2fr 2fr 1fr 1fr;
									"
								>
									<div>
										<mat-form-field appearance="outline">
											<mat-label>Nombre</mat-label>
											<input
												type="text"
												matInput
												formControlName="label"
											/>
										</mat-form-field>
									</div>
									<div>
										<mat-form-field appearance="outline">
											<mat-label>Link</mat-label>
											<input
												type="text"
												matInput
												formControlName="link"
											/>
										</mat-form-field>
									</div>
									<div>
										<mat-form-field appearance="outline">
											<mat-label>Es externo?</mat-label>
											<mat-select
												formControlName="external"
											>
												<mat-option [value]="true"
													>Si</mat-option
												>
												<mat-option [value]="false"
													>No</mat-option
												>
											</mat-select>
										</mat-form-field>
									</div>
									<div>
										<button
											type="button"
											(click)="removeLink($index)"
											mat-raised-button
											color="warn"
										>
											Eliminar
										</button>
									</div>
								</div>
							}
							<button
								mat-raised-button
								type="button"
								color="accent"
								(click)="addLink()"
							>
								Agregar Enlace
							</button>
						</div>
						<div formArrayName="actions" style="margin-top: 12px">
							<h3>Acciones</h3>
							@for (control of actions.controls; track $index) {
								<div
									[formGroupName]="$index"
									style="
										display: grid;
										gap: 12px;
										grid-template-columns: 2fr 2fr 1fr;
									"
								>
									<div>
										<mat-form-field appearance="outline">
											<mat-label>Nombre</mat-label>
											<input
												type="text"
												matInput
												formControlName="label"
											/>
										</mat-form-field>
									</div>
									<div>
										<mat-form-field appearance="outline">
											<mat-label>Link</mat-label>
											<input
												type="text"
												matInput
												formControlName="link"
											/>
										</mat-form-field>
									</div>
									<div>
										<button
											type="button"
											(click)="removeAction($index)"
											mat-raised-button
											color="warn"
										>
											Eliminar
										</button>
									</div>
								</div>
							}
							<button
								mat-raised-button
								type="button"
								color="accent"
								(click)="addAction()"
							>
								Agregar Acci&oacute;n
							</button>
						</div>
						<div style="margin-top: 24px">
							<button
								type="submit"
								[disabled]="form.invalid"
								mat-raised-button
								color="primary"
							>
								Guardar
							</button>
						</div>
					</form>
				</div>
			</mat-card-content>
		</mat-card>
	`,
	styles: `
		mat-form-field {
			width: 100%;
		}
	`,
})
export class UpdateCreatorComponent implements OnInit {
	private authService = inject(AuthService);
	private updateService = inject(UpdateService);
	private fb = inject(FormBuilder);
	private router = inject(Router);
	private sb = inject(MatSnackBar);
	private user: UserSettings | null = null;
	private route = inject(ActivatedRoute);
	private updateId = this.route.snapshot.paramMap.get('id') || '';

	postType = [
		{
			id: 'notice',
			label: 'Actualizacion',
		},
		{
			id: 'feature',
			label: 'Caracteristica Nueva',
		},
		{
			id: 'bug',
			label: 'Correccion de Error',
		},
	];

	form = this.fb.group({
		title: [''],
		date: [new Date().toISOString().split('T')[0]],
		type: ['notice'],
		description: [''],
		content: [''],
		author: [''],
		links: this.fb.array([]),
		actions: this.fb.array([]),
	});

	ngOnInit() {
		if (this.updateId) {
			this.updateService.find(this.updateId).subscribe({
				next: (update) => {
					if (update) {
						this.form.get('title')?.setValue(update.title);
						this.form
							.get('date')
							?.setValue(
								new Date(update.date)
									.toISOString()
									.split('T')[0],
							);
						this.form.get('type')?.setValue(update.type);
						this.form
							.get('description')
							?.setValue(update.description);
						this.form.get('content')?.setValue(update.content);
						this.form.get('author')?.setValue(update.author);
					}
				},
			});
		} else {
			this.authService.profile().subscribe((user) => {
				if (user) {
					this.form
						.get('author')
						?.setValue(`${user.firstname} ${user.lastname}`);
				}
			});
		}
	}

	onSubmit() {
		const data: any = this.form.value;
		if (this.updateId) {
			this.updateService.update(this.updateId, data).subscribe((res) => {
				if (res.modifiedCount > 0) {
					this.router.navigateByUrl('/updates').then(() => {
						this.sb.open(
							'Se ha publicado la actualizacion!',
							'Ok',
							{ duration: 2500 },
						);
					});
				}
			});
		} else {
			this.updateService.create(data).subscribe((res) => {
				if (res._id) {
					this.router.navigateByUrl('/updates').then(() => {
						this.sb.open(
							'Se ha publicado la actualizacion!',
							'Ok',
							{ duration: 2500 },
						);
					});
				}
			});
		}
	}

	addLink() {
		setTimeout(() => {
			this.links.push(
				this.fb.group({
					label: [''],
					link: [''],
					external: [true],
				}),
			);
		}, 0);
	}

	addAction() {
		setTimeout(() => {
			this.actions.push(
				this.fb.group({
					label: [''],
					link: [''],
				}),
			);
		}, 0);
	}

	removeLink(index: number) {
		this.links.removeAt(index);
	}

	removeAction(index: number) {
		this.actions.removeAt(index);
	}

	get links(): FormArray {
		return this.form.get('links') as FormArray;
	}

	get actions(): FormArray {
		return this.form.get('actions') as FormArray;
	}
}
