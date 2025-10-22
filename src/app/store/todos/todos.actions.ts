import { createAction, props } from '@ngrx/store'
import { Todo } from '../../core/models'
import { TodoDto } from './todos.models'

// Load a single todo
export const loadTodo = createAction('[Todos] Load Todo', props<{ id: string }>())
export const loadTodoSuccess = createAction(
    '[Todos] Load Todo Success',
    props<{ todo: Todo }>(),
)
export const loadTodoFailed = createAction(
    '[Todos] Load Todo Failed',
    props<{ error: string }>(),
)

// Load all todos (findAll)
export const loadTodos = createAction('[Todos] Load Todos')
export const loadTodosSuccess = createAction(
    '[Todos] Load Todos Success',
    props<{ todos: Todo[] }>(),
)
export const loadTodosFailed = createAction(
    '[Todos] Load Todos Failed',
    props<{ error: string }>(),
)

// Load todos by list (findByList)
export const loadTodosByList = createAction(
    '[Todos] Load Todos By List',
    props<{ listId: string }>(),
)
export const loadTodosByListSuccess = createAction(
    '[Todos] Load Todos By List Success',
    props<{ todos: Todo[] }>(),
)
export const loadTodosByListFailed = createAction(
    '[Todos] Load Todos By List Failed',
    props<{ error: string }>(),
)

// Create a todo
export const createTodo = createAction(
    '[Todos] Create Todo',
    props<{ todo: Partial<TodoDto> }>(),
)
export const createTodoSuccess = createAction(
    '[Todos] Create Todo Success',
    props<{ todo: Todo }>(),
)
export const createTodoFailed = createAction(
    '[Todos] Create Todo Failed',
    props<{ error: string }>(),
)

// Update a todo
export const updateTodo = createAction(
    '[Todos] Update Todo',
    props<{ id: string; data: Partial<TodoDto> }>(),
)
export const updateTodoSuccess = createAction(
    '[Todos] Update Todo Success',
    props<{ todo: Todo }>(),
)
export const updateTodoFailed = createAction(
    '[Todos] Update Todo Failed',
    props<{ error: string }>(),
)

// Delete a todo
export const deleteTodo = createAction(
    '[Todos] Delete Todo',
    props<{ id: string }>(),
)
export const deleteTodoSuccess = createAction(
    '[Todos] Delete Todo Success',
    props<{ id: string }>(),
)
export const deleteTodoFailed = createAction(
    '[Todos] Delete Todo Failed',
    props<{ error: string }>(),
)
