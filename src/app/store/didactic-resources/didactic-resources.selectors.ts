import { createFeatureSelector, createSelector } from '@ngrx/store'
import {
    DidacticResourcesState,
    DidacticResourceStateStatus,
} from './didactic-resources.models'

export const selectDidacticResourcesState =
    createFeatureSelector<DidacticResourcesState>('didacticResources')

export const selectAllResources = createSelector(
    selectDidacticResourcesState,
    state => state.resources,
)

export const selectUserResources = createSelector(
    selectDidacticResourcesState,
    state => state.userResources,
)

export const selectCurrentResource = createSelector(
    selectDidacticResourcesState,
    state => state.selectedResource,
)

export const selectDidacticResourcesStatus = createSelector(
    selectDidacticResourcesState,
    state => state.status,
)

export const selectDidacticResourcesError = createSelector(
    selectDidacticResourcesState,
    state => state.error,
)

// Selectores de estado booleanos
export const selectResourcesIsLoadingMany = createSelector(
    selectDidacticResourcesStatus,
    status => status === DidacticResourceStateStatus.LOADING_RESOURCES,
)

export const selectResourcesIsLoadingUserResources = createSelector(
    selectDidacticResourcesStatus,
    status => status === DidacticResourceStateStatus.LOADING_USER_RESOURCES,
)

export const selectResourcesIsLoadingOne = createSelector(
    selectDidacticResourcesStatus,
    status => status === DidacticResourceStateStatus.LOADING_RESOURCE,
)

export const selectResourcesIsCreating = createSelector(
    selectDidacticResourcesStatus,
    status => status === DidacticResourceStateStatus.CREATING_RESOURCE,
)

export const selectResourcesIsUpdating = createSelector(
    selectDidacticResourcesStatus,
    status => status === DidacticResourceStateStatus.UPDATING_RESOURCE,
)

export const selectResourcesIsDeleting = createSelector(
    selectDidacticResourcesStatus,
    status => status === DidacticResourceStateStatus.DELETING_RESOURCE,
)
