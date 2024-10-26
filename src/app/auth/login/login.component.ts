import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BiIconComponent } from '../../ui/bi-icon/bi-icon.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { RecoverComponent } from '../recover/recover.component';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../services/auth.service';

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
export class LoginComponent implements OnInit {
  private authService = inject(AuthService);
  sb = inject(MatSnackBar);
  fb = inject(FormBuilder);
  modal = inject(MatDialog);
  router = inject(Router);
  route = inject(ActivatedRoute);

  loading = false;
  referrer = '';

  loginForm = this.fb.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
  });

  ngOnInit() {
    const jwt = this.route.snapshot.paramMap.get('jwt');
    if (jwt) {
      localStorage.setItem('access_token', jwt);
      // const next = this.route.snapshot.queryParamMap.get('next');
      // this.router.navigate([...next?.split('/') || '/'], { queryParamsHandling: 'preserve' }).then(() => {
        // this.sb.open('Bienvenid@ a KitMaestro', 'Ok', { duration: 2500 });
      // })
    }
    const referrer = localStorage.getItem('ref') || this.route.snapshot.queryParamMap.get('ref');
    if (referrer) {
      this.referrer = referrer;
      localStorage.setItem('ref', referrer);
    }
  }

  recoverPassword() {
    this.modal.open(RecoverComponent, { width: '100%', maxWidth: '480px' });
  }

  loginWithGoogle() {
    window.location.href = environment.apiUrl + 'auth/google' + this.referrer ? `?ref=${this.referrer}` : '';
  }

  loginWithFacebook() {
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.loading = true;
      if (email && password){
        this.authService.login(email, password).subscribe({
          next: result => {
            if (result.error) {
              this.sb.open('Error al iniciar sesion: ' + result.error == "Cannot read properties of null (reading 'passwordHash')" ? 'El usuario no existe' : 'Error en el usuario o contraseña.', 'ok', { duration: 2500 });
              this.loading = false;
            } else {
              this.router.navigate(this.route.snapshot.queryParamMap.get('next')?.split('/') || ['/'], { queryParamsHandling: 'preserve' }).then(() => {
                this.sb.open(`Bienvenid@ a KitMaestro!`, undefined, { duration: 2500 });
                this.loading = false;
              })
            }
          },
          error: err => {
            console.log(err);
            this.sb.open('Error al iniciar sesion. Inténtalo de nuevo por favor.', 'Ok', { duration: 2500 });
            this.loading = false;
          }
        })
      }
    }
  }
}
