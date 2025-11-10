import { DidacticSequence } from '../../core/models';
import { TableOfContentsItem } from '../../core';
import { SchoolLevel, TSchoolSubject, SchoolYear } from '../../core/types';

export interface DidacticSequenceDto {
	level: SchoolLevel;
	year: SchoolYear;
	subject: TSchoolSubject;
	tableOfContents: TableOfContentsItem[];
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
	sequences: DidacticSequence[];
	selectedSequence: DidacticSequence | null;
	error: string | null;
	status: DidacticSequenceStateStatus;
}

export const initialDidacticSequencesState: DidacticSequencesState = {
	sequences: [],
	selectedSequence: null,
	error: null,
	status: DidacticSequenceStateStatus.IDLING,
};
