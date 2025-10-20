import { ClassSection } from './class-section'
import { BaseModel } from './base-model'

export interface Student extends BaseModel {
	firstname: string
	lastname: string
	section: ClassSection
	gender: string
	birth: Date
}
