import { ClassSection } from './class-section';
import { User } from './user';

export interface ClassPeriod {
	subject: string;
	dayOfWeek: number;
	startTime: string;
	endTime: string;
}

export interface ClassSchedule {
	_id: string;
	user: User;
	section: ClassSection;
	format: string;
	periods: ClassPeriod[];
}
