import { createAction, props } from '@ngrx/store'
import { SubjectConceptList } from '../../core/models'
import { SubjectConceptListDto } from './subject-concept-lists.models'

// Load a single list
export const loadSubjectConceptList = createAction(
    '[Subject Concept Lists] Load List',
    props<{ id: string }>(),
)
export const loadSubjectConceptListSuccess = createAction(
    '[Subject Concept Lists] Load List Success',
    props<{ list: SubjectConceptList }>(),
)
export const loadSubjectConceptListFailed = createAction(
    '[Subject Concept Lists] Load List Failed',
    props<{ error: string }>(),
)

// Load all lists
export const loadSubjectConceptLists = createAction(
    '[Subject Concept Lists] Load Lists',
    props<{ filters: any }>(),
)
export const loadSubjectConceptListsSuccess = createAction(
    '[Subject Concept Lists] Load Lists Success',
    props<{ lists: SubjectConceptList[] }>(),
)
export const loadSubjectConceptListsFailed = createAction(
    '[Subject Concept Lists] Load Lists Failed',
    props<{ error: string }>(),
)

// Create a list
export const createSubjectConceptList = createAction(
    '[Subject Concept Lists] Create List',
    props<{ list: Partial<SubjectConceptListDto> }>(),
)
export const createSubjectConceptListSuccess = createAction(
    '[Subject Concept Lists] Create List Success',
    props<{ list: SubjectConceptList }>(),
)
export const createSubjectConceptListFailed = createAction(
    '[Subject Concept Lists] Create List Failed',
    props<{ error: string }>(),
)

// Update a list
export const updateSubjectConceptList = createAction(
    '[Subject Concept Lists] Update List',
    props<{ id: string; data: Partial<SubjectConceptListDto> }>(),
)
export const updateSubjectConceptListSuccess = createAction(
    '[Subject Concept Lists] Update List Success',
    props<{ list: SubjectConceptList }>(),
)
export const updateSubjectConceptListFailed = createAction(
    '[Subject Concept Lists] Update List Failed',
    props<{ error: string }>(),
)

// Delete a list
export const deleteSubjectConceptList = createAction(
    '[Subject Concept Lists] Delete List',
    props<{ id: string }>(),
)
export const deleteSubjectConceptListSuccess = createAction(
    '[Subject Concept Lists] Delete List Success',
    props<{ id: string }>(),
)
export const deleteSubjectConceptListFailed = createAction(
    '[Subject Concept Lists] Delete List Failed',
    props<{ error: string }>(),
)
