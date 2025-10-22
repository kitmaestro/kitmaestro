import { createReducer, on } from '@ngrx/store';
import * as ObservationGuidesActions from './observation-guides.actions';
import {
	initialObservationGuidesState,
	ObservationGuideStateStatus,
} from './observation-guides.models';

export const observationGuidesReducer = createReducer(
	initialObservationGuidesState,

	// Set status for ongoing operations
	on(ObservationGuidesActions.loadGuide, (state) => ({
		...state,
		status: ObservationGuideStateStatus.LOADING_GUIDE,
	})),
	on(ObservationGuidesActions.loadGuides, (state) => ({
		...state,
		status: ObservationGuideStateStatus.LOADING_GUIDES,
	})),
	on(ObservationGuidesActions.createGuide, (state) => ({
		...state,
		status: ObservationGuideStateStatus.CREATING_GUIDE,
	})),
	on(ObservationGuidesActions.updateGuide, (state) => ({
		...state,
		status: ObservationGuideStateStatus.UPDATING_GUIDE,
	})),
	on(ObservationGuidesActions.deleteGuide, (state) => ({
		...state,
		status: ObservationGuideStateStatus.DELETING_GUIDE,
	})),

	// Handle failure cases
	on(
		ObservationGuidesActions.loadGuideFailed,
		ObservationGuidesActions.loadGuidesFailed,
		ObservationGuidesActions.createGuideFailed,
		ObservationGuidesActions.updateGuideFailed,
		ObservationGuidesActions.deleteGuideFailed,
		(state, { error }) => ({
			...state,
			status: ObservationGuideStateStatus.IDLING,
			error,
		}),
	),

	// Handle success cases
	on(ObservationGuidesActions.loadGuideSuccess, (state, { guide }) => ({
		...state,
		status: ObservationGuideStateStatus.IDLING,
		selectedGuide: guide,
	})),
	on(ObservationGuidesActions.loadGuidesSuccess, (state, { guides }) => ({
		...state,
		status: ObservationGuideStateStatus.IDLING,
		guides,
	})),
	on(ObservationGuidesActions.createGuideSuccess, (state, { guide }) => ({
		...state,
		status: ObservationGuideStateStatus.IDLING,
		guides: [guide, ...state.guides],
	})),
	on(
		ObservationGuidesActions.updateGuideSuccess,
		(state, { guide: updatedGuide }) => ({
			...state,
			status: ObservationGuideStateStatus.IDLING,
			selectedGuide:
				state.selectedGuide?._id === updatedGuide._id
					? updatedGuide
					: state.selectedGuide,
			guides: state.guides.map((g) =>
				g._id === updatedGuide._id ? updatedGuide : g,
			),
		}),
	),
	on(ObservationGuidesActions.deleteGuideSuccess, (state, { id }) => ({
		...state,
		status: ObservationGuideStateStatus.IDLING,
		selectedGuide:
			state.selectedGuide?._id === id ? null : state.selectedGuide,
		guides: state.guides.filter((g) => g._id !== id),
	})),
);
