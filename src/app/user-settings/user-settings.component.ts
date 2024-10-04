import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { map, Observable } from 'rxjs';
import { UserSettings } from '../interfaces/user-settings';
import { UserSettingsService } from '../services/user-settings.service';

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
  userSettingsService = inject(UserSettingsService);
  user$: Observable<UserSettings> = this.userSettingsService.getSettings();
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
    regional: ['']
  });

  ngOnInit(): void {
    this.user$.subscribe(settings => {
      if (settings) {
        const {
          title,
          firstname,
          lastname,
          gender,
          phone,
          schoolName,
          district,
          regional
        } = settings;

        this.settingsForm.setValue({
          title: title ? title : 'Licdo',
          firstname: firstname ? firstname : '',
          lastname: lastname ? lastname : '',
          gender: gender ? gender : 'Hombre',
          phone: phone ? phone : '',
          schoolName: schoolName ? schoolName : '',
          district: district ? district : '',
          regional: regional ? regional : ''
        });
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
      regional
    } = this.settingsForm.value;

    const settings = {
      title,
      firstname,
      lastname,
      gender,
      phone,
      schoolName,
      district,
      regional
    } as unknown as UserSettings;
    
    this.userSettingsService.update(settings).subscribe({
      next: (res) => {
        if (res.modifiedCount == 1) {
          this.sb.open('Perfil actualizado con exito', 'Ok', { duration: 2500 });
        }
      },
      error: (err) => {
        this.sb.open('Error al guardar su perfil', 'Ok', { duration: 2500 });
      }
    });
  }
}
