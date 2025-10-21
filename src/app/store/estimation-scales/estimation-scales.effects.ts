import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, switchMap, map, of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EstimationScaleService } from '../../core/services';
import * as EstimationScalesActions from './estimation-scales.actions';

const timing = { duration: 2500 };

@Injectable()
export class EstimationScalesEffects {
	#actions$ = inject(Actions);
	#estimationScaleService = inject(EstimationScaleService);
	#sb = inject(MatSnackBar);

	loadScale$ = createEffect(() =>
		this.#actions$.pipe(
			ofType(EstimationScalesActions.loadScale),
			switchMap(({ id }) =>
				this.#estimationScaleService.find(id).pipe(
					map((scale) =>
						EstimationScalesActions.loadScaleSuccess({ scale }),
					),
					catchError((error) => {
						this.#sb.open(
							'Error al cargar la escala',
							'Ok',
							timing,
						);
						return of(
							EstimationScalesActions.loadScaleFailed({
								error: error.message,
							}),
						);
					}),
				),
			),
		),
	);

	loadScales$ = createEffect(() =>
		this.#actions$.pipe(
			ofType(EstimationScalesActions.loadScales),
			switchMap(() =>
				this.#estimationScaleService.findAll().pipe(
					map((scales) =>
						EstimationScalesActions.loadScalesSuccess({ scales }),
					),
					catchError((error) => {
						this.#sb.open(
							'Error al cargar las escalas',
							'Ok',
							timing,
						);
						return of(
							EstimationScalesActions.loadScalesFailed({
								error: error.message,
							}),
						);
					}),
				),
			),
		),
	);

	createScale$ = createEffect(() =>
		this.#actions$.pipe(
			ofType(EstimationScalesActions.createScale),
			switchMap(({ scale }) =>
				this.#estimationScaleService.create(scale).pipe(
					map((newScale) => {
						this.#sb.open('La escala ha sido creada', 'Ok', timing);
						return EstimationScalesActions.createScaleSuccess({
							scale: newScale,
						});
					}),
					catchError((error) => {
						this.#sb.open('Error al crear la escala', 'Ok', timing);
						return of(
							EstimationScalesActions.createScaleFailed({
								error: error.message,
							}),
						);
					}),
				),
			),
		),
	);

	updateScale$ = createEffect(() =>
		this.#actions$.pipe(
			ofType(EstimationScalesActions.updateScale),
			switchMap(({ id, data }) =>
				this.#estimationScaleService.update(id, data).pipe(
					map((updatedScale) => {
						this.#sb.open(
							'La escala fue actualizada',
							'Ok',
							timing,
						);
						return EstimationScalesActions.updateScaleSuccess({
							scale: updatedScale,
						});
					}),
					catchError((error) => {
						this.#sb.open(
							'Error al actualizar la escala',
							'Ok',
							timing,
						);
						return of(
							EstimationScalesActions.updateScaleFailed({
								error: error.message,
							}),
						);
					}),
				),
			),
		),
	);

	deleteScale$ = createEffect(() =>
		this.#actions$.pipe(
			ofType(EstimationScalesActions.deleteScale),
			switchMap(({ id }) =>
				this.#estimationScaleService.delete(id).pipe(
					map(() => {
						this.#sb.open(
							'La escala ha sido eliminada',
							'Ok',
							timing,
						);
						return EstimationScalesActions.deleteScaleSuccess({
							id,
						});
					}),
					catchError((error) => {
						this.#sb.open(
							'Error al eliminar la escala',
							'Ok',
							timing,
						);
						return of(
							EstimationScalesActions.deleteScaleFailed({
								error: error.message,
							}),
						);
					}),
				),
			),
		),
	);
}
