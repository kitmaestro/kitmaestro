import { GeneratedEvaluation } from '../../core/models'
import { EvaluationSection } from '../../core/interfaces'

export interface DiagnosticEvaluationDto {
    user: string
    title: string
    subject: string
    year: string
    level: string
    schoolYear: string
    sections: EvaluationSection[]
}

export enum DiagnosticEvaluationStateStatus {
    IDLING,
    LOADING_EVALUATIONS,
    LOADING_EVALUATION,
    CREATING_EVALUATION,
    UPDATING_EVALUATION,
    DELETING_EVALUATION,
}

export interface DiagnosticEvaluationsState {
    evaluations: GeneratedEvaluation[]
    selectedEvaluation: GeneratedEvaluation | null
    error: string | null
    status: DiagnosticEvaluationStateStatus
}

export const initialDiagnosticEvaluationsState: DiagnosticEvaluationsState = {
    evaluations: [],
    selectedEvaluation: null,
    error: null,
    status: DiagnosticEvaluationStateStatus.IDLING,
}
