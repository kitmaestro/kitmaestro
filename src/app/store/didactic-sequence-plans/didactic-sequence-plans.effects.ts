import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, switchMap, map, of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DidacticPlanService } from '../../core/services';
import * as DidacticPlansActions from './didactic-sequence-plans.actions';

const timing = { duration: 2500 };

@Injectable()
export class DidacticPlansEffects {
	#actions$ = inject(Actions);
	#DidacticPlanService = inject(DidacticPlanService);
	#sb = inject(MatSnackBar);

	loadPlan$ = createEffect(() =>
		this.#actions$.pipe(
			ofType(DidacticPlansActions.loadSequencePlan),
			switchMap(({ id }) =>
				this.#DidacticPlanService.findOne(id).pipe(
					map((plan) =>
						DidacticPlansActions.loadSequencePlanSuccess({ plan }),
					),
					catchError((error) => {
						this.#sb.open('Error al cargar el plan', 'Ok', timing);
						return of(
							DidacticPlansActions.loadSequencePlanFailed({
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
			ofType(DidacticPlansActions.loadSequencePlans),
			switchMap(({ filters }) =>
				this.#DidacticPlanService.findAll(filters).pipe(
					map((plans) =>
						DidacticPlansActions.loadSequencePlansSuccess({
							plans,
						}),
					),
					catchError((error) => {
						this.#sb.open(
							'Error al cargar los planes',
							'Ok',
							timing,
						);
						return of(
							DidacticPlansActions.loadSequencePlansFailed({
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
			ofType(DidacticPlansActions.createSequencePlan),
			switchMap(({ plan }) =>
				this.#DidacticPlanService.create(plan).pipe(
					map((newPlan) => {
						this.#sb.open('El plan ha sido creado', 'Ok', timing);
						return DidacticPlansActions.createSequencePlanSuccess({
							plan: newPlan,
						});
					}),
					catchError((error) => {
						this.#sb.open('Error al crear el plan', 'Ok', timing);
						return of(
							DidacticPlansActions.createSequencePlanFailed({
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
			ofType(DidacticPlansActions.updateSequencePlan),
			switchMap(({ id, data }) =>
				this.#DidacticPlanService.update(id, data).pipe(
					map((updatedPlan) => {
						this.#sb.open('El plan fue actualizado', 'Ok', timing);
						return DidacticPlansActions.updateSequencePlanSuccess({
							plan: updatedPlan,
						});
					}),
					catchError((error) => {
						this.#sb.open(
							'Error al actualizar el plan',
							'Ok',
							timing,
						);
						return of(
							DidacticPlansActions.updateSequencePlanFailed({
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
			ofType(DidacticPlansActions.deleteSequencePlan),
			switchMap(({ id }) =>
				this.#DidacticPlanService.delete(id).pipe(
					map(() => {
						this.#sb.open(
							'El plan ha sido eliminado',
							'Ok',
							timing,
						);
						return DidacticPlansActions.deleteSequencePlanSuccess({
							id,
						});
					}),
					catchError((error) => {
						this.#sb.open(
							'Error al eliminar el plan',
							'Ok',
							timing,
						);
						return of(
							DidacticPlansActions.deleteSequencePlanFailed({
								error: error.message,
							}),
						);
					}),
				),
			),
		),
	);
}
