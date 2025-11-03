import { createAction, props } from '@ngrx/store';
import { ActivityResource } from '../../core/models';
import { ActivityResourceDto } from './activity-resources.models';

// Load a single resource
export const loadResource = createAction(
	'[Activity Resources] Load Resource',
	props<{ id: string }>(),
);
export const loadResourceSuccess = createAction(
	'[Activity Resources] Load Resource Success',
	props<{ resource: ActivityResource }>(),
);
export const loadResourceFailed = createAction(
	'[Activity Resources] Load Resource Failed',
	props<{ error: string }>(),
);

// Load all resources
export const loadResources = createAction(
	'[Activity Resources] Load Resources',
	props<{ filters: Partial<ActivityResourceDto> }>(),
);
export const loadResourcesSuccess = createAction(
	'[Activity Resources] Load Resources Success',
	props<{ resources: ActivityResource[] }>(),
);
export const loadResourcesFailed = createAction(
	'[Activity Resources] Load Resources Failed',
	props<{ error: string }>(),
);

// Create a resource
export const createResource = createAction(
	'[Activity Resources] Create Resource',
	props<{ resource: Partial<ActivityResourceDto> }>(),
);
export const createResourceSuccess = createAction(
	'[Activity Resources] Create Resource Success',
	props<{ resource: ActivityResource }>(),
);
export const createResourceFailed = createAction(
	'[Activity Resources] Create Resource Failed',
	props<{ error: string }>(),
);

// Update a resource
export const updateResource = createAction(
	'[Activity Resources] Update Resource',
	props<{ id: string; data: Partial<ActivityResourceDto> }>(),
);
export const updateResourceSuccess = createAction(
	'[Activity Resources] Update Resource Success',
	props<{ resource: ActivityResource }>(),
);
export const updateResourceFailed = createAction(
	'[Activity Resources] Update Resource Failed',
	props<{ error: string }>(),
);

// Delete a resource
export const deleteResource = createAction(
	'[Activity Resources] Delete Resource',
	props<{ id: string }>(),
);
export const deleteResourceSuccess = createAction(
	'[Activity Resources] Delete Resource Success',
	props<{ id: string }>(),
);
export const deleteResourceFailed = createAction(
	'[Activity Resources] Delete Resource Failed',
	props<{ error: string }>(),
);
