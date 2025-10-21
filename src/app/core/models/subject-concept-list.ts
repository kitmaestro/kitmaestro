import { BaseModel } from './base-model';

export interface SubjectConceptList extends BaseModel {
	subject: string;
	level: string;
	grade: string;
	concepts: string[];
}
