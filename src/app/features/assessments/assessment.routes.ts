import { Route } from '@angular/router';

export default [
	{
		path: '',
		loadComponent: () =>
			import(
				'./diagnostic-evaluation/diagnostic-evaluation.component'
			).then((m) => m.DiagnosticEvaluationGeneratorComponent),
	},
] as Route[];
