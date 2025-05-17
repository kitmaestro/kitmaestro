import { Routes } from "@angular/router";

export default [
    {
        path: '',
        loadComponent: () =>
            import(
                './pages/resource-gallery.component'
            ).then((m) => m.ResourceGalleryComponent),
        title: 'Galería de Recursos',
    },
    {
        path: 'my-resources',
        loadComponent: () =>
            import(
                './pages/resources-dashboard.component'
            ).then((mod) => mod.ResourcesDashboardComponent),
        title: 'Mis Recursos',
    },
    {
        path: 'by/:id',
        loadComponent: () =>
            import(
                './pages/creator.component'
            ).then((m) => m.CreatorComponent),
        title: 'Crear Recurso',
    },
    {
        path: ':id',
        loadComponent: () =>
            import(
                './pages/resource-details.component'
            ).then((m) => m.ResourceDetailsComponent),
        title: 'Detalles del Recurso',
    },
] as Routes;