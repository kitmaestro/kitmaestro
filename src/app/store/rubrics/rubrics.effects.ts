import { inject, Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { catchError, switchMap, map, of } from 'rxjs'
import { MatSnackBar } from '@angular/material/snack-bar'
import { RubricService } from '../../core/services'
import * as RubricsActions from './rubrics.actions'

const timing = { duration: 2500 }

@Injectable()
export class RubricsEffects {
    #actions$ = inject(Actions)
    #rubricService = inject(RubricService)
    #sb = inject(MatSnackBar)

    loadRubric$ = createEffect(() =>
        this.#actions$.pipe(
            ofType(RubricsActions.loadRubric),
            switchMap(({ id }) =>
                this.#rubricService.find(id).pipe(
                    map(rubric => RubricsActions.loadRubricSuccess({ rubric })),
                    catchError(error => {
                        this.#sb.open('Error al cargar la rúbrica', 'Ok', timing)
                        return of(RubricsActions.loadRubricFailed({ error: error.message }))
                    }),
                ),
            ),
        ),
    )

    loadRubrics$ = createEffect(() =>
        this.#actions$.pipe(
            ofType(RubricsActions.loadRubrics),
            switchMap(({ filter }) =>
                this.#rubricService.findAll(filter).pipe(
                    map(rubrics => RubricsActions.loadRubricsSuccess({ rubrics })),
                    catchError(error => {
                        this.#sb.open('Error al cargar las rúbricas', 'Ok', timing)
                        return of(RubricsActions.loadRubricsFailed({ error: error.message }))
                    }),
                ),
            ),
        ),
    )

    createRubric$ = createEffect(() =>
        this.#actions$.pipe(
            ofType(RubricsActions.createRubric),
            switchMap(({ rubric }) =>
                this.#rubricService.create(rubric).pipe(
                    map(newRubric => {
                        this.#sb.open('La rúbrica ha sido creada', 'Ok', timing)
                        return RubricsActions.createRubricSuccess({ rubric: newRubric })
                    }),
                    catchError(error => {
                        this.#sb.open('Error al crear la rúbrica', 'Ok', timing)
                        return of(RubricsActions.createRubricFailed({ error: error.message }))
                    }),
                ),
            ),
        ),
    )

    updateRubric$ = createEffect(() =>
        this.#actions$.pipe(
            ofType(RubricsActions.updateRubric),
            switchMap(({ id, data }) =>
                this.#rubricService.update(id, data).pipe(
                    map(updatedRubric => {
                        this.#sb.open('La rúbrica fue actualizada', 'Ok', timing)
                        return RubricsActions.updateRubricSuccess({ rubric: updatedRubric })
                    }),
                    catchError(error => {
                        this.#sb.open('Error al actualizar la rúbrica', 'Ok', timing)
                        return of(RubricsActions.updateRubricFailed({ error: error.message }))
                    }),
                ),
            ),
        ),
    )

    deleteRubric$ = createEffect(() =>
        this.#actions$.pipe(
            ofType(RubricsActions.deleteRubric),
            switchMap(({ id }) =>
                this.#rubricService.delete(id).pipe(
                    map(() => {
                        this.#sb.open('La rúbrica ha sido eliminada', 'Ok', timing)
                        return RubricsActions.deleteRubricSuccess({ id })
                    }),
                    catchError(error => {
                        this.#sb.open('Error al eliminar la rúbrica', 'Ok', timing)
                        return of(RubricsActions.deleteRubricFailed({ error: error.message }))
                    }),
                ),
            ),
        ),
    )
}
