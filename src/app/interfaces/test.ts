import { ClassSection } from './class-section';
import { UserSettings } from './user-settings';

export interface Test {
	_id: string;
	section: ClassSection;
	subject: string;
	user: UserSettings;
	body: string;
	answers: string;
}
