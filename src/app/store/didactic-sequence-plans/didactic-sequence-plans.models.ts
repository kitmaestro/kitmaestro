import { DidacticPlan, ActivityResource } from '../../core';

export interface DidacticPlanDto {
	didacticSequence: string;
	title: string;
	description: string;
	specificCompetencies: {
		name: string;
		description: string;
	}[];
}

export enum DidacticPlanStateStatus {
	IDLING,
	LOADING_PLANS,
	LOADING_PLAN,
	CREATING_PLAN,
	UPDATING_PLAN,
	DELETING_PLAN,
}

export interface DidacticPlansState {
	plans: DidacticPlan[];
	selectedPlan: DidacticPlan | null;
	error: string | null;
	status: DidacticPlanStateStatus;
}

export const initialDidacticPlansState: DidacticPlansState = {
	plans: [],
	selectedPlan: null,
	error: null,
	status: DidacticPlanStateStatus.IDLING,
};
