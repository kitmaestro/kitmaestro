import { Route } from '@angular/router';

export default [
	{
		path: 'registry', loadComponent: () => import('./pages/grades-registry.component').then(m => m.GradesRegistryComponent),
	}
] as Route[];
