import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './layouts/auth-layout.component';
import { MainLayoutComponent } from './layouts/main-layout.component';
import authRoutes from './features/auth/auth.routes';
import adminRoutes from './features/admin/admin.routes';

import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';
import resourcesRoutes from './features/resources/resources.routes';
import supportRoutes from './features/support/support.routes';
import publicRoutes from './features/public/public.routes';
import { PrintLayoutComponent } from './layouts/print-layout.component';
import { PublicLayoutComponent } from './layouts/public-layout.component';
import classPlanningRoutes from './features/class-planning/class-planning.routes';
import usersRoutes from './features/users/users.routes';
import activitiesRoutes from './features/activities/activities.routes';
import registryRoutes from './features/registry/registry.routes';
import sectionsRoutes from './features/class-sections/sections.routes';

export const routes: Routes = [
	{
		path: 'auth',
		component: AuthLayoutComponent,
		children: authRoutes,
	},
	{
		path: 'admin',
		component: MainLayoutComponent,
		canActivate: [adminGuard],
		children: adminRoutes,
	},
	{
		path: '',
		canActivate: [authGuard],
		component: MainLayoutComponent,
		children: [
			{
				path: '',
				loadComponent: () =>
					import('./features/home/home.component').then(
						(mod) => mod.HomeComponent,
					),
				title: 'Inicio - KitMaestro',
			},
			{
				path: 'buy',
				loadComponent: () =>
					import(
						'./features/public/pages/buy-subscription.component'
					).then((mod) => mod.BuySubscriptionComponent),
				title: 'Comprar Suscripción',
			},
			{ path: 'users', children: usersRoutes },
			{ path: 'profile', redirectTo: '/users/me', },
			{ path: 'planning', children: classPlanningRoutes },
			{ path: 'support', children: supportRoutes },
			{ path: 'sections', children: sectionsRoutes },
			{ path: 'registry', children: registryRoutes },
			{ path: 'activities', children: activitiesRoutes },
			{ path: 'resources', children: resourcesRoutes, },
		],
	},

	{
		path: '',
		component: PublicLayoutComponent,
		children: publicRoutes,
		canActivate: [authGuard],
	},

	{
		path: '',
		component: MainLayoutComponent,
		canActivate: [authGuard],
		children: classPlanningRoutes,
	},

	{
		path: '',
		component: PrintLayoutComponent,
		children: [
			{
				path: 'print-unit-plan/:id',
				loadComponent: () =>
					import(
						'./features/class-planning/pages/unit-plan-detail.component'
					).then((mod) => mod.UnitPlanDetailComponent),
				title: 'Plan de Unidad',
			},
		],
	},

	{ path: '**', redirectTo: '/', pathMatch: 'full' },
];
