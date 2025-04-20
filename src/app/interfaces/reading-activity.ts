import { ClassSection } from './class-section';
import { UserSettings } from './user-settings';

export interface ReadingActivity {
	_id: string;
	user: UserSettings;
	section: ClassSection;
	difficulty: string;
	level: string;
	title: string;
	text: string;
	questions: string[];
	createdAt?: Date;
}
