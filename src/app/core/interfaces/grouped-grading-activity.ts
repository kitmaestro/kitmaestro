import { GradingActivity } from "./grading-activity"

export interface GroupedGradingActivity {
    competence: string
    grading: GradingActivity[]
    total: number
}