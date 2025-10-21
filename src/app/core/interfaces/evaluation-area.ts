import { CompetenceAspect } from "./competence-aspect";

export interface EvaluationArea {
	curricularArea: string;
	grade: string;
	evaluationTypes: string[];
	evaluationParticipants: string[];
	competenceAspects: CompetenceAspect[];
}
