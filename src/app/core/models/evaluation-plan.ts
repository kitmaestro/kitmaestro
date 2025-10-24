import { BaseModel } from './base-model'
import { UnitPlan } from './unit-plan'
import { User } from './user'
import { EvaluationEntry } from '../interfaces'
import { ClassSection } from './class-section'
import { CompetenceEntry } from './competence-entry'
import { ContentBlock } from './content-block'

export interface EvaluationPlan extends BaseModel {
	user: User
	classSection: ClassSection
	unitPlan: UnitPlan
	evaluationTypes: string[]
	evaluationParticipants: string[]
	competence: CompetenceEntry[]
	contentBlocks: ContentBlock[]
	evaluationEntries: EvaluationEntry[]
}
