import { createAction, props } from '@ngrx/store';
import { ImprovementPlan } from '../../core/interfaces';

// Load a single improvement plan
export const loadImprovementPlan = createAction(
  '[Improvement Plans] Load Plan',
  props<{ id: string }>(),
);
export const loadImprovementPlanSuccess = createAction(
  '[Improvement Plans] Load Plan Success',
  props<{ plan: ImprovementPlan }>(),
);
export const loadImprovementPlanFailed = createAction(
  '[Improvement Plans] Load Plan Failed',
  props<{ error: string }>(),
);

// Load all improvement plans
export const loadImprovementPlans = createAction(
  '[Improvement Plans] Load Plans',
  props<{ filters?: any }>(),
);
export const loadImprovementPlansSuccess = createAction(
  '[Improvement Plans] Load Plans Success',
  props<{ plans: ImprovementPlan[] }>(),
);
export const loadImprovementPlansFailed = createAction(
  '[Improvement Plans] Load Plans Failed',
  props<{ error: string }>(),
);

// Create an improvement plan
export const createImprovementPlan = createAction(
  '[Improvement Plans] Create Plan',
  props<{ plan: Partial<ImprovementPlan> }>(), // Using Partial<ImprovementPlan> for DTO for now
);
export const createImprovementPlanSuccess = createAction(
  '[Improvement Plans] Create Plan Success',
  props<{ plan: ImprovementPlan }>(),
);
export const createImprovementPlanFailed = createAction(
  '[Improvement Plans] Create Plan Failed',
  props<{ error: string }>(),
);

// Update an improvement plan
export const updateImprovementPlan = createAction(
  '[Improvement Plans] Update Plan',
  props<{ id: string; data: Partial<ImprovementPlan> }>(), // Using Partial<ImprovementPlan> for DTO for now
);
export const updateImprovementPlanSuccess = createAction(
  '[Improvement Plans] Update Plan Success',
  props<{ plan: ImprovementPlan }>(),
);
export const updateImprovementPlanFailed = createAction(
  '[Improvement Plans] Update Plan Failed',
  props<{ error: string }>(),
);

// Delete an improvement plan
export const deleteImprovementPlan = createAction(
  '[Improvement Plans] Delete Plan',
  props<{ id: string }>(),
);
export const deleteImprovementPlanSuccess = createAction(
  '[Improvement Plans] Delete Plan Success',
  props<{ id: string }>(),
);
export const deleteImprovementPlanFailed = createAction(
  '[Improvement Plans] Delete Plan Failed',
  props<{ error: string }>(),
);
