import { Component, Inject, inject } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { CollectionReference, addDoc, collection, doc, setDoc } from '@firebase/firestore';

@Component({
  selector: 'app-student-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatDialogModule,
    MatSnackBarModule,
  ],
  templateUrl: './student-form.component.html',
  styleUrl: './student-form.component.scss'
})
export class StudentFormComponent {
  firestore = inject(Firestore);
  fb = inject(FormBuilder);
  sb = inject(MatSnackBar);
  dialogRef = inject(MatDialogRef<StudentFormComponent>);

  id = '';

  sectionRef: CollectionReference | null = null;

  studentForm = this.fb.group({
    firstname: ['', Validators.required],
    lastname: ['', Validators.required],
    uid: ['', Validators.required],
    section: ['', Validators.required],
  });
  
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: any,
    ) {
    if (data.id) {
      this.id = data.id;
      this.studentForm.get('firstname')?.setValue(data.firstname);
      this.studentForm.get('lastname')?.setValue(data.lastname);
    }
    this.studentForm.get('uid')?.setValue(data.uid);
    this.studentForm.get('section')?.setValue(data.section);
  }

  onSubmit() {
    if (this.studentForm.valid) {
      const { firstname, lastname, uid, section } = this.studentForm.value;
      if (this.id) {
        const updated = { firstname, lastname, uid, section, id: this.id };
        setDoc(doc(this.firestore, 'students/' + this.id), updated).then(() => {
          this.sb.open('Estudiante guardado exitosamente.', 'Ok', { duration: 2500 });
          this.dialogRef.close();
        })
      } else {
        const student = { firstname, lastname, uid, section };
        addDoc(collection(this.firestore, 'students'), student).then(() => {
          this.sb.open('Estudiante guardado exitosamente.', 'Ok', { duration: 2500 });
          this.dialogRef.close();
        });
      }
    }
  }
}
