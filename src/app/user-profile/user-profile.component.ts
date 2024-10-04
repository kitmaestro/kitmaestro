import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../services/auth.service';
import { UserSettings } from '../interfaces/user-settings';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatSnackBarModule,
    CommonModule,
    MatIconModule,
    ReactiveFormsModule,
  ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent {
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private sb = inject(MatSnackBar);
  public user: UserSettings | null = null;

  userForm = this.fb.group({
    title: [''],
    firstname: [''],
    lastname: [''],
    username: [''],
    email: [''],
    gender: ['Hombre'],
    phone: [''],
    schoolName: [''],
    district: [''],
    regional: [''],
    refCode: [''],
  });

  titleOptions: { Hombre: { value: string, label: string }[], Mujer: { value: string, label: string }[] } = {
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
  
  ngOnInit() {
    this.authService.profile().subscribe({
      next: user => {
        this.user = user;
        const { title, firstname, lastname, username, email, gender, phone, schoolName, district, regional, photoURL, refCode } = user;
        this.userForm.get('gender')?.setValue(gender || 'Hombre');
        this.userForm.setValue({
          title: title || '',
          firstname: firstname || '',
          lastname: lastname || '',
          username: username || '',
          email: email || '',
          gender: gender || '',
          phone: phone || '',
          schoolName: schoolName || '',
          district: district || '',
          regional: regional || '',
          refCode: refCode || ''
        });
      }
    })
  }

  onSubmit() {
    const profile: any = this.userForm.value;
    this.authService.update(profile).subscribe({
      next: (res) => {
        if (res.modifiedCount == 1) {
          this.sb.open('Perfil actualizado con exito', 'Ok', { duration: 2500 });
        }
      },
      error: err => {
        this.sb.open('Hubo un error al guardar', 'Ok', { duration: 2500 });
      }
    })
  }

  get titles() {
    const gender = this.userForm.get('gender')?.value;
    if (gender == 'Hombre') {
      return this.titleOptions.Hombre;
    }
    return this.titleOptions.Mujer;
  }
}
