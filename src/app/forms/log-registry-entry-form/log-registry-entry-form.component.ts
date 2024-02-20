import { CommonModule, DatePipe } from '@angular/common';
import { Component, Inject, OnInit, inject } from '@angular/core';
import { Auth, authState } from '@angular/fire/auth';
import { Firestore, addDoc, collection, collectionData, query, where } from '@angular/fire/firestore';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { LogRegistryEntry } from '../../interfaces/log-registry-entry';
import { EMPTY, Observable, tap } from 'rxjs';
import { ClassSection } from '../../datacenter/datacenter.component';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Student } from '../../interfaces/student';
import { LogRegistryEntryService } from '../../services/log-registry-entry.service';

@Component({
  selector: 'app-log-registry-entry-form',
  standalone: true,
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
  dialogRef = inject(MatDialogRef<LogRegistryEntryFormComponent>);
  fb = inject(FormBuilder);
  auth = inject(Auth);
  user$ = authState(this.auth);
  firestore = inject(Firestore);
  sb = inject(MatSnackBar);
  logRegistryEntryService = inject(LogRegistryEntryService);
  logRegistryEntriesCollectionRef = collection(this.firestore, 'log-registry-entries');
  classSectionsCollectionRef = collection(this.firestore, 'class-sections');
  studentsCollectionRef = collection(this.firestore, 'students');
  classSections$: Observable<ClassSection[]> = EMPTY;
  students$: Observable<Student[]> = EMPTY;
  sections: ClassSection[] = [];
  students: Student[] = [];
  selectedStudents: Student[] = [];
  saving = false;
  loading = true;
  generated = false;
  newEntry = true;
  uid = '';
  id = '';

  datePipe = new DatePipe('en-US', 'GMT-4');

  eventTypes = [
    { id: 'behavior', label: 'Mejora de comportamiento' },
    { id: 'writing', label: 'Mejora de escritura' },
    { id: 'reading', label: 'Mejora de lectura' },
    { id: 'comprehension', label: 'Mejora de comprensión' },
    { id: 'math', label: 'Mejora en matemática' },
    { id: 'irruption', label: 'Interrupción de la clase' },
    { id: 'leave', label: 'Salida sin permiso' },
    { id: 'misbehavior', label: 'Comportamiento inadecuado en clase' },
    { id: 'fight', label: 'Pelea' },
    { id: 'broken_agreement', label: 'Incumplimiento de acuerdo' },
    { id: 'pending_homework', label: 'Asignación no entregada' },
    { id: 'failed_assesment', label: 'Asignación no satisfactoria' },
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
    type: ['behavior'],
    grade: [''],
    date: [this.datePipe.transform(new Date(), 'YYYY-MM-dd')],
    time: [this.datePipe.transform(new Date(), 'HH:mm')],
    place: ['El salón de clases'],
    students: [''],
  })

  logRegistryEntry: LogRegistryEntry | null = null;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    private data: LogRegistryEntry,
  ) {}

  ngOnInit(): void {
    if (this.data) {
      const {
        id,
        uid,
        date,
        grade,
        place,
        students,
        description,
        comments,
        type
      } = this.data;

      const d = new Date((date as any).seconds * 1000);

      this.generatorForm.setValue({
        type,
        grade,
        date: this.datePipe.transform(d, 'YYYY-MM-dd'),
        time: this.datePipe.transform(d, 'HH:mm'),
        place,
        students: students.toString(),
      })

      this.uid = uid;
      this.id = id;
      this.newEntry = false; 
      this.classSections$ = collectionData(query(this.classSectionsCollectionRef, where('uid', '==', this.uid)), { idField: 'id' }) as Observable<ClassSection[]>;
      this.classSections$.pipe(
        tap(col => this.sections = col)
      );
      this.students$ = collectionData(query(this.studentsCollectionRef, where('uid', '==', this.uid)), { idField: 'id' }) as Observable<Student[]>;
      this.loadStudents()
    } else {
      this.user$.subscribe(user => {
        if (user) {
          this.uid = user.uid;
          this.classSections$ = collectionData(query(this.classSectionsCollectionRef, where('uid', '==', this.uid)), { idField: 'id' }) as Observable<ClassSection[]>;
          this.classSections$.pipe(
            tap(col => this.sections = col)
          );
          this.students$ = collectionData(query(this.studentsCollectionRef, where('uid', '==', this.uid)), { idField: 'id' }) as Observable<Student[]>;
          this.loadStudents()
        }
      })
    }
  }

  loadStudents() {
    this.students$.subscribe(students => {
      this.students = students;
      this.loading = false;
    })
  }

  studentName(id: string) {
    const student = this.students.find(student => student.id == id);
    if (student) {
      return `${student.firstname} ${student.lastname}`;
    }
    return '';
  }

  sectionName(id: string) {
    const section = this.sections.find(section => section.id == id);
    if (section) {
      return section.name;
    }
    return '';
  }

  studentOptions(): Student[] {
    const grade = this.generatorForm.get('grade')?.value;
    if (grade) {
      return this.students.filter(student => student.section == grade);
    }
    return [];
  }

  createEntry() {
    if (this.logRegistryEntry) {
      this.saving = true;
      const entry = this.logRegistryEntry;
      entry.grade = this.generatorForm.get('grade')?.value || entry.grade;
      entry.students = this.selectedStudents.map(s => s.id);

      addDoc(this.logRegistryEntriesCollectionRef, entry).then(() => {
        this.saving = false;
        this.sb.open('Entrada registrada!', 'Ok', { duration: 2500});
        this.dialogRef.close();
      }).catch(() => {
        this.saving = false;
        this.sb.open('Registro fallido.', 'Ok', { duration: 2500});
      });
    }
  }

  reset() {
    this.generated = false;
    this.logRegistryEntry = null;
  }

  generate() {
    const {
      type,
      students,
      grade,
      date,
      time,
      place
    } = this.generatorForm.value;
    
    if (!students || !type || !date || !time || !grade || !place) return;

    const [y,m,d] = date?.split('-').map(s => parseInt(s));
    const [h,i] = time?.split(':').map(s => parseInt(s));

    this.saving = true;

    const student: Student[] = this.students.filter(s => students.length == 1 && s.id == students[0] || students.includes(s.id));
    this.selectedStudents = this.students.filter(s => students.includes(s.id));

    this.logRegistryEntryService.getLog(type, student).subscribe(result => {
      if (result) {
        this.logRegistryEntry = {
          students: student.map(s => `${s.firstname} ${s.lastname}`),
          comments: result.comments,
          description: result.description,
          date: new Date(y,m,d,h,i),
          grade,
          place,
          type,
          uid: this.uid
        } as any;
        this.generated = true;
      }
      this.saving = false;
    });

  }
}
