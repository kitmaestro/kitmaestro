import { Routes } from "@angular/router";

export default [
    {
        path: 'signup',
        title: 'Registro de Usuario',
        loadComponent: () =>
            import('./pages/signup.component').then(
                (mod) => mod.SignupComponent,
            ),
    },
    {
        path: 'login',
        title: 'Inicio de Sesión',
        loadComponent: () =>
            import('./pages/login.component').then(
                (mod) => mod.LoginComponent,
            ),
    },
    {
        path: 'login/success/:jwt',
        title: 'Inicio de Sesión',
        loadComponent: () =>
            import('./pages/login.component').then(
                (mod) => mod.LoginComponent,
            ),
    },
    {
        path: 'reset',
        title: 'Restablece tu Contraseña',
        loadComponent: () =>
            import(
                './pages/pass-update.component'
            ).then((mod) => mod.PassUpdateComponent),
    },
    {
        path: 'login/failure',
        redirectTo: '/auth/login?error=Login Failure',
        pathMatch: 'full',
    },
    { path: '**', redirectTo: '/auth/login', pathMatch: 'full' },
] as Routes;