import { createAction, props } from '@ngrx/store';
import { ApiErrorResponse } from '../../interfaces/api-error-response';
import { UserSettings } from '../../interfaces/user-settings';

export const login = createAction('[Auth] Login', props<{ email: string, password: string }>());

export const loginSuccess = createAction('[Auth] Login Success', props<{ user: UserSettings, access_token: string }>());

export const loginFailure = createAction('[Auth] Login Failure', props<ApiErrorResponse>());

export const signup = createAction('[Auth] Signup', props<{ email: string, password: string }>());

export const signupSuccess = createAction('[Auth] Signup Success', props<{ user: UserSettings, access_token: string }>());

export const signupFailure = createAction('[Auth] Signup Failure', props<ApiErrorResponse>());

export const logout = createAction('[Auth] Logout');

export const logoutSuccess = createAction('[Auth] Logout Success');

export const logoutFailure = createAction('[Auth] Logout Failure', props<{ error: any }>());
