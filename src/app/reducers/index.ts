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
  DiagnosticEvaluationsState,
  diagnosticEvaluationsReducer,
  estimationScalesReducer,
  EstimationScalesState,
} from '../store';

export interface State {
  auth: AuthState,
  users: UsersState,
  classPlans: ClassPlanState,
  classSections: ClassSectionsState,
  checklists: ChecklistsState,
  contentBlocks: ContentBlocksState,
  diagnosticEvaluations: DiagnosticEvaluationsState,
  estimationScales: EstimationScalesState,
}

export const reducers: ActionReducerMap<State> = {
  auth: authReducer,
  users: usersReducer,
  classPlans: classPlansReducer,
  classSections: classSectionsReducer,
  checklists: checklistsReducer,
  contentBlocks: contentBlocksReducer,
  diagnosticEvaluations: diagnosticEvaluationsReducer,
  estimationScales: estimationScalesReducer,
};

export const metaReducers: MetaReducer<State>[] = isDevMode() ? [] : [];
