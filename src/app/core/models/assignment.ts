import { BaseModel } from './base-model'
import { ClassSection } from './class-section'
import { UnitPlan } from './unit-plan'

export interface Assignment extends BaseModel {
	section: ClassSection
	subject: string
	unitPlan: UnitPlan
	name: string
	value: number
}
