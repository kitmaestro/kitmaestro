import { createReducer, on } from '@ngrx/store';
import { initialAiState } from './ai.models';
import * as AiActions from './ai.actions';

export const aiReducer = createReducer(
	initialAiState,
	on(AiActions.askGemini, (state) => {
		return {
			...state,
			isGenerating: true,
			error: null,
		};
	}),
	on(AiActions.askGeminiSuccess, (state, { result }) => {
		try {
			let jsonString = '';
			const firstBracket = result.indexOf('{');
			const lastBracket = result.lastIndexOf('}') + 1;
			const firstSquareBracket = result.indexOf('[');
			const lastSquareBracket = result.lastIndexOf(']') + 1;
			if (
				firstBracket > -1 &&
				firstSquareBracket > -1 &&
				firstBracket < firstSquareBracket
			) {
				jsonString = result.substring(firstBracket, lastBracket);
			} else if (
				firstBracket > -1 &&
				firstSquareBracket > -1 &&
				firstBracket > firstSquareBracket
			) {
				jsonString = result.substring(
					firstSquareBracket,
					lastSquareBracket,
				);
			} else if (firstBracket > -1 && firstSquareBracket > -1) {
				jsonString = result.substring(firstBracket, lastBracket);
			} else if (firstSquareBracket > -1) {
				jsonString = result.substring(
					firstSquareBracket,
					lastSquareBracket,
				);
			} else {
				jsonString = 'null';
			}
			const serializedResult = jsonString ? JSON.parse(jsonString) : null;
			return {
				...state,
				isGenerating: false,
				result,
				serializedResult,
				error: null,
			};
		} catch (err: any) {
			console.log(err);
			console.log(result);
			return {
				...state,
				isGenerating: false,
				result,
				serializedResult: null,
				error: err.message,
			};
		}
	}),
	on(AiActions.askGeminiFailure, (state, { error }) => {
		return {
			...state,
			isGenerating: false,
			error,
		};
	}),
	on(AiActions.askGeminiStart, (state) => {
		return {
			...state,
			isGenerating: true,
			error: null,
		};
	}),
	on(AiActions.askGeminiEnd, (state) => {
		return {
			...state,
			isGenerating: false,
		};
	}),
);
