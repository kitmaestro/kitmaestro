import { inject, Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { catchError, switchMap, map, of } from 'rxjs'
import { MatSnackBar } from '@angular/material/snack-bar'
import { DiagnosticEvaluationService } from '../../core/services'
import * as DiagnosticEvaluationsActions from './diagnostic-evaluations.actions'

const timing = { duration: 2500 }

@Injectable()
export class DiagnosticEvaluationsEffects {
    #actions$ = inject(Actions)
    #diagnosticEvaluationService = inject(DiagnosticEvaluationService)
    #sb = inject(MatSnackBar)

    loadEvaluation$ = createEffect(() =>
        this.#actions$.pipe(
            ofType(DiagnosticEvaluationsActions.loadEvaluation),
            switchMap(({ id }) =>
                this.#diagnosticEvaluationService.findOne(id).pipe(
                    map(evaluation =>
                        DiagnosticEvaluationsActions.loadEvaluationSuccess({ evaluation }),
                    ),
                    catchError(error => {
                        this.#sb.open('Error al cargar la evaluación', 'Ok', timing)
                        return of(
                            DiagnosticEvaluationsActions.loadEvaluationFailed({
                                error: error.message,
                            }),
                        )
                    }),
                ),
            ),
        ),
    )

    loadEvaluations$ = createEffect(() =>
        this.#actions$.pipe(
            ofType(DiagnosticEvaluationsActions.loadEvaluations),
            switchMap(() =>
                this.#diagnosticEvaluationService.findAll().pipe(
                    map(evaluations =>
                        DiagnosticEvaluationsActions.loadEvaluationsSuccess({ evaluations }),
                    ),
                    catchError(error => {
                        this.#sb.open('Error al cargar las evaluaciones', 'Ok', timing)
                        return of(
                            DiagnosticEvaluationsActions.loadEvaluationsFailed({
                                error: error.message,
                            }),
                        )
                    }),
                ),
            ),
        ),
    )

    createEvaluation$ = createEffect(() =>
        this.#actions$.pipe(
            ofType(DiagnosticEvaluationsActions.createEvaluation),
            switchMap(({ evaluation }) =>
                this.#diagnosticEvaluationService.create(evaluation).pipe(
                    map(newEvaluation => {
                        this.#sb.open('La evaluación ha sido creada', 'Ok', timing)
                        return DiagnosticEvaluationsActions.createEvaluationSuccess({
                            evaluation: newEvaluation,
                        })
                    }),
                    catchError(error => {
                        this.#sb.open('Error al crear la evaluación', 'Ok', timing)
                        return of(
                            DiagnosticEvaluationsActions.createEvaluationFailed({
                                error: error.message,
                            }),
                        )
                    }),
                ),
            ),
        ),
    )

    updateEvaluation$ = createEffect(() =>
        this.#actions$.pipe(
            ofType(DiagnosticEvaluationsActions.updateEvaluation),
            switchMap(({ id, data }) =>
                this.#diagnosticEvaluationService.update(id, data).pipe(
                    map(updatedEvaluation => {
                        this.#sb.open('La evaluación fue actualizada', 'Ok', timing)
                        return DiagnosticEvaluationsActions.updateEvaluationSuccess({
                            evaluation: updatedEvaluation,
                        })
                    }),
                    catchError(error => {
                        this.#sb.open('Error al actualizar la evaluación', 'Ok', timing)
                        return of(
                            DiagnosticEvaluationsActions.updateEvaluationFailed({
                                error: error.message,
                            }),
                        )
                    }),
                ),
            ),
        ),
    )

    deleteEvaluation$ = createEffect(() =>
        this.#actions$.pipe(
            ofType(DiagnosticEvaluationsActions.deleteEvaluation),
            switchMap(({ id }) =>
                this.#diagnosticEvaluationService.delete(id).pipe(
                    map(() => {
                        this.#sb.open('La evaluación ha sido eliminada', 'Ok', timing)
                        return DiagnosticEvaluationsActions.deleteEvaluationSuccess({ id })
                    }),
                    catchError(error => {
                        this.#sb.open('Error al eliminar la evaluación', 'Ok', timing)
                        return of(
                            DiagnosticEvaluationsActions.deleteEvaluationFailed({
                                error: error.message,
                            }),
                        )
                    }),
                ),
            ),
        ),
    )
}
