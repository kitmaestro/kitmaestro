import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { AppEntry } from '../interfaces/app-entry';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatCardModule,
    MatGridListModule,
    MatSlideToggleModule,
    MatTooltipModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  showAll = false;
  devMode = false;

  apps: AppEntry[] = [
    {
      name: 'Planes Diarios',
      description: 'Planes de clase en menos de 1 minuto.',
      link: ['/class-plans'],
      // icon: '/assets/icons/education2/PNG/the-paper-svgrepo-com.png',
      icon: '/assets/undraw_real_time_sync_re_nky7.svg',
      premium: true,
      isWorking: true,
    },
    {
      name: 'Unidades de Aprendizaje',
      description: 'Diseña unidades de aprendizaje, para ya.',
      link: ['/unit-plans'],
      icon: '/assets/assistant.svg',
      // icon: '/assets/icons/education2/PNG/book-svgrepo-com (2).png',
      premium: true,
      isWorking: true,
    },
    {
      name: 'Calculadora de Promedios',
      description: 'Calcula promedios en un santiamén.',
      link: ['/average-calculator'],
      icon: '/assets/calculator.svg',
      // icon: '/assets/icons/education2/PNG/bank-banking-budget-svgrepo-com.png',
      premium: false,
      isWorking: true,
    },
    {
      name: 'Calculadora de Asistencias',
      description: 'La forma más fácil de calcular la asistencia.',
      link: ['/attendance-calculator'],
      icon: '/assets/attendance.svg',
      // icon: '/assets/icons/education2/PNG/math-svgrepo-com.png',
      premium: false,
      isWorking: true,
    },
    {
      link: ['/attendance'],
      name: 'Control de Asistencia',
      icon: '/assets/attend.svg',
      // icon: '/assets/icons/education/PNG/raise-your-hand-svgrepo-com.png',
      premium: false,
      isWorking: false,
      description: 'Registra tablas de asistencia.'
    },
    {
      name: 'Generador de Calificaciones',
      description: 'Genera calificaciones para tus estudiantes.',
      link: ['/grades-generator'],
      icon: '/assets/grades.svg',
      // icon: '/assets/icons/education/PNG/score-svgrepo-com.png',
      premium: true,
      isWorking: true,
    },
    {
      name: 'Generador de Asistencia',
      description: 'Genera asistencia calculada para tus estudiantes.',
      link: ['/attendance-generator'],
      icon: '/assets/undraw_analysis_dq08.svg',
      // icon: '/assets/icons/education/PNG/vision-svgrepo-com.png',
      isNew: true,
      premium: true,
      isWorking: true,
    },
    {
      name: 'Hojas de Ejercicios',
      description: 'Los ejercicios que necesites para la clase.',
      link: ['/worksheet-builders'],
      icon: '/assets/undraw_real_time_sync_re_nky7.svg',
      // icon: '/assets/icons/education2/PNG/pencil-ruler-svgrepo-com.png',
      premium: false,
      isWorking: true,
    },
    {
      name: 'Lista de Pendientes',
      description: 'Organiza mejor tu jornada con una lista de pendientes.',
      link: ['/todos'],
      icon: '/assets/undraw_to_do_list_re_9nt7 (1).svg',
      // icon: '/assets/icons/education/PNG/time-svgrepo-com.png',
      premium: false,
      isWorking: true,
    },
    {
      name: 'Asistentes',
      description: 'Colección de asistentes virtuales a tu medida.',
      link: ['/assistants'],
      icon: '/assets/assistant.svg',
      // icon: '/assets/icons/education/PNG/space-svgrepo-com.png',
      premium: true,
      isWorking: false,
    },
    {
      name: 'Conversaciones en Inglés',
      description: 'Diálogos en inglés por nivel.',
      link: ['/english-dialog-generator'],
      icon: '/assets/dialog.svg',
      // icon: '/assets/icons/education2/PNG/speech-bubble-svgrepo-com (2).png',
      premium: true,
      isWorking: true,
      isNew: true,
    },
    {
      name: 'Generador de Actividades',
      description: 'Actividades completas en segundos.',
      link: ['/activity-generator'],
      icon: '/assets/activities.svg',
      // icon: '/assets/icons/education/PNG/creativity-svgrepo-com.png',
      premium: true,
      isWorking: true,
    },
    {
      name: 'Generador de Aspectos Trabajados',
      description: 'Aspectos trabajados para el registro.',
      link: ['/aspects-generator'],
      icon: '/assets/aspects.svg',
      // icon: '/assets/icons/education2/PNG/quiz-svgrepo-com.png',
      premium: true,
      isWorking: true,
    },
    {
      name: 'Instrumentos de Evaluación',
      description: 'Instrumentos de evaluación sin esfuerzo.',
      link: ['/assessments'],
      icon: '/assets/checklist.svg',
      // icon: '/assets/icons/education/PNG/math-svgrepo-com.png',
      premium: true,
      isWorking: true,
    },
    {
      name: 'Sistemas de Calificación',
      description: 'Informes detallados para cada necesidad.',
      link: ['/grading-systems'],
      icon: '/assets/undraw_portfolio_website_re_jsdd.svg',
      // icon: '/assets/icons/education2/PNG/fraction-svgrepo-com.png',
      premium: true,
      isWorking: true,
    },
    {
      name: 'Generador de Informes',
      description: 'Informes detallados para cada necesidad.',
      link: ['/reports'],
      icon: '/assets/undraw_data_processing_yrrv.svg',
      // icon: '/assets/icons/education/PNG/statistics-svgrepo-com.png',
      premium: true,
      isWorking: false,
    },
    {
      name: 'Registro Anecdótico',
      description: 'El registro anecdótico hecho fácil.',
      link: ['/log-registry-generator'],
      icon: '/assets/undraw_upload_image_re_svxx.svg',
      // icon: '/assets/icons/education/PNG/writing-svgrepo-com.png',
      premium: false,
      isWorking: true,
    },
    {
      name: 'Plantillas de Planificación',
      description: 'Plantillas funcionales para los tradicionales.',
      link: ['/planner-generator'],
      icon: '/assets/undraw_responsive_re_e1nn.svg',
      // icon: '/assets/icons/education2/PNG/book-svgrepo-com.png',
      premium: false,
      isWorking: true,
    },
    {
      name: 'Recursos Educativos',
      description: 'Almacenamiento y distribución de recursos educativos clasificados.',
      link: ['/resources'],
      icon: '/assets/library_books.svg',
      // icon: '/assets/icons/education/PNG/astronomical-svgrepo-com.png',
      premium: false,
      isWorking: true,
    },
    {
      link: ['/formation'],
      name: 'Evaluación Formativa',
      icon: '/assets/learning.svg',
      // icon: '/assets/icons/education/PNG/mind-svgrepo-com.png',
      premium: false,
      isWorking: false,
      description: 'Herramientas interactivas para evaluar en tiempo real.'
    },
    {
      link: ['/diversity'],
      name: 'Adaptación a la Diversidad',
      icon: '/assets/inclusion.svg',
      // icon: '/assets/icons/education/PNG/certificate-svgrepo-com.png',
      premium: false,
      isWorking: false,
      description: 'Recursos para la enseñanza inclusiva.'
    },
    {
      link: ['/games'],
      name: 'Juegos Educativos',
      icon: '/assets/games.svg',
      // icon: '/assets/icons/education2/PNG/achivement-business-mission-svgrepo-com.png',
      premium: false,
      isWorking: false,
      description: 'Juegos educativos para hacer el aprendizaje más interactivo y divertido.'
    },
    {
      link: ['/communication'],
      name: 'Comunicación con Padres',
      icon: '/assets/forum.svg',
      // icon: '/assets/icons/education2/PNG/speech-bubble-svgrepo-com.png',
      premium: false,
      isWorking: false,
      description: 'Mensajería e informes automáticos a padres.'
    },
    {
      link: ['/tracking'],
      name: 'Seguimiento del Estudiante',
      icon: '/assets/grade.svg',
      // icon: '/assets/icons/education/PNG/discover-svgrepo-com.png',
      premium: false,
      isWorking: false,
      description: 'Graficos y estadísticas del rendimiento estudiantil. '
    },
    {
      link: ['/event-planning'],
      name: 'Eventos Escolares',
      icon: '/assets/celebration.svg',
      // icon: '/assets/icons/education/PNG/calendar-svgrepo-com.png',
      premium: false,
      isWorking: false,
      description: 'Planificación, promoción y seguimiento de eventos escolares.'
    },
    {
      link: ['/security'],
      name: 'Seguridad y Privacidad',
      icon: '/assets/security.svg',
      // icon: '/assets/icons/education/PNG/biology-svgrepo-com.png',
      premium: false,
      isWorking: false,
      description: 'Herramientas para gestionar la seguridad de datos.'
    },
    {
      link: ['/datacenter'],
      name: 'Centro de Datos',
      icon: '/assets/icons/education/PNG/school-svgrepo-com.png',
      // icon: '/assets/icons/education/PNG/school-svgrepo-com.png',
      premium: false,
      isWorking: false,
      description: 'Todo lo que necesitas para sentirte en control de tu salón de clases.'
    },
    {
      link: ['/reviews'],
      name: 'Encuestas y Retroalimentación',
      icon: '/assets/review.svg',
      // icon: '/assets/icons/education/PNG/question-and-answer-svgrepo-com.png',
      premium: false,
      isWorking: false,
      description: 'Recopilación de retroalimentación para mejorar la enseñanza.'
    },
    {
      name: 'Gestión de Tareas',
      description: 'Seguimiento de tareas y recordatorios automáticos.',
      link: ['/tasks'],
      icon: '/assets/checklist.svg',
      // icon: '/assets/icons/education/PNG/read-svgrepo-com.png',
      premium: false,
      isWorking: false,
    },
    {
      link: ['/collab'],
      name: 'Colaboración entre Maestros',
      icon: '/assets/groups.svg',
      // icon: '/assets/icons/education/PNG/chemical-svgrepo-com.png',
      premium: false,
      isWorking: false,
      description: 'Espacio de colaboración para compartir ideas y estrategias de enseñanza.'
    },
  ];

  ngOnInit() {
  }

  toggleView() {
    this.showAll = !this.showAll;
  }
}
