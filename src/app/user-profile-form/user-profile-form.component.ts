import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Auth, authState, updateProfile } from '@angular/fire/auth';
import { Storage, getDownloadURL, ref, uploadBytesResumable } from '@angular/fire/storage';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { tap } from 'rxjs';

@Component({
  selector: 'app-user-profile-form',
  standalone: true,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    MatIconModule,
    CommonModule,
  ],
  templateUrl: './user-profile-form.component.html',
  styleUrl: './user-profile-form.component.scss'
})
export class UserProfileFormComponent {
  fb = inject(FormBuilder);
  storage = inject(Storage);
  auth = inject(Auth);
  user$ = authState(this.auth).pipe(tap(user => user && user.displayName ? this.profileForm.get('displayName')?.setValue(user?.displayName) : null));
  sb = inject(MatSnackBar);

  saving = false;

  profileForm = this.fb.group({
    displayName: [''],
  })

  onSubmit() {
    const { displayName } = this.profileForm.value;
    if (displayName) {
      this.user$.subscribe(user => {
        if (user) {
          updateProfile(user, { displayName }).then(() => {
            this.sb.open('Nombre de usuario actualizado!', 'Ok', { duration: 2500 });
          }).catch(() => {
            this.sb.open('Error actualizando el nombre de usuario.', 'Ok', { duration: 2500 });
          })
        }
      })
    }
  }

  uploadPic(input: HTMLInputElement) {
    if (!input.files)
      return;

    this.user$.subscribe(user => {
      if (user) {
        const pic = input.files?.item(0);
        if (pic) {
          this.saving = true;
          const storageRef = ref(this.storage, pic.name);
          uploadBytesResumable(storageRef, pic).then(async result => {
            const photoURL = await getDownloadURL(storageRef);
            updateProfile(user, { photoURL }).then(() => {
              this.sb.open('Foto de perfil actualizada!', 'Ok', { duration: 2500 });
              this.saving = false;
            }).catch(() => {
              this.sb.open('Error subiendo la foto.', 'Ok', { duration: 2500 });
              this.saving = false;
            })
          }).catch(err => {
            this.sb.open('Error subiendo la foto.', 'Ok', { duration: 2500 });
            this.saving = false;
          })
        }
      }
    })
  }
}
