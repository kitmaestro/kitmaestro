import { inject, Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { catchError, switchMap, map, of } from 'rxjs'
import { MatSnackBar } from '@angular/material/snack-bar'
import { ObservationGuideService } from '../../core/services'
import * as ObservationGuidesActions from './observation-guides.actions'

const timing = { duration: 2500 }

@Injectable()
export class ObservationGuidesEffects {
    #actions$ = inject(Actions)
    #observationGuideService = inject(ObservationGuideService)
    #sb = inject(MatSnackBar)

    loadGuide$ = createEffect(() =>
        this.#actions$.pipe(
            ofType(ObservationGuidesActions.loadGuide),
            switchMap(({ id }) =>
                this.#observationGuideService.find(id).pipe(
                    map(guide => ObservationGuidesActions.loadGuideSuccess({ guide })),
                    catchError(error => {
                        this.#sb.open('Error al cargar la guía', 'Ok', timing)
                        return of(
                            ObservationGuidesActions.loadGuideFailed({ error: error.message }),
                        )
                    }),
                ),
            ),
        ),
    )

    loadGuides$ = createEffect(() =>
        this.#actions$.pipe(
            ofType(ObservationGuidesActions.loadGuides),
            switchMap(() =>
                this.#observationGuideService.findAll().pipe(
                    map(guides => ObservationGuidesActions.loadGuidesSuccess({ guides })),
                    catchError(error => {
                        this.#sb.open('Error al cargar las guías', 'Ok', timing)
                        return of(
                            ObservationGuidesActions.loadGuidesFailed({ error: error.message }),
                        )
                    }),
                ),
            ),
        ),
    )

    createGuide$ = createEffect(() =>
        this.#actions$.pipe(
            ofType(ObservationGuidesActions.createGuide),
            switchMap(({ guide }) =>
                this.#observationGuideService.create(guide).pipe(
                    map(newGuide => {
                        this.#sb.open('La guía ha sido creada', 'Ok', timing)
                        return ObservationGuidesActions.createGuideSuccess({ guide: newGuide })
                    }),
                    catchError(error => {
                        this.#sb.open('Error al crear la guía', 'Ok', timing)
                        return of(
                            ObservationGuidesActions.createGuideFailed({ error: error.message }),
                        )
                    }),
                ),
            ),
        ),
    )

    updateGuide$ = createEffect(() =>
        this.#actions$.pipe(
            ofType(ObservationGuidesActions.updateGuide),
            switchMap(({ id, data }) =>
                this.#observationGuideService.update(id, data).pipe(
                    map(updatedGuide => {
                        this.#sb.open('La guía fue actualizada', 'Ok', timing)
                        return ObservationGuidesActions.updateGuideSuccess({ guide: updatedGuide })
                    }),
                    catchError(error => {
                        this.#sb.open('Error al actualizar la guía', 'Ok', timing)
                        return of(
                            ObservationGuidesActions.updateGuideFailed({ error: error.message }),
                        )
                    }),
                ),
            ),
        ),
    )

    deleteGuide$ = createEffect(() =>
        this.#actions$.pipe(
            ofType(ObservationGuidesActions.deleteGuide),
            switchMap(({ id }) =>
                this.#observationGuideService.delete(id).pipe(
                    map(() => {
                        this.#sb.open('La guía ha sido eliminada', 'Ok', timing)
                        return ObservationGuidesActions.deleteGuideSuccess({ id })
                    }),
                    catchError(error => {
                        this.#sb.open('Error al eliminar la guía', 'Ok', timing)
                        return of(
                            ObservationGuidesActions.deleteGuideFailed({ error: error.message }),
                        )
                    }),
                ),
            ),
        ),
    )
}
