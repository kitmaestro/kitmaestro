import {
	ClassSection,
	CompetenceEntry,
	ContentBlock,
	MainTheme,
	User,
} from '../interfaces'
import { BaseModel } from './base-model'

export interface UnitPlan extends BaseModel {
	user: User
	section: ClassSection
	sections: ClassSection[]
	duration: number
	learningSituation: string
	title: string
	competence: CompetenceEntry[]
	mainThemeCategory: string
	mainThemes: MainTheme[]
	subjects: string[]
	strategies: string[]
	contents: ContentBlock[]
	resources: string[]
	instruments: string[]
	teacherActivities: {
		subject: string
		activities: string[]
	}[]
	studentActivities: {
		subject: string
		activities: string[]
	}[]
	evaluationActivities: {
		subject: string
		activities: string[]
	}[]
}
