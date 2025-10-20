import { AppEntry } from "../core";

export const registryTools: AppEntry[] = [
    {
        name: 'Calculadora de Promedios',
        description: 'Calcula promedios en un santiamén.',
        link: ['/registry', 'average-calculator'],
        icon: '/assets/calculator.svg',
        tier: 1,
    },
    {
        name: 'Calculadora de Asistencias',
        description: 'La forma más fácil de calcular la asistencia.',
        link: ['/registry', 'attendance-calculator'],
        icon: '/assets/attendance.svg',
        tier: 1,
    },
    {
        link: ['/registry', 'attendance'],
        name: 'Control de Asistencia',
        icon: '/assets/attend.svg',
        description: 'Registra tablas de asistencia.',
        tier: 1,
    },
    {
        name: 'Generador de Calificaciones',
        description: 'Genera calificaciones para tus estudiantes.',
        link: ['/registry', 'grades-generator'],
        icon: '/assets/grades.svg',
        tier: 2,
    },
    {
        name: 'Generador de Asistencia',
        description: 'Genera asistencia calculada para tus estudiantes.',
        link: ['/registry', 'attendance-generator'],
        icon: '/assets/undraw_analysis_dq08.svg',
        isNew: true,
        tier: 2,
    },
    {
        name: 'Generador de Aspectos Trabajados',
        description: 'Aspectos trabajados para el registro.',
        link: ['/registry', 'aspects-generator'],
        icon: '/assets/aspects.svg',
        tier: 1,
    },
];
