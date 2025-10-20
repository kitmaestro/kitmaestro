import { EstimationScale } from '../../core/models'

export interface EstimationScaleDto {
    user: string
    title: string
    section: string
    subject: string
    competence: string[]
    achievementIndicators: string[]
    activity: string
    criteria: string[]
    levels: string[]
}

export enum EstimationScaleStateStatus {
    IDLING,
    LOADING_SCALES,
    LOADING_SCALE,
    CREATING_SCALE,
    UPDATING_SCALE,
    DELETING_SCALE,
}

export interface EstimationScalesState {
    scales: EstimationScale[]
    selectedScale: EstimationScale | null
    error: string | null
    status: EstimationScaleStateStatus
}

export const initialEstimationScalesState: EstimationScalesState = {
    scales: [],
    selectedScale: null,
    error: null,
    status: EstimationScaleStateStatus.IDLING,
}
