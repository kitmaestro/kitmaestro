import { ClassPeriod } from '../interfaces'
import { BaseModel } from './base-model'
import { ClassSection } from './class-section'
import { User } from './user'

export interface ClassSchedule extends BaseModel {
	user: User
	section: ClassSection
	format: string
	periods: ClassPeriod[]
}
