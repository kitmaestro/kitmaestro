import { BaseModel } from './base-model'

export interface Grade extends BaseModel {
	studentId: string
	assignmentId: string
	score: number
}
