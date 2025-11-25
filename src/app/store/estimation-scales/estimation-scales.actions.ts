import { createAction, props } from '@ngrx/store';
import { EstimationScale } from '../../core/models';
import { EstimationScaleDto } from './estimation-scales.models';

// Load a single scale
export const loadScale = createAction(
	'[Estimation Scales] Load Scale',
	props<{ id: string }>(),
);
export const loadScaleSuccess = createAction(
	'[Estimation Scales] Load Scale Success',
	props<{ scale: EstimationScale }>(),
);
export const loadScaleFailed = createAction(
	'[Estimation Scales] Load Scale Failed',
	props<{ error: string }>(),
);

// Load all scales
export const loadScales = createAction('[Estimation Scales] Load Scales');
export const loadScalesSuccess = createAction(
	'[Estimation Scales] Load Scales Success',
	props<{ scales: EstimationScale[] }>(),
);
export const loadScalesFailed = createAction(
	'[Estimation Scales] Load Scales Failed',
	props<{ error: string }>(),
);

// Create a scale
export const createScale = createAction(
	'[Estimation Scales] Create Scale',
	props<{ scale: Partial<EstimationScaleDto> }>(),
);
export const createScaleSuccess = createAction(
	'[Estimation Scales] Create Scale Success',
	props<{ scale: EstimationScale }>(),
);
export const createScaleFailed = createAction(
	'[Estimation Scales] Create Scale Failed',
	props<{ error: string }>(),
);

// Update a scale
export const updateScale = createAction(
	'[Estimation Scales] Update Scale',
	props<{ id: string; data: Partial<EstimationScaleDto> }>(),
);
export const updateScaleSuccess = createAction(
	'[Estimation Scales] Update Scale Success',
	props<{ scale: EstimationScale }>(),
);
export const updateScaleFailed = createAction(
	'[Estimation Scales] Update Scale Failed',
	props<{ error: string }>(),
);

// Delete a scale
export const deleteScale = createAction(
	'[Estimation Scales] Delete Scale',
	props<{ id: string }>(),
);
export const deleteScaleSuccess = createAction(
	'[Estimation Scales] Delete Scale Success',
	props<{ id: string }>(),
);
export const deleteScaleFailed = createAction(
	'[Estimation Scales] Delete Scale Failed',
	props<{ error: string }>(),
);
