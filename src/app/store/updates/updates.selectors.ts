import { createFeatureSelector, createSelector } from '@ngrx/store'
import { UpdatesState, UpdateStateStatus } from './updates.models'

export const selectUpdatesState = createFeatureSelector<UpdatesState>('updates')

export const selectAllUpdates = createSelector(
    selectUpdatesState,
    state => state.updates,
)

export const selectCurrentUpdate = createSelector(
    selectUpdatesState,
    state => state.selectedUpdate,
)

export const selectUpdatesStatus = createSelector(
    selectUpdatesState,
    state => state.status,
)

export const selectUpdatesError = createSelector(
    selectUpdatesState,
    state => state.error,
)

// Selectores de estado booleanos
export const selectIsLoadingMany = createSelector(
    selectUpdatesStatus,
    status => status === UpdateStateStatus.LOADING_UPDATES,
)

export const selectIsLoadingOne = createSelector(
    selectUpdatesStatus,
    status => status === UpdateStateStatus.LOADING_UPDATE,
)

export const selectIsCreating = createSelector(
    selectUpdatesStatus,
    status => status === UpdateStateStatus.CREATING_UPDATE,
)

export const selectIsUpdating = createSelector(
    selectUpdatesStatus,
    status => status === UpdateStateStatus.UPDATING_UPDATE,
)

export const selectIsDeleting = createSelector(
    selectUpdatesStatus,
    status => status === UpdateStateStatus.DELETING_UPDATE,
)
