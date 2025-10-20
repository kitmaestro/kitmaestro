import { User } from './user'
import { ContentBlock } from './content-block'
import { ClassSection } from './class-section'
import { GradingActivity } from '../interfaces'
import { BaseModel } from './base-model'

export interface ScoreSystem extends BaseModel {
	section: ClassSection
	user: User
	content: ContentBlock[]
	activities: GradingActivity[]
}
