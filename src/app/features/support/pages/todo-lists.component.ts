import { Component, inject } from '@angular/core'
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatSelectModule } from '@angular/material/select'
import { MatSlideToggleModule } from '@angular/material/slide-toggle'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { AsyncPipe } from '@angular/common'
import { Router, RouterModule } from '@angular/router'
import { tap } from 'rxjs'
import { Store } from '@ngrx/store'
import { createList, deleteList, selectAuthUser } from '../../../store'
import { selectAllLists, selectCurrentList } from '../../../store/todo-lists/todo-lists.selectors'

@Component({
	selector: 'app-todo-lists',
	imports: [
		MatSnackBarModule,
		ReactiveFormsModule,
		MatButtonModule,
		MatIconModule,
		MatFormFieldModule,
		MatInputModule,
		MatSelectModule,
		MatSlideToggleModule,
		AsyncPipe,
		RouterModule,
	],
	template: `
		<div style="margin-bottom: 24px">
			<div style="display: flex; justify-content: space-between; align-items: center;">
				<h2>Colecciones de Tareas</h2>
				<button
					style="margin-left: auto"
					mat-button
					color="primary"
					(click)="toggleForm()"
				>
					@if (showForm) {
						<mat-icon>close</mat-icon>
					} @else {
						<mat-icon>add</mat-icon>
					}
					<span>{{ showForm ? 'Ocultar Formulario' : 'Agregar Colecci&oacute;n' }}</span>
				</button>
			</div>
			<div>
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
								mat-flat-button
								color="primary"
								type="submit"
							>
								<mat-icon>save</mat-icon>
								Guardar
							</button>
						</div>
					</form>
				}
			</div>
		</div>

		<div class="card-grid">
			@for (list of todoLists$ | async; track list) {
				<div>
					<div>
						<h3>
							{{ list.name }} ({{
								list.active ? 'Activa' : 'Inactiva'
							}})
						</h3>
					</div>
					<div>
						<p style="padding: 12px">
							{{ list.description }}
						</p>
					</div>
					<div>
						<button
							type="button"
							[routerLink]="['/support', 'todos', list._id]"
							mat-button
							color="accent"
							style="margin-right: 12px; margin-left: auto"
						>
							Abrir
						</button>
						<button
							type="button"
							(click)="deleteList(list._id)"
							mat-button
							color="warn"
							style="margin-right: auto"
						>
							Eliminar
						</button>
					</div>
				</div>
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
	private sb = inject(MatSnackBar)
	#store = inject(Store)
	#user = this.#store.selectSignal(selectAuthUser)
	private fb = inject(FormBuilder)
	private router = inject(Router)

	todoLists$ = this.#store.select(selectAllLists)
	showForm = false

	todoListForm = this.fb.group({
		name: ['', Validators.required],
		description: ['', Validators.required],
		active: [true],
	})

	toggleForm() {
		this.showForm = !this.showForm
	}

	deleteList(id: string) {
		this.#store.dispatch(deleteList({ id }))
	}

	addList() {
		const user = this.#user()
		if (user) {
			const todoList: any = this.todoListForm.value
			todoList.user = user._id
			this.#store.dispatch(createList({ list: todoList }))
			const sub = this.#store.select(selectCurrentList).pipe(tap((list) => {
				if (list) {
					sub.unsubscribe()
					this.router.navigate(['/support', 'todos', list._id])
				}
			})).subscribe()
		}
	}
}
