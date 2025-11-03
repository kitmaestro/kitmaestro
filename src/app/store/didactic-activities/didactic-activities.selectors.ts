import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
	DidacticActivitiesState,
	DidacticActivityStateStatus,
} from './didactic-activities.models';

export const selectDidacticActivitiesState =
	createFeatureSelector<DidacticActivitiesState>('didacticActivities');

export const selectAllActivities = createSelector(
	selectDidacticActivitiesState,
	(state) => state.activities,
);

export const selectCurrentActivity = createSelector(
	selectDidacticActivitiesState,
	(state) => state.selectedActivity,
);

export const selectActivitiesStatus = createSelector(
	selectDidacticActivitiesState,
	(state) => state.status,
);

export const selectActivitiesError = createSelector(
	selectDidacticActivitiesState,
	(state) => state.error,
);

// Selectores de estado booleanos
export const selectIsLoadingMany = createSelector(
	selectActivitiesStatus,
	(status) => status === DidacticActivityStateStatus.LOADING_ACTIVITIES,
);

export const selectIsLoadingOne = createSelector(
	selectActivitiesStatus,
	(status) => status === DidacticActivityStateStatus.LOADING_ACTIVITY,
);

export const selectIsCreating = createSelector(
	selectActivitiesStatus,
	(status) => status === DidacticActivityStateStatus.CREATING_ACTIVITY,
);

export const selectIsUpdating = createSelector(
	selectActivitiesStatus,
	(status) => status === DidacticActivityStateStatus.UPDATING_ACTIVITY,
);

export const selectIsDeleting = createSelector(
	selectActivitiesStatus,
	(status) => status === DidacticActivityStateStatus.DELETING_ACTIVITY,
);
