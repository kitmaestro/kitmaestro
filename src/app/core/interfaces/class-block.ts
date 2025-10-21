import { SCHOOL_SUBJECT } from '../enums/school-subject.enum';

export interface ClassBlock {
	id: string;
	subject: SCHOOL_SUBJECT;
	position: number;
	duration: 45 | 90;
}
