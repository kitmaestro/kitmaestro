import { createReducer, on } from '@ngrx/store';
import * as ActivityResourcesActions from './activity-resources.actions';
import {
	initialActivityResourcesState,
	ActivityResourceStateStatus,
} from './activity-resources.models';

export const activityResourcesReducer = createReducer(
	initialActivityResourcesState,

	// Set status for ongoing operations
	on(ActivityResourcesActions.loadResource, (state) => ({
		...state,
		status: ActivityResourceStateStatus.LOADING_RESOURCE,
	})),
	on(ActivityResourcesActions.loadResources, (state) => ({
		...state,
		status: ActivityResourceStateStatus.LOADING_RESOURCES,
	})),
	on(ActivityResourcesActions.createResource, (state) => ({
		...state,
		status: ActivityResourceStateStatus.CREATING_RESOURCE,
	})),
	on(ActivityResourcesActions.updateResource, (state) => ({
		...state,
		status: ActivityResourceStateStatus.UPDATING_RESOURCE,
	})),
	on(ActivityResourcesActions.deleteResource, (state) => ({
		...state,
		status: ActivityResourceStateStatus.DELETING_RESOURCE,
	})),

	// Handle failure cases
	on(
		ActivityResourcesActions.loadResourceFailed,
		ActivityResourcesActions.loadResourcesFailed,
		ActivityResourcesActions.createResourceFailed,
		ActivityResourcesActions.updateResourceFailed,
		ActivityResourcesActions.deleteResourceFailed,
		(state, { error }) => ({
			...state,
			status: ActivityResourceStateStatus.IDLING,
			error,
		}),
	),

	// Handle success cases
	on(ActivityResourcesActions.loadResourceSuccess, (state, { resource }) => ({
		...state,
		status: ActivityResourceStateStatus.IDLING,
		selectedResource: resource,
	})),
	on(
		ActivityResourcesActions.loadResourcesSuccess,
		(state, { resources }) => ({
			...state,
			status: ActivityResourceStateStatus.IDLING,
			resources,
		}),
	),
	on(
		ActivityResourcesActions.createResourceSuccess,
		(state, { resource }) => ({
			...state,
			status: ActivityResourceStateStatus.IDLING,
			resources: [resource, ...state.resources],
		}),
	),
	on(
		ActivityResourcesActions.updateResourceSuccess,
		(state, { resource: updatedResource }) => ({
			...state,
			status: ActivityResourceStateStatus.IDLING,
			selectedResource:
				state.selectedResource?._id === updatedResource._id
					? updatedResource
					: state.selectedResource,
			resources: state.resources.map((r) =>
				r._id === updatedResource._id ? updatedResource : r,
			),
		}),
	),
	on(ActivityResourcesActions.deleteResourceSuccess, (state, { id }) => ({
		...state,
		status: ActivityResourceStateStatus.IDLING,
		selectedResource:
			state.selectedResource?._id === id ? null : state.selectedResource,
		resources: state.resources.filter((r) => r._id !== id),
	})),
);
