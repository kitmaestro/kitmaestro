import { Component, OnInit, inject } from '@angular/core';
import { Student } from '../../interfaces/student';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Observable, of } from 'rxjs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { StudentDetailComponent } from '../../student-detail/student-detail.component';
import { ClassSectionFormComponent } from '../../ui/forms/class-section-form/class-section-form.component';
import { StudentFormComponent } from '../../ui/forms/student-form/student-form.component';
import { ClassSectionService } from '../../services/class-section.service';
import { StudentsService } from '../../services/students.service';
import { AuthService } from '../../services/auth.service';
import { ClassSection } from '../../interfaces/class-section';

@Component({
  selector: 'app-section-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatSnackBarModule,
    MatDialogModule,
    MatChipsModule,
  ],
  templateUrl: './section-details.component.html',
  styleUrl: './section-details.component.scss'
})
export class SectionDetailsComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private sb = inject(MatSnackBar);
  private fb = inject(FormBuilder);
  private dialog = inject(MatDialog);
  private classSectionService = inject(ClassSectionService);
  private studentService = inject(StudentsService);
  private authService = inject(AuthService);

  id = this.route.snapshot.paramMap.get('id') || '';
  uid: string = '';
  section: ClassSection | null = null;
  students$: Observable<Student[]> = this.studentService.findBySection(this.id);

  displayedCols = ['firstname', 'lastname', 'gender', 'birth', 'actions'];

  studentForm = this.fb.group({
    firstname: ['', Validators.required],
    lastname: ['', Validators.required],
    gender: ['Masculino', Validators.required],
    birth: [''],
    user: ['', Validators.required],
    section: [this.id, Validators.required]
  });

  loadStudents() {
    this.students$ = this.studentService.findBySection(this.id);
  }

  loadSection() {
    this.classSectionService.findSection(this.id).subscribe(section => this.section = section);4
  }

  ngOnInit(): void {
    this.authService.profile().subscribe(user => {
      this.uid = user._id;
    });
    this.loadSection();
  }

  updateSectionDetails() {
    const ref = this.dialog.open(ClassSectionFormComponent, {
      data: this.section,
    })
    ref.afterClosed().subscribe(() => {
      this.loadSection();
    })
  }

  addStudent() {
    const ref = this.dialog.open(StudentFormComponent, {
      data: {
        user: this.uid,
        section: this.id,
      }
    })
    ref.afterClosed().subscribe(() => this.loadStudents());
  }

  updateStudent(student: Student) {
    const ref = this.dialog.open(StudentFormComponent, {
      data: student
    })
    ref.afterClosed().subscribe(() => this.loadStudents());
  }

  removeStudent(id: string) {
    this.studentService.delete(id).subscribe(result => {
      if (result.deletedCount == 1) {
        this.sb.open('Estudiante eliminado')
        this.loadStudents();
      }
    })
  }

  removeSection() {
    this.classSectionService.deleteSection(this.id).subscribe(() => {
      this.router.navigate(['/sections']).then(() => {
        this.sb.open('Se elimino la seccion.', 'Ok', { duration: 2500 });
      });
    });
  }

  showStudent(student: Student) {
    this.dialog.open(StudentDetailComponent, {
      data: student,
    });
  }

  formatValue(value: string) {
    return value ? value.split('_').map(s => s[0] + s.slice(1).toLowerCase().split('').join('')).join(' ') : '';
  }
}
