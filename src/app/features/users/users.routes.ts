import { Route } from '@angular/router';

export default [
    { path: 'me', loadComponent: () => import('./pages/user-profile.component').then(m => m.UserProfileComponent), title: 'Perfil del Usuario', },
] as Route[];