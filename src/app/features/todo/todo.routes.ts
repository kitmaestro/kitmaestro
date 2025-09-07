import { Routes } from '@angular/router';

export default [
	{
		path: '',
		title: 'Listas de Pendientes',
		loadComponent: () =>
			import('./pages/todo-lists.component').then(
				(mod) => mod.TodoListsComponent,
			),
	},
	{
		path: ':id',
		title: 'Lista de Tareas',
		loadComponent: () =>
			import('./pages/todos.component').then((mod) => mod.TodosComponent),
	},
] as Routes;
