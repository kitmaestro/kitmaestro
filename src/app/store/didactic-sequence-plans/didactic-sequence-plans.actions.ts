import { createAction, props } from '@ngrx/store'
import { DidacticSequencePlan } from '../../core/models'
import { DidacticSequencePlanDto } from './didactic-sequence-plans.models'

// Load a single plan
export const loadPlan = createAction(
    '[Didactic Sequence Plans] Load Plan',
    props<{ id: string }>(),
)
export const loadPlanSuccess = createAction(
    '[Didactic Sequence Plans] Load Plan Success',
    props<{ plan: DidacticSequencePlan }>(),
)
export const loadPlanFailed = createAction(
    '[Didactic Sequence Plans] Load Plan Failed',
    props<{ error: string }>(),
)

// Load all plans
export const loadPlans = createAction(
    '[Didactic Sequence Plans] Load Plans',
    props<{ filters: any }>(),
)
export const loadPlansSuccess = createAction(
    '[Didactic Sequence Plans] Load Plans Success',
    props<{ plans: DidacticSequencePlan[] }>(),
)
export const loadPlansFailed = createAction(
    '[Didactic Sequence Plans] Load Plans Failed',
    props<{ error: string }>(),
)

// Create a plan
export const createPlan = createAction(
    '[Didactic Sequence Plans] Create Plan',
    props<{ plan: Partial<DidacticSequencePlanDto> }>(),
)
export const createPlanSuccess = createAction(
    '[Didactic Sequence Plans] Create Plan Success',
    props<{ plan: DidacticSequencePlan }>(),
)
export const createPlanFailed = createAction(
    '[Didactic Sequence Plans] Create Plan Failed',
    props<{ error: string }>(),
)

// Update a plan
export const updatePlan = createAction(
    '[Didactic Sequence Plans] Update Plan',
    props<{ id: string; data: Partial<DidacticSequencePlanDto> }>(),
)
export const updatePlanSuccess = createAction(
    '[Didactic Sequence Plans] Update Plan Success',
    props<{ plan: DidacticSequencePlan }>(),
)
export const updatePlanFailed = createAction(
    '[Didactic Sequence Plans] Update Plan Failed',
    props<{ error: string }>(),
)

// Delete a plan
export const deletePlan = createAction(
    '[Didactic Sequence Plans] Delete Plan',
    props<{ id: string }>(),
)
export const deletePlanSuccess = createAction(
    '[Didactic Sequence Plans] Delete Plan Success',
    props<{ id: string }>(),
)
export const deletePlanFailed = createAction(
    '[Didactic Sequence Plans] Delete Plan Failed',
    props<{ error: string }>(),
)
