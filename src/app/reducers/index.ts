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
  ClassSectionsState,
  ChecklistsState,
  checklistsReducer,
  ContentBlocksState,
  contentBlocksReducer,
} from '../store';

export interface State {
  auth: AuthState,
  users: UsersState,
  classPlans: ClassPlanState,
  classSections: ClassSectionsState,
  checklists: ChecklistsState,
  contentBlocks: ContentBlocksState,
}

export const reducers: ActionReducerMap<State> = {
  auth: authReducer,
  users: usersReducer,
  classPlans: classPlansReducer,
  classSections: classSectionsReducer,
  checklists: checklistsReducer,
  contentBlocks: contentBlocksReducer,
};

export const metaReducers: MetaReducer<State>[] = isDevMode() ? [] : [];
