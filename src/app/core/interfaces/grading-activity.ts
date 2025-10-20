import { GradingActivityType } from "../enums"

export interface GradingActivity {
    competence: string
    criteria: string[]
    activity: string
    activityType: GradingActivityType
    points: number
}
