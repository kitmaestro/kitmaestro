import { Route } from '@angular/router';

export default [
	{
		path: 'me',
		loadComponent: () =>
			import('./pages/user-profile.component').then(
				(m) => m.UserProfileComponent,
			),
		title: 'Perfil del Usuario',
	},
	{
		path: 'my-resources',
		loadComponent: () =>
			import('./pages/resources-dashboard.component').then(
				(m) => m.ResourcesDashboardComponent,
			),
		title: 'Mis Recursos',
	},
	{
		path: 'referrals',
		loadComponent: () =>
			import('./pages/referrals.component').then(
				(mod) => mod.ReferralsComponent,
			),
		title: 'Panel de Referidos',
	},
] as Route[];
