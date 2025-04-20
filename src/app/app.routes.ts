import { Routes } from '@angular/router';

export const routes: Routes = [
	// authentication
	{
		path: 'auth',
		loadComponent: () =>
			import('./auth/auth-container/auth-container.component').then(
				(mod) => mod.AuthContainerComponent,
			),
		children: [
			{
				path: 'signup',
				loadComponent: () =>
					import('./auth/signup/signup.component').then(
						(mod) => mod.SignupComponent,
					),
				title: 'Registro de Usuario',
			},
			{
				path: 'login',
				loadComponent: () =>
					import('./auth/login/login.component').then(
						(mod) => mod.LoginComponent,
					),
				title: 'Inicio de Sesión',
			},
			{
				path: 'login/success/:jwt',
				loadComponent: () =>
					import('./auth/login/login.component').then(
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
					import('./auth/pass-update/pass-update.component').then(
						(mod) => mod.PassUpdateComponent,
					),
				title: 'Restablece tu Contraseña',
			},
			{ path: '**', redirectTo: '/auth/login', pathMatch: 'full' },
		],
	},
	// Admin area
	{
		path: 'admin',
		loadComponent: () =>
			import('./admin/admin-dashboard/admin-dashboard.component').then(
				(mod) => mod.AdminDashboardComponent,
			),
		title: 'Panel de Administración',
	},
	{
		path: 'admin/users',
		loadComponent: () =>
			import('./admin/users/users.component').then(
				(mod) => mod.UsersComponent,
			),
		title: 'Usuarios',
	},
	{
		path: 'users/:id',
		loadComponent: () =>
			import('./admin/user-details/user-details.component').then(
				(mod) => mod.UserDetailsComponent,
			),
		title: 'Detalles del Usuario',
	},

	// inspiration
	{
		path: 'ideas',
		loadComponent: () =>
			import('./idea-board/idea-board.component').then(
				(mod) => mod.IdeaBoardComponent,
			),
		title: 'Panel de Ideas',
	},
	{
		path: 'ai-assistant',
		loadComponent: () =>
			import('./ai-assistant/ai-assistant.component').then(
				(mod) => mod.AiAssistantComponent,
			),
		title: 'Asistente Virtual',
	},

	// informational
	{
		path: '',
		loadComponent: () =>
			import('./home/home.component').then((mod) => mod.HomeComponent),
		title: 'Inicio - KitMaestro',
	},
	{
		path: 'pricing',
		loadComponent: () =>
			import('./buy-subscription/buy-subscription.component').then(
				(mod) => mod.BuySubscriptionComponent,
			),
		title: 'Precios',
	},
	{
		path: 'buy',
		loadComponent: () =>
			import('./buy-subscription/buy-subscription.component').then(
				(mod) => mod.BuySubscriptionComponent,
			),
		title: 'Comprar Suscripción',
	},
	{
		path: 'updates',
		loadComponent: () =>
			import('./updates/update-list/update-list.component').then(
				(mod) => mod.UpdateListComponent,
			),
		title: 'Noticias - KitMaestro',
	},
	{
		path: 'tutorials',
		loadComponent: () =>
			import('./tutorials/tutorials.component').then(
				(mod) => mod.TutorialsComponent,
			),
		title: 'Tutoriales',
	},
	{
		path: 'updates/new',
		loadComponent: () =>
			import('./updates/new/new.component').then(
				(mod) => mod.NewComponent,
			),
		title: 'Crear Entrada',
	},
	{
		path: 'roadmap',
		loadComponent: () =>
			import('./roadmap/roadmap.component').then(
				(mod) => mod.RoadmapComponent,
			),
		title: 'Planes de Desarrollo',
	},

	// user data
	{
		path: 'profile',
		loadComponent: () =>
			import('./user-profile/user-profile.component').then(
				(mod) => mod.UserProfileComponent,
			),
		title: 'Perfil del Usuario',
	},
	{
		path: 'referrals',
		loadComponent: () =>
			import('./referrals/referrals.component').then(
				(mod) => mod.ReferralsComponent,
			),
		title: 'Panel de Referidos',
	},

	// utility links
	{
		path: 'print-unit-plan/:id',
		loadComponent: () =>
			import(
				'./class-planning/unit-plan-detail/unit-plan-detail.component'
			).then((mod) => mod.UnitPlanDetailComponent),
		title: 'Plan de Unidad',
	},

	// todo
	{
		path: 'todos',
		loadComponent: () =>
			import('./todo-lists/todo-lists.component').then(
				(mod) => mod.TodoListsComponent,
			),
		title: 'Lista de Pendientes',
	},
	{
		path: 'todos/:id',
		loadComponent: () =>
			import('./todos/todos.component').then((mod) => mod.TodosComponent),
		title: 'Lista de Tareas',
	},

	// sections
	{
		path: 'sections',
		loadComponent: () =>
			import(
				'./class-sections/class-sections/class-sections.component'
			).then((mod) => mod.ClassSectionsComponent),
		title: 'Mis Secciones',
	},
	{
		path: 'sections/:id',
		loadComponent: () =>
			import(
				'./class-sections/section-details/section-details.component'
			).then((mod) => mod.SectionDetailsComponent),
		title: 'Detalles de la Sección',
	},

	// calculators
	{
		path: 'average-calculator',
		loadComponent: () =>
			import(
				'./calculators/average-calculator/average-calculator.component'
			).then((mod) => mod.AverageCalculatorComponent),
		title: 'Calculadora de Promedios',
	},
	{
		path: 'attendance-calculator',
		loadComponent: () =>
			import(
				'./calculators/attendance-calculator/attendance-calculator.component'
			).then((mod) => mod.AttendanceCalculatorComponent),
		title: 'Calculadora de Asistencia',
	},

	// Activities
	{
		path: 'tongue-twister-generator',
		loadComponent: () =>
			import('./activities/tongue-twister-generator.component').then(
				(mod) => mod.TongueTwisterGeneratorComponent,
			),
		title: 'Generador de Trabalenguas',
	},
	{
		path: 'guided-reading-generator',
		loadComponent: () =>
			import(
				'./generators/reading-activity-generator/reading-activity-generator.component'
			).then((mod) => mod.ReadingActivityGeneratorComponent),
		title: 'Generador de Actividad de Lectura',
	},
	{
		path: 'guided-reading',
		loadComponent: () =>
			import('./reading-activities/reading-activities.component').then(
				(mod) => mod.ReadingActivitiesComponent,
			),
		title: 'Actividades de Lectura',
	},
	{
		path: 'holiday-activity-generator',
		loadComponent: () =>
			import(
				'./holiday-activity-generator/holiday-activity-generator.component'
			).then((mod) => mod.HolidayActivityGeneratorComponent),
		title: 'Actividades para Efemérides',
	},

	// Grades/Grading
	{
		path: 'grades-generator',
		loadComponent: () =>
			import(
				'./grading/grades-generator/grades-generator.component'
			).then((mod) => mod.GradesGeneratorComponent),
		title: 'Generador de Calificaciones',
	},
	{
		path: 'grading-systems',
		loadComponent: () =>
			import(
				'./grading/score-system-generator/score-system-generator.component'
			).then((mod) => mod.ScoreSystemGeneratorComponent),
		title: 'Generador de Sistemas de Calificación',
	},
	{
		path: 'grading-systems/list',
		loadComponent: () =>
			import('./grading/score-systems/score-systems.component').then(
				(mod) => mod.ScoreSystemsComponent,
			),
		title: 'Mis Sistemas de Calificación',
	},
	{
		path: 'grading-systems/:id',
		loadComponent: () =>
			import(
				'./grading/score-system-detail/score-system-detail.component'
			).then((mod) => mod.ScoreSystemDetailComponent),
		title: 'Detalles del Sistema de Calificación',
	},

	// motivation
	{
		path: 'reflection-generator',
		loadComponent: () =>
			import('./motivation/reflection-generator.component').then(
				(m) => m.ReflectionGeneratorComponent,
			),
		title: 'Generador de Reflexiones',
	},

	// class-management
	{
		path: 'icebreaker-generator',
		loadComponent: () =>
			import('./class-management/icebreaker-generator.component').then(
				(m) => m.IcebreakerGeneratorComponent,
			),
		title: 'Generador de Rompehielos',
	},
	{
		path: 'class-hook-generator',
		loadComponent: () =>
			import('./class-management/class-hook-generator.component').then(
				(mod) => mod.ClassHookGeneratorComponent,
			),
		title: 'Generador de Ganchos',
	},

	// Generators
	{
		path: 'schedule-generator',
		loadComponent: () =>
			import(
				'./generators/schedule-generator/schedule-generator.component'
			).then((mod) => mod.ScheduleGeneratorComponent),
	},
	{
		path: 'aspects-generator',
		loadComponent: () =>
			import(
				'./generators/aspects-generator/aspects-generator.component'
			).then((mod) => mod.AspectsGeneratorComponent),
	},
	{
		path: 'attendance-generator',
		loadComponent: () =>
			import(
				'./generators/attendance-generator/attendance-generator.component'
			).then((mod) => mod.AttendanceGeneratorComponent),
	},
	{
		path: 'english-dialog-generator',
		loadComponent: () =>
			import(
				'./generators/english-dialog-generator/english-dialog-generator.component'
			).then((mod) => mod.EnglishDialogGeneratorComponent),
	},
	{
		path: 'estimation-scale-generator',
		loadComponent: () =>
			import(
				'./generators/estimation-scale-generator/estimation-scale-generator.component'
			).then((mod) => mod.EstimationScaleGeneratorComponent),
	},
	{
		path: 'log-registry-generator',
		loadComponent: () =>
			import(
				'./generators/log-registry-generator/log-registry-generator.component'
			).then((mod) => mod.LogRegistryGeneratorComponent),
	},
	{
		path: 'planner-generator',
		loadComponent: () =>
			import(
				'./generators/planner-generator/planner-generator.component'
			).then((mod) => mod.PlannerGeneratorComponent),
	},
	{
		path: 'math-worksheet-generator',
		loadComponent: () =>
			import(
				'./generators/math-worksheet-generator/math-worksheet-generator.component'
			).then((mod) => mod.MathWorksheetGeneratorComponent),
	},
	{
		path: 'spanish-worksheet-generator',
		loadComponent: () =>
			import(
				'./generators/spanish-worksheet-generator/spanish-worksheet-generator.component'
			).then((mod) => mod.SpanishWorksheetGeneratorComponent),
	},
	{
		path: 'english-worksheet-generator',
		loadComponent: () =>
			import(
				'./generators/english-worksheet-generator/english-worksheet-generator.component'
			).then((mod) => mod.EnglishWorksheetGeneratorComponent),
	},

	// worksheet builders
	{
		path: 'wordsearch',
		loadComponent: () =>
			import('./builders/wordsearch/wordsearch.component').then(
				(m) => m.WordsearchComponent,
			),
	},
	{
		path: 'word-scramble',
		loadComponent: () =>
			import('./builders/word-scramble/word-scramble.component').then(
				(m) => m.WordScrambleComponent,
			),
	},
	{
		path: 'crosswords',
		loadComponent: () =>
			import('./builders/crosswords/crosswords.component').then(
				(m) => m.CrosswordsComponent,
			),
	},
	{
		path: 'synonyms',
		loadComponent: () =>
			import('./builders/synonyms/synonyms.component').then(
				(m) => m.SynonymsComponent,
			),
	},
	{
		path: 'antonyms',
		loadComponent: () =>
			import('./builders/antonyms/antonyms.component').then(
				(m) => m.AntonymsComponent,
			),
	},
	{
		path: 'sudoku',
		loadComponent: () =>
			import('./builders/sudoku/sudoku.component').then(
				(m) => m.SudokuComponent,
			),
	},
	{
		path: 'addition',
		loadComponent: () =>
			import('./builders/addition/addition.component').then(
				(m) => m.AdditionComponent,
			),
	},
	{
		path: 'subtraction',
		loadComponent: () =>
			import('./builders/subtraction/subtraction.component').then(
				(m) => m.SubtractionComponent,
			),
	},
	{
		path: 'equations',
		loadComponent: () =>
			import('./builders/equations/equations.component').then(
				(m) => m.EquationsComponent,
			),
	},
	{
		path: 'multiplication',
		loadComponent: () =>
			import('./builders/multiplication/multiplication.component').then(
				(m) => m.MultiplicationComponent,
			),
	},
	{
		path: 'division',
		loadComponent: () =>
			import('./builders/division/division.component').then(
				(m) => m.DivisionComponent,
			),
	},
	{
		path: 'mixed-operations',
		loadComponent: () =>
			import(
				'./builders/mixed-operations/mixed-operations.component'
			).then((m) => m.MixedOperationsComponent),
	},
	{
		path: 'graph-paper',
		loadComponent: () =>
			import('./builders/graph-paper/graph-paper.component').then(
				(m) => m.GraphPaperComponent,
			),
	},
	{
		path: 'number-line',
		loadComponent: () =>
			import('./builders/number-line/number-line.component').then(
				(m) => m.NumberLineComponent,
			),
	},
	{
		path: 'cartesian-coordinates',
		loadComponent: () =>
			import(
				'./builders/cartesian-coordinates/cartesian-coordinates.component'
			).then((m) => m.CartesianCoordinatesComponent),
	},

	// scheduling
	{
		path: 'schedules',
		loadComponent: () =>
			import('./scheduling/schedule-list/schedule-list.component').then(
				(mod) => mod.ScheduleListComponent,
			),
	},
	{
		path: 'schedules/create',
		loadComponent: () =>
			import(
				'./scheduling/schedule-builder/schedule-builder.component'
			).then((mod) => mod.ScheduleBuilderComponent),
	},
	{
		path: 'schedules/:id',
		loadComponent: () =>
			import(
				'./scheduling/schedule-detail/schedule-detail.component'
			).then((mod) => mod.ScheduleDetailComponent),
	},

	// assessments
	{
		path: 'checklist-generator',
		loadComponent: () =>
			import(
				'./assessments/checklist-generator/checklist-generator.component'
			).then((mod) => mod.ChecklistGeneratorComponent),
	},
	{
		path: 'checklists',
		loadComponent: () =>
			import('./assessments/checklists/checklists.component').then(
				(mod) => mod.ChecklistsComponent,
			),
	},
	{
		path: 'checklists/:id',
		loadComponent: () =>
			import(
				'./assessments/checklist-detail/checklist-detail.component'
			).then((mod) => mod.ChecklistDetailComponent),
	},
	{
		path: 'test-generator',
		loadComponent: () =>
			import(
				'./assessments/test-generator/test-generator.component'
			).then((mod) => mod.TestGeneratorComponent),
	},
	{
		path: 'tests',
		loadComponent: () =>
			import('./assessments/test-list/test-list.component').then(
				(mod) => mod.TestListComponent,
			),
	},
	{
		path: 'tests/:id',
		loadComponent: () =>
			import('./assessments/test-detail/test-detail.component').then(
				(mod) => mod.TestDetailComponent,
			),
	},
	{
		path: 'observation-sheet',
		loadComponent: () =>
			import(
				'./assessments/observation-sheet/observation-sheet.component'
			).then((mod) => mod.ObservationSheetComponent),
	},
	{
		path: 'observation-sheets',
		loadComponent: () =>
			import(
				'./assessments/observation-sheets/observation-sheets.component'
			).then((mod) => mod.ObservationSheetsComponent),
	},
	{
		path: 'observation-sheets/:id',
		loadComponent: () =>
			import(
				'./assessments/observation-sheet-detail/observation-sheet-detail.component'
			).then((mod) => mod.ObservationSheetDetailComponent),
	},
	{
		path: 'rubric-generator',
		loadComponent: () =>
			import(
				'./assessments/rubric-generator/rubric-generator.component'
			).then((mod) => mod.RubricGeneratorComponent),
	},
	{
		path: 'rubrics',
		loadComponent: () =>
			import('./assessments/rubrics/rubrics.component').then(
				(mod) => mod.RubricsComponent,
			),
	},
	{
		path: 'rubrics/:id',
		loadComponent: () =>
			import('./assessments/rubric-detail/rubric-detail.component').then(
				(mod) => mod.RubricDetailComponent,
			),
	},
	{
		path: 'estimation-scale',
		loadComponent: () =>
			import(
				'./assessments/estimation-scale/estimation-scale.component'
			).then((mod) => mod.EstimationScaleComponent),
	},
	{
		path: 'estimation-scales',
		loadComponent: () =>
			import(
				'./assessments/estimation-scales/estimation-scales.component'
			).then((mod) => mod.EstimationScalesComponent),
	},
	{
		path: 'estimation-scales/:id',
		loadComponent: () =>
			import(
				'./assessments/estimation-scale-detail/estimation-scale-detail.component'
			).then((mod) => mod.EstimationScaleDetailComponent),
	},

	// Class planning
	{
		path: 'sports-practice-generator',
		loadComponent: () =>
			import('./class-planning/sports-practice-generator.component').then(
				(mod) => mod.SportsPracticeGeneratorComponent,
			),
		title: 'Generador de Prácticas Deportivas',
	},
	{
		path: 'class-plans',
		loadComponent: () =>
			import(
				'./class-planning/class-plan-generator/class-plan-generator.component'
			).then((mod) => mod.ClassPlanGeneratorComponent),
	},
	{
		path: 'class-plans/list',
		loadComponent: () =>
			import(
				'./class-planning/class-plan-list/class-plan-list.component'
			).then((mod) => mod.ClassPlanListComponent),
	},
	{
		path: 'class-plans/:id',
		loadComponent: () =>
			import(
				'./class-planning/class-plan-detail/class-plan-detail.component'
			).then((mod) => mod.ClassPlanDetailComponent),
	},
	{
		path: 'class-plans/:id/edit',
		loadComponent: () =>
			import(
				'./class-planning/class-plan-edit/class-plan-edit.component'
			).then((mod) => mod.ClassPlanEditComponent),
	},
	{
		path: 'unit-plans',
		loadComponent: () =>
			import(
				'./class-planning/unit-plan-generator/unit-plan-generator.component'
			).then((mod) => mod.UnitPlanGeneratorComponent),
	},
	{
		path: 'unit-plans/list',
		loadComponent: () =>
			import(
				'./class-planning/unit-plan-list/unit-plan-list.component'
			).then((mod) => mod.UnitPlanListComponent),
	},
	{
		path: 'unit-plans/:id',
		loadComponent: () =>
			import(
				'./class-planning/unit-plan-detail/unit-plan-detail.component'
			).then((mod) => mod.UnitPlanDetailComponent),
	},
	{
		path: 'unit-plans/:id/edit',
		loadComponent: () =>
			import(
				'./class-planning/unit-plan-edit/unit-plan-edit.component'
			).then((mod) => mod.UnitPlanEditComponent),
	},
	{
		path: 'attendance',
		loadComponent: () =>
			import(
				'./attendance-dashboard/attendance-dashboard.component'
			).then((mod) => mod.AttendanceDashboardComponent),
	},
	{
		path: 'attendance/:id',
		loadComponent: () =>
			import(
				'./class-sections/section-attendance/section-attendance.component'
			).then((mod) => mod.SectionAttendanceComponent),
	},

	// user's resources dashboard
	{
		path: 'my-resources',
		loadComponent: () =>
			import(
				'./resources/resources-dashboard/resources-dashboard.component'
			).then((mod) => mod.ResourcesDashboardComponent),
	},
	{
		path: 'resources',
		loadComponent: () =>
			import(
				'./resources/resource-gallery/resource-gallery.component'
			).then((m) => m.ResourceGalleryComponent),
	},
	{
		path: 'resources/by/:id',
		loadComponent: () =>
			import('./resources/creator/creator.component').then(
				(m) => m.CreatorComponent,
			),
	},
	{
		path: 'resources/:id',
		loadComponent: () =>
			import(
				'./resources/resource-details/resource-details.component'
			).then((m) => m.ResourceDetailsComponent),
	},
	{
		path: 'collab',
		loadComponent: () =>
			import('./collab-dashboard/collab-dashboard.component').then(
				(mod) => mod.CollabDashboardComponent,
			),
	},
	{
		path: 'tasks',
		loadComponent: () =>
			import('./tasks-dashboard/tasks-dashboard.component').then(
				(mod) => mod.TasksDashboardComponent,
			),
	},

	// Premium tools
	{
		path: 'communication',
		loadComponent: () =>
			import(
				'./communication-dashboard/communication-dashboard.component'
			).then((mod) => mod.CommunicationDashboardComponent),
		children: [],
	},
	{
		path: 'formation',
		loadComponent: () =>
			import('./formation-dashboard/formation-dashboard.component').then(
				(mod) => mod.FormationDashboardComponent,
			),
		children: [],
	},
	{
		path: 'tracking',
		loadComponent: () =>
			import('./tracking-dashboard/tracking-dashboard.component').then(
				(mod) => mod.TrackingDashboardComponent,
			),
		children: [],
	},
	{
		path: 'tracking/section/:id',
		loadComponent: () =>
			import('./tracking-dashboard/tracking-dashboard.component').then(
				(mod) => mod.TrackingDashboardComponent,
			),
		children: [],
	},
	{
		path: 'event-planning',
		loadComponent: () =>
			import(
				'./event-planning-dashboard/event-planning-dashboard.component'
			).then((mod) => mod.EventPlanningDashboardComponent),
		children: [],
	},
	{
		path: 'diversity',
		loadComponent: () =>
			import('./diversity-dashboard/diversity-dashboard.component').then(
				(mod) => mod.DiversityDashboardComponent,
			),
		children: [],
	},
	{
		path: 'security',
		loadComponent: () =>
			import('./security-dashboard/security-dashboard.component').then(
				(mod) => mod.SecurityDashboardComponent,
			),
		children: [],
	},
	{
		path: 'reviews',
		loadComponent: () =>
			import('./reviews-dashboard/reviews-dashboard.component').then(
				(mod) => mod.ReviewsDashboardComponent,
			),
		children: [],
	},
	{
		path: 'tools',
		loadComponent: () =>
			import('./tools-dashboard/tools-dashboard.component').then(
				(mod) => mod.ToolsDashboardComponent,
			),
		children: [],
	},

	{ path: '**', redirectTo: '/', pathMatch: 'full' },
];
