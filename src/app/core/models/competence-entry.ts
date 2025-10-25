import { GradeName } from '../types/grade-name'
import { LevelName } from '../types/level-name'
import { SubjectName } from '../types/subject-name'
import { BaseModel } from './base-model'

export interface CompetenceEntry extends BaseModel {
	name: string
	grade: GradeName
	subject: SubjectName
	level: LevelName
	entries: string[]
	criteria: string[]
}
