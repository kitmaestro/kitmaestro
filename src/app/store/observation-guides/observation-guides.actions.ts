import { createAction, props } from '@ngrx/store';
import { ObservationGuide } from '../../core/models';
import { ObservationGuideDto } from './observation-guides.models';

// Load a single guide
export const loadGuide = createAction(
	'[Observation Guides] Load Guide',
	props<{ id: string }>(),
);
export const loadGuideSuccess = createAction(
	'[Observation Guides] Load Guide Success',
	props<{ guide: ObservationGuide }>(),
);
export const loadGuideFailed = createAction(
	'[Observation Guides] Load Guide Failed',
	props<{ error: string }>(),
);

// Load all guides
export const loadGuides = createAction('[Observation Guides] Load Guides');
export const loadGuidesSuccess = createAction(
	'[Observation Guides] Load Guides Success',
	props<{ guides: ObservationGuide[] }>(),
);
export const loadGuidesFailed = createAction(
	'[Observation Guides] Load Guides Failed',
	props<{ error: string }>(),
);

// Create a guide
export const createGuide = createAction(
	'[Observation Guides] Create Guide',
	props<{ guide: Partial<ObservationGuideDto> }>(),
);
export const createGuideSuccess = createAction(
	'[Observation Guides] Create Guide Success',
	props<{ guide: ObservationGuide }>(),
);
export const createGuideFailed = createAction(
	'[Observation Guides] Create Guide Failed',
	props<{ error: string }>(),
);

// Update a guide
export const updateGuide = createAction(
	'[Observation Guides] Update Guide',
	props<{ id: string; data: Partial<ObservationGuideDto> }>(),
);
export const updateGuideSuccess = createAction(
	'[Observation Guides] Update Guide Success',
	props<{ guide: ObservationGuide }>(),
);
export const updateGuideFailed = createAction(
	'[Observation Guides] Update Guide Failed',
	props<{ error: string }>(),
);

// Delete a guide
export const deleteGuide = createAction(
	'[Observation Guides] Delete Guide',
	props<{ id: string }>(),
);
export const deleteGuideSuccess = createAction(
	'[Observation Guides] Delete Guide Success',
	props<{ id: string }>(),
);
export const deleteGuideFailed = createAction(
	'[Observation Guides] Delete Guide Failed',
	props<{ error: string }>(),
);
