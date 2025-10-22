import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, switchMap, map, of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TodoService } from '../../core/services';
import * as TodosActions from './todos.actions';

const timing = { duration: 2500 };

@Injectable()
export class TodosEffects {
	#actions$ = inject(Actions);
	#todoService = inject(TodoService);
	#sb = inject(MatSnackBar);

	loadTodo$ = createEffect(() =>
		this.#actions$.pipe(
			ofType(TodosActions.loadTodo),
			switchMap(({ id }) =>
				this.#todoService.findOne(id).pipe(
					map((todo) => TodosActions.loadTodoSuccess({ todo })),
					catchError((error) => {
						this.#sb.open('Error al cargar la tarea', 'Ok', timing);
						return of(
							TodosActions.loadTodoFailed({
								error: error.message,
							}),
						);
					}),
				),
			),
		),
	);

	loadTodos$ = createEffect(() =>
		this.#actions$.pipe(
			ofType(TodosActions.loadTodos),
			switchMap(() =>
				this.#todoService.findAll().pipe(
					map((todos) => TodosActions.loadTodosSuccess({ todos })),
					catchError((error) => {
						this.#sb.open(
							'Error al cargar las tareas',
							'Ok',
							timing,
						);
						return of(
							TodosActions.loadTodosFailed({
								error: error.message,
							}),
						);
					}),
				),
			),
		),
	);

	loadTodosByList$ = createEffect(() =>
		this.#actions$.pipe(
			ofType(TodosActions.loadTodosByList),
			switchMap(({ listId }) =>
				this.#todoService.findByList(listId).pipe(
					map((todos) =>
						TodosActions.loadTodosByListSuccess({ todos }),
					),
					catchError((error) => {
						this.#sb.open(
							'Error al cargar las tareas de la lista',
							'Ok',
							timing,
						);
						return of(
							TodosActions.loadTodosByListFailed({
								error: error.message,
							}),
						);
					}),
				),
			),
		),
	);

	createTodo$ = createEffect(() =>
		this.#actions$.pipe(
			ofType(TodosActions.createTodo),
			switchMap(({ todo }) =>
				this.#todoService.create(todo).pipe(
					map((newTodo) => {
						this.#sb.open('La tarea ha sido creada', 'Ok', timing);
						return TodosActions.createTodoSuccess({
							todo: newTodo,
						});
					}),
					catchError((error) => {
						this.#sb.open('Error al crear la tarea', 'Ok', timing);
						return of(
							TodosActions.createTodoFailed({
								error: error.message,
							}),
						);
					}),
				),
			),
		),
	);

	updateTodo$ = createEffect(() =>
		this.#actions$.pipe(
			ofType(TodosActions.updateTodo),
			switchMap(({ id, data }) =>
				this.#todoService.update(id, data).pipe(
					map((updatedTodo) => {
						this.#sb.open('La tarea fue actualizada', 'Ok', timing);
						return TodosActions.updateTodoSuccess({
							todo: updatedTodo,
						});
					}),
					catchError((error) => {
						this.#sb.open(
							'Error al actualizar la tarea',
							'Ok',
							timing,
						);
						return of(
							TodosActions.updateTodoFailed({
								error: error.message,
							}),
						);
					}),
				),
			),
		),
	);

	deleteTodo$ = createEffect(() =>
		this.#actions$.pipe(
			ofType(TodosActions.deleteTodo),
			switchMap(({ id }) =>
				this.#todoService.delete(id).pipe(
					map(() => {
						this.#sb.open(
							'La tarea ha sido eliminada',
							'Ok',
							timing,
						);
						return TodosActions.deleteTodoSuccess({ id });
					}),
					catchError((error) => {
						this.#sb.open(
							'Error al eliminar la tarea',
							'Ok',
							timing,
						);
						return of(
							TodosActions.deleteTodoFailed({
								error: error.message,
							}),
						);
					}),
				),
			),
		),
	);
}
