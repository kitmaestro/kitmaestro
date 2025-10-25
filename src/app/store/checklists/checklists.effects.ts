import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, switchMap, map, of, tap, take } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ChecklistService } from '../../core/services';
import * as ChecklistsActions from './checklists.actions';

const timing = { duration: 2500 };

@Injectable()
export class ChecklistsEffects {
	#actions$ = inject(Actions);
	#checklistService = inject(ChecklistService);
	#sb = inject(MatSnackBar);

	loadChecklist$ = createEffect(() =>
		this.#actions$.pipe(
			ofType(ChecklistsActions.loadChecklist),
			switchMap(({ id }) =>
				this.#checklistService.find(id).pipe(
					map((checklist) =>
						ChecklistsActions.loadChecklistSuccess({ checklist }),
					),
					catchError((error) => {
						this.#sb.open(
							'Error al cargar la lista de cotejo',
							'Ok',
							timing,
						);
						return of(
							ChecklistsActions.loadChecklistFailed({
								error: error.message,
							}),
						);
					}),
				),
			),
		),
	);

	loadChecklists$ = createEffect(() =>
		this.#actions$.pipe(
			ofType(ChecklistsActions.loadChecklists),
			switchMap(() =>
				this.#checklistService.findAll().pipe(
					map((checklists) =>
						ChecklistsActions.loadChecklistsSuccess({ checklists }),
					),
					catchError((error) => {
						this.#sb.open(
							'Error al cargar las listas de cotejo',
							'Ok',
							timing,
						);
						return of(
							ChecklistsActions.loadChecklistsFailed({
								error: error.message,
							}),
						);
					}),
				),
			),
		),
	);

	createChecklist$ = createEffect(() =>
		this.#actions$.pipe(
			ofType(ChecklistsActions.createChecklist),
			switchMap(({ checklist }) =>
				this.#checklistService.create(checklist).pipe(
					map((newChecklist) => {
						this.#sb.open(
							'La lista de cotejo ha sido creada',
							'Ok',
							timing,
						);
						return ChecklistsActions.createChecklistSuccess({
							checklist: newChecklist,
						});
					}),
					catchError((error) => {
						this.#sb.open(
							'Error al crear la lista de cotejo',
							'Ok',
							timing,
						);
						return of(
							ChecklistsActions.createChecklistFailed({
								error: error.message,
							}),
						);
					}),
				),
			),
		),
	);

	updateChecklist$ = createEffect(() =>
		this.#actions$.pipe(
			ofType(ChecklistsActions.updateChecklist),
			switchMap(({ id, data }) =>
				this.#checklistService.update(id, data).pipe(
					map((response) => {
						this.#sb.open(
							'La lista de cotejo fue actualizada',
							'Ok',
							timing,
						);
						return ChecklistsActions.updateChecklistSuccess({
							checklist: response,
						});
					}),
					catchError((error) => {
						this.#sb.open(
							'Error al actualizar la lista de cotejo',
							'Ok',
							timing,
						);
						return of(
							ChecklistsActions.updateChecklistFailed({
								error: error.message,
							}),
						);
					}),
				),
			),
		),
	);

	deleteChecklist$ = createEffect(() =>
		this.#actions$.pipe(
			ofType(ChecklistsActions.deleteChecklist),
			switchMap(({ id }) =>
				this.#checklistService.delete(id).pipe(
					map(() => {
						this.#sb.open(
							'La lista de cotejo ha sido eliminada',
							'Ok',
							timing,
						);
						return ChecklistsActions.deleteChecklistSuccess({ id });
					}),
					catchError((error) => {
						this.#sb.open(
							'Error al eliminar la lista de cotejo',
							'Ok',
							timing,
						);
						return of(
							ChecklistsActions.deleteChecklistFailed({
								error: error.message,
							}),
						);
					}),
				),
			),
		),
	);

	downloadChecklist$ = createEffect(() =>
		this.#actions$.pipe(
			ofType(ChecklistsActions.downloadChecklist),
			take(1),
			tap(({ checklist }) => {
				this.#checklistService.download(checklist)
				this.#sb.open('La lista de cotejo ha sido descargada', 'Ok', timing)
				return ChecklistsActions.downloadChecklistSuccess()
			}),
			catchError((error) => {
				this.#sb.open('Error al descargar la lista de cotejo', 'Ok', timing)
				return of(
					ChecklistsActions.downloadChecklistFailed({
						error: error.message,
					})
				)
			})
		)
	)
}
