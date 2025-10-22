import { createAction, props } from '@ngrx/store'
import { LogRegistryEntry } from '../../core/models'
import { LogRegistryEntryDto } from './log-registry-entries.models'

// Load a single entry
export const loadLogRegistryEntry = createAction(
    '[Log Registry Entries] Load Entry',
    props<{ id: string }>(),
)
export const loadLogRegistryEntrySuccess = createAction(
    '[Log Registry Entries] Load Entry Success',
    props<{ entry: LogRegistryEntry }>(),
)
export const loadLogRegistryEntryFailed = createAction(
    '[Log Registry Entries] Load Entry Failed',
    props<{ error: string }>(),
)

// Load all entries
export const loadLogRegistryEntries = createAction('[Log Registry Entries] Load Entries')
export const loadLogRegistryEntriesSuccess = createAction(
    '[Log Registry Entries] Load Entries Success',
    props<{ entries: LogRegistryEntry[] }>(),
)
export const loadLogRegistryEntriesFailed = createAction(
    '[Log Registry Entries] Load Entries Failed',
    props<{ error: string }>(),
)

// Create an entry
export const createLogRegistryEntry = createAction(
    '[Log Registry Entries] Create Entry',
    props<{ entry: Partial<LogRegistryEntryDto> }>(),
)
export const createLogRegistryEntrySuccess = createAction(
    '[Log Registry Entries] Create Entry Success',
    props<{ entry: LogRegistryEntry }>(),
)
export const createLogRegistryEntryFailed = createAction(
    '[Log Registry Entries] Create Entry Failed',
    props<{ error: string }>(),
)

// Update an entry
export const updateLogRegistryEntry = createAction(
    '[Log Registry Entries] Update Entry',
    props<{ id: string; data: Partial<LogRegistryEntryDto> }>(),
)
export const updateLogRegistryEntrySuccess = createAction(
    '[Log Registry Entries] Update Entry Success',
    props<{ entry: LogRegistryEntry }>(),
)
export const updateLogRegistryEntryFailed = createAction(
    '[Log Registry Entries] Update Entry Failed',
    props<{ error: string }>(),
)

// Delete an entry
export const deleteLogRegistryEntry = createAction(
    '[Log Registry Entries] Delete Entry',
    props<{ id: string }>(),
)
export const deleteLogRegistryEntrySuccess = createAction(
    '[Log Registry Entries] Delete Entry Success',
    props<{ id: string }>(),
)
export const deleteLogRegistryEntryFailed = createAction(
    '[Log Registry Entries] Delete Entry Failed',
    props<{ error: string }>(),
)
