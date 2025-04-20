import { createAction, props } from '@ngrx/store';
import { Update } from '../../interfaces/update';

export const loadUpdates = createAction('[Updates] load');

export const loadUpdatesSuccess = createAction(
	'[Updates] load success',
	props<{ updates: Update[] }>(),
);

export const loadUpdatesFailure = createAction(
	'[Updates] load failure',
	props<{ error: any }>(),
);
