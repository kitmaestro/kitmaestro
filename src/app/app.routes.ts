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
import schedulingRoutes from './features/scheduling/scheduling.routes';
import classPlanningRoutes from './features/class-planning/class-planning.routes';
import usersRoutes from './features/users/users.routes';
import activitiesRoutes from './features/activities/activities.routes';
import registryRoutes from './features/registry/registry.routes';

export const routes: Routes = [
	// authentication
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
			{
				path: 'referrals',
				loadComponent: () =>
					import('./features/referrals/referrals.component').then(
						(mod) => mod.ReferralsComponent,
					),
				title: 'Panel de Referidos',
			},
			{ path: 'users', children: usersRoutes },
			{ path: 'profile', redirectTo: '/users/me', },
			{ path: 'support', children: supportRoutes },

			// sections
			{
				path: 'sections',
				loadComponent: () =>
					import(
						'./features/class-sections/class-sections/class-sections.component'
					).then((mod) => mod.ClassSectionsComponent),
				title: 'Mis Secciones',
			},
			{
				path: 'sections/:id',
				loadComponent: () =>
					import(
						'./features/class-sections/section-details/section-details.component'
					).then((mod) => mod.SectionDetailsComponent),
				title: 'Detalles de la Sección',
			},
			
			{ path: 'registry', children: registryRoutes },

			// Activities
			{ path: 'activities', children: activitiesRoutes },

			{
				path: 'grading-systems',
				loadComponent: () =>
					import(
						'./features/grading/score-system-generator/score-system-generator.component'
					).then((mod) => mod.ScoreSystemGeneratorComponent),
				title: 'Generador de Sistemas de Calificación',
			},
			{
				path: 'grading-systems/list',
				loadComponent: () =>
					import(
						'./features/grading/score-systems/score-systems.component'
					).then((mod) => mod.ScoreSystemsComponent),
				title: 'Mis Sistemas de Calificación',
			},
			{
				path: 'grading-systems/:id',
				loadComponent: () =>
					import(
						'./features/grading/score-system-detail/score-system-detail.component'
					).then((mod) => mod.ScoreSystemDetailComponent),
				title: 'Detalles del Sistema de Calificación',
			},

			// motivation
			{
				path: 'reflection-generator',
				loadComponent: () =>
					import(
						'./features/motivation/reflection-generator.component'
					).then((m) => m.ReflectionGeneratorComponent),
				title: 'Generador de Reflexiones',
			},

			// Generators
			{
				path: 'schedule-generator',
				loadComponent: () =>
					import(
						'./features/generators/schedule-generator/schedule-generator.component'
					).then((mod) => mod.ScheduleGeneratorComponent),
				title: 'Generador de Horarios',
			},
			{
				path: 'math-problem-generator',
				loadComponent: () =>
					import(
						'./features/generators/math-problem-generator.component'
					).then((mod) => mod.MathProblemGeneratorComponent),
				title: 'Generador de Problemas Matemáticos',
			},
			{
				path: 'study-path-generator',
				loadComponent: () =>
					import(
						'./features/generators/study-path-generator.component'
					).then((mod) => mod.StudyPathGeneratorComponent),
				title: 'Generador de Rutas de Estudio',
			},
			{
				path: 'english-dialog-generator',
				loadComponent: () =>
					import(
						'./features/generators/english-dialog-generator/english-dialog-generator.component'
					).then((mod) => mod.EnglishDialogGeneratorComponent),
				title: 'Generador de Dialogos en Inglés',
			},
			{
				path: 'log-registry-generator',
				loadComponent: () =>
					import(
						'./features/generators/log-registry-generator/log-registry-generator.component'
					).then((mod) => mod.LogRegistryGeneratorComponent),
				title: 'Generador de Registros Anecdóticos',
			},

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
		path: 'schedules',
		component: MainLayoutComponent,
		canActivate: [authGuard],
		children: schedulingRoutes,
	},

	{
		path: '',
		component: PrintLayoutComponent,
		children: [
			{
				path: 'print-unit-plan/:id',
				loadComponent: () =>
					import(
						'./features/class-planning/pages/unit-plan-detail/unit-plan-detail.component'
					).then((mod) => mod.UnitPlanDetailComponent),
				title: 'Plan de Unidad',
			},
		],
	},

	{ path: '**', redirectTo: '/', pathMatch: 'full' },
];
