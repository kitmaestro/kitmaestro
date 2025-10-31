import { createReducer, on } from '@ngrx/store'
import * as DidacticSequencePlansActions from './didactic-sequence-plans.actions'
import {
    initialDidacticSequencePlansState,
    DidacticSequencePlanStateStatus,
} from './didactic-sequence-plans.models'

export const didacticSequencePlansReducer = createReducer(
    initialDidacticSequencePlansState,

    // Set status for ongoing operations
    on(DidacticSequencePlansActions.loadPlan, state => ({
        ...state,
        status: DidacticSequencePlanStateStatus.LOADING_PLAN,
    })),
    on(DidacticSequencePlansActions.loadPlans, state => ({
        ...state,
        status: DidacticSequencePlanStateStatus.LOADING_PLANS,
    })),
    on(DidacticSequencePlansActions.createPlan, state => ({
        ...state,
        status: DidacticSequencePlanStateStatus.CREATING_PLAN,
    })),
    on(DidacticSequencePlansActions.updatePlan, state => ({
        ...state,
        status: DidacticSequencePlanStateStatus.UPDATING_PLAN,
    })),
    on(DidacticSequencePlansActions.deletePlan, state => ({
        ...state,
        status: DidacticSequencePlanStateStatus.DELETING_PLAN,
    })),

    // Handle failure cases
    on(
        DidacticSequencePlansActions.loadPlanFailed,
        DidacticSequencePlansActions.loadPlansFailed,
        DidacticSequencePlansActions.createPlanFailed,
        DidacticSequencePlansActions.updatePlanFailed,
        DidacticSequencePlansActions.deletePlanFailed,
        (state, { error }) => ({ ...state, status: DidacticSequencePlanStateStatus.IDLING, error }),
    ),

    // Handle success cases
    on(DidacticSequencePlansActions.loadPlanSuccess, (state, { plan }) => ({
        ...state,
        status: DidacticSequencePlanStateStatus.IDLING,
        selectedPlan: plan,
    })),
    on(DidacticSequencePlansActions.loadPlansSuccess, (state, { plans }) => ({
        ...state,
        status: DidacticSequencePlanStateStatus.IDLING,
        plans,
    })),
    on(DidacticSequencePlansActions.createPlanSuccess, (state, { plan }) => ({
        ...state,
        status: DidacticSequencePlanStateStatus.IDLING,
        plans: [plan, ...state.plans],
    })),
    on(DidacticSequencePlansActions.updatePlanSuccess, (state, { plan: updatedPlan }) => ({
        ...state,
        status: DidacticSequencePlanStateStatus.IDLING,
        selectedPlan:
            state.selectedPlan?._id === updatedPlan._id ? updatedPlan : state.selectedPlan,
        plans: state.plans.map(p => (p._id === updatedPlan._id ? updatedPlan : p)),
    })),
    on(DidacticSequencePlansActions.deletePlanSuccess, (state, { id }) => ({
        ...state,
        status: DidacticSequencePlanStateStatus.IDLING,
        selectedPlan: state.selectedPlan?._id === id ? null : state.selectedPlan,
        plans: state.plans.filter(p => p._id !== id),
    })),
)
