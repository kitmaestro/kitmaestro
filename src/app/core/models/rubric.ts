import { BaseModel } from './base-model';
import { ClassSection } from './class-section';
import { UnitPlan } from './unit-plan';
import { User } from './user';

export interface Rubric extends BaseModel {
	user: User;
	title: string;
	rubricType: string;
	section: ClassSection;
	competence: string[];
	achievementIndicators: string[];
	activity: string;
	progressLevels: string[];
	unitPlan: UnitPlan;
	criteria: {
		indicator: string;
		maxScore: number;
		criterion: {
			name: string;
			score: number;
		}[];
	}[];
}
