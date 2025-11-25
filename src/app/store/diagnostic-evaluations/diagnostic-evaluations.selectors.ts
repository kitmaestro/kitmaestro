import { createFeatureSelector, createSelector } from '@ngrx/store';
import { DiagnosticEvaluationsState, DiagnosticEvaluationStateStatus } from './diagnostic-evaluations.models';

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

export const selectEvaluationsLoading = createSelector(
	selectEvaluationsStatus,
	(state) => state === DiagnosticEvaluationStateStatus.LOADING_EVALUATIONS,
);

export const selectEvaluationLoading = createSelector(
	selectEvaluationsStatus,
	(state) => state === DiagnosticEvaluationStateStatus.LOADING_EVALUATION,
);
