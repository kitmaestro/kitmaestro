import { ClassSection } from './class-section';
import { User } from './user';
import { BaseModel } from './base-model';

export interface ReadingActivity extends BaseModel {
	user: User;
	section: ClassSection;
	difficulty: string;
	level: string;
	title: string;
	text: string;
	questions: string[];
}
