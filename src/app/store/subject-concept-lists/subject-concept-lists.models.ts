import { SubjectConceptList } from '../../core/models';

// DTO basada en los métodos create/update del servicio
export interface SubjectConceptListDto {
	subject: string;
	level: string;
	grade: string;
	concepts: string[];
}

export enum SubjectConceptListStateStatus {
	IDLING,
	LOADING_LISTS,
	LOADING_LIST,
	CREATING_LIST,
	UPDATING_LIST,
	DELETING_LIST,
}

export interface SubjectConceptListsState {
	lists: SubjectConceptList[];
	selectedList: SubjectConceptList | null;
	error: string | null;
	status: SubjectConceptListStateStatus;
}

export const initialSubjectConceptListsState: SubjectConceptListsState = {
	lists: [],
	selectedList: null,
	error: null,
	status: SubjectConceptListStateStatus.IDLING,
};
