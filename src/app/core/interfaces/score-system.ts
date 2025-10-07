import { ClassSection } from './class-section';
import { User } from './user';
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
	user: User;
	content: ContentBlock[];
	activities: GradingActivity[];
}
