import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, switchMap, map, of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SubjectConceptListService } from '../../core/services';
import * as SubjectConceptListsActions from './subject-concept-lists.actions';

const timing = { duration: 2500 };

@Injectable()
export class SubjectConceptListsEffects {
	#actions$ = inject(Actions);
	#subjectConceptListService = inject(SubjectConceptListService);
	#sb = inject(MatSnackBar);

	loadList$ = createEffect(() =>
		this.#actions$.pipe(
			ofType(SubjectConceptListsActions.loadSubjectConceptList),
			switchMap(({ id }) =>
				this.#subjectConceptListService.find(id).pipe(
					map((list) =>
						SubjectConceptListsActions.loadSubjectConceptListSuccess(
							{ list },
						),
					),
					catchError((error) => {
						this.#sb.open('Error al cargar la lista', 'Ok', timing);
						return of(
							SubjectConceptListsActions.loadSubjectConceptListFailed(
								{ error: error.message },
							),
						);
					}),
				),
			),
		),
	);

	loadLists$ = createEffect(() =>
		this.#actions$.pipe(
			ofType(SubjectConceptListsActions.loadSubjectConceptLists),
			switchMap(({ filters }) =>
				this.#subjectConceptListService.findAll(filters).pipe(
					map((lists) =>
						SubjectConceptListsActions.loadSubjectConceptListsSuccess(
							{ lists },
						),
					),
					catchError((error) => {
						this.#sb.open(
							'Error al cargar las listas',
							'Ok',
							timing,
						);
						return of(
							SubjectConceptListsActions.loadSubjectConceptListsFailed(
								{ error: error.message },
							),
						);
					}),
				),
			),
		),
	);

	createList$ = createEffect(() =>
		this.#actions$.pipe(
			ofType(SubjectConceptListsActions.createSubjectConceptList),
			switchMap(({ list }) =>
				this.#subjectConceptListService.create(list as any).pipe(
					map((newList) => {
						this.#sb.open('La lista ha sido creada', 'Ok', timing);
						return SubjectConceptListsActions.createSubjectConceptListSuccess(
							{ list: newList },
						);
					}),
					catchError((error) => {
						this.#sb.open('Error al crear la lista', 'Ok', timing);
						return of(
							SubjectConceptListsActions.createSubjectConceptListFailed(
								{ error: error.message },
							),
						);
					}),
				),
			),
		),
	);

	updateList$ = createEffect(() =>
		this.#actions$.pipe(
			ofType(SubjectConceptListsActions.updateSubjectConceptList),
			switchMap(({ id, data }) =>
				this.#subjectConceptListService.update(id, data as any).pipe(
					map((updatedList) => {
						this.#sb.open('La lista fue actualizada', 'Ok', timing);
						return SubjectConceptListsActions.updateSubjectConceptListSuccess(
							{ list: updatedList },
						);
					}),
					catchError((error) => {
						this.#sb.open(
							'Error al actualizar la lista',
							'Ok',
							timing,
						);
						return of(
							SubjectConceptListsActions.updateSubjectConceptListFailed(
								{ error: error.message },
							),
						);
					}),
				),
			),
		),
	);

	deleteList$ = createEffect(() =>
		this.#actions$.pipe(
			ofType(SubjectConceptListsActions.deleteSubjectConceptList),
			switchMap(({ id }) =>
				this.#subjectConceptListService.delete(id).pipe(
					map(() => {
						this.#sb.open(
							'La lista ha sido eliminada',
							'Ok',
							timing,
						);
						return SubjectConceptListsActions.deleteSubjectConceptListSuccess(
							{ id },
						);
					}),
					catchError((error) => {
						this.#sb.open(
							'Error al eliminar la lista',
							'Ok',
							timing,
						);
						return of(
							SubjectConceptListsActions.deleteSubjectConceptListFailed(
								{ error: error.message },
							),
						);
					}),
				),
			),
		),
	);
}
