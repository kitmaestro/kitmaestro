import { ActivityResource } from '../models';

export interface DidacticSequenceBlock {
	title: string;
	competence: string;
	initialSession: {
		description: string;
		resources: ActivityResource[];
		startingPage: number;
		lastPage: number;
		durationInHours: number;
	};
	activities: {
		order: number;
		name: string;
		description: string;
		notes: string;
		resources: ActivityResource[];
		startingPage: number;
		lastPage: number;
		durationInHours: number;
	}[];
}
