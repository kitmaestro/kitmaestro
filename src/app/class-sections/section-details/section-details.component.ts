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

  id = this.route.snapshot.paramMap.get('id');
  uid: string = '';
  section$ = this.classSectionService.findSection(this.id || '');
  students$ = of([]) as Observable<Student[]>;

  displayedCols = ['firstname', 'lastname', 'actions'];

  studentForm = this.fb.group({
    firstname: ['', Validators.required],
    lastname: ['', Validators.required],
    uid: ['', Validators.required],
    section: [this.id, Validators.required]
  });

  ngOnInit(): void {
  }

  updateSectionDetails() {
    const sus = this.section$.subscribe(section => {
      if (section) {
        sus.unsubscribe();
        this.dialog.open(ClassSectionFormComponent, {
          data: section,
        })
        this.dialog.afterAllClosed.subscribe(() => {
          this.section$ = this.classSectionService.findSection(this.id || '');
        })
      }
    })
  }

  addStudent() {
    this.dialog.open(StudentFormComponent, {
      data: {
        uid: this.uid,
        section: this.id,
      }
    })
  }

  updateStudent(student: Student) {
    this.dialog.open(StudentFormComponent, {
      data: student
    })
  }

  removeStudent(id: string) {
  }

  removeSection() {
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
