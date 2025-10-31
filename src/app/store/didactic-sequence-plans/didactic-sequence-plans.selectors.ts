import { createFeatureSelector, createSelector } from '@ngrx/store'
import {
    DidacticSequencePlansState,
    DidacticSequencePlanStateStatus,
} from './didactic-sequence-plans.models'

export const selectDidacticSequencePlansState =
    createFeatureSelector<DidacticSequencePlansState>('didacticSequencePlans')

export const selectAllPlans = createSelector(
    selectDidacticSequencePlansState,
    state => state.plans,
)

export const selectCurrentPlan = createSelector(
    selectDidacticSequencePlansState,
    state => state.selectedPlan,
)

export const selectPlansStatus = createSelector(
    selectDidacticSequencePlansState,
    state => state.status,
)

export const selectPlansError = createSelector(
    selectDidacticSequencePlansState,
    state => state.error,
)

// Selectores de estado booleanos
export const selectIsLoadingMany = createSelector(
    selectPlansStatus,
    status => status === DidacticSequencePlanStateStatus.LOADING_PLANS,
)

export const selectIsLoadingOne = createSelector(
    selectPlansStatus,
    status => status === DidacticSequencePlanStateStatus.LOADING_PLAN,
)

export const selectIsCreating = createSelector(
    selectPlansStatus,
    status => status === DidacticSequencePlanStateStatus.CREATING_PLAN,
)

export const selectIsUpdating = createSelector(
    selectPlansStatus,
    status => status === DidacticSequencePlanStateStatus.UPDATING_PLAN,
)

export const selectIsDeleting = createSelector(
    selectPlansStatus,
    status => status === DidacticSequencePlanStateStatus.DELETING_PLAN,
)
