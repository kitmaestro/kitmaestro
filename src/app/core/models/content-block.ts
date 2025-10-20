import { SchoolLevel, SchoolSubject, SchoolYear } from "../types"
import { BaseModel } from "./base-model"

export interface ContentBlock extends BaseModel {
	title: string
	level: SchoolLevel
	year: SchoolYear
	subject: SchoolSubject
	order: number
	concepts: string[]
	procedures: string[]
	attitudes: string[]
	achievement_indicators: string[]
}
