import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthContainerComponent } from './auth/auth-container/auth-container.component';
import { AssessmentDashboardComponent } from './assessments/assessment-dashboard/assessment-dashboard.component';
import { ClassPlanComponent } from './class-planning/class-plan/class-plan.component';
import { UnitPlanComponent } from './class-planning/unit-plan/unit-plan.component';

export const routes: Routes = [
    {
        path: 'auth',
        component: AuthContainerComponent,
        children: [
            { path: '', redirectTo: '/auth/reset', pathMatch: 'full' },
            { path: 'reset', loadComponent: () => import('./auth/pass-update/pass-update.component').then(mod => mod.PassUpdateComponent) },
        ]
    },
    {
        path: 'app',
        component: DashboardComponent,
        children: [
            { path: '', loadComponent: () => import('./home/home.component').then(mod => mod.HomeComponent) },
            { path: 'buy', loadComponent: () => import('./buy-subscription/buy-subscription.component').then(mod => mod.BuySubscriptionComponent) },
            { path: 'roadmap', loadComponent: () => import('./roadmap/roadmap.component').then(mod => mod.RoadmapComponent) },
            // Datacenter
            { path: 'sections', loadComponent: () => import('./class-sections/class-sections/class-sections.component').then(mod => mod.ClassSectionsComponent) },
            { path: 'sections/:id', loadComponent: () => import('./class-sections/section-details/section-details.component').then(mod => mod.SectionDetailsComponent) },
            // Tools
            { path: 'average-calculator', loadComponent: () => import('./apps/average-calculator/average-calculator.component').then(mod => mod.AverageCalculatorComponent) },
            { path: 'attendance-calculator', loadComponent: () => import('./apps/attendance-calculator/attendance-calculator.component').then(mod => mod.AttendanceCalculatorComponent) },
            // Generators
            { path: 'grades-generator', loadComponent: () => import('./generators/grades-generator/grades-generator.component').then(mod => mod.GradesGeneratorComponent) },
            { path: 'activity-generator', loadComponent: () => import('./generators/activity-generator/activity-generator.component').then(mod => mod.ActivityGeneratorComponent) },
            { path: 'aspects-generator', loadComponent: () => import('./generators/aspects-generator/aspects-generator.component').then(mod => mod.AspectsGeneratorComponent) },
            { path: 'checklist-generator', loadComponent: () => import('./generators/checklist-generator/checklist-generator.component').then(mod => mod.ChecklistGeneratorComponent) },
            { path: 'english-dialog-generator', loadComponent: () => import('./generators/english-dialog-generator/english-dialog-generator.component').then(mod => mod.EnglishDialogGeneratorComponent) },
            { path: 'estimation-scale-generator', loadComponent: () => import('./generators/estimation-scale-generator/estimation-scale-generator.component').then(mod => mod.EstimationScaleGeneratorComponent) },
            { path: 'log-registry-generator', loadComponent: () => import('./generators/log-registry-generator/log-registry-generator.component').then(mod => mod.LogRegistryGeneratorComponent) },
            { path: 'planner-generator', loadComponent: () => import('./generators/planner-generator/planner-generator.component').then(mod => mod.PlannerGeneratorComponent) },
            { path: 'rubric-generator', loadComponent: () => import('./generators/rubric-generator/rubric-generator.component').then(mod => mod.RubricGeneratorComponent) },
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
                ]
            },
            { path: 'math-worksheet-generator', loadComponent: () => import('./generators/math-worksheet-generator/math-worksheet-generator.component').then(mod => mod.MathWorksheetGeneratorComponent) },
            { path: 'spanish-worksheet-generator', loadComponent: () => import('./generators/spanish-worksheet-generator/spanish-worksheet-generator.component').then(mod => mod.SpanishWorksheetGeneratorComponent) },
            { path: 'english-worksheet-generator', loadComponent: () => import('./generators/english-worksheet-generator/english-worksheet-generator.component').then(mod => mod.EnglishWorksheetGeneratorComponent) },
            // exam builders
            { path: 'math-test-generator', loadComponent: () => import('./generators/math-test-generator/math-test-generator.component').then(mod => mod.MathTestGeneratorComponent) },
            // Assistants
            { path: 'assessments', component: AssessmentDashboardComponent },
            { path: 'class-plans', component: ClassPlanComponent },
            { path: 'unit-plans', component: UnitPlanComponent },
            {
                path: 'assistants',
                loadComponent: () => import('./assistants/assistants-holder/assistants-holder.component').then(mod => mod.AssistantsHolderComponent),
                children: [
                    {
                        path: '',
                        loadComponent: () => import('./assistants/assistants-dashboard/assistants-dashboard.component').then(mod => mod.AssistantsDashboardComponent),
                    },
                ]
            },
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
        ]
    },
    { path: '**', redirectTo: '/app', pathMatch: 'full', },
];
