import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
	MAT_DIALOG_DATA,
	MatDialogModule,
	MatDialogRef,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Todo } from '../../../core';
import { TodoService } from '../../../core/services/todo.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
	selector: 'app-todo-form',
	imports: [
		MatDialogModule,
		MatSnackBarModule,
		MatFormFieldModule,
		MatInputModule,
		ReactiveFormsModule,
		MatIconModule,
		MatButtonModule,
	],
	template: `
		<h2 mat-dialog-title>Editar Tarea</h2>
		<mat-dialog-content>
			<form (ngSubmit)="update()" [formGroup]="todoEditForm">
				<div>
					<mat-form-field>
						<mat-label>Titulo</mat-label>
						<input type="text" formControlName="title" matInput />
					</mat-form-field>
				</div>
				<div>
					<mat-form-field>
						<mat-label>Descripcion</mat-label>
						<textarea
							formControlName="description"
							matInput
						></textarea>
					</mat-form-field>
				</div>
				<div style="text-align: end">
					<button
						mat-icon-button
						color="warn"
						type="button"
						(click)="dialogRef.close(null)"
					>
						<mat-icon>close</mat-icon>
					</button>
					<button mat-icon-button color="primary" type="submit">
						<mat-icon>send</mat-icon>
					</button>
				</div>
			</form>
		</mat-dialog-content>
	`,
})
export class TodoFormComponent {
	private todoService = inject(TodoService);
	private sb = inject(MatSnackBar);
	private fb = inject(FormBuilder);
	private data = inject<Todo>(MAT_DIALOG_DATA);
	public dialogRef = inject(MatDialogRef<TodoFormComponent>);

	todoEditForm = this.fb.group({
		_id: [''],
		title: [''],
		description: [''],
		completed: [false],
		list: [''],
	});

	ngOnInit() {
		if (this.data) {
			const { _id, title, description, completed, list } = this.data;
			this.todoEditForm.setValue({
				_id,
				title,
				description,
				completed,
				list: list._id,
			});
		}
	}

	update() {
		const todo: any = this.todoEditForm.value;
		console.log('updating');
		this.todoService.update(todo._id, todo).subscribe({
			next: (res) => {
				this.dialogRef.close(res);
				this.sb.open('La tarea ha sido actualizada.', 'Ok', {
					duration: 2500,
				});
			},
			error: (err) => {
				this.sb.open('Error al guardar: ' + err.message, 'Ok', {
					duration: 2500,
				});
			},
		});
	}
}
