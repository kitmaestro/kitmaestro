import { createReducer, on } from '@ngrx/store';
import * as DidacticActivitiesActions from './didactic-activities.actions';
import {
	initialDidacticActivitiesState,
	DidacticActivityStateStatus,
} from './didactic-activities.models';

export const didacticActivitiesReducer = createReducer(
	initialDidacticActivitiesState,

	// Set status for ongoing operations
	on(DidacticActivitiesActions.loadDidacticActivity, (state) => ({
		...state,
		status: DidacticActivityStateStatus.LOADING_ACTIVITY,
	})),
	on(DidacticActivitiesActions.loadDidacticActivities, (state) => ({
		...state,
		status: DidacticActivityStateStatus.LOADING_ACTIVITIES,
	})),
	on(DidacticActivitiesActions.createDidacticActivity, (state) => ({
		...state,
		status: DidacticActivityStateStatus.CREATING_ACTIVITY,
	})),
	on(DidacticActivitiesActions.updateDidacticActivity, (state) => ({
		...state,
		status: DidacticActivityStateStatus.UPDATING_ACTIVITY,
	})),
	on(DidacticActivitiesActions.deleteDidacticActivity, (state) => ({
		...state,
		status: DidacticActivityStateStatus.DELETING_ACTIVITY,
	})),

	// Handle failure cases
	on(
		DidacticActivitiesActions.loadDidacticActivityFailed,
		DidacticActivitiesActions.loadDidacticActivitiesFailed,
		DidacticActivitiesActions.createDidacticActivityFailed,
		DidacticActivitiesActions.updateDidacticActivityFailed,
		DidacticActivitiesActions.deleteDidacticActivityFailed,
		(state, { error }) => ({
			...state,
			status: DidacticActivityStateStatus.IDLING,
			error,
		}),
	),

	// Handle success cases
	on(
		DidacticActivitiesActions.loadDidacticActivitySuccess,
		(state, { activity }) => ({
			...state,
			status: DidacticActivityStateStatus.IDLING,
			selectedActivity: activity,
		}),
	),
	on(
		DidacticActivitiesActions.loadDidacticActivitiesSuccess,
		(state, { activities }) => ({
			...state,
			status: DidacticActivityStateStatus.IDLING,
			activities,
		}),
	),
	on(
		DidacticActivitiesActions.createDidacticActivitySuccess,
		(state, { activity }) => ({
			...state,
			status: DidacticActivityStateStatus.IDLING,
			activities: [...state.activities, activity],
		}),
	),
	on(
		DidacticActivitiesActions.updateDidacticActivitySuccess,
		(state, { activity: updatedActivity }) => ({
			...state,
			status: DidacticActivityStateStatus.IDLING,
			selectedActivity:
				state.selectedActivity?._id === updatedActivity._id
					? updatedActivity
					: state.selectedActivity,
			activities: state.activities.map((a) =>
				a._id === updatedActivity._id ? updatedActivity : a,
			),
		}),
	),
	on(
		DidacticActivitiesActions.deleteDidacticActivitySuccess,
		(state, { id }) => ({
			...state,
			status: DidacticActivityStateStatus.IDLING,
			selectedActivity:
				state.selectedActivity?._id === id
					? null
					: state.selectedActivity,
			activities: state.activities.filter((a) => a._id !== id),
		}),
	),
);
