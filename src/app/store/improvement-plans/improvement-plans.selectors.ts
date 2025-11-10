import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ImprovementPlansState, ImprovementPlanStateStatus } from './improvement-plans.models';

export const selectImprovementPlansState =
  createFeatureSelector<ImprovementPlansState>('improvementPlans');

export const selectAllImprovementPlans = createSelector(
  selectImprovementPlansState,
  (state) => state.improvementPlans,
);

export const selectCurrentImprovementPlan = createSelector(
  selectImprovementPlansState,
  (state) => state.selectedPlan,
);

export const selectImprovementPlansStatus = createSelector(
  selectImprovementPlansState,
  (state) => state.status,
);

export const selectImprovementPlansError = createSelector(
  selectImprovementPlansState,
  (state) => state.error,
);

export const selectTotalImprovementPlans = createSelector(
  selectImprovementPlansState,
  (state) => state.totalPlans,
);

export const selectImprovementPlansIsLoading = createSelector(
  selectImprovementPlansStatus,
  (state) => state == ImprovementPlanStateStatus.LOADING_PLANS,
);

export const selectImprovementPlanIsLoading = createSelector(
  selectImprovementPlansStatus,
  (state) => state == ImprovementPlanStateStatus.LOADING_PLAN,
);

export const selectImprovementPlanIsCreating = createSelector(
  selectImprovementPlansStatus,
  (state) => state == ImprovementPlanStateStatus.CREATING_PLAN,
);

export const selectImprovementPlanIsUpdating = createSelector(
  selectImprovementPlansStatus,
  (state) => state == ImprovementPlanStateStatus.UPDATING_PLAN,
);

export const selectImprovementPlanIsDeleting = createSelector(
  selectImprovementPlansStatus,
  (state) => state == ImprovementPlanStateStatus.DELETING_PLAN,
);
