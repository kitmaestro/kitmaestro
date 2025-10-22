import { createFeatureSelector, createSelector } from '@ngrx/store'
import { StudentsState, StudentStateStatus } from './students.models'

export const selectStudentsState = createFeatureSelector<StudentsState>('students')

export const selectAllStudents = createSelector(
    selectStudentsState,
    state => state.students,
)

export const selectSectionStudents = createSelector(
    selectStudentsState,
    state => state.sectionStudents,
)

export const selectCurrentStudent = createSelector(
    selectStudentsState,
    state => state.selectedStudent,
)

export const selectStudentsStatus = createSelector(
    selectStudentsState,
    state => state.status,
)

export const selectStudentsError = createSelector(
    selectStudentsState,
    state => state.error,
)

// Selectores de estado booleanos
export const selectIsLoadingMany = createSelector(
    selectStudentsStatus,
    status => status === StudentStateStatus.LOADING_STUDENTS,
)

export const selectIsLoadingSectionStudents = createSelector(
    selectStudentsStatus,
    status => status === StudentStateStatus.LOADING_SECTION_STUDENTS,
)

export const selectIsLoadingOne = createSelector(
    selectStudentsStatus,
    status => status === StudentStateStatus.LOADING_STUDENT,
)

export const selectIsCreating = createSelector(
    selectStudentsStatus,
    status => status === StudentStateStatus.CREATING_STUDENT,
)

export const selectIsUpdating = createSelector(
    selectStudentsStatus,
    status => status === StudentStateStatus.UPDATING_STUDENT,
)

export const selectIsDeleting = createSelector(
    selectStudentsStatus,
    status => status === StudentStateStatus.DELETING_STUDENT,
)
