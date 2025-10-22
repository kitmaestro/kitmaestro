import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
	ScoreSystemsState,
	ScoreSystemStateStatus,
} from './score-systems.models';

export const selectScoreSystemsState =
	createFeatureSelector<ScoreSystemsState>('scoreSystems');

export const selectAllSystems = createSelector(
	selectScoreSystemsState,
	(state) => state.systems,
);

export const selectCurrentSystem = createSelector(
	selectScoreSystemsState,
	(state) => state.selectedSystem,
);

export const selectSystemsStatus = createSelector(
	selectScoreSystemsState,
	(state) => state.status,
);

export const selectSystemsError = createSelector(
	selectScoreSystemsState,
	(state) => state.error,
);

// Selectores de estado booleanos
export const selectIsLoadingMany = createSelector(
	selectSystemsStatus,
	(status) => status === ScoreSystemStateStatus.LOADING_SYSTEMS,
);

export const selectIsLoadingOne = createSelector(
	selectSystemsStatus,
	(status) => status === ScoreSystemStateStatus.LOADING_SYSTEM,
);

export const selectIsCreating = createSelector(
	selectSystemsStatus,
	(status) => status === ScoreSystemStateStatus.CREATING_SYSTEM,
);

export const selectIsUpdating = createSelector(
	selectSystemsStatus,
	(status) => status === ScoreSystemStateStatus.UPDATING_SYSTEM,
);

export const selectIsDeleting = createSelector(
	selectSystemsStatus,
	(status) => status === ScoreSystemStateStatus.DELETING_SYSTEM,
);
