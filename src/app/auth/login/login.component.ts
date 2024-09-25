import { Component, inject, OnInit } from '@angular/core';
import { Auth, FacebookAuthProvider, GoogleAuthProvider, signInWithPopup } from '@angular/fire/auth';
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
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { login, loginWithGoogle } from '../../state/actions/auth.actions';

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
  private store = inject(Store);
  user$ = this.store.select(store => store.auth).pipe(map(auth => auth.user));
  auth = inject(Auth);
  sb = inject(MatSnackBar);
  fb = inject(FormBuilder);
  modal = inject(MatDialog);
  router = inject(Router);
  route = inject(ActivatedRoute);

  loading = false;

  loginForm = this.fb.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
  });

  ngOnInit() {
    const referrer = this.route.snapshot.queryParamMap.get('ref');
    if (referrer) {
      localStorage.setItem('referrer', referrer);
    }
  }

  recoverPassword() {
    this.modal.open(RecoverComponent, { width: '100%', maxWidth: '480px' });
  }

  loginWithGoogle() {
    signInWithPopup(this.auth, new GoogleAuthProvider()).then((res) => {
      this.store.dispatch(loginWithGoogle({ email: res.user.email || '', displayName: res.user.displayName || '', photoURL: res.user.photoURL || ''}))
      this.user$.subscribe({
        next: user => {
          if (user) {
            const next = this.route.snapshot.queryParamMap.get('next')
            this.router.navigate([...next?.split('/') || '/app'], { queryParamsHandling: 'preserve' }).then(() => {
              this.sb.open('Bienvenid@ a KitMaestro', 'Ok', { duration: 2500 });
            })
          }
        },
        error: err => {
          console.log(err)
          this.sb.open('Ha ocurrido un error al acceder con tu cuenta. Inténtalo nuevamente, por favor.', 'Ok', { duration: 2500 })
        }
      })
    });
  }

  loginWithFacebook() {
    signInWithPopup(this.auth, new FacebookAuthProvider()).then((res) => {
      this.store.dispatch(loginWithGoogle({ email: res.user.email || '', displayName: res.user.displayName || '', photoURL: res.user.photoURL || '' }))
      this.user$.subscribe({
        next: user => {
          if (user) {
            const next = this.route.snapshot.queryParamMap.get('next')
            this.router.navigate([...next?.split('/') || '/app'], { queryParamsHandling: 'preserve' }).then(() => {
              this.sb.open('Bienvenid@ a KitMaestro', 'Ok', { duration: 2500 });
            })
          }
        },
        error: err => {
          console.log(err)
          this.sb.open('Ha ocurrido un error al acceder con tu cuenta. Inténtalo nuevamente, por favor.', 'Ok', { duration: 2500 })
        }
      })
    })
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.loading = true;
      if (email && password){
        this.store.dispatch(login({ email, password }));
        this.user$.subscribe({
          next: user => {
            if (user) {
              this.router.navigate(this.route.snapshot.queryParamMap.get('next')?.split('/') || ['/app'], { queryParamsHandling: 'preserve' }).then(() => {
                this.sb.open(`Bienvenid@ a KitMaestro!`, undefined, { duration: 2500 });
                this.loading = false;
              })
            }
          },
          error: err => {
            console.log(err);
            this.sb.open('Error al registrarte. Inténtalo de nuevo por favor.', 'Ok', { duration: 2500 });
            this.loading = false;
          }
        })
      }
    }
  }
}
