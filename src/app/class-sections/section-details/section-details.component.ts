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
import { Observable } from 'rxjs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { StudentDetailComponent } from '../../student-detail/student-detail.component';
import { ClassSectionFormComponent } from '../../ui/forms/class-section-form/class-section-form.component';
import { StudentFormComponent } from '../../ui/forms/student-form/student-form.component';
import { ClassSectionService } from '../../services/class-section.service';
import { StudentsService } from '../../services/students.service';
import { AuthService } from '../../services/auth.service';
import { ClassSection } from '../../interfaces/class-section';
import * as XLSX from 'xlsx';

@Component({
    selector: 'app-section-details',
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
  students: Student[] = [];

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

  onFileChange(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const workbook = XLSX.read(e.target.result, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      console.log(data);
      this.processData(data);
    };
    reader.readAsBinaryString(file);
  }

  processData(data: any[]) {
    const cols: string[] = data[0];
    const firstnameIndex = cols.findIndex(c => ['name', 'nombre', 'nombres', 'names', 'firstname'].includes(c.trim().toLowerCase()));
    const lastnameIndex = cols.findIndex(c => ['lastname', 'apellido', '', 'apellidos', 'surname'].includes(c.trim().toLowerCase()));
    const genderIndex = cols.findIndex(c => ['genero', 'sexo', 'gender', 'sex'].includes(c.trim().toLowerCase()));
    const birthIndex = cols.findIndex(c => ['fecha de nacimiento', 'fecha'].includes(c.trim().toLowerCase()));
    this.students = data.slice(1).map((row) => {
      const firstname: string = firstnameIndex && row[firstnameIndex] ? row[firstnameIndex] : '';
      const lastname: string = lastnameIndex && row[lastnameIndex] ? row[lastnameIndex] : '';
      const gender = genderIndex && row[genderIndex] ? row[genderIndex] : null;
      const birth = birthIndex && row[birthIndex] ? new Date(row[birthIndex]) : null;
      return {
        firstname,
        lastname,
        gender,
        birth,
        user: this.uid,
        section: this.id,
      } as any;
    });
    console.log(this.students)

    // this.students.forEach(student => {
    //   if (!student.firstname) return;
    //   this.studentService.create(student).subscribe({
    //     next: res => {
    //       if (res._id) {
    //         this.loadStudents()
    //       }
    //     },
    //     error: err => {
    //       this.sb.open('Error al importar un estudiante.', 'Ok', { duration: 2500 });
    //       console.log(err.message)
    //     }
    //   })
    // })
  }
}
