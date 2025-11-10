import { User } from './user'
import { ClassSection } from './class-section'
import { SchoolSubject, SchoolPeriod } from '../enums'
import { Student } from './student'
import { CompetenceEntry } from './competence-entry'
import { InterventionActivity, Actor } from '../interfaces'
import { BaseModel } from './base-model'

export interface RecoveryPlan extends BaseModel {
    user: User
    section: ClassSection
    subject: SchoolSubject
    period: SchoolPeriod
    startingDate: Date
    endingDate: Date
    diagnostic: string
    justification: string
    students: Student[]
    generalObjective: string
    specificObjectives: string[]
    competence: CompetenceEntry[]
    achievementIndicators: string[]
    activities: InterventionActivity[]
    evalutionInstruments: string[]
    successCriteria: string[]
    actors: Actor[]
}
