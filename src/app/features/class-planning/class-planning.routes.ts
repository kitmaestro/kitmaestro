import { Routes } from "@angular/router";

export default [
    {
        path: 'sports-practice-generator',
        loadComponent: () =>
            import(
                './pages/sports-practice-generator.component'
            ).then((mod) => mod.SportsPracticeGeneratorComponent),
        title: 'Generador de Prácticas Deportivas',
    },
    {
        path: 'class-plans',
        loadComponent: () =>
            import(
                './pages/class-plan-generator/class-plan-generator.component'
            ).then((mod) => mod.ClassPlanGeneratorComponent),
        title: 'Generador de Planes de Clase',
    },
    {
        path: 'class-plans/list',
        loadComponent: () =>
            import(
                './pages/class-plan-list/class-plan-list.component'
            ).then((mod) => mod.ClassPlanListComponent),
        title: 'Mis Planes de Clase',
    },
    {
        path: 'class-plans/:id',
        loadComponent: () =>
            import(
                './pages/class-plan-detail/class-plan-detail.component'
            ).then((mod) => mod.ClassPlanDetailComponent),
        title: 'Detalles del Plan de Clase',
    },
    {
        path: 'class-plans/:id/edit',
        loadComponent: () =>
            import(
                './pages/class-plan-edit/class-plan-edit.component'
            ).then((mod) => mod.ClassPlanEditComponent),
        title: 'Editar Plan de Clase',
    },
    {
        path: 'unit-plans',
        loadComponent: () =>
            import(
                './pages/unit-plan-generator/unit-plan-generator.component'
            ).then((mod) => mod.UnitPlanGeneratorComponent),
        title: 'Generador de Planes de Unidad',
    },
    {
        path: 'unit-plans/list',
        loadComponent: () =>
            import(
                './pages/unit-plan-list/unit-plan-list.component'
            ).then((mod) => mod.UnitPlanListComponent),
        title: 'Mis Planes de Unidad',
    },
    {
        path: 'unit-plans/:id',
        loadComponent: () =>
            import(
                './pages/unit-plan-detail/unit-plan-detail.component'
            ).then((mod) => mod.UnitPlanDetailComponent),
        title: 'Detalles del Plan de Unidad',
    },
    {
        path: 'unit-plans/:id/edit',
        loadComponent: () =>
            import(
                './pages/unit-plan-edit/unit-plan-edit.component'
            ).then((mod) => mod.UnitPlanEditComponent),
        title: 'Editar Plan de Unidad',
    },
] as Routes;