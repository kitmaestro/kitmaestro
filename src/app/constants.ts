export const mainThemeCategories: string[] = [
    'Salud y Bienestar',
    'Desarrollo Sostenible',
    'Desarrollo Personal y Profesional',
    'Alfabetización Imprescindible',
    'Ciudadanía y Convivencia',
];

export const schoolLevels: string[] = [
    'Primaria',
    'Secundaria'
];

export const schoolYears = [
    'Primero',
    'Segundo',
    'Tercero',
    'Cuarto',
    'Quinto',
    'Sexto',
];

export const classroomProblems = [
    "Falta de disciplina",
    "Bullying",
    "Ausentismo escolar",
    "Falta de motivación",
    "Problemas de atención",
    "Déficit de recursos educativos",
    "Falta de apoyo familiar",
    "Violencia en el hogar",
    "Problemas de alimentación",
    "Dificultades de aprendizaje",
    "Problemas de lenguaje",
    "Falta de materiales didácticos",
    "Pobreza",
    "Acceso limitado a tecnología",
    "Problemas de salud",
    "Desigualdad de género",
    "Discriminación",
    "Problemas emocionales",
    "Estrés escolar",
    "Falta de higiene",
    "Inseguridad escolar",
    "Drogadicción",
    "Embarazos adolescentes",
    "Falta de infraestructura",
    "Falta de capacitación docente",
    "Falta de recursos bibliográficos",
    "Falta de personal de apoyo",
    "Problemas de transporte",
    "Desnutrición",
    "Problemas de convivencia",
    "Violencia escolar",
    "Falta de evaluación adecuada",
    "Falta de incentivos educativos",
    "Problemas de identidad cultural",
    "Falta de participación de los padres",
    "Sobrecarga curricular",
    "Problemas de clima escolar",
    "Problemas de adaptación",
    "Problemas de comunicación",
    "Problemas de socialización",
    "Falta de espacios recreativos",
    "Problemas de integración",
    "Deserción escolar",
    "Problemas de autoestima",
    "Problemas económicos",
    "Desinterés en los estudios",
    "Falta de orientación vocacional",
    "Problemas de seguridad",
    "Problemas de iluminación",
    "Problemas de ventilación",
    "Problemas de acceso al agua",
    "Falta de conexión a Internet",
    "Problemas de acoso sexual",
    "Falta de baños adecuados",
    "Problemas de higiene menstrual",
    "Problemas de transporte público",
    "Falta de actividades extracurriculares",
    "Problemas de nutrición",
    "Violencia de pandillas",
    "Problemas de acoso cibernético",
    "Falta de programas de apoyo psicológico",
    "Problemas de accesibilidad para discapacitados",
    "Problemas de corrupción en la administración escolar",
    "Falta de oportunidades de formación profesional",
    "Problemas de contaminación",
    "Falta de programas de reciclaje",
    "Problemas de mantenimiento de la infraestructura",
    "Falta de participación estudiantil",
    "Problemas de acceso a bibliotecas",
    "Problemas de calidad del agua",
    "Falta de personal médico en escuelas",
    "Problemas de abuso infantil",
    "Falta de programas de educación sexual",
    "Problemas de acceso a medicamentos",
    "Falta de recursos para estudiantes con necesidades especiales",
    "Problemas de violencia doméstica",
    "Falta de programas de educación ambiental"
];

export const schoolEnvironments = [
    "Salón de clases",
    "Patio",
    "Biblioteca",
    "Laboratorio de ciencias",
    "Laboratorio de computación",
    "Gimnasio",
    "Auditorio",
    "Sala de música",
    "Sala de arte",
    "Cafetería",
    "Sala de lectura",
    "Sala de audiovisuales",
    "Huerto escolar",
    "Taller de tecnología",
    "Taller de manualidades",
    "Sala de reuniones",
    "Sala de profesores",
    "Área de juegos",
    "Sala de teatro",
    "Centro de recursos",
    "Sala de idiomas",
    "Piscina",
    "Zona de estudio al aire libre",
    "Sala de orientación",
    "Área de recreo",
    "Salón multiusos",
    "Pabellón deportivo",
    "Jardín escolar",
    "Área de meditación",
    "Sala de debates",
    "Laboratorio de física",
    "Laboratorio de química",
    "Laboratorio de biología",
    "Centro de innovación",
    "Espacios colaborativos",
    "Estudio de grabación",
    "Sala de robótica",
    "Área de descanso",
    "Sala de juegos educativos",
    "Espacio maker",
    "Plaza cívica",
    "Sala de exposición",
    "Taller de costura",
    "Taller de carpintería",
    "Sala de primeros auxilios",
    "Aula virtual",
    "Centro de emprendimiento",
    "Sala de proyecciones",
    "Sala de psicología",
    "Área de naturaleza"
];

export const classroomResources = [
    "Pizarra",
    "Proyector",
    "Laptop / Computadora",
    "Tablets",
    "Libros de texto",
    "Cuadernos",
    "Lápices y bolígrafos",
    "Internet",
    "Presentaciones en PowerPoint",
    "Juegos educativos",
    "Materiales de arte (papel, colores, pinceles)",
    "Laboratorios de ciencias",
    "Mapas y globos terráqueos",
    "Calculadoras",
    "Software Educativo",
    "Módulos de aprendizaje en línea",
    "Videos educativos",
    "Recursos digitales interactivos",
    "Cuadernos de ejercicios",
    "Fichas didácticas",
    "Bocina",
    "Instrumentos musicales",
    "Modelos anatómicos",
    "Maquetas",
    "Material de lectura"
];

export const generateActivitySequencePrompt = `Quiero impartir estos contenidos en classroom_year de classroom_level en unit_duration semanas (2 a 3 sesiones de 45 minutos por semana):
content_list

Los recursos que tengo disponibles son estos:

resource_list

En mi estilo de ensenanza, por lo general aplico el teaching_style

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

Te comparto tres ejemplos de situaciones de aprendizaje:
1. Los alumnos de 1er grado de secundaria del centro educativo Eugenio Miches Jimenez necesitan mejorar sus conocimientos de geometria, y en particular, sentar las bases, conocer y aprender a aplicar conceptos como el de recta, angulo, punto y vectores. Para esto, conjunto con el maestro, van a trabajar para dominar, tanto como sea posible estos, y otros conceptos importantes y cruciales en el area de la geometria. El maestro opta por utilizar la estrategia del ABP (aprendizaje basado en problemas) para enseñar a alumnos estos temas, en conjunto con tecnicas ludicas para hacer mas ameno el aprendizaje y mantener la motivacion de los alumnos. Al final de la aplicación de la presente unidad de aprendizaje, los alumnos presentaran una exposicion mostrando los aprendizajes que han adquirido, y sus portafolios con todos los trabajos realizados durante la unidad.
2. En una emocionante semana de clase, los niños de quinto de primaria se embarcarán en un emocionante viaje a través del tiempo y el espacio. Comenzaremos nuestro viaje explorando mapas y misteriosas leyendas sobre la desaparición de la Atlántida como punto de partida para aprender sobre la localización del continente americano en Ciencias Sociales. A medida que los días avanzan, los estudiantes se convertirán en intrépidos paleontólogos y geólogos en una expedición ficticia en la que descubrirán fósiles y aprenderán sobre la historia de la Tierra en Ciencias de la Naturaleza. Utilizaremos juegos de geolocalización y un emocionante juego de búsqueda de fósiles para reforzar conceptos clave. Finalmente, los niños aplicarán sus conocimientos al crear su propio mapa detallado de un continente ficticio, incluyendo ubicaciones de fósiles, para demostrar su comprensión en una actividad final lúdica y creativa que fusionará Ciencias Sociales y Ciencias de la Naturaleza en un emocionante proyecto interdisciplinario. ¡Será una semana de aprendizaje emocionante y lleno de aventuras!
3. Nuestra Escuela Salomé Ureña abre sus puertas en un nuevo local, ahora está más grande y bonita, pero también, más cerca de las avenidas principales de la comunidad. La dirección inició una campaña de señalización vial con la Junta de Vecinos. En 2do A ayudaremos la escuela y formaremos el grupo “los guardianes de la vía”, para ello, estudiaremos las señales de tránsito, representaremos en papel cuadriculado los desplazamientos desde la escuela hacia los diferentes sectores de la comunidad y aprenderemos los puntos cardinales. Realizaremos una gran campaña de educación vial en la que iremos por los cursos de 1ro y 2do con maquetas para mostrar los mejores desplazamientos y los cuidados que se necesitan; llevaremos letreros con las señales de tránsito y explicaremos su significado.

Genera una situación de aprendizaje para el siguiente contexto:
- Centro educativo: centro_educativo
- Curso: nivel_y_grado
- Ambiente Operativo: ambiente_operativo
- Situación o Problema: situacion_o_problema
- Condición Inicial: condicion_inicial
- Aprendizajes requeridos: contenido_especifico

La situación de aprendizaje debe ser clara, relevante y adecuada para el nivel educativo especificado. Debe priorizar el desarrollo de los temas a abordar y en segundo lugar el problema o situacion a resolver; de ser posible, el problema deberia ser resueldo utilizando las competencias que se han de adquirir durante el desarrollo de la unidad. La situacion de aprendizaje debe estar contenida en 1 a 3, debe ser narrada, como en los ejemplos, en primera o tercera persona del plural como si estuviera a punto de pasar, como si esta pasando o si va a pasar en el futuro cercano.
Aunque es opcional, es totalmente valido identificar el curso como 'los estudiantes de x grado de la escuela x' o 'los estudiantes de section_name'. La situacion de aprendizaje DEBE priorizar el contenido sobre la situacion (muy importante), de manera que lo que debe quedar en segundo plano, es el problema que se esta abordando.
La respuesta debe ser json valido, coherente con esta interfaz:
{
  title: string; // titulo de la situacion de aprendizaje
  content: string; // la situacion de aprendizaje en si
  strategies: string[]; //estrategias de aprendizaje y ensenanza recomendados para esta situacion de aprendizaje
}`;

export const classPlanPrompt = `Escribe un plan de clases, enfocado en el desarrollo de competencias, de class_subject de class_duration minutos para impartir class_topics en class_year grado de class_level. Esta es la interfaz de la planificacion:

interface Plan {
  objective: string, // proposito
  strategies: string[],
  introduction: {
    duration: number,
    activities: string[],
    resources: string[],
    layout: string, // class layout
  },
  main: {
    duration: number,
    activities: string[],
    resources: string[],
    layout: string, // class layout
  },
  closing: {
    duration: number,
    activities: string[],
    resources: string[],
    layout: string, // class layout
  },
  supplementary: { // actividades extra/opcionales (son opciones para que el docente implemente en caso de que le sobre tiempo o para intercambiar con alguna otra del plan)
    activities: string[],
    resources: string[],
    layout: string, // class layout
  },
  vocabulary: string[],
  readings: string, // usualmente un material o libro relacionado con el tema
  competence: string, // Competencia a trabajar (elige la mas apropiadas de las que menciono al final)
}

Los recursos disponibles son: plan_resources
Las competencias a desarrollorar debe ser una de estas:
- plan_compentece
`;
