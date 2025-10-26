import { createFeatureSelector, createSelector } from '@ngrx/store'
import { EstimationScalesState, EstimationScaleStateStatus } from './estimation-scales.models'

export const selectEstimationScalesState =
	createFeatureSelector<EstimationScalesState>('estimationScales')

export const selectAllScales = createSelector(
	selectEstimationScalesState,
	(state) => state.scales,
)

export const selectCurrentScale = createSelector(
	selectEstimationScalesState,
	(state) => state.selectedScale,
)

export const selectScalesStatus = createSelector(
	selectEstimationScalesState,
	(state) => state.status,
)

export const selectScalesError = createSelector(
	selectEstimationScalesState,
	(state) => state.error,
)

export const selectLoadingEstimationScale = createSelector(
	selectEstimationScalesState,
	(state) => state.status === EstimationScaleStateStatus.LOADING_SCALE,
)

export const selectLoadingEstimationScales = createSelector(
	selectEstimationScalesState,
	(state) => state.status === EstimationScaleStateStatus.LOADING_SCALES,
)

export const selectCreatingEstimationScale = createSelector(
	selectEstimationScalesState,
	(state) => state.status === EstimationScaleStateStatus.CREATING_SCALE,
)

export const selectUpdatingEstimationScale = createSelector(
	selectEstimationScalesState,
	(state) => state.status === EstimationScaleStateStatus.UPDATING_SCALE,
)

export const selectDeletingEstimationScale = createSelector(
	selectEstimationScalesState,
	(state) => state.status === EstimationScaleStateStatus.DELETING_SCALE,
)
