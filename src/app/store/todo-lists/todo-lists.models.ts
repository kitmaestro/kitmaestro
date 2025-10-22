import { TodoList } from '../../core/models';

export interface TodoListDto {
	user: string;
	name: string;
	description: string;
	active: boolean;
}

export enum TodoListStateStatus {
	IDLING,
	LOADING_LISTS,
	LOADING_LIST,
	CREATING_LIST,
	UPDATING_LIST,
	DELETING_LIST,
}

export interface TodoListsState {
	lists: TodoList[];
	selectedList: TodoList | null;
	error: string | null;
	status: TodoListStateStatus;
}

export const initialTodoListsState: TodoListsState = {
	lists: [],
	selectedList: null,
	error: null,
	status: TodoListStateStatus.IDLING,
};
