import { DidacticSequencePlan } from '../../core/models'
import {
    ActivityResource,
    DidacticSequenceBlock,
} from '../../core/interfaces'

export interface DidacticSequencePlanDto {
    didacticSequence: string
    title: string
    description: string
    specificCompetencies: {
        name: string
        description: string
    }[]
    additionalResources: ActivityResource[]
    blocks: DidacticSequenceBlock[]
}

export enum DidacticSequencePlanStateStatus {
    IDLING,
    LOADING_PLANS,
    LOADING_PLAN,
    CREATING_PLAN,
    UPDATING_PLAN,
    DELETING_PLAN,
}

export interface DidacticSequencePlansState {
    plans: DidacticSequencePlan[]
    selectedPlan: DidacticSequencePlan | null
    error: string | null
    status: DidacticSequencePlanStateStatus
}

export const initialDidacticSequencePlansState: DidacticSequencePlansState = {
    plans: [],
    selectedPlan: null,
    error: null,
    status: DidacticSequencePlanStateStatus.IDLING,
}
