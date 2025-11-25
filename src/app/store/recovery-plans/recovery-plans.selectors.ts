import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
	RecoveryPlanState,
	RecoveryPlanStateStatus,
} from './recovery-plans.models';

export const selectRecoveryPlansState =
	createFeatureSelector<RecoveryPlanState>('recoveryPlans');

export const selectAllRecoveryPlans = createSelector(
	selectRecoveryPlansState,
	(state) => state.recoveryPlans,
);

export const selectCurrentRecoveryPlan = createSelector(
	selectRecoveryPlansState,
	(state) => state.selectedRecoveryPlan,
);

export const selectRecoveryPlansStatus = createSelector(
	selectRecoveryPlansState,
	(state) => state.status,
);

export const selectRecoveryPlansError = createSelector(
	selectRecoveryPlansState,
	(state) => state.error,
);

// Selectores de estado booleanos
export const selectIsLoadingManyRecoveryPlans = createSelector(
	selectRecoveryPlansStatus,
	(status) => status === RecoveryPlanStateStatus.LOADING_RECOVERY_PLANS,
);

export const selectIsLoadingOneRecoveryPlan = createSelector(
	selectRecoveryPlansStatus,
	(status) => status === RecoveryPlanStateStatus.LOADING_RECOVERY_PLAN,
);

export const selectIsCreatingRecoveryPlan = createSelector(
	selectRecoveryPlansStatus,
	(status) => status === RecoveryPlanStateStatus.CREATING_RECOVERY_PLAN,
);

export const selectIsUpdatingRecoveryPlan = createSelector(
	selectRecoveryPlansStatus,
	(status) => status === RecoveryPlanStateStatus.UPDATING_RECOVERY_PLAN,
);

export const selectIsDeletingRecoveryPlan = createSelector(
	selectRecoveryPlansStatus,
	(status) => status === RecoveryPlanStateStatus.DELETING_RECOVERY_PLAN,
);
