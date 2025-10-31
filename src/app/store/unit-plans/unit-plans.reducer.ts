import { createReducer, on } from '@ngrx/store';
import * as UnitPlansActions from './unit-plans.actions';
import {
	initialUnitPlansState,
	UnitPlanStateStatus,
} from './unit-plans.models';

export const unitPlansReducer = createReducer(
	initialUnitPlansState,

	// Set status for ongoing operations
	on(UnitPlansActions.loadUnitPlan, (state) => ({
		...state,
		status: UnitPlanStateStatus.LOADING_PLAN,
	})),
	on(UnitPlansActions.loadUnitPlans, UnitPlansActions.countUnitPlans, (state) => ({
		...state,
		status: UnitPlanStateStatus.LOADING_PLANS,
	})),
	on(UnitPlansActions.createUnitPlan, (state) => ({
		...state,
		status: UnitPlanStateStatus.CREATING_PLAN,
	})),
	on(UnitPlansActions.updateUnitPlan, (state) => ({
		...state,
		status: UnitPlanStateStatus.UPDATING_PLAN,
	})),
	on(UnitPlansActions.deleteUnitPlan, (state) => ({
		...state,
		status: UnitPlanStateStatus.DELETING_PLAN,
	})),

	// Handle failure cases
	on(
		UnitPlansActions.loadUnitPlanFailed,
		UnitPlansActions.loadUnitPlansFailed,
		UnitPlansActions.countUnitPlansFailed,
		UnitPlansActions.createUnitPlanFailed,
		UnitPlansActions.updateUnitPlanFailed,
		UnitPlansActions.deleteUnitPlanFailed,
		UnitPlansActions.downloadUnitPlanFailed,
		(state, { error }) => ({
			...state,
			status: UnitPlanStateStatus.IDLING,
			error,
		}),
	),

	// Handle success cases
	on(UnitPlansActions.loadUnitPlanSuccess, (state, { plan }) => ({
		...state,
		status: UnitPlanStateStatus.IDLING,
		selectedPlan: plan,
	})),
	on(UnitPlansActions.loadUnitPlansSuccess, (state, { plans }) => ({
		...state,
		status: UnitPlanStateStatus.IDLING,
		unitPlans: plans,
	})),
	on(UnitPlansActions.countUnitPlansSuccess, (state, { plans }) => ({
		...state,
		status: UnitPlanStateStatus.IDLING,
		totalPlans: plans,
	})),
	on(UnitPlansActions.createUnitPlanSuccess, (state, { plan }) => ({
		...state,
		status: UnitPlanStateStatus.IDLING,
		unitPlans: [plan, ...state.unitPlans],
	})),
	on(UnitPlansActions.updateUnitPlanSuccess, (state, { plan }) => {
		const updatedPlan = plan;
		return {
			...state,
			status: UnitPlanStateStatus.IDLING,
			selectedPlan:
				state.selectedPlan?._id === updatedPlan._id
					? updatedPlan
					: state.selectedPlan,
			unitPlans: state.unitPlans.map((p) =>
				p._id === updatedPlan._id ? updatedPlan : p,
			),
		};
	}),
	on(UnitPlansActions.deleteUnitPlanSuccess, (state, { id }) => ({
		...state,
		status: UnitPlanStateStatus.IDLING,
		selectedPlan:
			state.selectedPlan?._id === id ? null : state.selectedPlan,
		unitPlans: state.unitPlans.filter((plan) => plan._id !== id),
	})),
);
