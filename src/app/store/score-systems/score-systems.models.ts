import { ScoreSystem } from '../../core/models';

export interface ScoreSystemDto {
	section: string;
	user: string;
	content: string[];
	activities: string[];
}

export enum ScoreSystemStateStatus {
	IDLING,
	LOADING_SYSTEMS,
	LOADING_SYSTEM,
	CREATING_SYSTEM,
	UPDATING_SYSTEM,
	DELETING_SYSTEM,
}

export interface ScoreSystemsState {
	systems: ScoreSystem[];
	selectedSystem: ScoreSystem | null;
	error: string | null;
	status: ScoreSystemStateStatus;
}

export const initialScoreSystemsState: ScoreSystemsState = {
	systems: [],
	selectedSystem: null,
	error: null,
	status: ScoreSystemStateStatus.IDLING,
};
