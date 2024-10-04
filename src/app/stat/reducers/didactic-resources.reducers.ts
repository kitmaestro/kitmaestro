import { createReducer, on } from "@ngrx/store"
import * as DidacticResourcesActions from '../actions/didactic-resources.actions';

export interface DidacticResourceState {
  didacticResources: any,
  result: any,
  error: any,
}

export const initialState: DidacticResourceState = {
  didacticResources: [],
  result: null,
  error: null,
}

export const didacticResourcesReducer = createReducer(
  initialState,
  on(DidacticResourcesActions.loadSuccess, (state, { didacticResources }) => ({ ...state, didacticResources })),
  on(DidacticResourcesActions.loadFailure, (state, { error }) => ({ ...state, error })),
  on(DidacticResourcesActions.createSuccess, (state, { result }) => ({ ...state, result })),
  on(DidacticResourcesActions.createFailure, (state, { error }) => ({ ...state, error })),
  on(DidacticResourcesActions.updateSuccess, (state, { result }) => ({ ...state, result })),
  on(DidacticResourcesActions.updateFailure, (state, { error }) => ({ ...state, error })),
  on(DidacticResourcesActions.removeSuccess, (state, { result }) => ({ ...state, result })),
  on(DidacticResourcesActions.removeFailure, (state, { error }) => ({ ...state, error })),
  on(DidacticResourcesActions.likeSuccess, (state, { result }) => ({ ...state, result })),
  on(DidacticResourcesActions.likeFailure, (state, { error }) => ({ ...state, error })),
  on(DidacticResourcesActions.dislikeSuccess, (state, { result }) => ({ ...state, result })),
  on(DidacticResourcesActions.dislikeFailure, (state, { error }) => ({ ...state, error })),
  on(DidacticResourcesActions.buySuccess, (state, { result }) => ({ ...state, result })),
  on(DidacticResourcesActions.buyFailure, (state, { error }) => ({ ...state, error })),
  on(DidacticResourcesActions.bookmarkSuccess, (state, { result }) => ({ ...state, result })),
  on(DidacticResourcesActions.bookmarkFailure, (state, { error }) => ({ ...state, error })),
  on(DidacticResourcesActions.downloadSuccess, (state, { result }) => ({ ...state, result })),
  on(DidacticResourcesActions.downloadFailure, (state, { error }) => ({ ...state, error })),
);
