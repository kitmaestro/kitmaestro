import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', loadComponent: () => import('./home/home.component').then(mod => mod.HomeComponent) },
    { path: 'admin', loadComponent: () => import('./admin/admin-dashboard/admin-dashboard.component').then(mod => mod.AdminDashboardComponent) },
    { path: 'admin/users', loadComponent: () => import('./admin/users/users.component').then(mod => mod.UsersComponent) },
    {
        path: 'auth',
        loadComponent() {
            return import('./auth/auth-container/auth-container.component').then((mod) => mod.AuthContainerComponent);
        },
        children: [
            { path: 'signup', loadComponent: () => import('./auth/signup/signup.component').then(mod => mod.SignupComponent) },
            { path: 'login', loadComponent: () => import('./auth/login/login.component').then(mod => mod.LoginComponent) },
            { path: 'login/success/:jwt', loadComponent: () => import('./auth/login/login.component').then(mod => mod.LoginComponent) },
            { path: 'login/failure', redirectTo: '/auth/login?error=Login Failure', pathMatch: 'full' },
            { path: 'reset', loadComponent: () => import('./auth/pass-update/pass-update.component').then(mod => mod.PassUpdateComponent) },
            { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
        ]
    },
    { path: 'pricing', loadComponent: () => import('./buy-subscription/buy-subscription.component').then(mod => mod.BuySubscriptionComponent) },
    { path: 'print-unit-plan/:id', loadComponent: () => import('./class-planning/unit-plan-detail/unit-plan-detail.component').then(mod => mod.UnitPlanDetailComponent) },
    { path: 'referrals', loadComponent: () => import('./referrals/referrals.component').then(mod => mod.ReferralsComponent) },
    { path: 'tutorials', loadComponent: () => import('./tutorials/tutorials.component').then(mod => mod.TutorialsComponent) },
    { path: 'todos', loadComponent: () => import('./todo-lists/todo-lists.component').then(mod => mod.TodoListsComponent) },
    { path: 'todos/:id', loadComponent: () => import('./todos/todos.component').then(mod => mod.TodosComponent) },
    { path: 'settings', loadComponent: () => import('./user-settings/user-settings.component').then(mod => mod.UserSettingsComponent) },
    { path: 'profile', loadComponent: () => import('./user-profile/user-profile.component').then(mod => mod.UserProfileComponent) },
    { path: 'updates', loadComponent: () => import('./updates/update-list/update-list.component').then(mod => mod.UpdateListComponent) },
    { path: 'updates/new', loadComponent: () => import('./updates/new/new.component').then(mod => mod.NewComponent) },
    { path: 'buy', loadComponent: () => import('./buy-subscription/buy-subscription.component').then(mod => mod.BuySubscriptionComponent) },
    { path: 'roadmap', loadComponent: () => import('./roadmap/roadmap.component').then(mod => mod.RoadmapComponent) },
    // Datacenter
    { path: 'sections', loadComponent: () => import('./class-sections/class-sections/class-sections.component').then(mod => mod.ClassSectionsComponent) },
    { path: 'sections/:id', loadComponent: () => import('./class-sections/section-details/section-details.component').then(mod => mod.SectionDetailsComponent) },
    // calculators
    { path: 'average-calculator', loadComponent: () => import('./calculators/average-calculator/average-calculator.component').then(mod => mod.AverageCalculatorComponent) },
    { path: 'attendance-calculator', loadComponent: () => import('./calculators/attendance-calculator/attendance-calculator.component').then(mod => mod.AttendanceCalculatorComponent) },
    // Activities
    { path: 'activities', loadComponent: () => import('./activities/activities/activities.component').then(mod => mod.ActivitiesComponent) },
    { path: 'activities/reading', loadComponent: () => import('./activities/reading-activities/reading-activities.component').then(mod => mod.ReadingActivitiesComponent) },
    { path: 'activities/reading/:id', loadComponent: () => import('./activities/reading-activity-detail/reading-activity-detail.component').then(mod => mod.ReadingActivityDetailComponent) },
    // Generators
    { path: 'schedule-generator', loadComponent: () => import('./generators/schedule-generator/schedule-generator.component').then(mod => mod.ScheduleGeneratorComponent) },
    { path: 'grades-generator', loadComponent: () => import('./generators/grades-generator/grades-generator.component').then(mod => mod.GradesGeneratorComponent) },
    { path: 'activity-generator', loadComponent: () => import('./generators/activity-generator/activity-generator.component').then(mod => mod.ActivityGeneratorComponent) },
    { path: 'aspects-generator', loadComponent: () => import('./generators/aspects-generator/aspects-generator.component').then(mod => mod.AspectsGeneratorComponent) },
    { path: 'attendance-generator', loadComponent: () => import('./generators/attendance-generator/attendance-generator.component').then(mod => mod.AttendanceGeneratorComponent) },
    { path: 'checklist-generator', loadComponent: () => import('./generators/checklist-generator/checklist-generator.component').then(mod => mod.ChecklistGeneratorComponent) },
    { path: 'english-dialog-generator', loadComponent: () => import('./generators/english-dialog-generator/english-dialog-generator.component').then(mod => mod.EnglishDialogGeneratorComponent) },
    { path: 'estimation-scale-generator', loadComponent: () => import('./generators/estimation-scale-generator/estimation-scale-generator.component').then(mod => mod.EstimationScaleGeneratorComponent) },
    { path: 'log-registry-generator', loadComponent: () => import('./generators/log-registry-generator/log-registry-generator.component').then(mod => mod.LogRegistryGeneratorComponent) },
    { path: 'planner-generator', loadComponent: () => import('./generators/planner-generator/planner-generator.component').then(mod => mod.PlannerGeneratorComponent) },
    { path: 'math-worksheet-generator', loadComponent: () => import('./generators/math-worksheet-generator/math-worksheet-generator.component').then(mod => mod.MathWorksheetGeneratorComponent) },
    { path: 'spanish-worksheet-generator', loadComponent: () => import('./generators/spanish-worksheet-generator/spanish-worksheet-generator.component').then(mod => mod.SpanishWorksheetGeneratorComponent) },
    { path: 'english-worksheet-generator', loadComponent: () => import('./generators/english-worksheet-generator/english-worksheet-generator.component').then(mod => mod.EnglishWorksheetGeneratorComponent) },
    // worksheet builders
    {
        path: 'worksheet-builders',
        loadComponent() {
            return import(
                './builders/worksheet-builders/worksheet-builders.component'
            ).then(mod => mod.WorksheetBuildersComponent)
        },
        children: [
            { path: '', loadComponent: () => import('./builders/builder-list/builder-list.component').then(m => m.BuilderListComponent) },
            { path: 'wordsearch', loadComponent: () => import('./builders/wordsearch/wordsearch.component').then(m => m.WordsearchComponent) },
            { path: 'word-scramble', loadComponent: () => import('./builders/word-scramble/word-scramble.component').then(m => m.WordScrambleComponent) },
            { path: 'crosswords', loadComponent: () => import('./builders/crosswords/crosswords.component').then(m => m.CrosswordsComponent) },
            { path: 'synonyms', loadComponent: () => import('./builders/synonyms/synonyms.component').then(m => m.SynonymsComponent) },
            { path: 'antonyms', loadComponent: () => import('./builders/antonyms/antonyms.component').then(m => m.AntonymsComponent) },
            { path: 'sudoku', loadComponent: () => import('./builders/sudoku/sudoku.component').then(m => m.SudokuComponent) },
            { path: 'addition', loadComponent: () => import('./builders/addition/addition.component').then(m => m.AdditionComponent) },
            { path: 'subtraction', loadComponent: () => import('./builders/subtraction/subtraction.component').then(m => m.SubtractionComponent) },
            { path: 'equations', loadComponent: () => import('./builders/equations/equations.component').then(m => m.EquationsComponent) },
            { path: 'multiplication', loadComponent: () => import('./builders/multiplication/multiplication.component').then(m => m.MultiplicationComponent) },
            { path: 'division', loadComponent: () => import('./builders/division/division.component').then(m => m.DivisionComponent) },
            { path: 'mixed-operations', loadComponent: () => import('./builders/mixed-operations/mixed-operations.component').then(m => m.MixedOperationsComponent) },
            { path: 'graph-paper', loadComponent: () => import('./builders/graph-paper/graph-paper.component').then(m => m.GraphPaperComponent) },
            { path: 'number-line', loadComponent: () => import('./builders/number-line/number-line.component').then(m => m.NumberLineComponent) },
            { path: 'cartesian-coordinates', loadComponent: () => import('./builders/cartesian-coordinates/cartesian-coordinates.component').then(m => m.CartesianCoordinatesComponent) },
        ]
  },
  // grading
  { path: 'grading-systems', loadComponent: () => import('./class-planning/score-system-generator/score-system-generator.component').then(mod => mod.ScoreSystemGeneratorComponent) },
  { path: 'grading-systems/list', loadComponent: () => import('./class-planning/score-systems/score-systems.component').then(mod => mod.ScoreSystemsComponent) },
  { path: 'grading-systems/:id', loadComponent: () => import('./class-planning/score-system-detail/score-system-detail.component').then(mod => mod.ScoreSystemDetailComponent) },
  // scheduling
    { path: 'schedules', loadComponent: () => import('./scheduling/schedule-list/schedule-list.component').then(mod => mod.ScheduleListComponent) },
    { path: 'schedules/create', loadComponent: () => import('./scheduling/schedule-builder/schedule-builder.component').then(mod => mod.ScheduleBuilderComponent) },
    { path: 'schedules/:id', loadComponent: () => import('./scheduling/schedule-detail/schedule-detail.component').then(mod => mod.ScheduleDetailComponent) },
    // assessments
    {
        path: 'assessments',
        loadComponent: () => import('./assessments/assessments/assessments.component').then(mod => mod.AssessmentsComponent),
        children: [
            { path: '', loadComponent: () => import('./assessments/assessment-dashboard/assessment-dashboard.component').then(mod => mod.AssessmentDashboardComponent), },
            { path: 'list', loadComponent: () => import('./assessments/list/list.component').then(mod => mod.ListComponent), },
            { path: 'observation-sheet', loadComponent: () => import('./assessments/observation-sheet/observation-sheet.component').then(mod => mod.ObservationSheetComponent), },
            { path: 'observation-sheets', loadComponent: () => import('./assessments/observation-sheets/observation-sheets.component').then(mod => mod.ObservationSheetsComponent), },
            { path: 'observation-sheets/:id', loadComponent: () => import('./assessments/observation-sheet-detail/observation-sheet-detail.component').then(mod => mod.ObservationSheetDetailComponent), },
            { path: 'rubric', loadComponent: () => import('./assessments/rubric/rubric.component').then(mod => mod.RubricComponent), },
            { path: 'rubrics', loadComponent: () => import('./assessments/rubrics/rubrics.component').then(mod => mod.RubricsComponent), },
            { path: 'rubrics/:id', loadComponent: () => import('./assessments/rubric-detail/rubric-detail.component').then(mod => mod.RubricDetailComponent), },
            { path: 'estimation-scale', loadComponent: () => import('./assessments/estimation-scale/estimation-scale.component').then(mod => mod.EstimationScaleComponent), },
            { path: 'estimation-scales', loadComponent: () => import('./assessments/estimation-scales/estimation-scales.component').then(mod => mod.EstimationScalesComponent), },
            { path: 'estimation-scales/:id', loadComponent: () => import('./assessments/estimation-scale-detail/estimation-scale-detail.component').then(mod => mod.EstimationScaleDetailComponent), },
        ]
    },
    // Assistants
    {
        path: 'assistants',
        loadComponent: () => import('./assistants/assistants-holder/assistants-holder.component').then(mod => mod.AssistantsHolderComponent),
        children: [
            { path: '', loadComponent: () => import('./assistants/assistants-dashboard/assistants-dashboard.component').then(mod => mod.AssistantsDashboardComponent) },
            { path: 'attendance-calc', loadComponent: () => import('./assistants/attendance-calc-assistant/attendance-calc-assistant.component').then(mod => mod.AttendanceCalcAssistantComponent) },
        ]
    },
    { path: 'class-plans', loadComponent: () => import('./class-planning/class-plan-generator/class-plan-generator.component').then(mod => mod.ClassPlanGeneratorComponent) },
    { path: 'class-plans/list', loadComponent: () => import('./class-planning/class-plan-list/class-plan-list.component').then(mod => mod.ClassPlanListComponent) },
    { path: 'class-plans/:id', loadComponent: () => import('./class-planning/class-plan-detail/class-plan-detail.component').then(mod => mod.ClassPlanDetailComponent) },
    { path: 'class-plans/:id/edit', loadComponent: () => import('./class-planning/class-plan-edit/class-plan-edit.component').then(mod => mod.ClassPlanEditComponent) },
    { path: 'unit-plans', loadComponent: () => import('./class-planning/unit-plan-generator/unit-plan-generator.component').then(mod => mod.UnitPlanGeneratorComponent) },
    { path: 'unit-plans/list', loadComponent: () => import('./class-planning/unit-plan-list/unit-plan-list.component').then(mod => mod.UnitPlanListComponent) },
    { path: 'unit-plans/:id', loadComponent: () => import('./class-planning/unit-plan-detail/unit-plan-detail.component').then(mod => mod.UnitPlanDetailComponent) },
    { path: 'unit-plans/:id/edit', loadComponent: () => import('./class-planning/unit-plan-edit/unit-plan-edit.component').then(mod => mod.UnitPlanEditComponent) },
    {
        path: 'attendance',
        loadComponent: () => import('./attendance-dashboard/attendance-dashboard.component').then(mod => mod.AttendanceDashboardComponent)
    },
    {
        path: 'attendance/:id',
        loadComponent: () => import('./class-sections/section-attendance/section-attendance.component').then(mod => mod.SectionAttendanceComponent)
    },
    // user's resources dashboard
    { path: 'my-resources', loadComponent: () => import('./resources/resources-dashboard/resources-dashboard.component').then(mod => mod.ResourcesDashboardComponent) },
    { path: 'resources', loadComponent: () => import('./resources/resource-gallery/resource-gallery.component').then(m => m.ResourceGalleryComponent) },
    { path: 'resources/by/:id', loadComponent: () => import('./resources/creator/creator.component').then(m => m.CreatorComponent) },
    { path: 'resources/:id', loadComponent: () => import('./resources/resource-details/resource-details.component').then(m => m.ResourceDetailsComponent) },
    {
        path: 'collab',
        loadComponent: () => import('./collab-dashboard/collab-dashboard.component').then(mod => mod.CollabDashboardComponent)
    },
    {
        path: 'tasks',
        loadComponent: () => import('./tasks-dashboard/tasks-dashboard.component').then(mod => mod.TasksDashboardComponent)
    },
    // Premium tools
    {
        path: 'class-planning',
        loadComponent: () => import('./class-planning/class-planning-dashboard/class-planning-dashboard.component').then(mod => mod.ClassPlanningDashboardComponent),
        children: []
    },
    {
        path: 'communication',
        loadComponent: () => import('./communication-dashboard/communication-dashboard.component').then(mod => mod.CommunicationDashboardComponent),
        children: []
    },
    {
        path: 'formation',
        loadComponent: () => import('./formation-dashboard/formation-dashboard.component').then(mod => mod.FormationDashboardComponent),
        children: []
    },
    {
        path: 'tracking',
        loadComponent: () => import('./tracking-dashboard/tracking-dashboard.component').then(mod => mod.TrackingDashboardComponent),
        children: []
    },
    {
        path: 'tracking/section/:id',
        loadComponent: () => import('./tracking-dashboard/tracking-dashboard.component').then(mod => mod.TrackingDashboardComponent),
        children: []
    },
    {
        path: 'event-planning',
        loadComponent: () => import('./event-planning-dashboard/event-planning-dashboard.component').then(mod => mod.EventPlanningDashboardComponent),
        children: []
    },
    {
        path: 'diversity',
        loadComponent: () => import('./diversity-dashboard/diversity-dashboard.component').then(mod => mod.DiversityDashboardComponent),
        children: []
    },
    {
        path: 'security',
        loadComponent: () => import('./security-dashboard/security-dashboard.component').then(mod => mod.SecurityDashboardComponent),
        children: []
    },
    {
        path: 'reviews',
        loadComponent: () => import('./reviews-dashboard/reviews-dashboard.component').then(mod => mod.ReviewsDashboardComponent),
        children: []
    },
    {
        path: 'tools',
        loadComponent: () => import('./tools-dashboard/tools-dashboard.component').then(mod => mod.ToolsDashboardComponent),
        children: []
    },
    { path: '**', redirectTo: '/', pathMatch: 'full', },
];
