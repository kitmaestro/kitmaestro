import { createReducer, on } from '@ngrx/store';
import * as TodosActions from './todos.actions';
import { initialTodosState, TodoStateStatus } from './todos.models';

export const todosReducer = createReducer(
	initialTodosState,

	// Set status for ongoing operations
	on(TodosActions.loadTodo, (state) => ({
		...state,
		status: TodoStateStatus.LOADING_TODO,
	})),
	on(TodosActions.loadTodos, (state) => ({
		...state,
		status: TodoStateStatus.LOADING_TODOS,
	})),
	on(TodosActions.loadTodosByList, (state) => ({
		...state,
		status: TodoStateStatus.LOADING_LIST_TODOS,
	})),
	on(TodosActions.createTodo, (state) => ({
		...state,
		status: TodoStateStatus.CREATING_TODO,
	})),
	on(TodosActions.updateTodo, (state) => ({
		...state,
		status: TodoStateStatus.UPDATING_TODO,
	})),
	on(TodosActions.deleteTodo, (state) => ({
		...state,
		status: TodoStateStatus.DELETING_TODO,
	})),

	// Handle failure cases
	on(
		TodosActions.loadTodoFailed,
		TodosActions.loadTodosFailed,
		TodosActions.loadTodosByListFailed,
		TodosActions.createTodoFailed,
		TodosActions.updateTodoFailed,
		TodosActions.deleteTodoFailed,
		(state, { error }) => ({
			...state,
			status: TodoStateStatus.IDLING,
			error,
		}),
	),

	// Handle success cases
	on(TodosActions.loadTodoSuccess, (state, { todo }) => ({
		...state,
		status: TodoStateStatus.IDLING,
		selectedTodo: todo,
	})),
	on(TodosActions.loadTodosSuccess, (state, { todos }) => ({
		...state,
		status: TodoStateStatus.IDLING,
		todos,
	})),
	on(TodosActions.loadTodosByListSuccess, (state, { todos }) => ({
		...state,
		status: TodoStateStatus.IDLING,
		listTodos: todos,
	})),
	on(TodosActions.createTodoSuccess, (state, { todo }) => ({
		...state,
		status: TodoStateStatus.IDLING,
		todos: [todo, ...state.todos],
		listTodos: [todo, ...state.listTodos], // Asumimos que se añade a la lista actual
	})),
	on(TodosActions.updateTodoSuccess, (state, { todo: updatedTodo }) => ({
		...state,
		status: TodoStateStatus.IDLING,
		selectedTodo:
			state.selectedTodo?._id === updatedTodo._id
				? updatedTodo
				: state.selectedTodo,
		todos: state.todos.map((t) =>
			t._id === updatedTodo._id ? updatedTodo : t,
		),
		listTodos: state.listTodos.map((t) =>
			t._id === updatedTodo._id ? updatedTodo : t,
		),
	})),
	on(TodosActions.deleteTodoSuccess, (state, { id }) => ({
		...state,
		status: TodoStateStatus.IDLING,
		selectedTodo:
			state.selectedTodo?._id === id ? null : state.selectedTodo,
		todos: state.todos.filter((t) => t._id !== id),
		listTodos: state.listTodos.filter((t) => t._id !== id),
	})),
);
