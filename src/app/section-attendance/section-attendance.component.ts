import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore, collection, collectionData, doc, docData, getDoc, orderBy, query, where } from '@angular/fire/firestore';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Observable, lastValueFrom, map, merge, zip } from 'rxjs';
import { ClassSection } from '../datacenter/datacenter.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { Attendance } from '../attendance';
import { Student } from '../student';

@Component({
  selector: 'app-section-attendance',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatTableModule,
    RouterModule,
    ReactiveFormsModule,
    CommonModule,
    MatPaginatorModule,
    MatIconModule,
  ],
  templateUrl: './section-attendance.component.html',
  styleUrl: './section-attendance.component.scss'
})
export class SectionAttendanceComponent {
  auth = inject(Auth);
  firestore = inject(Firestore);
  router = inject(Router);
  route = inject(ActivatedRoute);
  
  id = this.route.snapshot.paramMap.get('id');
  today = new Date();
  currentYear = this.today.getFullYear();
  currentMonth = this.today.getMonth();

  displayedCols = ['Estudiante'];

  cols: string[] = [];
  
  section$ = docData(doc(this.firestore, 'class-sections/' + this.id), { idField: 'id' }) as Observable<ClassSection>;
  students$ = collectionData(query(collection(this.firestore, 'students'), where('section', '==', this.id), orderBy('firstname', 'asc'))) as Observable<Student[]>;
  attendance$ = zip(collectionData(
    query(
      collection(this.firestore, 'student-attendance'),
      where('section', '==', this.id),
      where('month', '==', this.currentMonth)
    )
  ) as unknown as Observable<Attendance[]>, this.students$).pipe(
    map((zip) => {
      const attendance = zip[0] as Attendance[];
      const students = zip[1] as Student[];

      return attendance.map(row => {
        const student = students.find(s => s.id == row.student);
        if (student) {
          row.student = student.firstname + ' ' + student.lastname;
        }
        return row;
      })
    })
  );

  months = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre'
  ];

  days = [
    'Domingo',
    'Lunes',
    'Martes',
    'Miercoles',
    'Jueves',
    'Viernes',
    'Sabado',
  ];

  setAttendance(attend: string, date: number) {
  }

  constructor() {
    this.fillTable(this.currentYear, this.currentMonth);
  }

  daysInMonth(month: number, year: number) {
    if ([0, 2, 4, 6, 7, 9, 11].includes(month)) {
      return 31;
    } else if (month == 1) {
      if ((0 == year % 4) && (0 != year % 100) || (0 == year % 400)) {
        return 29;
      } else {
        return 28;
      }
    } else {
      return 30;
    }
  }
  
  fillTable(year: number, month: number) {
    const days = this.daysInMonth(this.currentMonth, this.currentYear);
    const cols = ['Estudiante'];
    for (let i = 0; i < days; i++) {
      const day = (new Date(year, month, i + 1)).getDay();
      if (day == 0 || day == 6) {
        continue;
      }
      const date = ['D', 'L', 'M', 'M', 'J', 'V', 'S'][day] + ' ' + String(i + 1).padStart(2, '0');
      cols.push(date);
    }
    this.cols = cols;
    this.displayedCols = cols;
  }

  prevMonth() {
    if (this.currentMonth == 0) {
      this.currentMonth = 11;
      this.currentYear -= 1;
    } else {
      this.currentMonth -= 1;
    }
    this.fillTable(this.currentYear, this.currentMonth);
  }

  nextMonth() {
    if (this.currentMonth == 11) {
      this.currentMonth = 0;
      this.currentYear += 1;
    } else {
      this.currentMonth += 1;
    }
    this.fillTable(this.currentYear, this.currentMonth);
  }
}
