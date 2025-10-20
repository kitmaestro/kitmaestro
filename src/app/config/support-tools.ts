import { AppEntry } from "../core";

export const supportTools: AppEntry[] = [
    {
        link: '/support/ai',
        name: 'Asistente de IA',
        description: 'Obtén ayuda, ideas y sugerencias adaptadas a ti.',
        icon: '/assets/machine.svg',
        tier: 1,
    },
    {
        link: '/support/todos',
        name: 'Lista de Pendientes',
        description: 'Organiza mejor tu jornada con una lista de pendientes.',
        icon: '/assets/undraw_to_do_list_re_9nt7 (1).svg',
        tier: 1,
    },
    {
        link: '/support/ideas',
        name: 'Tablero de Ideas',
        description: 'Tienes una idea para nuestra próxima herramienta? Publícala aquí.',
        icon: '/assets/undraw_ideas_41b9.svg',
        tier: 2,
    },
    {
        link: '/support/resources',
        name: 'Recursos Educativos',
        description: 'Almacenamiento y distribución de recursos educativos clasificados.',
        icon: '/assets/library_books.svg',
        tier: 1,
    },
    // {
    // 	name: 'Gestion de Horario',
    // 	link: '/support/schedules',
    // 	description: 'Maneja tus horarios de clase',
    // 	icon: '/assets/undraw_schedule_re_2vro(1).svg',
    // },
    {
        link: '/support/diversity',
        name: 'Adaptación a la Diversidad',
        description: 'Recursos para la enseñanza inclusiva.',
        icon: '/assets/inclusion.svg',
        tier: 1,
    },
    // {
    // 	link: '/support/schedule-generator',
    // 	name: 'Generador de Horarios',
    // 	description: 'Un simple generador de horarios de clase JEE',
    // 	icon: '/assets/icons/education/PNG/calendar-svgrepo-com.png',
    // },
    {
        link: '/support/planner-generator',
        name: 'Plantillas de Planificación',
        description: 'Plantillas funcionales para los tradicionales.',
        icon: '/assets/undraw_responsive_re_e1nn.svg',
        tier: 1,
    },
];
