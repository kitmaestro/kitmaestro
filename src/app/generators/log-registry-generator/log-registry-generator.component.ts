import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { InProgressComponent } from '../../in-progress/in-progress.component';
import { Chart, registerables } from 'chart.js';
import { ChartComponent } from '../../ui/chart/chart.component';
import { LogRegistryEntry } from '../../interfaces/log-registry-entry';
import { Auth, authState } from '@angular/fire/auth';
import { Firestore, collection, collectionData, deleteDoc, doc, query, where } from '@angular/fire/firestore';
import { EMPTY, Observable } from 'rxjs';
import { DocumentData } from '@angular/fire/compat/firestore';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { LogRegistryEntryFormComponent } from '../../forms/log-registry-entry-form/log-registry-entry-form.component';
import { LogRegistryEntryDetailsComponent } from './log-registry-entry-details.component';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { ClassSection } from '../../datacenter/datacenter.component';
import { Student } from '../../interfaces/student';

@Component({
  selector: 'app-log-registry-generator',
  standalone: true,
  imports: [
    InProgressComponent,
    ChartComponent,
    MatDialogModule,
    MatSnackBarModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    CommonModule,
  ],
  templateUrl: './log-registry-generator.component.html',
  styleUrl: './log-registry-generator.component.scss'
})
export class LogRegistryGeneratorComponent implements OnInit {
  auth = inject(Auth);
  firestore = inject(Firestore);
  sb = inject(MatSnackBar);
  dialog = inject(MatDialog);
  user$ = authState(this.auth);
  entriesColRef = collection(this.firestore, 'log-registry-entries');
  entries$: Observable<LogRegistryEntry[]> = EMPTY;
  sectionsRef = collection(this.firestore, 'class-sections');
  studentsRef = collection(this.firestore, 'students');
  sections$: Observable<ClassSection[]> = EMPTY;
  students$: Observable<Student[]> = EMPTY;
  sections: ClassSection[] = [];
  students: Student[] = [];
  loading = true;

  labels = ['date', 'time', 'grade', 'students', 'event', 'actions'];

  data = {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [{
      label: '# of Votes',
      data: [12, 19, 3, 5, 2, 3],
      borderWidth: 1
    }]
  };

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

  ngOnInit(): void {
    this.user$.subscribe(user => {
      if (user) {
        this.entries$ = collectionData(query(this.entriesColRef, where('uid', '==', user.uid)), { idField: 'id' }) as Observable<LogRegistryEntry[]>;
        this.sections$ = collectionData(query(this.sectionsRef, where('uid', '==', user.uid)), { idField: 'id' }) as Observable<ClassSection[]>;
        this.students$ = collectionData(query(this.studentsRef, where('uid', '==', user.uid)), { idField: 'id' }) as Observable<Student[]>;
        this.sections$.subscribe(sections => {
          this.sections = sections;
        })
        this.students$.subscribe(students => {
          this.students = students;
        })
        this.loading = false;
      }
    })
  }

  createLogRegistryEntry() {
    this.dialog.open(LogRegistryEntryFormComponent, {
      minWidth: '400px',
      width: '75%'
    });
  }
  
  editLogRegistryEntry(entry: LogRegistryEntry) {
    this.dialog.open(LogRegistryEntryFormComponent, {
      data: entry,
    });
  }

  showLogRegistryEntry(entry: LogRegistryEntry) {
    const ref = this.dialog.open(LogRegistryEntryDetailsComponent, { data: entry });
    
    ref.afterClosed().subscribe(result => {
      if (result) {
        this.editLogRegistryEntry(entry);
      }
    });
  }

  entryDate(entry: any) {
    return new Date(entry.date.seconds * 1000);
  }

  sectionName(section: string) {
    return this.sections.find(s => s.id == section)?.name;
  }

  studentsName(student: string[]) {
    const str = student.map(s => this.students.find(stu => stu.id == s)?.firstname).join(', ')
    return str;
  }

  eventTypeLabel(id: string) {
    return this.eventTypes.find(e => e.id == id)?.label;
  }

  deleteLogRegistryEntry(entry: LogRegistryEntry) {
    const docRef = doc(this.firestore, 'log-registry-entries/' + entry.id);
    deleteDoc(docRef).then(() => {
      this.sb.open('Entrada eliminada!', 'Ok', { duration: 2500 });
    }).catch(() => {
      this.sb.open('Error al eliminar.', 'Ok', { duration: 2500 });
    })
  }
}
