import { SchoolSubject } from '../enums/school-subject.enum';

export interface ClassBlock {
	id: string;
	subject: SchoolSubject;
	position: number;
	duration: 45 | 90;
}
