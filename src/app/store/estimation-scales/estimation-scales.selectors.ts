import { createFeatureSelector, createSelector } from '@ngrx/store'
import { EstimationScalesState } from './estimation-scales.models'

export const selectEstimationScalesState =
    createFeatureSelector<EstimationScalesState>('estimationScales')

export const selectAllScales = createSelector(
    selectEstimationScalesState,
    state => state.scales,
)

export const selectCurrentScale = createSelector(
    selectEstimationScalesState,
    state => state.selectedScale,
)

export const selectScalesStatus = createSelector(
    selectEstimationScalesState,
    state => state.status,
)

export const selectScalesError = createSelector(
    selectEstimationScalesState,
    state => state.error,
)
