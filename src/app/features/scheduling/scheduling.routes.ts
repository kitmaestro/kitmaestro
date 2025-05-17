import { Routes } from "@angular/router";

export default [
    {
        path: '',
        loadComponent: () =>
            import(
                './pages/schedule-list.component'
            ).then((mod) => mod.ScheduleListComponent),
        title: 'Administrador de Horarios',
    },
    {
        path: 'create',
        loadComponent: () =>
            import(
                './pages/schedule-builder.component'
            ).then((mod) => mod.ScheduleBuilderComponent),
        title: 'Registrar Horario',
    },
    {
        path: ':id',
        loadComponent: () =>
            import(
                './pages/schedule-detail.component'
            ).then((mod) => mod.ScheduleDetailComponent),
        title: 'Detalles del Horario',
    },
] as Routes;