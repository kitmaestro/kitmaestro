import { createReducer, on } from '@ngrx/store'
import * as SubjectConceptListsActions from './subject-concept-lists.actions'
import {
    initialSubjectConceptListsState,
    SubjectConceptListStateStatus,
} from './subject-concept-lists.models'

export const subjectConceptListsReducer = createReducer(
    initialSubjectConceptListsState,

    // Set status for ongoing operations
    on(SubjectConceptListsActions.loadSubjectConceptList, state => ({
        ...state,
        status: SubjectConceptListStateStatus.LOADING_LIST,
    })),
    on(SubjectConceptListsActions.loadSubjectConceptLists, state => ({
        ...state,
        status: SubjectConceptListStateStatus.LOADING_LISTS,
    })),
    on(SubjectConceptListsActions.createSubjectConceptList, state => ({
        ...state,
        status: SubjectConceptListStateStatus.CREATING_LIST,
    })),
    on(SubjectConceptListsActions.updateSubjectConceptList, state => ({
        ...state,
        status: SubjectConceptListStateStatus.UPDATING_LIST,
    })),
    on(SubjectConceptListsActions.deleteSubjectConceptList, state => ({
        ...state,
        status: SubjectConceptListStateStatus.DELETING_LIST,
    })),

    // Handle failure cases
    on(
        SubjectConceptListsActions.loadSubjectConceptListFailed,
        SubjectConceptListsActions.loadSubjectConceptListsFailed,
        SubjectConceptListsActions.createSubjectConceptListFailed,
        SubjectConceptListsActions.updateSubjectConceptListFailed,
        SubjectConceptListsActions.deleteSubjectConceptListFailed,
        (state, { error }) => ({ ...state, status: SubjectConceptListStateStatus.IDLING, error }),
    ),

    // Handle success cases
    on(SubjectConceptListsActions.loadSubjectConceptListSuccess, (state, { list }) => ({
        ...state,
        status: SubjectConceptListStateStatus.IDLING,
        selectedList: list,
    })),
    on(SubjectConceptListsActions.loadSubjectConceptListsSuccess, (state, { lists }) => ({
        ...state,
        status: SubjectConceptListStateStatus.IDLING,
        lists,
    })),
    on(SubjectConceptListsActions.createSubjectConceptListSuccess, (state, { list }) => ({
        ...state,
        status: SubjectConceptListStateStatus.IDLING,
        lists: [list, ...state.lists],
    })),
    on(SubjectConceptListsActions.updateSubjectConceptListSuccess, (state, { list: updatedList }) => ({
        ...state,
        status: SubjectConceptListStateStatus.IDLING,
        selectedList:
            state.selectedList?._id === updatedList._id ? updatedList : state.selectedList,
        lists: state.lists.map(l => (l._id === updatedList._id ? updatedList : l)),
    })),
    on(SubjectConceptListsActions.deleteSubjectConceptListSuccess, (state, { id }) => ({
        ...state,
        status: SubjectConceptListStateStatus.IDLING,
        selectedList: state.selectedList?._id === id ? null : state.selectedList,
        lists: state.lists.filter(l => l._id !== id),
    })),
)
