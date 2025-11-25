import { createAction, props } from '@ngrx/store';
import { RecoveryPlan } from '../../core/models';

type RecoveryPlanDto = Partial<RecoveryPlan>;

// Load a single recovery plan
export const loadRecoveryPlan = createAction(
	'[Recovery Plans] Load Recovery Plan',
	props<{ id: string }>(),
);
export const loadRecoveryPlanSuccess = createAction(
	'[Recovery Plans] Load Recovery Plan Success',
	props<{ recoveryPlan: RecoveryPlan }>(),
);
export const loadRecoveryPlanFailed = createAction(
	'[Recovery Plans] Load Recovery Plan Failed',
	props<{ error: string }>(),
);

// Load all recovery plans
export const loadRecoveryPlans = createAction(
	'[Recovery Plans] Load Recovery Plans',
	props<{ filters: Record<string, unknown> }>(),
);
export const loadRecoveryPlansSuccess = createAction(
	'[Recovery Plans] Load Recovery Plans Success',
	props<{ recoveryPlans: RecoveryPlan[] }>(),
);
export const loadRecoveryPlansFailed = createAction(
	'[Recovery Plans] Load Recovery Plans Failed',
	props<{ error: string }>(),
);

// Create a recovery plan
export const createRecoveryPlan = createAction(
	'[Recovery Plans] Create Recovery Plan',
	props<{ recoveryPlan: RecoveryPlanDto }>(),
);
export const createRecoveryPlanSuccess = createAction(
	'[Recovery Plans] Create Recovery Plan Success',
	props<{ recoveryPlan: RecoveryPlan }>(),
);
export const createRecoveryPlanFailed = createAction(
	'[Recovery Plans] Create Recovery Plan Failed',
	props<{ error: string }>(),
);

// Update a recovery plan
export const updateRecoveryPlan = createAction(
	'[Recovery Plans] Update Recovery Plan',
	props<{ id: string; data: RecoveryPlanDto }>(),
);
export const updateRecoveryPlanSuccess = createAction(
	'[Recovery Plans] Update Recovery Plan Success',
	props<{ recoveryPlan: RecoveryPlan }>(),
);
export const updateRecoveryPlanFailed = createAction(
	'[Recovery Plans] Update Recovery Plan Failed',
	props<{ error: string }>(),
);

// Delete a recovery plan
export const deleteRecoveryPlan = createAction(
	'[Recovery Plans] Delete Recovery Plan',
	props<{ id: string }>(),
);
export const deleteRecoveryPlanSuccess = createAction(
	'[Recovery Plans] Delete Recovery Plan Success',
	props<{ id: string }>(),
);
export const deleteRecoveryPlanFailed = createAction(
	'[Recovery Plans] Delete Recovery Plan Failed',
	props<{ error: string }>(),
);

// Download a recovery plan
export const downloadRecoveryPlan = createAction(
	'[Recovery Plans] Download Recovery Plan',
	props<{ recoveryPlan: RecoveryPlan }>(),
);
export const downloadRecoveryPlanSuccess = createAction(
	'[Recovery Plans] Download Recovery Plan Success',
);
export const downloadRecoveryPlanFailure = createAction(
	'[Recovery Plans] Download Recovery Plan Failure',
	props<{ error: string }>(),
);
