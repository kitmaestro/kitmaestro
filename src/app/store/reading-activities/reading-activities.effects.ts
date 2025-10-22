import { inject, Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { catchError, switchMap, map, of } from 'rxjs'
import { MatSnackBar } from '@angular/material/snack-bar'
import { ReadingActivityService } from '../../core/services'
import * as ReadingActivitiesActions from './reading-activities.actions'

const timing = { duration: 2500 }

@Injectable()
export class ReadingActivitiesEffects {
    #actions$ = inject(Actions)
    #readingActivityService = inject(ReadingActivityService)
    #sb = inject(MatSnackBar)

    loadActivity$ = createEffect(() =>
        this.#actions$.pipe(
            ofType(ReadingActivitiesActions.loadActivity),
            switchMap(({ id }) =>
                this.#readingActivityService.find(id).pipe(
                    map(activity => ReadingActivitiesActions.loadActivitySuccess({ activity })),
                    catchError(error => {
                        this.#sb.open('Error al cargar la actividad', 'Ok', timing)
                        return of(
                            ReadingActivitiesActions.loadActivityFailed({ error: error.message }),
                        )
                    }),
                ),
            ),
        ),
    )

    loadActivities$ = createEffect(() =>
        this.#actions$.pipe(
            ofType(ReadingActivitiesActions.loadActivities),
            switchMap(() =>
                this.#readingActivityService.findAll().pipe(
                    map(activities =>
                        ReadingActivitiesActions.loadActivitiesSuccess({ activities }),
                    ),
                    catchError(error => {
                        this.#sb.open('Error al cargar las actividades', 'Ok', timing)
                        return of(
                            ReadingActivitiesActions.loadActivitiesFailed({ error: error.message }),
                        )
                    }),
                ),
            ),
        ),
    )

    createActivity$ = createEffect(() =>
        this.#actions$.pipe(
            ofType(ReadingActivitiesActions.createActivity),
            switchMap(({ activity }) =>
                this.#readingActivityService.create(activity).pipe(
                    map(newActivity => {
                        this.#sb.open('La actividad ha sido creada', 'Ok', timing)
                        return ReadingActivitiesActions.createActivitySuccess({
                            activity: newActivity,
                        })
                    }),
                    catchError(error => {
                        this.#sb.open('Error al crear la actividad', 'Ok', timing)
                        return of(
                            ReadingActivitiesActions.createActivityFailed({
                                error: error.message,
                            }),
                        )
                    }),
                ),
            ),
        ),
    )

    updateActivity$ = createEffect(() =>
        this.#actions$.pipe(
            ofType(ReadingActivitiesActions.updateActivity),
            switchMap(({ id, data }) =>
                this.#readingActivityService.update(id, data).pipe(
                    map(updatedActivity => {
                        this.#sb.open('La actividad fue actualizada', 'Ok', timing)
                        return ReadingActivitiesActions.updateActivitySuccess({
                            activity: updatedActivity,
                        })
                    }),
                    catchError(error => {
                        this.#sb.open('Error al actualizar la actividad', 'Ok', timing)
                        return of(
                            ReadingActivitiesActions.updateActivityFailed({
                                error: error.message,
                            }),
                        )
                    }),
                ),
            ),
        ),
    )

    deleteActivity$ = createEffect(() =>
        this.#actions$.pipe(
            ofType(ReadingActivitiesActions.deleteActivity),
            switchMap(({ id }) =>
                this.#readingActivityService.delete(id).pipe(
                    map(() => {
                        this.#sb.open('La actividad ha sido eliminada', 'Ok', timing)
                        return ReadingActivitiesActions.deleteActivitySuccess({ id })
                    }),
                    catchError(error => {
                        this.#sb.open('Error al eliminar la actividad', 'Ok', timing)
                        return of(
                            ReadingActivitiesActions.deleteActivityFailed({
                                error: error.message,
                            }),
                        )
                    }),
                ),
            ),
        ),
    )
}
