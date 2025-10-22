import { Update } from '../../core/models'

export interface UpdateDto {
    title: string
    date: Date | string
    type: 'notice' | 'feature' | 'bug'
    description: string
    content: string
    author: string
    links?: {
        label: string
        link: string
        external: boolean
    }[]
    actions: {
        label: string
        link: string[]
    }[]
}

export enum UpdateStateStatus {
    IDLING,
    LOADING_UPDATES,
    LOADING_UPDATE,
    CREATING_UPDATE,
    UPDATING_UPDATE,
    DELETING_UPDATE,
}

export interface UpdatesState {
    updates: Update[]
    selectedUpdate: Update | null
    error: string | null
    status: UpdateStateStatus
}

export const initialUpdatesState: UpdatesState = {
    updates: [],
    selectedUpdate: null,
    error: null,
    status: UpdateStateStatus.IDLING,
}
