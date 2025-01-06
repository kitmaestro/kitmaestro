import { Component, OnInit, inject } from '@angular/core';
import { Auth, GoogleAuthProvider, confirmPasswordReset, signInWithPopup, verifyPasswordResetCode } from '@angular/fire/auth';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BiIconComponent } from '../../ui/bi-icon/bi-icon.component';

@Component({
    selector: 'app-pass-update',
    imports: [
        RouterModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatCardModule,
        MatIconModule,
        BiIconComponent,
    ],
    templateUrl: './pass-update.component.html',
    styleUrl: './pass-update.component.scss'
})
export class PassUpdateComponent implements OnInit {
  route = inject(ActivatedRoute);
  router = inject(Router);
  auth = inject(Auth);
  fb = inject(FormBuilder);
  sb = inject(MatSnackBar);

  mode = this.route.snapshot.queryParamMap.get('mode');
  oob = this.route.snapshot.queryParamMap.get('oobCode');
  // apiKey = this.route.snapshot.queryParamMap.get('apiKey');

  email = this.fb.control({ value: '', disabled: true }, [Validators.email]);
  password = this.fb.control('', [Validators.minLength(6)]);
  confirmation = this.fb.control('', [Validators.minLength(6)]);

  loading = true;

  ngOnInit(): void {
    if (this.mode !== 'resetPassword') {
      this.router.navigate(['/auth', 'login']);
      return;
    }
    if (!this.oob)
      return;
    
    verifyPasswordResetCode(this.auth, this.oob).then(email => {
      this.email.setValue(email);
      this.loading = false;
    })//.catch(err => this.router.navigate(['/']).then(() => this.sb.open('Codigo de recuperacion invalido.', 'Ok', { duration: 2500 })));
  }
  
  onSubmit() {
    const oob = this.oob;
    const password = this.password.value;

    if (!oob || !password)
      return;

    this.loading = true;

    confirmPasswordReset(this.auth, oob, password).then(() => {
      this.sb.open('Tu clave ha sido actualizada, ya puedes iniciar sesion.', 'Ok', { duration: 2500 });
      this.router.navigate(['/app']);
    }).catch(err => {
      this.sb.open('Hubo un error al actualizar la clave. Intentalo de nuevo.', 'Ok', { duration: 2500 });
      this.loading = false;
    });
  }

  loginWithGoogle() {
    signInWithPopup(this.auth, new GoogleAuthProvider()).then((cred) => {
      if (cred) {
        this.sb.open('Hola, ' + (cred.user.displayName ? cred.user.displayName : cred.user.email) + '!', 'Ok', { duration: 2500 });
        this.router.navigate(['/app']);
      }
    }).catch(err => this.sb.open('Algo salio mal, intentalo de nuevo.', 'Ok', ))
  }
}
