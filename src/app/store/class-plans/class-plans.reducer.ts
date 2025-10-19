import { ClassPlanStateStatus, initialClassPlanState } from './class-plans.models'
import * as ClassPlansActions from './class-plans.actions'
import { createReducer, on } from '@ngrx/store'

export const classPlansReducer = createReducer(
    initialClassPlanState,

    on(ClassPlansActions.loadClassPlan, (state) => ({ ...state, status: ClassPlanStateStatus.LOADING_CLASS_PLAN })),
    on(ClassPlansActions.loadClassPlans, (state) => ({ ...state, status: ClassPlanStateStatus.LOADING_CLASS_PLANS })),
    on(ClassPlansActions.createClassPlan, (state) => ({ ...state, status: ClassPlanStateStatus.CREATING_CLASS_PLAN })),
    on(ClassPlansActions.updateClassPlan, (state) => ({ ...state, status: ClassPlanStateStatus.UPDATING_CLASS_PLAN })),
    on(ClassPlansActions.deleteClassPlan, (state) => ({ ...state, status: ClassPlanStateStatus.DELETING_CLASS_PLAN })),

    on(ClassPlansActions.loadClassPlanSuccess, (state, { classPlan }) => ({ ...state, status: ClassPlanStateStatus.IDLING, selectedClassPlan: classPlan })),
    on(ClassPlansActions.loadClassPlansSuccess, (state, { classPlans }) => ({ ...state, status: ClassPlanStateStatus.IDLING, classPlans })),
    on(ClassPlansActions.createClassPlanSuccess, (state, { classPlan }) => ({ ...state, status: ClassPlanStateStatus.IDLING, classPlans: [...state.classPlans, classPlan] })),
    on(ClassPlansActions.updateClassPlanSuccess, (state, { classPlan }) => ({ ...state, status: ClassPlanStateStatus.IDLING, classPlans: state.classPlans.map(plan => plan._id === classPlan._id ? classPlan : plan) })),
    on(ClassPlansActions.deleteClassPlanSuccess, (state, { planId }) => ({ ...state, status: ClassPlanStateStatus.IDLING, classPlans: state.classPlans.filter(plan => plan._id !== planId) })),

    on(ClassPlansActions.loadClassPlanFailure, (state, { error }) => ({ ...state, status: ClassPlanStateStatus.IDLING, selectedClassPlan: null, error })),
    on(ClassPlansActions.loadClassPlansFailure, (state, { error }) => ({ ...state, status: ClassPlanStateStatus.IDLING, error })),
    on(ClassPlansActions.createClassPlanFailure, (state, { error }) => ({ ...state, status: ClassPlanStateStatus.IDLING, selectedClassPlan: null, error })),
    on(ClassPlansActions.updateClassPlanFailure, (state, { error }) => ({ ...state, status: ClassPlanStateStatus.IDLING, error })),
    on(ClassPlansActions.deleteClassPlanFailure, (state, { error }) => ({ ...state, status: ClassPlanStateStatus.IDLING, error })),
)
