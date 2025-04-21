import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './layouts/auth-layout.component';
import { MainLayoutComponent } from './layouts/main-layout.component';

export const routes: Routes = [
	// authentication
	{
		path: 'auth',
		component: AuthLayoutComponent,
		children: [
			{
				path: 'signup',
				loadComponent: () =>
					import('./features/auth/signup/signup.component').then(
						(mod) => mod.SignupComponent,
					),
				title: 'Registro de Usuario',
			},
			{
				path: 'login',
				loadComponent: () =>
					import('./features/auth/login/login.component').then(
						(mod) => mod.LoginComponent,
					),
				title: 'Inicio de Sesión',
			},
			{
				path: 'login/success/:jwt',
				loadComponent: () =>
					import('./features/auth/login/login.component').then(
						(mod) => mod.LoginComponent,
					),
				title: 'Inicio de Sesión',
			},
			{
				path: 'login/failure',
				redirectTo: '/auth/login?error=Login Failure',
				pathMatch: 'full',
			},
			{
				path: 'reset',
				loadComponent: () =>
					import(
						'./features/auth/pass-update/pass-update.component'
					).then((mod) => mod.PassUpdateComponent),
				title: 'Restablece tu Contraseña',
			},
			{ path: '**', redirectTo: '/auth/login', pathMatch: 'full' },
		],
	},
	{
		path: '',
		component: MainLayoutComponent,
		children: [
			// Admin area
			{
				path: 'admin',
				loadComponent: () =>
					import(
						'./features/admin/admin-dashboard/admin-dashboard.component'
					).then((mod) => mod.AdminDashboardComponent),
				title: 'Panel de Administración',
			},
			{
				path: 'admin/users',
				loadComponent: () =>
					import('./features/admin/users/users.component').then(
						(mod) => mod.UsersComponent,
					),
				title: 'Usuarios',
			},
			{
				path: 'users/:id',
				loadComponent: () =>
					import(
						'./features/admin/user-details/user-details.component'
					).then((mod) => mod.UserDetailsComponent),
				title: 'Detalles del Usuario',
			},

			// inspiration
			{
				path: 'ideas',
				loadComponent: () =>
					import('./features/idea-board/idea-board.component').then(
						(mod) => mod.IdeaBoardComponent,
					),
				title: 'Panel de Ideas',
			},
			{
				path: 'ai-assistant',
				loadComponent: () =>
					import('./features/ai/ai-assistant.component').then(
						(mod) => mod.AiAssistantComponent,
					),
				title: 'Asistente Virtual',
			},

			// informational
			{
				path: '',
				loadComponent: () =>
					import('./features/home/home.component').then(
						(mod) => mod.HomeComponent,
					),
				title: 'Inicio - KitMaestro',
			},
			{
				path: 'pricing',
				loadComponent: () =>
					import(
						'./features/buy-subscription/buy-subscription.component'
					).then((mod) => mod.BuySubscriptionComponent),
				title: 'Precios',
			},
			{
				path: 'buy',
				loadComponent: () =>
					import(
						'./features/buy-subscription/buy-subscription.component'
					).then((mod) => mod.BuySubscriptionComponent),
				title: 'Comprar Suscripción',
			},
			{
				path: 'updates',
				loadComponent: () =>
					import(
						'./features/updates/update-list/update-list.component'
					).then((mod) => mod.UpdateListComponent),
				title: 'Noticias - KitMaestro',
			},
			{
				path: 'tutorials',
				loadComponent: () =>
					import('./features/tutorials/tutorials.component').then(
						(mod) => mod.TutorialsComponent,
					),
				title: 'Tutoriales',
			},
			{
				path: 'updates/new',
				loadComponent: () =>
					import('./features/updates/new/new.component').then(
						(mod) => mod.NewComponent,
					),
				title: 'Crear Entrada',
			},
			{
				path: 'roadmap',
				loadComponent: () =>
					import('./features/roadmap/roadmap.component').then(
						(mod) => mod.RoadmapComponent,
					),
				title: 'Planes de Desarrollo',
			},

			// user data
			{
				path: 'profile',
				loadComponent: () =>
					import(
						'./features/user-profile/user-profile.component'
					).then((mod) => mod.UserProfileComponent),
				title: 'Perfil del Usuario',
			},
			{
				path: 'referrals',
				loadComponent: () =>
					import('./features/referrals/referrals.component').then(
						(mod) => mod.ReferralsComponent,
					),
				title: 'Panel de Referidos',
			},

			// utility links
			{
				path: 'print-unit-plan/:id',
				loadComponent: () =>
					import(
						'./features/class-planning/unit-plan-detail/unit-plan-detail.component'
					).then((mod) => mod.UnitPlanDetailComponent),
				title: 'Plan de Unidad',
			},

			// todo
			{
				path: 'todos',
				loadComponent: () =>
					import('./features/todo-lists/todo-lists.component').then(
						(mod) => mod.TodoListsComponent,
					),
				title: 'Lista de Pendientes',
			},
			{
				path: 'todos/:id',
				loadComponent: () =>
					import('./features/todos/todos.component').then(
						(mod) => mod.TodosComponent,
					),
				title: 'Lista de Tareas',
			},

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

			// calculators
			{
				path: 'average-calculator',
				loadComponent: () =>
					import(
						'./features/calculators/average-calculator/average-calculator.component'
					).then((mod) => mod.AverageCalculatorComponent),
				title: 'Calculadora de Promedios',
			},
			{
				path: 'attendance-calculator',
				loadComponent: () =>
					import(
						'./features/calculators/attendance-calculator/attendance-calculator.component'
					).then((mod) => mod.AttendanceCalculatorComponent),
				title: 'Calculadora de Asistencia',
			},

			// Activities
			{
				path: 'tongue-twister-generator',
				loadComponent: () =>
					import(
						'./features/activities/tongue-twister-generator.component'
					).then((mod) => mod.TongueTwisterGeneratorComponent),
				title: 'Generador de Trabalenguas',
			},
			{
				path: 'guided-reading-generator',
				loadComponent: () =>
					import(
						'./features/generators/reading-activity-generator/reading-activity-generator.component'
					).then((mod) => mod.ReadingActivityGeneratorComponent),
				title: 'Generador de Actividad de Lectura',
			},
			{
				path: 'guided-reading',
				loadComponent: () =>
					import(
						'./features/activities/reading-activities.component'
					).then((mod) => mod.ReadingActivitiesComponent),
				title: 'Actividades de Lectura',
			},
			{
				path: 'holiday-activity-generator',
				loadComponent: () =>
					import(
						'./features/activities/holiday-activity-generator.component'
					).then((mod) => mod.HolidayActivityGeneratorComponent),
				title: 'Actividades para Efemérides',
			},

			// Grades/Grading
			{
				path: 'grades-generator',
				loadComponent: () =>
					import(
						'./features/grading/grades-generator/grades-generator.component'
					).then((mod) => mod.GradesGeneratorComponent),
				title: 'Generador de Calificaciones',
			},
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

			// class-management
			{
				path: 'icebreaker-generator',
				loadComponent: () =>
					import(
						'./features/class-management/icebreaker-generator.component'
					).then((m) => m.IcebreakerGeneratorComponent),
				title: 'Generador de Rompehielos',
			},
			{
				path: 'class-hook-generator',
				loadComponent: () =>
					import(
						'./features/class-management/class-hook-generator.component'
					).then((mod) => mod.ClassHookGeneratorComponent),
				title: 'Generador de Ganchos',
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
				path: 'story-generator',
				loadComponent: () =>
					import(
						'./features/generators/story-generator.component'
					).then((mod) => mod.StoryGeneratorComponent),
				title: 'Generador de Cuentos',
			},
			{
				path: 'poem-generator',
				loadComponent: () =>
					import(
						'./features/generators/poem-generator.component'
					).then((mod) => mod.PoemGeneratorComponent),
				title: 'Generador de Poesía',
			},
			{
				path: 'joke-generator',
				loadComponent: () =>
					import(
						'./features/generators/joke-generator.component'
					).then((mod) => mod.JokeGeneratorComponent),
				title: 'Generador de Chistes',
			},
			{
				path: 'fable-generator',
				loadComponent: () =>
					import(
						'./features/generators/fable-generator.component'
					).then((mod) => mod.FableGeneratorComponent),
				title: 'Generador de Fábulas',
			},
			{
				path: 'riddle-generator',
				loadComponent: () =>
					import(
						'./features/generators/riddle-generator.component'
					).then((mod) => mod.RiddleGeneratorComponent),
				title: 'Generador de Adivinanzas',
			},
			{
				path: 'fun-fact-generator',
				loadComponent: () =>
					import(
						'./features/generators/fun-fact-generator.component'
					).then((mod) => mod.FunFactGeneratorComponent),
				title: 'Generador de Curiosidades',
			},
			{
				path: 'proverb-generator',
				loadComponent: () =>
					import(
						'./features/generators/proverb-generator.component'
					).then((mod) => mod.ProverbGeneratorComponent),
				title: 'Generador de Refranes',
			},
			{
				path: 'song-generator',
				loadComponent: () =>
					import(
						'./features/generators/song-generator.component'
					).then((mod) => mod.SongGeneratorComponent),
				title: 'Generador de Canciones',
			},
			{
				path: 'expository-article-generator',
				loadComponent: () =>
					import(
						'./features/generators/expository-article-generator.component'
					).then((mod) => mod.ExpositoryArticleGeneratorComponent),
				title: 'Generador de Artículo Expositivo',
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
				path: 'aspects-generator',
				loadComponent: () =>
					import(
						'./features/generators/aspects-generator/aspects-generator.component'
					).then((mod) => mod.AspectsGeneratorComponent),
				title: 'Generador de Aspectos Trabajados',
			},
			{
				path: 'attendance-generator',
				loadComponent: () =>
					import(
						'./features/generators/attendance-generator/attendance-generator.component'
					).then((mod) => mod.AttendanceGeneratorComponent),
				title: 'Generador de Asistencia',
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
			{
				path: 'planner-generator',
				loadComponent: () =>
					import(
						'./features/generators/planner-generator/planner-generator.component'
					).then((mod) => mod.PlannerGeneratorComponent),
				title: 'Generador de Planificadores',
			},

			// worksheet builders
			{
				path: 'wordsearch',
				loadComponent: () =>
					import(
						'./features/builders/wordsearch/wordsearch.component'
					).then((m) => m.WordsearchComponent),
				title: 'Generador de Sopa de Letras',
			},
			{
				path: 'word-scramble',
				loadComponent: () =>
					import(
						'./features/builders/word-scramble/word-scramble.component'
					).then((m) => m.WordScrambleComponent),
				title: 'Generador de Palabras Revueltas',
			},
			{
				path: 'crosswords',
				loadComponent: () =>
					import(
						'./features/builders/crosswords/crosswords.component'
					).then((m) => m.CrosswordsComponent),
				title: 'Generador de Crucigramas',
			},
			{
				path: 'synonyms',
				loadComponent: () =>
					import(
						'./features/builders/synonyms/synonyms.component'
					).then((m) => m.SynonymsComponent),
				title: 'Generador de Sinónimos',
			},
			{
				path: 'antonyms',
				loadComponent: () =>
					import(
						'./features/builders/antonyms/antonyms.component'
					).then((m) => m.AntonymsComponent),
				title: 'Generador de Antónimos',
			},
			{
				path: 'sudoku',
				loadComponent: () =>
					import('./features/builders/sudoku/sudoku.component').then(
						(m) => m.SudokuComponent,
					),
				title: 'Generador de Sudoku',
			},
			{
				path: 'addition',
				loadComponent: () =>
					import(
						'./features/builders/addition/addition.component'
					).then((m) => m.AdditionComponent),
				title: 'Generador de Sumas',
			},
			{
				path: 'subtraction',
				loadComponent: () =>
					import(
						'./features/builders/subtraction/subtraction.component'
					).then((m) => m.SubtractionComponent),
				title: 'Generador de Restas',
			},
			{
				path: 'equations',
				loadComponent: () =>
					import(
						'./features/builders/equations/equations.component'
					).then((m) => m.EquationsComponent),
				title: 'Generador de Ecuaciones',
			},
			{
				path: 'multiplication',
				loadComponent: () =>
					import(
						'./features/builders/multiplication/multiplication.component'
					).then((m) => m.MultiplicationComponent),
				title: 'Generador de Multiplicaciones',
			},
			{
				path: 'division',
				loadComponent: () =>
					import(
						'./features/builders/division-generator.component'
					).then((m) => m.DivisionGeneratorComponent),
				title: 'Generador de Divisones',
			},
			{
				path: 'mixed-operations',
				loadComponent: () =>
					import(
						'./features/builders/mixed-operations/mixed-operations.component'
					).then((m) => m.MixedOperationsComponent),
				title: 'Generador de Operaciones Mixtas',
			},
			{
				path: 'graph-paper',
				loadComponent: () =>
					import(
						'./features/builders/graph-paper/graph-paper.component'
					).then((m) => m.GraphPaperComponent),
				title: 'Generador de Papel Cuadriculado',
			},
			{
				path: 'number-line',
				loadComponent: () =>
					import(
						'./features/builders/number-line-generator.component'
					).then((m) => m.NumberLineGeneratorComponent),
				title: 'Generador de Recta Numerica',
			},
			{
				path: 'cartesian-coordinates',
				loadComponent: () =>
					import(
						'./features/builders/cartesian-coordinates/cartesian-coordinates.component'
					).then((m) => m.CartesianCoordinatesComponent),
				title: 'Generador de Planos Cartesianos',
			},

			// scheduling
			{
				path: 'schedules',
				loadComponent: () =>
					import(
						'./features/scheduling/schedule-list/schedule-list.component'
					).then((mod) => mod.ScheduleListComponent),
				title: 'Administrador de Horarios',
			},
			{
				path: 'schedules/create',
				loadComponent: () =>
					import(
						'./features/scheduling/schedule-builder/schedule-builder.component'
					).then((mod) => mod.ScheduleBuilderComponent),
				title: 'Registrar Horario',
			},
			{
				path: 'schedules/:id',
				loadComponent: () =>
					import(
						'./features/scheduling/schedule-detail/schedule-detail.component'
					).then((mod) => mod.ScheduleDetailComponent),
				title: 'Detalles del Horario',
			},

			// assessments
			{
				path: 'checklist-generator',
				loadComponent: () =>
					import(
						'./features/assessments/checklist-generator/checklist-generator.component'
					).then((mod) => mod.ChecklistGeneratorComponent),
				title: 'Generador de Listas de Cotejo',
			},
			{
				path: 'checklists',
				loadComponent: () =>
					import(
						'./features/assessments/checklists/checklists.component'
					).then((mod) => mod.ChecklistsComponent),
				title: 'Listas de Cotejo',
			},
			{
				path: 'checklists/:id',
				loadComponent: () =>
					import(
						'./features/assessments/checklist-detail/checklist-detail.component'
					).then((mod) => mod.ChecklistDetailComponent),
				title: 'Detalles de la Lista de Cotejo',
			},
			{
				path: 'test-generator',
				loadComponent: () =>
					import(
						'./features/assessments/test-generator/test-generator.component'
					).then((mod) => mod.TestGeneratorComponent),
				title: 'Generador de Exámenes',
			},
			{
				path: 'tests',
				loadComponent: () =>
					import(
						'./features/assessments/test-list/test-list.component'
					).then((mod) => mod.TestListComponent),
				title: 'Mis Exámenes',
			},
			{
				path: 'tests/:id',
				loadComponent: () =>
					import(
						'./features/assessments/test-detail/test-detail.component'
					).then((mod) => mod.TestDetailComponent),
				title: 'Detalles del Examen',
			},
			{
				path: 'observation-sheet',
				loadComponent: () =>
					import(
						'./features/assessments/observation-sheet/observation-sheet.component'
					).then((mod) => mod.ObservationSheetComponent),
				title: 'Generador de Hojas de Observación',
			},
			{
				path: 'observation-sheets',
				loadComponent: () =>
					import(
						'./features/assessments/observation-sheets/observation-sheets.component'
					).then((mod) => mod.ObservationSheetsComponent),
				title: 'Mis Hojas de Observación',
			},
			{
				path: 'observation-sheets/:id',
				loadComponent: () =>
					import(
						'./features/assessments/observation-sheet-detail/observation-sheet-detail.component'
					).then((mod) => mod.ObservationSheetDetailComponent),
				title: 'Detalles de la Hoja de Observación',
			},
			{
				path: 'rubric-generator',
				loadComponent: () =>
					import(
						'./features/assessments/rubric-generator/rubric-generator.component'
					).then((mod) => mod.RubricGeneratorComponent),
				title: 'Generador de Rúbricas',
			},
			{
				path: 'rubrics',
				loadComponent: () =>
					import(
						'./features/assessments/rubrics/rubrics.component'
					).then((mod) => mod.RubricsComponent),
				title: 'Rúbricas',
			},
			{
				path: 'rubrics/:id',
				loadComponent: () =>
					import(
						'./features/assessments/rubric-detail/rubric-detail.component'
					).then((mod) => mod.RubricDetailComponent),
				title: 'Detalles de la Rúbrica',
			},
			{
				path: 'estimation-scale',
				loadComponent: () =>
					import(
						'./features/assessments/estimation-scale/estimation-scale.component'
					).then((mod) => mod.EstimationScaleComponent),
				title: 'Generador de Escalas de Estimación',
			},
			{
				path: 'estimation-scales',
				loadComponent: () =>
					import(
						'./features/assessments/estimation-scales/estimation-scales.component'
					).then((mod) => mod.EstimationScalesComponent),
				title: 'Escalas de Estimación',
			},
			{
				path: 'estimation-scales/:id',
				loadComponent: () =>
					import(
						'./features/assessments/estimation-scale-detail/estimation-scale-detail.component'
					).then((mod) => mod.EstimationScaleDetailComponent),
				title: 'Detalles de la Escala de Estimación',
			},

			// Class planning
			{
				path: 'sports-practice-generator',
				loadComponent: () =>
					import(
						'./features/class-planning/sports-practice-generator.component'
					).then((mod) => mod.SportsPracticeGeneratorComponent),
				title: 'Generador de Prácticas Deportivas',
			},
			{
				path: 'class-plans',
				loadComponent: () =>
					import(
						'./features/class-planning/class-plan-generator/class-plan-generator.component'
					).then((mod) => mod.ClassPlanGeneratorComponent),
				title: 'Generador de Planes de Clase',
			},
			{
				path: 'class-plans/list',
				loadComponent: () =>
					import(
						'./features/class-planning/class-plan-list/class-plan-list.component'
					).then((mod) => mod.ClassPlanListComponent),
				title: 'Mis Planes de Clase',
			},
			{
				path: 'class-plans/:id',
				loadComponent: () =>
					import(
						'./features/class-planning/class-plan-detail/class-plan-detail.component'
					).then((mod) => mod.ClassPlanDetailComponent),
				title: 'Detalles del Plan de Clase',
			},
			{
				path: 'class-plans/:id/edit',
				loadComponent: () =>
					import(
						'./features/class-planning/class-plan-edit/class-plan-edit.component'
					).then((mod) => mod.ClassPlanEditComponent),
				title: 'Editar Plan de Clase',
			},
			{
				path: 'unit-plans',
				loadComponent: () =>
					import(
						'./features/class-planning/unit-plan-generator/unit-plan-generator.component'
					).then((mod) => mod.UnitPlanGeneratorComponent),
				title: 'Generador de Planes de Unidad',
			},
			{
				path: 'unit-plans/list',
				loadComponent: () =>
					import(
						'./features/class-planning/unit-plan-list/unit-plan-list.component'
					).then((mod) => mod.UnitPlanListComponent),
				title: 'Mis Planes de Unidad',
			},
			{
				path: 'unit-plans/:id',
				loadComponent: () =>
					import(
						'./features/class-planning/unit-plan-detail/unit-plan-detail.component'
					).then((mod) => mod.UnitPlanDetailComponent),
				title: 'Detalles del Plan de Unidad',
			},
			{
				path: 'unit-plans/:id/edit',
				loadComponent: () =>
					import(
						'./features/class-planning/unit-plan-edit/unit-plan-edit.component'
					).then((mod) => mod.UnitPlanEditComponent),
				title: 'Editar Plan de Unidad',
			},
			{
				path: 'attendance',
				loadComponent: () =>
					import(
						'./features/attendance-dashboard/attendance-dashboard.component'
					).then((mod) => mod.AttendanceDashboardComponent),
				title: 'Asistencia',
			},
			{
				path: 'attendance/:id',
				loadComponent: () =>
					import(
						'./features/class-sections/section-attendance/section-attendance.component'
					).then((mod) => mod.SectionAttendanceComponent),
				title: 'Detalles de la Asistencia',
			},

			// user's resources dashboard
			{
				path: 'my-resources',
				loadComponent: () =>
					import(
						'./features/resources/resources-dashboard/resources-dashboard.component'
					).then((mod) => mod.ResourcesDashboardComponent),
				title: 'Mis Recursos',
			},
			{
				path: 'resources',
				loadComponent: () =>
					import(
						'./features/resources/resource-gallery/resource-gallery.component'
					).then((m) => m.ResourceGalleryComponent),
				title: 'Galería de Recursos',
			},
			{
				path: 'resources/by/:id',
				loadComponent: () =>
					import(
						'./features/resources/creator/creator.component'
					).then((m) => m.CreatorComponent),
				title: 'Crear Recurso',
			},
			{
				path: 'resources/:id',
				loadComponent: () =>
					import(
						'./features/resources/resource-details/resource-details.component'
					).then((m) => m.ResourceDetailsComponent),
				title: 'Detalles del Recurso',
			},
			{
				path: 'diversity',
				loadComponent: () =>
					import(
						'./features/diversity-dashboard/diversity-dashboard.component'
					).then((mod) => mod.DiversityDashboardComponent),
				title: 'Diversificador de Contenidos',
			},
		],
	},

	{ path: '**', redirectTo: '/', pathMatch: 'full' },
];
