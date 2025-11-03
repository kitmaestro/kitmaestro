import { createReducer, on } from '@ngrx/store';
import * as DidacticSequencesActions from './didactic-sequences.actions';
import {
	initialDidacticSequencesState,
	DidacticSequenceStateStatus,
} from './didactic-sequences.models';

export const didacticSequencesReducer = createReducer(
	initialDidacticSequencesState,

	// Set status for ongoing operations
	on(DidacticSequencesActions.loadSequence, (state) => ({
		...state,
		status: DidacticSequenceStateStatus.LOADING_SEQUENCE,
	})),
	on(DidacticSequencesActions.loadSequences, (state) => ({
		...state,
		status: DidacticSequenceStateStatus.LOADING_SEQUENCES,
	})),
	on(DidacticSequencesActions.createSequence, (state) => ({
		...state,
		status: DidacticSequenceStateStatus.CREATING_SEQUENCE,
	})),
	on(DidacticSequencesActions.updateSequence, (state) => ({
		...state,
		status: DidacticSequenceStateStatus.UPDATING_SEQUENCE,
	})),
	on(DidacticSequencesActions.deleteSequence, (state) => ({
		...state,
		status: DidacticSequenceStateStatus.DELETING_SEQUENCE,
	})),

	// Handle failure cases
	on(
		DidacticSequencesActions.loadSequenceFailed,
		DidacticSequencesActions.loadSequencesFailed,
		DidacticSequencesActions.createSequenceFailed,
		DidacticSequencesActions.updateSequenceFailed,
		DidacticSequencesActions.deleteSequenceFailed,
		(state, { error }) => ({
			...state,
			status: DidacticSequenceStateStatus.IDLING,
			error,
		}),
	),

	// Handle success cases
	on(DidacticSequencesActions.loadSequenceSuccess, (state, { sequence }) => ({
		...state,
		status: DidacticSequenceStateStatus.IDLING,
		selectedSequence: sequence,
	})),
	on(
		DidacticSequencesActions.loadSequencesSuccess,
		(state, { sequences }) => ({
			...state,
			status: DidacticSequenceStateStatus.IDLING,
			sequences,
		}),
	),
	on(
		DidacticSequencesActions.createSequenceSuccess,
		(state, { sequence }) => ({
			...state,
			status: DidacticSequenceStateStatus.IDLING,
			sequences: [sequence, ...state.sequences],
		}),
	),
	on(
		DidacticSequencesActions.updateSequenceSuccess,
		(state, { sequence: updatedSequence }) => ({
			...state,
			status: DidacticSequenceStateStatus.IDLING,
			selectedSequence:
				state.selectedSequence?._id === updatedSequence._id
					? updatedSequence
					: state.selectedSequence,
			sequences: state.sequences.map((s) =>
				s._id === updatedSequence._id ? updatedSequence : s,
			),
		}),
	),
	on(DidacticSequencesActions.deleteSequenceSuccess, (state, { id }) => ({
		...state,
		status: DidacticSequenceStateStatus.IDLING,
		selectedSequence:
			state.selectedSequence?._id === id ? null : state.selectedSequence,
		sequences: state.sequences.filter((s) => s._id !== id),
	})),
);
