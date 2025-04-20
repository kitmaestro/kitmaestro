import { ClassSection } from './class-section';

export interface ObservationGuide {
	_id: string;
	user: string;
	title: string;
	date: string;
	section: ClassSection;
	individual: boolean;
	duration: string;
	description: string;
	competence: {
		fundamental: string;
		items: string[];
	}[];
	aspects: string[];
}
