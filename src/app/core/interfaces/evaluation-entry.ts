export interface EvaluationEntry {
	subject: string;
	specificCompetenceAspect: string;
	achievementIndicators: string[];
	criteria: string[];
	evaluationBlocks: {
		achievementIndicatorAspect: string;
		competence: string;
		evidences: string[];
		instrument: string;
		weighting: number;
	}[];
}
