import { ClassSection } from './class-section';
import { User } from './user';

export interface ReadingActivity {
	_id: string;
	user: User;
	section: ClassSection;
	difficulty: string;
	level: string;
	title: string;
	text: string;
	questions: string[];
	createdAt?: Date;
}
