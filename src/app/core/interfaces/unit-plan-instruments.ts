import { Checklist } from '../models/checklist'
import { EstimationScale } from '../models/estimation-scale'
import { Rubric } from '../models/rubric'
import { Test } from '../models/test'
import { UnitPlan } from '../models'

export interface UnitPlanInstruments {
	unitPlan: UnitPlan
	rubrics: Rubric[]
	checklists: Checklist[]
	estimationScales: EstimationScale[]
	tests: Test[]
}
