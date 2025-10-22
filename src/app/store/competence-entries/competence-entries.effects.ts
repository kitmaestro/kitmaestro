import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, switchMap, map, of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CompetenceService } from '../../core/services';
import * as CompetenceEntriesActions from './competence-entries.actions';

const timing = { duration: 2500 };

@Injectable()
export class CompetenceEntriesEffects {
	#actions$ = inject(Actions);
	#competenceService = inject(CompetenceService);
	#sb = inject(MatSnackBar);

	loadEntry$ = createEffect(() =>
		this.#actions$.pipe(
			ofType(CompetenceEntriesActions.loadEntry),
			switchMap(({ id }) =>
				this.#competenceService.findOne(id).pipe(
					map((entry) =>
						CompetenceEntriesActions.loadEntrySuccess({ entry }),
					),
					catchError((error) => {
						this.#sb.open(
							'Error al cargar la competencia',
							'Ok',
							timing,
						);
						return of(
							CompetenceEntriesActions.loadEntryFailed({
								error: error.message,
							}),
						);
					}),
				),
			),
		),
	);

	loadEntries$ = createEffect(() =>
		this.#actions$.pipe(
			ofType(CompetenceEntriesActions.loadEntries),
			switchMap(() =>
				this.#competenceService.findAll().pipe(
					map((entries) =>
						CompetenceEntriesActions.loadEntriesSuccess({
							entries,
						}),
					),
					catchError((error) => {
						this.#sb.open(
							'Error al cargar las competencias',
							'Ok',
							timing,
						);
						return of(
							CompetenceEntriesActions.loadEntriesFailed({
								error: error.message,
							}),
						);
					}),
				),
			),
		),
	);

	createEntry$ = createEffect(() =>
		this.#actions$.pipe(
			ofType(CompetenceEntriesActions.createEntry),
			switchMap(({ entry }) =>
				this.#competenceService.create(entry).pipe(
					map((newEntry) => {
						this.#sb.open(
							'La competencia ha sido creada',
							'Ok',
							timing,
						);
						return CompetenceEntriesActions.createEntrySuccess({
							entry: newEntry,
						});
					}),
					catchError((error) => {
						this.#sb.open(
							'Error al crear la competencia',
							'Ok',
							timing,
						);
						return of(
							CompetenceEntriesActions.createEntryFailed({
								error: error.message,
							}),
						);
					}),
				),
			),
		),
	);

	updateEntry$ = createEffect(() =>
		this.#actions$.pipe(
			ofType(CompetenceEntriesActions.updateEntry),
			switchMap(({ id, data }) =>
				this.#competenceService.update(id, data).pipe(
					map((updatedEntry) => {
						this.#sb.open(
							'La competencia fue actualizada',
							'Ok',
							timing,
						);
						return CompetenceEntriesActions.updateEntrySuccess({
							entry: updatedEntry,
						});
					}),
					catchError((error) => {
						this.#sb.open(
							'Error al actualizar la competencia',
							'Ok',
							timing,
						);
						return of(
							CompetenceEntriesActions.updateEntryFailed({
								error: error.message,
							}),
						);
					}),
				),
			),
		),
	);

	deleteEntry$ = createEffect(() =>
		this.#actions$.pipe(
			ofType(CompetenceEntriesActions.deleteEntry),
			switchMap(({ id }) =>
				this.#competenceService.delete(id).pipe(
					map(() => {
						this.#sb.open(
							'La competencia ha sido eliminada',
							'Ok',
							timing,
						);
						return CompetenceEntriesActions.deleteEntrySuccess({
							id,
						});
					}),
					catchError((error) => {
						this.#sb.open(
							'Error al eliminar la competencia',
							'Ok',
							timing,
						);
						return of(
							CompetenceEntriesActions.deleteEntryFailed({
								error: error.message,
							}),
						);
					}),
				),
			),
		),
	);
}
