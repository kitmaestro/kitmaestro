import { createReducer, on } from '@ngrx/store';
import * as TodoListsActions from './todo-lists.actions';
import {
	initialTodoListsState,
	TodoListStateStatus,
} from './todo-lists.models';

export const todoListsReducer = createReducer(
	initialTodoListsState,

	// Set status for ongoing operations
	on(TodoListsActions.loadList, (state) => ({
		...state,
		status: TodoListStateStatus.LOADING_LIST,
	})),
	on(TodoListsActions.loadLists, (state) => ({
		...state,
		status: TodoListStateStatus.LOADING_LISTS,
	})),
	on(TodoListsActions.createList, (state) => ({
		...state,
		status: TodoListStateStatus.CREATING_LIST,
	})),
	on(TodoListsActions.updateList, (state) => ({
		...state,
		status: TodoListStateStatus.UPDATING_LIST,
	})),
	on(TodoListsActions.deleteList, (state) => ({
		...state,
		status: TodoListStateStatus.DELETING_LIST,
	})),

	// Handle failure cases
	on(
		TodoListsActions.loadListFailed,
		TodoListsActions.loadListsFailed,
		TodoListsActions.createListFailed,
		TodoListsActions.updateListFailed,
		TodoListsActions.deleteListFailed,
		(state, { error }) => ({
			...state,
			status: TodoListStateStatus.IDLING,
			error,
		}),
	),

	// Handle success cases
	on(TodoListsActions.loadListSuccess, (state, { list }) => ({
		...state,
		status: TodoListStateStatus.IDLING,
		selectedList: list,
	})),
	on(TodoListsActions.loadListsSuccess, (state, { lists }) => ({
		...state,
		status: TodoListStateStatus.IDLING,
		lists,
	})),
	on(TodoListsActions.createListSuccess, (state, { list }) => ({
		...state,
		status: TodoListStateStatus.IDLING,
		lists: [list, ...state.lists],
		selectedList: list,
	})),
	on(TodoListsActions.updateListSuccess, (state, { list: updatedList }) => ({
		...state,
		status: TodoListStateStatus.IDLING,
		selectedList:
			state.selectedList?._id === updatedList._id
				? updatedList
				: state.selectedList,
		lists: state.lists.map((l) =>
			l._id === updatedList._id ? updatedList : l,
		),
	})),
	on(TodoListsActions.deleteListSuccess, (state, { id }) => ({
		...state,
		status: TodoListStateStatus.IDLING,
		selectedList:
			state.selectedList?._id === id ? null : state.selectedList,
		lists: state.lists.filter((l) => l._id !== id),
	})),
);
