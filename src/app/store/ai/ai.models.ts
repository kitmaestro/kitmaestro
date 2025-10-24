export interface AiState {
    result: string | null
    isGenerating: boolean
    error: string | null
    serializedResult: any
}

export const initialAiState: AiState = {
    result: null,
    isGenerating: false,
    error: null,
    serializedResult: null
}
