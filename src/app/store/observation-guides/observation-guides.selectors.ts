import { createFeatureSelector, createSelector } from '@ngrx/store'
import {
    ObservationGuidesState,
    ObservationGuideStateStatus,
} from './observation-guides.models'

export const selectObservationGuidesState =
    createFeatureSelector<ObservationGuidesState>('observationGuides')

export const selectAllGuides = createSelector(
    selectObservationGuidesState,
    state => state.guides,
)

export const selectCurrentGuide = createSelector(
    selectObservationGuidesState,
    state => state.selectedGuide,
)

export const selectGuidesStatus = createSelector(
    selectObservationGuidesState,
    state => state.status,
)

export const selectGuidesError = createSelector(
    selectObservationGuidesState,
    state => state.error,
)

// Selectores de estado booleanos
export const selectIsLoadingMany = createSelector(
    selectGuidesStatus,
    status => status === ObservationGuideStateStatus.LOADING_GUIDES,
)

export const selectIsLoadingOne = createSelector(
    selectGuidesStatus,
    status => status === ObservationGuideStateStatus.LOADING_GUIDE,
)

export const selectIsCreating = createSelector(
    selectGuidesStatus,
    status => status === ObservationGuideStateStatus.CREATING_GUIDE,
)

export const selectIsUpdating = createSelector(
    selectGuidesStatus,
    status => status === ObservationGuideStateStatus.UPDATING_GUIDE,
)

export const selectIsDeleting = createSelector(
    selectGuidesStatus,
    status => status === ObservationGuideStateStatus.DELETING_GUIDE,
)
