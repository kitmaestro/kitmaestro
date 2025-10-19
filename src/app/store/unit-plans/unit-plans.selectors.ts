import { createFeatureSelector, createSelector } from '@ngrx/store'
import { UnitPlansState } from './unit-plans.models'

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
