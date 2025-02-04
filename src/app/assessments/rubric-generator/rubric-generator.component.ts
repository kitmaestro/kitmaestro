import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RubricService } from '../../services/rubric.service';
import { ClassSectionService } from '../../services/class-section.service';
import { UserSettingsService } from '../../services/user-settings.service';
import { Rubric } from '../../interfaces/rubric';
import { NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Student } from '../../interfaces/student';
import { StudentsService } from '../../services/students.service';
import { AiService } from '../../services/ai.service';
import { ClassSection } from '../../interfaces/class-section';
import { SubjectConceptListService } from '../../services/subject-concept-list.service';
import { ContentBlockService } from '../../services/content-block.service';
import { PretifyPipe } from '../../pipes/pretify.pipe';
import { ContentBlock } from '../../interfaces/content-block';
import { SubjectConceptList } from '../../interfaces/subject-concept-list';
import { CompetenceService } from '../../services/competence.service';

@Component({
    selector: 'app-rubric-generator',
    imports: [
        ReactiveFormsModule,
        MatSelectModule,
        MatCardModule,
        MatSnackBarModule,
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        NgIf,
        RouterLink,
        PretifyPipe,
    ],
    templateUrl: './rubric-generator.component.html',
    styleUrl: './rubric-generator.component.scss'
})
export class RubricGeneratorComponent {
  private sb = inject(MatSnackBar);
  private fb = inject(FormBuilder);
  private rubricService = inject(RubricService);
  private aiService = inject(AiService);
  private sectionsService = inject(ClassSectionService);
  private router = inject(Router);
  private userSettingsService = inject(UserSettingsService);
  private studentsService = inject(StudentsService);
  private competenceService = inject(CompetenceService);
  private sclService = inject(SubjectConceptListService);
  private contentBlockService = inject(ContentBlockService);

  sections: ClassSection[] = [];
  subjects: string[] = [];
  contentBlocks: ContentBlock[] = [];
  subjectConceptLists: SubjectConceptList[] = [];
  achievementIndicators: string[] = [];

  // selected data
  section: ClassSection | null = null;

  competence: string[] = [];

  userSettings$ = this.userSettingsService.getSettings();

  rubricTypes = [
    { id: 'SINTETICA', label: 'Sintética (Holística)' },
    { id: 'ANALITICA', label: 'Analítica (Global)' },
  ]

  rubric: Rubric | null = null;

  generating = false;
  loading = true;

  students: Student[] = [];

  rubricForm = this.fb.group({
    title: [''],
    minScore: [40, [Validators.required, Validators.min(0), Validators.max(100)]],
    maxScore: [100, [Validators.required, Validators.min(5), Validators.max(100)]],
    section: ['', Validators.required],
    subject: ['', Validators.required],
    content: ['', Validators.required],
    activity: ['', Validators.required],
    scored: [true],
    rubricType: ['SINTETICA', Validators.required],
    achievementIndicators: [],
    levels: this.fb.array([
      this.fb.control('Deficiente'),
      this.fb.control('Bueno'),
      this.fb.control('Excelente'),
    ]),
  });

  ngOnInit() {
    this.loadSections();
  }

  loadSections() {
    this.loading = true;
    this.sectionsService.findSections().subscribe({
      next: sections => {
        this.sections = sections;
      },
      error: err => {
        console.log(err)
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  loadContentBlocks() {
    this.loading = true;
  }

  onSelectSection(event: any) {
    const id = event.value;
    const section = this.sections.find(s => s._id == id);
    if (section) {
      this.section = section;
      this.subjects = section.subjects;
    }
  }

  onSubjectSelect(event: any) {
    const subject = event.value;
    if (this.section) {
      this.sclService.findAll({ subject, grade: this.section.year, level: this.section.level }).subscribe({
        next: res => {
          this.subjectConceptLists = res;
        }
      });
    }
  }

  onConceptSelect(event: any) {
    const concept = event.value;
    const subject = this.rubricForm.get('subject')?.value || '';
    if (this.section) {
      this.competenceService.findAll({ subject, grade: this.section.year, level: this.section.level }).subscribe({
        next: res => {
          this.competence = res.flatMap(entry => entry.entries[Math.round(Math.random() * (entry.entries.length - 1))])
        }
      })
      this.contentBlockService.findAll({ subject, year: this.section.year, level: this.section.level, title: concept }).subscribe({
        next: res => {
          this.contentBlocks = res;
          res.forEach(block => {
            const indicators: string[] = [];
            block.achievement_indicators.forEach(indicator => {
              if (!indicators.includes(indicator)) {
                indicators.push(indicator);
              }
            })
            this.achievementIndicators = indicators;
          })
        }
      })
    }
  }

  onSubmit() {
    this.generating = true;
    this.loadStudents();
    this.createRubric(this.rubricForm.value);
  }

  loadStudents() {
    const { section } = this.rubricForm.value;
    if (section) {
      this.studentsService.findBySection(section).subscribe(students => {
        this.students = students
      })
    }
  }

  save() {
    const rubric: any = this.rubric;
    this.rubricService.create(rubric).subscribe(res => {
      if (res._id) {
        this.router.navigate(['/rubrics/', res._id]).then(() => {
          this.sb.open('El instrumento ha sido guardado.', 'Ok', { duration: 2500 });
        });
      }
    });
  }

  createRubric(formValue: any) {
    const {
      title,
      minScore,
      maxScore,
      section,
      subject,
      content,
      activity,
      scored,
      rubricType,
      levels,
      achievementIndicators
    } = formValue;
    if (!this.section)
      return;
    const data = {
      title,
      minScore,
      maxScore,
      level: this.section.level,
      grade: this.section.year,
      section,
      subject: this.pretify(subject),
      content,
      activity,
      scored,
      rubricType,
      achievementIndicators,
      competence: this.competence,
      levels
    };
    const text = `Necesito que me construyas en contenido de una rubrica ${rubricType == 'SINTETICA' ? 'Sintética (Holística)' : 'Analítica (Global)'} para evaluar el contenido de "${content}" de ${data.subject} de ${this.section.year} grado de educación ${this.section.level}.
La rubrica sera aplicada tras esta actividad/evidencia: ${activity}.${scored ? ' La rubrica tendra un valor de ' + minScore + ' a ' + maxScore + ' puntos.' : ''}
Los criterios a evaluar deben estar basados en estos indicadores de logro:
- ${achievementIndicators.join('\n- ')}
Cada criterio tendra ${levels.length} niveles de desempeño: ${levels.map((el: string, i: number) => i + ') ' + el).join(', ')}.
Tu respuesta debe ser un json valido con esta interfaz:
{${title ? '' : '\n\ttitle: string;'}
  criteria: { // un objeto 'criteria' por cada indicador/criterio a evaluar
    indicator: string, // indicador a evaluar
    maxScore: number, // maxima calificacion para este indicador
    criterion: { // array de niveles de desempeño del estudiante acorde a los niveles proporcionados
      name: string, // criterio que debe cumplir (descripcion, osea que si el indicador es 'Lee y comprende el cuento', un criterio seria 'Lee el cuento deficientemente', otro seria 'Lee el cuento pero no comprende su contenido' y otro seria 'Lee el cuento de manera fluida e interpreta su contenido')
      score: number, // calificacion a asignar
    }[]
  }[];
}`;
    this.aiService.geminiAi(text).subscribe({
      next: result => {
        const start = result.response.indexOf('{');
        const limit = result.response.lastIndexOf('}') + 1;
        const obj = JSON.parse(result.response.slice(start, limit)) as { title?: string; criteria: { indicator: string, maxScore: number, criterion: { name: string, score: number, }[] }[] };
        if (!obj) {
          this.sb.open('Error al generar la rubrica. Intentalo de nuevo.', 'Ok', { duration: 2500 });
          this.generating = false;
          return;
        }
        const rubric: any = {
          criteria: obj.criteria,
          title: obj.title ? obj.title : title,
          rubricType,
          section,
          competence: this.competence,
          achievementIndicators,
          activity,
          progressLevels: levels,
          user: this.section?.user
        }
        this.rubric = rubric;
        this.generating = false;
      },
      error: (error) => {
        this.sb.open('Error al generar la rubrica. Intentelo de nuevo.', 'Ok', { duration: 2500 })
        console.log(error.message)
        this.generating = false;
      }
    });
  }

  addRubricLevel() {
    this.rubricLevels.push(this.fb.control(''));
  }

  deleteLevel(pos: number) {
    this.rubricLevels.removeAt(pos);
  }

  pretify(str: string) {
    return (new PretifyPipe()).transform(str);
  }

  yearIndex(grade: string): number {
    return ['PRIMERO','SEGUNDO','TERCERO','CUARTO','QUINTO','SEXTO'].indexOf(grade);
  }

  get rubricLevels() {
    return this.rubricForm.get('levels') as FormArray;
  }
}
