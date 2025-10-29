import { createAction, props } from '@ngrx/store'
import { DidacticSequence } from '../../core/models'
import { DidacticSequenceDto } from './didactic-sequences.models'

// Load a single sequence
export const loadSequence = createAction(
    '[Didactic Sequences] Load Sequence',
    props<{ id: string }>(),
)
export const loadSequenceSuccess = createAction(
    '[Didactic Sequences] Load Sequence Success',
    props<{ sequence: DidacticSequence }>(),
)
export const loadSequenceFailed = createAction(
    '[Didactic Sequences] Load Sequence Failed',
    props<{ error: string }>(),
)

// Load all sequences
export const loadSequences = createAction(
    '[Didactic Sequences] Load Sequences',
    props<{ filters: any }>(),
)
export const loadSequencesSuccess = createAction(
    '[Didactic Sequences] Load Sequences Success',
    props<{ sequences: DidacticSequence[] }>(),
)
export const loadSequencesFailed = createAction(
    '[Didactic Sequences] Load Sequences Failed',
    props<{ error: string }>(),
)

// Create a sequence
export const createSequence = createAction(
    '[Didactic Sequences] Create Sequence',
    props<{ sequence: Partial<DidacticSequenceDto> }>(),
)
export const createSequenceSuccess = createAction(
    '[Didactic Sequences] Create Sequence Success',
    props<{ sequence: DidacticSequence }>(),
)
export const createSequenceFailed = createAction(
    '[Didactic Sequences] Create Sequence Failed',
    props<{ error: string }>(),
)

// Update a sequence
export const updateSequence = createAction(
    '[Didactic Sequences] Update Sequence',
    props<{ id: string; data: Partial<DidacticSequenceDto> }>(),
)
export const updateSequenceSuccess = createAction(
    '[Didactic Sequences] Update Sequence Success',
    props<{ sequence: DidacticSequence }>(),
)
export const updateSequenceFailed = createAction(
    '[Didactic Sequences] Update Sequence Failed',
    props<{ error: string }>(),
)

// Delete a sequence
export const deleteSequence = createAction(
    '[Didactic Sequences] Delete Sequence',
    props<{ id: string }>(),
)
export const deleteSequenceSuccess = createAction(
    '[Didactic Sequences] Delete Sequence Success',
    props<{ id: string }>(),
)
export const deleteSequenceFailed = createAction(
    '[Didactic Sequences] Delete Sequence Failed',
    props<{ error: string }>(),
)
