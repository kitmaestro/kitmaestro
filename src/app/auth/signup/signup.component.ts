import { Component, inject, OnInit } from '@angular/core';
import { Auth, FacebookAuthProvider, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithPopup } from '@angular/fire/auth';
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

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    BiIconComponent,
    RouterModule,
    MatDialogModule
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  auth = inject(Auth);
  sb = inject(MatSnackBar);
  fb = inject(FormBuilder);
  modal = inject(MatDialog);
  router = inject(Router);
  route = inject(ActivatedRoute);

  loading = false;

  confirmation = this.fb.control('');

  signupForm = this.fb.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
  });

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      const referrer = params.get('ref');

      if (referrer) {
        localStorage.setItem('referrer', referrer);
      }
    });
  }

  recoverPassword() {
    this.modal.open(RecoverComponent, { width: '100%', maxWidth: '480px' });
  }

  signupWithGoogle() {
    signInWithPopup(this.auth, new GoogleAuthProvider()).then(() => {
      const next = this.route.snapshot.queryParamMap.get('next')
      this.router.navigate([...next?.split('/') || '/app'], { queryParamsHandling: 'preserve' }).then(() => {
        this.sb.open('Bienvenid@ a KitMaestro', 'Ok', { duration: 2500 });
      })
    }).catch(err => {
      console.log(err)
      this.sb.open('Ha ocurrido un error al acceder con tu cuenta. Inténtalo nuevamente, por favor.', 'Ok', { duration: 2500 })
    })
  }

  signupWithFacebook() {
    signInWithPopup(this.auth, new FacebookAuthProvider()).then(() => {
      const next = this.route.snapshot.queryParamMap.get('next')
      this.router.navigate([...next?.split('/') || '/app'], { queryParamsHandling: 'preserve' }).then(() => {
        this.sb.open('Bienvenid@ a KitMaestro', 'Ok', { duration: 2500 });
      })
    }).catch((err) => {
      console.log(err)
      this.sb.open('Ha ocurrido un error al acceder con tu cuenta. Inténtalo nuevamente, por favor.', 'Ok', { duration: 2500 })
    })
  }

  get validConfirmation() {
    return this.confirmation.value !== '' && this.confirmation.value == this.signupForm.get('password')?.value;
  }

  onSubmit() {
    if (this.signupForm.valid) {
      const { email, password } = this.signupForm.value;
      this.loading = true;
      if (email && password) {
        createUserWithEmailAndPassword(this.auth, email, password).then(cred => {
          this.router.navigate(this.route.snapshot.queryParamMap.get('next')?.split('/') || ['/app'], { queryParamsHandling: 'preserve' }).then(() => {
            this.sb.open(`Bienvenid@ a KitMaestro!`, undefined, { duration: 2500 });
          })
          this.loading = false;
        }).catch(err => {
          console.log(err);
          this.sb.open('Error al registrarte. Inténtalo de nuevo por favor.', 'Ok', { duration: 2500 });
          this.loading = false;
        });
      }
    }
  }
}
