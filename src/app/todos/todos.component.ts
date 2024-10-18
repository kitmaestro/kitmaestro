import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TodoListService } from '../services/todo-list.service';
import { TodoService } from '../services/todo.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatExpansionModule } from '@angular/material/expansion';
import { AsyncPipe } from '@angular/common';
import { IsEmptyComponent } from '../ui/alerts/is-empty/is-empty.component';
import { Todo } from '../interfaces/todo';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { TodoList } from '../interfaces/todo-list';
import { TodoFormComponent } from '../todo-form/todo-form.component';

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
    MatInputModule,
    MatSelectModule,
    MatExpansionModule,
    MatSlideToggleModule,
    MatDialogModule,
    AsyncPipe,
    IsEmptyComponent,
  ],
  templateUrl: './todos.component.html',
  styleUrl: './todos.component.scss'
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
          const {
            _id, user, name, description, active
          } = list;
          this.listForm.setValue({ _id, user, name, description, active });
          this.loading = false;
        }
      },
      error: () => {
        this.router.navigate(['/todos']).then(() => {
          this.sb.open('No pudimos encontrar la lista solicitada')
        })
      },
      complete: () => {
        this.loading = false;
      }
    })
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
      }
    })
  }

  ngOnInit(): void {
    this.loadList()
    this.loadTodos()
  }

  onSubmit() {
    const todo: any = this.todoForm.value;
    todo.user = this.listForm.get('user')?.value;
    this.todoService.create(todo).subscribe({
      next: (todo) => {
        if (todo) {
          this.sb.open('Nuevo pendiente guardardo', 'Ok', { duration: 2500 });
          this.toggleForm();
          this.loadTodos();
          this.todoForm.setValue({
            title: '',
            description: '',
            completed: false,
            list: this.listId
          });
        }
      }
    });
  }

  markAsCompleted(todo: Todo) {
    const completed = todo;
    completed.completed = !completed.completed;
    this.todoService.update(todo._id, completed).subscribe({
      next: (result) => {
        if (result.upsertedCount == 1) {
          this.sb.open('Pendiente ' + completed.completed ? 'completado!' : 'pendiente', undefined, { duration: 2500 });
          this.loadTodos();
        }
      }
    });
  }

  deleteTodo(id: string) {
    this.todoService.delete(id).subscribe({
      next: (result) => {
        if (result.deletedCount == 1) {
          this.sb.open('La tarea ha sido eliminada', undefined, { duration: 2500 });
          this.loadTodos();
        }
      }
    });
  }

  editTodo(todo: Todo) {
    const ref = this.dialog.open(TodoFormComponent, {
      data: todo
    });
    ref.afterClosed().subscribe(() => {
      this.loadTodos()
    });
  }

  editList() {
    const list: any = this.listForm.value;
    this.todoService.update(list._id, list).subscribe({
      next: (result) => {
        if (result.upsertedCount == 1) {
          this.sb.open('Los detalles de la lista han sido actualizados.', undefined, { duration: 2500 });
          this.loadList();
        }
      }
    });
  }
}
