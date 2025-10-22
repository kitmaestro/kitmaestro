import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, switchMap, map, of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TodoListService } from '../../core/services';
import * as TodoListsActions from './todo-lists.actions';

const timing = { duration: 2500 };

@Injectable()
export class TodoListsEffects {
	#actions$ = inject(Actions);
	#todoListService = inject(TodoListService);
	#sb = inject(MatSnackBar);

	loadList$ = createEffect(() =>
		this.#actions$.pipe(
			ofType(TodoListsActions.loadList),
			switchMap(({ id }) =>
				this.#todoListService.findOne(id).pipe(
					map((list) => TodoListsActions.loadListSuccess({ list })),
					catchError((error) => {
						this.#sb.open('Error al cargar la lista', 'Ok', timing);
						return of(
							TodoListsActions.loadListFailed({
								error: error.message,
							}),
						);
					}),
				),
			),
		),
	);

	loadLists$ = createEffect(() =>
		this.#actions$.pipe(
			ofType(TodoListsActions.loadLists),
			switchMap(() =>
				this.#todoListService.findAll().pipe(
					map((lists) =>
						TodoListsActions.loadListsSuccess({ lists }),
					),
					catchError((error) => {
						this.#sb.open(
							'Error al cargar las listas',
							'Ok',
							timing,
						);
						return of(
							TodoListsActions.loadListsFailed({
								error: error.message,
							}),
						);
					}),
				),
			),
		),
	);

	createList$ = createEffect(() =>
		this.#actions$.pipe(
			ofType(TodoListsActions.createList),
			switchMap(({ list }) =>
				this.#todoListService.create(list as any).pipe(
					map((newList) => {
						this.#sb.open('La lista ha sido creada', 'Ok', timing);
						return TodoListsActions.createListSuccess({
							list: newList,
						});
					}),
					catchError((error) => {
						this.#sb.open('Error al crear la lista', 'Ok', timing);
						return of(
							TodoListsActions.createListFailed({
								error: error.message,
							}),
						);
					}),
				),
			),
		),
	);

	updateList$ = createEffect(() =>
		this.#actions$.pipe(
			ofType(TodoListsActions.updateList),
			switchMap(({ id, data }) =>
				this.#todoListService.update(id, data as any).pipe(
					map((updatedList) => {
						this.#sb.open('La lista fue actualizada', 'Ok', timing);
						return TodoListsActions.updateListSuccess({
							list: updatedList,
						});
					}),
					catchError((error) => {
						this.#sb.open(
							'Error al actualizar la lista',
							'Ok',
							timing,
						);
						return of(
							TodoListsActions.updateListFailed({
								error: error.message,
							}),
						);
					}),
				),
			),
		),
	);

	deleteList$ = createEffect(() =>
		this.#actions$.pipe(
			ofType(TodoListsActions.deleteList),
			switchMap(({ id }) =>
				this.#todoListService.delete(id).pipe(
					map(() => {
						this.#sb.open(
							'La lista ha sido eliminada',
							'Ok',
							timing,
						);
						return TodoListsActions.deleteListSuccess({ id });
					}),
					catchError((error) => {
						this.#sb.open(
							'Error al eliminar la lista',
							'Ok',
							timing,
						);
						return of(
							TodoListsActions.deleteListFailed({
								error: error.message,
							}),
						);
					}),
				),
			),
		),
	);
}
