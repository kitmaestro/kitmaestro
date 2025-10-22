import { ClassSection } from './class-section'
import { CompetenceEntry } from './competence-entry'
import { ContentBlock } from './content-block'
import { User } from './user'
import { BaseModel } from './base-model'

export interface Checklist extends BaseModel {
	user: User
	title: string
	section: ClassSection
	competence: CompetenceEntry[]
	contentBlock: ContentBlock
	activity: string
	activityType: string
	criteria: string[]
}
