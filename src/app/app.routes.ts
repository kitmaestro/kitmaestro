import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AppsHolderComponent } from './apps/apps-holder/apps-holder.component';
import { GeneratorsHolderComponent } from './generators/generators-holder/generators-holder.component';

export const routes: Routes = [
    {
        path: '', 
        component: DashboardComponent, 
        children: [
            { path: '', loadComponent: () => import('./home/home.component').then(mod => mod.HomeComponent) },
            { path: 'buy', loadComponent: () => import('./buy-subscription/buy-subscription.component').then(mod => mod.BuySubscriptionComponent) },
            { path: 'roadmap', loadComponent: () => import('./roadmap/roadmap.component').then(mod => mod.RoadmapComponent) },
            {
                path: 'datacenter',
                loadComponent: () => import('./datacenter/datacenter.component').then(mod => mod.DatacenterComponent),
                children: [
                    {
                        path: 'sections',
                        loadComponent: () => import('./class-sections/class-sections.component').then(mod => mod.ClassSectionsComponent),
                    },
                    {
                        path: 'sections/:id',
                        loadComponent: () => import('./section-details/section-details.component').then(mod => mod.SectionDetailsComponent),
                    },
                    { path: '', redirectTo: '/datacenter/sections', pathMatch: 'full' },
                ]
            },
            {
                path: 'apps',
                component: AppsHolderComponent,
                children: [
                    { path: '', loadComponent: () => import('./apps/apps-dashboard/apps-dashboard.component').then(mod => mod.AppsDashboardComponent) },
                    { path: 'average-calculator', loadComponent: () => import('./apps/average-calculator/average-calculator.component').then(mod => mod.AverageCalculatorComponent) },
                    { path: 'attendance-calculator', loadComponent: () => import('./apps/attendance-calculator/attendance-calculator.component').then(mod => mod.AttendanceCalculatorComponent) },
                ]
            },
            {
                path: 'generators',
                component: GeneratorsHolderComponent,
                children: [
                    { path: '', loadComponent: () => import('./generators/generators-dashboard/generators-dashboard.component').then(mod => mod.GeneratorsDashboardComponent) },
                    { path: 'grades-generator', loadComponent: () => import('./generators/grades-generator/grades-generator.component').then(mod => mod.GradesGeneratorComponent) },
                    { path: 'activity-generator', loadComponent: () => import('./generators/activity-generator/activity-generator.component').then(mod => mod.ActivityGeneratorComponent) },
                    { path: 'aspects-generator', loadComponent: () => import('./generators/aspects-generator/aspects-generator.component').then(mod => mod.AspectsGeneratorComponent) },
                    { path: 'checklist-generator', loadComponent: () => import('./generators/checklist-generator/checklist-generator.component').then(mod => mod.ChecklistGeneratorComponent) },
                    { path: 'english-dialog-generator', loadComponent: () => import('./generators/english-dialog-generator/english-dialog-generator.component').then(mod => mod.EnglishDialogGeneratorComponent) },
                    { path: 'english-worksheet-generator', loadComponent: () => import('./generators/english-worksheet-generator/english-worksheet-generator.component').then(mod => mod.EnglishWorksheetGeneratorComponent) },
                    { path: 'estimation-scale-generator', loadComponent: () => import('./generators/estimation-scale-generator/estimation-scale-generator.component').then(mod => mod.EstimationScaleGeneratorComponent) },
                    { path: 'log-registry-generator', loadComponent: () => import('./generators/log-registry-generator/log-registry-generator.component').then(mod => mod.LogRegistryGeneratorComponent) },
                    { path: 'math-worksheet-generator', loadComponent: () => import('./generators/math-worksheet-generator/math-worksheet-generator.component').then(mod => mod.MathWorksheetGeneratorComponent) },
                    { path: 'planner-generator', loadComponent: () => import('./generators/planner-generator/planner-generator.component').then(mod => mod.PlannerGeneratorComponent) },
                    { path: 'rubric-generator', loadComponent: () => import('./generators/rubric-generator/rubric-generator.component').then(mod => mod.RubricGeneratorComponent) },
                    { path: 'spanish-worksheet-generator', loadComponent: () => import('./generators/spanish-worksheet-generator/spanish-worksheet-generator.component').then(mod => mod.SpanishWorksheetGeneratorComponent) },
                ]
            },
            {
                path: 'assistants',
                component: GeneratorsHolderComponent,
                children: [
                    { path: '', loadComponent: () => import('./assistants/assistants-dashboard/assistants-dashboard.component').then(mod => mod.AssistantsDashboardComponent) },
                ]
            },
            {
                path: 'attendance',
                loadComponent: () => import('./attendance-dashboard/attendance-dashboard.component').then(mod => mod.AttendanceDashboardComponent)
            },
            {
                path: 'attendance/:id',
                loadComponent: () => import('./section-attendance/section-attendance.component').then(mod => mod.SectionAttendanceComponent)
            },
            {
                path: 'resources',
                loadComponent: () => import('./resources-dashboard/resources-dashboard.component').then(mod => mod.ResourcesDashboardComponent)
            },
            {
                path: 'collab',
                loadComponent: () => import('./collab-dashboard/collab-dashboard.component').then(mod => mod.CollabDashboardComponent)
            },
            {
                path: 'tasks',
                loadComponent: () => import('./tasks-dashboard/tasks-dashboard.component').then(mod => mod.TasksDashboardComponent)
            },
            {
                path: 'premium',
                loadComponent: () => import('./premium-wrapper/premium-wrapper.component').then(mod => mod.PremiumWrapperComponent),
                children: [
                    {
                        path: '',
                        loadComponent: () => import('./premium-tools/premium-tools.component').then(mod => mod.PremiumToolsComponent),
                        children: []
                    },
                    {
                        path: 'class-planning',
                        loadComponent: () => import('./class-planning-dashboard/class-planning-dashboard.component').then(mod => mod.ClassPlanningDashboardComponent),
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
        ]
    },
    {
        path: 'auth',
        loadComponent: () => import('./auth/auth-container/auth-container.component').then(mod => mod.AuthContainerComponent),
        children: [
            { path: 'recover', loadComponent: () => import('./auth/recover/recover.component').then(mod => mod.RecoverComponent) },
            { path: 'update', loadComponent: () => import('./auth/pass-update/pass-update.component').then(mod => mod.PassUpdateComponent) },
        ]
    },
];
