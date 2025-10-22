import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, switchMap, map, of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ScoreSystemService } from '../../core/services';
import * as ScoreSystemsActions from './score-systems.actions';

const timing = { duration: 2500 };

@Injectable()
export class ScoreSystemsEffects {
	#actions$ = inject(Actions);
	#scoreSystemService = inject(ScoreSystemService);
	#sb = inject(MatSnackBar);

	loadSystem$ = createEffect(() =>
		this.#actions$.pipe(
			ofType(ScoreSystemsActions.loadSystem),
			switchMap(({ id }) =>
				this.#scoreSystemService.find(id).pipe(
					map((system) =>
						ScoreSystemsActions.loadSystemSuccess({ system }),
					),
					catchError((error) => {
						this.#sb.open(
							'Error al cargar el sistema',
							'Ok',
							timing,
						);
						return of(
							ScoreSystemsActions.loadSystemFailed({
								error: error.message,
							}),
						);
					}),
				),
			),
		),
	);

	loadSystems$ = createEffect(() =>
		this.#actions$.pipe(
			ofType(ScoreSystemsActions.loadSystems),
			switchMap(() =>
				this.#scoreSystemService.findAll().pipe(
					map((systems) =>
						ScoreSystemsActions.loadSystemsSuccess({ systems }),
					),
					catchError((error) => {
						this.#sb.open(
							'Error al cargar los sistemas',
							'Ok',
							timing,
						);
						return of(
							ScoreSystemsActions.loadSystemsFailed({
								error: error.message,
							}),
						);
					}),
				),
			),
		),
	);

	createSystem$ = createEffect(() =>
		this.#actions$.pipe(
			ofType(ScoreSystemsActions.createSystem),
			switchMap(({ system }) =>
				this.#scoreSystemService.create(system).pipe(
					map((newSystem) => {
						this.#sb.open(
							'El sistema ha sido creado',
							'Ok',
							timing,
						);
						return ScoreSystemsActions.createSystemSuccess({
							system: newSystem,
						});
					}),
					catchError((error) => {
						this.#sb.open(
							'Error al crear el sistema',
							'Ok',
							timing,
						);
						return of(
							ScoreSystemsActions.createSystemFailed({
								error: error.message,
							}),
						);
					}),
				),
			),
		),
	);

	updateSystem$ = createEffect(() =>
		this.#actions$.pipe(
			ofType(ScoreSystemsActions.updateSystem),
			switchMap(({ id, data }) =>
				this.#scoreSystemService.update(id, data).pipe(
					map((updatedSystem) => {
						this.#sb.open(
							'El sistema fue actualizado',
							'Ok',
							timing,
						);
						return ScoreSystemsActions.updateSystemSuccess({
							system: updatedSystem,
						});
					}),
					catchError((error) => {
						this.#sb.open(
							'Error al actualizar el sistema',
							'Ok',
							timing,
						);
						return of(
							ScoreSystemsActions.updateSystemFailed({
								error: error.message,
							}),
						);
					}),
				),
			),
		),
	);

	deleteSystem$ = createEffect(() =>
		this.#actions$.pipe(
			ofType(ScoreSystemsActions.deleteSystem),
			switchMap(({ id }) =>
				this.#scoreSystemService.delete(id).pipe(
					map(() => {
						this.#sb.open(
							'El sistema ha sido eliminado',
							'Ok',
							timing,
						);
						return ScoreSystemsActions.deleteSystemSuccess({ id });
					}),
					catchError((error) => {
						this.#sb.open(
							'Error al eliminar el sistema',
							'Ok',
							timing,
						);
						return of(
							ScoreSystemsActions.deleteSystemFailed({
								error: error.message,
							}),
						);
					}),
				),
			),
		),
	);
}
