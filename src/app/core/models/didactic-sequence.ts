import { TableOfContentsItem } from '../interfaces'
import { SchoolLevel, SchoolSubject, SchoolYear } from '../types'
import { BaseModel } from './base-model'

export interface DidacticSequence extends BaseModel {
    level: SchoolLevel
    year: SchoolYear
    subject: SchoolSubject
    tableOfContents: TableOfContentsItem[]
}
