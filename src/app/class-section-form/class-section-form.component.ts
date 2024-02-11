import { Component, Inject, inject } from '@angular/core';
import { Auth, authState } from '@angular/fire/auth';
import { Firestore, addDoc, collection, doc, query, setDoc, where } from '@angular/fire/firestore';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ClassSection } from '../datacenter/datacenter.component';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-class-section-form',
  standalone: true,
  imports: [
    MatDialogModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSnackBarModule,
    CommonModule,
  ],
  templateUrl: './class-section-form.component.html',
  styleUrl: './class-section-form.component.scss'
})
export class ClassSectionFormComponent {
  fb = inject(FormBuilder);
  dialogRef = inject(MatDialogRef<ClassSectionFormComponent>);
  firestore = inject(Firestore);
  auth = inject(Auth);
  sb = inject(MatSnackBar);
  saving = false;
  sectionColRef = collection(this.firestore, 'class-sections');
  id: string = '';

  sectionForm = this.fb.group({
    name: ['', Validators.required],
    level: ['', Validators.required],
    grade: ['', Validators.required],
    subjects: ['', Validators.required],
  });

  subjectOptions: { label: string; value: string }[] = [
    { value: 'LENGUA_ESPANOLA', label: 'Lengua Española' },
    { value: 'MATEMATICA', label: 'Matemática' },
    { value: 'CIENCIAS_SOCIALES', label: 'Ciencias Sociales' },
    { value: 'CIENCIAS_NATURALES', label: 'Ciencias de la Naturaleza' },
    { value: 'INGLES', label: 'Inglés' },
    { value: 'FRANCES', label: 'Francés' },
    { value: 'EDUCACION_ARTISTICA', label: 'Educación Artística' },
    { value: 'EDUCACION_FISICA', label: 'Educación Física' },
    { value: 'FORMACION_HUMANA', label: 'Formación Integral Humana y Religiosa' },
    { value: 'TALLERES_OPTATIVOS', label: 'Talleres Optativos' },
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: ClassSection,
  ) {
    if (data) {
      const { name, level, grade, subjects, id } = data;

      this.sectionForm.setValue({
        name, level, grade, subjects
      });

      this.id = id;
    }
  }

  onSubmit() {
    if (this.sectionForm.valid) {
      this.saving = true;
      const { name, level, grade, subjects } = this.sectionForm.value;

      authState(this.auth).subscribe(user => {
        if (user) {
          if (this.data) {
            const sectionRef = doc(this.firestore, 'class-sections/' + this.id);
            const updated = { name, level, grade, subjects, id: this.id, uid: user.uid } as ClassSection;
            setDoc(sectionRef, updated).then((docRef) => {
              this.sb.open('Sección actualizada con éxito.', 'Ok', { duration: 2500 });
              this.dialogRef.close(docRef);
            });
          } else {
            addDoc(this.sectionColRef, <ClassSection> { name, level, grade, subjects, uid: user.uid }).then(docRef => {
              this.sb.open('Sección creada con éxito.', 'Ok', { duration: 2500 });
              this.dialogRef.close(docRef);
            });
          }
        }
      })
    }
  }
}
