import { ClassSection } from "./class-section";

export interface Rubric {
    _id: string;
    user: string;
    title: string;
    rubricType: string;
    section: ClassSection;
    competence: string[];
    achievementIndicators: string[];
    activity: string;
    progressLevels: string[];
    criteria: {
        indicator: string,
        maxScore: number,
        criterion: {
            name: string,
            score: number,
        }[];
    }[];
}
