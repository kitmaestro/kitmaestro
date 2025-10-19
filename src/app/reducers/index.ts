import { isDevMode } from '@angular/core';
import {
  ActionReducerMap,
  MetaReducer
} from '@ngrx/store';
import {
  AuthState,
  authReducer,
  UsersState,
  usersReducer,
  ClassPlanState,
  classPlansReducer,
  classSectionsReducer,
  ClassSectionsState
} from '../store';

export interface State {
  auth: AuthState,
  users: UsersState,
  classPlans: ClassPlanState,
  classSections: ClassSectionsState,
}

export const reducers: ActionReducerMap<State> = {
  auth: authReducer,
  users: usersReducer,
  classPlans: classPlansReducer,
  classSections: classSectionsReducer,
};

export const metaReducers: MetaReducer<State>[] = isDevMode() ? [] : [];
