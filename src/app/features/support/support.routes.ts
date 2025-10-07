import { Route } from "@angular/router";

export default [
    {
        path: 'ai',
        title: 'Asistente Virtual',
        loadComponent: () =>
            import('./pages/ai-assistant.component').then(
                (mod) => mod.AiAssistantComponent,
            ),
    }
] as Route[]