import { createReducer, on } from '@ngrx/store';
import * as CompetenceEntriesActions from './competence-entries.actions';
import {
	initialCompetenceEntriesState,
	CompetenceEntryStateStatus,
} from './competence-entries.models';

export const competenceEntriesReducer = createReducer(
	initialCompetenceEntriesState,

	// Set status for ongoing operations
	on(CompetenceEntriesActions.loadEntry, (state) => ({
		...state,
		status: CompetenceEntryStateStatus.LOADING_ENTRY,
	})),
	on(CompetenceEntriesActions.loadEntries, (state) => ({
		...state,
		status: CompetenceEntryStateStatus.LOADING_ENTRIES,
	})),
	on(CompetenceEntriesActions.createEntry, (state) => ({
		...state,
		status: CompetenceEntryStateStatus.CREATING_ENTRY,
	})),
	on(CompetenceEntriesActions.updateEntry, (state) => ({
		...state,
		status: CompetenceEntryStateStatus.UPDATING_ENTRY,
	})),
	on(CompetenceEntriesActions.deleteEntry, (state) => ({
		...state,
		status: CompetenceEntryStateStatus.DELETING_ENTRY,
	})),

	// Handle failure cases
	on(
		CompetenceEntriesActions.loadEntryFailed,
		CompetenceEntriesActions.loadEntriesFailed,
		CompetenceEntriesActions.createEntryFailed,
		CompetenceEntriesActions.updateEntryFailed,
		CompetenceEntriesActions.deleteEntryFailed,
		(state, { error }) => ({
			...state,
			status: CompetenceEntryStateStatus.IDLING,
			error,
		}),
	),

	// Handle success cases
	on(CompetenceEntriesActions.loadEntrySuccess, (state, { entry }) => ({
		...state,
		status: CompetenceEntryStateStatus.IDLING,
		selectedEntry: entry,
	})),
	on(CompetenceEntriesActions.loadEntriesSuccess, (state, { entries }) => ({
		...state,
		status: CompetenceEntryStateStatus.IDLING,
		entries,
	})),
	on(CompetenceEntriesActions.createEntrySuccess, (state, { entry }) => ({
		...state,
		status: CompetenceEntryStateStatus.IDLING,
		entries: [entry, ...state.entries],
	})),
	on(
		CompetenceEntriesActions.updateEntrySuccess,
		(state, { entry: updatedEntry }) => ({
			...state,
			status: CompetenceEntryStateStatus.IDLING,
			selectedEntry:
				state.selectedEntry?._id === updatedEntry._id
					? updatedEntry
					: state.selectedEntry,
			entries: state.entries.map((e) =>
				e._id === updatedEntry._id ? updatedEntry : e,
			),
		}),
	),
	on(CompetenceEntriesActions.deleteEntrySuccess, (state, { id }) => ({
		...state,
		status: CompetenceEntryStateStatus.IDLING,
		selectedEntry:
			state.selectedEntry?._id === id ? null : state.selectedEntry,
		entries: state.entries.filter((e) => e._id !== id),
	})),
);
