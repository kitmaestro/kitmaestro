export interface EvaluationSection {
    title: string;
    instructions: string;
    questions: {
        type: 'multiple_choice' | 'open_ended' | 'calculation';
        stem: string;
        options?: string[];
    }[];
}

export interface GeneratedEvaluation {
    _id?: string;
    user: string;
    title: string;
    subject: string;
    year: string;
    level: string;
    schoolYear: string;
    sections: EvaluationSection[];
    createdAt?: Date;
}