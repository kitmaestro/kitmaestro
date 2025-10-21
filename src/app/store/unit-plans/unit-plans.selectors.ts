import { createFeatureSelector, createSelector } from '@ngrx/store'
import { UnitPlansState, UnitPlanStateStatus } from './unit-plans.models'

export const selectUnitPlansState = createFeatureSelector<UnitPlansState>('unitPlans')

export const selectAllUnitPlans = createSelector(
    selectUnitPlansState,
    state => state.unitPlans,
)

export const selectCurrentPlan = createSelector(
    selectUnitPlansState,
    state => state.selectedPlan,
)

export const selectUnitPlansStatus = createSelector(
    selectUnitPlansState,
    state => state.status,
)

export const selectUnitPlansError = createSelector(
    selectUnitPlansState,
    state => state.error,
)

export const selectTotalUnitPlans = createSelector(
    selectUnitPlansState,
    state => state.totalPlans
)

export const selectUnitPlansIsLoading = createSelector(
    selectUnitPlansStatus,
    state => state == UnitPlanStateStatus.LOADING_PLANS
)

export const selectUnitPlanIsLoading = createSelector(
    selectUnitPlansStatus,
    state => state == UnitPlanStateStatus.LOADING_PLAN
)

export const selectUnitPlanIsCreating = createSelector(
    selectUnitPlansStatus,
    state => state == UnitPlanStateStatus.CREATING_PLAN
)

export const selectUnitPlanIsUpdating = createSelector(
    selectUnitPlansStatus,
    state => state == UnitPlanStateStatus.UPDATING_PLAN
)

export const selectUnitPlanIsDeleting = createSelector(
    selectUnitPlansStatus,
    state => state == UnitPlanStateStatus.DELETING_PLAN
)
