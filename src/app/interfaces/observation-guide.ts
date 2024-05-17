export interface ObservationGuide {
    date: string;
    groupName: string;
    groupId: string;
    duration: string;
    description: string;
    competence: {
        fundamental: string;
        items: string[];
    }[];
    aspects: string[];
}

export const defaultObservationGuide: ObservationGuide = {
    date: '',
    groupName: '',
    groupId: '',
    duration: '',
    description: '',
    competence: [],
    aspects: [],
}
