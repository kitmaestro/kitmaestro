import { ClassSection } from './class-section'
import { BaseModel } from './base-model'
import { User } from './user'

export interface EstimationScale extends BaseModel {
	user: User
	title: string
	section: ClassSection
	subject: string
	competence: string[]
	achievementIndicators: string[]
	activity: string
	criteria: string[]
	levels: string[]
}
