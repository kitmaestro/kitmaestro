import { createFeatureSelector, createSelector } from '@ngrx/store'
import { TodosState, TodoStateStatus } from './todos.models'

export const selectTodosState = createFeatureSelector<TodosState>('todos')

export const selectAllTodos = createSelector(selectTodosState, state => state.todos)

export const selectListTodos = createSelector(selectTodosState, state => state.listTodos)

export const selectCurrentTodo = createSelector(
    selectTodosState,
    state => state.selectedTodo,
)

export const selectTodosStatus = createSelector(selectTodosState, state => state.status)

export const selectTodosError = createSelector(selectTodosState, state => state.error)

// Selectores de estado booleanos
export const selectIsLoadingMany = createSelector(
    selectTodosStatus,
    status => status === TodoStateStatus.LOADING_TODOS,
)

export const selectIsLoadingListTodos = createSelector(
    selectTodosStatus,
    status => status === TodoStateStatus.LOADING_LIST_TODOS,
)

export const selectIsLoadingOne = createSelector(
    selectTodosStatus,
    status => status === TodoStateStatus.LOADING_TODO,
)

export const selectIsCreating = createSelector(
    selectTodosStatus,
    status => status === TodoStateStatus.CREATING_TODO,
)

export const selectIsUpdating = createSelector(
    selectTodosStatus,
    status => status === TodoStateStatus.UPDATING_TODO,
)

export const selectIsDeleting = createSelector(
    selectTodosStatus,
    status => status === TodoStateStatus.DELETING_TODO,
)
