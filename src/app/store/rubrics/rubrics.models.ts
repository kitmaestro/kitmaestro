import { Rubric } from '../../core/models';

export interface RubricDto {
	user: string;
	title: string;
	rubricType: string;
	section: string;
	competence: string[];
	achievementIndicators: string[];
	activity: string;
	progressLevels: string[];
	unitPlan: string;
	criteria: {
		indicator: string;
		maxScore: number;
		criterion: {
			name: string;
			score: number;
		}[];
	}[];
}

export enum RubricStateStatus {
	IDLING,
	LOADING_RUBRICS,
	LOADING_RUBRIC,
	CREATING_RUBRIC,
	UPDATING_RUBRIC,
	DELETING_RUBRIC,
}

export interface RubricsState {
	rubrics: Rubric[];
	selectedRubric: Rubric | null;
	error: string | null;
	status: RubricStateStatus;
}

export const initialRubricsState: RubricsState = {
	rubrics: [],
	selectedRubric: null,
	error: null,
	status: RubricStateStatus.IDLING,
};
