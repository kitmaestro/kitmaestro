import { createReducer, on } from '@ngrx/store';
import * as UpdatesActions from '../actions/updates.actions';

export interface UpdatesState {
	updates: any;
	error: any;
}

export const initialState: UpdatesState = {
	updates: [],
	error: null,
};

export const updatesReducer = createReducer(
	initialState,
	on(UpdatesActions.loadUpdatesSuccess, (state, { updates }) => ({
		...state,
		updates,
	})),
	on(UpdatesActions.loadUpdatesFailure, (state, { error }) => ({
		...state,
		error,
	})),
);
