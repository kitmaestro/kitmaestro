import { ClassPlan } from '../../core/interfaces'
import { ClassPlanDto } from './class-plans.models'
import { createAction, props } from '@ngrx/store'

export const loadClassPlan = createAction('[Class Plans] Load Class Plan', props<{ planId: string }>())
export const loadClassPlanSuccess = createAction('[Class Plans] Load Class Plan Success', props<{ classPlan: ClassPlan }>())
export const loadClassPlanFailure = createAction('[Class Plans] Load Class Plan Failure', props<{ error: string }>())

export const loadClassPlans = createAction('[Class Plans] Load Class Plans')
export const loadClassPlansSuccess = createAction('[Class Plans] Load Class Plans Success', props<{ classPlans: ClassPlan[] }>())
export const loadClassPlansFailure = createAction('[Class Plans] Load Class Plans Failure', props<{ error: string }>())

export const createClassPlan = createAction('[Class Plans] Create Class Plan', props<{ plan: Partial<ClassPlanDto> }>())
export const createClassPlanSuccess = createAction('[Class Plans] Create Class Plan Success', props<{ classPlan: ClassPlan }>())
export const createClassPlanFailure = createAction('[Class Plans] Create Class Plan Failure', props<{ error: string }>())

export const updateClassPlan = createAction('[Class Plans] Update Class Plan', props<{ planId: string, data: Partial<ClassPlanDto> }>())
export const updateClassPlanSuccess = createAction('[Class Plans] Update Class Plan Success', props<{ classPlan: ClassPlan }>())
export const updateClassPlanFailure = createAction('[Class Plans] Update Class Plan Failure', props<{ error: string }>())

export const deleteClassPlan = createAction('[Class Plans] Delete Class Plan', props<{ planId: string }>())
export const deleteClassPlanSuccess = createAction('[Class Plans] Delete Class Plan Success', props<{ planId: string }>())
export const deleteClassPlanFailure = createAction('[Class Plans] Delete Class Plan Failure', props<{ error: string }>())
