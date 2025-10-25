import { ClassSection } from './class-section'
import { BaseModel } from './base-model'
import { User } from './user'

export interface ObservationGuide extends BaseModel {
	user: User
	title: string
	date: string
	section: ClassSection
	individual: boolean
	duration: string
	description: string
	competence: {
		fundamental: string
		items: string[]
	}[]
	aspects: string[]
}
