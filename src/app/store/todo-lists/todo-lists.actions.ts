import { createAction, props } from '@ngrx/store'
import { TodoList } from '../../core/models'
import { TodoListDto } from './todo-lists.models'

// Load a single list
export const loadList = createAction('[Todo Lists] Load List', props<{ id: string }>())
export const loadListSuccess = createAction(
    '[Todo Lists] Load List Success',
    props<{ list: TodoList }>(),
)
export const loadListFailed = createAction(
    '[Todo Lists] Load List Failed',
    props<{ error: string }>(),
)

// Load all lists
export const loadLists = createAction('[Todo Lists] Load Lists')
export const loadListsSuccess = createAction(
    '[Todo Lists] Load Lists Success',
    props<{ lists: TodoList[] }>(),
)
export const loadListsFailed = createAction(
    '[Todo Lists] Load Lists Failed',
    props<{ error: string }>(),
)

// Create a list
export const createList = createAction(
    '[Todo Lists] Create List',
    props<{ list: Partial<TodoListDto> }>(),
)
export const createListSuccess = createAction(
    '[Todo Lists] Create List Success',
    props<{ list: TodoList }>(),
)
export const createListFailed = createAction(
    '[Todo Lists] Create List Failed',
    props<{ error: string }>(),
)

// Update a list
export const updateList = createAction(
    '[Todo Lists] Update List',
    props<{ id: string; data: Partial<TodoListDto> }>(),
)
export const updateListSuccess = createAction(
    '[Todo Lists] Update List Success',
    props<{ list: TodoList }>(),
)
export const updateListFailed = createAction(
    '[Todo Lists] Update List Failed',
    props<{ error: string }>(),
)

// Delete a list
export const deleteList = createAction(
    '[Todo Lists] Delete List',
    props<{ id: string }>(),
)
export const deleteListSuccess = createAction(
    '[Todo Lists] Delete List Success',
    props<{ id: string }>(),
)
export const deleteListFailed = createAction(
    '[Todo Lists] Delete List Failed',
    props<{ error: string }>(),
)
