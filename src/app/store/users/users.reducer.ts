import { createReducer, on } from '@ngrx/store';
import * as UsersActions from './users.actions';
import { initialUsersState, UserStateStatus } from './users.models';

export const usersReducer = createReducer(
	initialUsersState,

	on(UsersActions.loadUser, (state) => ({
		...state,
		status: UserStateStatus.LOADING_USER,
	})),
	on(UsersActions.loadUsers, (state) => ({
		...state,
		status: UserStateStatus.LOADING_USERS,
	})),
	on(UsersActions.createUser, (state) => ({
		...state,
		status: UserStateStatus.CREATING_USER,
	})),
	on(UsersActions.updateUser, (state) => ({
		...state,
		status: UserStateStatus.UPDATING_USER,
	})),
	on(UsersActions.deleteUser, (state) => ({
		...state,
		status: UserStateStatus.DELETING_USER,
	})),

	on(UsersActions.loadUserFailed, (state, { error }) => ({
		...state,
		status: UserStateStatus.IDLING,
		error,
	})),
	on(UsersActions.loadUsersFailed, (state, { error }) => ({
		...state,
		status: UserStateStatus.IDLING,
		error,
	})),
	on(UsersActions.createUserFailed, (state, { error }) => ({
		...state,
		status: UserStateStatus.IDLING,
		error,
	})),
	on(UsersActions.updateUserFailed, (state, { error }) => ({
		...state,
		status: UserStateStatus.IDLING,
		error,
	})),
	on(UsersActions.deleteUserFailed, (state, { error }) => ({
		...state,
		status: UserStateStatus.IDLING,
		error,
	})),

	on(UsersActions.loadUserSuccess, (state, { user }) => ({
		...state,
		status: UserStateStatus.IDLING,
		selectedUser: user,
	})),
	on(UsersActions.loadUsersSuccess, (state, { users }) => ({
		...state,
		status: UserStateStatus.IDLING,
		users,
	})),
	on(UsersActions.createUserSuccess, (state, { user }) => ({
		...state,
		status: UserStateStatus.IDLING,
		users: [user, ...state.users],
	})),
	on(UsersActions.updateUserSuccess, (state, { user }) => ({
		...state,
		status: UserStateStatus.IDLING,
		selectedUser: user,
		users: [...state.users.map((u) => (u._id !== u._id ? u : user))],
	})),
	on(UsersActions.deleteUserSuccess, (state, { userId }) => ({
		...state,
		status: UserStateStatus.IDLING,
		selectedUser: null,
		users: [...state.users.filter((user) => user._id !== userId)],
	})),
);
