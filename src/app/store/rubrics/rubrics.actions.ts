import { createAction, props } from '@ngrx/store';
import { Rubric } from '../../core/models';
import { RubricDto } from './rubrics.models';

// Load a single rubric
export const loadRubric = createAction(
	'[Rubrics] Load Rubric',
	props<{ id: string }>(),
);
export const loadRubricSuccess = createAction(
	'[Rubrics] Load Rubric Success',
	props<{ rubric: Rubric }>(),
);
export const loadRubricFailed = createAction(
	'[Rubrics] Load Rubric Failed',
	props<{ error: string }>(),
);

// Load all rubrics
export const loadRubrics = createAction(
	'[Rubrics] Load Rubrics',
	props<{ filter: any }>(),
);
export const loadRubricsSuccess = createAction(
	'[Rubrics] Load Rubrics Success',
	props<{ rubrics: Rubric[] }>(),
);
export const loadRubricsFailed = createAction(
	'[Rubrics] Load Rubrics Failed',
	props<{ error: string }>(),
);

// Create a rubric
export const createRubric = createAction(
	'[Rubrics] Create Rubric',
	props<{ rubric: Partial<RubricDto> }>(),
);
export const createRubricSuccess = createAction(
	'[Rubrics] Create Rubric Success',
	props<{ rubric: Rubric }>(),
);
export const createRubricFailed = createAction(
	'[Rubrics] Create Rubric Failed',
	props<{ error: string }>(),
);

// Update a rubric
export const updateRubric = createAction(
	'[Rubrics] Update Rubric',
	props<{ id: string; data: Partial<RubricDto> }>(),
);
export const updateRubricSuccess = createAction(
	'[Rubrics] Update Rubric Success',
	props<{ rubric: Rubric }>(),
);
export const updateRubricFailed = createAction(
	'[Rubrics] Update Rubric Failed',
	props<{ error: string }>(),
);

// Delete a rubric
export const deleteRubric = createAction(
	'[Rubrics] Delete Rubric',
	props<{ id: string }>(),
);
export const deleteRubricSuccess = createAction(
	'[Rubrics] Delete Rubric Success',
	props<{ id: string }>(),
);
export const deleteRubricFailed = createAction(
	'[Rubrics] Delete Rubric Failed',
	props<{ error: string }>(),
);

// Download a rubric
export const downloadRubric = createAction(
	'[Rubrics] Download Rubric',
	props<{ rubric: Rubric }>(),
);
export const downloadRubricSuccess = createAction(
	'[Rubrics] Download Rubric Success',
);
export const downloadRubricFailed = createAction(
	'[Rubrics] Download Rubric Failed',
	props<{ error: string }>(),
);
