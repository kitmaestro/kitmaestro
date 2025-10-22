import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
	CompetenceEntriesState,
	CompetenceEntryStateStatus,
} from './competence-entries.models';

export const selectCompetenceEntriesState =
	createFeatureSelector<CompetenceEntriesState>('competenceEntries');

export const selectAllCompetenceEntries = createSelector(
	selectCompetenceEntriesState,
	(state) => state.entries,
);

export const selectCurrentEntry = createSelector(
	selectCompetenceEntriesState,
	(state) => state.selectedEntry,
);

export const selectCompetenceEntriesStatus = createSelector(
	selectCompetenceEntriesState,
	(state) => state.status,
);

export const selectCompetenceEntriesError = createSelector(
	selectCompetenceEntriesState,
	(state) => state.error,
);

// Selectores de estado booleanos
export const selectIsLoadingMany = createSelector(
	selectCompetenceEntriesStatus,
	(status) => status === CompetenceEntryStateStatus.LOADING_ENTRIES,
);

export const selectIsLoadingOne = createSelector(
	selectCompetenceEntriesStatus,
	(status) => status === CompetenceEntryStateStatus.LOADING_ENTRY,
);

export const selectIsCreating = createSelector(
	selectCompetenceEntriesStatus,
	(status) => status === CompetenceEntryStateStatus.CREATING_ENTRY,
);

export const selectIsUpdating = createSelector(
	selectCompetenceEntriesStatus,
	(status) => status === CompetenceEntryStateStatus.UPDATING_ENTRY,
);

export const selectIsDeleting = createSelector(
	selectCompetenceEntriesStatus,
	(status) => status === CompetenceEntryStateStatus.DELETING_ENTRY,
);
