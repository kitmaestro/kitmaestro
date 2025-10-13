import { Route } from "@angular/router";

export default [
    { path: 'attendance-calculator', loadComponent: () => import('./pages/attendance-calculator.component').then(m => m.AttendanceCalculatorComponent), title: 'Calculadora de Asistencia' },
    { path: 'average-calculator', loadComponent: () => import('./pages/average-calculator.component').then(m => m.AverageCalculatorComponent), title: 'Calculadora de Promedio' },
    { path: 'attendance', loadComponent: () => import('./pages/attendance-dashboard.component').then((mod) => mod.AttendanceDashboardComponent), title: 'Asistencia', },
    { path: 'attendance/:id', loadComponent: () => import('./pages/section-attendance.component').then((mod) => mod.SectionAttendanceComponent), title: 'Detalles de la Asistencia', },
    { path: 'grades-generator', loadComponent: () => import('./pages/grades-generator.component').then(m => m.GradesGeneratorComponent), title: 'Generador de Calificaciones' },
    { path: 'grades-registry', loadComponent: () => import('./pages/grades-registry.component').then(m => m.GradesRegistryComponent), title: 'Registro de Calificaciones' },
    { path: 'attendance-generator', loadComponent: () => import('./pages/attendance-generator.component').then(m => m.AttendanceGeneratorComponent), title: 'Generador de Asistencia' },
    { path: 'aspects-generator', loadComponent: () => import('./pages/aspects-generator.component').then(m => m.AspectsGeneratorComponent), title: 'Generador de Aspectos Trabajados' },
] as Route[]
