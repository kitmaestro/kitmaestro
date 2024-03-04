import { Component, inject } from '@angular/core';
import { Auth, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from '@angular/fire/auth';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { BiIconComponent } from '../../ui/bi-icon/bi-icon.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { RecoverComponent } from '../recover/recover.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    RouterModule,
    BiIconComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  auth = inject(Auth);
  sb = inject(MatSnackBar);
  fb = inject(FormBuilder);
  modal = inject(MatDialog);

  loading = false;

  loginForm = this.fb.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
  });

  recoverPassword() {
    this.modal.open(RecoverComponent, { width: '100%', maxWidth: '480px' });
  }

  loginWithGoogle() {
    signInWithPopup(this.auth, new GoogleAuthProvider()).then(console.log).catch(console.log)
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.loading = true;
      if (email && password){
        signInWithEmailAndPassword(this.auth, email, password).then(cred => {
          this.sb.open(`Hola, ${cred.user.displayName ? cred.user.displayName : cred.user.email}`, undefined, { duration: 2500 });
          this.loading = false;
        }).catch(err => {
          console.log(err);
          this.sb.open('Error al iniciar sesión. Inténtalo de nuevo por favor.', 'Ok', { duration: 2500 });
          this.loading = false;
        });
      }
    }
  }
}
