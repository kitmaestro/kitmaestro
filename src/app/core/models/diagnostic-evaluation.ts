import { EvaluationSection } from '../interfaces';
import { BaseModel } from './base-model';
import { User } from './user';

export interface GeneratedEvaluation extends BaseModel {
	user: User;
	title: string;
	subject: string;
	year: string;
	level: string;
	schoolYear: string;
	sections: EvaluationSection[];
}
