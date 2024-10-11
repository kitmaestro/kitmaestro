import { Component, inject, OnInit } from '@angular/core';
import { IsPremiumComponent } from '../../ui/alerts/is-premium/is-premium.component';
import { InProgressComponent } from '../../ui/alerts/in-progress/in-progress.component';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
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
import { ClassSectionService } from '../../services/class-section.service';
import { UserSettingsService } from '../../services/user-settings.service';
import { UserSettings } from '../../interfaces/user-settings';
import { ART_COMPETENCE } from '../../data/art-competence';
import { ENGLISH_COMPETENCE } from '../../data/english-competence';
import { SPANISH_COMPETENCE } from '../../data/spanish-competence';
import { MATH_COMPETENCE } from '../../data/math-competence';
import { SOCIETY_COMPETENCE } from '../../data/society-competence';
import { SCIENCE_COMPETENCE } from '../../data/science-competence';
import { FRENCH_COMPETENCE } from '../../data/french-competence';
import { RELIGION_COMPETENCE } from '../../data/religion-competence';
import { SPORTS_COMPETENCE } from '../../data/sports-competence';
import { ART_MAIN_THEMES } from '../../data/art-main-themes';
import { ENGLISH_MAIN_THEMES } from '../../data/english-main-themes';
import { SPANISH_MAIN_THEMES } from '../../data/spanish-main-themes';
import { MATH_MAIN_THEMES } from '../../data/math-main-themes';
import { SOCIETY_MAIN_THEMES } from '../../data/society-main-themes';
import { SCIENCE_MAIN_THEMES } from '../../data/science-main-themes';
import { FRENCH_MAIN_THEMES } from '../../data/french-main-themes';
import { RELIGION_MAIN_THEMES } from '../../data/religion-main-themes';
import { SPORTS_MAIN_THEMES } from '../../data/sports-main-themes';
import { UnitPlan } from '../../interfaces/unit-plan';
import { UnitPlanService } from '../../services/unit-plan.service';
import { Router, RouterModule } from '@angular/router';
import spanishContentBlocks from '../../data/spanish-content-blocks.json';
import mathContentBlocks from '../../data/math-content-blocks.json';
import societyContentBlocks from '../../data/society-content-blocks.json';
import scienceContentBlocks from '../../data/science-content-blocks.json';
import englishContentBlocks from '../../data/english-content-blocks.json';
import sportsContentBlocks from '../../data/sports-content-blocks.json';
import religionContentBlocks from '../../data/religion-content-blocks.json';
import artContentBlocks from '../../data/art-content-blocks.json';
import { HttpClientModule } from '@angular/common/http';
import { ClassSection } from '../../interfaces/class-section';
import { CompetenceService } from '../../services/competence.service';
import { CompetenceEntry } from '../../interfaces/competence-entry';

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
    RouterModule,
    HttpClientModule,
  ],
  templateUrl: './unit-plan.component.html',
  styleUrl: './unit-plan.component.scss'
})
export class UnitPlanComponent implements OnInit {
  private aiService = inject(AiService);
  private fb = inject(FormBuilder);
  private sb = inject(MatSnackBar);
  private classSectionService = inject(ClassSectionService);
  private userSettingsService = inject(UserSettingsService);
  private unitPlanService = inject(UnitPlanService);
  private competenceService = inject(CompetenceService);
  private router = inject(Router);
  private _evaluationCriteria: CompetenceEntry[] = [];
  working = true;

  userSettings: UserSettings | null = null;

  classSections: ClassSection[] = [];

  generating = false;

  mainThemeCategories = [
    'Salud y Bienestar',
    'Desarrollo Sostenible',
    'Desarrollo Personal y Profesional',
    'Alfabetización Imprescindible',
    'Ciudadanía y Convivencia',
  ];

  // TODO: start using this
  strategyOptions = [];

  learningSituationTitle = this.fb.control('');
  learningSituation = this.fb.control('');
  learningCriteria = this.fb.array<string[]>([]);
  strategies = this.fb.array<string[]>([]);
  teacher_activities = this.fb.array<string[]>([]);
  student_activities = this.fb.array<string[]>([]);
  evaluation_activities = this.fb.array<string[]>([]);
  instruments = this.fb.array<string[]>([]);
  resourceList = this.fb.array<string[]>([]);
  mainTheme = this.fb.control<string>('Salud y Bienestar');

  plan: UnitPlan | null = null;

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

  situationTypes = [
    { id: 'realityProblem', label: 'Problema Real' },
    { id: 'reality', label: 'Basada en mi Realidad' },
    { id: 'fiction', label: 'Ficticia' },
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

  // TODO: delete of make use of it
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

  learningSituationForm = this.fb.group({
    level: ['Primaria'],
    year: ['Primero'],
    classSection: [''],
    subjects: [[] as string[]],
    spanishContent: [''],
    mathContent: [[] as string[]],
    societyContent: [''],
    scienceContent: [[] as string[]],
    englishContent: [''],
    frenchContent: [''],
    religionContent: [[] as string[]],
    physicalEducationContent: [[] as string[]],
    artisticEducationContent: [[] as string[]],
    situationType: ['realityProblem'],
    reality: ['Falta de disciplina'],
    environment: ['Salón de clases']
  });

  unitPlanForm = this.fb.group({
    duration: [4],
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

  activitiesPrompt = `Quiero impartir estos contenidos en classroom_year de classroom_level en unit_duration semanas:
content_list

La situacion de aprendizaje que estare utilizando es esta:

learning_situation

Los recursos que tengo disponibles son estos:

resource_list

Elabora una lista de actividades a realizar, enfocadas en el desarrollo de competencias, categorizadas como actividades de aprendizaje (como las actividades propias de los alumnos), actividades de enseñanza (aquellas propias del docente) y actividades de evaluacion.
Cada actividad de aprendizaje, debe ser una oracion completa que inicie con 'Los estudiantes', 'Los alumnos', 'El alumnado', o 'El estudiantado'.
Cada actividad de enseñanza, debe ser una oracion completa que inicie con 'El docente', 'El maestro', o 'El profesor'.

Tu respuesta debe ser json valido con esta interfaz:
{
  teacher_activities: string[],
  student_activities: string[],
  evaluation_activities: string[],
  instruments: string[] // nombre de las tecnicas e instrumentos de evaluacion a utilizar,
  resources: string[], // los recursos que voy a necesitar para toda la unidad
}`;

  ngOnInit(): void {
    // const subjectsNames = [
    //   'EDUCACION_ARTISTICA', 'INGLES', 'FRANCES', 'MATEMATICA', 'FORMACION_HUMANA', 'CIENCIAS_NATURALES', 'CIENCIAS_SOCIALES', 'LENGUA_ESPANOLA', 'EDUCACION_FISICA'
    // ];
    // [ART_COMPETENCE, ENGLISH_COMPETENCE, FRENCH_COMPETENCE, MATH_COMPETENCE, RELIGION_COMPETENCE, SCIENCE_COMPETENCE, SOCIETY_COMPETENCE, SPANISH_COMPETENCE, SPORTS_COMPETENCE].forEach((comp:any, sub: number) => {
    //   Object.keys(comp.Secundaria).forEach(key => {
    //     const name = key.split('').map((s, i) => s == s.toUpperCase() && i !== 0 ? " " + s : s).join('');
    //     Object.keys(comp.Secundaria[key]).forEach(yearKey => {
    //       const grade = yearKey.toUpperCase();
    //       const subject = subjectsNames[sub];
    //       const level = 'SECUNDARIA';
    //       const entries = comp.Secundaria[key][yearKey].competenciasEspecificas;
    //       const criteria = comp.Secundaria[key][yearKey].criteriosDeEvaluacion;
    //       const data: any = {
    //         name,
    //         grade,
    //         subject,
    //         level,
    //         entries,
    //         criteria
    //       }
    //       const sus = this.competenceService.createCompetence(data).subscribe(res => {
    //         sus.unsubscribe();
    //         console.log('Created #', sub + 1)
    //       })
    //     })
    //   })
    // })
    this.userSettingsService.getSettings().subscribe({
      next: settings => {
        this.userSettings = settings;
      }
    });
    this.classSectionService.findSections().subscribe({
      next: (value) => {
        this.classSections = value;
        if (value.length) {
          this.learningSituationForm.get('classSection')?.setValue(value[0]._id || '');
        }
      }
    })
  }

  generateActivities() {
    const {
      duration,
      resources
    } = this.unitPlanForm.value;

    // const contents = this.collectContents('\n- ');
    const contents = this.contents.map(c => {
      return `${this.pretifySubject(c.subject)}:\nConceptuales:\n- ${c.concepts.join('\n- ')}\nProcedimentales:\n- ${c.procedures.join('\n- ')}\nActitudinales:\n- ${c.attitudes.join('\n- ')}`;
    }).join('\n');

    const text = this.activitiesPrompt.replace('classroom_year', `${this.classSectionYear}`)
      .replace('classroom_level', `${this.classSectionLevel}`)
      .replace('unit_duration', `${duration}`)
      .replace('content_list', contents)
      .replace('resource_list', (resources || []).join('\n- '))
      .replace('learning_situation', this.learningSituation.value || '');

    this.generating = true;

    this.aiService.askGemini(text, true).subscribe({
      next: (response) => {
        const activities: { teacher_activities: string[], student_activities: string[], evaluation_activities: string[], instruments: string[], resources: string[] } = JSON.parse(response.candidates.map(c => c.content.parts.map(p => p.text).join('\n')).join('\n'));
        this.generating = false;
        this.teacher_activities.clear();
        this.student_activities.clear();
        this.evaluation_activities.clear();
        this.instruments.clear();
        this.resourceList.clear();
        activities.teacher_activities.forEach(activity => {
          this.teacher_activities.push(this.fb.control(activity));
        });
        activities.student_activities.forEach(activity => {
          this.student_activities.push(this.fb.control(activity));
        });
        activities.evaluation_activities.forEach(activity => {
          this.evaluation_activities.push(this.fb.control(activity));
        });
        activities.instruments.forEach(activity => {
          this.instruments.push(this.fb.control(activity));
        });
        activities.resources.forEach(resource => {
          this.resourceList.push(this.fb.control(resource));
        });
      },
      error: (err) => {
        this.sb.open('Hubo un error generando las actividades. Intentalo de nuevo', undefined, { duration: 2500 })
        console.log(err.message)
        this.generating = false;
      }
    })
  }

  fillFinalForm() {
    const plan: any = {
      user: this.userSettings?._id,
      section: this.learningSituationForm.value.classSection,
      level: this.classSectionLevel,
      duration: this.unitPlanForm.value.duration || 4,
      learningSituation: this.learningSituation.value,
      title: this.learningSituationTitle.value,
      specificCompetences: this.competence,
      mainThemeCategory: this.mainTheme.value,
      mainThemes: this.mainThemes,
      subjectNames: this.subjectNames,
      strategies: this.strategies.value,
      evaluationCriteria: this.evaluationCriteria,
      contents: this.contents,
        resources: this.resourceList.value,
        instruments: this.instruments.value,
        teacher_activities: this.teacher_activities.value,
        student_activities: this.student_activities.value,
        evaluation_activities: this.evaluation_activities.value,
    };
    this.plan = plan;
  }

  savePlan() {
    if (this.plan) {
      this.unitPlanService.create(this.plan).subscribe({
        next: (plan) => {
          if (plan) {
            this.router.navigate(['/unit-plans', plan._id]).then(() => {
              this.sb.open('Tu unidad de aprendizaje ha sido guardada!', 'Ok', { duration: 2500 })
            })
          }
        }
      })
    }
  }

  generateLearningSituation() {
    const learningSituationPrompt = `Una situación de aprendizaje debe incluir los siguientes elementos clave:

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
- Centro educativo: ${this.classSection?.school.name}
- Curso: nivel_y_grado (nombre_del_grado)
- Ambiente Operativo: ambiente_operativo
- Situación o Problema: situacion_o_problema
- Condición Inicial: condicion_inicial
- Aprendizajes requeridos: contenido_especifico

La situación de aprendizaje debe ser clara, relevante y adecuada para el nivel educativo especificado. La situacion de aprendizaje debe estar contenida en uno o dos parrafos, y de ser muy extensa no debe pasar nunca de 3, debe ser narrada, como en los ejemplos, en primera o tercera persona del plural.
Aunque es opcional, es totalmente valido identificar el curso como 'los estudiantes de x grado de la escuela x' o 'los estudiantes de ${this.classSection?.name}'.
La respuesta debe ser json valido, coherente con esta interfaz:
{
  title: string; // titulo de la situacion de aprendizaje
  content: string; // la situacion de aprendizaje en si
  strategies: string[]; //estrategias de aprendizaje y ensenanza recomendados para esta situacion de aprendizaje
}
`;
    const {
      environment,
      situationType,
      reality,
    } = this.learningSituationForm.value;

    if (!environment || !reality || !situationType)
      return;

    const contents = this.collectContents();
    this.competenceService.findAll().subscribe(competence => {
      const subjects = (this.learningSituationForm.value.subjects as string[])
      this._evaluationCriteria = competence.filter(c => {
        return (c.grade == this.classSectionYear && c.level == this.classSectionLevel && subjects.includes(c.subject))
      });
    });

    const text = learningSituationPrompt.replace('nivel_y_grado', `${this.classSectionYear} de ${this.classSectionLevel}`)
      .replace('nombre_del_grado', this.classSectionName)
      .replace('ambiente_operativo', environment)
      .replace('situacion_o_problema', situationType == 'fiction' ? 'situacion, problema o evento ficticio' : reality)
      .replace('condicion_inicial', 'Los alumnos aun no saben nada sobre el tema')
      .replace('contenido_especifico', contents);

    this.generating = true;

    this.aiService.askGemini(text, true).subscribe({
      next: (response) => {
        const learningSituation: { title: string, content: string, learningCriteria: string[], strategies: string[] } = JSON.parse(response.candidates.map(c => c.content.parts.map(p => p.text).join('\n')).join('\n'));
        this.generating = false;
        this.learningSituationTitle.setValue(learningSituation.title);
        this.learningSituation.setValue(learningSituation.content);
        this.strategies.clear();
        learningSituation.strategies.forEach(strategy => {
          this.strategies.push(this.fb.control(strategy))
        });
      }
    })
  }

  collectContents(divider = ', ') {
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

    const contents: string[] = [];

    const { subjects } = this.learningSituationForm.value

    if (subjects?.includes('LENGUA_ESPANOLA')) {
      contents.push(spanishContent || '');
    }

    if (subjects?.includes('MATEMATICA')) {
      contents.push(...mathContent || '');
    }

    if (subjects?.includes('CIENCIAS_SOCIALES')) {
      contents.push(societyContent || '');
    }

    if (subjects?.includes('CIENCIAS_NATURALES')) {
      contents.push(...scienceContent || '');
    }

    if (subjects?.includes('INGLES')) {
      contents.push(englishContent || '');
    }

    if (subjects?.includes('FRANCES')) {
      contents.push(frenchContent || '');
    }

    if (subjects?.includes('FORMACION_HUMANA')) {
      contents.push(...religionContent || '');
    }

    if (subjects?.includes('EDUCACION_FISICA')) {
      contents.push(...physicalEducationContent || '');
    }

    if (subjects?.includes('EDUCACION_ARTISTICA')) {
      contents.push(...artisticEducationContent || '');
    }

    return contents.join(divider);
  }

  formatedLevel(levelOrYear: string): string {
    return ((levelOrYear[0] || '').toUpperCase() + levelOrYear.toLowerCase().slice(1)).replace('_', ' ');
  }

  yearIndex(year: string): number {
    return year == 'PRIMERO' ? 0 :
      year == 'SEGUNDO' ? 1 :
      year == 'TERCERO' ? 2 :
      year == 'CUARTO' ? 3 :
      year == 'QUINTO' ? 4 :
      5;
  }

  get spanishContents() {
    const level = this.formatedLevel(this.classSectionLevel);

    const index = this.yearIndex(this.classSectionYear);
    if (level == 'Primaria') {
      return SPANISH_CONTENTS.primary[index]
    } else {
      return SPANISH_CONTENTS.highSchool[index];
    }
  }

  get mathContents() {
    const level = this.formatedLevel(this.classSectionLevel);

    const index = this.yearIndex(this.classSectionYear);
    if (level == 'Primaria') {
      return MATH_CONTENTS.primary[index]
    } else {
      return MATH_CONTENTS.highSchool[index];
    }
  }

  get societyContents() {
    const level = this.formatedLevel(this.classSectionLevel);

    const index = this.yearIndex(this.classSectionYear);
    if (level == 'Primaria') {
      return SOCIETY_CONTENTS.primary[index]
    } else {
      return SOCIETY_CONTENTS.highSchool[index];
    }
  }

  get scienceContents() {
    const level = this.formatedLevel(this.classSectionLevel);

    const index = this.yearIndex(this.classSectionYear);
    if (level == 'Primaria') {
      return SCIENCE_CONTENTS.primary[index]
    } else {
      return SCIENCE_CONTENTS.highSchool[index];
    }
  }

  get englishContents() {
    const level = this.formatedLevel(this.classSectionLevel);

    const index = this.yearIndex(this.classSectionYear);
    if (level == 'Primaria') {
      return ENGLISH_CONTENTS.primary[index]
    } else {
      return ENGLISH_CONTENTS.highSchool[index];
    }
  }

  get frenchContents() {
    const level = this.formatedLevel(this.classSectionLevel);

    const index = this.yearIndex(this.classSectionYear);
    if (level == 'Primaria') {
      return FRENCH_CONTENTS.primary[index]
    } else {
      return FRENCH_CONTENTS.highSchool[index];
    }
  }

  get religionContents() {
    const level = this.formatedLevel(this.classSectionLevel);

    const index = this.yearIndex(this.classSectionYear);
    if (level == 'Primaria') {
      return RELIGION_CONTENTS.primary[index]
    } else {
      return RELIGION_CONTENTS.highSchool[index];
    }
  }

  get physicalEducationContents() {
    const level = this.formatedLevel(this.classSectionLevel);

    const index = this.yearIndex(this.classSectionYear);
    if (level == 'Primaria') {
      return SPORTS_CONTENTS.primary[index]
    } else {
      return SPORTS_CONTENTS.highSchool[index];
    }
  }

  get artisticEducationContents() {
    const level = this.formatedLevel(this.classSectionLevel);

    const index = this.yearIndex(this.classSectionYear);
    if (level == 'Primaria') {
      return ART_CONTENTS.primary[index]
    } else {
      return ART_CONTENTS.highSchool[index];
    }
  }

  get specificCompetences() {
    return [];
  }

  get classSectionSubjects() {
    if (this.learningSituationForm.value.classSection) {
      return [];
    }
    return [];
  }

  get classSection() {
    const { classSection } = this.learningSituationForm.value;
    return this.classSections.find(s => s._id == classSection);
  }

  get classSectionSchoolName() {
    const { classSection } = this.learningSituationForm.value;
    if (classSection) {
      const data = this.classSections.find(s => s._id == classSection)
      if (data) {
        return data.school.name;
      }
    }
    return '';
  }

  get classSectionName() {
    const { classSection } = this.learningSituationForm.value;
    if (classSection) {
      const data = this.classSections.find(s => s._id == classSection)
      if (data) {
        return data.name;
      }
    }
    return '';
  }

  get classSectionYear() {
    const { classSection } = this.learningSituationForm.value;
    if (classSection) {
      const data = this.classSections.find(s => s._id == classSection)
      if (data) {
        return data.year;
      }
      return '';
    }
    return '';
  }

  get classSectionLevel() {
    const { classSection } = this.learningSituationForm.value;
    if (classSection) {
      const data = this.classSections.find(s => s._id == classSection)
      if (data) {
        return data.level;
      }
      return '';
    }
    return '';
  }

  get competence(): CompetenceEntry[] {
    return this._evaluationCriteria.filter(c => {
      const { subjects } = this.learningSituationForm.value as any;
      return c.grade == this.classSectionYear &&
      c.level == this.classSectionLevel &&
      subjects.includes(c.subject);
    }).map(c => ({ ...c, entries: [this.randomCompetence(c.entries)]}));
  }

  get evaluationCriteria(): { name: string, criteria: string[] }[] {
    return this._evaluationCriteria.map(c => ({ name: c.name, criteria: [this.randomCriteria(c.criteria)] }))
  }

  randomCompetence(categorized: any): string {
    let random = Math.round(Math.random() * (categorized.length - 1))
    return categorized[random];
  }

  randomCriteria(categorized: any): string {
    let random = Math.round(Math.random() * (categorized.length - 1))
    return categorized[random];
  }

  mainThemeByGrade(themes: { Primero: string[], Segundo: string[], Tercero: string[], Cuarto: string[], Quinto: string[], Sexto: string[] }): string {
    let random = 0;
    switch (this.yearIndex(this.classSectionYear)) {
      case 0:
        random = Math.round(Math.random() * (themes.Primero.length - 1))
        return themes.Primero[random];
      case 1:
        random = Math.round(Math.random() * (themes.Segundo.length - 1))
        return themes.Segundo[random];
      case 2:
        random = Math.round(Math.random() * (themes.Tercero.length - 1))
        return themes.Tercero[random];
      case 3:
        random = Math.round(Math.random() * (themes.Cuarto.length - 1))
        return themes.Cuarto[random];
      case 4:
        random = Math.round(Math.random() * (themes.Quinto.length - 1))
        return themes.Quinto[random];
      case 5:
        random = Math.round(Math.random() * (themes.Sexto.length - 1))
        return themes.Sexto[random];
      default:
        return '';
    }
  }

  get mainThemes(): string[] {
    const themes: string[] = [];

    const { subjects } = this.learningSituationForm.value

    if (subjects?.includes('LENGUA_ESPANOLA')) {
      themes.push(this.mainThemeByGrade(this.classSectionLevel == 'PRIMARIA' ? (SPANISH_MAIN_THEMES.Primaria as any)[this.mainTheme.value || 'Salud y Bienestar'] : (SPANISH_MAIN_THEMES.Secundaria as any)[this.mainTheme.value || 'Salud y Bienestar']));
    }

    if (subjects?.includes('MATEMATICA')) {
      themes.push(this.mainThemeByGrade(this.classSectionLevel == 'PRIMARIA' ? (MATH_MAIN_THEMES.Primaria as any)[this.mainTheme.value || 'Salud y Bienestar'] : (MATH_MAIN_THEMES.Secundaria as any)[this.mainTheme.value || 'Salud y Bienestar']));
    }

    if (subjects?.includes('CIENCIAS_SOCIALES')) {
      themes.push(this.mainThemeByGrade(this.classSectionLevel == 'PRIMARIA' ? (SOCIETY_MAIN_THEMES.Primaria as any)[this.mainTheme.value || 'Salud y Bienestar'] : (SOCIETY_MAIN_THEMES.Secundaria as any)[this.mainTheme.value || 'Salud y Bienestar']));
    }

    if (subjects?.includes('CIENCIAS_NATURALES')) {
      themes.push(this.mainThemeByGrade(this.classSectionLevel == 'PRIMARIA' ? (SCIENCE_MAIN_THEMES.Primaria as any)[this.mainTheme.value || 'Salud y Bienestar'] : (SCIENCE_MAIN_THEMES.Secundaria as any)[this.mainTheme.value || 'Salud y Bienestar']));
    }

    if (subjects?.includes('INGLES')) {
      themes.push(this.mainThemeByGrade(this.classSectionLevel == 'PRIMARIA' ? (ENGLISH_MAIN_THEMES.Primaria as any)[this.mainTheme.value || 'Salud y Bienestar'] : (ENGLISH_MAIN_THEMES.Secundaria as any)[this.mainTheme.value || 'Salud y Bienestar']));
    }

    if (subjects?.includes('FRANCES')) {
      themes.push(this.mainThemeByGrade(this.classSectionLevel == 'PRIMARIA' ? (FRENCH_MAIN_THEMES.Primaria as any)[this.mainTheme.value || 'Salud y Bienestar'] : (FRENCH_MAIN_THEMES.Secundaria as any)[this.mainTheme.value || 'Salud y Bienestar']));
    }

    if (subjects?.includes('FORMACION_HUMANA')) {
      themes.push(this.mainThemeByGrade(this.classSectionLevel == 'PRIMARIA' ? (RELIGION_MAIN_THEMES.Primaria as any)[this.mainTheme.value || 'Salud y Bienestar'] : (RELIGION_MAIN_THEMES.Secundaria as any)[this.mainTheme.value || 'Salud y Bienestar']));
    }

    if (subjects?.includes('EDUCACION_FISICA')) {
      themes.push(this.mainThemeByGrade(this.classSectionLevel == 'PRIMARIA' ? (SPORTS_MAIN_THEMES.Primaria as any)[this.mainTheme.value || 'Salud y Bienestar'] : (SPORTS_MAIN_THEMES.Secundaria as any)[this.mainTheme.value || 'Salud y Bienestar']));
    }

    if (subjects?.includes('EDUCACION_ARTISTICA')) {
      themes.push(this.mainThemeByGrade(this.classSectionLevel == 'PRIMARIA' ? (ART_MAIN_THEMES.Primaria as any)[this.mainTheme.value || 'Salud y Bienestar'] : (ART_MAIN_THEMES.Secundaria as any)[this.mainTheme.value || 'Salud y Bienestar']));
    }

    return themes;
  }

  get subjectNames(): string[] {
    const subjectNames: string[] = [];

    const { subjects } = this.learningSituationForm.value

    if (subjects?.includes('LENGUA_ESPANOLA')) {
      subjectNames.push('Lengua Española');
    }

    if (subjects?.includes('MATEMATICA')) {
      subjectNames.push('Matemática');
    }

    if (subjects?.includes('CIENCIAS_SOCIALES')) {
      subjectNames.push('Ciencias Sociales');
    }

    if (subjects?.includes('CIENCIAS_NATURALES')) {
      subjectNames.push('Ciencias de la Naturaleza');
    }

    if (subjects?.includes('INGLES')) {
      subjectNames.push('Inglés');
    }

    if (subjects?.includes('FRANCES')) {
      subjectNames.push('Francés');
    }

    if (subjects?.includes('FORMACION_HUMANA')) {
      subjectNames.push('Formación Integral Humana y Religiosa');
    }

    if (subjects?.includes('EDUCACION_FISICA')) {
      subjectNames.push('Educación Física');
    }

    if (subjects?.includes('EDUCACION_ARTISTICA')) {
      subjectNames.push('Educación Artística');
    }

    return subjectNames;
  }

  removeDuplicates(strings: string[]): string[] {
    // Use a Set to store unique strings encountered so far.
    const seen = new Set<string>();

    // Filter the input array, keeping only those strings not present in 'seen'.
    return strings.filter((str) => {
      if (!seen.has(str)) {
        seen.add(str);
        return true;
      }
      return false;
    });
  }

  get contents(): { subject: string, concepts: string[], procedures: string[], attitudes: string[], achievement_indicators: string[] }[] {
    const year = this.classSectionYear;
    const level = this.classSectionLevel;
    const {
      subjects,
      spanishContent,
      mathContent,
      societyContent,
      scienceContent,
      englishContent,
      physicalEducationContent,
      artisticEducationContent,
      religionContent
    } = this.learningSituationForm.value;
    const contents: { subject: string, concepts: string[], procedures: string[], attitudes: string[], achievement_indicators: string[] }[] = [];

    if (subjects?.includes('LENGUA_ESPANOLA')) {
      const spanish = spanishContentBlocks.find(cb => cb.level == level && cb.year == year && cb.title == spanishContent);
      if (spanish) {
        contents.push({
          subject: 'LENGUA_ESPANOLA',
          concepts: spanish.concepts,
          procedures: spanish.procedures,
          attitudes: spanish.attitudes,
          achievement_indicators: spanish.achievement_indicators || [],
        })
      }
    }

    if (subjects?.includes('MATEMATICA')) {
      const mathContents: { concepts: string[], procedures: string[], attitudes: string[], achievement_indicators: string[] }[] = [];
      (mathContent ? mathContent : []).forEach(content => {
        const math = mathContentBlocks.find(cb => cb.level == level && cb.year == year && cb.title == content);
        if (math) {
          mathContents.push({
            concepts: math.concepts,
            procedures: math.procedures,
            attitudes: math.attitudes,
            achievement_indicators: math.achievement_indicators || [],
          })
        }
      });
      contents.push({
        subject: 'MATEMATICA',
        concepts: this.removeDuplicates(mathContents.map(mc => mc.concepts).flat()),
        procedures: this.removeDuplicates(mathContents.map(mc => mc.procedures).flat()),
        attitudes: this.removeDuplicates(mathContents.map(mc => mc.attitudes).flat()),
        achievement_indicators: this.removeDuplicates(mathContents.map(mc => mc.achievement_indicators).flat()),
      });
    }

    if (subjects?.includes('CIENCIAS_SOCIALES')) {
      const society = societyContentBlocks.find(cb => cb.level == level && cb.year == year && cb.title == societyContent);
      if (society) {
        contents.push({
          subject: 'CIENCIAS_SOCIALES',
          concepts: society.concepts,
          procedures: society.procedures,
          attitudes: society.attitudes,
          achievement_indicators: society.achievement_indicators || [],
        })
      }
    }

    if (subjects?.includes('CIENCIAS_NATURALES')) {
      const scienceContents: { concepts: string[], procedures: string[], attitudes: string[], achievement_indicators: string[] }[] = [];
      (!scienceContent ? [] : scienceContent).forEach(content => {
        const science = scienceContentBlocks.find(cb => cb.level == level && cb.year == year && cb.title == content);
        if (science) {
          scienceContents.push({
            concepts: science.concepts,
            procedures: science.procedures,
            attitudes: science.attitudes,
            achievement_indicators: science.achievement_indicators || [],
          })
        }
      });
      contents.push({
        subject: 'CIENCIAS_NATURALES',
        concepts: this.removeDuplicates(scienceContents.map(mc => mc.concepts).flat()),
        procedures: this.removeDuplicates(scienceContents.map(mc => mc.procedures).flat()),
        attitudes: this.removeDuplicates(scienceContents.map(mc => mc.attitudes).flat()),
        achievement_indicators: this.removeDuplicates(scienceContents.map(mc => mc.achievement_indicators).flat()),
      });
    }

    if (subjects?.includes('INGLES')) {
      const english = englishContentBlocks.find(cb => cb.level == level && cb.year == year && cb.title == englishContent);
      if (english) {
        contents.push({
          subject: 'INGLES',
          concepts: english.concepts,
          procedures: english.procedures,
          attitudes: english.attitudes,
          achievement_indicators: english.achievement_indicators || [],
        })
      }
    }

    if (subjects?.includes('EDUCACION_FISICA')) {
      const sportsContents: { concepts: string[], procedures: string[], attitudes: string[], achievement_indicators: string[] }[] = [];
      (!physicalEducationContent ? [] : physicalEducationContent).forEach(content => {
        const sports = sportsContentBlocks.find(cb => cb.level == level && cb.year == year && cb.title == content);
        if (sports) {
          sportsContents.push({
            concepts: sports.concepts,
            procedures: sports.procedures,
            attitudes: sports.attitudes,
            achievement_indicators: sports.achievement_indicators || [],
          })
        }
      });
      contents.push({
        subject: 'EDUCACION_FISICA',
        concepts: this.removeDuplicates(sportsContents.map(mc => mc.concepts).flat()),
        procedures: this.removeDuplicates(sportsContents.map(mc => mc.procedures).flat()),
        attitudes: this.removeDuplicates(sportsContents.map(mc => mc.attitudes).flat()),
        achievement_indicators: this.removeDuplicates(sportsContents.map(mc => mc.achievement_indicators).flat()),
      });
    }

    if (subjects?.includes('FORMACION_HUMANA')) {
      const religionContents: { concepts: string[], procedures: string[], attitudes: string[], achievement_indicators: string[] }[] = [];
      (!religionContent ? [] : religionContent).forEach(content => {
        const religion = religionContentBlocks.find(cb => cb.level == level && cb.year == year && cb.title == content);
        if (religion) {
          religionContents.push({
            concepts: religion.concepts,
            procedures: religion.procedures,
            attitudes: religion.attitudes,
            achievement_indicators: religion.achievement_indicators || [],
          })
        }
      });
      contents.push({
        subject: 'FORMACION_HUMANA',
        concepts: this.removeDuplicates(religionContents.map(mc => mc.concepts).flat()),
        procedures: this.removeDuplicates(religionContents.map(mc => mc.procedures).flat()),
        attitudes: this.removeDuplicates(religionContents.map(mc => mc.attitudes).flat()),
        achievement_indicators: this.removeDuplicates(religionContents.map(mc => mc.achievement_indicators).flat()),
      });
    }

    if (subjects?.includes('EDUCACION_ARTISTICA')) {
      const artContents: { concepts: string[], procedures: string[], attitudes: string[], achievement_indicators: string[] }[] = [];
      (!artisticEducationContent ? [] : artisticEducationContent).forEach(content => {
        const art = artContentBlocks.find(cb => cb.level == level && cb.year == year && cb.title == content);
        if (art) {
          artContents.push({
            concepts: art.concepts,
            procedures: art.procedures,
            attitudes: art.attitudes,
            achievement_indicators: art.achievement_indicators || [],
          })
        }
      });
      contents.push({
        subject: 'EDUCACION_ARTISTICA',
        concepts: this.removeDuplicates(artContents.map(mc => mc.concepts).flat()),
        procedures: this.removeDuplicates(artContents.map(mc => mc.procedures).flat()),
        attitudes: this.removeDuplicates(artContents.map(mc => mc.attitudes).flat()),
        achievement_indicators: this.removeDuplicates(artContents.map(mc => mc.achievement_indicators).flat()),
      });
    }

    return contents;
  }

  get indicators() {
    return this.contents.map(c => ({achievement_indicators: c.achievement_indicators, subject: c.subject}))
  }

  pretifySubject(subject: string) {

    if (subject == 'LENGUA_ESPANOLA') {
      return 'Lengua Española';
    }

    if (subject == 'MATEMATICA') {
      return 'Matemática';
    }

    if (subject == 'CIENCIAS_SOCIALES') {
      return 'Ciencias Sociales';
    }

    if (subject == 'CIENCIAS_NATURALES') {
      return 'Ciencias de la Naturaleza';
    }

    if (subject == 'INGLES') {
      return 'Inglés';
    }

    if (subject == 'FRANCES') {
      return 'Francés';
    }

    if (subject == 'FORMACION_HUMANA') {
      return 'Formación Integral Humana y Religiosa';
    }

    if (subject == 'EDUCACION_FISICA') {
      return 'Educación Física';
    }

    if (subject == 'EDUCACION_ARTISTICA') {
      return 'Educación Artística';
    }

    return 'Talleres Optativos';
  }

  get subjects(): { id: string, label: string }[] {
    const subjectsFromClassSection = this.classSections.find(cs => cs._id == this.learningSituationForm.value.classSection)?.subjects as any as string[];
    if (subjectsFromClassSection && subjectsFromClassSection.length) {
      return subjectsFromClassSection.map(sId => ({ id: sId, label: this.pretifySubject(sId) }));
    }
    return [];
  }
}
