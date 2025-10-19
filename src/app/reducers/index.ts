import { isDevMode } from '@angular/core';
import {
  ActionReducerMap,
  MetaReducer
} from '@ngrx/store';
import { AuthState, authReducer } from '../store/auth'
import { UsersState, usersReducer } from '../store/users';

export interface State {
  auth: AuthState,
  users: UsersState,
}

export const reducers: ActionReducerMap<State> = {
  auth: authReducer,
  users: usersReducer,
};

export const metaReducers: MetaReducer<State>[] = isDevMode() ? [] : [];
