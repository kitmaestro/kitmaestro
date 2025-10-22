import { createAction, props } from '@ngrx/store';
import { ScoreSystem } from '../../core/models';
import { ScoreSystemDto } from './score-systems.models';

// Load a single system
export const loadSystem = createAction(
	'[Score Systems] Load System',
	props<{ id: string }>(),
);
export const loadSystemSuccess = createAction(
	'[Score Systems] Load System Success',
	props<{ system: ScoreSystem }>(),
);
export const loadSystemFailed = createAction(
	'[Score Systems] Load System Failed',
	props<{ error: string }>(),
);

// Load all systems
export const loadSystems = createAction('[Score Systems] Load Systems');
export const loadSystemsSuccess = createAction(
	'[Score Systems] Load Systems Success',
	props<{ systems: ScoreSystem[] }>(),
);
export const loadSystemsFailed = createAction(
	'[Score Systems] Load Systems Failed',
	props<{ error: string }>(),
);

// Create a system
export const createSystem = createAction(
	'[Score Systems] Create System',
	props<{ system: Partial<ScoreSystemDto> }>(),
);
export const createSystemSuccess = createAction(
	'[Score Systems] Create System Success',
	props<{ system: ScoreSystem }>(),
);
export const createSystemFailed = createAction(
	'[Score Systems] Create System Failed',
	props<{ error: string }>(),
);

// Update a system
export const updateSystem = createAction(
	'[Score Systems] Update System',
	props<{ id: string; data: Partial<ScoreSystemDto> }>(),
);
export const updateSystemSuccess = createAction(
	'[Score Systems] Update System Success',
	props<{ system: ScoreSystem }>(),
);
export const updateSystemFailed = createAction(
	'[Score Systems] Update System Failed',
	props<{ error: string }>(),
);

// Delete a system
export const deleteSystem = createAction(
	'[Score Systems] Delete System',
	props<{ id: string }>(),
);
export const deleteSystemSuccess = createAction(
	'[Score Systems] Delete System Success',
	props<{ id: string }>(),
);
export const deleteSystemFailed = createAction(
	'[Score Systems] Delete System Failed',
	props<{ error: string }>(),
);
