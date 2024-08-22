import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TodoService } from '../services/todo.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatExpansionModule } from '@angular/material/expansion';
import { AsyncPipe } from '@angular/common';
import { IsEmptyComponent } from '../ui/alerts/is-empty/is-empty.component';
import { Todo } from '../interfaces/todo';
import { tap } from 'rxjs';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { TodoList } from '../interfaces/todo-list';

@Component({
  selector: 'app-todos',
  standalone: true,
  imports: [
    RouterModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatInputModule,
    MatSelectModule,
    MatExpansionModule,
    MatSlideToggleModule,
    AsyncPipe,
    IsEmptyComponent,
  ],
  templateUrl: './todos.component.html',
  styleUrl: './todos.component.scss'
})
export class TodosComponent {
  route = inject(ActivatedRoute);
  router = inject(Router);
  todoService = inject(TodoService);
  sb = inject(MatSnackBar);
  dialog = inject(MatDialog);
  fb = inject(FormBuilder);
  listId = this.route.snapshot.paramMap.get('id');
  todoList$ = this.todoService.findList(this.listId || '').pipe(tap(list => { if (list) { list.id = this.listId as string; this.listForm.setValue(list); } }));
  todos$ = this.todoService.findByList(this.listId || '');

  showForm = false;
  showEditForm = false;

  listForm = this.fb.group({
    id: [''],
    uid: [''],
    name: [''],
    description: [''],
    active: [true],
  });

  todoForm = this.fb.group({
    title: [''],
    description: [''],
    completed: [false],
    listId: [this.listId],
  });

  toggleForm() {
    this.showForm = !this.showForm;
  }

  toggleEditForm() {
    this.showEditForm = !this.showEditForm;
  }

  onSubmit() {
    this.todoList$.subscribe(list => {
      if (list) {
        const todo: Todo = this.todoForm.value as any as Todo;
        todo.uid = list.uid;
        this.todoService.addTodo(todo).then(() => {
          this.toggleForm();
        });
      } else {
        this.sb.open('Hubo un error al guardar.', undefined, { duration: 2500 })
      }
    })
  }

  markAsCompleted(todo: Todo) {
    const completed = todo;
    completed.completed = !completed.completed;
    this.todoService.updateTodo(todo.id, completed).then(() => {
      this.sb.open('Pendiente completado!', undefined, { duration: 2500 });
    });
  }

  deleteTodo(id: string) {
    this.todoService.deleteTodo(id).then(() => {
      this.sb.open('La tarea ha sido eliminada', undefined, { duration: 2500 });
    })
  }

  editList() {
    const list: TodoList = this.listForm.value as TodoList;
    this.todoService.updateList(list.id, list).then(() => {
      this.sb.open('Los detalles de la lista han sido actualizados.', undefined, { duration: 2500 });
    });
  }
}
