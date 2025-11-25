import { createReducer, on } from '@ngrx/store';
import * as DidacticPlansActions from './didactic-sequence-plans.actions';
import {
	initialDidacticPlansState,
	DidacticPlanStateStatus,
} from './didactic-sequence-plans.models';

export const DidacticPlansReducer = createReducer(
	initialDidacticPlansState,

	// Set status for ongoing operations
	on(DidacticPlansActions.loadSequencePlan, (state) => ({
		...state,
		status: DidacticPlanStateStatus.LOADING_PLAN,
	})),
	on(DidacticPlansActions.loadSequencePlans, (state) => ({
		...state,
		status: DidacticPlanStateStatus.LOADING_PLANS,
	})),
	on(DidacticPlansActions.createSequencePlan, (state) => ({
		...state,
		status: DidacticPlanStateStatus.CREATING_PLAN,
	})),
	on(DidacticPlansActions.updateSequencePlan, (state) => ({
		...state,
		status: DidacticPlanStateStatus.UPDATING_PLAN,
	})),
	on(DidacticPlansActions.deleteSequencePlan, (state) => ({
		...state,
		status: DidacticPlanStateStatus.DELETING_PLAN,
	})),

	// Handle failure cases
	on(
		DidacticPlansActions.loadSequencePlanFailed,
		DidacticPlansActions.loadSequencePlansFailed,
		DidacticPlansActions.createSequencePlanFailed,
		DidacticPlansActions.updateSequencePlanFailed,
		DidacticPlansActions.deleteSequencePlanFailed,
		(state, { error }) => ({
			...state,
			status: DidacticPlanStateStatus.IDLING,
			error,
		}),
	),

	// Handle success cases
	on(DidacticPlansActions.loadSequencePlanSuccess, (state, { plan }) => ({
		...state,
		status: DidacticPlanStateStatus.IDLING,
		selectedPlan: plan,
	})),
	on(DidacticPlansActions.loadSequencePlansSuccess, (state, { plans }) => ({
		...state,
		status: DidacticPlanStateStatus.IDLING,
		plans,
	})),
	on(DidacticPlansActions.createSequencePlanSuccess, (state, { plan }) => ({
		...state,
		status: DidacticPlanStateStatus.IDLING,
		plans: [plan, ...state.plans],
	})),
	on(
		DidacticPlansActions.updateSequencePlanSuccess,
		(state, { plan: updatedPlan }) => ({
			...state,
			status: DidacticPlanStateStatus.IDLING,
			selectedPlan:
				state.selectedPlan?._id === updatedPlan._id
					? updatedPlan
					: state.selectedPlan,
			plans: state.plans.map((p) =>
				p._id === updatedPlan._id ? updatedPlan : p,
			),
		}),
	),
	on(DidacticPlansActions.deleteSequencePlanSuccess, (state, { id }) => ({
		...state,
		status: DidacticPlanStateStatus.IDLING,
		selectedPlan:
			state.selectedPlan?._id === id ? null : state.selectedPlan,
		plans: state.plans.filter((p) => p._id !== id),
	})),
);
