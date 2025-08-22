import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { AppEntry } from '../../core/interfaces/app-entry';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ReactiveFormsModule } from '@angular/forms';
import { AppTileComponent } from '../../shared/ui/app-tile.component';
import { UserSettingsService } from '../../core/services/user-settings.service';
import { UserSettings } from '../../core/interfaces/user-settings';
import { MatChipsModule } from '@angular/material/chips';

const planningTools: AppEntry[] = [
	{
		name: 'Unidades de Aprendizaje',
		description: 'Diseña unidades de aprendizaje, para ya.',
		link: ['/unit-plans'],
		categories: ['Planificación'],
		icon: '/assets/assistant.svg',
	},
	{
		name: 'Planes Diarios',
		description: 'Planes de clase en menos de 1 minuto.',
		link: ['/class-plans'],
		categories: ['Planificación'],
		icon: '/assets/undraw_real_time_sync_re_nky7.svg',
	},
	{
		name: 'Prácticas Deportivas',
		description: 'Obtén planes de entrenamiento detallados para tus clases',
		link: ['/sports-practice-generator'],
		categories: ['Actividades', 'Planificación'],
		icon: '/assets/undraw_track-and-field_i2au.svg',
	},
	{
		name: 'Generador de Ruta de Estudio',
		description: 'Planifica tu aprendizaje paso a paso',
		link: ['/study-path-generator'],
		categories: ['Actividades', 'Planificación'],
		icon: '/assets/undraw_studying_n5uj.svg',
	},
];

const activitiesTools: AppEntry[] = [
	{
		name: 'Conversaciones en Inglés',
		description: 'Diálogos en inglés por nivel.',
		link: ['/english-dialog-generator'],
		categories: ['Actividades'],
		icon: '/assets/dialog.svg',
		isNew: true,
	},
	{
		name: 'Generador de Lecturas Guiadas',
		description: 'Genera actividades de lectura de cualquier nivel.',
		link: ['/guided-reading-generator'],
		categories: ['Actividades', 'Hojas de Trabajo'],
		icon: '/assets/icons/education/PNG/creativity-svgrepo-com.png',
	},
	{
		name: 'Actividades para Efemérides',
		description: 'Actividades únicas para cada commemoración',
		link: ['/holiday-activity-generator'],
		categories: ['Actividades', 'Efemérides'],
		icon: '/assets/undraw_festivities_q090.svg',
	},
	{
		name: 'Ordena las Palabras',
		description: 'Genera palabras desordenadas para ordenar.',
		link: ['/word-scramble'],
		categories: ['Hojas de Trabajo'],
		icon: '/assets/undraw_specs_re_546x.svg',
	},
	{
		name: 'Generador de Sinónimos',
		description:
			'Crea listas de palabras y sus sinónimos contextualizados.',
		link: ['/synonyms'],
		categories: ['Hojas de Trabajo'],
		icon: '/assets/undraw_file_searching_re_3evy.svg',
	},
	{
		name: 'Generador de Antónimos',
		description:
			'Crea listas de palabras y sus antónimos contextualizados.',
		link: ['/antonyms'],
		categories: ['Hojas de Trabajo'],
		icon: '/assets/undraw_file_searching_re_3evy.svg',
	},
	{
		name: 'Crucigramas',
		description: 'Genera crucigramas para tus alumnos.',
		link: ['/crosswords'],
		categories: ['Hojas de Trabajo'],
		icon: '/assets/undraw_file_searching_re_3evy.svg',
	},
	{
		name: 'Sopas de Letras',
		description: 'Genera sopas de letras por niveles y respuestas.',
		link: ['/wordsearch'],
		categories: ['Hojas de Trabajo'],
		icon: '/assets/undraw_file_searching_re_3evy.svg',
	},
	{
		name: 'Suma',
		description: 'Genera Hojas de suma con hoja de respuestas.',
		link: ['/addition'],
		categories: ['Hojas de Trabajo'],
		icon: '/assets/undraw_new_entries_re_cffr.svg',
	},
	{
		name: 'Resta',
		description: 'Genera Hojas de resta con hoja de respuestas.',
		link: ['/subtraction'],
		categories: ['Hojas de Trabajo'],
		icon: '/assets/undraw_new_entries_re_cffr.svg',
	},
	{
		name: 'Multiplicación',
		description: 'Genera Hojas de multiplicación con sus respuestas.',
		link: ['/multiplication'],
		categories: ['Hojas de Trabajo'],
		icon: '/assets/undraw_new_entries_re_cffr.svg',
	},
	{
		name: 'División',
		description: 'Crea ejercicios de división personalizados',
		link: ['/division'],
		categories: ['Hojas de Trabajo'],
		icon: '/assets/undraw_new_entries_re_cffr.svg',
	},
	{
		name: 'Ejercicios Mixtos',
		description: 'Genera ejercicios mixtos de operaciones basicas.',
		link: ['/mixed-operations'],
		categories: ['Hojas de Trabajo'],
		icon: '/assets/undraw_new_entries_re_cffr.svg',
	},
	{
		name: 'Ecuaciones',
		description: 'Ejercicios con ecuaciones',
		link: ['/equations'],
		categories: ['Hojas de Trabajo'],
		icon: '/assets/undraw_new_entries_re_cffr.svg',
	},
	{
		name: 'Recta Numérica',
		description: 'Genera Hojas de ejercicios con la recta numérica.',
		link: ['/number-line'],
		categories: ['Hojas de Trabajo'],
		icon: '/assets/undraw_new_entries_re_cffr.svg',
	},
	{
		name: 'Planos Cartesianos',
		description: 'Genera Hojas con plantillas de planos cartesianos.',
		link: ['/cartesian-coordinates'],
		categories: ['Hojas de Trabajo'],
		icon: '/assets/undraw_new_entries_re_cffr.svg',
	},
	{
		name: 'Sudoku',
		description:
			'Genera Sudoku de diferentes niveles de dificultad y sus respuestas.',
		link: ['/sudoku'],
		categories: ['Hojas de Trabajo'],
		icon: '/assets/undraw_game_day_ucx9.svg',
	},
	{
		name: 'Reflexiones Diarias',
		description: 'Crea reflexiones personalizadas para tus estudiantes',
		link: ['/reflection-generator'],
		categories: ['Actividades'],
		icon: '/assets/undraw_creative-thinking_ruwx.svg',
	},
	{
		name: 'Rompehielos',
		description: 'Crea actividades dinámicas para iniciar tus clases',
		link: ['/icebreaker-generator'],
		categories: ['Actividades'],
		icon: '/assets/undraw_team-up_qeem.svg',
	},
	{
		name: 'Trabalenguas',
		description: 'Crea trabalenguas divertidos para tus clases',
		link: ['/tongue-twister-generator'],
		categories: ['Actividades'],
		icon: '/assets/undraw_things-to-say_f5mi.svg',
	},
	{
		name: 'Problemas Matemáticos',
		description: 'Crea problemas contextualizados para tus clases',
		link: ['/math-problem-generator'],
		categories: ['Actividades'],
		icon: '/assets/undraw_mathematics_hc2c.svg',
	},
];

const assessmentTools: AppEntry[] = [
	{
		name: 'Generador de Exámenes',
		description: 'Genera exámenes instantaneamente.',
		link: ['/test-generator'],
		categories: ['Instrumentos de Evaluación'],
		icon: '/assets/undraw_exams_d2tf.svg',
	},
	{
		link: ['/formation'],
		categories: ['Productividad', 'Evaluación'],
		name: 'Evaluación Formativa',
		icon: '/assets/learning.svg',
		description: 'Herramientas interactivas para evaluar en tiempo real.',
	},
	{
		name: 'Generador de Listas de Cotejo',
		description: 'Genera listas de cotejo de forma rápida y fácil',
		link: ['/checklist-generator'],
		categories: ['Evaluación'],
		icon: '/assets/undraw_check-boxes_ewf2.svg',
	},
	{
		name: 'Registro Anecdótico',
		description: 'El registro anecdótico hecho fácil.',
		link: ['/log-registry-generator'],
		categories: ['Registro', 'Productividad'],
		icon: '/assets/undraw_upload_image_re_svxx.svg',
	},
	{
		name: 'Generador de Guía de Observación',
		description: 'Elabora una guía de observación para tus actividades.',
		link: ['/observation-sheet'],
		categories: ['Evaluación', 'Instrumentos de Evaluación'],
		icon: '/assets/checklist.svg',
	},
	{
		name: 'Generador de Rúbricas',
		description: 'Genera rúbricas para cualquier tema y nivel.',
		link: ['/rubric-generator'],
		categories: ['Evaluación', 'Instrumentos de Evaluación'],
		icon: '/assets/checklist.svg',
	},
	{
		name: 'Generador de Escala de Estimación',
		description: 'Escalas de estimación para evaluar.',
		link: ['/estimation-scale'],
		categories: ['Evaluación', 'Instrumentos de Evaluación'],
		icon: '/assets/checklist.svg',
	},
	{
		name: 'Sistemas de Calificación',
		description: 'Informes detallados para cada necesidad.',
		link: ['/grading-systems'],
		categories: [
			'Planificación',
			'Instrumentos de Evaluación',
			'Calificación',
			'Evaluación',
		],
		icon: '/assets/undraw_portfolio_website_re_jsdd.svg',
	},
	{
		link: ['/reviews'],
		categories: ['Productividad'],
		name: 'Encuestas y Retroalimentación',
		icon: '/assets/review.svg',
		description:
			'Recopilación de retroalimentación para mejorar la enseñanza.',
	},
];

const registryTools = [
	{
		name: 'Calculadora de Promedios',
		description: 'Calcula promedios en un santiamén.',
		link: ['/average-calculator'],
		categories: ['Calculadora', 'Registro'],
		icon: '/assets/calculator.svg',
	},
	{
		name: 'Calculadora de Asistencias',
		description: 'La forma más fácil de calcular la asistencia.',
		link: ['/attendance-calculator'],
		categories: ['Calculadora', 'Registro'],
		icon: '/assets/attendance.svg',
	},
	{
		link: ['/attendance'],
		categories: ['Registro'],
		name: 'Control de Asistencia',
		icon: '/assets/attend.svg',
		description: 'Registra tablas de asistencia.',
	},
	{
		name: 'Generador de Calificaciones',
		description: 'Genera calificaciones para tus estudiantes.',
		link: ['/grades-generator'],
		categories: ['Productividad', 'Registro'],
		icon: '/assets/grades.svg',
	},
	{
		name: 'Generador de Asistencia',
		description: 'Genera asistencia calculada para tus estudiantes.',
		link: ['/attendance-generator'],
		categories: ['Productividad', 'Registro'],
		icon: '/assets/undraw_analysis_dq08.svg',
		isNew: true,
	},
	{
		name: 'Generador de Aspectos Trabajados',
		description: 'Aspectos trabajados para el registro.',
		link: ['/aspects-generator'],
		categories: ['Registro'],
		icon: '/assets/aspects.svg',
	},
];

const resourcesTools = [
	{
		name: 'Ganchos para la clase',
		description: 'Crea ideas atractivas para iniciar tus lecciones',
		link: ['/class-hook-generator'],
		categories: ['Actividades', 'Planificación'],
		icon: '/assets/undraw_sharing-knowledge_pu0e.svg',
	},
	{
		name: 'Generador de Cuentos',
		description: 'Crea cuentos originales adaptados a tus estudiantes',
		link: ['/story-generator'],
		categories: ['Actividades'],
		icon: '/assets/undraw_book-writer_ri5u.svg',
	},
	{
		name: 'Generador de Poesía',
		description: 'Crea poemas originales para inspirar a tus estudiantes',
		link: ['/poem-generator'],
		categories: ['Actividades'],
		icon: '/assets/undraw_writer_r7ca.svg',
	},
	{
		name: 'Generador de Fábulas',
		description: 'Crea fábulas con moralejas para tus clases',
		link: ['/fable-generator'],
		categories: ['Actividades'],
		icon: '/assets/undraw_refreshing-beverage_w8al.svg',
	},
	{
		name: 'Generador de Chistes',
		description: 'Crea chistes apropiados para tus estudiantes',
		link: ['/joke-generator'],
		categories: ['Actividades'],
		icon: '/assets/undraw_coffee_7r49.svg',
	},
	{
		name: 'Generador de Adivinanzas',
		description:
			'Crea adivinanzas ingeniosas para desafiar a tus estudiantes',
		link: ['/riddle-generator'],
		categories: ['Actividades'],
		icon: '/assets/undraw_body-text_b6qq.svg',
	},
	{
		name: 'Generador de Curiosidades',
		description: 'Despierta el interés con datos sorprendentes',
		link: ['/fun-fact-generator'],
		categories: ['Actividades'],
		icon: '/assets/undraw_startled_ez5h.svg',
	},
	{
		name: 'Generador de Refranes',
		description: 'Encuentra refranes y su significado para tus clases',
		link: ['/proverb-generator'],
		categories: ['Actividades'],
		icon: '/assets/undraw_blooming_g9e9.svg',
	},
	{
		name: 'Generador de Canciones',
		description: 'Crea letras de canciones originales para tus actividades',
		link: ['/song-generator'],
		categories: ['Actividades'],
		icon: '/assets/undraw_compose-music_9403.svg',
	},
	{
		name: 'Generador de Artículo Expositivo',
		description: 'Crea ejemplos de artículos expositivos para tus clases',
		link: ['/expository-article-generator'],
		categories: ['Actividades'],
		icon: '/assets/undraw_sharing-articles_agyr.svg',
	},
	{
		name: 'Papel Cuadriculado',
		description: 'Genera Hojas cuadriculadas para geometría.',
		link: ['/graph-paper'],
		categories: ['Hojas de Trabajo'],
		icon: '/assets/undraw_new_entries_re_cffr.svg',
	},
	{
		link: ['/games'],
		categories: ['Juegos'],
		name: 'Juegos Educativos',
		icon: '/assets/games.svg',
		description:
			'Juegos educativos para hacer el aprendizaje más interactivo y divertido.',
	},
	{
		name: 'Seguimiento del Estudiante',
		description: 'Estadísticas del rendimiento estudiantil.',
		link: ['/tracking'],
		categories: ['Evaluación'],
		icon: '/assets/grade.svg',
	},
];

const supportTools = [
	{
		name: 'Asistente de IA',
		description: 'Obtén ayuda, ideas y sugerencias adaptadas a ti.',
		link: ['/ai-assistant'],
		categories: ['Productividad'],
		icon: '/assets/machine.svg',
	},
	{
		name: 'Lista de Pendientes',
		description: 'Organiza mejor tu jornada con una lista de pendientes.',
		link: ['/todos'],
		categories: ['Productividad'],
		icon: '/assets/undraw_to_do_list_re_9nt7 (1).svg',
	},
	{
		name: 'Tablero de Ideas',
		description:
			'Tienes una idea para nuestra próxima herramienta? Publícala aquí.',
		link: ['/ideas'],
		categories: ['Productividad'],
		icon: '/assets/undraw_ideas_41b9.svg',
	},
	{
		name: 'Recursos Educativos',
		description:
			'Almacenamiento y distribución de recursos educativos clasificados.',
		link: ['/resources'],
		categories: ['Recursos', 'Plantillas'],
		icon: '/assets/library_books.svg',
	},
	// {
	// 	name: 'Gestion de Horario',
	// 	description: 'Maneja tus horarios de clase',
	// 	link: ['/schedules'],
	// 	categories: ['Productividad'],
	// 	icon: '/assets/undraw_schedule_re_2vro(1).svg',
	// },
	{
		link: ['/diversity'],
		categories: ['Diversidad'],
		name: 'Adaptación a la Diversidad',
		icon: '/assets/inclusion.svg',
		description: 'Recursos para la enseñanza inclusiva.',
	},
	// {
	// 	name: 'Generador de Horarios',
	// 	description: 'Un simple generador de horarios de clase JEE',
	// 	link: ['/schedule-generator'],
	// 	categories: ['Productividad'],
	// 	icon: '/assets/icons/education/PNG/calendar-svgrepo-com.png',
	// },
	{
		name: 'Plantillas de Planificación',
		description: 'Plantillas funcionales para los tradicionales.',
		link: ['/planner-generator'],
		categories: ['Plantillas', 'Planificación'],
		icon: '/assets/undraw_responsive_re_e1nn.svg',
	},
];

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
		ReactiveFormsModule,
		MatChipsModule,
	],
	templateUrl: './home.component.html',
	styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
	private userSettingsService = inject(UserSettingsService);
	user: UserSettings | null = null;
	categories: string[] = [];

	apps: { category: string, tools: AppEntry[] }[] = [
		{ category: 'Planificación', tools: planningTools },
		{ category: 'Recursos', tools: resourcesTools },
		{ category: 'Evaluación', tools: assessmentTools },
		{ category: 'Registro', tools: registryTools },
		{ category: 'Actividades', tools: activitiesTools },
		{ category: 'Apoyo y Soporte', tools: supportTools },
	];

	ngOnInit() {
		this.userSettingsService
			.getSettings()
			.subscribe((user) => (this.user = user));
	}
}
