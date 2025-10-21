import { createReducer, on } from '@ngrx/store'
import * as UnitPlansActions from './unit-plans.actions'
import { initialUnitPlansState, UnitPlanStateStatus } from './unit-plans.models'

export const unitPlansReducer = createReducer(
    initialUnitPlansState,

    // Set status for ongoing operations
    on(UnitPlansActions.loadPlan, state => ({
        ...state,
        status: UnitPlanStateStatus.LOADING_PLAN,
    })),
    on(UnitPlansActions.loadPlans, UnitPlansActions.countPlans, state => ({
        ...state,
        status: UnitPlanStateStatus.LOADING_PLANS,
    })),
    on(UnitPlansActions.createPlan, state => ({
        ...state,
        status: UnitPlanStateStatus.CREATING_PLAN,
    })),
    on(UnitPlansActions.updatePlan, state => ({
        ...state,
        status: UnitPlanStateStatus.UPDATING_PLAN,
    })),
    on(UnitPlansActions.deletePlan, state => ({
        ...state,
        status: UnitPlanStateStatus.DELETING_PLAN,
    })),

    // Handle failure cases
    on(
        UnitPlansActions.loadPlanFailed,
        UnitPlansActions.loadPlansFailed,
        UnitPlansActions.countPlansFailed,
        UnitPlansActions.createPlanFailed,
        UnitPlansActions.updatePlanFailed,
        UnitPlansActions.deletePlanFailed,
        UnitPlansActions.downloadPlanFailed,
        (state, { error }) => ({ ...state, status: UnitPlanStateStatus.IDLING, error }),
    ),

    // Handle success cases
    on(UnitPlansActions.loadPlanSuccess, (state, { plan }) => ({
        ...state,
        status: UnitPlanStateStatus.IDLING,
        selectedPlan: plan,
    })),
    on(UnitPlansActions.loadPlansSuccess, (state, { plans }) => ({
        ...state,
        status: UnitPlanStateStatus.IDLING,
        unitPlans: plans,
    })),
    on(UnitPlansActions.countPlansSuccess, (state, { plans }) => ({
        ...state,
        status: UnitPlanStateStatus.IDLING,
        totalPlans: plans,
    })),
    on(UnitPlansActions.createPlanSuccess, (state, { plan }) => ({
        ...state,
        status: UnitPlanStateStatus.IDLING,
        unitPlans: [plan, ...state.unitPlans],
    })),
    on(UnitPlansActions.updatePlanSuccess, (state, { plan }) => {
        const updatedPlan = plan
        return {
            ...state,
            status: UnitPlanStateStatus.IDLING,
            selectedPlan:
                state.selectedPlan?._id === updatedPlan._id ? updatedPlan : state.selectedPlan,
            unitPlans: state.unitPlans.map(p => (p._id === updatedPlan._id ? updatedPlan : p)),
        }
    }),
    on(UnitPlansActions.deletePlanSuccess, (state, { id }) => ({
        ...state,
        status: UnitPlanStateStatus.IDLING,
        selectedPlan: state.selectedPlan?._id === id ? null : state.selectedPlan,
        unitPlans: state.unitPlans.filter(plan => plan._id !== id),
    })),
)