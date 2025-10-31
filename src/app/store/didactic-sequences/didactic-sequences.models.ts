import { DidacticSequence } from '../../core/models'
import { DidacticSequencePlan, TableOfContentsItem } from '../../core'
import { SchoolLevel, SchoolSubject, SchoolYear } from '../../core/types'

export interface DidacticSequenceDto {
    level: SchoolLevel
    year: SchoolYear
    subject: SchoolSubject
    tableOfContents: TableOfContentsItem[]
    plans: DidacticSequencePlan[]
}

export enum DidacticSequenceStateStatus {
    IDLING,
    LOADING_SEQUENCES,
    LOADING_SEQUENCE,
    CREATING_SEQUENCE,
    UPDATING_SEQUENCE,
    DELETING_SEQUENCE,
}

export interface DidacticSequencesState {
    sequences: DidacticSequence[]
    selectedSequence: DidacticSequence | null
    error: string | null
    status: DidacticSequenceStateStatus
}

export const initialDidacticSequencesState: DidacticSequencesState = {
    sequences: [],
    selectedSequence: null,
    error: null,
    status: DidacticSequenceStateStatus.IDLING,
}
