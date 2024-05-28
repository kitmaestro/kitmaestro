export interface GeminiResponse {
  candidates: {
    content: {
      parts: {
        text: string
      }[],
      role: string
    },
    finishReason: string,
    index: number,
    safetyRatings: {
      category: string,
      probability: string,
    }[]
  }[],
  usageMetadata: {
    promptTokenCount: number,
    candidatesTokenCount: number,
    totalTokenCount: number
  }
}
