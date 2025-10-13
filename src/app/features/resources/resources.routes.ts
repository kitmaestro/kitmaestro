import { Routes } from '@angular/router';

export default [
	{
		path: 'icebreaker-generator',
		loadComponent: () =>
			import(
				'./pages/icebreaker-generator.component'
			).then((m) => m.IcebreakerGeneratorComponent),
		title: 'Generador de Rompehielos',
	},
	{
		path: 'class-hook-generator',
		loadComponent: () =>
			import(
				'./pages/class-hook-generator.component'
			).then((mod) => mod.ClassHookGeneratorComponent),
		title: 'Generador de Ganchos',
	},
	{
		path: 'joke-generator',
		loadComponent: () =>
			import(
				'./pages/joke-generator.component'
			).then((mod) => mod.JokeGeneratorComponent),
		title: 'Generador de Chistes',
	},
	{
		path: 'fable-generator',
		loadComponent: () =>
			import(
				'./pages/fable-generator.component'
			).then((mod) => mod.FableGeneratorComponent),
		title: 'Generador de Fábulas',
	},
	{
		path: 'fun-fact-generator',
		loadComponent: () =>
			import(
				'./pages/fun-fact-generator.component'
			).then((mod) => mod.FunFactGeneratorComponent),
		title: 'Generador de Curiosidades',
	},
	{
		path: 'expository-article-generator',
		loadComponent: () =>
			import(
				'./pages/expository-article-generator.component'
			).then((mod) => mod.ExpositoryArticleGeneratorComponent),
		title: 'Generador de Artículo Expositivo',
	},
	{
		path: 'story-generator',
		loadComponent: () =>
			import(
				'./pages/story-generator.component'
			).then((mod) => mod.StoryGeneratorComponent),
		title: 'Generador de Cuentos',
	},
	{
		path: 'poem-generator',
		loadComponent: () =>
			import(
				'./pages/poem-generator.component'
			).then((mod) => mod.PoemGeneratorComponent),
		title: 'Generador de Poesía',
	},
	{
		path: 'riddle-generator',
		loadComponent: () =>
			import(
				'./pages/riddle-generator.component'
			).then((mod) => mod.RiddleGeneratorComponent),
		title: 'Generador de Adivinanzas',
	},
	{
		path: 'proverb-generator',
		loadComponent: () =>
			import(
				'./pages/proverb-generator.component'
			).then((mod) => mod.ProverbGeneratorComponent),
		title: 'Generador de Refranes',
	},
	{
		path: 'song-generator',
		loadComponent: () =>
			import(
				'./pages/song-generator.component'
			).then((mod) => mod.SongGeneratorComponent),
		title: 'Generador de Canciones',
	},

	{
		path: 'reflection-generator',
		loadComponent: () =>
			import(
				'./pages/reflection-generator.component'
			).then((m) => m.ReflectionGeneratorComponent),
		title: 'Generador de Reflexiones',
	},
] as Routes;
