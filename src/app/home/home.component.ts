import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { AppEntry } from '../interfaces/app-entry';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatCardModule,
    MatGridListModule,
    MatBadgeModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  private apps: AppEntry[] = [
    { name: 'Calculadora de Promedios', description: 'Calcula promedios en un santiamén.', link: ['/average-calculator'], premium: false, icon: '/assets/calculator.svg' },
    { name: 'Calculadora de Asistencias', description: 'La forma más fácil de calcular la asistencia.', link: ['/attendance-calculator'], premium: false, icon: '/assets/attendance.svg' },
    { name: 'Generador de Calificaciones', description: 'Genera facilmente las calificaciones de tus estudiantes.', link: ['/grades-generator'], premium: false, icon: '/assets/grades.svg' },
    { name: 'Generador de Actividades', description: 'Actividades completas en segundos.', link: ['/activity-generator'], premium: true, icon: '/assets/activities.svg' },
    { name: 'Generador de Aspectos Trabajados', description: 'Obten fácilmente una lista de aspectos trabajados.', link: ['/aspects-generator'], premium: true, icon: '/assets/aspects.svg' },
    { name: 'Generador de Listas de Cotejo', description: 'Crea listas de cotejo perfectas sin esfuerzo.', link: ['/checklist-generator'], premium: true, icon: '/assets/checklist.svg' },
    { name: 'Generador de Diálogos en Inglés', description: 'Consigue diálogos en inglés (texto y audio) por nivel.', link: ['/english-dialog-generator'], premium: true, icon: '/assets/dialog.svg' },
    { name: 'Generador de Ejercicios de Inglés', description: 'Hojas de ejercicios de inglés.', link: ['/english-worksheet-generator'], premium: true, icon: '/assets/undraw_observations_re_ohja.svg' },
    { name: 'Generador de Escalas de Estimación', description: 'Produce escalas de estimación para evaluar hoy mismo.', link: ['/estimation-scale-generator'], premium: true, icon: '/assets/undraw_data_processing_yrrv.svg' },
    { name: 'Generador de Registro Anecdótico', description: 'La forma más fácil de trabajar el registro anecdótico.', link: ['/log-registry-generator'], premium: false, icon: '/assets/undraw_upload_image_re_svxx.svg' },
    { name: 'Generador de Ejercicios de Matemática', description: 'Los ejercicios que necesites para la clase o el examen.', link: ['/math-worksheet-generator'], premium: true, icon: '/assets/undraw_mathematics_-4-otb.svg' },
    { name: 'Generador de Plantilla de Planificación', description: 'Crea plantillas de planificación bonitas y funcionales.', link: ['/planner-generator'], premium: false, icon: '/assets/undraw_responsive_re_e1nn.svg' },
    { name: 'Generador de Rúbricas', description: 'Genera rúbricas en instantes.', link: ['/rubric-generator'], premium: true, icon: '/assets/undraw_spreadsheet_re_cn18.svg' },
    { name: 'Generador de Ejercicios de Español', description: 'Obtén ejercicios para trabajar en Lengua Española.', link: ['/spanish-worksheet-generator'], premium: true, icon: '/assets/undraw_real_time_sync_re_nky7.svg' },
    // { name: 'Herramientas', description: 'Galeria de Herramientas para maestros.', link: ['/apps'], premium: false, icon: '/assets/apps.svg' },
    // { link: ['/generators'], name: 'Generadores', icon: '/assets/machine.svg', premium: false, description: 'Generadores y automatizadores de datos y documentos.' },
    // { link: ['/assistants'], name: 'Asistentes', icon: '/assets/assistant.svg', premium: false, description: 'Asistentes para crear planes y documentos.' },
    // { link: ['/datacenter'], name: 'Centro de Datos', icon: '/assets/data.svg', premium: false, description: 'Todo lo que necesitas para sentirte en control de tu salón de clases.' },
    // { link: ['/attendance'], name: 'Gestión de Asistencia', icon: '/assets/attend.svg', premium: false, description: 'Registra o Genera tablas de asistencia.' },
    // { link: ['/tasks'], name: 'Gestión de Tareas', icon: '/assets/checklist.svg', premium: false, description: 'Seguimiento de tareas y recordatorios automáticos.' },
    // { link: ['/premium', 'class-planning'], name: 'Planificación de Clases', icon: '/assets/timeline.svg', premium: false, description: 'Asistentes de planificación y gestión de horario.' },
    // { link: ['/premium', 'communication'], name: 'Juegos Educativos', icon: '/assets/games.svg', premium: false, description: 'Juegos educativos para hacer el aprendizaje más interactivo y divertido.' },
    // { link: ['/premium', 'communication'], name: 'Comunicación con Padres', icon: '/assets/forum.svg', premium: false, description: 'Mensajería e informes automáticos a padres.' },
    // { link: ['/resources'], name: 'Recursos Educativos', icon: '/assets/library_books.svg', premium: false, description: 'Almacenamiento y distribución de recursos educativos clasificados.' },
    // { link: ['/premium', 'formation'], name: 'Evaluación Formativa', icon: '/assets/learning.svg', premium: false, description: 'Herramientas interactivas para evaluar en tiempo real.' },
    // { link: ['/premium', 'tracking'], name: 'Seguimiento del Estudiante', icon: '/assets/grade.svg', premium: false, description: 'Graficos y estadísticas del rendimiento estudiantil. ' },
    // { link: ['/premium', 'event-planning'], name: 'Eventos Escolares', icon: '/assets/celebration.svg', premium: false, description: 'Planificación, promoción y seguimiento de eventos escolares.' },
    // { link: ['/collab'], name: 'Colaboración entre Maestros', icon: '/assets/groups.svg', premium: false, description: 'Espacio de colaboración para compartir ideas y estrategias de enseñanza.' },
    // { link: ['/premium', 'diversity'], name: 'Adaptación a la Diversidad', icon: '/assets/inclusion.svg', premium: false, description: 'Recursos para la enseñanza inclusiva.' },
    // { link: ['/premium', 'reviews'], name: 'Encuestas y Retroalimentación', icon: '/assets/review.svg', premium: false, description: 'Recopilación de retroalimentación para mejorar la enseñanza.' },
    // { link: ['/premium', 'security'], name: 'Seguridad y Privacidad', icon: '/assets/security.svg', premium: false, description: 'Herramientas para gestionar la seguridad de datos.' },
  ];

  columns() {
    let next = 0;
    const final: AppEntry[][] = [
      [],
      [],
      [],
      [],
      [],
    ];
    for (let app of this.apps) {
      final[next].push(app);
      if (next == 4) {
        next = 0;
      } else {
        next++;
      }
    }
    return final;
  }
}
