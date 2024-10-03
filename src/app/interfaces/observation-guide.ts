import { ClassSection } from './class-section';

export interface ObservationGuide {
    _id: string;
    user: string;
    date: string;
    section: ClassSection;
    duration: string;
    description: string;
    competence: {
        fundamental: string;
        items: string[];
    }[];
    aspects: string[];
}
