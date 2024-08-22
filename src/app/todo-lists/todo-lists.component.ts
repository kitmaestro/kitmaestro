import { Component, inject } from '@angular/core';
import { TodoService } from '../services/todo.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { UserSettingsService } from '../services/user-settings.service';
import { UserSettings } from '../interfaces/user-settings';
import { TodoList } from '../interfaces/todo-list';
import { AsyncPipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-todo-lists',
  standalone: true,
  imports: [
    MatSnackBarModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    AsyncPipe,
    RouterModule,
  ],
  templateUrl: './todo-lists.component.html',
  styleUrl: './todo-lists.component.scss'
})
export class TodoListsComponent {

  sb = inject(MatSnackBar);
  todoService = inject(TodoService);
  userSettingsService = inject(UserSettingsService);
  userSettings: UserSettings | null = null;
  fb = inject(FormBuilder);
  dialog = inject(MatDialog);
  router = inject(Router);
  todoLists$ = this.todoService.todoLists$;
  showForm = false;

  todoListForm = this.fb.group({
    name: [''],
    description: [''],
    active: [true],
  });

  constructor() {
    this.userSettingsService.getSettings().subscribe(settings => {
      this.userSettings = settings;
    });
  }

  toggleForm() {
    this.showForm = !this.showForm;
  }

  deleteList(id: string) {
    this.todoService.deleteList(id).then(() => {
      this.sb.open('La Lista ha sido borrada')
    })
  }

  addList() {
    if (this.userSettings) {
      const todoList: TodoList = this.todoListForm.value as any as TodoList;
      todoList.uid = this.userSettings.uid;
      this.todoService.addList(todoList).then((list) => {
        this.router.navigate(['/app', 'todos', list.id]).then(() => {
          this.sb.open('Lista Creada!', undefined, { duration: 2500 });
        });
      });
    }
  }

}
