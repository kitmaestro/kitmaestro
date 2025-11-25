import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, switchMap, map, of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ImprovementPlanService } from '../../core/services/improvement-plan.service'; // New service
import * as ImprovementPlansActions from './improvement-plans.actions';

const timing = { duration: 2500 };

@Injectable()
export class ImprovementPlansEffects {
  #actions$ = inject(Actions);
  #improvementPlanService = inject(ImprovementPlanService);
  #sb = inject(MatSnackBar);

  loadPlan$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(ImprovementPlansActions.loadImprovementPlan),
      switchMap(({ id }) =>
        this.#improvementPlanService.findOne(id).pipe(
          map((plan) =>
            ImprovementPlansActions.loadImprovementPlanSuccess({ plan }),
          ),
          catchError((error) => {
            this.#sb.open(
              'Error al cargar el plan de mejora',
              'Ok',
              timing,
            );
            return of(
              ImprovementPlansActions.loadImprovementPlanFailed({
                error: error.message,
              }),
            );
          }),
        ),
      ),
    ),
  );

  loadPlans$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(ImprovementPlansActions.loadImprovementPlans),
      switchMap(({ filters }) =>
        this.#improvementPlanService.findAll(filters).pipe(
          map((plans) =>
            ImprovementPlansActions.loadImprovementPlansSuccess({
              plans: plans as any[],
            }),
          ),
          catchError((error) => {
            this.#sb.open(
              'Error al cargar los planes de mejora',
              'Ok',
              timing,
            );
            return of(
              ImprovementPlansActions.loadImprovementPlansFailed({
                error: error.message,
              }),
            );
          }),
        ),
      ),
    ),
  );

  createPlan$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(ImprovementPlansActions.createImprovementPlan),
      switchMap(({ plan }) =>
        this.#improvementPlanService.create(plan).pipe(
          map((newPlan) => {
            this.#sb.open(
              'El plan de mejora ha sido creado',
              'Ok',
              timing,
            );
            return ImprovementPlansActions.createImprovementPlanSuccess({
              plan: newPlan,
            });
          }),
          catchError((error) => {
            this.#sb.open(
              'Error al crear el plan de mejora',
              'Ok',
              timing,
            );
            return of(
              ImprovementPlansActions.createImprovementPlanFailed({
                error: error.message,
              }),
            );
          }),
        ),
      ),
    ),
  );

  updatePlan$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(ImprovementPlansActions.updateImprovementPlan),
      switchMap(({ id, data }) =>
        this.#improvementPlanService.update(id, data).pipe(
          map((response) => {
            this.#sb.open(
              'El plan de mejora fue actualizado',
              'Ok',
              timing,
            );
            return ImprovementPlansActions.updateImprovementPlanSuccess({
              plan: response,
            });
          }),
          catchError((error) => {
            this.#sb.open(
              'Error al actualizar el plan de mejora',
              'Ok',
              timing,
            );
            return of(
              ImprovementPlansActions.updateImprovementPlanFailed({
                error: error.message,
              }),
            );
          }),
        ),
      ),
    ),
  );

  deletePlan$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(ImprovementPlansActions.deleteImprovementPlan),
      switchMap(({ id }) =>
        this.#improvementPlanService.delete(id).pipe(
          map(() => {
            this.#sb.open(
              'El plan de mejora ha sido eliminado',
              'Ok',
              timing,
            );
            return ImprovementPlansActions.deleteImprovementPlanSuccess({ id });
          }),
          catchError((error) => {
            this.#sb.open(
              'Error al eliminar el plan de mejora',
              'Ok',
              timing,
            );
            return of(
              ImprovementPlansActions.deleteImprovementPlanFailed({
                error: error.message,
              }),
            );
          }),
        ),
      ),
    ),
  );
}
