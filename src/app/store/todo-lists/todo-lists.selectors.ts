import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TodoListsState, TodoListStateStatus } from './todo-lists.models';

export const selectTodoListsState =
	createFeatureSelector<TodoListsState>('todoLists');

export const selectAllLists = createSelector(
	selectTodoListsState,
	(state) => state.lists,
);

export const selectCurrentList = createSelector(
	selectTodoListsState,
	(state) => state.selectedList,
);

export const selectListsStatus = createSelector(
	selectTodoListsState,
	(state) => state.status,
);

export const selectListsError = createSelector(
	selectTodoListsState,
	(state) => state.error,
);

// Selectores de estado booleanos
export const selectIsLoadingMany = createSelector(
	selectListsStatus,
	(status) => status === TodoListStateStatus.LOADING_LISTS,
);

export const selectIsLoadingOne = createSelector(
	selectListsStatus,
	(status) => status === TodoListStateStatus.LOADING_LIST,
);

export const selectIsCreating = createSelector(
	selectListsStatus,
	(status) => status === TodoListStateStatus.CREATING_LIST,
);

export const selectIsUpdating = createSelector(
	selectListsStatus,
	(status) => status === TodoListStateStatus.UPDATING_LIST,
);

export const selectIsDeleting = createSelector(
	selectListsStatus,
	(status) => status === TodoListStateStatus.DELETING_LIST,
);
