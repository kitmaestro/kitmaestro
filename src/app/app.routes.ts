import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AppsHolderComponent } from './apps/apps-holder/apps-holder.component';

export const routes: Routes = [
    { path: '', component: DashboardComponent, children: [
        { path: '', loadComponent: () => import('./home/home.component').then(mod => mod.HomeComponent) },
        {
            path: 'apps',
            component: AppsHolderComponent,
            children: [
                { path: '', redirectTo: '/', pathMatch: 'full' },
                { path: 'grades-generator', loadComponent: () => import('./apps/grades-generator/grades-generator.component').then(mod => mod.GradesGeneratorComponent) },
            ]
        },
    ] },
    {
        path: 'auth',
        loadComponent: () => import('./auth/auth-container/auth-container.component').then(mod => mod.AuthContainerComponent),
        children: [
            { path: 'recover', loadComponent: () => import('./auth/recover/recover.component').then(mod => mod.RecoverComponent) },
            { path: 'update', loadComponent: () => import('./auth/pass-update/pass-update.component').then(mod => mod.PassUpdateComponent) },
        ]
    }
];
