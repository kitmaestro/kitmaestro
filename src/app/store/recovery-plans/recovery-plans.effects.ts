import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, switchMap, map, of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RecoveryPlanService } from '../../core/services/recovery-plan.service';
import * as RecoveryPlansActions from './recovery-plans.actions';
import { AiService } from '../../core/services/ai.service';

const timing = { duration: 2500 };

@Injectable()
export class RecoveryPlansEffects {
	#actions$ = inject(Actions);
	#recoveryPlanService = inject(RecoveryPlanService);
	#sb = inject(MatSnackBar);

	loadRecoveryPlan$ = createEffect(() =>
		this.#actions$.pipe(
			ofType(RecoveryPlansActions.loadRecoveryPlan),
			switchMap(({ id }) =>
				this.#recoveryPlanService.findOne(id).pipe(
					map((recoveryPlan) =>
						RecoveryPlansActions.loadRecoveryPlanSuccess({ recoveryPlan }),
					),
					catchError((error) => {
						this.#sb.open(
							'Error al cargar el plan de recuperación',
							'Ok',
							timing,
						);
						return of(
							RecoveryPlansActions.loadRecoveryPlanFailed({
								error: error.message,
							}),
						);
					}),
				),
			),
		),
	);

	loadRecoveryPlans$ = createEffect(() =>
		this.#actions$.pipe(
			ofType(RecoveryPlansActions.loadRecoveryPlans),
			switchMap(({ filters }) =>
				this.#recoveryPlanService.findAll(filters).pipe(
					map((recoveryPlans) =>
						RecoveryPlansActions.loadRecoveryPlansSuccess({
							recoveryPlans,
						}),
					),
					catchError((error) => {
						this.#sb.open(
							'Error al cargar los planes de recuperación',
							'Ok',
							timing,
						);
						return of(
							RecoveryPlansActions.loadRecoveryPlansFailed({
								error: error.message,
							}),
						);
					}),
				),
			),
		),
	);

	createRecoveryPlan$ = createEffect(() =>
		this.#actions$.pipe(
			ofType(RecoveryPlansActions.createRecoveryPlan),
			switchMap(({ recoveryPlan }) =>
				this.#recoveryPlanService.create(recoveryPlan).pipe(
					map((newRecoveryPlan) => {
						this.#sb.open(
							'El plan de recuperación ha sido creado',
							'Ok',
							timing,
						);
						return RecoveryPlansActions.createRecoveryPlanSuccess({
							recoveryPlan: newRecoveryPlan,
						});
					}),
					catchError((error) => {
						this.#sb.open(
							'Error al crear el plan de recuperación',
							'Ok',
							timing,
						);
						return of(
							RecoveryPlansActions.createRecoveryPlanFailed({
								error: error.message,
							}),
						);
					}),
				),
			),
		),
	);

	updateRecoveryPlan$ = createEffect(() =>
		this.#actions$.pipe(
			ofType(RecoveryPlansActions.updateRecoveryPlan),
			switchMap(({ id, data }) =>
				this.#recoveryPlanService.update(id, data).pipe(
					map((updatedRecoveryPlan) => {
						this.#sb.open(
							'El plan de recuperación fue actualizado',
							'Ok',
							timing,
						);
						return RecoveryPlansActions.updateRecoveryPlanSuccess({
							recoveryPlan: updatedRecoveryPlan,
						});
					}),
					catchError((error) => {
						this.#sb.open(
							'Error al actualizar el plan de recuperación',
							'Ok',
							timing,
						);
						return of(
							RecoveryPlansActions.updateRecoveryPlanFailed({
								error: error.message,
							}),
						);
					}),
				),
			),
		),
	);

	deleteRecoveryPlan$ = createEffect(() =>
		this.#actions$.pipe(
			ofType(RecoveryPlansActions.deleteRecoveryPlan),
			switchMap(({ id }) =>
				this.#recoveryPlanService.delete(id).pipe(
					map(() => {
						this.#sb.open(
							'El plan de recuperación ha sido eliminado',
							'Ok',
							timing,
						);
						return RecoveryPlansActions.deleteRecoveryPlanSuccess({
							id,
						});
					}),
					catchError((error) => {
						this.#sb.open(
							'Error al eliminar el plan de recuperación',
							'Ok',
							timing,
						);
						return of(
							RecoveryPlansActions.deleteRecoveryPlanFailed({
								error: error.message,
							}),
						);
					}),
				),
			),
		),
	);

	downloadRecoveryPlan$ = createEffect(() =>
		this.#actions$.pipe(
			ofType(RecoveryPlansActions.downloadRecoveryPlan),
			switchMap(({ recoveryPlan }) =>
				of(this.#recoveryPlanService.download(recoveryPlan)).pipe(
					map(() => {
						this.#sb.open(
							'El plan de recuperación ha sido descargado',
							'Ok',
							timing,
						);
						return RecoveryPlansActions.downloadRecoveryPlanSuccess();
					}),
					catchError((error) => {
						this.#sb.open(
							'Error al descargar el plan de recuperación',
							'Ok',
							timing,
						);
						return of(
							RecoveryPlansActions.downloadRecoveryPlanFailure({
								error: error.message,
							}),
						);
					}),
				),
			),
		),
	);
}
