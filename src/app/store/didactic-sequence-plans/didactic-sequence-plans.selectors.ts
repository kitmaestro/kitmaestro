import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
	DidacticPlansState,
	DidacticPlanStateStatus,
} from './didactic-sequence-plans.models';

export const selectDidacticPlansState =
	createFeatureSelector<DidacticPlansState>('DidacticPlans');

export const selectAllPlans = createSelector(
	selectDidacticPlansState,
	(state) => state.plans,
);

export const selectCurrentPlan = createSelector(
	selectDidacticPlansState,
	(state) => state.selectedPlan,
);

export const selectPlansStatus = createSelector(
	selectDidacticPlansState,
	(state) => state.status,
);

export const selectPlansError = createSelector(
	selectDidacticPlansState,
	(state) => state.error,
);

// Selectores de estado booleanos
export const selectIsLoadingManySequencePlans = createSelector(
	selectPlansStatus,
	(status) => status === DidacticPlanStateStatus.LOADING_PLANS,
);

export const selectIsLoadingOneSequencePlan = createSelector(
	selectPlansStatus,
	(status) => status === DidacticPlanStateStatus.LOADING_PLAN,
);

export const selectIsCreatingSequencePlan = createSelector(
	selectPlansStatus,
	(status) => status === DidacticPlanStateStatus.CREATING_PLAN,
);

export const selectIsUpdatingSequencePlan = createSelector(
	selectPlansStatus,
	(status) => status === DidacticPlanStateStatus.UPDATING_PLAN,
);

export const selectIsDeletingSequencePlan = createSelector(
	selectPlansStatus,
	(status) => status === DidacticPlanStateStatus.DELETING_PLAN,
);
