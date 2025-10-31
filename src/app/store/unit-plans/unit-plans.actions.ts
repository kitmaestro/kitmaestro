import { createAction, props } from '@ngrx/store';
import { ClassPlan, UnitPlan, User } from '../../core/models';
import { UnitPlanDto } from './unit-plans.models';

// Load a single plan
export const loadUnitPlan = createAction(
	'[Unit Plans] Load Plan',
	props<{ id: string }>(),
);
export const loadUnitPlanSuccess = createAction(
	'[Unit Plans] Load Plan Success',
	props<{ plan: UnitPlan }>(),
);
export const loadUnitPlanFailed = createAction(
	'[Unit Plans] Load Plan Failed',
	props<{ error: string }>(),
);

// Load a single plan
export const countUnitPlans = createAction('[Unit Plans] Count Plans');
export const countUnitPlansSuccess = createAction(
	'[Unit Plans] Count Plans Success',
	props<{ plans: number }>(),
);
export const countUnitPlansFailed = createAction(
	'[Unit Plans] Count Plans Failed',
	props<{ error: string }>(),
);

// Load all plans
export const loadUnitPlans = createAction('[Unit Plans] Load Plans', props<{ filters?: any }>());
export const loadUnitPlansSuccess = createAction(
	'[Unit Plans] Load Plans Success',
	props<{ plans: UnitPlan[] }>(),
);
export const loadUnitPlansFailed = createAction(
	'[Unit Plans] Load Plans Failed',
	props<{ error: string }>(),
);

// Create a plan
export const createUnitPlan = createAction(
	'[Unit Plans] Create Plan',
	props<{ plan: Partial<UnitPlanDto> }>(),
);
export const createUnitPlanSuccess = createAction(
	'[Unit Plans] Create Plan Success',
	props<{ plan: UnitPlan }>(),
);
export const createUnitPlanFailed = createAction(
	'[Unit Plans] Create Plan Failed',
	props<{ error: string }>(),
);

// Update a plan
export const updateUnitPlan = createAction(
	'[Unit Plans] Update Plan',
	props<{ id: string; data: Partial<UnitPlanDto> }>(),
);
export const updateUnitPlanSuccess = createAction(
	'[Unit Plans] Update Plan Success',
	props<{ plan: UnitPlan }>(),
);
export const updateUnitPlanFailed = createAction(
	'[Unit Plans] Update Plan Failed',
	props<{ error: string }>(),
);

// Delete a plan
export const deleteUnitPlan = createAction(
	'[Unit Plans] Delete Plan',
	props<{ id: string }>(),
);
export const deleteUnitPlanSuccess = createAction(
	'[Unit Plans] Delete Plan Success',
	props<{ id: string }>(),
);
export const deleteUnitPlanFailed = createAction(
	'[Unit Plans] Delete Plan Failed',
	props<{ error: string }>(),
);

// Download a plan
export const downloadUnitPlan = createAction(
	'[Unit Plans] Download Plan',
	props<{ plan: UnitPlan; classPlans: ClassPlan[]; user: User }>(),
);
export const downloadUnitPlanSuccess = createAction(
	'[Unit Plans] Download Plan Success',
);
export const downloadUnitPlanFailed = createAction(
	'[Unit Plans] Download Plan Failed',
	props<{ error: string }>(),
);
