import { createAction, props } from '@ngrx/store'
import { ReadingActivity } from '../../core/models'
import { ReadingActivityDto } from './reading-activities.models'

// Load a single activity
export const loadActivity = createAction(
    '[Reading Activities] Load Activity',
    props<{ id: string }>(),
)
export const loadActivitySuccess = createAction(
    '[Reading Activities] Load Activity Success',
    props<{ activity: ReadingActivity }>(),
)
export const loadActivityFailed = createAction(
    '[Reading Activities] Load Activity Failed',
    props<{ error: string }>(),
)

// Load all activities
export const loadActivities = createAction('[Reading Activities] Load Activities')
export const loadActivitiesSuccess = createAction(
    '[Reading Activities] Load Activities Success',
    props<{ activities: ReadingActivity[] }>(),
)
export const loadActivitiesFailed = createAction(
    '[Reading Activities] Load Activities Failed',
    props<{ error: string }>(),
)

// Create an activity
export const createActivity = createAction(
    '[Reading Activities] Create Activity',
    props<{ activity: Partial<ReadingActivityDto> }>(),
)
export const createActivitySuccess = createAction(
    '[Reading Activities] Create Activity Success',
    props<{ activity: ReadingActivity }>(),
)
export const createActivityFailed = createAction(
    '[Reading Activities] Create Activity Failed',
    props<{ error: string }>(),
)

// Update an activity
export const updateActivity = createAction(
    '[Reading Activities] Update Activity',
    props<{ id: string; data: Partial<ReadingActivityDto> }>(),
)
export const updateActivitySuccess = createAction(
    '[Reading Activities] Update Activity Success',
    props<{ activity: ReadingActivity }>(),
)
export const updateActivityFailed = createAction(
    '[Reading Activities] Update Activity Failed',
    props<{ error: string }>(),
)

// Delete an activity
export const deleteActivity = createAction(
    '[Reading Activities] Delete Activity',
    props<{ id: string }>(),
)
export const deleteActivitySuccess = createAction(
    '[Reading Activities] Delete Activity Success',
    props<{ id: string }>(),
)
export const deleteActivityFailed = createAction(
    '[Reading Activities] Delete Activity Failed',
    props<{ error: string }>(),
)
