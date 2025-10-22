import { createReducer, on } from '@ngrx/store'
import * as RubricsActions from './rubrics.actions'
import { initialRubricsState, RubricStateStatus } from './rubrics.models'

export const rubricsReducer = createReducer(
    initialRubricsState,

    // Set status for ongoing operations
    on(RubricsActions.loadRubric, state => ({
        ...state,
        status: RubricStateStatus.LOADING_RUBRIC,
    })),
    on(RubricsActions.loadRubrics, state => ({
        ...state,
        status: RubricStateStatus.LOADING_RUBRICS,
    })),
    on(RubricsActions.createRubric, state => ({
        ...state,
        status: RubricStateStatus.CREATING_RUBRIC,
    })),
    on(RubricsActions.updateRubric, state => ({
        ...state,
        status: RubricStateStatus.UPDATING_RUBRIC,
    })),
    on(RubricsActions.deleteRubric, state => ({
        ...state,
        status: RubricStateStatus.DELETING_RUBRIC,
    })),

    // Handle failure cases
    on(
        RubricsActions.loadRubricFailed,
        RubricsActions.loadRubricsFailed,
        RubricsActions.createRubricFailed,
        RubricsActions.updateRubricFailed,
        RubricsActions.deleteRubricFailed,
        (state, { error }) => ({ ...state, status: RubricStateStatus.IDLING, error }),
    ),

    // Handle success cases
    on(RubricsActions.loadRubricSuccess, (state, { rubric }) => ({
        ...state,
        status: RubricStateStatus.IDLING,
        selectedRubric: rubric,
    })),
    on(RubricsActions.loadRubricsSuccess, (state, { rubrics }) => ({
        ...state,
        status: RubricStateStatus.IDLING,
        rubrics,
    })),
    on(RubricsActions.createRubricSuccess, (state, { rubric }) => ({
        ...state,
        status: RubricStateStatus.IDLING,
        rubrics: [rubric, ...state.rubrics],
    })),
    on(RubricsActions.updateRubricSuccess, (state, { rubric: updatedRubric }) => ({
        ...state,
        status: RubricStateStatus.IDLING,
        selectedRubric:
            state.selectedRubric?._id === updatedRubric._id
                ? updatedRubric
                : state.selectedRubric,
        rubrics: state.rubrics.map(r => (r._id === updatedRubric._id ? updatedRubric : r)),
    })),
    on(RubricsActions.deleteRubricSuccess, (state, { id }) => ({
        ...state,
        status: RubricStateStatus.IDLING,
        selectedRubric: state.selectedRubric?._id === id ? null : state.selectedRubric,
        rubrics: state.rubrics.filter(r => r._id !== id),
    })),
)
