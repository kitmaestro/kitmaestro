import { createAction, props } from '@ngrx/store';
import { DidacticPlan } from '../../core/models';
import { DidacticPlanDto } from './didactic-sequence-plans.models';

// Load a single plan
export const loadSequencePlan = createAction(
	'[Didactic Sequence Plans] Load Plan',
	props<{ id: string }>(),
);
export const loadSequencePlanSuccess = createAction(
	'[Didactic Sequence Plans] Load Plan Success',
	props<{ plan: DidacticPlan }>(),
);
export const loadSequencePlanFailed = createAction(
	'[Didactic Sequence Plans] Load Plan Failed',
	props<{ error: string }>(),
);

// Load all plans
export const loadSequencePlans = createAction(
	'[Didactic Sequence Plans] Load Plans',
	props<{ filters: any }>(),
);
export const loadSequencePlansSuccess = createAction(
	'[Didactic Sequence Plans] Load Plans Success',
	props<{ plans: DidacticPlan[] }>(),
);
export const loadSequencePlansFailed = createAction(
	'[Didactic Sequence Plans] Load Plans Failed',
	props<{ error: string }>(),
);

// Create a plan
export const createSequencePlan = createAction(
	'[Didactic Sequence Plans] Create Plan',
	props<{ plan: Partial<DidacticPlanDto> }>(),
);
export const createSequencePlanSuccess = createAction(
	'[Didactic Sequence Plans] Create Plan Success',
	props<{ plan: DidacticPlan }>(),
);
export const createSequencePlanFailed = createAction(
	'[Didactic Sequence Plans] Create Plan Failed',
	props<{ error: string }>(),
);

// Update a plan
export const updateSequencePlan = createAction(
	'[Didactic Sequence Plans] Update Plan',
	props<{ id: string; data: Partial<DidacticPlanDto> }>(),
);
export const updateSequencePlanSuccess = createAction(
	'[Didactic Sequence Plans] Update Plan Success',
	props<{ plan: DidacticPlan }>(),
);
export const updateSequencePlanFailed = createAction(
	'[Didactic Sequence Plans] Update Plan Failed',
	props<{ error: string }>(),
);

// Delete a plan
export const deleteSequencePlan = createAction(
	'[Didactic Sequence Plans] Delete Plan',
	props<{ id: string }>(),
);
export const deleteSequencePlanSuccess = createAction(
	'[Didactic Sequence Plans] Delete Plan Success',
	props<{ id: string }>(),
);
export const deleteSequencePlanFailed = createAction(
	'[Didactic Sequence Plans] Delete Plan Failed',
	props<{ error: string }>(),
);
