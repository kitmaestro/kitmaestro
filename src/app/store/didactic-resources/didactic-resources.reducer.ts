import { createReducer, on } from '@ngrx/store'
import * as DidacticResourcesActions from './didactic-resources.actions'
import {
    initialDidacticResourcesState,
    DidacticResourceStateStatus,
} from './didactic-resources.models'

export const didacticResourcesReducer = createReducer(
    initialDidacticResourcesState,

    // Set status for ongoing operations
    on(DidacticResourcesActions.loadResource, state => ({
        ...state,
        status: DidacticResourceStateStatus.LOADING_RESOURCE,
    })),
    on(DidacticResourcesActions.loadResources, state => ({
        ...state,
        status: DidacticResourceStateStatus.LOADING_RESOURCES,
    })),
    on(
        DidacticResourcesActions.loadMyResources,
        DidacticResourcesActions.loadUserResources,
        state => ({
            ...state,
            status: DidacticResourceStateStatus.LOADING_USER_RESOURCES,
        }),
    ),
    on(DidacticResourcesActions.createResource, state => ({
        ...state,
        status: DidacticResourceStateStatus.CREATING_RESOURCE,
    })),
    on(
        DidacticResourcesActions.updateResource,
        DidacticResourcesActions.bookmarkResource,
        DidacticResourcesActions.likeResource,
        DidacticResourcesActions.dislikeResource,
        DidacticResourcesActions.buyResource,
        DidacticResourcesActions.downloadResource,
        state => ({
            ...state,
            status: DidacticResourceStateStatus.UPDATING_RESOURCE,
        }),
    ),
    on(DidacticResourcesActions.deleteResource, state => ({
        ...state,
        status: DidacticResourceStateStatus.DELETING_RESOURCE,
    })),

    // Handle failure cases
    on(
        DidacticResourcesActions.loadResourceFailed,
        DidacticResourcesActions.loadResourcesFailed,
        DidacticResourcesActions.loadMyResourcesFailed,
        DidacticResourcesActions.loadUserResourcesFailed,
        DidacticResourcesActions.createResourceFailed,
        DidacticResourcesActions.updateResourceFailed,
        DidacticResourcesActions.deleteResourceFailed,
        (state, { error }) => ({ ...state, status: DidacticResourceStateStatus.IDLING, error }),
    ),

    // Handle success cases
    on(DidacticResourcesActions.loadResourceSuccess, (state, { resource }) => ({
        ...state,
        status: DidacticResourceStateStatus.IDLING,
        selectedResource: resource,
    })),
    on(DidacticResourcesActions.loadResourcesSuccess, (state, { resources }) => ({
        ...state,
        status: DidacticResourceStateStatus.IDLING,
        resources,
    })),
    on(
        DidacticResourcesActions.loadMyResourcesSuccess,
        DidacticResourcesActions.loadUserResourcesSuccess,
        (state, { resources }) => ({
            ...state,
            status: DidacticResourceStateStatus.IDLING,
            userResources: resources,
        }),
    ),
    on(DidacticResourcesActions.createResourceSuccess, (state, { resource }) => ({
        ...state,
        status: DidacticResourceStateStatus.IDLING,
        resources: [resource, ...state.resources],
        userResources: [resource, ...state.userResources], // Add to user resources as well
    })),
    on(DidacticResourcesActions.updateResourceSuccess, (state, { resource: updatedResource }) => ({
        ...state,
        status: DidacticResourceStateStatus.IDLING,
        selectedResource:
            state.selectedResource?._id === updatedResource._id
                ? updatedResource
                : state.selectedResource,
        resources: state.resources.map(r =>
            r._id === updatedResource._id ? updatedResource : r,
        ),
        userResources: state.userResources.map(r =>
            r._id === updatedResource._id ? updatedResource : r,
        ),
    })),
    on(DidacticResourcesActions.deleteResourceSuccess, (state, { id }) => ({
        ...state,
        status: DidacticResourceStateStatus.IDLING,
        selectedResource: state.selectedResource?._id === id ? null : state.selectedResource,
        resources: state.resources.filter(r => r._id !== id),
        userResources: state.userResources.filter(r => r._id !== id),
    })),
)
