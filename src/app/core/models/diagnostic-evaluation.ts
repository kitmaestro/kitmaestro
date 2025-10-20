import { EvaluationSection } from "../interfaces"
import { BaseModel } from "./base-model"

export interface GeneratedEvaluation extends BaseModel {
	user: string
	title: string
	subject: string
	year: string
	level: string
	schoolYear: string
	sections: EvaluationSection[]
}
