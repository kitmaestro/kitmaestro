import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, switchMap, map, of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DidacticSequenceService } from '../../core/services';
import * as DidacticSequencesActions from './didactic-sequences.actions';

const timing = { duration: 2500 };

@Injectable()
export class DidacticSequencesEffects {
	#actions$ = inject(Actions);
	#didacticSequenceService = inject(DidacticSequenceService);
	#sb = inject(MatSnackBar);

	loadSequence$ = createEffect(() =>
		this.#actions$.pipe(
			ofType(DidacticSequencesActions.loadSequence),
			switchMap(({ id }) =>
				this.#didacticSequenceService.findOne(id).pipe(
					map((sequence) =>
						DidacticSequencesActions.loadSequenceSuccess({
							sequence,
						}),
					),
					catchError((error) => {
						this.#sb.open(
							'Error al cargar la secuencia',
							'Ok',
							timing,
						);
						return of(
							DidacticSequencesActions.loadSequenceFailed({
								error: error.message,
							}),
						);
					}),
				),
			),
		),
	);

	loadSequences$ = createEffect(() =>
		this.#actions$.pipe(
			ofType(DidacticSequencesActions.loadSequences),
			switchMap(({ filters }) =>
				this.#didacticSequenceService.findAll(filters).pipe(
					map((sequences) =>
						DidacticSequencesActions.loadSequencesSuccess({
							sequences,
						}),
					),
					catchError((error) => {
						this.#sb.open(
							'Error al cargar las secuencias',
							'Ok',
							timing,
						);
						return of(
							DidacticSequencesActions.loadSequencesFailed({
								error: error.message,
							}),
						);
					}),
				),
			),
		),
	);

	createSequence$ = createEffect(() =>
		this.#actions$.pipe(
			ofType(DidacticSequencesActions.createSequence),
			switchMap(({ sequence }) =>
				this.#didacticSequenceService.create(sequence).pipe(
					map((newSequence) => {
						this.#sb.open(
							'La secuencia ha sido creada',
							'Ok',
							timing,
						);
						return DidacticSequencesActions.createSequenceSuccess({
							sequence: newSequence,
						});
					}),
					catchError((error) => {
						this.#sb.open(
							'Error al crear la secuencia',
							'Ok',
							timing,
						);
						return of(
							DidacticSequencesActions.createSequenceFailed({
								error: error.message,
							}),
						);
					}),
				),
			),
		),
	);

	updateSequence$ = createEffect(() =>
		this.#actions$.pipe(
			ofType(DidacticSequencesActions.updateSequence),
			switchMap(({ id, data }) =>
				this.#didacticSequenceService.update(id, data).pipe(
					map((updatedSequence) => {
						this.#sb.open(
							'La secuencia fue actualizada',
							'Ok',
							timing,
						);
						return DidacticSequencesActions.updateSequenceSuccess({
							sequence: updatedSequence,
						});
					}),
					catchError((error) => {
						this.#sb.open(
							'Error al actualizar la secuencia',
							'Ok',
							timing,
						);
						return of(
							DidacticSequencesActions.updateSequenceFailed({
								error: error.message,
							}),
						);
					}),
				),
			),
		),
	);

	deleteSequence$ = createEffect(() =>
		this.#actions$.pipe(
			ofType(DidacticSequencesActions.deleteSequence),
			switchMap(({ id }) =>
				this.#didacticSequenceService.delete(id).pipe(
					map(() => {
						this.#sb.open(
							'La secuencia ha sido eliminada',
							'Ok',
							timing,
						);
						return DidacticSequencesActions.deleteSequenceSuccess({
							id,
						});
					}),
					catchError((error) => {
						this.#sb.open(
							'Error al eliminar la secuencia',
							'Ok',
							timing,
						);
						return of(
							DidacticSequencesActions.deleteSequenceFailed({
								error: error.message,
							}),
						);
					}),
				),
			),
		),
	);
}
