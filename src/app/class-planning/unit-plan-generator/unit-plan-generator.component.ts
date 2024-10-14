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
// import { SPANISH_CONTENTS } from '../../data/spanish-contents';
// import { MATH_CONTENTS } from '../../data/math-contents';
// import { SOCIETY_CONTENTS } from '../../data/society-contents';
// import { SCIENCE_CONTENTS } from '../../data/science-contents';
// import { ENGLISH_CONTENTS } from '../../data/english-contents';
// import { FRENCH_CONTENTS } from '../../data/french-contents';
// import { RELIGION_CONTENTS } from '../../data/religion-contents';
// import { SPORTS_CONTENTS } from '../../data/sports-contents';
// import { ART_CONTENTS } from '../../data/art-contents';
import { ClassSectionService } from '../../services/class-section.service';
import { UserSettingsService } from '../../services/user-settings.service';
import { UserSettings } from '../../interfaces/user-settings';
// import { ART_MAIN_THEMES } from '../../data/art-main-themes';
// import { ENGLISH_MAIN_THEMES } from '../../data/english-main-themes';
// import { SPANISH_MAIN_THEMES } from '../../data/spanish-main-themes';
// import { MATH_MAIN_THEMES } from '../../data/math-main-themes';
// import { SOCIETY_MAIN_THEMES } from '../../data/society-main-themes';
// import { SCIENCE_MAIN_THEMES } from '../../data/science-main-themes';
// import { FRENCH_MAIN_THEMES } from '../../data/french-main-themes';
// import { RELIGION_MAIN_THEMES } from '../../data/religion-main-themes';
// import { SPORTS_MAIN_THEMES } from '../../data/sports-main-themes';
// import { ART_COMPETENCE } from '../../data/art-competence';
// import { ENGLISH_COMPETENCE } from '../../data/english-competence';
// import { SPANISH_COMPETENCE } from '../../data/spanish-competence';
// import { MATH_COMPETENCE } from '../../data/math-competence';
// import { SOCIETY_COMPETENCE } from '../../data/society-competence';
// import { SCIENCE_COMPETENCE } from '../../data/science-competence';
// import { FRENCH_COMPETENCE } from '../../data/french-competence';
// import { RELIGION_COMPETENCE } from '../../data/religion-competence';
// import { SPORTS_COMPETENCE } from '../../data/sports-competence';
import { UnitPlan } from '../../interfaces/unit-plan';
import { UnitPlanService } from '../../services/unit-plan.service';
import { Router, RouterModule } from '@angular/router';
// import spanishContentBlocks from '../../data/spanish-content-blocks.json';
// import mathContentBlocks from '../../data/math-content-blocks.json';
// import societyContentBlocks from '../../data/society-content-blocks.json';
// import scienceContentBlocks from '../../data/science-content-blocks.json';
// import englishContentBlocks from '../../data/english-content-blocks.json';
// import frenchContentBlocks from '../../data/french-content-blocks.json';
// import sportsContentBlocks from '../../data/sports-content-blocks.json';
// import religionContentBlocks from '../../data/religion-content-blocks.json';
// import artContentBlocks from '../../data/art-content-blocks.json';
import { HttpClientModule } from '@angular/common/http';
import { ClassSection } from '../../interfaces/class-section';
import { CompetenceService } from '../../services/competence.service';
import { CompetenceEntry } from '../../interfaces/competence-entry';
import { MainTheme } from '../../interfaces/main-theme';
import { MainThemeService } from '../../services/main-theme.service';
import {
  classroomProblems,
  classroomResources,
  generateActivitySequencePrompt,
  generateLearningSituationPrompt,
  mainThemeCategories,
  schoolEnvironments
} from '../../constants';
import { UnitPlanComponent } from '../unit-plan/unit-plan.component';
import { forkJoin } from 'rxjs';
import { ContentBlockService } from '../../services/content-block.service';
import { ContentBlock } from '../../interfaces/content-block';

@Component({
  selector: 'app-unit-plan-generator',
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
    UnitPlanComponent,
  ],
  templateUrl: './unit-plan-generator.component.html',
  styleUrl: './unit-plan-generator.component.scss'
})
export class UnitPlanGeneratorComponent implements OnInit {
  private aiService = inject(AiService);
  private mainThemeService = inject(MainThemeService);
  private fb = inject(FormBuilder);
  private sb = inject(MatSnackBar);
  private classSectionService = inject(ClassSectionService);
  private userSettingsService = inject(UserSettingsService);
  private contentBlockService = inject(ContentBlockService);
  private unitPlanService = inject(UnitPlanService);
  private competenceService = inject(CompetenceService);
  private router = inject(Router);
  private _evaluationCriteria: CompetenceEntry[] = [];
  working = true;

  userSettings: UserSettings | null = null;
  
  public mainThemeCategories = mainThemeCategories;
  public environments = schoolEnvironments;
  public problems = classroomProblems;
  public resources = classroomResources;

  classSections: ClassSection[] = [];

  generating = false;

  // TODO: start using this
  strategyOptions = [];

  learningSituationTitle = this.fb.control('');
  learningSituation = this.fb.control('');
  learningCriteria = this.fb.array<string[]>([]);
  strategies = this.fb.array<string[]>([]);
  teacher_activities: { subject: string, activities: string[] }[] = [];
  student_activities: { subject: string, activities: string[] }[] = [];
  evaluation_activities: { subject: string, activities: string[] }[] = [];
  instruments = this.fb.array<string[]>([]);
  resourceList = this.fb.array<string[]>([]);
  mainTheme = this.fb.control<string>('Salud y Bienestar');
  mainThemes: MainTheme[] = [];
  contentBlocks: ContentBlock[] = [];

  plan: UnitPlan | null = null;

  situationTypes = [
    { id: 'realityProblem', label: 'Problema Real' },
    { id: 'reality', label: 'Basada en mi Realidad' },
    { id: 'fiction', label: 'Ficticia' },
  ];

  learningSituationForm = this.fb.group({
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

  ngOnInit(): void {
    // const subjectsNames = [
    //   'EDUCACION_ARTISTICA', 'INGLES', 'FRANCES', 'MATEMATICA', 'FORMACION_HUMANA', 'CIENCIAS_NATURALES', 'CIENCIAS_SOCIALES', 'LENGUA_ESPANOLA', 'EDUCACION_FISICA'
    // ];
    // let created = 0;
    // [artContentBlocks, englishContentBlocks, frenchContentBlocks, mathContentBlocks, religionContentBlocks, scienceContentBlocks, societyContentBlocks, spanishContentBlocks, sportsContentBlocks].forEach(contents => {
    //   contents.forEach((content, i) => {
    //     const { year, level, concepts, attitudes, procedures, subject, title, achievement_indicators } = content;
    //     const block: any = {
    //       year,
    //       level,
    //       subject,
    //       title,
    //       order: i,
    //       concepts,
    //       attitudes,
    //       procedures,
    //       achievement_indicators: achievement_indicators,
    //     }
    //     if (title) {
    //       this.contentBlockService.create(block).subscribe(result => {
    //         console.log('Created #%d', ++created)
    //       })
    //     }
    //   })
    // });
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
    //         console.log('Created #', ++created)
    //       })
    //     })
    //   })
    // })
    // let created = 0;
    // [ART_MAIN_THEMES, ENGLISH_MAIN_THEMES, FRENCH_MAIN_THEMES, MATH_MAIN_THEMES, RELIGION_MAIN_THEMES, SCIENCE_MAIN_THEMES, SOCIETY_MAIN_THEMES, SPANISH_MAIN_THEMES, SPORTS_MAIN_THEMES].forEach((comp:any, sub: number) => {
    //   Object.keys(comp).forEach(levelKey => {
    //     const level = levelKey.toUpperCase();
    //     Object.keys(comp[levelKey]).forEach(key => {
    //       const category = key;
    //       Object.keys(comp[levelKey][key]).forEach(yearKey => {
    //         const year = yearKey.toUpperCase();
    //         const subject = subjectsNames[sub];
    //         const topics = comp[levelKey][key][yearKey].map((s: string) => {
    //           let trimmed = s.trim();
    //           if (trimmed[trimmed.length - 1] == '.') {
    //             return trimmed.slice(0, -1);
    //           }
    //           return trimmed;
    //         });
    //         const data: any = {
    //           category,
    //           year,
    //           subject,
    //           level,
    //           topics
    //         }
    //         created += 1;
    //         const sus = this.mainThemeService.create(data).subscribe(res => {
    //           sus.unsubscribe();
    //           console.log('Created #', created)
    //         });
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

  onSubjectSelect() {
    setTimeout(() => {
      this.loadMainThemes();
    }, 0);
  }

  loadMainThemes() {
    if (!this.classSection)
      return;

    const { level, year } = this.classSection;
    const { subjects } = this.learningSituationForm.value as any;
    const category = this.mainTheme.value as string;
    forkJoin<MainTheme[][]>(subjects.map((subject: string) => this.mainThemeService.findAll({ level, year, subject, category }))).subscribe(result => {
      this.mainThemes = result.flat();
    });
    forkJoin<ContentBlock[][]>(subjects.map((subject: string) => this.contentBlockService.findAll({ level, year, subject }))).subscribe(result => {
      this.contentBlocks = result.flat().sort((a,b) => a.order - b.order);
    });
  }

  getSelectedContentsId() {
    const {
      spanishContent,
      mathContent,
      frenchContent,
      englishContent,
      scienceContent,
      societyContent,
      religionContent,
      artisticEducationContent,
      physicalEducationContent
    } = this.learningSituationForm.value;
    return [
      spanishContent,
      englishContent,
      frenchContent,
      societyContent,
      mathContent,
      scienceContent,
      religionContent,
      physicalEducationContent,
      artisticEducationContent
    ].flat().filter(s => !!s);
  }

  getSelectedContents() {
    return this.contentBlocks.filter(b => {
      this.getSelectedContentsId().includes(b._id)
    });
  }

  generateActivities() {
    const {
      duration,
      resources
    } = this.unitPlanForm.value;

    const contents = this.getSelectedContents().map(c => {
      return `${this.pretifySubject(c.subject)}:\nConceptuales:\n- ${c.concepts.join('\n- ')}\nProcedimentales:\n- ${c.procedures.join('\n- ')}\nActitudinales:\n- ${c.attitudes.join('\n- ')}`;
    }).join('\n');

    const text = generateActivitySequencePrompt.replace('classroom_year', `${this.classSectionYear}`)
      .replace('classroom_level', `${this.classSectionLevel}`)
      .replace('unit_duration', `${duration}`)
      .replace('content_list', contents)
      .replace('resource_list', (resources || []).join('\n- '))
      .replace('learning_situation', this.learningSituation.value || '')
      .replace('subject_list', `${this.learningSituationForm.value.subjects?.join(',\n- ')}`)
      .replace('subject_type', `${this.learningSituationForm.value.subjects?.map(s => `'${s}'`).join(' | ')}`)
      .replace('subject_type', `${this.learningSituationForm.value.subjects?.map(s => `'${s}'`).join(' | ')}`)
      .replace('subject_type', `${this.learningSituationForm.value.subjects?.map(s => `'${s}'`).join(' | ')}`);

    this.generating = true;

    this.aiService.geminiAi(text).subscribe({
      next: (response) => {
        try {
          const start = response.response.indexOf('{');
          const activities: { teacher_activities: { subject: string, activities: string[]}[], student_activities: { subject: string, activities: string[]}[], evaluation_activities: { subject: string, activities: string[]}[], instruments: string[], resources: string[] } = JSON.parse(response.response.slice(start, -3));
          // const activities: { teacher_activities: { subject: string, activities: string[]}[], student_activities: { subject: string, activities: string[]}[], evaluation_activities: { subject: string, activities: string[]}[], instruments: string[], resources: string[] } = JSON.parse(response.candidates.map(c => c.content.parts.map(p => p.text).join('\n')).join('\n'));
          this.generating = false;
          this.instruments.clear();
          this.resourceList.clear();
          this.teacher_activities = activities.teacher_activities;
          this.student_activities = activities.student_activities;
          this.evaluation_activities = activities.evaluation_activities;
          activities.instruments.forEach(list => {
            this.instruments.push(this.fb.control(list));
          });
          activities.resources.forEach(resource => {
            this.resourceList.push(this.fb.control(resource));
          });
        } catch (error) {
          console.log(error)
          this.generating = false;
          this.sb.open('Ha ocurrido un error generando las actividades. Haz click en generar para intentarlo de nuevo.', 'Ok', { duration: 2500 });
        }
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
      section: this.classSection?._id,
      duration: this.unitPlanForm.value.duration || 4,
      learningSituation: this.learningSituation.value,
      title: this.learningSituationTitle.value,
      competence: this.competence.map(c => c._id),
      mainThemeCategory: this.mainTheme.value,
      mainThemes: this.mainThemes.map(t => t._id),
      subjects: this.learningSituationForm.value.subjects,
      strategies: this.strategies.value,
      contents: this.getSelectedContentsId(),
      resources: this.resourceList.value,
      instruments: this.instruments.value,
      teacherActivities: this.teacher_activities,
      studentActivities: this.student_activities,
      evaluationActivities: this.evaluation_activities,
    };
    this.plan = plan;
    console.log(plan)
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

    const text = generateLearningSituationPrompt.replace('nivel_y_grado', `${this.classSectionYear} de ${this.classSectionLevel}`)
      .replace('centro_educativo', this.classSection?.school.name || '')
      .replace('nivel_y_grado', `${this.classSectionYear.toLowerCase()} de ${this.classSectionLevel.toLowerCase()}`)
      .replace('section_name', this.classSectionName)
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
    if (this.classSection) {
      return this.classSection.school.name;
    }
    return '';
  }

  get classSectionName() {
    if (this.classSection) {
      return this.classSection.name;
    }
    return '';
  }

  get classSectionYear() {
    if (this.classSection) {
      return this.classSection.year;
    }
    return '';
  }

  get classSectionLevel() {
    if (this.classSection) {
      return this.classSection.level;
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

  randomCompetence(categorized: string[]): string {
    let random = Math.round(Math.random() * (categorized.length - 1))
    return categorized[random];
  }

  randomCriteria(categorized: string[]): string {
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

  get subjectNames(): string[] {
    const formValue: any = this.learningSituationForm.value;
    return formValue.subjects.map((subject: string) => this.pretifySubject(subject));
  }

  removeDuplicates(strings: string[]): string[] {
    const seen = new Set<string>();

    return strings.filter((str) => {
      if (!seen.has(str)) {
        seen.add(str);
        return true;
      }
      return false;
    });
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
    const subjectsFromClassSection = this.classSection?.subjects;
    if (subjectsFromClassSection && subjectsFromClassSection.length) {
      return subjectsFromClassSection.map(sId => ({ id: sId, label: this.pretifySubject(sId) }));
    }
    return [];
  }
}
