import { ClassSection } from './class-section';
import { UserSettings } from './user-settings';

export interface ClassPeriod {
	subject: string;
	dayOfWeek: number;
	startTime: string;
	endTime: string;
}

export interface ClassSchedule {
	_id: string;
	user: UserSettings;
	section: ClassSection;
	format: string;
	periods: ClassPeriod[];
}
