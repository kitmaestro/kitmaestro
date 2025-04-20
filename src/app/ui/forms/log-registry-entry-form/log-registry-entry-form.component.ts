import { CommonModule, DatePipe } from '@angular/common';
import { Component, Inject, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { LogRegistryEntry } from '../../../interfaces/log-registry-entry';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Student } from '../../../interfaces/student';
import { LogRegistryEntryService } from '../../../services/log-registry-entry.service';
import { ClassSectionService } from '../../../services/class-section.service';
import { AuthService } from '../../../services/auth.service';
import { StudentsService } from '../../../services/students.service';
import { AiService } from '../../../services/ai.service';
import { ClassSection } from '../../../interfaces/class-section';
import { UserSettings } from '../../../interfaces/user-settings';

@Component({
    selector: 'app-log-registry-entry-form',
    imports: [
        MatDialogModule,
        MatButtonModule,
        MatIconModule,
        MatInputModule,
        MatSelectModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        CommonModule,
        MatSnackBarModule,
    ],
    templateUrl: './log-registry-entry-form.component.html',
    styleUrl: './log-registry-entry-form.component.scss'
})
export class LogRegistryEntryFormComponent implements OnInit {
  private dialogRef = inject(MatDialogRef<LogRegistryEntryFormComponent>);
  private fb = inject(FormBuilder);
  private sb = inject(MatSnackBar);
  private logRegistryEntryService = inject(LogRegistryEntryService);
  private aiService = inject(AiService);
  private classSectionService = inject(ClassSectionService);
  private authService = inject(AuthService);
  private studentService = inject(StudentsService);
  user: UserSettings | null = null;
  sections: ClassSection[] = [];
  students: Student[] = [];
  saving = false;
  loading = true;
  generated = false;
  id = '';

  datePipe = new DatePipe('en-US', 'GMT-4');

  eventTypes = [
    'Mejora de comportamiento',
    'Mejora de escritura',
    'Mejora de lectura',
    'Mejora de comprensión',
    'Mejora en matemática',
    'Interrupción de la clase',
    'Salida sin permiso',
    'Comportamiento inadecuado en clase',
    'Pelea',
    'Incumplimiento de acuerdo',
    'Asignación no entregada',
    'Asignación no satisfactoria',
  ];

  placeOptions = [
    'El salón de clases',
    'El baño',
    'El patio',
    'La puerta',
    'La cancha',
    'Casa'
  ];

  generatorForm = this.fb.group({
    type: ['Mejora de comportamiento'],
    section: [''],
    date: [this.datePipe.transform(new Date(), 'YYYY-MM-dd')],
    time: [this.datePipe.transform(new Date(), 'HH:mm')],
    place: ['El salón de clases'],
    students: [''],
  })

  logRegistryEntry: LogRegistryEntry | null = null;

  description = this.fb.control('');
  comments = this.fb.control('');

  constructor(
    @Inject(MAT_DIALOG_DATA)
    private data: LogRegistryEntry,
  ) {}

  loadStudents() {
    const sectionId = this.generatorForm.get('section')?.value;
    if (sectionId) {
      this.studentService.findBySection(sectionId).subscribe(students => this.students = students);
    }
  }

  ngOnInit(): void {
    this.authService.profile().subscribe(user => {
      if (user._id) {
        this.user = user;
        this.loading = false;
      }
    })
    this.classSectionService.findSections().subscribe(col => this.sections = col);
    if (this.data) {
      const {
        _id,
        user,
        date,
        section,
        place,
        students,
        type
      } = this.data;

      const d = new Date((date as any).seconds * 1000);

      this.generatorForm.setValue({
        type,
        section: section._id || '',
        date: this.datePipe.transform(d, 'YYYY-MM-dd'),
        time: this.datePipe.transform(d, 'HH:mm'),
        place,
        students: students.toString(),
      })
    } else {
    }
  }

  studentName(student: Student | string) {
    if (typeof student === 'string') {
      const st = this.students.find(s => s._id === student)
      if (st) {
        return `${st.firstname} ${st.lastname}`;
      }
      return student;
    } else {
      return `${student.firstname} ${student.lastname}`;
    }
  }

  studentNames(students: (Student | string)[]) {
    return students.map(s => this.studentName(s)).join(', ');
  }

  sectionGrade(id: string) {
    const section = this.sections.find(section => section._id === id);
    if (section) {
      return section.year.toLowerCase();
    }
    return id;
  }

  sectionName(id: string) {
    const section = this.sections.find(section => section._id === id);
    if (section) {
      return section.name;
    }
    return '';
  }

  createEntry() {
    if (this.logRegistryEntry) {
      this.saving = true;
      this.logRegistryEntry.description = this.description.value || this.logRegistryEntry.description;
      this.logRegistryEntry.comments = this.comments.value || this.logRegistryEntry.comments;

      this.logRegistryEntryService.create(this.logRegistryEntry).subscribe(res => {
        this.saving = false;
        if (res._id) {
          this.sb.open('Entrada guardada con exito', 'Ok', { duration: 2500 });
          this.dialogRef.close(res);
        }
      });
    }
  }

  reset() {
    this.generated = false;
    this.logRegistryEntry = null;
  }

  generate() {
    this.generated = false;
    const logData: any = this.generatorForm.value;

    const [y,m,d] = logData.date.split('-').map((s: string) => parseInt(s));
    const [h,i] = logData.time.split(':').map((s: string) => parseInt(s));

    this.saving = true;
    const studentNames: string[] = logData.students.map((id: string) => {
      const student = this.students.find(s => s._id === id)
      if (student) {
        return this.studentName(student);
      }
      return '';
    });
    const logPrompt = `Estoy llevando un registro de los avances y de las acciones tanto positivas como negativas de todos mis estudiantes.
Necesito que me ayudes a describir de manera elocuente y con altura profesional el hecho que ha ocurrido hoy, aqui te paso la informacion.
Estudiantes:
- ${studentNames.join('\n- ')}

Accion o acciones a resaltar: ${logData.type.toLowerCase()}

Lugar donde fue observado: ${logData.place.toLowerCase()}

Fecha y hora: ${d}/${m}/${y} a las ${h}:${i} (expresalo en 12 horas, AM/PM).

Responde con un objeto JSON valido con esta interfaz:
{
  description: string,
  comments: string
}

Donde 'description' es el relato en pasado de lo observado y en 'comments' escribas (desde el rol del docente guia) tu interpretacion, comentarios y una breve reflexion sobre el asuto ocurrido.`;
    this.aiService.geminiAi(logPrompt).subscribe(res => {
      const { description, comments } = JSON.parse(res.response.slice(res.response.indexOf('{'), res.response.indexOf('}') + 1).trim()) as { description: string, comments: string };
      const entry: any = {
        description,
        comments,
        date: new Date(y,m - 1,d,h,i),
        place: logData.place,
        type: logData.type,
        user: this.user?._id,
        section: logData.section,
        students: logData.students,
      }
      this.description.setValue(description);
      this.comments.setValue(comments);
      this.logRegistryEntry = entry;
      this.saving = false;
      this.generated = true;
    })
  }
}
