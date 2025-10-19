import { AppEntry } from "../core/interfaces";

export const supportTools: AppEntry[] = [
    {
        name: 'Asistente de IA',
        description: 'Obtén ayuda, ideas y sugerencias adaptadas a ti.',
        link: ['/support', 'ai'],
        categories: ['Productividad'],
        icon: '/assets/machine.svg',
        tier: 1,
    },
    {
        name: 'Lista de Pendientes',
        description: 'Organiza mejor tu jornada con una lista de pendientes.',
        link: ['/support', 'todos'],
        categories: ['Productividad'],
        icon: '/assets/undraw_to_do_list_re_9nt7 (1).svg',
        tier: 1,
    },
    {
        name: 'Tablero de Ideas',
        description:
            'Tienes una idea para nuestra próxima herramienta? Publícala aquí.',
        link: ['/support', 'ideas'],
        categories: ['Productividad'],
        icon: '/assets/undraw_ideas_41b9.svg',
        tier: 2,
    },
    {
        name: 'Recursos Educativos',
        description:
            'Almacenamiento y distribución de recursos educativos clasificados.',
        link: ['/support', 'resources'],
        categories: ['Recursos', 'Plantillas'],
        icon: '/assets/library_books.svg',
        tier: 1,
    },
    // {
    // 	name: 'Gestion de Horario',
    // 	description: 'Maneja tus horarios de clase',
    // 	link: ['/support', 'schedules'],
    // 	categories: ['Productividad'],
    // 	icon: '/assets/undraw_schedule_re_2vro(1).svg',
    // },
    {
        link: ['/support', 'diversity'],
        categories: ['Diversidad'],
        name: 'Adaptación a la Diversidad',
        icon: '/assets/inclusion.svg',
        description: 'Recursos para la enseñanza inclusiva.',
        tier: 1,
    },
    // {
    // 	name: 'Generador de Horarios',
    // 	description: 'Un simple generador de horarios de clase JEE',
    // 	link: ['/support', 'schedule-generator'],
    // 	categories: ['Productividad'],
    // 	icon: '/assets/icons/education/PNG/calendar-svgrepo-com.png',
    // },
    {
        name: 'Plantillas de Planificación',
        description: 'Plantillas funcionales para los tradicionales.',
        link: ['/support', 'planner-generator'],
        categories: ['Plantillas', 'Planificación'],
        icon: '/assets/undraw_responsive_re_e1nn.svg',
        tier: 1,
    },
];
