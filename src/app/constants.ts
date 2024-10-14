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

export const generateActivitySequencePrompt = `Quiero impartir estos contenidos en classroom_year de classroom_level en unit_duration semanas:
content_list

La situacion de aprendizaje que estare utilizando es esta:

learning_situation

Los recursos que tengo disponibles son estos:

resource_list

Elabora una lista de actividades a realizar, enfocadas en el desarrollo de competencias, categorizadas como actividades de aprendizaje (como las actividades propias de los alumnos), actividades de enseñanza (aquellas propias del docente) y actividades de evaluacion.
Cada actividad de aprendizaje, debe ser una oracion completa que inicie con 'Los estudiantes', 'Los alumnos', 'El alumnado', o 'El estudiantado'.
Cada actividad de enseñanza, debe ser una oracion completa que inicie con 'El docente', 'El maestro', o 'El profesor'.
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
  instruments: string[] // nombre de las tecnicas e instrumentos de evaluacion a utilizar,
  resources: string[], // los recursos que voy a necesitar para toda la unidad
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

La situación de aprendizaje debe ser clara, relevante y adecuada para el nivel educativo especificado. La situacion de aprendizaje debe estar contenida en uno o dos parrafos, y de ser muy extensa no debe pasar nunca de 3, debe ser narrada, como en los ejemplos, en primera o tercera persona del plural.
Aunque es opcional, es totalmente valido identificar el curso como 'los estudiantes de x grado de la escuela x' o 'los estudiantes de section_name'.
La respuesta debe ser json valido, coherente con esta interfaz:
{
  title: string; // titulo de la situacion de aprendizaje
  content: string; // la situacion de aprendizaje en si
  strategies: string[]; //estrategias de aprendizaje y ensenanza recomendados para esta situacion de aprendizaje
}`;