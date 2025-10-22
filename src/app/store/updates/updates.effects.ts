import { inject, Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { catchError, switchMap, map, of } from 'rxjs'
import { MatSnackBar } from '@angular/material/snack-bar'
import { UpdateService } from '../../core/services'
import * as UpdatesActions from './updates.actions'

const timing = { duration: 2500 }

@Injectable()
export class UpdatesEffects {
    #actions$ = inject(Actions)
    #updateService = inject(UpdateService)
    #sb = inject(MatSnackBar)

    loadUpdate$ = createEffect(() =>
        this.#actions$.pipe(
            ofType(UpdatesActions.loadUpdate),
            switchMap(({ id }) =>
                this.#updateService.find(id).pipe(
                    map(update => UpdatesActions.loadUpdateSuccess({ update })),
                    catchError(error => {
                        this.#sb.open('Error al cargar la actualización', 'Ok', timing)
                        return of(UpdatesActions.loadUpdateFailed({ error: error.message }))
                    }),
                ),
            ),
        ),
    )

    loadUpdates$ = createEffect(() =>
        this.#actions$.pipe(
            ofType(UpdatesActions.loadUpdates),
            switchMap(() =>
                this.#updateService.findAll().pipe(
                    map(updates => UpdatesActions.loadUpdatesSuccess({ updates })),
                    catchError(error => {
                        this.#sb.open('Error al cargar las actualizaciones', 'Ok', timing)
                        return of(UpdatesActions.loadUpdatesFailed({ error: error.message }))
                    }),
                ),
            ),
        ),
    )

    createUpdate$ = createEffect(() =>
        this.#actions$.pipe(
            ofType(UpdatesActions.createUpdate),
            switchMap(({ update }) =>
                this.#updateService.create(update as any).pipe(
                    map(newUpdate => {
                        this.#sb.open('La actualización ha sido creada', 'Ok', timing)
                        return UpdatesActions.createUpdateSuccess({ update: newUpdate })
                    }),
                    catchError(error => {
                        this.#sb.open('Error al crear la actualización', 'Ok', timing)
                        return of(UpdatesActions.createUpdateFailed({ error: error.message }))
                    }),
                ),
            ),
        ),
    )

    updateUpdate$ = createEffect(() =>
        this.#actions$.pipe(
            ofType(UpdatesActions.updateUpdate),
            switchMap(({ id, data }) =>
                this.#updateService.update(id, data as any).pipe(
                    map(updatedUpdate => {
                        this.#sb.open('La actualización fue actualizada', 'Ok', timing)
                        return UpdatesActions.updateUpdateSuccess({ update: updatedUpdate })
                    }),
                    catchError(error => {
                        this.#sb.open('Error al actualizar la actualización', 'Ok', timing)
                        return of(UpdatesActions.updateUpdateFailed({ error: error.message }))
                    }),
                ),
            ),
        ),
    )

    deleteUpdate$ = createEffect(() =>
        this.#actions$.pipe(
            ofType(UpdatesActions.deleteUpdate),
            switchMap(({ id }) =>
                this.#updateService.delete(id).pipe(
                    map(() => {
                        this.#sb.open('La actualización ha sido eliminada', 'Ok', timing)
                        return UpdatesActions.deleteUpdateSuccess({ id })
                    }),
                    catchError(error => {
                        this.#sb.open('Error al eliminar la actualización', 'Ok', timing)
                        return of(UpdatesActions.deleteUpdateFailed({ error: error.message }))
                    }),
                ),
            ),
        ),
    )
}
