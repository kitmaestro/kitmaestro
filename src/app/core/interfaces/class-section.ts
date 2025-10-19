import { GRADE, LEVEL, SCHOOL_SUBJECT } from '../enums';
import { School } from './school';

export interface ClassSection {
	_id: string;
	user: string;
	level: string;
	year: string;
	name: string;
	subjects: string[];
}
