import { LogRegistryEntry } from '../../core/models'

export interface LogRegistryEntryDto {
    user: string
    date: Date | string
    section: string
    place: string
    students: string[]
    description: string
    comments: string
    type: string
}

export enum LogRegistryEntryStateStatus {
    IDLING,
    LOADING_ENTRIES,
    LOADING_ENTRY,
    CREATING_ENTRY,
    UPDATING_ENTRY,
    DELETING_ENTRY,
}

export interface LogRegistryEntriesState {
    entries: LogRegistryEntry[]
    selectedEntry: LogRegistryEntry | null
    error: string | null
    status: LogRegistryEntryStateStatus
}

export const initialLogRegistryEntriesState: LogRegistryEntriesState = {
    entries: [],
    selectedEntry: null,
    error: null,
    status: LogRegistryEntryStateStatus.IDLING,
}
