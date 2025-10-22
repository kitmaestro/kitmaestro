import { CompetenceEntry } from '../../core/models'
import { GradeName, LevelName, SubjectName } from '../../core/types'

export interface CompetenceEntryDto {
    name: string
    grade: GradeName
    subject: SubjectName
    level: LevelName
    entries: string[]
    criteria: string[]
}

export enum CompetenceEntryStateStatus {
    IDLING,
    LOADING_ENTRIES,
    LOADING_ENTRY,
    CREATING_ENTRY,
    UPDATING_ENTRY,
    DELETING_ENTRY,
}

export interface CompetenceEntriesState {
    entries: CompetenceEntry[]
    selectedEntry: CompetenceEntry | null
    error: string | null
    status: CompetenceEntryStateStatus
}

export const initialCompetenceEntriesState: CompetenceEntriesState = {
    entries: [],
    selectedEntry: null,
    error: null,
    status: CompetenceEntryStateStatus.IDLING,
}
