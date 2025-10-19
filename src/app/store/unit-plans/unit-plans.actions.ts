import { createAction, props } from '@ngrx/store'
import { UnitPlan } from '../../core/models'
import { UnitPlanDto } from './unit-plans.models'

// Load a single plan
export const loadPlan = createAction(
    '[Unit Plans] Load Plan',
    props<{ id: string }>(),
)
export const loadPlanSuccess = createAction(
    '[Unit Plans] Load Plan Success',
    props<{ plan: UnitPlan }>(),
)
export const loadPlanFailed = createAction(
    '[Unit Plans] Load Plan Failed',
    props<{ error: string }>(),
)

// Load all plans
export const loadPlans = createAction('[Unit Plans] Load Plans')
export const loadPlansSuccess = createAction(
    '[Unit Plans] Load Plans Success',
    props<{ plans: UnitPlan[] }>(),
)
export const loadPlansFailed = createAction(
    '[Unit Plans] Load Plans Failed',
    props<{ error: string }>(),
)

// Create a plan
export const createPlan = createAction(
    '[Unit Plans] Create Plan',
    props<{ plan: Partial<UnitPlanDto> }>(),
)
export const createPlanSuccess = createAction(
    '[Unit Plans] Create Plan Success',
    props<{ plan: UnitPlan }>(),
)
export const createPlanFailed = createAction(
    '[Unit Plans] Create Plan Failed',
    props<{ error: string }>(),
)

// Update a plan
export const updatePlan = createAction(
    '[Unit Plans] Update Plan',
    props<{ id: string; data: Partial<UnitPlanDto> }>(),
)
export const updatePlanSuccess = createAction(
    '[Unit Plans] Update Plan Success',
    props<{ plan: UnitPlan }>(),
)
export const updatePlanFailed = createAction(
    '[Unit Plans] Update Plan Failed',
    props<{ error: string }>(),
)

// Delete a plan
export const deletePlan = createAction(
    '[Unit Plans] Delete Plan',
    props<{ id: string }>(),
)
export const deletePlanSuccess = createAction(
    '[Unit Plans] Delete Plan Success',
    props<{ id: string }>(),
)
export const deletePlanFailed = createAction(
    '[Unit Plans] Delete Plan Failed',
    props<{ error: string }>(),
)
