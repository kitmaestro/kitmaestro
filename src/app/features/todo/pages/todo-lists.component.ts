import { Component, inject } from '@angular/core';
import { TodoListService } from '../../../core/services/todo-list.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserSettingsService } from '../../../core/services/user-settings.service';
import { UserSettings } from '../../../core/interfaces/user-settings';
import { AsyncPipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { tap } from 'rxjs';

@Component({
	selector: 'app-todo-lists',
	imports: [
		MatSnackBarModule,
		ReactiveFormsModule,
		MatButtonModule,
		MatCardModule,
		MatIconModule,
		MatFormFieldModule,
		MatInputModule,
		MatSelectModule,
		MatSlideToggleModule,
		AsyncPipe,
		RouterModule,
	],
	template: `
		<mat-card style="margin-bottom: 24px">
			<mat-card-header>
				<h2 mat-card-title>Listas de Tareas</h2>
				<button
					style="margin-left: auto"
					mat-mini-fab
					color="primary"
					(click)="toggleForm()"
				>
					@if (showForm) {
						<mat-icon>close</mat-icon>
					} @else {
						<mat-icon>add</mat-icon>
					}
				</button>
			</mat-card-header>
			<mat-card-content>
				@if (showForm) {
					<form [formGroup]="todoListForm" (ngSubmit)="addList()">
						<div style="margin-bottom: 12px">
							<mat-slide-toggle formControlName="active"
								>Activa</mat-slide-toggle
							>
						</div>
						<div>
							<mat-form-field appearance="outline">
								<mat-label>Nombre</mat-label>
								<input
									matInput
									formControlName="name"
									autocomplete="list-name"
								/>
							</mat-form-field>
						</div>
						<div>
							<mat-form-field appearance="outline">
								<mat-label>Descripci&oacute;n</mat-label>
								<textarea
									matInput
									formControlName="description"
									autocomplete="list-description"
								>
								</textarea>
							</mat-form-field>
						</div>
						<div style="text-align: end">
							<button
								mat-raised-button
								color="primary"
								type="submit"
							>
								Agregar
							</button>
						</div>
					</form>
				}
			</mat-card-content>
		</mat-card>

		<div class="card-grid">
			@for (list of todoLists$ | async; track list) {
				<mat-card>
					<mat-card-header>
						<h3 mat-card-title>
							{{ list.name }} ({{
								list.active ? 'Activa' : 'Inactiva'
							}})
						</h3>
					</mat-card-header>
					<mat-card-content>
						<p style="padding: 12px">
							{{ list.description }}
						</p>
					</mat-card-content>
					<mat-card-actions>
						<button
							type="button"
							[routerLink]="['/todos', list._id]"
							mat-raised-button
							color="accent"
							style="margin-right: 12px; margin-left: auto"
						>
							Abrir
						</button>
						<button
							type="button"
							(click)="deleteList(list._id)"
							mat-raised-button
							color="warn"
							style="margin-right: auto"
						>
							Eliminar
						</button>
					</mat-card-actions>
				</mat-card>
			}
		</div>
	`,
	styles: `
		mat-form-field {
			width: 100%;
		}

		.card-grid {
			display: grid;
			grid-template-columns: 1fr;
			gap: 24px;

			@media screen and (mmin-width: 760px) {
				grid-template-columns: repeat(2, 1fr);
			}

			@media screen and (min-width: 1024px) {
				grid-template-columns: repeat(3, 1fr);
			}

			@media screen and (min-width: 1400px) {
				grid-template-columns: repeat(4, 1fr);
			}
		}
	`,
})
export class TodoListsComponent {
	private sb = inject(MatSnackBar);
	private todoListService = inject(TodoListService);
	private userSettingsService = inject(UserSettingsService);
	private userSettings: UserSettings | null = null;
	private fb = inject(FormBuilder);
	private router = inject(Router);

	todoLists$ = this.todoListService
		.findAll()
		.pipe(tap(() => (this.loading = false)));
	showForm = false;
	loading = true;

	todoListForm = this.fb.group({
		name: ['', Validators.required],
		description: ['', Validators.required],
		active: [true],
	});

	constructor() {
		this.userSettingsService.getSettings().subscribe((settings) => {
			this.userSettings = settings;
		});
	}

	toggleForm() {
		this.showForm = !this.showForm;
	}

	deleteList(id: string) {
		this.todoListService.delete(id).subscribe({
			next: (result) => {
				if (result.deletedCount === 1) {
					this.sb.open('La Lista ha sido borrada');
					this.todoLists$ = this.todoListService.findAll();
				}
			},
		});
	}

	addList() {
		if (this.userSettings) {
			const todoList: any = this.todoListForm.value;
			todoList.user = this.userSettings._id;
			this.todoListService.create(todoList).subscribe({
				next: (list) => {
					this.router.navigate(['/todos', list._id]).then(() => {
						this.sb.open('Lista Creada!', 'Ok', { duration: 2500 });
					});
				},
			});
		}
	}
}
