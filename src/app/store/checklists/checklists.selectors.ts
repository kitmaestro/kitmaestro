import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ChecklistsState } from './checklists.models';

export const selectChecklistsState =
	createFeatureSelector<ChecklistsState>('checklists');

export const selectAllChecklists = createSelector(
	selectChecklistsState,
	(state) => state.checklists,
);

export const selectCurrentChecklist = createSelector(
	selectChecklistsState,
	(state) => state.selectedChecklist,
);

export const selectChecklistsStatus = createSelector(
	selectChecklistsState,
	(state) => state.status,
);

export const selectChecklistsError = createSelector(
	selectChecklistsState,
	(state) => state.error,
);
