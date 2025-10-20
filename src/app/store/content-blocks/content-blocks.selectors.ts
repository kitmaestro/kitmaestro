import { createFeatureSelector, createSelector } from '@ngrx/store'
import { ContentBlocksState } from './content-blocks.models'

export const selectContentBlocksState =
    createFeatureSelector<ContentBlocksState>('contentBlocks')

export const selectAllContentBlocks = createSelector(
    selectContentBlocksState,
    state => state.contentBlocks,
)

export const selectCurrentBlock = createSelector(
    selectContentBlocksState,
    state => state.selectedBlock,
)

export const selectContentBlocksStatus = createSelector(
    selectContentBlocksState,
    state => state.status,
)

export const selectContentBlocksError = createSelector(
    selectContentBlocksState,
    state => state.error,
)