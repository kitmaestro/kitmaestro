import { BaseModel } from './base-model'
import { ClassSection } from './class-section'
import { Student } from './student'
import { User } from './user'

export interface LogRegistryEntry extends BaseModel {
	user: User
	date: Date
	section: ClassSection
	place: string
	students: Student[]
	description: string
	comments: string
	type: string
}
