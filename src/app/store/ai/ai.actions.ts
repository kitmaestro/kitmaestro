import { createAction, props } from '@ngrx/store';

export const askGemini = createAction(
	'[AI] Ask Gemini',
	props<{ question: string }>(),
);
export const askGeminiSuccess = createAction(
	'[AI] Ask Gemini Success',
	props<{ result: string }>(),
);
export const askGeminiFailure = createAction(
	'[AI] Ask Gemini Failure',
	props<{ error: string }>(),
);
export const askGeminiStart = createAction('[AI] Ask Gemini Start');
export const askGeminiEnd = createAction('[AI] Ask Gemini End');
