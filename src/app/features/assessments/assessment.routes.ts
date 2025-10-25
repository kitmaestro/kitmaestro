import { Route } from '@angular/router';

export default [
	{
		path: '',
		loadComponent: () =>
			import('./pages/diagnostic-evaluation-generator.component').then(
				(m) => m.DiagnosticEvaluationGeneratorComponent,
			),
		title: 'Generador de Pruebas Diagnósticas',
	},
	{
		path: 'diagnostic-evaluation-generator',
		loadComponent: () =>
			import('./pages/diagnostic-evaluation-generator.component').then(
				(mod) => mod.DiagnosticEvaluationGeneratorComponent,
			),
		title: 'Generador de Pruebas Diagnósticas',
	},
	{
		path: 'diagnostic-evaluations',
		loadComponent: () =>
			import('./pages/diagnostic-evaluations.component').then(
				(mod) => mod.DiagnosticEvaluationsComponent,
			),
		title: 'Pruebas Diagnósticas',
	},
	{
		path: 'diagnostic-evaluations/:id',
		loadComponent: () =>
			import('./pages/diagnostic-evaluation-detail.component').then(
				(mod) => mod.DiagnosticEvaluationDetailComponent,
			),
		title: 'Detalles de Prueba Diagnóstica',
	},
	{
		path: 'checklist-generator',
		loadComponent: () =>
			import('./pages/checklist-generator.component').then(
				(mod) => mod.ChecklistGeneratorComponent,
			),
		title: 'Generador de Listas de Cotejo',
	},
	{
		path: 'checklists',
		loadComponent: () =>
			import('./pages/checklists.component').then(
				(mod) => mod.ChecklistsComponent,
			),
		title: 'Listas de Cotejo',
	},
	{
		path: 'checklists/:id',
		loadComponent: () =>
			import('./pages/checklist-detail.component').then(
				(mod) => mod.ChecklistDetailComponent,
			),
		title: 'Detalles de la Lista de Cotejo',
	},
	{
		path: 'test-generator',
		loadComponent: () =>
			import('./pages/test-generator.component').then(
				(mod) => mod.TestGeneratorComponent,
			),
		title: 'Generador de Exámenes',
	},
	{
		path: 'tests',
		loadComponent: () =>
			import('./pages/test-list.component').then(
				(mod) => mod.TestListComponent,
			),
		title: 'Mis Exámenes',
	},
	{
		path: 'tests/:id',
		loadComponent: () =>
			import('./pages/test-detail.component').then(
				(mod) => mod.TestDetailComponent,
			),
		title: 'Detalles del Examen',
	},
	{
		path: 'observation-sheet',
		loadComponent: () =>
			import('./pages/observation-sheet.component').then(
				(mod) => mod.ObservationSheetComponent,
			),
		title: 'Generador de Hojas de Observación',
	},
	{
		path: 'observation-sheets',
		loadComponent: () =>
			import('./pages/observation-sheets.component').then(
				(mod) => mod.ObservationSheetsComponent,
			),
		title: 'Mis Hojas de Observación',
	},
	{
		path: 'observation-sheets/:id',
		loadComponent: () =>
			import('./pages/observation-sheet-detail.component').then(
				(mod) => mod.ObservationSheetDetailComponent,
			),
		title: 'Detalles de la Hoja de Observación',
	},
	{
		path: 'rubric-generator',
		loadComponent: () =>
			import('./pages/rubric-generator.component').then(
				(mod) => mod.RubricGeneratorComponent,
			),
		title: 'Generador de Rúbricas',
	},
	{
		path: 'rubric-lot-generator',
		loadComponent: () =>
			import('./pages/rubric-lot-generator.component').then(
				(mod) => mod.RubricLotGeneratorComponent,
			),
		title: 'Generador de Rúbricas por Lote',
	},
	{
		path: 'rubrics',
		loadComponent: () =>
			import('./pages/rubrics.component').then(
				(mod) => mod.RubricsComponent,
			),
		title: 'Rúbricas',
	},
	{
		path: 'rubrics/:id',
		loadComponent: () =>
			import('./pages/rubric-detail.component').then(
				(mod) => mod.RubricDetailComponent,
			),
		title: 'Detalles de la Rúbrica',
	},
	{
		path: 'estimation-scale',
		loadComponent: () =>
			import('./pages/estimation-scale.component').then(
				(mod) => mod.EstimationScaleComponent,
			),
		title: 'Generador de Escalas de Estimación',
	},
	{
		path: 'estimation-scales',
		loadComponent: () =>
			import('./pages/estimation-scales.component').then(
				(mod) => mod.EstimationScalesComponent,
			),
		title: 'Escalas de Estimación',
	},
	{
		path: 'estimation-scales/:id',
		loadComponent: () =>
			import('./pages/estimation-scale-detail.component').then(
				(mod) => mod.EstimationScaleDetailComponent,
			),
		title: 'Detalles de la Escala de Estimación',
	},
	{
		path: 'grading-systems',
		loadComponent: () =>
			import('./pages/score-system-generator.component').then(
				(mod) => mod.ScoreSystemGeneratorComponent,
			),
		title: 'Generador de Sistemas de Calificación',
	},
	{
		path: 'grading-systems/list',
		loadComponent: () =>
			import('./pages/score-systems.component').then(
				(mod) => mod.ScoreSystemsComponent,
			),
		title: 'Mis Sistemas de Calificación',
	},
	{
		path: 'grading-systems/:id',
		loadComponent: () =>
			import('./pages/score-system-detail.component').then(
				(mod) => mod.ScoreSystemDetailComponent,
			),
		title: 'Detalles del Sistema de Calificación',
	},
	{
		path: 'log-registry-generator',
		loadComponent: () =>
			import('./pages/log-registry-generator.component').then(
				(mod) => mod.LogRegistryGeneratorComponent,
			),
		title: 'Generador de Registros Anecdóticos',
	},
	{
		path: 'improvement-plan-generator',
		loadComponent: () => import('./pages/improvement-plan-generator.component').then(mod => mod.ImprovementPlanGeneratorComponent),
		title: 'Generador de Planes de Mejora'
	},
] as Route[];
