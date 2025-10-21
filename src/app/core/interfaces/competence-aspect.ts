import { Evidence } from "./evidence";

export interface CompetenceAspect {
	aspect: string;
	indicators: string[];
	criteria: string[];
	evidences: Evidence[];
}
