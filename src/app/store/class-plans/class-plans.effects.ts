import { inject, Injectable } from "@angular/core"
import { Actions, createEffect, ofType } from "@ngrx/effects"
import { of, switchMap, catchError, map, from } from 'rxjs'
import { MatSnackBar } from '@angular/material/snack-bar'
import { ClassPlansService } from "../../core/services"
import * as ClassPlansActions from './class-plans.actions'

@Injectable()
export class ClassPlansEffects {
    #actions$ = inject(Actions)
    #classPlansService = inject(ClassPlansService)
    #sb = inject(MatSnackBar)

    loadClassPlans$ = createEffect(() => this.#actions$.pipe(
        ofType(ClassPlansActions.loadClassPlans),
        switchMap(({ filters }) => this.#classPlansService.findAll(filters).pipe(
            map(classPlans => ClassPlansActions.loadClassPlansSuccess({ classPlans })),
            catchError(error => of(ClassPlansActions.loadClassPlansFailure({ error })))
        ))
    ))

    loadClassPlan$ = createEffect(() => this.#actions$.pipe(
        ofType(ClassPlansActions.loadClassPlan),
        switchMap(({ planId }) => this.#classPlansService.find(planId).pipe(
            map(classPlan => ClassPlansActions.loadClassPlanSuccess({ classPlan })),
            catchError(error => of(ClassPlansActions.loadClassPlanFailure({ error })))
        ))
    ))

    createClassPlan$ = createEffect(() => this.#actions$.pipe(
        ofType(ClassPlansActions.createClassPlan),
        switchMap(({ plan }) => this.#classPlansService.addPlan(plan).pipe(
            map(classPlan => ClassPlansActions.createClassPlanSuccess({ classPlan })),
            catchError(error => of(ClassPlansActions.createClassPlanFailure({ error })))
        ))
    ))

    updateClassPlan$ = createEffect(() => this.#actions$.pipe(
        ofType(ClassPlansActions.updateClassPlan),
        switchMap(({ planId, data }) => this.#classPlansService.updatePlan(planId, data).pipe(
            map(classPlan => ClassPlansActions.updateClassPlanSuccess({ classPlan })),
            catchError(error => of(ClassPlansActions.updateClassPlanFailure({ error })))
        ))
    ))

    deleteClassPlan$ = createEffect(() => this.#actions$.pipe(
        ofType(ClassPlansActions.deleteClassPlan),
        switchMap(({ planId }) => this.#classPlansService.deletePlan(planId).pipe(
            map(() => {
                this.#sb.open('Plan eliminado correctamente', 'Cerrar', { duration: 3000 })
                return ClassPlansActions.deleteClassPlanSuccess({ planId })
            }),
            catchError(error => {
                this.#sb.open('Error al eliminar el plan', 'Cerrar', { duration: 3000 })
                return of(ClassPlansActions.deleteClassPlanFailure({ error }))
            })
        ))
    ))

    downloadClassPlan$ = createEffect(() => this.#actions$.pipe(
        ofType(ClassPlansActions.downloadClassPlan),
        switchMap(({ plan }) => from(this.#classPlansService.download(plan)).pipe(
            map(() => {
                this.#sb.open('El plan esta siendo descargado', 'Ok', { duration: 2500 })
                return ClassPlansActions.downloadClassPlanSuccess()
            }),
            catchError(error => {
                this.#sb.open('Error al descargar el archivo', 'Ok', { duration: 2500 })
                console.log(error)
                return of(ClassPlansActions.downloadClassPlanFailure)
            })
        ))
    ))

}
