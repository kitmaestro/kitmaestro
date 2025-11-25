import { createReducer, on } from '@ngrx/store';
import * as LogRegistryEntriesActions from './log-registry-entries.actions';
import {
	initialLogRegistryEntriesState,
	LogRegistryEntryStateStatus,
} from './log-registry-entries.models';

export const logRegistryEntriesReducer = createReducer(
	initialLogRegistryEntriesState,

	// Set status for ongoing operations
	on(LogRegistryEntriesActions.loadLogRegistryEntry, (state) => ({
		...state,
		status: LogRegistryEntryStateStatus.LOADING_ENTRY,
	})),
	on(LogRegistryEntriesActions.loadLogRegistryEntries, (state) => ({
		...state,
		status: LogRegistryEntryStateStatus.LOADING_ENTRIES,
	})),
	on(LogRegistryEntriesActions.createLogRegistryEntry, (state) => ({
		...state,
		status: LogRegistryEntryStateStatus.CREATING_ENTRY,
	})),
	on(LogRegistryEntriesActions.updateLogRegistryEntry, (state) => ({
		...state,
		status: LogRegistryEntryStateStatus.UPDATING_ENTRY,
	})),
	on(LogRegistryEntriesActions.deleteLogRegistryEntry, (state) => ({
		...state,
		status: LogRegistryEntryStateStatus.DELETING_ENTRY,
	})),

	// Handle failure cases
	on(
		LogRegistryEntriesActions.loadLogRegistryEntryFailed,
		LogRegistryEntriesActions.loadLogRegistryEntriesFailed,
		LogRegistryEntriesActions.createLogRegistryEntryFailed,
		LogRegistryEntriesActions.updateLogRegistryEntryFailed,
		LogRegistryEntriesActions.deleteLogRegistryEntryFailed,
		(state, { error }) => ({
			...state,
			status: LogRegistryEntryStateStatus.IDLING,
			error,
		}),
	),

	// Handle success cases
	on(
		LogRegistryEntriesActions.loadLogRegistryEntrySuccess,
		(state, { entry }) => ({
			...state,
			status: LogRegistryEntryStateStatus.IDLING,
			selectedEntry: entry,
		}),
	),
	on(
		LogRegistryEntriesActions.loadLogRegistryEntriesSuccess,
		(state, { entries }) => ({
			...state,
			status: LogRegistryEntryStateStatus.IDLING,
			entries,
		}),
	),
	on(
		LogRegistryEntriesActions.createLogRegistryEntrySuccess,
		(state, { entry }) => ({
			...state,
			status: LogRegistryEntryStateStatus.IDLING,
			entries: [entry, ...state.entries],
		}),
	),
	on(
		LogRegistryEntriesActions.updateLogRegistryEntrySuccess,
		(state, { entry: updatedEntry }) => ({
			...state,
			status: LogRegistryEntryStateStatus.IDLING,
			selectedEntry:
				state.selectedEntry?._id === updatedEntry._id
					? updatedEntry
					: state.selectedEntry,
			entries: state.entries.map((e) =>
				e._id === updatedEntry._id ? updatedEntry : e,
			),
		}),
	),
	on(
		LogRegistryEntriesActions.deleteLogRegistryEntrySuccess,
		(state, { id }) => ({
			...state,
			status: LogRegistryEntryStateStatus.IDLING,
			selectedEntry:
				state.selectedEntry?._id === id ? null : state.selectedEntry,
			entries: state.entries.filter((e) => e._id !== id),
		}),
	),
);
