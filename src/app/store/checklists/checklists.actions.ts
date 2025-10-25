import { createAction, props } from '@ngrx/store';
import { Checklist } from '../../core/models';
import { ChecklistDto } from './checklists.models';

// Load a single checklist
export const loadChecklist = createAction(
	'[Checklists] Load Checklist',
	props<{ id: string }>(),
);
export const loadChecklistSuccess = createAction(
	'[Checklists] Load Checklist Success',
	props<{ checklist: Checklist }>(),
);
export const loadChecklistFailed = createAction(
	'[Checklists] Load Checklist Failed',
	props<{ error: string }>(),
);

// Load all checklists
export const loadChecklists = createAction('[Checklists] Load Checklists');
export const loadChecklistsSuccess = createAction(
	'[Checklists] Load Checklists Success',
	props<{ checklists: Checklist[] }>(),
);
export const loadChecklistsFailed = createAction(
	'[Checklists] Load Checklists Failed',
	props<{ error: string }>(),
);

// Create a checklist
export const createChecklist = createAction(
	'[Checklists] Create Checklist',
	props<{ checklist: Partial<ChecklistDto> }>(),
);
export const createChecklistSuccess = createAction(
	'[Checklists] Create Checklist Success',
	props<{ checklist: Checklist }>(),
);
export const createChecklistFailed = createAction(
	'[Checklists] Create Checklist Failed',
	props<{ error: string }>(),
);

// Update a checklist
export const updateChecklist = createAction(
	'[Checklists] Update Checklist',
	props<{ id: string; data: Partial<ChecklistDto> }>(),
);
export const updateChecklistSuccess = createAction(
	'[Checklists] Update Checklist Success',
	props<{ checklist: Checklist }>(),
);
export const updateChecklistFailed = createAction(
	'[Checklists] Update Checklist Failed',
	props<{ error: string }>(),
);

// Delete a checklist
export const deleteChecklist = createAction(
	'[Checklists] Delete Checklist',
	props<{ id: string }>(),
);
export const deleteChecklistSuccess = createAction(
	'[Checklists] Delete Checklist Success',
	props<{ id: string }>(),
);
export const deleteChecklistFailed = createAction(
	'[Checklists] Delete Checklist Failed',
	props<{ error: string }>(),
);

// Download a checklist
export const downloadChecklist = createAction(
	'[Checklists] Download Checklist',
	props<{ checklist: Checklist }>(),
);
export const downloadChecklistSuccess = createAction('[Checklists] Download Checklist Success');
export const downloadChecklistFailed = createAction(
	'[Checklists] Download Checklist Failed',
	props<{ error: string }>(),
);
