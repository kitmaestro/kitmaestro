import { createAction, props } from '@ngrx/store';
import { User } from '../../core/models';
import { UserDto } from './users.models';

export const loadUser = createAction(
	'[Users] Load User',
	props<{ userId: string }>(),
);
export const loadUserSuccess = createAction(
	'[Users] Load User Success',
	props<{ user: User }>(),
);
export const loadUserFailed = createAction(
	'[Users] Load User Failed',
	props<{ error: string }>(),
);

export const loadUsers = createAction('[Users] Load Users');
export const loadUsersSuccess = createAction(
	'[Users] Load Users Success',
	props<{ users: User[] }>(),
);
export const loadUsersFailed = createAction(
	'[Users] Load Users Failed',
	props<{ error: string }>(),
);

export const createUser = createAction(
	'[Users] Create User',
	props<{ user: Partial<UserDto> }>(),
);
export const createUserSuccess = createAction(
	'[Users] Create User Success',
	props<{ user: User }>(),
);
export const createUserFailed = createAction(
	'[Users] Create User Failed',
	props<{ error: string }>(),
);

export const updateUser = createAction(
	'[Users] Update User',
	props<{ userId: string; data: Partial<UserDto> }>(),
);
export const updateUserSuccess = createAction(
	'[Users] Update User Success',
	props<{ user: User }>(),
);
export const updateUserFailed = createAction(
	'[Users] Update User Failed',
	props<{ error: string }>(),
);

export const deleteUser = createAction(
	'[Users] Delete User',
	props<{ userId: string }>(),
);
export const deleteUserSuccess = createAction(
	'[Users] Delete User Success',
	props<{ userId: string }>(),
);
export const deleteUserFailed = createAction(
	'[Users] Delete User Failed',
	props<{ error: string }>(),
);
