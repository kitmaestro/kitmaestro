import { inject, Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { catchError, switchMap, map, of, from } from 'rxjs'
import { MatSnackBar } from '@angular/material/snack-bar'
import { UnitPlanService } from '../../core/services'
import * as UnitPlansActions from './unit-plans.actions'

const timing = { duration: 2500 }

@Injectable()
export class UnitPlansEffects {
    #actions$ = inject(Actions)
    #unitPlanService = inject(UnitPlanService)
    #sb = inject(MatSnackBar)

    loadPlan$ = createEffect(() =>
        this.#actions$.pipe(
            ofType(UnitPlansActions.loadPlan),
            switchMap(({ id }) =>
                this.#unitPlanService.findOne(id).pipe(
                    map(plan => UnitPlansActions.loadPlanSuccess({ plan })),
                    catchError(error => {
                        this.#sb.open('Error al cargar el plan de unidad', 'Ok', timing)
                        return of(UnitPlansActions.loadPlanFailed({ error: error.message }))
                    }),
                ),
            ),
        ),
    )

    loadPlans$ = createEffect(() =>
        this.#actions$.pipe(
            ofType(UnitPlansActions.loadPlans),
            switchMap(() =>
                this.#unitPlanService.findAll().pipe(
                    map(plans => UnitPlansActions.loadPlansSuccess({ plans: plans as any[] })),
                    catchError(error => {
                        this.#sb.open('Error al cargar los planes de unidad', 'Ok', timing)
                        return of(UnitPlansActions.loadPlansFailed({ error: error.message }))
                    }),
                ),
            ),
        ),
    )

    createPlan$ = createEffect(() =>
        this.#actions$.pipe(
            ofType(UnitPlansActions.createPlan),
            switchMap(({ plan }) =>
                this.#unitPlanService.create(plan).pipe(
                    map(newPlan => {
                        this.#sb.open('El plan de unidad ha sido creado', 'Ok', timing)
                        return UnitPlansActions.createPlanSuccess({ plan: newPlan })
                    }),
                    catchError(error => {
                        this.#sb.open('Error al crear el plan de unidad', 'Ok', timing)
                        return of(UnitPlansActions.createPlanFailed({ error: error.message }))
                    }),
                ),
            ),
        ),
    )

    updatePlan$ = createEffect(() =>
        this.#actions$.pipe(
            ofType(UnitPlansActions.updatePlan),
            switchMap(({ id, data }) =>
                this.#unitPlanService.update(id, data).pipe(
                    map(response => {
                        this.#sb.open('El plan de unidad fue actualizado', 'Ok', timing)
                        return UnitPlansActions.updatePlanSuccess({ plan: response })
                    }),
                    catchError(error => {
                        this.#sb.open('Error al actualizar el plan de unidad', 'Ok', timing)
                        return of(UnitPlansActions.updatePlanFailed({ error: error.message }))
                    }),
                ),
            ),
        ),
    )

    deletePlan$ = createEffect(() =>
        this.#actions$.pipe(
            ofType(UnitPlansActions.deletePlan),
            switchMap(({ id }) =>
                this.#unitPlanService.delete(id).pipe(
                    map(() => {
                        this.#sb.open('El plan de unidad ha sido eliminado', 'Ok', timing)
                        return UnitPlansActions.deletePlanSuccess({ id })
                    }),
                    catchError(error => {
                        this.#sb.open('Error al eliminar el plan de unidad', 'Ok', timing)
                        return of(UnitPlansActions.deletePlanFailed({ error: error.message }))
                    }),
                ),
            ),
        ),
    )

    downloadPlan$ = createEffect(() => this.#actions$.pipe(
        ofType(UnitPlansActions.downloadPlan),
        switchMap(({ plan, classPlans, user }) => from(this.#unitPlanService.download(plan, classPlans, user)).pipe(
            map(() => {
                this.#sb.open('El plan esta siendo descargado', 'Ok', timing)
                return UnitPlansActions.downloadPlanSuccess()
            }),
            catchError(error => {
                this.#sb.open('Error al descargar el plan de unidad', 'Ok', timing)
                return of(UnitPlansActions.deletePlanFailed({ error: error.message }))
            }),
        ))
    ))
}
