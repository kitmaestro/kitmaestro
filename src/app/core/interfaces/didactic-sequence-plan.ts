import { ActivityResource } from "./activity-resource"

export interface DidacticSequencePlan {
    title: string
    description: string
    specificCompetencies: {
        name: string
        description: string
    }[]
    additionalResources: ActivityResource[]
    blocks: {
        title: string
        competence: string
        initialSession: {
            description: string
            resources: ActivityResource[]
            startingPage: number
            lastPage: number
            durationInHours: number
        }
        activities: {
            order: number
            name: string
            description: string
            notes: string
            resources: ActivityResource[]
            startingPage: number
            lastPage: number
            durationInHours: number
        }[]
    }[]
}
