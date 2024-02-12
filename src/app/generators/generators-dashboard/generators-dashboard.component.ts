import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { AppEntry } from '../../interfaces/app-entry';

@Component({
  selector: 'app-generators-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatCardModule,
    MatGridListModule,
    MatBadgeModule,
  ],
  templateUrl: './generators-dashboard.component.html',
  styleUrl: './generators-dashboard.component.scss'
})
export class GeneratorsDashboardComponent {
  private apps: AppEntry[] = [
    { name: 'Generador de Calificaciones', description: 'Genera facilmente las calificaciones de tus estudiantes.', link: ['/generators', 'grades-generator'], premium: false, icon: '/assets/grades.svg' },
    { name: 'Generador de Actividades', description: 'Actividades completas en segundos.', link: ['/generators', 'activity-generator'], premium: true, icon: '/assets/activities.svg' },
    { name: 'Generador de Aspectos Trabajados', description: 'Obten fácilmente una lista de aspectos trabajados.', link: ['/generators', 'aspects-generator'], premium: true, icon: '/assets/aspects.svg' },
    { name: 'Generador de Listas de Cotejo', description: 'Crea listas de cotejo perfectas sin esfuerzo.', link: ['/generators', 'checklist-generator'], premium: true, icon: '/assets/checklist.svg' },
    { name: 'Generador de Diálogos en Inglés', description: 'Consigue diálogos en inglés (texto y audio) por nivel.', link: ['/generators', 'english-dialog-generator'], premium: true, icon: '/assets/dialog.svg' },
    { name: 'Generador de Ejercicios de Inglés', description: 'Hojas de ejercicios de inglés.', link: ['/generators', 'english-worksheet-generator'], premium: true, icon: '/assets/undraw_observations_re_ohja.svg' },
    { name: 'Generador de Escalas de Estimación', description: 'Produce escalas de estimación para evaluar hoy mismo.', link: ['/generators', 'estimation-scale-generator'], premium: true, icon: '/assets/undraw_data_processing_yrrv.svg' },
    { name: 'Generador de Registro Anecdótico', description: 'La forma más fácil de trabajar el registro anecdótico.', link: ['/generators', 'log-registry-generator'], premium: false, icon: '/assets/undraw_upload_image_re_svxx.svg' },
    { name: 'Generador de Ejercicios de Matemática', description: 'Los ejercicios que necesites para la clase o el examen.', link: ['/generators', 'math-worksheet-generator'], premium: true, icon: '/assets/undraw_mathematics_-4-otb.svg' },
    { name: 'Generador de Plantilla de Planificación', description: 'Crea plantillas de planificación bonitas y funcionales.', link: ['/generators', 'planner-generator'], premium: false, icon: '/assets/undraw_responsive_re_e1nn.svg' },
    { name: 'Generador de Rúbricas', description: 'Genera rúbricas en instantes.', link: ['/generators', 'rubric-generator'], premium: true, icon: '/assets/undraw_spreadsheet_re_cn18.svg' },
    { name: 'Generador de Ejercicios de Español', description: 'Obtén ejercicios para trabajar en Lengua Española.', link: ['/generators', 'spanish-worksheet-generator'], premium: true, icon: '/assets/undraw_real_time_sync_re_nky7.svg' },
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
