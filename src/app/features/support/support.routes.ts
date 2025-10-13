import { Route } from "@angular/router";

export default [
    { path: 'resources', loadComponent: () => import('./pages/resource-gallery.component').then((m) => m.ResourceGalleryComponent), title: 'Galería de Recursos' },
    { path: 'resources/:id', loadComponent: () => import('./pages/resource-details.component').then((m) => m.ResourceDetailsComponent), title: 'Detalles del Recurso' },
    { path: 'ai', loadComponent: () => import('./pages/ai-assistant.component').then((mod) => mod.AiAssistantComponent), title: 'Asistente Virtual' },
    { path: 'todos', loadComponent: () => import('./pages/todo-lists.component').then((mod) => mod.TodoListsComponent), title: 'Listas de Pendientes' },
    { path: 'todos/:id', loadComponent: () => import('./pages/todos.component').then((mod) => mod.TodosComponent), title: 'Lista de Tareas' },
    { path: 'ideas', loadComponent: () => import('./pages/idea-board.component').then((mod) => mod.IdeaBoardComponent), title: 'Panel de Ideas' },
    { path: 'diversity', loadComponent: () => import('./pages/diversifier.component').then((mod) => mod.DiversifierComponent), title: 'Diversificador de Contenidos' },
    { path: 'planner-generator', loadComponent: () => import('./pages/planner-generator.component').then((mod) => mod.PlannerGeneratorComponent), title: 'Generador de Plantillas de Planificación' },
] as Route[]