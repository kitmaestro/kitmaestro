import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Auth, authState } from '@angular/fire/auth';
import { CollectionReference, DocumentReference, Firestore, addDoc, collection, collectionData, doc, query, updateDoc, where } from '@angular/fire/firestore';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Observable, map } from 'rxjs';
import { UserSettings } from '../interfaces/user-settings';

@Component({
  selector: 'app-user-settings',
  standalone: true,
  imports: [
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatSelectModule,
    MatButtonModule,
    MatSnackBarModule,
    MatDialogModule,
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
  ],
  templateUrl: './user-settings.component.html',
  styleUrl: './user-settings.component.scss'
})
export class UserSettingsComponent implements OnInit {
  fb = inject(FormBuilder);
  firestore = inject(Firestore);
  auth = inject(Auth);
  user$ = authState(this.auth);
  newUser = true;
  settingsId = '';
  uid = '';
  settingsRef: CollectionReference = collection(this.firestore, 'user-settings');
  sb = inject(MatSnackBar);
  saving = false;

  titleOptions: { Hombre: {value: string, label: string}[], Mujer: { value: string, label: string }[] } = {
    Hombre: [
      { value: 'Licdo', label: 'Licenciado' },
      { value: 'Mtro', label: 'Maestro' },
      { value: 'Dr', label: 'Doctor' },
    ],
    Mujer: [
      { value: 'Licda', label: 'Licenciada' },
      { value: 'Mtra', label: 'Maestra' },
      { value: 'Dra', label: 'Doctora' },
    ],
  }
  gradeOptions = [
    '1ro de Primaria',
    '2do de Primaria',
    '3ro de Primaria',
    '4to de Primaria',
    '5to de Primaria',
    '6to de Primaria',
    '1ro de Secundaria',
    '2do de Secundaria',
    '2ro de Secundaria',
    '4to de Secundaria',
    '5to de Secundaria',
    '6to de Secundaria',
  ];
  subjectOptions = [
    'Lengua Española',
    'Inglés',
    'Francés',
    'Matemática',
    'Ciencias Sociales',
    'Ciencias de la Naturaleza',
    'Educación Artística',
    'Educación Física',
    'Formación Integral Humana y Religiosa',
    'Talleres Optativos',
  ]

  settingsForm = this.fb.group({
    title: ['Licdo'],
    firstname: [''],
    lastname: [''],
    gender: ['Hombre'],
    phone: [''],
    schoolName: [''],
    district: [''],
    regional: [''],
    grades: [''],
    subjects: [''],
  });

  ngOnInit(): void {
    this.user$.subscribe(user => {
      if (user) {
        const { uid } = user;
        this.uid = uid;
        const userSettings = collectionData(
          query(this.settingsRef, where('uid', '==', uid)),
          { idField: 'id' }
        ).pipe(
          map(collection => collection[0])
        ) as Observable<UserSettings | undefined>;

        userSettings.subscribe({
          next: (settings) => {
            if (settings) {
              this.newUser = false;

              const {
                id,
                title,
                firstname,
                lastname,
                gender,
                phone,
                schoolName,
                district,
                regional,
                grades,
                subjects,
              } = settings;

              this.settingsId = id;

              this.settingsForm.setValue({
                title,
                firstname,
                lastname,
                gender,
                phone,
                schoolName,
                district,
                regional,
                grades,
                subjects,
              });
            }
          }, error: (err) => {
            console.log(err)
          }
        })
      }
    });
  }

  onSubmit() {
    const {
      title,
      firstname,
      lastname,
      gender,
      phone,
      schoolName,
      district,
      regional,
      grades,
      subjects,
    } = this.settingsForm.value;

    this.saving = true;

    const settings = {
      uid: this.uid,
      title,
      firstname,
      lastname,
      gender,
      phone,
      schoolName,
      district,
      regional,
      grades,
      subjects,
    } as unknown as UserSettings;

    if (this.newUser) {
      addDoc(this.settingsRef, settings).then(ref => {
        this.sb.open('Guardado!', 'Ok', { duration: 2500 })
        this.saving = false;
      }).then(ref => {
        this.sb.open('Error al guardar.', 'Ok', { duration: 2500 })
        this.saving = false;
      });
    } else {
      const ref = doc(this.settingsRef, this.settingsId) as DocumentReference<UserSettings>;
      updateDoc(ref, {
          uid: this.uid,
          title,
          firstname,
          lastname,
          gender,
          phone,
          schoolName,
          district,
          regional,
          grades,
          subjects
        }).then(ref => {
          this.sb.open('Guardado!', 'Ok', { duration: 2500 })
          this.saving = false;
        }).catch(err => {
          this.sb.open('Error al guardar.', 'Ok', { duration: 2500 })
          this.saving = false;
        })
    }
  }
}
