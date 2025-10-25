import { createAction, props } from '@ngrx/store';
import { CompetenceEntry } from '../../core/models';
import { CompetenceEntryDto } from './competence-entries.models';

// Load a single entry
export const loadEntry = createAction(
	'[Competence Entries] Load Entry',
	props<{ id: string }>(),
);
export const loadEntrySuccess = createAction(
	'[Competence Entries] Load Entry Success',
	props<{ entry: CompetenceEntry }>(),
);
export const loadEntryFailed = createAction(
	'[Competence Entries] Load Entry Failed',
	props<{ error: string }>(),
);

// Load all entries
export const loadEntries = createAction('[Competence Entries] Load Entries',
	props<{ filters: any }>(),
);
export const loadEntriesSuccess = createAction(
	'[Competence Entries] Load Entries Success',
	props<{ entries: CompetenceEntry[] }>(),
);
export const loadEntriesFailed = createAction(
	'[Competence Entries] Load Entries Failed',
	props<{ error: string }>(),
);

// Create an entry
export const createEntry = createAction(
	'[Competence Entries] Create Entry',
	props<{ entry: Partial<CompetenceEntryDto> }>(),
);
export const createEntrySuccess = createAction(
	'[Competence Entries] Create Entry Success',
	props<{ entry: CompetenceEntry }>(),
);
export const createEntryFailed = createAction(
	'[Competence Entries] Create Entry Failed',
	props<{ error: string }>(),
);

// Update an entry
export const updateEntry = createAction(
	'[Competence Entries] Update Entry',
	props<{ id: string; data: Partial<CompetenceEntryDto> }>(),
);
export const updateEntrySuccess = createAction(
	'[Competence Entries] Update Entry Success',
	props<{ entry: CompetenceEntry }>(),
);
export const updateEntryFailed = createAction(
	'[Competence Entries] Update Entry Failed',
	props<{ error: string }>(),
);

// Delete an entry
export const deleteEntry = createAction(
	'[Competence Entries] Delete Entry',
	props<{ id: string }>(),
);
export const deleteEntrySuccess = createAction(
	'[Competence Entries] Delete Entry Success',
	props<{ id: string }>(),
);
export const deleteEntryFailed = createAction(
	'[Competence Entries] Delete Entry Failed',
	props<{ error: string }>(),
);
