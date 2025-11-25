import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, switchMap, map, of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DidacticActivityService } from '../../core';
import * as DidacticActivitiesActions from './didactic-activities.actions';

const timing = { duration: 2500 };

@Injectable()
export class DidacticActivitiesEffects {
	#actions$ = inject(Actions);
	#didacticActivityService = inject(DidacticActivityService);
	#sb = inject(MatSnackBar);

	loadActivity$ = createEffect(() =>
		this.#actions$.pipe(
			ofType(DidacticActivitiesActions.loadDidacticActivity),
			switchMap(({ id }) =>
				this.#didacticActivityService.findOne(id).pipe(
					map((activity) =>
						DidacticActivitiesActions.loadDidacticActivitySuccess({
							activity,
						}),
					),
					catchError((error) => {
						this.#sb.open(
							'Error al cargar la actividad',
							'Ok',
							timing,
						);
						return of(
							DidacticActivitiesActions.loadDidacticActivityFailed(
								{
									error: error.message,
								},
							),
						);
					}),
				),
			),
		),
	);

	loadActivities$ = createEffect(() =>
		this.#actions$.pipe(
			ofType(DidacticActivitiesActions.loadDidacticActivities),
			switchMap(({ filters }) =>
				this.#didacticActivityService.findAll(filters).pipe(
					map((activities) =>
						DidacticActivitiesActions.loadDidacticActivitiesSuccess(
							{ activities },
						),
					),
					catchError((error) => {
						this.#sb.open(
							'Error al cargar las actividades',
							'Ok',
							timing,
						);
						return of(
							DidacticActivitiesActions.loadDidacticActivitiesFailed(
								{
									error: error.message,
								},
							),
						);
					}),
				),
			),
		),
	);

	createActivity$ = createEffect(() =>
		this.#actions$.pipe(
			ofType(DidacticActivitiesActions.createDidacticActivity),
			switchMap(({ activity }) =>
				this.#didacticActivityService.create(activity).pipe(
					map((newActivity) => {
						this.#sb.open(
							'La actividad ha sido creada',
							'Ok',
							timing,
						);
						return DidacticActivitiesActions.createDidacticActivitySuccess(
							{
								activity: newActivity,
							},
						);
					}),
					catchError((error) => {
						this.#sb.open(
							'Error al crear la actividad',
							'Ok',
							timing,
						);
						return of(
							DidacticActivitiesActions.createDidacticActivityFailed(
								{
									error: error.message,
								},
							),
						);
					}),
				),
			),
		),
	);

	updateActivity$ = createEffect(() =>
		this.#actions$.pipe(
			ofType(DidacticActivitiesActions.updateDidacticActivity),
			switchMap(({ id, data }) =>
				this.#didacticActivityService.update(id, data).pipe(
					map((updatedActivity) => {
						this.#sb.open(
							'La actividad fue actualizada',
							'Ok',
							timing,
						);
						return DidacticActivitiesActions.updateDidacticActivitySuccess(
							{
								activity: updatedActivity,
							},
						);
					}),
					catchError((error) => {
						this.#sb.open(
							'Error al actualizar la actividad',
							'Ok',
							timing,
						);
						return of(
							DidacticActivitiesActions.updateDidacticActivityFailed(
								{
									error: error.message,
								},
							),
						);
					}),
				),
			),
		),
	);

	deleteActivity$ = createEffect(() =>
		this.#actions$.pipe(
			ofType(DidacticActivitiesActions.deleteDidacticActivity),
			switchMap(({ id }) =>
				this.#didacticActivityService.delete(id).pipe(
					map(() => {
						this.#sb.open(
							'La actividad ha sido eliminada',
							'Ok',
							timing,
						);
						return DidacticActivitiesActions.deleteDidacticActivitySuccess(
							{ id },
						);
					}),
					catchError((error) => {
						this.#sb.open(
							'Error al eliminar la actividad',
							'Ok',
							timing,
						);
						return of(
							DidacticActivitiesActions.deleteDidacticActivityFailed(
								{
									error: error.message,
								},
							),
						);
					}),
				),
			),
		),
	);
}
