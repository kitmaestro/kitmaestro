import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, switchMap, map, of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LogRegistryEntryService } from '../../core/services';
import * as LogRegistryEntriesActions from './log-registry-entries.actions';

const timing = { duration: 2500 };

@Injectable()
export class LogRegistryEntriesEffects {
	#actions$ = inject(Actions);
	#logRegistryEntryService = inject(LogRegistryEntryService);
	#sb = inject(MatSnackBar);

	loadEntry$ = createEffect(() =>
		this.#actions$.pipe(
			ofType(LogRegistryEntriesActions.loadLogRegistryEntry),
			switchMap(({ id }) =>
				this.#logRegistryEntryService.find(id).pipe(
					map((entry) =>
						LogRegistryEntriesActions.loadLogRegistryEntrySuccess({
							entry,
						}),
					),
					catchError((error) => {
						this.#sb.open(
							'Error al cargar la entrada',
							'Ok',
							timing,
						);
						return of(
							LogRegistryEntriesActions.loadLogRegistryEntryFailed(
								{ error: error.message },
							),
						);
					}),
				),
			),
		),
	);

	loadEntries$ = createEffect(() =>
		this.#actions$.pipe(
			ofType(LogRegistryEntriesActions.loadLogRegistryEntries),
			switchMap(() =>
				this.#logRegistryEntryService.findAll().pipe(
					map((entries) =>
						LogRegistryEntriesActions.loadLogRegistryEntriesSuccess(
							{ entries },
						),
					),
					catchError((error) => {
						this.#sb.open(
							'Error al cargar las entradas',
							'Ok',
							timing,
						);
						return of(
							LogRegistryEntriesActions.loadLogRegistryEntriesFailed(
								{ error: error.message },
							),
						);
					}),
				),
			),
		),
	);

	createEntry$ = createEffect(() =>
		this.#actions$.pipe(
			ofType(LogRegistryEntriesActions.createLogRegistryEntry),
			switchMap(({ entry }) =>
				this.#logRegistryEntryService.create(entry).pipe(
					map((newEntry) => {
						this.#sb.open(
							'La entrada ha sido creada',
							'Ok',
							timing,
						);
						return LogRegistryEntriesActions.createLogRegistryEntrySuccess(
							{ entry: newEntry },
						);
					}),
					catchError((error) => {
						this.#sb.open(
							'Error al crear la entrada',
							'Ok',
							timing,
						);
						return of(
							LogRegistryEntriesActions.createLogRegistryEntryFailed(
								{ error: error.message },
							),
						);
					}),
				),
			),
		),
	);

	updateEntry$ = createEffect(() =>
		this.#actions$.pipe(
			ofType(LogRegistryEntriesActions.updateLogRegistryEntry),
			switchMap(({ id, data }) =>
				this.#logRegistryEntryService.update(id, data).pipe(
					map((updatedEntry) => {
						this.#sb.open(
							'La entrada fue actualizada',
							'Ok',
							timing,
						);
						return LogRegistryEntriesActions.updateLogRegistryEntrySuccess(
							{ entry: updatedEntry },
						);
					}),
					catchError((error) => {
						this.#sb.open(
							'Error al actualizar la entrada',
							'Ok',
							timing,
						);
						return of(
							LogRegistryEntriesActions.updateLogRegistryEntryFailed(
								{ error: error.message },
							),
						);
					}),
				),
			),
		),
	);

	deleteEntry$ = createEffect(() =>
		this.#actions$.pipe(
			ofType(LogRegistryEntriesActions.deleteLogRegistryEntry),
			switchMap(({ id }) =>
				this.#logRegistryEntryService.delete(id).pipe(
					map(() => {
						this.#sb.open(
							'La entrada ha sido eliminada',
							'Ok',
							timing,
						);
						return LogRegistryEntriesActions.deleteLogRegistryEntrySuccess(
							{ id },
						);
					}),
					catchError((error) => {
						this.#sb.open(
							'Error al eliminar la entrada',
							'Ok',
							timing,
						);
						return of(
							LogRegistryEntriesActions.deleteLogRegistryEntryFailed(
								{ error: error.message },
							),
						);
					}),
				),
			),
		),
	);
}
