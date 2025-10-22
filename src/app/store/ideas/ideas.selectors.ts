import { createFeatureSelector, createSelector } from '@ngrx/store'
import { IdeasState, IdeaStateStatus } from './ideas.models'

export const selectIdeasState = createFeatureSelector<IdeasState>('ideas')

export const selectAllIdeas = createSelector(selectIdeasState, state => state.ideas)

export const selectCurrentIdea = createSelector(selectIdeasState, state => state.selectedIdea)

export const selectIdeasStatus = createSelector(selectIdeasState, state => state.status)

export const selectIdeasError = createSelector(selectIdeasState, state => state.error)

// Selectores de estado booleanos
export const selectIsLoadingMany = createSelector(
    selectIdeasStatus,
    status => status === IdeaStateStatus.LOADING_IDEAS,
)

export const selectIsLoadingOne = createSelector(
    selectIdeasStatus,
    status => status === IdeaStateStatus.LOADING_IDEA,
)

export const selectIsCreating = createSelector(
    selectIdeasStatus,
    status => status === IdeaStateStatus.CREATING_IDEA,
)

export const selectIsUpdating = createSelector(
    selectIdeasStatus,
    status => status === IdeaStateStatus.UPDATING_IDEA,
)

export const selectIsDeleting = createSelector(
    selectIdeasStatus,
    status => status === IdeaStateStatus.DELETING_IDEA,
)
