import { createSelector } from "@ngrx/store";
import { AppState } from "../app.state";
import { AuthState } from "../reducers/auth.reducers";

export const selectAuth = (state: AppState) => state.auth

export const userSelector = createSelector(
  selectAuth,
  (auth: AuthState) => auth.user
);

export const loadingUserSelector = createSelector(
  selectAuth,
  (auth: AuthState) => auth.loading
);

export const userResultSelector = createSelector(
  selectAuth,
  (auth: AuthState) => auth.result
);

export const authErrorSelector = createSelector(
  selectAuth,
  (auth: AuthState) => auth.error
);
