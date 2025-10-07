import { ClassSection } from './class-section';
import { User } from './user';

export interface ClassPlan {
	_id: string;
	user: User;
	date: Date;
	section: ClassSection;
	subject: string;
	unitPlan: string;
	objective: string;
	strategies: string[];
	introduction: {
		duration: number;
		activities: string[];
		resources: string[];
		layout: string;
	};
	main: {
		duration: number;
		activities: string[];
		resources: string[];
		layout: string;
	};
	closing: {
		duration: number;
		activities: string[];
		resources: string[];
		layout: string;
	};
	supplementary: {
		activities: string[];
		resources: string[];
		layout: string;
	};
	vocabulary: string[];
	readings: string;
	competence: string;
	createdAt?: Date;
}
