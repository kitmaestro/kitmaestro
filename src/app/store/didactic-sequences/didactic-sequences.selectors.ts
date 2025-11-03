import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
	DidacticSequencesState,
	DidacticSequenceStateStatus,
} from './didactic-sequences.models';

export const selectDidacticSequencesState =
	createFeatureSelector<DidacticSequencesState>('didacticSequences');

export const selectAllSequences = createSelector(
	selectDidacticSequencesState,
	(state) => state.sequences,
);

export const selectCurrentSequence = createSelector(
	selectDidacticSequencesState,
	(state) => state.selectedSequence,
);

export const selectSequencesStatus = createSelector(
	selectDidacticSequencesState,
	(state) => state.status,
);

export const selectSequencesError = createSelector(
	selectDidacticSequencesState,
	(state) => state.error,
);

// Selectores de estado booleanos
export const selectIsLoadingMany = createSelector(
	selectSequencesStatus,
	(status) => status === DidacticSequenceStateStatus.LOADING_SEQUENCES,
);

export const selectIsLoadingOne = createSelector(
	selectSequencesStatus,
	(status) => status === DidacticSequenceStateStatus.LOADING_SEQUENCE,
);

export const selectIsCreating = createSelector(
	selectSequencesStatus,
	(status) => status === DidacticSequenceStateStatus.CREATING_SEQUENCE,
);

export const selectIsUpdating = createSelector(
	selectSequencesStatus,
	(status) => status === DidacticSequenceStateStatus.UPDATING_SEQUENCE,
);

export const selectIsDeleting = createSelector(
	selectSequencesStatus,
	(status) => status === DidacticSequenceStateStatus.DELETING_SEQUENCE,
);
