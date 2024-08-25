export interface Rubric {
    title: string;
    rubricType: string;
    section: string;
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
