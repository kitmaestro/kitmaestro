import { createFeatureSelector, createSelector } from '@ngrx/store';
import { DiagnosticEvaluationsState } from './diagnostic-evaluations.models';

export const selectDiagnosticEvaluationsState =
	createFeatureSelector<DiagnosticEvaluationsState>('diagnosticEvaluations');

export const selectAllEvaluations = createSelector(
	selectDiagnosticEvaluationsState,
	(state) => state.evaluations,
);

export const selectCurrentEvaluation = createSelector(
	selectDiagnosticEvaluationsState,
	(state) => state.selectedEvaluation,
);

export const selectEvaluationsStatus = createSelector(
	selectDiagnosticEvaluationsState,
	(state) => state.status,
);

export const selectEvaluationsError = createSelector(
	selectDiagnosticEvaluationsState,
	(state) => state.error,
);
