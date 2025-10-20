import { createReducer, on } from '@ngrx/store'
import * as DiagnosticEvaluationsActions from './diagnostic-evaluations.actions'
import {
    initialDiagnosticEvaluationsState,
    DiagnosticEvaluationStateStatus,
} from './diagnostic-evaluations.models'

export const diagnosticEvaluationsReducer = createReducer(
    initialDiagnosticEvaluationsState,

    // Set status for ongoing operations
    on(DiagnosticEvaluationsActions.loadEvaluation, state => ({
        ...state,
        status: DiagnosticEvaluationStateStatus.LOADING_EVALUATION,
    })),
    on(DiagnosticEvaluationsActions.loadEvaluations, state => ({
        ...state,
        status: DiagnosticEvaluationStateStatus.LOADING_EVALUATIONS,
    })),
    on(DiagnosticEvaluationsActions.createEvaluation, state => ({
        ...state,
        status: DiagnosticEvaluationStateStatus.CREATING_EVALUATION,
    })),
    on(DiagnosticEvaluationsActions.updateEvaluation, state => ({
        ...state,
        status: DiagnosticEvaluationStateStatus.UPDATING_EVALUATION,
    })),
    on(DiagnosticEvaluationsActions.deleteEvaluation, state => ({
        ...state,
        status: DiagnosticEvaluationStateStatus.DELETING_EVALUATION,
    })),

    // Handle failure cases
    on(
        DiagnosticEvaluationsActions.loadEvaluationFailed,
        DiagnosticEvaluationsActions.loadEvaluationsFailed,
        DiagnosticEvaluationsActions.createEvaluationFailed,
        DiagnosticEvaluationsActions.updateEvaluationFailed,
        DiagnosticEvaluationsActions.deleteEvaluationFailed,
        (state, { error }) => ({ ...state, status: DiagnosticEvaluationStateStatus.IDLING, error }),
    ),

    // Handle success cases
    on(DiagnosticEvaluationsActions.loadEvaluationSuccess, (state, { evaluation }) => ({
        ...state,
        status: DiagnosticEvaluationStateStatus.IDLING,
        selectedEvaluation: evaluation,
    })),
    on(DiagnosticEvaluationsActions.loadEvaluationsSuccess, (state, { evaluations }) => ({
        ...state,
        status: DiagnosticEvaluationStateStatus.IDLING,
        evaluations,
    })),
    on(DiagnosticEvaluationsActions.createEvaluationSuccess, (state, { evaluation }) => ({
        ...state,
        status: DiagnosticEvaluationStateStatus.IDLING,
        evaluations: [evaluation, ...state.evaluations],
    })),
    on(DiagnosticEvaluationsActions.updateEvaluationSuccess, (state, { evaluation }) => ({
        ...state,
        status: DiagnosticEvaluationStateStatus.IDLING,
        selectedEvaluation:
            state.selectedEvaluation?._id === evaluation._id
                ? evaluation
                : state.selectedEvaluation,
        evaluations: state.evaluations.map(e => (e._id === evaluation._id ? evaluation : e)),
    })),
    on(DiagnosticEvaluationsActions.deleteEvaluationSuccess, (state, { id }) => ({
        ...state,
        status: DiagnosticEvaluationStateStatus.IDLING,
        selectedEvaluation: state.selectedEvaluation?._id === id ? null : state.selectedEvaluation,
        evaluations: state.evaluations.filter(e => e._id !== id),
    })),
)
