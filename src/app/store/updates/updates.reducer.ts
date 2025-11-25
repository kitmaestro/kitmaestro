import { createReducer, on } from '@ngrx/store';
import * as UpdatesActions from './updates.actions';
import { initialUpdatesState, UpdateStateStatus } from './updates.models';

export const updatesReducer = createReducer(
	initialUpdatesState,

	// Set status for ongoing operations
	on(UpdatesActions.loadUpdate, (state) => ({
		...state,
		status: UpdateStateStatus.LOADING_UPDATE,
	})),
	on(UpdatesActions.loadUpdates, (state) => ({
		...state,
		status: UpdateStateStatus.LOADING_UPDATES,
	})),
	on(UpdatesActions.createUpdate, (state) => ({
		...state,
		status: UpdateStateStatus.CREATING_UPDATE,
	})),
	on(UpdatesActions.updateUpdate, (state) => ({
		...state,
		status: UpdateStateStatus.UPDATING_UPDATE,
	})),
	on(UpdatesActions.deleteUpdate, (state) => ({
		...state,
		status: UpdateStateStatus.DELETING_UPDATE,
	})),

	// Handle failure cases
	on(
		UpdatesActions.loadUpdateFailed,
		UpdatesActions.loadUpdatesFailed,
		UpdatesActions.createUpdateFailed,
		UpdatesActions.updateUpdateFailed,
		UpdatesActions.deleteUpdateFailed,
		(state, { error }) => ({
			...state,
			status: UpdateStateStatus.IDLING,
			error,
		}),
	),

	// Handle success cases
	on(UpdatesActions.loadUpdateSuccess, (state, { update }) => ({
		...state,
		status: UpdateStateStatus.IDLING,
		selectedUpdate: update,
	})),
	on(UpdatesActions.loadUpdatesSuccess, (state, { updates }) => ({
		...state,
		status: UpdateStateStatus.IDLING,
		updates,
	})),
	on(UpdatesActions.createUpdateSuccess, (state, { update }) => ({
		...state,
		status: UpdateStateStatus.IDLING,
		updates: [update, ...state.updates],
	})),
	on(
		UpdatesActions.updateUpdateSuccess,
		(state, { update: updatedUpdate }) => ({
			...state,
			status: UpdateStateStatus.IDLING,
			selectedUpdate:
				state.selectedUpdate?._id === updatedUpdate._id
					? updatedUpdate
					: state.selectedUpdate,
			updates: state.updates.map((u) =>
				u._id === updatedUpdate._id ? updatedUpdate : u,
			),
		}),
	),
	on(UpdatesActions.deleteUpdateSuccess, (state, { id }) => ({
		...state,
		status: UpdateStateStatus.IDLING,
		selectedUpdate:
			state.selectedUpdate?._id === id ? null : state.selectedUpdate,
		updates: state.updates.filter((u) => u._id !== id),
	})),
);
