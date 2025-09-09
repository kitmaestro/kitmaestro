import { AppEntry } from "../core/interfaces/app-entry";

export const planningTools: AppEntry[] = [
	{
		name: 'Plan Anual',
		description: 'Diseña unidades de aprendizaje, para ya.',
		link: ['/annual-plans'],
		categories: ['Planificación'],
		icon: '/assets/undraw_scrum-board_uqku.svg',
		tier: 3,
	},
	{
		name: 'Unidades de Aprendizaje',
		description: 'Diseña unidades de aprendizaje, para ya.',
		link: ['/unit-plans'],
		categories: ['Planificación'],
		icon: '/assets/assistant.svg',
		tier: 1,
	},
	{
		name: 'Planes Diarios',
		description: 'Planes de clase en menos de 1 minuto.',
		link: ['/class-plans'],
		categories: ['Planificación'],
		icon: '/assets/undraw_real_time_sync_re_nky7.svg',
		tier: 1,
	},
	{
		name: 'Planes Diario Multigrado',
		description: 'Planes de clase para multigrado.',
		link: ['/emi-class-plans'],
		categories: ['Planificación'],
		icon: '/assets/undraw_educator_6dgp.svg',
		tier: 2,
	},
	{
		name: 'Unidades Multigrado',
		description: 'Unidades de aprendizaje para multigrado.',
		link: ['/emi-unit-plans'],
		categories: ['Planificación'],
		icon: '/assets/undraw_working-together_r43a.svg',
		tier: 2,
	},
	{
		name: 'Plan de Unidad Pre Primario',
		description: 'Unidades de aprendizaje para prescolar.',
		link: ['/kinder-unit-plans'],
		categories: ['Planificación'],
		icon: '/assets/undraw_children_e6ln.svg',
		tier: 2,
	},
	{
		name: 'Planes Diarios en Lote',
		description: 'Genera todos los planes de clase de una unidad.',
		link: ['/class-plans/batch'],
		categories: ['Planificación'],
		icon: '/assets/undraw_chat-with-ai_ir62.svg',
		tier: 3,
	},
	{
		name: 'Prácticas Deportivas',
		description: 'Obtén planes de entrenamiento detallados para tus clases',
		link: ['/sports-practice-generator'],
		categories: ['Actividades', 'Planificación'],
		icon: '/assets/undraw_track-and-field_i2au.svg',
		tier: 2,
	},
	{
		name: 'Generador de Ruta de Estudio',
		description: 'Planifica tu aprendizaje paso a paso',
		link: ['/study-path-generator'],
		categories: ['Actividades', 'Planificación'],
		icon: '/assets/undraw_studying_n5uj.svg',
		tier: 3,
	},
];

export const activitiesTools: AppEntry[] = [
	{
		name: 'Conversaciones en Inglés',
		description: 'Diálogos en inglés por nivel.',
		link: ['/english-dialog-generator'],
		categories: ['Actividades'],
		icon: '/assets/dialog.svg',
		isNew: true,
		tier: 1,
	},
	{
		name: 'Generador de Lecturas Guiadas',
		description: 'Genera actividades de lectura de cualquier nivel.',
		link: ['/guided-reading-generator'],
		categories: ['Actividades', 'Hojas de Trabajo'],
		icon: '/assets/icons/education/PNG/creativity-svgrepo-com.png',
		tier: 1,
	},
	{
		name: 'Actividades para Efemérides',
		description: 'Actividades únicas para cada commemoración',
		link: ['/holiday-activity-generator'],
		categories: ['Actividades', 'Efemérides'],
		icon: '/assets/undraw_festivities_q090.svg',
		tier: 1,
	},
	{
		name: 'Ordena las Palabras',
		description: 'Genera palabras desordenadas para ordenar.',
		link: ['/word-scramble'],
		categories: ['Hojas de Trabajo'],
		icon: '/assets/undraw_specs_re_546x.svg',
		tier: 1,
	},
	{
		name: 'Generador de Sinónimos',
		description:
			'Crea listas de palabras y sus sinónimos contextualizados.',
		link: ['/synonyms'],
		categories: ['Hojas de Trabajo'],
		icon: '/assets/undraw_file_searching_re_3evy.svg',
		tier: 1,
	},
	{
		name: 'Generador de Antónimos',
		description:
			'Crea listas de palabras y sus antónimos contextualizados.',
		link: ['/antonyms'],
		categories: ['Hojas de Trabajo'],
		icon: '/assets/undraw_file_searching_re_3evy.svg',
		tier: 1,
	},
	{
		name: 'Crucigramas',
		description: 'Genera crucigramas para tus alumnos.',
		link: ['/crosswords'],
		categories: ['Hojas de Trabajo'],
		icon: '/assets/undraw_file_searching_re_3evy.svg',
		tier: 1,
	},
	{
		name: 'Sopas de Letras',
		description: 'Genera sopas de letras por niveles y respuestas.',
		link: ['/wordsearch'],
		categories: ['Hojas de Trabajo'],
		icon: '/assets/undraw_file_searching_re_3evy.svg',
		tier: 1,
	},
	{
		name: 'Suma',
		description: 'Genera Hojas de suma con hoja de respuestas.',
		link: ['/addition'],
		categories: ['Hojas de Trabajo'],
		icon: '/assets/undraw_new_entries_re_cffr.svg',
		tier: 1,
	},
	{
		name: 'Resta',
		description: 'Genera Hojas de resta con hoja de respuestas.',
		link: ['/subtraction'],
		categories: ['Hojas de Trabajo'],
		icon: '/assets/undraw_new_entries_re_cffr.svg',
		tier: 1,
	},
	{
		name: 'Multiplicación',
		description: 'Genera Hojas de multiplicación con sus respuestas.',
		link: ['/multiplication'],
		categories: ['Hojas de Trabajo'],
		icon: '/assets/undraw_new_entries_re_cffr.svg',
		tier: 1,
	},
	{
		name: 'División',
		description: 'Crea ejercicios de división personalizados',
		link: ['/division'],
		categories: ['Hojas de Trabajo'],
		icon: '/assets/undraw_new_entries_re_cffr.svg',
		tier: 1,
	},
	{
		name: 'Ejercicios Mixtos',
		description: 'Genera ejercicios mixtos de operaciones basicas.',
		link: ['/mixed-operations'],
		categories: ['Hojas de Trabajo'],
		icon: '/assets/undraw_new_entries_re_cffr.svg',
		tier: 1,
	},
	{
		name: 'Ecuaciones',
		description: 'Ejercicios con ecuaciones',
		link: ['/equations'],
		categories: ['Hojas de Trabajo'],
		icon: '/assets/undraw_new_entries_re_cffr.svg',
		tier: 1,
	},
	{
		name: 'Recta Numérica',
		description: 'Genera Hojas de ejercicios con la recta numérica.',
		link: ['/number-line'],
		categories: ['Hojas de Trabajo'],
		icon: '/assets/undraw_new_entries_re_cffr.svg',
		tier: 1,
	},
	{
		name: 'Planos Cartesianos',
		description: 'Genera Hojas con plantillas de planos cartesianos.',
		link: ['/cartesian-coordinates'],
		categories: ['Hojas de Trabajo'],
		icon: '/assets/undraw_new_entries_re_cffr.svg',
		tier: 1,
	},
	{
		name: 'Sudoku',
		description:
			'Genera Sudoku de diferentes niveles de dificultad y sus respuestas.',
		link: ['/sudoku'],
		categories: ['Hojas de Trabajo'],
		icon: '/assets/undraw_game_day_ucx9.svg',
		tier: 1,
	},
	{
		name: 'Reflexiones Diarias',
		description: 'Crea reflexiones personalizadas para tus estudiantes',
		link: ['/reflection-generator'],
		categories: ['Actividades'],
		icon: '/assets/undraw_creative-thinking_ruwx.svg',
		tier: 1,
	},
	{
		name: 'Rompehielos',
		description: 'Crea actividades dinámicas para iniciar tus clases',
		link: ['/icebreaker-generator'],
		categories: ['Actividades'],
		icon: '/assets/undraw_team-up_qeem.svg',
		tier: 1,
	},
	{
		name: 'Trabalenguas',
		description: 'Crea trabalenguas divertidos para tus clases',
		link: ['/tongue-twister-generator'],
		categories: ['Actividades'],
		icon: '/assets/undraw_things-to-say_f5mi.svg',
		tier: 1,
	},
	{
		name: 'Problemas Matemáticos',
		description: 'Crea problemas contextualizados para tus clases',
		link: ['/math-problem-generator'],
		categories: ['Actividades'],
		icon: '/assets/undraw_mathematics_hc2c.svg',
		tier: 1,
	},
];

export const assessmentTools: AppEntry[] = [
	{
		name: 'Generador de Exámenes',
		description: 'Genera exámenes instantaneamente.',
		link: ['/test-generator'],
		categories: ['Instrumentos de Evaluación'],
		icon: '/assets/undraw_exams_d2tf.svg',
		tier: 2,
	},
	{
		name: 'Evaluación Diagnóstica',
		description: 'Genera Pruebas Diagnosticas Facilmente.',
		link: ['/diagnostic-evaluation-generator'],
		categories: ['Instrumentos de Evaluación'],
		icon: '/assets/undraw_personal-goals_f9bb.svg',
		tier: 3,
	},
	// {
	// 	link: ['/formation'],
	// 	categories: ['Productividad', 'Evaluación'],
	// 	name: 'Evaluación Formativa',
	// 	icon: '/assets/learning.svg',
	// 	description: 'Herramientas interactivas para evaluar en tiempo real.',
	// 	tier: 4,
	// },
	{
		name: 'Generador de Listas de Cotejo',
		description: 'Genera listas de cotejo de forma rápida y fácil',
		link: ['/checklist-generator'],
		categories: ['Evaluación'],
		icon: '/assets/undraw_check-boxes_ewf2.svg',
		tier: 2,
	},
	{
		name: 'Registro Anecdótico',
		description: 'El registro anecdótico hecho fácil.',
		link: ['/log-registry-generator'],
		categories: ['Registro', 'Productividad'],
		icon: '/assets/undraw_upload_image_re_svxx.svg',
		tier: 2,
	},
	{
		name: 'Generador de Guía de Observación',
		description: 'Elabora una guía de observación para tus actividades.',
		link: ['/observation-sheet'],
		categories: ['Evaluación', 'Instrumentos de Evaluación'],
		icon: '/assets/checklist.svg',
		tier: 1,
	},
	{
		name: 'Generador de Rúbricas',
		description: 'Genera rúbricas para cualquier tema y nivel.',
		link: ['/rubric-generator'],
		categories: ['Evaluación', 'Instrumentos de Evaluación'],
		icon: '/assets/checklist.svg',
		tier: 2,
	},
	{
		name: 'Generador de Escala de Estimación',
		description: 'Escalas de estimación para evaluar.',
		link: ['/estimation-scale'],
		categories: ['Evaluación', 'Instrumentos de Evaluación'],
		icon: '/assets/checklist.svg',
		tier: 1,
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
		tier: 1,
	},
	{
		link: ['/reviews'],
		categories: ['Productividad'],
		name: 'Encuestas y Retroalimentación',
		icon: '/assets/review.svg',
		description:
			'Recopilación de retroalimentación para mejorar la enseñanza.',
		tier: 5,
	},
];

export const registryTools = [
	{
		name: 'Calculadora de Promedios',
		description: 'Calcula promedios en un santiamén.',
		link: ['/average-calculator'],
		categories: ['Calculadora', 'Registro'],
		icon: '/assets/calculator.svg',
		tier: 1,
	},
	{
		name: 'Calculadora de Asistencias',
		description: 'La forma más fácil de calcular la asistencia.',
		link: ['/attendance-calculator'],
		categories: ['Calculadora', 'Registro'],
		icon: '/assets/attendance.svg',
		tier: 1,
	},
	{
		link: ['/attendance'],
		categories: ['Registro'],
		name: 'Control de Asistencia',
		icon: '/assets/attend.svg',
		description: 'Registra tablas de asistencia.',
		tier: 1,
	},
	{
		name: 'Generador de Calificaciones',
		description: 'Genera calificaciones para tus estudiantes.',
		link: ['/grades-generator'],
		categories: ['Productividad', 'Registro'],
		icon: '/assets/grades.svg',
		tier: 2,
	},
	{
		name: 'Generador de Asistencia',
		description: 'Genera asistencia calculada para tus estudiantes.',
		link: ['/attendance-generator'],
		categories: ['Productividad', 'Registro'],
		icon: '/assets/undraw_analysis_dq08.svg',
		isNew: true,
		tier: 2,
	},
	{
		name: 'Generador de Aspectos Trabajados',
		description: 'Aspectos trabajados para el registro.',
		link: ['/aspects-generator'],
		categories: ['Registro'],
		icon: '/assets/aspects.svg',
		tier: 1,
	},
];

export const resourcesTools = [
	{
		name: 'Ganchos para la clase',
		description: 'Crea ideas atractivas para iniciar tus lecciones',
		link: ['/class-hook-generator'],
		categories: ['Actividades', 'Planificación'],
		icon: '/assets/undraw_sharing-knowledge_pu0e.svg',
		tier: 2,
	},
	{
		name: 'Generador de Cuentos',
		description: 'Crea cuentos originales adaptados a tus estudiantes',
		link: ['/story-generator'],
		categories: ['Actividades'],
		icon: '/assets/undraw_book-writer_ri5u.svg',
		tier: 3,
	},
	{
		name: 'Generador de Poesía',
		description: 'Crea poemas originales para inspirar a tus estudiantes',
		link: ['/poem-generator'],
		categories: ['Actividades'],
		icon: '/assets/undraw_writer_r7ca.svg',
		tier: 3,
	},
	{
		name: 'Generador de Fábulas',
		description: 'Crea fábulas con moralejas para tus clases',
		link: ['/fable-generator'],
		categories: ['Actividades'],
		icon: '/assets/undraw_refreshing-beverage_w8al.svg',
		tier: 3,
	},
	{
		name: 'Generador de Chistes',
		description: 'Crea chistes apropiados para tus estudiantes',
		link: ['/joke-generator'],
		categories: ['Actividades'],
		icon: '/assets/undraw_coffee_7r49.svg',
		tier: 3,
	},
	{
		name: 'Generador de Adivinanzas',
		description:
			'Crea adivinanzas ingeniosas para desafiar a tus estudiantes',
		link: ['/riddle-generator'],
		categories: ['Actividades'],
		icon: '/assets/undraw_body-text_b6qq.svg',
		tier: 3,
	},
	{
		name: 'Generador de Curiosidades',
		description: 'Despierta el interés con datos sorprendentes',
		link: ['/fun-fact-generator'],
		categories: ['Actividades'],
		icon: '/assets/undraw_startled_ez5h.svg',
		tier: 3,
	},
	{
		name: 'Generador de Refranes',
		description: 'Encuentra refranes y su significado para tus clases',
		link: ['/proverb-generator'],
		categories: ['Actividades'],
		icon: '/assets/undraw_blooming_g9e9.svg',
		tier: 3,
	},
	{
		name: 'Generador de Canciones',
		description: 'Crea letras de canciones originales para tus actividades',
		link: ['/song-generator'],
		categories: ['Actividades'],
		icon: '/assets/undraw_compose-music_9403.svg',
		tier: 3,
	},
	{
		name: 'Generador de Artículo Expositivo',
		description: 'Crea ejemplos de artículos expositivos para tus clases',
		link: ['/expository-article-generator'],
		categories: ['Actividades'],
		icon: '/assets/undraw_sharing-articles_agyr.svg',
		tier: 3,
	},
	{
		name: 'Papel Cuadriculado',
		description: 'Genera Hojas cuadriculadas para geometría.',
		link: ['/graph-paper'],
		categories: ['Hojas de Trabajo'],
		icon: '/assets/undraw_new_entries_re_cffr.svg',
		tier: 3,
	},
	{
		link: ['/games'],
		categories: ['Juegos'],
		name: 'Juegos Educativos',
		icon: '/assets/games.svg',
		description:
			'Juegos educativos para hacer el aprendizaje más interactivo y divertido.',
		tier: 4,
	},
	{
		name: 'Seguimiento del Estudiante',
		description: 'Estadísticas del rendimiento estudiantil.',
		link: ['/tracking'],
		categories: ['Evaluación'],
		icon: '/assets/grade.svg',
		tier: 4,
	},
];

export const supportTools = [
	{
		name: 'Asistente de IA',
		description: 'Obtén ayuda, ideas y sugerencias adaptadas a ti.',
		link: ['/ai-assistant'],
		categories: ['Productividad'],
		icon: '/assets/machine.svg',
		tier: 1,
	},
	{
		name: 'Lista de Pendientes',
		description: 'Organiza mejor tu jornada con una lista de pendientes.',
		link: ['/todos'],
		categories: ['Productividad'],
		icon: '/assets/undraw_to_do_list_re_9nt7 (1).svg',
		tier: 1,
	},
	{
		name: 'Tablero de Ideas',
		description:
			'Tienes una idea para nuestra próxima herramienta? Publícala aquí.',
		link: ['/ideas'],
		categories: ['Productividad'],
		icon: '/assets/undraw_ideas_41b9.svg',
		tier: 2,
	},
	{
		name: 'Recursos Educativos',
		description:
			'Almacenamiento y distribución de recursos educativos clasificados.',
		link: ['/resources'],
		categories: ['Recursos', 'Plantillas'],
		icon: '/assets/library_books.svg',
		tier: 1,
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
		tier: 1,
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
		tier: 1,
	},
];

export const mainThemeCategories: string[] = [
	'Salud y Bienestar',
	'Desarrollo Sostenible',
	'Desarrollo Personal y Profesional',
	'Alfabetización Imprescindible',
	'Ciudadanía y Convivencia',
];

export const schoolLevels: string[] = ['Primaria', 'Secundaria'];

export const schoolYears = [
	'Primero',
	'Segundo',
	'Tercero',
	'Cuarto',
	'Quinto',
	'Sexto',
];

export const classroomProblems = [
	'Falta de disciplina',
	'Bullying',
	'Ausentismo escolar',
	'Falta de motivación',
	'Problemas de atención',
	'Déficit de recursos educativos',
	'Falta de apoyo familiar',
	'Violencia en el hogar',
	'Problemas de alimentación',
	'Dificultades de aprendizaje',
	'Problemas de lenguaje',
	'Falta de materiales didácticos',
	'Pobreza',
	'Acceso limitado a tecnología',
	'Problemas de salud',
	'Desigualdad de género',
	'Discriminación',
	'Problemas emocionales',
	'Estrés escolar',
	'Falta de higiene',
	'Inseguridad escolar',
	'Drogadicción',
	'Embarazos adolescentes',
	'Falta de infraestructura',
	'Falta de capacitación docente',
	'Falta de recursos bibliográficos',
	'Falta de personal de apoyo',
	'Problemas de transporte',
	'Desnutrición',
	'Problemas de convivencia',
	'Violencia escolar',
	'Falta de evaluación adecuada',
	'Falta de incentivos educativos',
	'Problemas de identidad cultural',
	'Falta de participación de los padres',
	'Sobrecarga curricular',
	'Problemas de clima escolar',
	'Problemas de adaptación',
	'Problemas de comunicación',
	'Problemas de socialización',
	'Falta de espacios recreativos',
	'Problemas de integración',
	'Deserción escolar',
	'Problemas de autoestima',
	'Problemas económicos',
	'Desinterés en los estudios',
	'Falta de orientación vocacional',
	'Problemas de seguridad',
	'Problemas de iluminación',
	'Problemas de ventilación',
	'Problemas de acceso al agua',
	'Falta de conexión a Internet',
	'Problemas de acoso sexual',
	'Falta de baños adecuados',
	'Problemas de higiene menstrual',
	'Problemas de transporte público',
	'Falta de actividades extracurriculares',
	'Problemas de nutrición',
	'Violencia de pandillas',
	'Problemas de acoso cibernético',
	'Falta de programas de apoyo psicológico',
	'Problemas de accesibilidad para discapacitados',
	'Problemas de corrupción en la administración escolar',
	'Falta de oportunidades de formación profesional',
	'Problemas de contaminación',
	'Falta de programas de reciclaje',
	'Problemas de mantenimiento de la infraestructura',
	'Falta de participación estudiantil',
	'Problemas de acceso a bibliotecas',
	'Problemas de calidad del agua',
	'Falta de personal médico en escuelas',
	'Problemas de abuso infantil',
	'Falta de programas de educación sexual',
	'Problemas de acceso a medicamentos',
	'Falta de recursos para estudiantes con necesidades especiales',
	'Problemas de violencia doméstica',
	'Falta de programas de educación ambiental',
];

export const schoolEnvironments = [
	'Salón de clases',
	'Patio',
	'Cancha',
	'Polideportivo',
	'Biblioteca',
	'Laboratorio de ciencias',
	'Laboratorio de computación',
	'Gimnasio',
	'Auditorio',
	'Sala de música',
	'Sala de arte',
	'Cafetería',
	'Sala de lectura',
	'Sala de audiovisuales',
	'Huerto escolar',
	'Taller de tecnología',
	'Taller de manualidades',
	'Sala de reuniones',
	'Sala de profesores',
	'Área de juegos',
	'Sala de teatro',
	'Centro de recursos',
	'Sala de idiomas',
	'Piscina',
	'Zona de estudio al aire libre',
	'Sala de orientación',
	'Área de recreo',
	'Salón multiusos',
	'Pabellón deportivo',
	'Jardín escolar',
	'Área de meditación',
	'Sala de debates',
	'Laboratorio de física',
	'Laboratorio de química',
	'Laboratorio de biología',
	'Centro de innovación',
	'Espacios colaborativos',
	'Estudio de grabación',
	'Sala de robótica',
	'Área de descanso',
	'Sala de juegos educativos',
	'Espacio maker',
	'Plaza cívica',
	'Sala de exposición',
	'Taller de costura',
	'Taller de carpintería',
	'Sala de primeros auxilios',
	'Aula virtual',
	'Centro de emprendimiento',
	'Sala de proyecciones',
	'Sala de psicología',
	'Área de naturaleza',
];

export const classroomResources = [
	'Abaco',
	'Atlas',
	'Biblias',
	'Diccionarios',
	'Equipo deportivo',
	'Figuras geometricas',
	'Foami',
	'Fraccionario',
	'Lecciones en audio',
	'Material concreto',
	'Balanza',
	'Bloques de dienes',
	'Bocina',
	'Cajas de carton',
	'Calculadoras',
	'Caligrafia',
	'Carpetas/Portafolios',
	'Cartulinas',
	'Cinta metrica',
	'Compas',
	'Cronometro',
	'Cuadernos de ejercicios',
	'Cuadernos',
	'Cuentos infantiles',
	'Escala de estimacion',
	'Fichas didácticas',
	'Hojas blancas',
	'Hojas de colores',
	'Instrumentos musicales',
	'Internet',
	'Juegos educativos',
	'Laboratorio de ciencias',
	'Laminas',
	'Lapices de colores',
	'Lápices y bolígrafos',
	'Laptop / Computadora',
	'Libros de texto',
	'Lista de cotejo',
	'Lupa',
	'Mapas y globos terráqueos',
	'Material de lectura',
	'Microscopio',
	'Modelos anatómicos',
	'Módulos en línea',
	'Notas adhesivas',
	'Pantalla digital (PDI)',
	'Papel cuadriculado',
	'Pegamento',
	'Pelotas',
	'Pinceles',
	'Pizarra',
	'Pizarra blanca',
	'Pizarra digital',
	'Plastilina o masilla',
	'Presentaciones en PowerPoint',
	'Proyector',
	'Prueba escrita',
	'Reglas',
	'Recursos digitales',
	'Rompecabezas',
	'Rubrica',
	'Sopa de letras',
	'Software Educativo',
	'Tablets',
	'Tangram',
	'Tijeras',
	'Transportador',
	'Videos',
];

export const generateActivitySequencePrompt = `Quiero impartir estos contenidos en classroom_year de classroom_level en unit_duration semanas (3 sesiones de 45 minutos por semana):
content_list

Los recursos que tengo disponibles son estos:

- resource_list

En mi estilo de ensenanza, por lo general aplico el teaching_style con enfoque en theme_axis

Elabora una lista de actividades a realizar, enfocadas en el desarrollo de competencias y a la vez cumpliendo con la linea de desarrollo de la situacion de aprendizaje, categorizadas como actividades de aprendizaje (como las actividades propias de los alumnos), actividades de enseñanza (aquellas propias del docente) y actividades de evaluacion.
Cada actividad de enseñanza, debe ser una oracion completa puede iniciar con 'El docente', 'El maestro', o 'El profesor'. Esta representa una sesion de clase, de manera que, debe decir, de manera general, cuales son las principales o mas grandes actividades que se haran en la clase.
Cada actividad de aprendizaje, debe ser una oracion completa que inicie con 'Los estudiantes', 'Los alumnos', 'El alumnado', o 'El estudiantado' equivalente a la respuesta o consecuencia de las acciones del docente.
Las actividades deben seguir el patron de los contenidos procedimentales y reflejar el desarrollo y adquisicion de las competencias y abordado de los contenidos, en general, primero se recuperan los conocimientos previos, luego se introduce el contenido nuevo, dividiendolo en porciones apropiadas para el nivel y grado de los estudiantes, luego se practican durante varias clases con diferentes estrategias para profundizar y afianzar, se evaluan los resultados, opcionalmente se agrega complejidad y se lleva a cabo una actividad de cierre que no tiene por que ser evaluativa.
Las actividades de evaluacion deben incluir evaluacion formativa y sumativa. Se busca, ademas, que los estudiantes vayan pasando por las etapas cognitivas de la taxonomia de Bloom al pasar de las clases, de manera que primero hay que recordar y entender el concepto, luego aplicarlo y analizarlo y por ultimo evaluar y crear algo que, de preferencia, sea tangible.
Asignaturas a impartir (necesito actividades de las categorias mencionadas para cada asignatura mencionada):
- subject_list

Tu respuesta debe ser json valido con esta interfaz:
{
  teacher_activities: {
    subject: subject_type,
    activities: string[],
  }[],
  student_activities: {
    subject: subject_type,
    activities: string[],
  }[],
  evaluation_activities: {
    subject: subject_type,
    activities: string[],
  }[],
  instruments: string[] // nombre de las tecnicas e instrumentos de evaluacion a utilizar, incluyendo, de ser posible, la metacognicion (que y como se aprendio lo que se aprendio y como se puede aplicar)
  resources: string[], // los recursos que voy a necesitar para toda la unidad
}
Es MUY IMPORTANTE que las actividades de evaluación digan EXPLICITAMENTE los instrumentos y las tecnicas que se van a utilizar y estos deben estar presentes en el array de instrumentos. Es decir que los instrumentos y tecnicas listadas en el array de instrumentos deben estar presentes si o si en las actividades de enseñanza, aprendizaje y evaluacion que correspondan.
un ejemplo de la lista de actividades seria esta:
{
  teacher_activities: {
    subject: 'LENGUA_ESPANOLA',
    activities: [
      'El docente recupera los conocimientos previos de los alumnos sobre la carta e introduce la funcion y estructura basica de la carta de disculpas', // nota como solo esta entrada es una sesion completa
      'El maestro muestra algunas cartas y otros textos para que los alumnos identifiquen las cartas, explica en detalle la estructura de la carta y las formulas para cada parte',
      'El maestro dirige a los alumnos al leer y analizar cartas y corrige los errores que contienen',
      'El docente dirige una "redaccion" oral de cartas de disculpas',
      'El docente organiza y dirige un dialogo socratico sobre la carta de disculpas y asigna un cuestionario',
      'El profesor explica el procedimiento para redactar una carta, indica como hacer un borrador y asigna una exposicion',
      'El profesor dirige un debate/socializacion sobre la carta
      ...
    ],
  }[],
  student_activities: {
    subject: 'LENGUA_ESPANOLA',
    activities: [
      'Los alumnos expresan sus conocimientos previos sobre la carta presentando ejemplos',
      'Los alumnos diferencian cartas de otros textos',
      'Los estudiantes leen, analizan y corrigen muestras de cartas',
      'Los estudiantes se juntan en grupos y 'elaboran' cartas de manera oral tomando apuntes o creando un mapa mental',
      'Los alumnos participan de un dialogo socratico en clase',
      ...
    ],
  }[],
  evaluation_activities: {
    subject: 'LENGUA_ESPANOLA',
    activities: [
      'Recuperacion de saberes y esperiencias previas sobre las cartas',
      'Lectura e interpretacion de cartas',
      'Redaccion de borradores de cartas de permiso',
      'Metacognición: ¿Qué aprendimos hoy? ¿Cómo lo aprendimos? ¿Cómo podemos mejorar?',
      ...
    ],
  }[],
  instruments: [
    'Metacognicion: que se aprendio, como lo aprendio y como lo va a aplicar en el futuro',
    'Diario reflexivo',
    'Guia de observacion',
    'Rubrica',
    'Portafolios',
    ...
  ],
  resources: [
    'Pizarra',
    'Marcadores/tiza y Borrador',
    'Cuadernos',
    'Muestras de Cartas',
    ...
  ]
}`;

export const generateLearningSituationPrompt = `Una situación de aprendizaje debe incluir los siguientes elementos clave:
- Descripción del ambiente operativo: Donde se construirá y aplicará el aprendizaje.
- Situación o problema: Que se debe resolver o producto a realizar.
- Condición inicial de los estudiantes: Conocimientos previos que poseen sobre la situación planteada.
- Aprendizajes requeridos: Para resolver la situación o problema.
- Secuencia de operaciones: Actividades, procedimientos o prácticas necesarias para lograr el aprendizaje, incluyendo el escenario final o punto de llegada.

Te comparto dos ejemplos de situaciones de aprendizaje:
1. Los alumnos de 1er grado de secundaria del centro educativo Eugenio Miches Jimenez necesitan mejorar sus conocimientos de geometria, y en particular, sentar las bases, conocer y aprender a aplicar conceptos como el de recta, angulo, punto y vectores. Para esto, conjunto con el maestro, van a trabajar para dominar, tanto como sea posible estos, y otros conceptos importantes y cruciales en el area de la geometria. El maestro opta por utilizar la estrategia del ABP (aprendizaje basado en problemas) para enseñar a alumnos estos temas, en conjunto con tecnicas ludicas para hacer mas ameno el aprendizaje y mantener la motivacion de los alumnos. Al final de la aplicación de la presente unidad de aprendizaje, los alumnos presentaran una exposicion mostrando los aprendizajes que han adquirido, y sus portafolios con todos los trabajos realizados durante la unidad.
2. Nuestra Escuela Salomé Ureña abre sus puertas en un nuevo local, ahora está más grande y bonita, pero también, más cerca de las avenidas principales de la comunidad. La dirección inició una campaña de señalización vial con la Junta de Vecinos. En 2do A ayudaremos la escuela y formaremos el grupo “los guardianes de la vía”, para ello, estudiaremos las señales de tránsito, representaremos en papel cuadriculado los desplazamientos desde la escuela hacia los diferentes sectores de la comunidad y aprenderemos los puntos cardinales. Realizaremos una gran campaña de educación vial en la que iremos por los cursos de 1ro y 2do con maquetas para mostrar los mejores desplazamientos y los cuidados que se necesitan; llevaremos letreros con las señales de tránsito y explicaremos su significado.

Genera una situación de aprendizaje para el siguiente contexto:
- Centro educativo: centro_educativo
- Curso: nivel_y_grado
- Ambiente Operativo: ambiente_operativo
- Situación o Problema: situacion_o_problema
- Condición Inicial: condicion_inicial
- Aprendizajes requeridos: contenido_especifico
- Eje transversal: theme_axis

[secuencia], asi que el titulo debe ser apropiado y significativo.

La situación de aprendizaje debe ser clara, relevante y adecuada para el nivel educativo especificado. Debe priorizar el desarrollo de los temas a abordar y en segundo lugar el problema o situacion a resolver; de ser posible, el problema deberia ser resueldo utilizando las competencias que se han de adquirir durante el desarrollo de la unidad. La situacion de aprendizaje debe estar contenida en 1 a 3, debe ser narrada, como en los ejemplos, en primera o tercera persona del plural como si estuviera a punto de pasar, como si esta pasando o si va a pasar en el futuro cercano.
Aunque es opcional, es totalmente valido identificar el curso como 'los estudiantes de x grado de la escuela x' o 'los estudiantes de section_name'. La situacion de aprendizaje DEBE priorizar el contenido sobre la situacion (muy importante), de manera que lo que debe quedar en segundo plano, es el problema que se esta abordando.
La respuesta debe ser json valido, coherente con esta interfaz:
{
  "title": string; // titulo de la situacion de aprendizaje
  "content": string; // la situacion de aprendizaje en si
  "strategies": string[]; //estrategias de aprendizaje y ensenanza recomendados para esta situacion de aprendizaje
}`;

export const generateStrategiesPrompt = `A partir de los datos siguientes, que son la especificacion de mi contexto educativo, elabora una lista de estrategias didacticas para desarrollar los temas a tratar:
- Curso: nivel_y_grado
- Aprendizajes requeridos: contenido_especifico
- Eje transversal: theme_axis
- Situacion de aprendizaje: situacion_de_ap

Solo necesito el nombre de la estrategia, por ejemplo:
[
  'Indagacion dialogica',
  'Dialogo socratico',
  'Exposicion oral de conocimientos',
  ...
]
La lista no debe contener menos de 3 ni mas de 6 estrategias, lo ideal es 4-5, maximo 6
La respuesta debe ser un array de cadenas en formato json valido`;

export const generateMultigradeLearningSituationPrompt = `Una situación de aprendizaje debe ser un texto coherente que conecte los conocimientos a adquirir con un contexto real o simulado.

Genera una situación de aprendizaje COHESIVA y UNIFICADA para los siguientes grados: niveles_y_grados.
El objetivo es crear un único escenario o proyecto que pueda ser abordado por todos los grados, pero con diferentes niveles de profundidad y complejidad según sus capacidades. La situación de aprendizaje debe ser narrada como si estuviera a punto de pasar o ya estuviera sucediendo.

Considera el siguiente contexto:
- Ambiente Operativo: ambiente_operativo
- Situación o Problema Central: situacion_o_problema
- Eje transversal: theme_axis
- Aprendizajes requeridos (diferenciados por grado):
---
contenido_especifico_por_grado
---

La situación de aprendizaje generada debe:
1.  Ser clara, relevante y motivadora para todos los grados involucrados.
2.  Priorizar la integración de los contenidos de cada grado dentro de un proyecto o problema común.
3.  Permitir que cada grupo de estudiantes (por grado) pueda contribuir a la solución del problema desde el nivel de sus competencias y contenidos.
4.  Estar contenida en 1 a 3 párrafos.

La respuesta debe ser un JSON válido con esta interfaz:
{
  "title": string; // Un título creativo para la situación de aprendizaje multigrado.
  "content": string; // El texto de la situación de aprendizaje.
  "strategies": string[]; // Una lista de 4 a 6 estrategias de enseñanza y aprendizaje recomendadas para un entorno multigrado, como "Aprendizaje Basado en Proyectos (ABP)", "Trabajo Cooperativo por Estaciones", "Tutoría entre Iguales", etc.
}`;

export const generateMultigradeActivitySequencePrompt = `Quiero crear una secuencia didáctica para una clase multigrado que incluye: niveles_y_grados.
La unidad durará unit_duration semanas (3 sesiones de 45 minutos por semana). La asignatura común es subject_name.

Los contenidos a impartir, diferenciados por grado, son:
---
content_list_por_grado
---

La situación de aprendizaje que guiará la unidad es:
"learning_situation"

Información adicional:
- Recursos disponibles: resource_list
- Metodología de enseñanza principal: teaching_style
- Eje transversal: theme_axis

Tu tarea es elaborar una secuencia de actividades diferenciadas para cada grado, pero que se desarrollen de manera cohesiva bajo el mismo proyecto o situación de aprendizaje. Las actividades deben seguir una progresión lógica (inicio, desarrollo, cierre) y escalar en complejidad según la taxonomía de Bloom a lo largo de las semanas.

Para cada grado, debes generar:
-   **Actividades de enseñanza:** Lo que hará el docente. Deben ser oraciones completas que inicien con "El docente", "El maestro", etc. y representar una sesión de clase general.
-   **Actividades de aprendizaje:** Lo que harán los estudiantes. Deben ser oraciones completas que inicien con "Los estudiantes", "Los alumnos", etc. y ser la contraparte de las actividades del docente.
-   **Actividades de evaluación:** Deben incluir evaluación formativa y sumativa, especificando la técnica o instrumento a usar (ej. "observación directa usando una lista de cotejo", "revisión de portafolios con una rúbrica").

La respuesta debe ser un JSON válido con esta interfaz:
{
  "activities_by_grade": {
    "grade_level": string; // Ej: "1er Grado de Primaria"
    "teacher_activities": string[];
    "student_activities": string[];
    "evaluation_activities": string[];
  }[];
  "instruments": string[]; // Lista de TODAS las técnicas e instrumentos de evaluación mencionados en las actividades (ej: "Rúbrica", "Lista de Cotejo", "Diario Reflexivo", "Metacognición").
  "resources": string[]; // Lista de recursos necesarios para TODA la unidad multigrado.
}

Es MUY IMPORTANTE que los instrumentos listados en el array "instruments" se mencionen explícitamente en las descripciones de las "evaluation_activities".`;

export const classPlanPrompt = `Escribe un plan de clases, enfocado en el desarrollo de competencias, de class_subject de class_duration minutos para impartir class_topics en class_year grado de class_level. Esta es la interfaz de la planificacion:

interface Plan {
  "objective": string, // proposito
  "strategies": string[],
  "introduction": {
    "duration": number,
    "activities": string[],
    "resources": string[],
    "layout": string, // class layout
  },
  "main": {
    "duration": number,
    "activities": string[],
    "resources": string[],
    "layout": string, // class layout
  },
  "closing": {
    "duration": number,
    "activities": string[],
    "resources": string[],
    "layout": string, // class layout
  },
  "supplementary": { // actividades extra/opcionales (son opciones para que el docente implemente en caso de que le sobre tiempo o para intercambiar con alguna otra del plan)
    "activities": string[],
    "resources": string[],
    "layout": string, // class layout
  },
  "vocabulary": string[],
  "readings": string, // usualmente un material o libro relacionado con el tema
  "competence": string, // Competencia a trabajar (elige la mas apropiadas de las que menciono al final)
}

Los recursos disponibles son:
- plan_resources

Las competencias a desarrollorar debe ser una de estas:
- plan_compentece

Importante: se especifico (es decir, que necesito que siempre digas explicitamente el contenido o actividad que se va a trabajar para que no quede lugar a dudas), planea la clase para que se imparta con un estilo teaching_style, de ser posible incluye algo de metacognicion (que aprendimos, como lo aprendimos, que ha resultado mas facil, mas dificil, mas novedoso, para que nos puede servir, como podemos mejorar, etc) en el cierre de la clase, toma en cuenta que mis estudiantes no son los mas brillantes, asi que la clase no puede ser muy abarcadora, las actividades deben tener tiempo de sobra, y ten en cuenta que habran otros dias, asi que en lugar de muchas actividades y querer impartir todo sobre el tema en un solo dia, prefiero llevarlo suave y en su lugar, dar clases significativas que abarquen poco contenido academico, relativamente hablando, pero que sean una pocas actividades muy significativas y que le permitan al estudiante repetir hasta perpetuar, y tu respuesta debe ser un json totalmente valido.`;

export const emiClassPlanPrompt = `Escribe un plan de clases en formato JSON, enfocado en el desarrollo de competencias, de class_subject de class_duration minutos para la clase que voy a impartir. Tengo un aula multigrado, es decir que tiene más de un grado al mismo tiempo. Los grados que tengo funcionando en mi aula son class_years de class_level. El dia de hoy la clase sera sobre class_topics. Esta es la interfaz de la planificacion:

interface Plan {
  "objective": string, // proposito
  "strategies": string[],
  "introduction": {
    "duration": number,
    "activities": string[],
    "resources": string[],
    "layout": string, // class layout
  },
  "main": {
    "duration": number,
    "activities": string[],
    "resources": string[],
    "layout": string, // class layout
  },
  "closing": {
    "duration": number,
    "activities": string[],
    "resources": string[],
    "layout": string, // class layout
  },
  "supplementary": { // actividades extra/opcionales (son opciones para que el docente implemente en caso de que le sobre tiempo o para intercambiar con alguna otra del plan)
    "activities": string[],
    "resources": string[],
    "layout": string, // class layout
  },
  "vocabulary": string[],
  "readings": string, // usualmente un material o libro relacionado con el tema
  "competence": string, // Competencia a trabajar (elige la mas apropiadas de las que menciono al final)
}

Los recursos disponibles son:
- plan_resources

Las competencias a desarrollorar debe ser una de estas:
- plan_compentece

Importante: se especifico (es decir, que necesito que siempre digas explicitamente el contenido o actividad que se va a trabajar para que no quede lugar a dudas), planea la clase para que se imparta con un estilo teaching_style, de ser posible incluye algo de metacognicion (que aprendimos, como lo aprendimos, que ha resultado mas facil, mas dificil, mas novedoso, para que nos puede servir, como podemos mejorar, etc) en el cierre de la clase, y tu respuesta debe ser un json totalmente valido.`;
