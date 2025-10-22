import { createAction, props } from '@ngrx/store';
import { Idea } from '../../core/models';
import { IdeaDto } from './ideas.models';

// Load a single idea
export const loadIdea = createAction(
	'[Ideas] Load Idea',
	props<{ id: string }>(),
);
export const loadIdeaSuccess = createAction(
	'[Ideas] Load Idea Success',
	props<{ idea: Idea }>(),
);
export const loadIdeaFailed = createAction(
	'[Ideas] Load Idea Failed',
	props<{ error: string }>(),
);

// Load all ideas
export const loadIdeas = createAction('[Ideas] Load Ideas');
export const loadIdeasSuccess = createAction(
	'[Ideas] Load Ideas Success',
	props<{ ideas: Idea[] }>(),
);
export const loadIdeasFailed = createAction(
	'[Ideas] Load Ideas Failed',
	props<{ error: string }>(),
);

// Create an idea
export const createIdea = createAction(
	'[Ideas] Create Idea',
	props<{ idea: Partial<IdeaDto> }>(),
);
export const createIdeaSuccess = createAction(
	'[Ideas] Create Idea Success',
	props<{ idea: Idea }>(),
);
export const createIdeaFailed = createAction(
	'[Ideas] Create Idea Failed',
	props<{ error: string }>(),
);

// Update an idea
export const updateIdea = createAction(
	'[Ideas] Update Idea',
	props<{ id: string; data: Partial<IdeaDto> }>(),
);
export const updateIdeaSuccess = createAction(
	'[Ideas] Update Idea Success',
	props<{ idea: Idea }>(),
);
export const updateIdeaFailed = createAction(
	'[Ideas] Update Idea Failed',
	props<{ error: string }>(),
);

// Delete an idea
export const deleteIdea = createAction(
	'[Ideas] Delete Idea',
	props<{ id: string }>(),
);
export const deleteIdeaSuccess = createAction(
	'[Ideas] Delete Idea Success',
	props<{ id: string }>(),
);
export const deleteIdeaFailed = createAction(
	'[Ideas] Delete Idea Failed',
	props<{ error: string }>(),
);
