import { TableOfContentsItem } from '../interfaces';
import { SchoolLevel, TSchoolSubject, SchoolYear } from '../types';
import { BaseModel } from './base-model';

export interface DidacticSequence extends BaseModel {
	level: SchoolLevel;
	year: SchoolYear;
	subject: TSchoolSubject;
	tableOfContents: TableOfContentsItem[];
}
