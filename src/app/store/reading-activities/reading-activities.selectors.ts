import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
	ReadingActivitiesState,
	ReadingActivityStateStatus,
} from './reading-activities.models';

export const selectReadingActivitiesState =
	createFeatureSelector<ReadingActivitiesState>('readingActivities');

export const selectAllActivities = createSelector(
	selectReadingActivitiesState,
	(state) => state.activities,
);

export const selectCurrentActivity = createSelector(
	selectReadingActivitiesState,
	(state) => state.selectedActivity,
);

export const selectActivitiesStatus = createSelector(
	selectReadingActivitiesState,
	(state) => state.status,
);

export const selectActivitiesError = createSelector(
	selectReadingActivitiesState,
	(state) => state.error,
);

// Selectores de estado booleanos
export const selectIsLoadingMany = createSelector(
	selectActivitiesStatus,
	(status) => status === ReadingActivityStateStatus.LOADING_ACTIVITIES,
);

export const selectIsLoadingOne = createSelector(
	selectActivitiesStatus,
	(status) => status === ReadingActivityStateStatus.LOADING_ACTIVITY,
);

export const selectIsCreating = createSelector(
	selectActivitiesStatus,
	(status) => status === ReadingActivityStateStatus.CREATING_ACTIVITY,
);

export const selectIsUpdating = createSelector(
	selectActivitiesStatus,
	(status) => status === ReadingActivityStateStatus.UPDATING_ACTIVITY,
);

export const selectIsDeleting = createSelector(
	selectActivitiesStatus,
	(status) => status === ReadingActivityStateStatus.DELETING_ACTIVITY,
);
