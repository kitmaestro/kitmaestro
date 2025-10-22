import { EvaluationArea } from '../interfaces'
import { BaseModel } from './base-model'
import { UnitPlan } from './unit-plan'
import { User } from './user'

export interface EvaluationPlan extends BaseModel {
	user: User
	unitPlan: UnitPlan
	evaluationAreas: EvaluationArea[]
}
