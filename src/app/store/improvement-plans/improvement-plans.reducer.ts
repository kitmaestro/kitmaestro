import { createReducer, on } from '@ngrx/store';
import * as ImprovementPlansActions from './improvement-plans.actions';
import {
  initialImprovementPlansState,
  ImprovementPlanStateStatus,
} from './improvement-plans.models';

export const improvementPlansReducer = createReducer(
  initialImprovementPlansState,

  // Set status for ongoing operations
  on(ImprovementPlansActions.loadImprovementPlan, (state) => ({
    ...state,
    status: ImprovementPlanStateStatus.LOADING_PLAN,
  })),
  on(
    ImprovementPlansActions.loadImprovementPlans,
    (state) => ({
      ...state,
      status: ImprovementPlanStateStatus.LOADING_PLANS,
    }),
  ),
  on(ImprovementPlansActions.createImprovementPlan, (state) => ({
    ...state,
    status: ImprovementPlanStateStatus.CREATING_PLAN,
  })),
  on(ImprovementPlansActions.updateImprovementPlan, (state) => ({
    ...state,
    status: ImprovementPlanStateStatus.UPDATING_PLAN,
  })),
  on(ImprovementPlansActions.deleteImprovementPlan, (state) => ({
    ...state,
    status: ImprovementPlanStateStatus.DELETING_PLAN,
  })),

  // Handle failure cases
  on(
    ImprovementPlansActions.loadImprovementPlanFailed,
    ImprovementPlansActions.loadImprovementPlansFailed,
    ImprovementPlansActions.createImprovementPlanFailed,
    ImprovementPlansActions.updateImprovementPlanFailed,
    ImprovementPlansActions.deleteImprovementPlanFailed,
    (state, { error }) => ({
      ...state,
      status: ImprovementPlanStateStatus.IDLING,
      error,
    }),
  ),

  // Handle success cases
  on(ImprovementPlansActions.loadImprovementPlanSuccess, (state, { plan }) => ({
    ...state,
    status: ImprovementPlanStateStatus.IDLING,
    selectedPlan: plan,
  })),
  on(ImprovementPlansActions.loadImprovementPlansSuccess, (state, { plans }) => ({
    ...state,
    status: ImprovementPlanStateStatus.IDLING,
    improvementPlans: plans,
  })),
  on(ImprovementPlansActions.createImprovementPlanSuccess, (state, { plan }) => ({
    ...state,
    status: ImprovementPlanStateStatus.IDLING,
    improvementPlans: [plan, ...state.improvementPlans],
  })),
  on(ImprovementPlansActions.updateImprovementPlanSuccess, (state, { plan }) => {
    const updatedPlan = plan;
    return {
      ...state,
      status: ImprovementPlanStateStatus.IDLING,
      selectedPlan:
        state.selectedPlan?.id === updatedPlan.id
          ? updatedPlan
          : state.selectedPlan,
      improvementPlans: state.improvementPlans.map((p) =>
        p.id === updatedPlan.id ? updatedPlan : p,
      ),
    };
  }),
  on(ImprovementPlansActions.deleteImprovementPlanSuccess, (state, { id }) => ({
    ...state,
    status: ImprovementPlanStateStatus.IDLING,
    selectedPlan:
      state.selectedPlan?.id === id ? null : state.selectedPlan,
    improvementPlans: state.improvementPlans.filter((plan) => plan.id !== id),
  })),
);
