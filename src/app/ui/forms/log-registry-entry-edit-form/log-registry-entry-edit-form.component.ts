import { Component, Inject, inject, Input, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { LogRegistryEntryService } from '../../../services/log-registry-entry.service';
import { LogRegistryEntry } from '../../../interfaces/log-registry-entry';
import { Student } from '../../../interfaces/student';
import { StudentsService } from '../../../services/students.service';
import { ClassSection } from '../../../interfaces/class-section';
import { ClassSectionService } from '../../../services/class-section.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
    selector: 'app-log-registry-entry-edit-form',
    imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatSelectModule,
        MatDialogModule,
        MatSnackBarModule,
        MatButtonModule,
        MatIconModule,
        MatInputModule,
    ],
    templateUrl: './log-registry-entry-edit-form.component.html',
    styleUrl: './log-registry-entry-edit-form.component.scss'
})
export class LogRegistryEntryEditFormComponent implements OnInit {
  private logService = inject(LogRegistryEntryService);
  private sectionService = inject(ClassSectionService);
  private dialogRef = inject(MatDialogRef<LogRegistryEntryEditFormComponent>);
  private studentService = inject(StudentsService);
  private sb = inject(MatSnackBar);
  private fb = inject(FormBuilder);
  public entry: LogRegistryEntry | null = null;
  public sections: ClassSection[] = [];
  public students: Student[] = [];
  id = '';

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

  public entryForm = this.fb.group({
    date: [''],
    hour: [''],
    type: [''],
    section: [''],
    place: [''],
    students: [''],
    description: [''],
    comments: [''],
  });

  constructor(
    @Inject(MAT_DIALOG_DATA)
    private data: LogRegistryEntry,
  ) { }

  loadStudents() {
    const sectionId = this.entryForm.get('section')?.value;
    if (sectionId) {
      this.studentService.findBySection(sectionId).subscribe(students => this.students = students);
    } else {
      this.students = [];
    }
  }

  ngOnInit() {
    this.sectionService.findSections().subscribe(sections => this.sections = sections);
    if (this.data) {
      this.id = this.data._id;
      const data: any = this.data;
      const [date, hour] = new Date(+(new Date(data.date)) - 4 * 60 * 60 * 1000).toISOString().split('T');
      this.entryForm.setValue({
        date,
        hour: hour.slice(0, 5),
        type: data.type,
        section: data.section._id,
        place: data.place,
        students: data.students.map((s: Student) => s._id),
        description: data.description,
        comments: data.comments
      });
      this.loadStudents();
    } else {
      this.dialogRef.close();
    }
  }

  update() {
    const data: any = this.entryForm.value;
    const [y,M,d] = data.date.split('-');
    const [m,s] = data.hour.split(':');
    const entry: any = {
      date: new Date(y,M,d,m,s),
      type: data.type,
      section: data.section,
      place: data.place,
      students: data.students,
      description: data.description,
      comments: data.comments,
    }
    this.logService.update(this.id, entry).subscribe(res => {
      if (res.modifiedCount === 1) {
        this.sb.open('Entrada modificada exitosamente.', 'Ok', { duration: 2500 });
        this.close();
      }
    });
  }

  close() {
    this.dialogRef.close()
  }
}
