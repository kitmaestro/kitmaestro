import { createReducer, on } from '@ngrx/store';
import * as RecoveryPlansActions from './recovery-plans.actions';
import {
	initialRecoveryPlanState,
	RecoveryPlanStateStatus,
} from './recovery-plans.models';

export const recoveryPlansReducer = createReducer(
	initialRecoveryPlanState,

	// Set status for ongoing operations
	on(RecoveryPlansActions.loadRecoveryPlan, (state) => ({
		...state,
		status: RecoveryPlanStateStatus.LOADING_RECOVERY_PLAN,
	})),
	on(RecoveryPlansActions.loadRecoveryPlans, (state) => ({
		...state,
		status: RecoveryPlanStateStatus.LOADING_RECOVERY_PLANS,
	})),
	on(RecoveryPlansActions.createRecoveryPlan, (state) => ({
		...state,
		status: RecoveryPlanStateStatus.CREATING_RECOVERY_PLAN,
	})),
	on(RecoveryPlansActions.updateRecoveryPlan, (state) => ({
		...state,
		status: RecoveryPlanStateStatus.UPDATING_RECOVERY_PLAN,
	})),
	on(RecoveryPlansActions.deleteRecoveryPlan, (state) => ({
		...state,
		status: RecoveryPlanStateStatus.DELETING_RECOVERY_PLAN,
	})),
	on(RecoveryPlansActions.downloadRecoveryPlan, (state) => ({
		...state,
		status: RecoveryPlanStateStatus.DOWNLOADING_RECOVERY_PLAN,
	})),

	// Handle failure cases
	on(
		RecoveryPlansActions.loadRecoveryPlanFailed,
		RecoveryPlansActions.loadRecoveryPlansFailed,
		RecoveryPlansActions.createRecoveryPlanFailed,
		RecoveryPlansActions.updateRecoveryPlanFailed,
		RecoveryPlansActions.deleteRecoveryPlanFailed,
		RecoveryPlansActions.downloadRecoveryPlanFailure,
		(state, { error }) => ({
			...state,
			status: RecoveryPlanStateStatus.IDLING,
			error,
		}),
	),

	// Handle success cases
	on(
		RecoveryPlansActions.loadRecoveryPlanSuccess,
		(state, { recoveryPlan }) => ({
			...state,
			status: RecoveryPlanStateStatus.IDLING,
			selectedRecoveryPlan: recoveryPlan,
		}),
	),
	on(
		RecoveryPlansActions.loadRecoveryPlansSuccess,
		(state, { recoveryPlans }) => ({
			...state,
			status: RecoveryPlanStateStatus.IDLING,
			recoveryPlans,
		}),
	),
	on(
		RecoveryPlansActions.createRecoveryPlanSuccess,
		(state, { recoveryPlan }) => ({
			...state,
			status: RecoveryPlanStateStatus.IDLING,
			recoveryPlans: [recoveryPlan, ...state.recoveryPlans],
		}),
	),
	on(
		RecoveryPlansActions.updateRecoveryPlanSuccess,
		(state, { recoveryPlan: updatedRecoveryPlan }) => ({
			...state,
			status: RecoveryPlanStateStatus.IDLING,
			selectedRecoveryPlan:
				state.selectedRecoveryPlan?._id === updatedRecoveryPlan._id
					? updatedRecoveryPlan
					: state.selectedRecoveryPlan,
			recoveryPlans: state.recoveryPlans.map((e) =>
				e._id === updatedRecoveryPlan._id ? updatedRecoveryPlan : e,
			),
		}),
	),
	on(RecoveryPlansActions.deleteRecoveryPlanSuccess, (state, { id }) => ({
		...state,
		status: RecoveryPlanStateStatus.IDLING,
		selectedRecoveryPlan:
			state.selectedRecoveryPlan?._id === id
				? null
				: state.selectedRecoveryPlan,
		recoveryPlans: state.recoveryPlans.filter((e) => e._id !== id),
	})),
	on(RecoveryPlansActions.downloadRecoveryPlanSuccess, (state) => ({
		...state,
		status: RecoveryPlanStateStatus.IDLING,
	})),
);
