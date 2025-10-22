import { createFeatureSelector, createSelector } from '@ngrx/store'
import { RubricsState, RubricStateStatus } from './rubrics.models'

export const selectRubricsState = createFeatureSelector<RubricsState>('rubrics')

export const selectAllRubrics = createSelector(
    selectRubricsState,
    state => state.rubrics,
)

export const selectCurrentRubric = createSelector(
    selectRubricsState,
    state => state.selectedRubric,
)

export const selectRubricsStatus = createSelector(
    selectRubricsState,
    state => state.status,
)

export const selectRubricsError = createSelector(
    selectRubricsState,
    state => state.error,
)

// Selectores de estado booleanos
export const selectIsLoadingMany = createSelector(
    selectRubricsStatus,
    status => status === RubricStateStatus.LOADING_RUBRICS,
)

export const selectIsLoadingOne = createSelector(
    selectRubricsStatus,
    status => status === RubricStateStatus.LOADING_RUBRIC,
)

export const selectIsCreating = createSelector(
    selectRubricsStatus,
    status => status === RubricStateStatus.CREATING_RUBRIC,
)

export const selectIsUpdating = createSelector(
    selectRubricsStatus,
    status => status === RubricStateStatus.UPDATING_RUBRIC,
)

export const selectIsDeleting = createSelector(
    selectRubricsStatus,
    status => status === RubricStateStatus.DELETING_RUBRIC,
)
