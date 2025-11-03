import { DidacticActivity, DidacticPlan } from '../../core';
import { ActivityResource } from '../../core';

export interface DidacticActivityDto {
	plan: string | DidacticPlan;
	blockTitle: string;
	orderInBlock: number;
	title: string;
	description: string;
	teacherNote: string;
	resources: ActivityResource[];
	startingPage: number;
	endingPage: number;
	durationInMinutes: number;
}

export enum DidacticActivityStateStatus {
	IDLING,
	LOADING_ACTIVITIES,
	LOADING_ACTIVITY,
	CREATING_ACTIVITY,
	UPDATING_ACTIVITY,
	DELETING_ACTIVITY,
}

export interface DidacticActivitiesState {
	activities: DidacticActivity[];
	selectedActivity: DidacticActivity | null;
	error: string | null;
	status: DidacticActivityStateStatus;
}

export const initialDidacticActivitiesState: DidacticActivitiesState = {
	activities: [],
	selectedActivity: null,
	error: null,
	status: DidacticActivityStateStatus.IDLING,
};
