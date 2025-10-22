import { Idea } from '../../core/models'

export interface IdeaDto {
    user: string
    title: string
    description: string
    votes: {
        user: string
        like: boolean
    }[]
}

export enum IdeaStateStatus {
    IDLING,
    LOADING_IDEAS,
    LOADING_IDEA,
    CREATING_IDEA,
    UPDATING_IDEA,
    DELETING_IDEA,
}

export interface IdeasState {
    ideas: Idea[]
    selectedIdea: Idea | null
    error: string | null
    status: IdeaStateStatus
}

export const initialIdeasState: IdeasState = {
    ideas: [],
    selectedIdea: null,
    error: null,
    status: IdeaStateStatus.IDLING,
}
