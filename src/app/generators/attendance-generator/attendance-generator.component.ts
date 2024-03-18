import { Component, inject } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { IsPremiumComponent } from '../../ui/alerts/is-premium/is-premium.component';
import { InProgressComponent } from '../../ui/alerts/in-progress/in-progress.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { StudentsService } from '../../services/students.service';
import { ClassSectionService } from '../../services/class-section.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { tap } from 'rxjs';

interface Student {
  name: string;
  attendanceProbability: number;
  justifiedProbability: number;
  onTimeProbability: number;
}

interface AttendanceRecord {
  id: number;
  name: string;
  attendance: Array<'P' | 'A' | 'T' | 'E'>;
}

@Component({
  selector: 'app-attendance-generator',
  standalone: true,
  imports: [
    IsPremiumComponent,
    InProgressComponent,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatTableModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatIconModule,
    AsyncPipe,
    CommonModule,
  ],
  templateUrl: './attendance-generator.component.html',
  styleUrl: './attendance-generator.component.scss'
})
export class AttendanceGeneratorComponent {

  fb = inject(FormBuilder);
  studentsService = inject(StudentsService);
  classSectionService = inject(ClassSectionService);
  
  sections$ = this.classSectionService.classSections$.pipe(tap(s => this.section.setValue(s[0] ? s[0].id : '')));

  working = true;
  displayedColumns = ['id', 'name'];
  attendanceRecords: AttendanceRecord[] = [];

  studentsForm = this.fb.group({
    students: this.fb.array([
      this.fb.group({
        name: [''],
        attendanceProbability: [90],
        justifiedProbability: [90],
        onTimeProbability: [80],
      })
    ])
  });
  numberOfDays = this.fb.control(15);
  numberOfStudents = this.fb.control(1);
  section = this.fb.control('', Validators.required);

  generateAttendance(students: Student[], numberOfDays: number): AttendanceRecord[] {
    const attendanceRecords: AttendanceRecord[] = [];

    students.forEach((student, index) => {
      const attendance: Array<'P' | 'A' | 'T' | 'E'> = [];

      for (let i = 0; i < numberOfDays; i++) {
        const randomNumber = Math.random() * 100; // Generate a random number between 0 and 100

        if (randomNumber < student.attendanceProbability) {
          const lateNumber = Math.random() * 100; // Generate a random number between 0 and 100 for tardiness
          if (lateNumber < student.onTimeProbability) {
            attendance.push('P'); // Present
          } else {
            attendance.push('T'); // Late
          }
        } else {
          const justifiedNumber = Math.random() * 100; // Generate a random number between 0 and 100 for justification
          if (justifiedNumber < student.justifiedProbability) {
            attendance.push('E'); // Excused absence
          } else {
            attendance.push('A'); // Absent
          }
        }
      }

      attendanceRecords.push({
        id: index + 1,
        name: student.name,
        attendance: attendance
      });
    });

    return attendanceRecords;
  }

  onSubmit() {
    if (this.studentsForm.valid) {
      const students = (this.studentsForm.value.students) as any as Student[];
      const numberOfDays = this.numberOfDays.value || 15;
      this.displayedColumns = ['id', 'name'];
      for (let i = 0; i < numberOfDays; i++) {
        this.displayedColumns.push('day-' + i);
      }
      this.displayedColumns.push('Presente', 'Tardanza', 'Ausente', 'Excusa')
      this.attendanceRecords = this.generateAttendance(students, numberOfDays);
    }
  }

  importStudents() {
    const section = this.section.value;
    if (!section)
      return;

    this.students.clear();

    const sus = this.studentsService.bySection(section).subscribe({
      next: students => {
        students.forEach(student => {
          const control = this.fb.group({
            name: [student.firstname + ' ' + student.lastname],
            attendanceProbability: [90],
            justifiedProbability: [90],
            onTimeProbability: [80],
          });
          this.students.push(control);
        })
      }, complete() {
        sus.unsubscribe();
      }
    });
  }

  addStudent() {
    const qty = this.numberOfStudents.value;
    if (!qty)
      return;
    
    for (let i = 0; i < qty; i++) {
      const control = this.fb.group({
        name: [''],
        attendanceProbability: [90],
        justifiedProbability: [90],
        onTimeProbability: [80],
      });
      this.students.push(control);
    }
  }

  removeStudent(index: number) {
    this.students.removeAt(index);
  }

  presence(attendance: string[]) {
    return attendance.filter(a => a == 'P').length;
  }

  late(attendance: string[]) {
    return attendance.filter(a => a == 'T').length;
  }

  unattend(attendance: string[]) {
    return attendance.filter(a => a == 'A').length;
  }

  letter(attendance: string[]) {
    return attendance.filter(a => a == 'E').length;
  }

  get students() {
    return this.studentsForm.get('students') as FormArray;
  }
}
