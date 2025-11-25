import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
	ActivityResourcesState,
	ActivityResourceStateStatus,
} from './activity-resources.models';

export const selectActivityResourcesState =
	createFeatureSelector<ActivityResourcesState>('activityResources');

export const selectAllResources = createSelector(
	selectActivityResourcesState,
	(state) => state.resources,
);

export const selectCurrentResource = createSelector(
	selectActivityResourcesState,
	(state) => state.selectedResource,
);

export const selectResourcesStatus = createSelector(
	selectActivityResourcesState,
	(state) => state.status,
);

export const selectResourcesError = createSelector(
	selectActivityResourcesState,
	(state) => state.error,
);

// Selectores de estado booleanos
export const selectIsLoadingMany = createSelector(
	selectResourcesStatus,
	(status) => status === ActivityResourceStateStatus.LOADING_RESOURCES,
);

export const selectIsLoadingOne = createSelector(
	selectResourcesStatus,
	(status) => status === ActivityResourceStateStatus.LOADING_RESOURCE,
);

export const selectIsCreating = createSelector(
	selectResourcesStatus,
	(status) => status === ActivityResourceStateStatus.CREATING_RESOURCE,
);

export const selectIsUpdating = createSelector(
	selectResourcesStatus,
	(status) => status === ActivityResourceStateStatus.UPDATING_RESOURCE,
);

export const selectIsDeleting = createSelector(
	selectResourcesStatus,
	(status) => status === ActivityResourceStateStatus.DELETING_RESOURCE,
);
