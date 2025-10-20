import { Checklist } from '../../core/models'

export interface ChecklistDto {
    user: string
    title: string
    section: string
    competence: string[]
    contentBlock: string
    activity: string
    activityType: string
    criteria: string[]
}

export enum ChecklistStateStatus {
    IDLING,
    LOADING_CHECKLISTS,
    LOADING_CHECKLIST,
    CREATING_CHECKLIST,
    UPDATING_CHECKLIST,
    DELETING_CHECKLIST,
}

export interface ChecklistsState {
    checklists: Checklist[]
    selectedChecklist: Checklist | null
    error: string | null
    status: ChecklistStateStatus
}

export const initialChecklistsState: ChecklistsState = {
    checklists: [],
    selectedChecklist: null,
    error: null,
    status: ChecklistStateStatus.IDLING,
}
