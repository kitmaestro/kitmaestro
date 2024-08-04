import { Component, inject } from '@angular/core';
import { IsPremiumComponent } from '../../ui/alerts/is-premium/is-premium.component';
import { InProgressComponent } from '../../ui/alerts/in-progress/in-progress.component';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { AiService } from '../../services/ai.service';
import { SPANISH_CONTENTS } from '../../data/spanish-contents';
import { MATH_CONTENTS } from '../../data/math-contents';
import { SOCIETY_CONTENTS } from '../../data/society-contents';
import { SCIENCE_CONTENTS } from '../../data/science-contents';
import { ENGLISH_CONTENTS } from '../../data/english-contents';
import { FRENCH_CONTENTS } from '../../data/french-contents';
import { RELIGION_CONTENTS } from '../../data/religion-contents';
import { SPORTS_CONTENTS } from '../../data/sports-contents';
import { ART_CONTENTS } from '../../data/art-contents';

@Component({
  selector: 'app-unit-plan',
  standalone: true,
  imports: [
    IsPremiumComponent,
    InProgressComponent,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatCardModule,
    MatStepperModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
  ],
  templateUrl: './unit-plan.component.html',
  styleUrl: './unit-plan.component.scss'
})
export class UnitPlanComponent {
  working = true;
  aiService = inject(AiService);
  fb = inject(FormBuilder);
  sb = inject(MatSnackBar);

  generating = false;

  learningSituationTitle = this.fb.control('');
  learningSituation = this.fb.control('');
  contents: { subject: string, concepts: string[], procedures: string[], attitudes: string[] }[] = [];
  learningCriteria = this.fb.control<string[]>([]);

  levels = [
    'Primaria',
    'Secundaria'
  ];

  years = [
    'Primero',
    'Segundo',
    'Tercero',
    'Cuarto',
    'Quinto',
    'Sexto',
  ];

  subjects = [
    { id: 'LENGUA_ESPANOLA', label: 'Lengua Española' },
    { id: 'MATEMATICA', label: 'Matemática' },
    { id: 'CIENCIAS_SOCIALES', label: 'Ciencias Sociales' },
    { id: 'CIENCIAS_NATURALES', label: 'Ciencias de la Naturaleza' },
    { id: 'INGLES', label: 'Inglés' },
    { id: 'FRANCES', label: 'Francés' },
    { id: 'FORMACION_HUMANA', label: 'Formación Integral Humana y Religiosa' },
    { id: 'EDUCACION_FISICA', label: 'Educación Física' },
    { id: 'EDUCACION_ARTISTICA', label: 'Educación Artística' },
  ];

  situationTypes = [
    { id: 'fiction', label: 'Ficticia' },
    { id: 'reality', label: 'Basada en la Realidad' },
    { id: 'realityProblem', label: 'Problema Real' },
  ];

  problems = [
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

  environments = [
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

  bloomLevels = [
    { id: 'knowledge', label: 'Recordar' },
    { id: 'undertanding', label: 'Comprender' },
    { id: 'application', label: 'Aplicar' },
    { id: 'analysis', label: 'Analizar' },
    { id: 'evaluation', label: 'Evaluar' },
    { id: 'creation', label: 'Crear' },
  ];

  resources = [
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

  // steps:
  // 1 - choose level
  // 2 - choose subjects
  learningSituationForm = this.fb.group({
    level: ['Primaria', Validators.required],
    year: ['Primero', Validators.required],
    subjects: [['LENGUA_ESPANOLA'], Validators.required],
    spanishContent: [''],
    mathContent: [''],
    societyContent: [''],
    scienceContent: [''],
    englishContent: [''],
    frenchContent: [''],
    religionContent: [''],
    physicalEducationContent: [''],
    artisticEducationContent: [''],
    situationType: ['fiction'],
    reality: ['Falta de disciplina'],
    environment: ['Salón de clases']
  });

  unitPlanForm = this.fb.group({
    duration: [2],
    fundamentalCompetence: [['Comunicativa', 'Pensamiento Lógico, Creativo y Crítico; Resolución de Problemas; Ciencia y Tecnología', 'Ética y Ciudadana; Personal y Espiritual; Ambiental y de Salud']],
    specificCompetence: [[]],
    activities: this.fb.array([]),
    resources: [["Pizarra", "Libros de texto", "Cuadernos", "Lápices y bolígrafos", "Materiales de arte (papel, colores, pinceles)", "Cuadernos de ejercicios"]]
  });

  activitiesForm = this.fb.array([
    this.fb.group({
      bloomLevel: ['knowledge'],
      title: [''],
      description: ['']
    })
  ]);

  learningSituationPrompt = `Una situación de aprendizaje debe incluir los siguientes elementos clave:

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
- Curso: nivel_y_grado
- Ambiente Operativo: ambiente_operativo
- Situación o Problema: situacion_o_problema
- Condición Inicial: condicion_inicial
- Aprendizajes requeridos: contenido_especifico

La situación de aprendizaje debe ser clara, relevante y adecuada para el nivel educativo especificado. La situacion de aprendizaje debe estar contenida en un solo parrafo, debe ser narrada, como en los ejemplos, en primera o tercera persona del plural.
La respuesta debe ser json valido, coherente con esta interfaz:
{
  title: string; // titulo de la situacion de aprendizaje
  content: string; // la situacion de aprendizaje en si
}
`;

  generateLearningSituation() {
    const {
      environment,
      situationType,
      reality,
      level,
      year,
    } = this.learningSituationForm.value;

    if (!environment || !reality || !situationType)
      return;

    const contents = this.collectContents();

    const text = this.learningSituationPrompt.replace('nivel_y_grado', `${year} de ${level}`)
      .replace('ambiente_operativo', environment)
      .replace('situacion_o_problema', situationType == 'fiction' ? 'situacion, problema o evento ficticio' : reality)
      .replace('condicion_inicial', 'Los alumnos aun no saben nada sobre el tema')
      .replace('contenido_especifico', contents);

    this.generating = true;

    this.aiService.askGemini(text, true).subscribe({
      next: (response) => {
        const learningSituation: { title: string, content: string, learningCriteria: string[] } = JSON.parse(response.candidates.map(c => c.content.parts.map(p => p.text).join('\n')).join('\n'));
        this.learningSituationTitle.setValue(learningSituation.title);
        this.learningSituation.setValue(learningSituation.content);
        this.learningCriteria.setValue(learningSituation.learningCriteria);
        this.generating = false;
      }
    })
  }

  collectContents() {
    const {
      spanishContent,
      mathContent,
      societyContent,
      scienceContent,
      englishContent,
      frenchContent,
      religionContent,
      physicalEducationContent,
      artisticEducationContent
    } = this.learningSituationForm.value;

    return [
      spanishContent ? spanishContent : null,
      mathContent ? mathContent : null,
      societyContent ? societyContent : null,
      scienceContent ? scienceContent : null,
      englishContent ? englishContent : null,
      frenchContent ? frenchContent : null,
      religionContent ? religionContent : null,
      physicalEducationContent ? physicalEducationContent : null,
      artisticEducationContent ? artisticEducationContent : null,
    ].filter(c => !!c).join(', ');
  }

  get spanishContents() {
    const {
      level,
      year
    } = this.learningSituationForm.value;
    if (!level || !year)
      return[];

    const index = this.years.indexOf(year);
    if (level == 'Primaria') {
      return SPANISH_CONTENTS.primary[index]
    } else {
      return SPANISH_CONTENTS.highSchool[index];
    }
  }

  get mathContents() {
    const {
      level,
      year
    } = this.learningSituationForm.value;
    if (!level || !year)
      return [];

    const index = this.years.indexOf(year);
    if (level == 'Primaria') {
      return MATH_CONTENTS.primary[index]
    } else {
      return MATH_CONTENTS.highSchool[index];
    }
  }

  get societyContents() {
    const {
      level,
      year
    } = this.learningSituationForm.value;
    if (!level || !year)
      return [];

    const index = this.years.indexOf(year);
    if (level == 'Primaria') {
      return SOCIETY_CONTENTS.primary[index]
    } else {
      return SOCIETY_CONTENTS.highSchool[index];
    }
  }

  get scienceContents() {
    const {
      level,
      year
    } = this.learningSituationForm.value;
    if (!level || !year)
      return [];

    const index = this.years.indexOf(year);
    if (level == 'Primaria') {
      return SCIENCE_CONTENTS.primary[index]
    } else {
      return SCIENCE_CONTENTS.highSchool[index];
    }
  }

  get englishContents() {
    const {
      level,
      year
    } = this.learningSituationForm.value;
    if (!level || !year)
      return [];

    const index = this.years.indexOf(year);
    if (level == 'Primaria') {
      return ENGLISH_CONTENTS.primary[index]
    } else {
      return ENGLISH_CONTENTS.highSchool[index];
    }
  }

  get frenchContents() {
    const {
      level,
      year
    } = this.learningSituationForm.value;
    if (!level || !year)
      return [];

    const index = this.years.indexOf(year);
    if (level == 'Primaria') {
      return FRENCH_CONTENTS.primary[index]
    } else {
      return FRENCH_CONTENTS.highSchool[index];
    }
  }

  get religionContents() {
    const {
      level,
      year
    } = this.learningSituationForm.value;
    if (!level || !year)
      return [];

    const index = this.years.indexOf(year);
    if (level == 'Primaria') {
      return RELIGION_CONTENTS.primary[index]
    } else {
      return RELIGION_CONTENTS.highSchool[index];
    }
  }

  get physicalEducationContents() {
    const {
      level,
      year
    } = this.learningSituationForm.value;
    if (!level || !year)
      return [];

    const index = this.years.indexOf(year);
    if (level == 'Primaria') {
      return SPORTS_CONTENTS.primary[index]
    } else {
      return SPORTS_CONTENTS.highSchool[index];
    }
  }

  get artisticEducationContents() {
    const {
      level,
      year
    } = this.learningSituationForm.value;
    if (!level || !year)
      return [];

    const index = this.years.indexOf(year);
    if (level == 'Primaria') {
      return ART_CONTENTS.primary[index]
    } else {
      return ART_CONTENTS.highSchool[index];
    }
  }

  get specificCompetences() {
    return [];
  }
}
