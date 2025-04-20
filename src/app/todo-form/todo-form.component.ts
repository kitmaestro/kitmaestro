import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
	MAT_DIALOG_DATA,
	MatDialogModule,
	MatDialogRef,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Todo } from '../interfaces/todo';
import { TodoService } from '../services/todo.service';
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
	templateUrl: './todo-form.component.html',
	styleUrl: './todo-form.component.scss',
})
export class TodoFormComponent {
	private todoService = inject(TodoService);
	private sb = inject(MatSnackBar);
	private fb = inject(FormBuilder);

	todoEditForm = this.fb.group({
		_id: [''],
		title: [''],
		description: [''],
		completed: [false],
		list: [''],
	});

	constructor(
		@Inject(MAT_DIALOG_DATA) private data: Todo,
		public dialogRef: MatDialogRef<TodoFormComponent>,
	) {
		if (this.data) {
			const { _id, title, description, completed, list } = this.data;
			this.todoEditForm.setValue({
				_id,
				title,
				description,
				completed,
				list,
			});
		}
	}

	update() {
		const todo: any = this.todoEditForm.value;
		console.log('updating');
		this.todoService.update(todo._id, todo).subscribe({
			next: (res) => {
				if (res.modifiedCount === 1) {
					this.dialogRef.close(res);
					this.sb.open('La tarea ha sido actualizada.', 'Ok', {
						duration: 2500,
					});
				}
			},
			error: (err) => {
				this.sb.open('Error al guardar: ' + err.message, 'Ok', {
					duration: 2500,
				});
			},
		});
	}
}
