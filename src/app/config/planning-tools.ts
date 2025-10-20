import { AppEntry } from "../core";

export const planningTools: AppEntry[] = [
    {
        name: 'Plan Anual',
        description: 'Diseña unidades de aprendizaje, para ya.',
        link: '/planning/annual-plans',
        icon: '/assets/undraw_scrum-board_uqku.svg',
        tier: 3,
    },
    {
        name: 'Unidades de Aprendizaje',
        description: 'Diseña unidades de aprendizaje, para ya.',
        link: '/planning/unit-plans',
        icon: '/assets/assistant.svg',
        tier: 1,
    },
    {
        name: 'Planes Diarios',
        description: 'Planes de clase en menos de 1 minuto.',
        link: '/planning/class-plans',
        icon: '/assets/undraw_real_time_sync_re_nky7.svg',
        tier: 1,
    },
    {
        name: 'Planes Diario Multigrado',
        description: 'Planes de clase para multigrado.',
        link: '/planning/emi-class-plans',
        icon: '/assets/undraw_educator_6dgp.svg',
        tier: 2,
    },
    {
        name: 'Unidades Multigrado',
        description: 'Unidades de aprendizaje para multigrado.',
        link: '/planning/emi-unit-plans',
        icon: '/assets/undraw_working-together_r43a.svg',
        tier: 2,
    },
    {
        name: 'Plan de Unidad Pre Primario',
        description: 'Unidades de aprendizaje para prescolar.',
        link: '/planning/kinder-unit-plans',
        icon: '/assets/undraw_children_e6ln.svg',
        tier: 2,
    },
    {
        name: 'Planes Diarios en Lote',
        description: 'Genera todos los planes de clase de una unidad.',
        link: '/planning/class-plans/batch',
        icon: '/assets/undraw_chat-with-ai_ir62.svg',
        tier: 3,
    },
    {
        name: 'Prácticas Deportivas',
        description: 'Obtén planes de entrenamiento detallados para tus clases',
        link: '/planning/sports-practice-generator',
        icon: '/assets/undraw_track-and-field_i2au.svg',
        tier: 2,
    },
    {
        name: 'Generador de Ruta de Estudio',
        description: 'Planifica tu aprendizaje paso a paso',
        link: '/planning/study-path-generator',
        icon: '/assets/undraw_studying_n5uj.svg',
        tier: 3,
    },
];
