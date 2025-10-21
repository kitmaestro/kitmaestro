import { EvaluationArea, FundamentalCompetence } from '../interfaces'

export interface EvaluationPlan {
	user: string;
	section: string;
	title: string;
	fundamentalCompetences: FundamentalCompetence[];
	evaluationAreas: EvaluationArea[];
	createdAt: Date;
}
