import { createReducer, on } from "@ngrx/store";
import * as AuthActions from '../actions/auth.actions';

export interface AuthState {
  user: any,
  error: any,
  result: any,
  loading: boolean,
}

export const initialState: AuthState = {
  user: null,
  error: null,
  result: null,
  loading: true,
};

export const authReducer = createReducer(
  initialState,
  on(AuthActions.loadSuccess, (state, { user }) => ({ ...state, user, loading: false })),
  on(AuthActions.loadFailure, (state) => {
    localStorage.removeItem('access_token');
    return { ...state, user: null, loading: false };
  }),
  on(AuthActions.loginSuccess, (state, { user, access_token }) => {
    localStorage.setItem('access_token', access_token);
    return { ...state, user, loading: false }
  }),
  on(AuthActions.loginFailure, (state, error) => ({ ...state, error, loading: false })),
  on(AuthActions.signupSuccess, (state, { user, access_token }) => {
    localStorage.setItem('access_token', access_token);
    return { ...state, user, loading: false };
  }),
  on(AuthActions.signupFailure, (state, error) => ({ ...state, error, loading: false })),
  on(AuthActions.logoutSuccess, (state) => {
    localStorage.removeItem('access_token');
    return { ...state, user: null, loading: false };
  }),
  on(AuthActions.logoutFailure, (state, { error }) => ({ ...state, error, loading: false })),
  on(AuthActions.updateSuccess, (state, { result }) => ({ ...state, result, loading: false })),
  on(AuthActions.updateFailure, (state, { error }) => ({ ...state, error, loading: false })),
)
