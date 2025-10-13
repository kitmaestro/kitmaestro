import { Route } from "@angular/router";

export default [
    {
        path: '',
        loadComponent: () =>
            import(
                './pages/class-sections.component'
            ).then((mod) => mod.ClassSectionsComponent),
        title: 'Mis Secciones',
    },
    {
        path: ':id',
        loadComponent: () =>
            import(
                './pages/section-details.component'
            ).then((mod) => mod.SectionDetailsComponent),
        title: 'Detalles de la Sección',
    },
] as Route[]