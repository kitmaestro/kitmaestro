import { Component, inject, OnInit } from '@angular/core'
import { ActivatedRoute, Router, RouterModule } from '@angular/router'
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatCardModule } from '@angular/material/card'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatSelectModule } from '@angular/material/select'
import { MatExpansionModule } from '@angular/material/expansion'
import { IsEmptyComponent } from '../../../shared/ui/is-empty.component'
import { Todo } from '../../../core'
import { MatDialog, MatDialogModule } from '@angular/material/dialog'
import { MatSlideToggleModule } from '@angular/material/slide-toggle'
import { TodoFormComponent } from '../components/todo-form.component'
import { Store } from '@ngrx/store'
import { createTodo, deleteTodo, loadList, loadTodosByList, selectIsLoadingMany, updateList, updateTodo } from '../../../store'
import { selectCurrentList } from '../../../store/todo-lists/todo-lists.selectors'
import { selectAllTodos, selectListTodos } from '../../../store/todos/todos.selectors'

@Component({
	selector: 'app-todos',
	imports: [
		RouterModule,
		ReactiveFormsModule,
		MatSnackBarModule,
		MatFormFieldModule,
		MatCardModule,
		MatButtonModule,
		MatIconModule,
		MatInputModule,
		MatSelectModule,
		MatExpansionModule,
		MatSlideToggleModule,
		MatDialogModule,
		IsEmptyComponent,
	],
	template: `
		@if (todoList()) {
			<div style="margin-bottom: 24px;">
				<div style="display: flex; justify-content: space-between; align-items: center">
					<h2>{{ todoList()?.name }}</h2>
					<div>
						<button
							style="margin-left: auto"
							mat-button
							routerLink="/support/todos"
						>
							<mat-icon>arrow_back</mat-icon>
							Volver
						</button>
						<button
							style="margin-left: 12px"
							mat-button
							(click)="toggleEditForm()"
						>
							<mat-icon>edit</mat-icon>
							Editar
						</button>
						<button
							style="margin-left: 12px"
							mat-button
							(click)="toggleForm()"
						>
							@if (showForm) {
								<mat-icon>close</mat-icon>
							} @else {
								<mat-icon>add</mat-icon>
							}
							{{ showForm ? 'Cancelar' : 'Agregar' }}
						</button>
					</div>
				</div>
				<div>
					@if (showEditForm) {
						<form [formGroup]="listForm" (ngSubmit)="editList()">
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
									Guardar
								</button>
							</div>
						</form>
					}
				</div>
			</div>

			@if (showForm) {
				<div style="margin-bottom: 24px">
					<div>
						<h3>Agregar Pendiente</h3>
					</div>
					<div>
						<form [formGroup]="todoForm" (ngSubmit)="onSubmit()">
							<div>
								<mat-form-field appearance="outline">
									<mat-label>T&iacute;tulo</mat-label>
									<input formControlName="title" matInput />
								</mat-form-field>
							</div>
							<div>
								<mat-form-field appearance="outline">
									<mat-label>Descripci&oacute;n</mat-label>
									<textarea
										formControlName="description"
										matInput
									>
									</textarea>
								</mat-form-field>
							</div>
							<div style="text-align: end">
								<button
									type="submit"
									mat-flat-button
									color="primary"
								>
									Agregar
								</button>
							</div>
						</form>
					</div>
				</div>
			}

			<mat-accordion>
				@for (todo of todos(); track todo) {
					<mat-expansion-panel>
						<mat-expansion-panel-header>
							<mat-panel-title>
								{{ todo.title }}
							</mat-panel-title>
							<mat-panel-description>
								{{
									todo.completed ? 'Completado' : 'Pendiente'
								}}
							</mat-panel-description>
						</mat-expansion-panel-header>
						<p>
							{{ todo.description }}
							<br />
							<br />
							<button
								mat-icon-button
								(click)="markAsCompleted(todo)"
								[title]="
									'Marcar como ' +
									(todo.completed
										? 'pendiente'
										: 'completado')
								"
							>
								@if (todo.completed) {
									<mat-icon>pending</mat-icon>
								} @else {
									<mat-icon>done_all</mat-icon>
								}
							</button>
							<button
								mat-icon-button
								color="link"
								title="Editar"
								(click)="editTodo(todo)"
								style="margin-left: 12px"
							>
								<mat-icon>edit</mat-icon>
							</button>
							<button
								mat-icon-button
								color="warn"
								title="Eliminar"
								(click)="deleteTodo(todo._id)"
								style="margin-left: 12px"
							>
								<mat-icon>delete</mat-icon>
							</button>
						</p>
					</mat-expansion-panel>
				} @empty {
					<div style="grid-column: 1/-1">
						<app-is-empty
							resource="Pendiente"
							(onCreateRequest)="toggleForm()"
						></app-is-empty>
					</div>
				}
			</mat-accordion>
		}
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
export class TodosComponent implements OnInit {
	private route = inject(ActivatedRoute)
	private router = inject(Router)
	private dialog = inject(MatDialog)
	#store = inject(Store)
	private sb = inject(MatSnackBar)
	private fb = inject(FormBuilder)

	listId = this.route.snapshot.paramMap.get('id') || ''
	todoList = this.#store.selectSignal(selectCurrentList)
	todos = this.#store.selectSignal(selectListTodos)
	loading = this.#store.selectSignal(selectIsLoadingMany)

	showForm = false
	showEditForm = false
	showTodoEditForm = false

	listForm = this.fb.group({
		_id: [''],
		user: [''],
		name: [''],
		description: [''],
		active: [true],
	})

	todoForm = this.fb.group({
		title: ['', Validators.required],
		description: ['', Validators.required],
		completed: [false],
		list: [this.listId],
	})

	toggleForm() {
		this.showForm = !this.showForm
	}

	toggleEditForm() {
		this.showEditForm = !this.showEditForm
	}

	loadList() {
		const id = this.listId
		this.#store.dispatch(loadList({ id }))
		this.#store.select(selectCurrentList).subscribe({
			next: (list) => {
				if (list) {
					const { _id, user, name, description, active } = list
						this.listForm.setValue({
							_id,
							user,
						name,
						description,
						active,
					})
				}
			},
			error: () => {
				this.router.navigate(['/support', 'todos']).then(() => {
					this.sb.open('No pudimos encontrar la lista solicitada')
				})
			}
		})
	}

	loadTodos() {
		this.#store.dispatch(loadTodosByList({ listId: this.listId }))
	}

	ngOnInit(): void {
		this.loadList()
		this.loadTodos()
	}

	onSubmit() {
		const todo: any = this.todoForm.value
		todo.user = this.listForm.get('user')?.value
		this.#store.dispatch(createTodo({ todo }))
		this.toggleForm()
		this.todoForm.setValue({
			title: '',
			description: '',
			completed: false,
			list: this.listId,
		})
	}

	markAsCompleted(todo: Todo) {
		this.#store.dispatch(updateTodo({ id: todo._id, data: { completed: !todo.completed } }))
	}

	deleteTodo(id: string) {
		this.#store.dispatch(deleteTodo({ id }))
	}

	editTodo(todo: Todo) {
		const ref = this.dialog.open(TodoFormComponent, {
			data: todo,
		})
		ref.afterClosed().subscribe(() => {
			this.loadTodos()
		})
	}

	editList() {
		const list: any = this.listForm.value
		this.#store.dispatch(updateList({ id: list._id, data: list }))
		this.toggleEditForm()
	}
}
