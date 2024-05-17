import { Component, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { UserSettingsService } from '../../services/user-settings.service';
import { ClassSectionService } from '../../services/class-section.service';
import { ClassSection } from '../../datacenter/datacenter.component';
// import { COMPETENCE } from '../../lib/competence-filler';
import { CompetenceService } from '../../services/competence.service';
import { ObservationGuideComponent } from '../../ui/observation-guide/observation-guide.component';
import { ObservationGuide, defaultObservationGuide } from '../../interfaces/observation-guide';
import { StudentsService } from '../../services/students.service';
import { Student } from '../../interfaces/student';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PdfService } from '../../services/pdf.service';
import { CompetenceEntry } from '../../interfaces/competence-entry';

@Component({
  selector: 'app-observation-sheet',
  standalone: true,
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

  fb = inject(FormBuilder);
  userSettingsService = inject(UserSettingsService);
  classSectionService = inject(ClassSectionService);
  competenceService = inject(CompetenceService);
  studentsService = inject(StudentsService);
  pdfService = inject(PdfService);
  sb = inject(MatSnackBar);

  teacherName: string = '';
  schoolName: string = '';

  groups: ClassSection[] = [];
  competenceCol: CompetenceEntry[] = [];
  students: Student[] = [];

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

  compentenceOptions: string[] = [
    "Comunicativa",
    "Pensamiento Lógico, Creativo y Crítico; Resolución de Problemas; Tecnológica y Científica",
    "Ética y Ciudadana; Desarrollo Personal y Espiritual; Ambiental y de la Salud",
  ];

  private now = new Date();
  private today = this.now.getFullYear() + '-' + (this.now.getMonth() + 1).toString().padStart(2, '0') + '-' + this.now.getDate().toString().padStart(2, '0');

  observationSheet: ObservationGuide | null = null;

  sheetForm = this.fb.group({
    blankDate: [false],
    date: [this.today],
    individual: [false],
    group: ['', Validators.required],
    description: ['', Validators.required],
    duration: ['90 minutos'],
    competence: [['Comunicativa'], Validators.required],
    subject: ['', Validators.required],
    aspects: [['Interacción entre los estudiantes'], Validators.required],
    customAspects: [''],
  });

  ngOnInit() {
    // COMPETENCE.forEach(comp => this.competenceService.createCompetence(comp as any).subscribe({ next: (e) => { console.log('Created!: ', e) }}));

    this.userSettingsService.getSettings().subscribe(settings => {
      if (settings) {
        this.teacherName = `${settings.title}. ${settings.firstname} ${settings.lastname}`;
        this.schoolName = settings.schoolName;
      }
      this.classSectionService.classSections$.subscribe(classes => {
        this.groups = classes;
        if (classes.length) {
          this.sheetForm.get('group')?.setValue(classes[0].id);
          this.onGradeSelect();
          const subs = this.competenceService.findByGrade(classes[0].grade).subscribe(
            {
              next: (col) => {
                this.competenceCol = col;
                subs.unsubscribe();
              }
            }
          );
        }
      });
    });
  }

  onGradeSelect() {
    const groupId = this.sheetForm.get('group')?.value;
    const grade = this.groups.find(g => g.id == groupId)?.grade;
    if (groupId) {
      if (grade) {
        const subs = this.competenceService.findByGrade(grade).subscribe(
          {
            next: (col) => {
              this.competenceCol = col;
              subs.unsubscribe();
            }
          }
        );
      }
      this.studentsService.bySection(groupId).subscribe(
        {
          next: (students) => {
            this.students = students;
          }
        }
      );
    }
  }

  onSubmit() {
    this.observationSheet = null;
    const guide: ObservationGuide = defaultObservationGuide;
    const { customAspects, blankDate, date, individual, group, aspects, subject, competence, duration, description } = this.sheetForm.value;
    // const grade = this.groups.find(g => g.id == group)?.grade;
    const comps = this.competenceCol.filter(c => c.subject == subject && competence?.includes(c.name));
    
    guide.aspects = aspects as string[];

    if (customAspects) {
      const custom = customAspects.split(',').map(s => s.trim()).filter(s => s.length);
      if (custom.length) {
        guide.aspects.push(
          ...custom
        );
      }
    }

    if (blankDate) {
      guide.date = '';
    } else {
      if (date) {
        guide.date = date.split('-').reverse().join('/');
      }
    }

    if (individual && group) {
      guide.groupId = group;
      guide.groupName = '';
    } else {
      if (group) {
        guide.groupId = '';
        guide.groupName = this.getObservedGroupSentence(group);
      }
    }

    if (duration) {
      guide.duration = duration;
    }

    if (description) {
      guide.description = description;
    }

    if (competence) {
      guide.competence = competence.map(s => {
        const items = comps.find(c => c.name == s)?.entries || [];

        return {
          fundamental: s,
          items
        };
      });
    }

    this.observationSheet = guide;
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
    const group = this.groups.find(g => g.id == groupId);
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

  get gradeSubjects(): string[] {
    const grade = this.groups.find(g => g.id == this.sheetForm.get('group')?.value);
    if (!grade)
      return [];

    return grade.subjects as any;
  }

  print() {
    this.sb.open('Imprimiendo como PDF!, por favor espera un momento.', undefined, { duration: 5000 });
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
}
