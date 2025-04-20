import { ClassSection } from './class-section';
import { UserSettings } from './user-settings';
import { ContentBlock } from './content-block';

export interface GradingActivity {
	competence: string; // competencia especifica
	criteria: string[]; // criterios de evaluacion
	activity: string; // actividad o trabajo a realizar
	activityType: 'GRUPAL' | 'INDIVIDUAL' | 'AUTOEVALUACION' | 'COEVALUACION';
	points: number; // valor de la actividad
}

export interface GroupedGradingActivity {
	competence: string;
	grading: GradingActivity[];
	total: number;
}

export interface ScoreSystem {
	_id: string;
	section: ClassSection;
	user: UserSettings;
	content: ContentBlock[];
	activities: GradingActivity[];
}
