import { createFeatureSelector, createSelector } from "@ngrx/store"
import { AiState } from "./ai.models"

export const selectAiState = createFeatureSelector<AiState>('ai')

export const selectAiResult = createSelector(
    selectAiState,
    (state) => state.result
)

export const selectAiSerializedResult = createSelector(
    selectAiState,
    (state) => state.serializedResult
)

export const selectAiError = createSelector(
    selectAiState,
    (state) => state.error
)

export const selectAiIsGenerating = createSelector(
    selectAiState,
    (state) => state.isGenerating
)
