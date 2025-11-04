import { Route } from "@angular/router";

export default [
    { path: '', loadComponent: () => import('./pages/settings.component').then(mod => mod.SettingsComponent), title: 'Ajustes de KitMaestro' },
] as Route[];