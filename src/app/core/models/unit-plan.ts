import { BaseModel } from './base-model';
import { ClassSection } from './class-section';
import { CompetenceEntry } from './competence-entry';
import { ContentBlock } from './content-block';
import { MainTheme } from './main-theme';
import { User } from './user';

export interface UnitPlan extends BaseModel {
	user: User;
	section: ClassSection;
	sections: ClassSection[];
	duration: number;
	learningSituation: string;
	title: string;
	competence: CompetenceEntry[];
	mainThemeCategory: string;
	mainThemes: MainTheme[];
	subjects: string[];
	strategies: string[];
	contents: ContentBlock[];
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
