import { Checklist } from './checklist';
import { EstimationScale } from './estimation-scale';
import { Rubric } from './rubric';
import { Test } from './test';
import { UnitPlan } from './unit-plan';

export interface UnitPlanInstruments {
	unitPlan: UnitPlan;
	rubrics: Rubric[];
	checklists: Checklist[];
	estimationScales: EstimationScale[];
	tests: Test[];
}
