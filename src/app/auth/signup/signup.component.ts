import { Component, inject } from '@angular/core';
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
import { loginWithGoogle, signup } from '../../state/actions/auth.actions';

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
    MatDialogModule,
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  private auth = inject(Auth);
  private store = inject(Store);
  private sb = inject(MatSnackBar);
  private fb = inject(FormBuilder);
  private modal = inject(MatDialog);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  public user$ = this.store.select(store => store.auth).pipe(map(auth => auth.user));

  loading = false;

  confirmation = this.fb.control('');

  signupForm = this.fb.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
  });

  constructor() {}

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

  signupWithFacebook() {
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

  get validConfirmation() {
    return this.confirmation.value !== '' && this.confirmation.value == this.signupForm.get('password')?.value;
  }

  onSubmit() {
    if (this.signupForm.valid) {
      const { email, password } = this.signupForm.value;
      this.loading = true;
      if (email && password) {
        this.store.dispatch(signup({ email, password }));
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
