import { Routes } from '@angular/router';

export default [
	{
		path: 'sports-practice-generator',
		loadComponent: () =>
			import('./pages/sports-practice-generator.component').then(
				(mod) => mod.SportsPracticeGeneratorComponent,
			),
		title: 'Generador de Prácticas Deportivas',
	},
	{
		path: 'emi-class-plans',
		loadComponent: () =>
			import(
				'./pages/multigrade-class-plan-generator.component'
			).then((mod) => mod.MultigradeClassPlanGeneratorComponent),
		title: 'Generador de Planes de Clase Multigrado',
	},
	{
		path: 'class-plans',
		loadComponent: () =>
			import(
				'./pages/class-plan-generator.component'
			).then((mod) => mod.ClassPlanGeneratorComponent),
		title: 'Generador de Planes de Clase',
	},
	{
		path: 'class-plans/list',
		loadComponent: () =>
			import('./pages/class-plan-list.component').then(
				(mod) => mod.ClassPlanListComponent,
			),
		title: 'Mis Planes de Clase',
	},
	{
		path: 'class-plans/batch',
		loadComponent: () =>
			import(
				'./pages/daily-plan-batch-generator.component'
			).then((mod) => mod.DailyPlanBatchGeneratorComponent),
		title: 'Mis Planes de Clase',
	},
	{
		path: 'class-plans/:id',
		loadComponent: () =>
			import(
				'./pages/class-plan-detail.component'
			).then((mod) => mod.ClassPlanDetailComponent),
		title: 'Detalles del Plan de Clase',
	},
	{
		path: 'class-plans/:id/edit',
		loadComponent: () =>
			import('./pages/class-plan-edit.component').then(
				(mod) => mod.ClassPlanEditComponent,
			),
		title: 'Editar Plan de Clase',
	},
	{
		path: 'annual-plans',
		loadComponent: () =>
			import(
				'./pages/annual-plan-generator.component'
			).then((mod) => mod.AnnualPlanGeneratorComponent),
		title: 'Generador de Planes de Unidad',
	},
	{
		path: 'unit-plans',
		loadComponent: () =>
			import(
				'./pages/unit-plan-generator.component'
			).then((mod) => mod.UnitPlanGeneratorComponent),
		title: 'Generador de Planes de Unidad',
	},
	{
		path: 'emi-unit-plans',
		loadComponent: () =>
			import('./pages/multigrade-unit-plan-generator.component').then(
				(mod) => mod.MultigradeUnitPlanGeneratorComponent,
			),
		title: 'Generador de Planes de Unidad Multigrado',
	},
	{
		path: 'kinder-unit-plans',
		loadComponent: () =>
			import(
				'./pages/kindergarten-unit-plan-generator.component'
			).then((mod) => mod.KindergartenUnitPlanGeneratorComponent),
		title: 'Generador de Planes de Unidad de Inicial',
	},
	{
		path: 'unit-plans/list',
		loadComponent: () =>
			import('./pages/unit-plan-list.component').then(
				(mod) => mod.UnitPlanListComponent,
			),
		title: 'Mis Planes de Unidad',
	},
	{
		path: 'unit-plans/:id',
		loadComponent: () =>
			import('./pages/unit-plan-detail.component').then(
				(mod) => mod.UnitPlanDetailComponent,
			),
		title: 'Detalles del Plan de Unidad',
	},
	{
		path: 'unit-plans/:id/edit',
		loadComponent: () =>
			import('./pages/unit-plan-edit.component').then(
				(mod) => mod.UnitPlanEditComponent,
			),
		title: 'Editar Plan de Unidad',
	},
	{
		path: 'study-path-generator',
		loadComponent: () =>
			import(
				'./pages/study-path-generator.component'
			).then((mod) => mod.StudyPathGeneratorComponent),
		title: 'Generador de Rutas de Estudio',
	},
] as Routes;
