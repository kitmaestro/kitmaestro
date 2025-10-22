import { Todo } from '../../core';

export interface TodoDto {
	user: string;
	list: string;
	title: string;
	description: string;
	completed: boolean;
}

export enum TodoStateStatus {
	IDLING,
	LOADING_TODOS,
	LOADING_LIST_TODOS,
	LOADING_TODO,
	CREATING_TODO,
	UPDATING_TODO,
	DELETING_TODO,
}

export interface TodosState {
	todos: Todo[];
	listTodos: Todo[];
	selectedTodo: Todo | null;
	error: string | null;
	status: TodoStateStatus;
}

export const initialTodosState: TodosState = {
	todos: [],
	listTodos: [],
	selectedTodo: null,
	error: null,
	status: TodoStateStatus.IDLING,
};
