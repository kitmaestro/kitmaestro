import { Routes } from '@angular/router';

export default [
	{
		path: '',
		loadComponent: () =>
			import('./pages/admin-dashboard.component').then(
				(mod) => mod.AdminDashboardComponent,
			),
		title: 'Panel de Administración',
	},
	{
		path: 'didactic-sequences',
		loadComponent: () =>
			import('./pages/didactic-sequences.component').then(
				(mod) => mod.DidacticSequencesComponent,
			),
		title: 'Secuencias Didácticas',
	},
	{
		path: 'didactic-sequences/new',
		loadComponent: () =>
			import('./pages/didactic-sequence-creator.component').then(
				(mod) => mod.DidacticSequenceCreatorComponent,
			),
		title: 'Secuencia Didáctica',
	},
	{
		path: 'didactic-sequences/:id',
		loadComponent: () =>
			import('./pages/didactic-sequence-details.component').then(
				(mod) => mod.DidacticSequenceDetailsComponent,
			),
		title: 'Secuencia Didáctica',
	},
	{
		path: 'content-blocks',
		loadComponent: () =>
			import('./pages/content-blocks-management.component').then(
				(mod) => mod.ContentBlocksManagementComponent,
			),
		title: 'Bloques de Contenido',
	},
	{
		path: 'main-themes',
		loadComponent: () =>
			import('./pages/main-themes-management.component').then(
				(mod) => mod.MainThemesManagementComponent,
			),
		title: 'Ejes Transversales',
	},
	{
		path: 'competence-entries',
		loadComponent: () =>
			import('./pages/competence-entries-management.component').then(
				(mod) => mod.CompetenceEntriesManagementComponent,
			),
		title: 'Ejes Transversales',
	},
	{
		path: 'users',
		loadComponent: () =>
			import('./pages/users.component').then((mod) => mod.UsersComponent),
		title: 'Usuarios',
	},
	{
		path: 'users/:id',
		loadComponent: () =>
			import('./pages/user-details.component').then(
				(mod) => mod.UserDetailsComponent,
			),
		title: 'Detalles del Usuario',
	},
] as Routes;
