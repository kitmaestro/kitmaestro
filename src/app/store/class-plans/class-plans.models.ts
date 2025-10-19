import { ClassPlan } from '../../core/interfaces'

export enum ClassPlanStateStatus {
    IDLING,
    LOADING_CLASS_PLAN,
    LOADING_CLASS_PLANS,
    CREATING_CLASS_PLAN,
    UPDATING_CLASS_PLAN,
    DELETING_CLASS_PLAN
}

export interface ClassPlanDto {}

export interface ClassPlanState {
    selectedClassPlan: ClassPlan | null
    classPlans: ClassPlan[]
    error: string | null
    status: ClassPlanStateStatus
}

export const initialClassPlanState: ClassPlanState = {
    selectedClassPlan: null,
    classPlans: [],
    error: null,
    status: ClassPlanStateStatus.IDLING
}
