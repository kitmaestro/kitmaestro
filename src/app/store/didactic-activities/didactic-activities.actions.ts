import { createAction, props } from '@ngrx/store';
import { DidacticActivity } from '../../core/models';
import { DidacticActivityDto } from './didactic-activities.models';

// Load a single activity
export const loadDidacticActivity = createAction(
	'[Didactic Activities] Load Activity',
	props<{ id: string }>(),
);
export const loadDidacticActivitySuccess = createAction(
	'[Didactic Activities] Load Activity Success',
	props<{ activity: DidacticActivity }>(),
);
export const loadDidacticActivityFailed = createAction(
	'[Didactic Activities] Load Activity Failed',
	props<{ error: string }>(),
);

// Load all activities
export const loadDidacticActivities = createAction(
	'[Didactic Activities] Load Activities',
	props<{ filters: any }>(),
);
export const loadDidacticActivitiesSuccess = createAction(
	'[Didactic Activities] Load Activities Success',
	props<{ activities: DidacticActivity[] }>(),
);
export const loadDidacticActivitiesFailed = createAction(
	'[Didactic Activities] Load Activities Failed',
	props<{ error: string }>(),
);

// Create an activity
export const createDidacticActivity = createAction(
	'[Didactic Activities] Create Activity',
	props<{ activity: Partial<DidacticActivityDto> }>(),
);
export const createDidacticActivitySuccess = createAction(
	'[Didactic Activities] Create Activity Success',
	props<{ activity: DidacticActivity }>(),
);
export const createDidacticActivityFailed = createAction(
	'[Didactic Activities] Create Activity Failed',
	props<{ error: string }>(),
);

// Update an activity
export const updateDidacticActivity = createAction(
	'[Didactic Activities] Update Activity',
	props<{ id: string; data: Partial<DidacticActivityDto> }>(),
);
export const updateDidacticActivitySuccess = createAction(
	'[Didactic Activities] Update Activity Success',
	props<{ activity: DidacticActivity }>(),
);
export const updateDidacticActivityFailed = createAction(
	'[Didactic Activities] Update Activity Failed',
	props<{ error: string }>(),
);

// Delete an activity
export const deleteDidacticActivity = createAction(
	'[Didactic Activities] Delete Activity',
	props<{ id: string }>(),
);
export const deleteDidacticActivitySuccess = createAction(
	'[Didactic Activities] Delete Activity Success',
	props<{ id: string }>(),
);
export const deleteDidacticActivityFailed = createAction(
	'[Didactic Activities] Delete Activity Failed',
	props<{ error: string }>(),
);
