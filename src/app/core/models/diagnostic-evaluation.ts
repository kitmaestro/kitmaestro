import { EvaluationSection } from '../interfaces';
import { BaseModel } from './base-model';
import { User } from './user';

export interface GeneratedEvaluation extends BaseModel {
	user: User;
	year: string;
	level: string;
	title: string;
	subject: string;
	schoolYear: string;
	sections: EvaluationSection[];
}
