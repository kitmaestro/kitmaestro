import { createAction, props } from '@ngrx/store';
import { ApiErrorResponse } from '../../interfaces/api-error-response';
import { ApiUpdateResponse } from '../../interfaces/api-update-response';
import { UserSettings } from '../../interfaces/user-settings';

export const load = createAction('[Auth] Load');

export const loadSuccess = createAction(
	'[Auth] Load Success',
	props<{ user: UserSettings }>(),
);

export const loadFailure = createAction(
	'[Auth] Load Failure',
	props<{ error: ApiErrorResponse }>(),
);

export const login = createAction(
	'[Auth] Login',
	props<{ email: string; password: string }>(),
);

export const loginWithGoogle = createAction(
	'[Auth] Login with google',
	props<{ email: string; displayName: string; photoURL: string }>(),
);

export const loginSuccess = createAction(
	'[Auth] Login Success',
	props<{ user: UserSettings; access_token: string }>(),
);

export const loginFailure = createAction(
	'[Auth] Login Failure',
	props<{ error: ApiErrorResponse }>(),
);

export const signup = createAction(
	'[Auth] Signup',
	props<{ email: string; password: string }>(),
);

export const signupSuccess = createAction(
	'[Auth] Signup Success',
	props<{ user: UserSettings; access_token: string }>(),
);

export const signupFailure = createAction(
	'[Auth] Signup Failure',
	props<{ error: ApiErrorResponse }>(),
);

export const logout = createAction('[Auth] Logout');

export const logoutSuccess = createAction('[Auth] Logout Success');

export const logoutFailure = createAction(
	'[Auth] Logout Failure',
	props<{ error: any }>(),
);

export const update = createAction(
	'[Auth] Update',
	props<{ user: UserSettings }>(),
);

export const updateSuccess = createAction(
	'[Auth] Update Success',
	props<{ result: ApiUpdateResponse }>(),
);

export const updateFailure = createAction(
	'[Auth] Update Failure',
	props<{ error: any }>(),
);
