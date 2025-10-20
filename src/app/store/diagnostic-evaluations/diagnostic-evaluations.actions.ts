import { createAction, props } from '@ngrx/store'
import { GeneratedEvaluation } from '../../core/models'
import { DiagnosticEvaluationDto } from './diagnostic-evaluations.models'

// Load a single evaluation
export const loadEvaluation = createAction(
    '[Diagnostic Evaluations] Load Evaluation',
    props<{ id: string }>(),
)
export const loadEvaluationSuccess = createAction(
    '[Diagnostic Evaluations] Load Evaluation Success',
    props<{ evaluation: GeneratedEvaluation }>(),
)
export const loadEvaluationFailed = createAction(
    '[Diagnostic Evaluations] Load Evaluation Failed',
    props<{ error: string }>(),
)

// Load all evaluations
export const loadEvaluations = createAction('[Diagnostic Evaluations] Load Evaluations')
export const loadEvaluationsSuccess = createAction(
    '[Diagnostic Evaluations] Load Evaluations Success',
    props<{ evaluations: GeneratedEvaluation[] }>(),
)
export const loadEvaluationsFailed = createAction(
    '[Diagnostic Evaluations] Load Evaluations Failed',
    props<{ error: string }>(),
)

// Create an evaluation
export const createEvaluation = createAction(
    '[Diagnostic Evaluations] Create Evaluation',
    props<{ evaluation: Partial<DiagnosticEvaluationDto> }>(),
)
export const createEvaluationSuccess = createAction(
    '[Diagnostic Evaluations] Create Evaluation Success',
    props<{ evaluation: GeneratedEvaluation }>(),
)
export const createEvaluationFailed = createAction(
    '[Diagnostic Evaluations] Create Evaluation Failed',
    props<{ error: string }>(),
)

// Update an evaluation
export const updateEvaluation = createAction(
    '[Diagnostic Evaluations] Update Evaluation',
    props<{ id: string; data: Partial<DiagnosticEvaluationDto> }>(),
)
export const updateEvaluationSuccess = createAction(
    '[Diagnostic Evaluations] Update Evaluation Success',
    props<{ evaluation: GeneratedEvaluation }>(),
)
export const updateEvaluationFailed = createAction(
    '[Diagnostic Evaluations] Update Evaluation Failed',
    props<{ error: string }>(),
)

// Delete an evaluation
export const deleteEvaluation = createAction(
    '[Diagnostic Evaluations] Delete Evaluation',
    props<{ id: string }>(),
)
export const deleteEvaluationSuccess = createAction(
    '[Diagnostic Evaluations] Delete Evaluation Success',
    props<{ id: string }>(),
)
export const deleteEvaluationFailed = createAction(
    '[Diagnostic Evaluations] Delete Evaluation Failed',
    props<{ error: string }>(),
)
