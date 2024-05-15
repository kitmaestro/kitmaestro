import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { AppEntry } from '../interfaces/app-entry';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { BreakpointObserver } from '@angular/cdk/layout';
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
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  private breakpointObserver = inject(BreakpointObserver);
  router = inject(Router);

  showAll = false;
  devMode = true;

  _layout: AppEntry[][] = [];

  private apps: AppEntry[] = [
    {
      name: 'Calculadora de Promedios',
      description: 'Calcula promedios en un santiamén.',
      link: ['/app/average-calculator'],
      icon: '/assets/calculator.svg',
      premium: false,
      isWorking: true,
    },
    {
      name: 'Calculadora de Asistencias',
      description: 'La forma más fácil de calcular la asistencia.',
      link: ['/app','attendance-calculator'],
      icon: '/assets/attendance.svg',
      premium: false,
      isWorking: true,
    },
    {
      name: 'Generador de Asistencia',
      description: 'Genera asistencia calculada para tus estudiantes.',
      link: ['/app','attendance-generator'],
      icon: '/assets/undraw_analysis_dq08.svg',
      isNew: true,
      premium: true,
      isWorking: true,
    },
    {
      name: 'Generador de Calificaciones',
      description: 'Genera facilmente las calificaciones de tus estudiantes.',
      link: ['/app','grades-generator'],
      icon: '/assets/grades.svg',
      premium: true,
      isWorking: true,
    },
    {
      name: 'Planes Diarios',
      description: 'Planes de clase en menos de 3 minutos.',
      link: ['/app', 'assistants','class-plans'],
      icon: '/assets/undraw_real_time_sync_re_nky7.svg',
      premium: true,
      isWorking: false,
    },
    {
      name: 'Unidades de Aprendizaje',
      description: 'Diseña unidades de aprendizaje, para ya mismo.',
      link: ['/app', 'assistants','unit-plans'],
      icon: '/assets/assistant.svg',
      premium: true,
      isWorking: false,
    },
    {
      name: 'Hojas de Ejercicios',
      description: 'Los ejercicios que necesites para la clase.',
      link: ['/app','worksheet-builders'],
      icon: '/assets/undraw_real_time_sync_re_nky7.svg',
      premium: true,
      isWorking: true,
    },
    {
      name: 'Asistentes',
      description: 'Una colección de asistentes virtuales para ti, a tu medida.',
      link: ['/app','assistants'],
      icon: '/assets/assistant.svg',
      premium: true,
      isWorking: false,
    },
    {
      name: 'Generador de Conversaciones en Inglés',
      description: 'Consigue diálogos en inglés (texto y audio) por nivel.',
      link: ['/app','english-dialog-generator'],
      icon: '/assets/dialog.svg',
      premium: true,
      isWorking: true,
      isNew: true,
    },
    {
      name: 'Generador de Actividades',
      description: 'Actividades completas en segundos.',
      link: ['/app','activity-generator'],
      icon: '/assets/activities.svg',
      premium: true,
      isWorking: false,
    },
    {
      name: 'Generador de Aspectos Trabajados',
      description: 'Obten fácilmente una lista de aspectos trabajados para tu registro.',
      link: ['/app','aspects-generator'],
      icon: '/assets/aspects.svg',
      premium: true,
      isWorking: true,
    },
    {
      name: 'Instrumentos de Evaluación',
      description: 'Generadores de instrumentos de evaluación sin esfuerzo.',
      link: ['/app','assessments'],
      icon: '/assets/checklist.svg',
      premium: true,
      isWorking: false,
    },
    // {
    //   name: 'Generador de Listas de Cotejo',
    //   description: 'Crea listas de cotejo perfectas sin esfuerzo.',
    //   link: ['/app','checklist-generator'],
    //   icon: '/assets/checklist.svg',
    //   premium: true
    // },
    {
      name: 'Generador de Informes',
      description: 'Informes detallados para cada necesidad.',
      link: ['/app','estimation-scale-generator'],
      icon: '/assets/undraw_data_processing_yrrv.svg',
      premium: true,
      isWorking: false,
    },
    // {
    //   name: 'Generador de Escalas de Estimación',
    //   description: 'Produce escalas de estimación para evaluar hoy mismo.',
    //   link: ['/app','estimation-scale-generator'],
    //   icon: '/assets/undraw_data_processing_yrrv.svg',
    //   premium: true
    // },
    {
      name: 'Registro Anecdótico',
      description: 'La forma más fácil de trabajar el registro anecdótico.',
      link: ['/app','log-registry-generator'],
      icon: '/assets/undraw_upload_image_re_svxx.svg',
      premium: false,
      isWorking: true,
    },
    {
      name: 'Generador de Plantilla de Planificación',
      description: 'Plantillas bonitas y funcionales para los menos tecnológicos.',
      link: ['/app','planner-generator'],
      icon: '/assets/undraw_responsive_re_e1nn.svg',
      premium: false,
      isWorking: true,
    },
    // {
    //   name: 'Generador de Rúbricas',
    //   description: 'Genera rúbricas en instantes.',
    //   link: ['/app','rubric-generator'],
    //   icon: '/assets/undraw_spreadsheet_re_cn18.svg',
    //   premium: true
    // },
    {
      name: 'Recursos Educativos',
      description: 'Almacenamiento y distribución de recursos educativos clasificados.',
      link: ['/app','resources'],
      icon: '/assets/library_books.svg',
      premium: false,
      isWorking: true,
    },

    // { link: ['/app','class-planning'], name: 'Planificación de Clases', icon: '/assets/timeline.svg', premium: false, description: 'Asistentes de planificación y gestión de horario.' },
    // { link: ['/app','formation'], name: 'Evaluación Formativa', icon: '/assets/learning.svg', premium: false, description: 'Herramientas interactivas para evaluar en tiempo real.' },
    // { link: ['/app','diversity'], name: 'Adaptación a la Diversidad', icon: '/assets/inclusion.svg', premium: false, description: 'Recursos para la enseñanza inclusiva.' },
    // { link: ['/app','communication'], name: 'Juegos Educativos', icon: '/assets/games.svg', premium: false, description: 'Juegos educativos para hacer el aprendizaje más interactivo y divertido.' },
    // { link: ['/app','communication'], name: 'Comunicación con Padres', icon: '/assets/forum.svg', premium: false, description: 'Mensajería e informes automáticos a padres.' },
    // { link: ['/app','tracking'], name: 'Seguimiento del Estudiante', icon: '/assets/grade.svg', premium: false, description: 'Graficos y estadísticas del rendimiento estudiantil. ' },
    // { link: ['/app','event-planning'], name: 'Eventos Escolares', icon: '/assets/celebration.svg', premium: false, description: 'Planificación, promoción y seguimiento de eventos escolares.' },
    // { link: ['/app','reviews'], name: 'Encuestas y Retroalimentación', icon: '/assets/review.svg', premium: false, description: 'Recopilación de retroalimentación para mejorar la enseñanza.' },
    // { link: ['/app','security'], name: 'Seguridad y Privacidad', icon: '/assets/security.svg', premium: false, description: 'Herramientas para gestionar la seguridad de datos.' },

    // { name: 'Herramientas', description: 'Galeria de Herramientas para maestros.', link: ['/app','apps'], premium: false, icon: '/assets/apps.svg' },
    // { link: ['/app','generators'], name: 'Generadores', icon: '/assets/machine.svg', premium: false, description: 'Generadores y automatizadores de datos y documentos.' },
    // { link: ['/app','assistants'], name: 'Asistentes', icon: '/assets/assistant.svg', premium: false, description: 'Asistentes para crear planes y documentos.' },
    // { link: ['/app','datacenter'], name: 'Centro de Datos', icon: '/assets/data.svg', premium: false, description: 'Todo lo que necesitas para sentirte en control de tu salón de clases.' },
    // { link: ['/app','attendance'], name: 'Gestión de Asistencia', icon: '/assets/attend.svg', premium: false, description: 'Registra o Genera tablas de asistencia.' },

    // { link: ['/app','tasks'], name: 'Gestión de Tareas', icon: '/assets/checklist.svg', premium: false, description: 'Seguimiento de tareas y recordatorios automáticos.' },
    // { link: ['/app','collab'], name: 'Colaboración entre Maestros', icon: '/assets/groups.svg', premium: false, description: 'Espacio de colaboración para compartir ideas y estrategias de enseñanza.' },
  ];

  async checkModel() {
    // const inference = new HfInference('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');
    // inference.textGeneration({
    //   model: 'gpt2',
    //   inputs: 'The answer to the universe is'
    // }).then(res => {
    //   console.log(res.generated_text)
    // });

    // this.aiService.research('text-generation', 2000)
  }

  ngOnInit() {
    this.adjustLayout();
  }

  adjustLayout() {
    this.breakpointObserver.observe(['(max-width: 480px)', '(min-width: 481px) and (max-width: 720px)', '(min-width: 721px) and (max-width: 1024px)', '(min-width: 1025px) and (max-width: 1400px)', '(min-width: 1401px)']).subscribe({
      next: (result) => {
        if (result.breakpoints['(max-width: 480px)']) {
          this._layout = this.columns();
        }
        if (result.breakpoints['(min-width: 481px) and (max-width: 720px)']) {
          this._layout = this.columns2();
        }
        if (result.breakpoints['(min-width: 721px) and (max-width: 1024px)']) {
          this._layout = this.columns3();
        }
        if (result.breakpoints['(min-width: 1025px) and (max-width: 1400px)']) {
          this._layout = this.columns4();
        }
        if (result.breakpoints['(min-width: 1401px)']) {
          this._layout = this.columns5();
        }
      }
    })
  }

  toggleView() {
    this.showAll = !this.showAll;
    this.adjustLayout();
  }

  get layout() {
    return this._layout;
  }

  columns5() {
    let next = 0;
    const final: AppEntry[][] = [
      [],
      [],
      [],
      [],
      [],
    ];
    for (let app of this.showAll ? this.apps : this.apps.filter(app => this.devMode ? !app.isWorking : app.isWorking)) {
      final[next].push(app);
      if (next == 4) {
        next = 0;
      } else {
        next++;
      }
    }
    return final;
  }

  columns4() {
    let next = 0;
    const final: AppEntry[][] = [
      [],
      [],
      [],
      [],
    ];
    for (let app of this.showAll ? this.apps : this.apps.filter(app => this.devMode ? !app.isWorking : app.isWorking)) {
      final[next].push(app);
      if (next == 3) {
        next = 0;
      } else {
        next++;
      }
    }
    return final;
  }

  columns3() {
    let next = 0;
    const final: AppEntry[][] = [
      [],
      [],
      [],
    ];
    for (let app of this.showAll ? this.apps : this.apps.filter(app => this.devMode ? !app.isWorking : app.isWorking)) {
      final[next].push(app);
      if (next == 2) {
        next = 0;
      } else {
        next++;
      }
    }
    return final;
  }

  columns2() {
    let next = 0;
    const final: AppEntry[][] = [
      [],
      [],
    ];
    for (let app of this.showAll ? this.apps : this.apps.filter(app => this.devMode ? !app.isWorking : app.isWorking)) {
      final[next].push(app);
      if (next == 1) {
        next = 0;
      } else {
        next++;
      }
    }
    return final;
  }

  columns() {
    let next = 0;
    const final: AppEntry[][] = [
      [],
    ];
    for (let app of this.showAll ? this.apps : this.apps.filter(app => this.devMode ? !app.isWorking : app.isWorking)) {
      final[next].push(app);
    }
    return final;
  }
}
