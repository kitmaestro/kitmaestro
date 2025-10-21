import { UnitPlan } from '../../core/models';

export interface UnitPlanDto {
	user: string;
	section: string;
	sections: string[];
	duration: number;
	learningSituation: string;
	title: string;
	competence: string[];
	mainThemeCategory: string;
	mainThemes: string[];
	subjects: string[];
	strategies: string[];
	contents: string[];
	resources: string[];
	instruments: string[];
	teacherActivities: {
		subject: string;
		activities: string[];
	}[];
	studentActivities: {
		subject: string;
		activities: string[];
	}[];
	evaluationActivities: {
		subject: string;
		activities: string[];
	}[];
}

export enum UnitPlanStateStatus {
	IDLING,
	LOADING_PLANS,
	LOADING_PLAN,
	CREATING_PLAN,
	UPDATING_PLAN,
	DELETING_PLAN,
}

export interface UnitPlansState {
	unitPlans: UnitPlan[];
	selectedPlan: UnitPlan | null;
	error: string | null;
	totalPlans: number;
	status: UnitPlanStateStatus;
}

export const initialUnitPlansState: UnitPlansState = {
	unitPlans: [],
	selectedPlan: null,
	error: null,
	totalPlans: 0,
	status: UnitPlanStateStatus.IDLING,
};
