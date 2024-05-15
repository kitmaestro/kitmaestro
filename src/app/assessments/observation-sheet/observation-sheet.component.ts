import { Component, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
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
import { CompetenceEntry } from '../../interfaces/competence-entry';
import { CompetenceService } from '../../services/competence.service';

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
  ],
  templateUrl: './observation-sheet.component.html',
  styleUrl: './observation-sheet.component.scss'
})
export class ObservationSheetComponent implements OnInit {

  fb = inject(FormBuilder);
  userSettingsService = inject(UserSettingsService);
  classSectionService = inject(ClassSectionService);
  competenceService = inject(CompetenceService);

  teacherName: string = '';
  schoolName: string = '';

  groups: ClassSection[] = [];

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

  sheetForm = this.fb.group({
    blankDate: [false],
    date: [this.today],
    individual: [false],
    group: [''],
    description: [''],
    duration: ['90 minutos'],
    competence: [['Comunicativa']],
    subject: [''],
    aspects: [[0]],
    customAspects: [''],
  });

  ngOnInit() {
    const competence = [] as any as CompetenceEntry[];

    competence.forEach(comp => this.competenceService.createCompetence(comp).subscribe({ next: (e) => { console.log('Created!: ', e) }}));

    this.userSettingsService.getSettings().subscribe(settings => {
      if (settings) {
        this.teacherName = `${settings.title}. ${settings.firstname} ${settings.lastname}`;
        this.schoolName = settings.schoolName;
      }
      this.classSectionService.classSections$.subscribe(classes => {
        this.groups = classes;
        if (classes.length) {
          this.sheetForm.get('group')?.setValue(classes[0].id);
          this.competenceService.findByGrade(classes[0].grade).subscribe(console.log);
        }
      });
    });
  }

  onSubmit() {
    const sheet = null;
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
}
