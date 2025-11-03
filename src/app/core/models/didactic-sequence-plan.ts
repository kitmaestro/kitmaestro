import { BaseModel } from './base-model';
import { DidacticSequence } from './didactic-sequence';

export interface DidacticPlan extends BaseModel {
	didacticSequence: DidacticSequence;
	title: string;
	description: string;
	specificCompetencies: {
		name: string;
		description: string;
	}[];
}
