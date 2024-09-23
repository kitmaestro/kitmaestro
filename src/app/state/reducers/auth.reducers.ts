import { createReducer, on } from "@ngrx/store";
import * as AuthActions from '../actions/auth.actions';

export interface AuthState {
  user: any,
  error: any,
}

export const initialState: AuthState = {
  user: null,
  error: null,
};

export const authReducer = createReducer(
  initialState,
  on(AuthActions.loginSuccess, (state, { user, access_token }) => {
    localStorage.setItem('access_token', access_token);
    return { ...state, user }
  }),
  on(AuthActions.loginFailure, (state, error) => ({ ...state, error })),
  on(AuthActions.signupSuccess, (state, { user, access_token }) => {
    localStorage.setItem('access_token', access_token);
    return { ...state, user };
  }),
  on(AuthActions.signupFailure, (state, error) => ({ ...state, error })),
  on(AuthActions.logoutSuccess, (state) => {
    localStorage.removeItem('access_token');
    return { ...state, user: null };
  }),
  on(AuthActions.logoutFailure, (state, { error }) => ({ ...state, error })),
)
