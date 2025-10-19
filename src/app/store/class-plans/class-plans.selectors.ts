import { createFeatureSelector, createSelector } from '@ngrx/store'
import { ClassPlanState } from './class-plans.models'

export const selectClassPlanFeature = createFeatureSelector<ClassPlanState>('classPlans')

export const selectClassPlans = createSelector(
    selectClassPlanFeature,
    (state: ClassPlanState) => state.classPlans
)

export const selectSelectedClassPlan = createSelector(
    selectClassPlanFeature,
    (state: ClassPlanState) => state.selectedClassPlan
)

export const selectClassPlanError = createSelector(
    selectClassPlanFeature,
    (state: ClassPlanState) => state.error
)

export const selectClassPlanStatus = createSelector(
    selectClassPlanFeature,
    (state: ClassPlanState) => state.status
)
