import { createReducer, on } from '@ngrx/store';
import * as ScoreSystemsActions from './score-systems.actions';
import {
	initialScoreSystemsState,
	ScoreSystemStateStatus,
} from './score-systems.models';

export const scoreSystemsReducer = createReducer(
	initialScoreSystemsState,

	// Set status for ongoing operations
	on(ScoreSystemsActions.loadSystem, (state) => ({
		...state,
		status: ScoreSystemStateStatus.LOADING_SYSTEM,
	})),
	on(ScoreSystemsActions.loadSystems, (state) => ({
		...state,
		status: ScoreSystemStateStatus.LOADING_SYSTEMS,
	})),
	on(ScoreSystemsActions.createSystem, (state) => ({
		...state,
		status: ScoreSystemStateStatus.CREATING_SYSTEM,
	})),
	on(ScoreSystemsActions.updateSystem, (state) => ({
		...state,
		status: ScoreSystemStateStatus.UPDATING_SYSTEM,
	})),
	on(ScoreSystemsActions.deleteSystem, (state) => ({
		...state,
		status: ScoreSystemStateStatus.DELETING_SYSTEM,
	})),

	// Handle failure cases
	on(
		ScoreSystemsActions.loadSystemFailed,
		ScoreSystemsActions.loadSystemsFailed,
		ScoreSystemsActions.createSystemFailed,
		ScoreSystemsActions.updateSystemFailed,
		ScoreSystemsActions.deleteSystemFailed,
		(state, { error }) => ({
			...state,
			status: ScoreSystemStateStatus.IDLING,
			error,
		}),
	),

	// Handle success cases
	on(ScoreSystemsActions.loadSystemSuccess, (state, { system }) => ({
		...state,
		status: ScoreSystemStateStatus.IDLING,
		selectedSystem: system,
	})),
	on(ScoreSystemsActions.loadSystemsSuccess, (state, { systems }) => ({
		...state,
		status: ScoreSystemStateStatus.IDLING,
		systems,
	})),
	on(ScoreSystemsActions.createSystemSuccess, (state, { system }) => ({
		...state,
		status: ScoreSystemStateStatus.IDLING,
		systems: [system, ...state.systems],
	})),
	on(
		ScoreSystemsActions.updateSystemSuccess,
		(state, { system: updatedSystem }) => ({
			...state,
			status: ScoreSystemStateStatus.IDLING,
			selectedSystem:
				state.selectedSystem?._id === updatedSystem._id
					? updatedSystem
					: state.selectedSystem,
			systems: state.systems.map((s) =>
				s._id === updatedSystem._id ? updatedSystem : s,
			),
		}),
	),
	on(ScoreSystemsActions.deleteSystemSuccess, (state, { id }) => ({
		...state,
		status: ScoreSystemStateStatus.IDLING,
		selectedSystem:
			state.selectedSystem?._id === id ? null : state.selectedSystem,
		systems: state.systems.filter((s) => s._id !== id),
	})),
);
