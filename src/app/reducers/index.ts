import { isDevMode } from '@angular/core';
import { User } from '@angular/fire/auth';
import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer
} from '@ngrx/store';

export interface State {
  // user: User | null;
}

export const reducers: ActionReducerMap<State> = {
};


export const metaReducers: MetaReducer<State>[] = isDevMode() ? [] : [];
