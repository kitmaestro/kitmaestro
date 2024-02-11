import { Component, OnInit, inject } from '@angular/core';
import { Student } from '../interfaces/student';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Auth, authState } from '@angular/fire/auth';
import { Firestore, addDoc, collectionData, deleteDoc, docData, orderBy } from '@angular/fire/firestore';
import { collection, doc, getDoc, query, where } from '@firebase/firestore';
import { ClassSection } from '../datacenter/datacenter.component';
import { Observable } from 'rxjs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { StudentDetailComponent } from '../student-detail/student-detail.component';
import { ClassSectionFormComponent } from '../class-section-form/class-section-form.component';
import { StudentFormComponent } from '../student-form/student-form.component';

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

  route = inject(ActivatedRoute);
  router = inject(Router);
  sb = inject(MatSnackBar);
  fb = inject(FormBuilder);
  auth = inject(Auth);
  firestore = inject(Firestore);
  dialog = inject(MatDialog);

  id = this.route.snapshot.paramMap.get('id');
  uid: string = '';
  sectionColRef = collection(this.firestore, 'class-sections');
  studentColRef = collection(this.firestore, 'students');
  sectionRef = doc(this.firestore, 'class-sections/' + this.id);
  section$ = docData(this.sectionRef, { idField: 'id' }) as Observable<ClassSection>;
  studentQuery = query(this.studentColRef, where('section', '==', this.id), orderBy('firstname', 'asc'));
  students$ = collectionData(this.studentQuery, { idField: 'id' }) as Observable<Student[]>;

  displayedCols = ['firstname', 'lastname', 'actions'];

  studentForm = this.fb.group({
    firstname: ['', Validators.required],
    lastname: ['', Validators.required],
    uid: ['', Validators.required],
    section: [this.id, Validators.required]
  });

  ngOnInit(): void {
    authState(this.auth).subscribe(user => {
      if (user) {
        this.uid = user.uid;
        this.studentForm.get('uid')?.setValue(user.uid);
      }
    })
  }

  updateSectionDetails() {
    const sus = this.section$.subscribe(section => {
      if (section) {
        sus.unsubscribe();
        this.dialog.open(ClassSectionFormComponent, {
          data: section,
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
    const docRef = doc(this.firestore, 'students/' + id);
    deleteDoc(docRef).then(() => {
      this.sb.open('El estudiante ha sido eliminado.', 'Ok', { duration: 2500 });
    });
  }

  removeSection() {
    const sus = this.students$.subscribe({
      next: async students => {
        sus.unsubscribe();
        for (let student of students) {
          await deleteDoc(doc(this.firestore, 'students/' + student.id))
        }
        deleteDoc(this.sectionRef).then(() => {
          this.router.navigate(['/datacenter', 'sections']).then(() => {
            this.sb.open('La Seccion ha sido eliminado', 'Ok', { duration: 2500 });
          });
        })
      }
    })
  }

  showStudent(student: Student) {
    this.dialog.open(StudentDetailComponent, {
      data: student,
    });
  }

  formatValue(value: string) {
    return value.split('_').map(s => s[0] + s.slice(1).toLowerCase().split('').join('')).join(' ');
  }
}
