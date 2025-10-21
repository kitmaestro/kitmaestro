import { Route } from '@angular/router';

export default [
	{
		path: 'addition-generator',
		loadComponent: () =>
			import('./pages/addition-generator.component').then(
				(mod) => mod.AdditionGeneratorComponent,
			),
		title: 'Generador de Sumas',
	},
	{
		path: 'antonyms-generator',
		loadComponent: () =>
			import('./pages/antonyms-generator.component').then(
				(m) => m.AntonymsGeneratorComponent,
			),
		title: 'Generador de Antónimos',
	},
	{
		path: 'cartesian-coordinates-generator',
		loadComponent: () =>
			import('./pages/cartesian-coordinates-generator.component').then(
				(m) => m.CartesianCoordinatesGeneratorComponent,
			),
		title: 'Generador de Planos Cartesianos',
	},
	{
		path: 'crosswords-generator',
		loadComponent: () =>
			import('./pages/crosswords-generator.component').then(
				(m) => m.CrosswordsGeneratorComponent,
			),
		title: 'Generador de Crucigramas',
	},
	{
		path: 'division-generator',
		loadComponent: () =>
			import('./pages/division-generator.component').then(
				(m) => m.DivisionGeneratorComponent,
			),
		title: 'Generador de Divisones',
	},
	{
		path: 'english-dialog-generator',
		loadComponent: () =>
			import('./pages/english-dialog-generator.component').then(
				(mod) => mod.EnglishDialogGeneratorComponent,
			),
		title: 'Generador de Dialogos en Inglés',
	},
	{
		path: 'equations-generator',
		loadComponent: () =>
			import('./pages/equations-generator.component').then(
				(m) => m.EquationsGeneratorComponent,
			),
		title: 'Generador de Ecuaciones',
	},
	{
		path: 'graph-paper-generator',
		loadComponent: () =>
			import('./pages/graph-paper-generator.component').then(
				(m) => m.GraphPaperGeneratorComponent,
			),
		title: 'Generador de Papel Cuadriculado',
	},
	{
		path: 'guided-reading-generator',
		loadComponent: () =>
			import('./pages/reading-activity-generator.component').then(
				(mod) => mod.ReadingActivityGeneratorComponent,
			),
		title: 'Generador de Actividad de Lectura',
	},
	{
		path: 'holiday-activity-generator',
		loadComponent: () =>
			import('./pages/holiday-activity-generator.component').then(
				(mod) => mod.HolidayActivityGeneratorComponent,
			),
		title: 'Actividades para Efemérides',
	},
	{
		path: 'math-problem-generator',
		loadComponent: () =>
			import('./pages/math-problem-generator.component').then(
				(mod) => mod.MathProblemGeneratorComponent,
			),
		title: 'Generador de Problemas Matemáticos',
	},
	{
		path: 'mixed-operations-generator',
		loadComponent: () =>
			import('./pages/mixed-operations-generator.component').then(
				(m) => m.MixedOperationsGeneratorComponent,
			),
		title: 'Generador de Operaciones Mixtas',
	},
	{
		path: 'multiplication-generator',
		loadComponent: () =>
			import('./pages/multiplication-generator.component').then(
				(m) => m.MultiplicationGeneratorComponent,
			),
		title: 'Generador de Multiplicaciones',
	},
	{
		path: 'number-line-generator',
		loadComponent: () =>
			import('./pages/number-line-generator.component').then(
				(m) => m.NumberLineGeneratorComponent,
			),
		title: 'Generador de Recta Numerica',
	},
	{
		path: 'reading-activities',
		loadComponent: () =>
			import('./pages/reading-activity-list.component').then(
				(mod) => mod.ReadingActivityListComponent,
			),
		title: 'Actividad de Lectura',
	},
	{
		path: 'reading-activities/:id',
		loadComponent: () =>
			import('./pages/reading-activity-detail.component').then(
				(mod) => mod.ReadingActivityDetailComponent,
			),
		title: 'Actividad de Lectura',
	},
	{
		path: 'subtraction-generator',
		loadComponent: () =>
			import('./pages/subtraction-generator.component').then(
				(m) => m.SubtractionGeneratorComponent,
			),
		title: 'Generador de Restas',
	},
	{
		path: 'sudoku-generator',
		loadComponent: () =>
			import('./pages/sudoku-generator.component').then(
				(m) => m.SudokuGeneratorComponent,
			),
		title: 'Generador de Sudoku',
	},
	{
		path: 'synonyms-generator',
		loadComponent: () =>
			import('./pages/synonyms-generator.component').then(
				(m) => m.SynonymsGeneratorComponent,
			),
		title: 'Generador de Sinónimos',
	},
	{
		path: 'tongue-twister-generator',
		loadComponent: () =>
			import('./pages/tongue-twister-generator.component').then(
				(mod) => mod.TongueTwisterGeneratorComponent,
			),
		title: 'Generador de Trabalenguas',
	},
	{
		path: 'word-scramble-generator',
		loadComponent: () =>
			import('./pages/scrambled-words-generator.component').then(
				(m) => m.ScrambledWordsGeneratorComponent,
			),
		title: 'Generador de Palabras Revueltas',
	},
	{
		path: 'wordsearch-generator',
		loadComponent: () =>
			import('./pages/wordsearch-generator.component').then(
				(m) => m.WordsearchGeneratorComponent,
			),
		title: 'Generador de Sopa de Letras',
	},
] as Route[];
