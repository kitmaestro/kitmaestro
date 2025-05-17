import { Routes } from "@angular/router";

export default [
    {
        path: '',
        loadComponent: () =>
            import(
                './pages/admin-dashboard.component'
            ).then((mod) => mod.AdminDashboardComponent),
        title: 'Panel de Administración',
    },
    {
        path: 'content-blocks',
        loadComponent: () =>
            import('./pages/content-blocks-management.component').then(
                (mod) => mod.ContentBlocksManagementComponent
            ),
        title: 'Bloques de Contenido',
    },
    {
        path: 'users',
        loadComponent: () =>
            import('./pages/users.component').then(
                (mod) => mod.UsersComponent,
            ),
        title: 'Usuarios',
    },
] as Routes;