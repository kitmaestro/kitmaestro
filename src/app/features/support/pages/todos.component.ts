import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TodoListService } from '../../../core/services/todo-list.service';
import { TodoService } from '../../../core/services/todo.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatExpansionModule } from '@angular/material/expansion';
import { IsEmptyComponent } from '../../../shared/ui/is-empty.component';
import { Todo } from '../../../core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { TodoList } from '../../../core';
import { TodoFormComponent } from '../components/todo-form.component';

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
		@if (todoList) {
			<mat-card style="margin-bottom: 24px">
				<mat-card-header>
					<h2 mat-card-title>{{ todoList.name }}</h2>
					<button
						style="margin-left: auto"
						mat-mini-fab
						color=""
						[routerLink]="['/todos']"
					>
						<mat-icon>arrow_back</mat-icon>
					</button>
					<button
						style="margin-left: 12px"
						mat-mini-fab
						color=""
						(click)="toggleEditForm()"
					>
						<mat-icon>edit</mat-icon>
					</button>
					<button
						style="margin-left: 12px"
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
									mat-raised-button
									color="primary"
									type="submit"
								>
									Guardar
								</button>
							</div>
						</form>
					}
				</mat-card-content>
			</mat-card>

			@if (showForm) {
				<mat-card style="margin-bottom: 24px">
					<mat-card-header>
						<h3 mat-card-title>Agregar Pendiente</h3>
					</mat-card-header>
					<mat-card-content>
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
									mat-raised-button
									color="primary"
								>
									Agregar
								</button>
							</div>
						</form>
					</mat-card-content>
				</mat-card>
			}

			<mat-accordion>
				@for (todo of todos; track todo) {
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
		} @else {}
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
	private route = inject(ActivatedRoute);
	private router = inject(Router);
	private dialog = inject(MatDialog);
	private todoListService = inject(TodoListService);
	private todoService = inject(TodoService);
	private sb = inject(MatSnackBar);
	private fb = inject(FormBuilder);

	listId = this.route.snapshot.paramMap.get('id') || '';
	todoList: TodoList | null = null;
	todos: Todo[] = [];
	loading = true;

	showForm = false;
	showEditForm = false;
	showTodoEditForm = false;

	listForm = this.fb.group({
		_id: [''],
		user: [''],
		name: [''],
		description: [''],
		active: [true],
	});

	todoForm = this.fb.group({
		title: ['', Validators.required],
		description: ['', Validators.required],
		completed: [false],
		list: [this.listId],
	});

	toggleForm() {
		this.showForm = !this.showForm;
	}

	toggleEditForm() {
		this.showEditForm = !this.showEditForm;
	}

	loadList() {
		this.loading = true;
		this.todoListService.findOne(this.listId).subscribe({
			next: (list) => {
				if (list._id) {
					this.todoList = list;
					const { _id, user, name, description, active } = list;
					this.listForm.setValue({
						_id,
						user,
						name,
						description,
						active,
					});
					this.loading = false;
				}
			},
			error: () => {
				this.router.navigate(['/todos']).then(() => {
					this.sb.open('No pudimos encontrar la lista solicitada');
				});
			},
			complete: () => {
				this.loading = false;
			},
		});
	}

	loadTodos() {
		this.loading = true;
		this.todoService.findByList(this.listId).subscribe({
			next: (todos) => {
				if (todos) {
					this.todos = todos;
				}
			},
			complete: () => {
				this.loading = false;
			},
		});
	}

	ngOnInit(): void {
		this.loadList();
		this.loadTodos();
	}

	onSubmit() {
		const todo: any = this.todoForm.value;
		todo.user = this.listForm.get('user')?.value;
		this.todoService.create(todo).subscribe({
			next: (todo) => {
				if (todo) {
					this.sb.open('Nuevo pendiente guardardo', 'Ok', {
						duration: 2500,
					});
					this.toggleForm();
					this.loadTodos();
					this.todoForm.setValue({
						title: '',
						description: '',
						completed: false,
						list: this.listId,
					});
				}
			},
		});
	}

	markAsCompleted(todo: Todo) {
		this.todoService.update(todo._id, { completed: !todo.completed }).subscribe({
			next: () => {
				this.sb.open(
					'Pendiente ' + todo.completed
						? 'completado!'
						: 'pendiente',
					undefined,
					{ duration: 2500 },
				);
				this.loadTodos();
			},
		});
	}

	deleteTodo(id: string) {
		this.todoService.delete(id).subscribe({
			next: (result) => {
				if (result.deletedCount === 1) {
					this.sb.open('La tarea ha sido eliminada', undefined, {
						duration: 2500,
					});
					this.loadTodos();
				}
			},
		});
	}

	editTodo(todo: Todo) {
		const ref = this.dialog.open(TodoFormComponent, {
			data: todo,
		});
		ref.afterClosed().subscribe(() => {
			this.loadTodos();
		});
	}

	editList() {
		const list: any = this.listForm.value;
		this.todoService.update(list._id, list).subscribe({
			next: () => {
				this.sb.open(
					'Los detalles de la lista han sido actualizados.',
					undefined,
					{ duration: 2500 },
				);
				this.loadList();
			},
		});
	}
}
