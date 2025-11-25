import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
	LogRegistryEntriesState,
	LogRegistryEntryStateStatus,
} from './log-registry-entries.models';

export const selectLogRegistryEntriesState =
	createFeatureSelector<LogRegistryEntriesState>('logRegistryEntries');

export const selectAllEntries = createSelector(
	selectLogRegistryEntriesState,
	(state) => state.entries,
);

export const selectCurrentEntry = createSelector(
	selectLogRegistryEntriesState,
	(state) => state.selectedEntry,
);

export const selectEntriesStatus = createSelector(
	selectLogRegistryEntriesState,
	(state) => state.status,
);

export const selectEntriesError = createSelector(
	selectLogRegistryEntriesState,
	(state) => state.error,
);

// Selectores de estado booleanos
export const selectIsLoadingMany = createSelector(
	selectEntriesStatus,
	(status) => status === LogRegistryEntryStateStatus.LOADING_ENTRIES,
);

export const selectIsLoadingOne = createSelector(
	selectEntriesStatus,
	(status) => status === LogRegistryEntryStateStatus.LOADING_ENTRY,
);

export const selectIsCreating = createSelector(
	selectEntriesStatus,
	(status) => status === LogRegistryEntryStateStatus.CREATING_ENTRY,
);

export const selectIsUpdating = createSelector(
	selectEntriesStatus,
	(status) => status === LogRegistryEntryStateStatus.UPDATING_ENTRY,
);

export const selectIsDeleting = createSelector(
	selectEntriesStatus,
	(status) => status === LogRegistryEntryStateStatus.DELETING_ENTRY,
);
