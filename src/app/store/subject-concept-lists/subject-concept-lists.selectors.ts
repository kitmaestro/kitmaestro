import { createFeatureSelector, createSelector } from '@ngrx/store'
import {
	SubjectConceptListsState,
	SubjectConceptListStateStatus,
} from './subject-concept-lists.models'

export const selectSubjectConceptListsState =
	createFeatureSelector<SubjectConceptListsState>('subjectConceptLists')

export const selectAllLists = createSelector(
	selectSubjectConceptListsState,
	(state) => state.lists,
)

export const selectCurrentList = createSelector(
	selectSubjectConceptListsState,
	(state) => state.selectedList,
)

export const selectListsStatus = createSelector(
	selectSubjectConceptListsState,
	(state) => state.status,
)

export const selectListsError = createSelector(
	selectSubjectConceptListsState,
	(state) => state.error,
)

// Selectores de estado booleanos
export const selectIsLoadingManyConcepts = createSelector(
	selectListsStatus,
	(status) => status === SubjectConceptListStateStatus.LOADING_LISTS,
)

export const selectIsLoadingOneConcept = createSelector(
	selectListsStatus,
	(status) => status === SubjectConceptListStateStatus.LOADING_LIST,
)

export const selectIsCreatingConcept = createSelector(
	selectListsStatus,
	(status) => status === SubjectConceptListStateStatus.CREATING_LIST,
)

export const selectIsUpdatingConcept = createSelector(
	selectListsStatus,
	(status) => status === SubjectConceptListStateStatus.UPDATING_LIST,
)

export const selectIsDeletingConcept = createSelector(
	selectListsStatus,
	(status) => status === SubjectConceptListStateStatus.DELETING_LIST,
)
