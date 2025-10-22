import { createReducer, on } from '@ngrx/store'
import * as ReadingActivitiesActions from './reading-activities.actions'
import {
    initialReadingActivitiesState,
    ReadingActivityStateStatus,
} from './reading-activities.models'

export const readingActivitiesReducer = createReducer(
    initialReadingActivitiesState,

    // Set status for ongoing operations
    on(ReadingActivitiesActions.loadActivity, state => ({
        ...state,
        status: ReadingActivityStateStatus.LOADING_ACTIVITY,
    })),
    on(ReadingActivitiesActions.loadActivities, state => ({
        ...state,
        status: ReadingActivityStateStatus.LOADING_ACTIVITIES,
    })),
    on(ReadingActivitiesActions.createActivity, state => ({
        ...state,
        status: ReadingActivityStateStatus.CREATING_ACTIVITY,
    })),
    on(ReadingActivitiesActions.updateActivity, state => ({
        ...state,
        status: ReadingActivityStateStatus.UPDATING_ACTIVITY,
    })),
    on(ReadingActivitiesActions.deleteActivity, state => ({
        ...state,
        status: ReadingActivityStateStatus.DELETING_ACTIVITY,
    })),

    // Handle failure cases
    on(
        ReadingActivitiesActions.loadActivityFailed,
        ReadingActivitiesActions.loadActivitiesFailed,
        ReadingActivitiesActions.createActivityFailed,
        ReadingActivitiesActions.updateActivityFailed,
        ReadingActivitiesActions.deleteActivityFailed,
        (state, { error }) => ({ ...state, status: ReadingActivityStateStatus.IDLING, error }),
    ),

    // Handle success cases
    on(ReadingActivitiesActions.loadActivitySuccess, (state, { activity }) => ({
        ...state,
        status: ReadingActivityStateStatus.IDLING,
        selectedActivity: activity,
    })),
    on(ReadingActivitiesActions.loadActivitiesSuccess, (state, { activities }) => ({
        ...state,
        status: ReadingActivityStateStatus.IDLING,
        activities,
    })),
    on(ReadingActivitiesActions.createActivitySuccess, (state, { activity }) => ({
        ...state,
        status: ReadingActivityStateStatus.IDLING,
        activities: [activity, ...state.activities],
    })),
    on(ReadingActivitiesActions.updateActivitySuccess, (state, { activity: updatedActivity }) => ({
        ...state,
        status: ReadingActivityStateStatus.IDLING,
        selectedActivity:
            state.selectedActivity?._id === updatedActivity._id
                ? updatedActivity
                : state.selectedActivity,
        activities: state.activities.map(a =>
            a._id === updatedActivity._id ? updatedActivity : a,
        ),
    })),
    on(ReadingActivitiesActions.deleteActivitySuccess, (state, { id }) => ({
        ...state,
        status: ReadingActivityStateStatus.IDLING,
        selectedActivity: state.selectedActivity?._id === id ? null : state.selectedActivity,
        activities: state.activities.filter(a => a._id !== id),
    })),
)
