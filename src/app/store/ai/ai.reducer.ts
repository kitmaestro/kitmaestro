import { createReducer, on } from "@ngrx/store"
import { initialAiState } from "./ai.models"
import * as AiActions from './ai.actions'

export const aiReducer = createReducer(
    initialAiState,
    on(AiActions.askGemini, (state) => {
        return {
            ...state,
            isGenerating: true,
            error: null,
        }
    }),
    on(AiActions.askGeminiSuccess, (state, { result }) => {
        let jsonString = ''
        if (result.includes('{') && result.includes('}')) {
            const start = result.indexOf('{')
            const end = result.lastIndexOf('}') + 1
            jsonString = result.substring(start, end)
        } else if (result.includes('[') && result.includes(']')) {
            const start = result.indexOf('[')
            const end = result.lastIndexOf(']') + 1
            jsonString = result.substring(start, end)
        }
        const serializedResult = jsonString ? JSON.parse(jsonString) : null
        return {
            ...state,
            isGenerating: false,
            result,
            serializedResult,
            error: null,
        }
    }),
    on(AiActions.askGeminiFailure, (state, { error }) => {
        return {
            ...state,
            isGenerating: false,
            error,
        }
    })
)
