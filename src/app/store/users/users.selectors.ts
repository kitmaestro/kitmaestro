import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UsersState, UserStateStatus } from './users.models';

export const selectUsersState = createFeatureSelector<UsersState>('users');

export const selectUsersCurrentUser = createSelector(
	selectUsersState,
	(state) => state.selectedUser,
);

export const selectUsersStatus = createSelector(
	selectUsersState,
	(state) => state.status,
);

export const selectUsersUsers = createSelector(
	selectUsersState,
	(state) => state.users,
);

export const selectUsersError = createSelector(
	selectUsersState,
	(state) => state.error,
);

export const selectUserLoading = createSelector(
	selectUsersStatus,
	(state) => state === UserStateStatus.LOADING_USER,
);

export const selectUsersLoading = createSelector(
	selectUsersStatus,
	(state) => state === UserStateStatus.LOADING_USERS,
);