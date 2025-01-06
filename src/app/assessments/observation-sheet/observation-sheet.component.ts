import { Component, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';
import { ClassSectionService } from '../../services/class-section.service';
import { CompetenceService } from '../../services/competence.service';
import { ObservationGuideComponent } from '../../ui/observation-guide/observation-guide.component';
import { ObservationGuide } from '../../interfaces/observation-guide';
import { StudentsService } from '../../services/students.service';
import { Student } from '../../interfaces/student';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { PdfService } from '../../services/pdf.service';
import { CompetenceEntry } from '../../interfaces/competence-entry';
import { ClassSection } from '../../interfaces/class-section';
import { ObservationGuideService } from '../../services/observation-guide.service';
import { UserSettings } from '../../interfaces/user-settings';

@Component({
    selector: 'app-observation-sheet',
    imports: [
        MatIconModule,
        MatCardModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        ReactiveFormsModule,
        MatCheckboxModule,
        ObservationGuideComponent,
        MatSnackBarModule,
    ],
    templateUrl: './observation-sheet.component.html',
    styleUrl: './observation-sheet.component.scss'
})
export class ObservationSheetComponent implements OnInit {

  private fb = inject(FormBuilder);
  private observationGuideService = inject(ObservationGuideService);
  private authService = inject(AuthService);
  private classSectionService = inject(ClassSectionService);
  private competenceService = inject(CompetenceService);
  private studentsService = inject(StudentsService);
  private pdfService = inject(PdfService);
  private router = inject(Router);
  private sb = inject(MatSnackBar);
  user: UserSettings | null = null;
  teacherName: string = '';
  schoolName: string = '';
  
  groups: ClassSection[] = [];
  competenceCol: CompetenceEntry[] = [];
  students: Student[] = [];
  compentenceOptions: string[];

  aspects = [
    'Interacción entre los estudiantes',
    'Estrategias desarrolladas para dar respuestas a las situaciones planteadas',
    'Manejo de los contenidos mediadores',
    'Comunicación verbal y no verbal',
    'Organización de los estudiantes y sus materiales',
    'Tiempo en el que desarrollan las actividades',
    'Interés y participación',
    'Peticiones de apoyo',
    'Interacción con el espacio',
    'Uso de recursos y referentes del espacio de aprendizaje',
    'Solidaridad y colaboración entre pares',
  ];

  durationOptions = [
    '45 minutos',
    '90 minutos',
    '1 día',
    '1 semana',
    '1 mes',
  ];

  observationSheet: ObservationGuide | null = null;

  sheetForm = this.fb.group({
    blankDate: [false],
    title: ['', Validators.required],
    date: [new Date().toISOString().split('T')[0]],
    individual: [false],
    group: ['', Validators.required],
    description: ['', Validators.required],
    duration: ['90 minutos'],
    competence: [['Comunicativa'], Validators.required],
    subject: ['', Validators.required],
    aspects: [['Interacción entre los estudiantes'], Validators.required],
    customAspects: [''],
  });

  constructor() {
    this.compentenceOptions = this.getCompentenceOptions();
  }

  ngOnInit() {
    this.loadProfile();
    this.loadCompetences();
    this.loadSections();
  }

  onGradeSelect(event?: any) {
    const id: string | undefined = event.value;
    this.loadCompetences(id);
    this.loadStudents(id);
    this.compentenceOptions = this.getCompentenceOptions(id);
  }

  onSubmit() {
    this.observationSheet = null;
    const { customAspects, blankDate, title, date, individual, group, aspects, subject, competence, duration, description } = this.sheetForm.value as any;
    const comps = this.competenceCol.filter(c => c.subject == subject && competence?.includes(c.name));

    const competenceMap = competence.map((s: string) => {
      const items = comps.find(c => c.name == s)?.entries || [];

      return {
        fundamental: s,
        items
      };
    });
    const guide: any = {
      user: this.user?._id,
      date: blankDate ? '' : date.split('-').reverse().join('/'),
      title,
      section: group,
      duration,
      individual,
      description,
      competence: competenceMap,
      aspects: customAspects.trim() ? [...aspects, ...customAspects.split(',').map((s: string) => s.trim()).filter((s: string) => s.length)] : aspects,
    };

    this.observationSheet = guide;
  }

  onSave() {
    const guide: any = this.observationSheet;
    this.observationGuideService.create(guide).subscribe(result => {
      if (result._id) {
        this.router.navigate(['/assessments', 'observation-sheets', result._id]).then(() => {
          this.sb.open('Guia guardada con exito.', 'Ok', { duration:2500 });
        });
      }
    })
  }

  getObservedGroupSentence(groupId: string) {
    const starting = [
      'Estudiantes de ',
      'Alumnos de ',
      'Alumnado de ',
      'Estudiantado de ',
      ''
    ];

    const index = Math.round(Math.random() * (starting.length - 1));
    const group = this.groups.find(g => g._id == groupId);
    if (!group)
      return '';

    return starting[index] + group.name;
  }

  subjectLabel(subject: string): string {
    const subjects = [
      { value: 'LENGUA_ESPANOLA', label: 'Lengua Española' },
      { value: 'MATEMATICA', label: 'Matemática' },
      { value: 'CIENCIAS_SOCIALES', label: 'Ciencias Sociales' },
      { value: 'CIENCIAS_NATURALES', label: 'Ciencias de la Naturaleza' },
      { value: 'INGLES', label: 'Inglés' },
      { value: 'FRANCES', label: 'Francés' },
      { value: 'EDUCACION_ARTISTICA', label: 'Educación Artística' },
      { value: 'EDUCACION_FISICA', label: 'Educación Física' },
      { value: 'FORMACION_HUMANA', label: 'Formación Integral Humana y Religiosa' },
    ];
    return subjects.find(s => s.value == subject)?.label || "";
  }

  print() {
    this.sb.open('Guardando como PDF!, por favor espera un momento.', undefined, { duration: 5000 });
    if (this.sheetForm.get('individual')?.value) {
      this.students.forEach((student, i) => {
        setTimeout(() => {
          this.pdfService.createAndDownloadFromHTML("guide-" + i, `Guia de Observación ${student.firstname} ${student.lastname}`);
        }, 3000 * i);
      });
    } else {
      this.pdfService.createAndDownloadFromHTML("guide", `Guia de Observación`);
    }
  }

  loadProfile() {
    this.authService.profile().subscribe(settings => {
      if (settings) {
        this.user = settings;
        this.teacherName = `${settings.title}. ${settings.firstname} ${settings.lastname}`;
        this.schoolName = settings.schoolName;
      }
    });
  }

  loadSections() {
    this.classSectionService.findSections().subscribe(sections => {
      this.groups = sections;
    });
  }

  loadCompetences(id?: string) {
    const sectionId = id || this.sheetForm.get('grade')?.value;
    if (!sectionId) return;

    const section = this.groups.find(g => g._id == sectionId);
    if (!section) return;

    this.competenceService.findByGrade(section.year).subscribe(competence => {
      this.competenceCol = competence;
    });
  }

  loadStudents(id?: string) {
    const section = id || this.sheetForm.get('grade')?.value;
    if (!section)
      return;

    this.studentsService.findBySection(section).subscribe(students => {
      this.students = students;
    });
  }

  getCompentenceOptions(id?: string): string[] {
    const primary = [
      "Comunicativa",
      "Pensamiento Lógico, Creativo y Crítico; Resolución de Problemas; Tecnológica y Científica",
      "Ética y Ciudadana; Desarrollo Personal y Espiritual; Ambiental y de la Salud",
    ];
    const secondary = [
      "Comunicativa",
      "Pensamiento Lógico, Creativo y Crítico",
      "Resolución de Problemas",
      "Tecnológica y Científica",
      "Ética y Ciudadana",
      "Desarrollo Personal y Espiritual",
      "Ambiental y de la Salud",
    ];
    const sectionId = id || this.sheetForm.get('grade')?.value;
    if (!sectionId) {
      return secondary;
    }
    
    const section = this.groups.find(g => g._id == sectionId);
    if (!section) {
      return secondary;
    }
    
    if(section.level == 'PRIMARIA') {
      return primary;
    }

    return secondary;
  }

  get gradeSubjects(): string[] {
    const grade = this.groups.find(g => g._id == this.sheetForm.get('group')?.value);
    if (!grade)
      return [];

    return grade.subjects as any;
  }
}
