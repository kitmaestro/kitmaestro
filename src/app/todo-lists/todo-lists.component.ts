import { Component, inject } from '@angular/core';
import { TodoListService } from '../services/todo-list.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserSettingsService } from '../services/user-settings.service';
import { UserSettings } from '../interfaces/user-settings';
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
    templateUrl: './todo-lists.component.html',
    styleUrl: './todo-lists.component.scss'
})
export class TodoListsComponent {

  private sb = inject(MatSnackBar);
  private todoListService = inject(TodoListService);
  private userSettingsService = inject(UserSettingsService);
  private userSettings: UserSettings | null = null;
  private fb = inject(FormBuilder);
  private router = inject(Router);

  todoLists$ = this.todoListService.findAll().pipe(tap(() => this.loading = false));
  showForm = false;
  loading = true;

  todoListForm = this.fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
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
    this.todoListService.delete(id).subscribe({
      next: (result) => {
        if (result.deletedCount === 1) {
          this.sb.open('La Lista ha sido borrada')
          this.todoLists$ = this.todoListService.findAll();
        }
      }
    })
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
        }
      });
    }
  }

}
