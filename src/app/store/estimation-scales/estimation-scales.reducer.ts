import { createReducer, on } from '@ngrx/store';
import * as EstimationScalesActions from './estimation-scales.actions';
import {
	initialEstimationScalesState,
	EstimationScaleStateStatus,
} from './estimation-scales.models';

export const estimationScalesReducer = createReducer(
	initialEstimationScalesState,

	// Set status for ongoing operations
	on(EstimationScalesActions.loadScale, (state) => ({
		...state,
		status: EstimationScaleStateStatus.LOADING_SCALE,
	})),
	on(EstimationScalesActions.loadScales, (state) => ({
		...state,
		status: EstimationScaleStateStatus.LOADING_SCALES,
	})),
	on(EstimationScalesActions.createScale, (state) => ({
		...state,
		status: EstimationScaleStateStatus.CREATING_SCALE,
	})),
	on(EstimationScalesActions.updateScale, (state) => ({
		...state,
		status: EstimationScaleStateStatus.UPDATING_SCALE,
	})),
	on(EstimationScalesActions.deleteScale, (state) => ({
		...state,
		status: EstimationScaleStateStatus.DELETING_SCALE,
	})),

	// Handle failure cases
	on(
		EstimationScalesActions.loadScaleFailed,
		EstimationScalesActions.loadScalesFailed,
		EstimationScalesActions.createScaleFailed,
		EstimationScalesActions.updateScaleFailed,
		EstimationScalesActions.deleteScaleFailed,
		(state, { error }) => ({
			...state,
			status: EstimationScaleStateStatus.IDLING,
			error,
		}),
	),

	// Handle success cases
	on(EstimationScalesActions.loadScaleSuccess, (state, { scale }) => ({
		...state,
		status: EstimationScaleStateStatus.IDLING,
		selectedScale: scale,
	})),
	on(EstimationScalesActions.loadScalesSuccess, (state, { scales }) => ({
		...state,
		status: EstimationScaleStateStatus.IDLING,
		scales,
	})),
	on(EstimationScalesActions.createScaleSuccess, (state, { scale }) => ({
		...state,
		status: EstimationScaleStateStatus.IDLING,
		scales: [scale, ...state.scales],
	})),
	on(
		EstimationScalesActions.updateScaleSuccess,
		(state, { scale: updatedScale }) => ({
			...state,
			status: EstimationScaleStateStatus.IDLING,
			selectedScale:
				state.selectedScale?._id === updatedScale._id
					? updatedScale
					: state.selectedScale,
			scales: state.scales.map((s) =>
				s._id === updatedScale._id ? updatedScale : s,
			),
		}),
	),
	on(EstimationScalesActions.deleteScaleSuccess, (state, { id }) => ({
		...state,
		status: EstimationScaleStateStatus.IDLING,
		selectedScale:
			state.selectedScale?._id === id ? null : state.selectedScale,
		scales: state.scales.filter((s) => s._id !== id),
	})),
);
