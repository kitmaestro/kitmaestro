import { ClassSection } from './class-section';

export interface EstimationScale {
    _id: string;
    user: string;
    title: string;
    section: ClassSection;
    subject: string;
    competence: string[];
    achievementIndicators: string[];
    activity: string;
    criteria: string[];
    levels: string[];
}
