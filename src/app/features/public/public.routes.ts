import { Routes } from "@angular/router";

export default [
    {
        path: 'pricing',
        loadComponent: () =>
            import(
                './pages/buy-subscription.component'
            ).then((mod) => mod.BuySubscriptionComponent),
        title: 'Precios',
    },
    {
        path: 'buy',
        loadComponent: () =>
            import(
                './pages/buy-subscription.component'
            ).then((mod) => mod.BuySubscriptionComponent),
        title: 'Comprar Suscripción',
    },
    {
        path: 'updates',
        loadComponent: () =>
            import(
                './pages/update-list.component'
            ).then((mod) => mod.UpdateListComponent),
        title: 'Noticias - KitMaestro',
    },
    {
        path: 'tutorials',
        loadComponent: () =>
            import('./pages/tutorials.component').then(
                (mod) => mod.TutorialsComponent,
            ),
        title: 'Tutoriales',
    },
    {
        path: 'updates/new',
        loadComponent: () =>
            import('./pages/update-creator.component').then(
                (mod) => mod.UpdateCreatorComponent,
            ),
        title: 'Crear Entrada',
    },
    {
        path: 'roadmap',
        loadComponent: () =>
            import('./pages/roadmap.component').then(
                (mod) => mod.RoadmapComponent,
            ),
        title: 'Planes de Desarrollo',
    },
    {
        path: 'ideas',
        loadComponent: () =>
            import('./pages/idea-board.component').then(
                (mod) => mod.IdeaBoardComponent,
            ),
        title: 'Panel de Ideas',
    },
] as Routes;