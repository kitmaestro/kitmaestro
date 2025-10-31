import { inject, Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { catchError, switchMap, map, of } from 'rxjs'
import { MatSnackBar } from '@angular/material/snack-bar'
import { DidacticSequencePlanService } from '../../core/services'
import * as DidacticSequencePlansActions from './didactic-sequence-plans.actions'

const timing = { duration: 2500 }

@Injectable()
export class DidacticSequencePlansEffects {
    #actions$ = inject(Actions)
    #didacticSequencePlanService = inject(DidacticSequencePlanService)
    #sb = inject(MatSnackBar)

    loadPlan$ = createEffect(() =>
        this.#actions$.pipe(
            ofType(DidacticSequencePlansActions.loadPlan),
            switchMap(({ id }) =>
                this.#didacticSequencePlanService.findOne(id).pipe(
                    map(plan => DidacticSequencePlansActions.loadPlanSuccess({ plan })),
                    catchError(error => {
                        this.#sb.open('Error al cargar el plan', 'Ok', timing)
                        return of(
                            DidacticSequencePlansActions.loadPlanFailed({ error: error.message }),
                        )
                    }),
                ),
            ),
        ),
    )

    loadPlans$ = createEffect(() =>
        this.#actions$.pipe(
            ofType(DidacticSequencePlansActions.loadPlans),
            switchMap(({ filters }) =>
                this.#didacticSequencePlanService.findAll(filters).pipe(
                    map(plans => DidacticSequencePlansActions.loadPlansSuccess({ plans })),
                    catchError(error => {
                        this.#sb.open('Error al cargar los planes', 'Ok', timing)
                        return of(
                            DidacticSequencePlansActions.loadPlansFailed({ error: error.message }),
                        )
                    }),
                ),
            ),
        ),
    )

    createPlan$ = createEffect(() =>
        this.#actions$.pipe(
            ofType(DidacticSequencePlansActions.createPlan),
            switchMap(({ plan }) =>
                this.#didacticSequencePlanService.create(plan).pipe(
                    map(newPlan => {
                        this.#sb.open('El plan ha sido creado', 'Ok', timing)
                        return DidacticSequencePlansActions.createPlanSuccess({ plan: newPlan })
                    }),
                    catchError(error => {
                        this.#sb.open('Error al crear el plan', 'Ok', timing)
                        return of(
                            DidacticSequencePlansActions.createPlanFailed({
                                error: error.message,
                            }),
                        )
                    }),
                ),
            ),
        ),
    )

    updatePlan$ = createEffect(() =>
        this.#actions$.pipe(
            ofType(DidacticSequencePlansActions.updatePlan),
            switchMap(({ id, data }) =>
                this.#didacticSequencePlanService.update(id, data).pipe(
                    map(updatedPlan => {
                        this.#sb.open('El plan fue actualizado', 'Ok', timing)
                        return DidacticSequencePlansActions.updatePlanSuccess({
                            plan: updatedPlan,
                        })
                    }),
                    catchError(error => {
                        this.#sb.open('Error al actualizar el plan', 'Ok', timing)
                        return of(
                            DidacticSequencePlansActions.updatePlanFailed({
                                error: error.message,
                            }),
                        )
                    }),
                ),
            ),
        ),
    )

    deletePlan$ = createEffect(() =>
        this.#actions$.pipe(
            ofType(DidacticSequencePlansActions.deletePlan),
            switchMap(({ id }) =>
                this.#didacticSequencePlanService.delete(id).pipe(
                    map(() => {
                        this.#sb.open('El plan ha sido eliminado', 'Ok', timing)
                        return DidacticSequencePlansActions.deletePlanSuccess({ id })
                    }),
                    catchError(error => {
                        this.#sb.open('Error al eliminar el plan', 'Ok', timing)
                        return of(
                            DidacticSequencePlansActions.deletePlanFailed({
                                error: error.message,
                            }),
                        )
                    }),
                ),
            ),
        ),
    )
}
