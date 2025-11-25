import { ClassSection, User, ReadingActivity } from '../../core/models';

export interface ReadingActivityDto {
	user: string | User;
	section: string | ClassSection;
	difficulty: string;
	level: string;
	title: string;
	text: string;
	questions: string[];
}

export enum ReadingActivityStateStatus {
	IDLING,
	LOADING_ACTIVITIES,
	LOADING_ACTIVITY,
	CREATING_ACTIVITY,
	UPDATING_ACTIVITY,
	DELETING_ACTIVITY,
}

export interface ReadingActivitiesState {
	activities: ReadingActivity[];
	selectedActivity: ReadingActivity | null;
	error: string | null;
	status: ReadingActivityStateStatus;
}

export const initialReadingActivitiesState: ReadingActivitiesState = {
	activities: [],
	selectedActivity: null,
	error: null,
	status: ReadingActivityStateStatus.IDLING,
};
