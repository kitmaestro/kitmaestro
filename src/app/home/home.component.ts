import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { AppEntry } from '../interfaces/app-entry';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { AppTileComponent } from '../app-tile/app-tile.component';
import { FavoritesService } from '../services/favorites.service';
import { UserSettingsService } from '../services/user-settings.service';
import { UserSettings } from '../interfaces/user-settings';

@Component({
    selector: 'app-home',
    imports: [
        CommonModule,
        RouterModule,
        MatIconModule,
        MatCardModule,
        MatGridListModule,
        MatSlideToggleModule,
        MatTooltipModule,
        MatFormFieldModule,
        MatButtonModule,
        ReactiveFormsModule,
        MatInputModule,
        AppTileComponent,
    ],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss'
})
export class HomeComponent {
  private favoritesService = inject(FavoritesService);
  private userSettingsService = inject(UserSettingsService);
  favorites: AppEntry[] = [];
  search = new FormControl();
  user: UserSettings | null = null;

  loadFavorites() {
    this.favoritesService.findAll().subscribe({
      next: favs => {
        this.favorites = favs.tools;
      }
    });
  }

  emptyApp: AppEntry = {
    name: 'Favoritos',
    description: 'Aqui estarán las herramientas que marques como favoritas.',
    link: [],
    icon: '/assets/undraw_like-dislike_ggjr.svg'
  }

  apps: AppEntry[] = [
    {
      name: 'Unidades de Aprendizaje',
      description: 'Diseña unidades de aprendizaje, para ya.',
      link: ['/unit-plans'],
      icon: '/assets/assistant.svg',
      // icon: '/assets/icons/education2/PNG/book-svgrepo-com (2).png',
    },
    {
      name: 'Planes Diarios',
      description: 'Planes de clase en menos de 1 minuto.',
      link: ['/class-plans'],
      // icon: '/assets/icons/education2/PNG/the-paper-svgrepo-com.png',
      icon: '/assets/undraw_real_time_sync_re_nky7.svg',
    },
    {
      name: 'Generador de Exámenes',
      description: 'Genera exámenes instantaneamente.',
      link: ['/test-generator'],
      icon: '/assets/undraw_exams_d2tf.svg',
      // icon: '/assets/icons/education2/PNG/bank-banking-budget-svgrepo-com.png',
    },
    {
      name: 'Calculadora de Promedios',
      description: 'Calcula promedios en un santiamén.',
      link: ['/average-calculator'],
      icon: '/assets/calculator.svg',
      // icon: '/assets/icons/education2/PNG/bank-banking-budget-svgrepo-com.png',
    },
    {
      name: 'Calculadora de Asistencias',
      description: 'La forma más fácil de calcular la asistencia.',
      link: ['/attendance-calculator'],
      icon: '/assets/attendance.svg',
      // icon: '/assets/icons/education2/PNG/math-svgrepo-com.png',
    },
    {
      link: ['/attendance'],
      name: 'Control de Asistencia',
      icon: '/assets/attend.svg',
      // icon: '/assets/icons/education/PNG/raise-your-hand-svgrepo-com.png',
      description: 'Registra tablas de asistencia.'
    },
    {
      name: 'Lista de Pendientes',
      description: 'Organiza mejor tu jornada con una lista de pendientes.',
      link: ['/todos'],
      icon: '/assets/undraw_to_do_list_re_9nt7 (1).svg',
      // icon: '/assets/icons/education/PNG/time-svgrepo-com.png',
    },
    {
      name: 'Generador de Calificaciones',
      description: 'Genera calificaciones para tus estudiantes.',
      link: ['/grades-generator'],
      icon: '/assets/grades.svg',
      // icon: '/assets/icons/education/PNG/score-svgrepo-com.png',
    },
    {
      name: 'Generador de Asistencia',
      description: 'Genera asistencia calculada para tus estudiantes.',
      link: ['/attendance-generator'],
      icon: '/assets/undraw_analysis_dq08.svg',
      // icon: '/assets/icons/education/PNG/vision-svgrepo-com.png',
      isNew: true,
    },
    {
      name: 'Conversaciones en Inglés',
      description: 'Diálogos en inglés por nivel.',
      link: ['/english-dialog-generator'],
      icon: '/assets/dialog.svg',
      // icon: '/assets/icons/education2/PNG/speech-bubble-svgrepo-com (2).png',
      isNew: true,
    },
    {
      name: 'Generador de Lecturas Guiadas',
      description: 'Genera actividades de lectura de cualquier nivel.',
      link: ['/guided-reading-generator'],
      icon: '/assets/icons/education/PNG/creativity-svgrepo-com.png',
    },
    {
      name: 'Generador de Listas de Cotejo',
      description: 'Genera listas de cotejo de forma rápida y fácil',
      link: ['/checklist-generator'],
      icon: '/assets/icons/education/PNG/creativity-svgrepo-com.png',
    },
    {
      name: 'Mis Secciones',
      description: 'Administra tus cursos y asignaturas',
      link: ['/sections'],
      icon: '/assets/undraw_educator_re_ju47.svg',
      // icon: '/assets/icons/education2/PNG/quiz-svgrepo-com.png',
    },
    {
      name: 'Registro Anecdótico',
      description: 'El registro anecdótico hecho fácil.',
      link: ['/log-registry-generator'],
      icon: '/assets/undraw_upload_image_re_svxx.svg',
      // icon: '/assets/icons/education/PNG/writing-svgrepo-com.png',
    },
    {
      name: 'Plantillas de Planificación',
      description: 'Plantillas funcionales para los tradicionales.',
      link: ['/planner-generator'],
      icon: '/assets/undraw_responsive_re_e1nn.svg',
      // icon: '/assets/icons/education2/PNG/book-svgrepo-com.png',
    },
    {
      name: 'Recursos Educativos',
      description: 'Almacenamiento y distribución de recursos educativos clasificados.',
      link: ['/resources'],
      icon: '/assets/library_books.svg',
      // icon: '/assets/icons/education/PNG/astronomical-svgrepo-com.png',
    },
    {
      name: 'Generador de Aspectos Trabajados',
      description: 'Aspectos trabajados para el registro.',
      link: ['/aspects-generator'],
      icon: '/assets/aspects.svg',
      // icon: '/assets/icons/education2/PNG/quiz-svgrepo-com.png',
    },
    {
      name: 'Generador de Guía de Observación',
      description: 'Elabora una guía de observación para tus actividades.',
      link: ["/observation-sheet"],
      icon: '/assets/checklist.svg',
      // icon: '/assets/icons/education/PNG/math-svgrepo-com.png',
    },
    {
      name: 'Generador de Rúbricas',
      description: 'Genera rúbricas para cualquier tema y nivel.',
      link: ["/rubric"],
      icon: '/assets/checklist.svg',
      // icon: '/assets/icons/education/PNG/math-svgrepo-com.png',
    },
    {
      name: 'Generador de Escala de Estimación',
      description: 'Escalas de estimación para evaluar.',
      link: ["/estimation-scale"],
      icon: '/assets/checklist.svg',
      // icon: '/assets/icons/education/PNG/math-svgrepo-com.png',
    },
    {
      name: 'Sistemas de Calificación',
      description: 'Informes detallados para cada necesidad.',
      link: ['/grading-systems'],
      icon: '/assets/undraw_portfolio_website_re_jsdd.svg',
      // icon: '/assets/icons/education2/PNG/fraction-svgrepo-com.png',
    },
    {
      name: 'Generador de Informes',
      description: 'Informes detallados para cada necesidad.',
      link: ['/reports'],
      icon: '/assets/undraw_data_processing_yrrv.svg',
      // icon: '/assets/icons/education/PNG/statistics-svgrepo-com.png',
    },
    {
      name: 'Gestion de Horario',
      description: 'Maneja tus horarios de clase',
      link: ['/schedules'],
      icon: '/assets/undraw_schedule_re_2vro(1).svg',
      // icon: '/assets/icons/education/PNG/writing-svgrepo-com.png',
    },
    {
      link: ['/formation'],
      name: 'Evaluación Formativa',
      icon: '/assets/learning.svg',
      // icon: '/assets/icons/education/PNG/mind-svgrepo-com.png',
      description: 'Herramientas interactivas para evaluar en tiempo real.'
    },
    {
      link: ['/diversity'],
      name: 'Adaptación a la Diversidad',
      icon: '/assets/inclusion.svg',
      // icon: '/assets/icons/education/PNG/certificate-svgrepo-com.png',
      description: 'Recursos para la enseñanza inclusiva.'
    },
    {
      link: ['/games'],
      name: 'Juegos Educativos',
      icon: '/assets/games.svg',
      // icon: '/assets/icons/education2/PNG/achivement-business-mission-svgrepo-com.png',
      description: 'Juegos educativos para hacer el aprendizaje más interactivo y divertido.'
    },
    {
      link: ['/communication'],
      name: 'Comunicación con Padres',
      icon: '/assets/forum.svg',
      // icon: '/assets/icons/education2/PNG/speech-bubble-svgrepo-com.png',
      description: 'Mensajería e informes automáticos a padres.'
    },
    {
      link: ['/tracking'],
      name: 'Seguimiento del Estudiante',
      icon: '/assets/grade.svg',
      // icon: '/assets/icons/education/PNG/discover-svgrepo-com.png',
      description: 'Graficos y estadísticas del rendimiento estudiantil. '
    },
    {
      link: ['/event-planning'],
      name: 'Eventos Escolares',
      icon: '/assets/celebration.svg',
      // icon: '/assets/icons/education/PNG/calendar-svgrepo-com.png',
      description: 'Planificación, promoción y seguimiento de eventos escolares.'
    },
    {
      link: ['/security'],
      name: 'Seguridad y Privacidad',
      icon: '/assets/security.svg',
      // icon: '/assets/icons/education/PNG/biology-svgrepo-com.png',
      description: 'Herramientas para gestionar la seguridad de datos.'
    },
    {
      link: ['/datacenter'],
      name: 'Centro de Datos',
      icon: '/assets/icons/education/PNG/school-svgrepo-com.png',
      // icon: '/assets/icons/education/PNG/school-svgrepo-com.png',
      description: 'Todo lo que necesitas para sentirte en control de tu salón de clases.'
    },
    {
      link: ['/reviews'],
      name: 'Encuestas y Retroalimentación',
      icon: '/assets/review.svg',
      // icon: '/assets/icons/education/PNG/question-and-answer-svgrepo-com.png',
      description: 'Recopilación de retroalimentación para mejorar la enseñanza.'
    },
    {
      name: 'Gestión de Tareas',
      description: 'Seguimiento de tareas y recordatorios automáticos.',
      link: ['/tasks'],
      icon: '/assets/checklist.svg',
      // icon: '/assets/icons/education/PNG/read-svgrepo-com.png',
    },
    {
      name: 'Generador de Horarios',
      description: 'Un simple generador de horarios de clase JEE',
      link: ['/schedule-generator'],
      icon: '/assets/icons/education/PNG/calendar-svgrepo-com.png'
    },
    {
      link: ['/collab'],
      name: 'Colaboración entre Maestros',
      icon: '/assets/groups.svg',
      // icon: '/assets/icons/education/PNG/chemical-svgrepo-com.png',
      description: 'Espacio de colaboración para compartir ideas y estrategias de enseñanza.'
    },
    {
      name: 'Ordena las Palabras',
      description: 'Genera palabras desordenadas para ordenar.',
      link: ['/word-scramble'],
      icon: '/assets/undraw_specs_re_546x.svg'
    },
    {
      name: 'Parea Sinónimos',
      description: 'Genera hojas de ejercicios para parear sinónimos.',
      link: ['/synonyms'],
      icon: '/assets/undraw_file_searching_re_3evy.svg'
    },
    {
      name: 'Parea Antónimos',
      description: 'Genera hojas de ejercicios para parear antónimos.',
      link: ['/antonyms'],
      icon: '/assets/undraw_file_searching_re_3evy.svg'
    },
    {
      name: 'Crucigramas',
      description: 'Genera crucigramas para tus alumnos.',
      link: ['/crosswords'],
      icon: '/assets/undraw_file_searching_re_3evy.svg'
    },
    {
      name: 'Sopas de Letras',
      description: 'Genera sopas de letras por niveles y respuestas.',
      link: ['/wordsearch'],
      icon: '/assets/undraw_file_searching_re_3evy.svg'
    },
    {
      name: 'Suma',
      description: 'Genera Hojas de suma con hoja de respuestas.',
      link: ['/addition'],
      icon: '/assets/undraw_new_entries_re_cffr.svg'
    },
    {
      name: 'Resta',
      description: 'Genera Hojas de resta con hoja de respuestas.',
      link: ['/subtraction'],
      icon: '/assets/undraw_new_entries_re_cffr.svg'
    },
    {
      name: 'Multiplicación',
      description: 'Genera Hojas de multiplicación con sus respuestas.',
      link: ['/multiplication'],
      icon: '/assets/undraw_new_entries_re_cffr.svg'
    },
    {
      name: 'División',
      description: 'Genera Hojas de división con hoja de respuestas.',
      link: ['/division'],
      icon: '/assets/undraw_new_entries_re_cffr.svg'
    },
    {
      name: 'Ejercicios Mixtos',
      description: 'Genera ejercicios mixtos de operaciones basicas.',
      link: ['/mixed-operations'],
      icon: '/assets/undraw_new_entries_re_cffr.svg'
    },
    {
      name: 'Ecuaciones',
      description: 'Ejercicios con ecuaciones',
      link: ['/equations'],
      icon: '/assets/undraw_new_entries_re_cffr.svg'
    },
    {
      name: 'Papel Cuadriculado',
      description: 'Genera Hojas cuadriculadas para geometría.',
      link: ['/graph-paper'],
      icon: '/assets/undraw_new_entries_re_cffr.svg'
    },
    {
      name: 'Recta Numérica',
      description: 'Genera Hojas de ejercicios con la recta numérica.',
      link: ['/number-line'],
      icon: '/assets/undraw_new_entries_re_cffr.svg'
    },
    {
      name: 'Planos Cartesianos',
      description: 'Genera Hojas con plantillas de planos cartesianos.',
      link: ['/cartesian-coordinates'],
      icon: '/assets/undraw_new_entries_re_cffr.svg'
    },
    {
      name: 'Sudoku',
      description: 'Genera Sudoku de diferentes niveles de dificultad y sus respuestas.',
      link: ['/sudoku'],
      icon: '/assets/undraw_game_day_ucx9.svg'
    },
    {
      name: 'Tablero de Ideas',
      description: 'Tienes una idea para nuestra próxima herramienta? Publícala aquí.',
      link: ['/ideas'],
      icon: '/assets/undraw_ideas_41b9.svg'
    },
  ];

  ngOnInit() {
    this.loadFavorites()
    this.userSettingsService.getSettings().subscribe(user => this.user = user);
  }

  isAFav(app: any) {
    return this.favorites.some(f => f.name == app.name);
  }

  markFavorite(event: any) {
    if (this.isAFav(event)) {
      this.unmarkFavorite(event);
    } else {
      this.favoritesService.create(event).subscribe({
        next: res => {
          this.loadFavorites();
        }
      })
    }
  }

  unmarkFavorite(event: any) {
    const favs = this.favorites.filter(f => f.name !== event.name);
    this.favoritesService.update(favs).subscribe({
      next: res => {
        this.loadFavorites();
      }
    })
  }

  get filteredApps() {
    return this.apps.filter(app => app.description.toLowerCase().includes(this.search.value.toLowerCase()) || app.name.toLowerCase().includes(this.search.value.toLowerCase()));
  }
}
