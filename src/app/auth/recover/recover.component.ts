import { DialogRef } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { Auth, sendPasswordResetEmail } from '@angular/fire/auth';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-recover',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
  ],
  templateUrl: './recover.component.html',
  styleUrl: './recover.component.scss'
})
export class RecoverComponent {
  auth = inject(Auth);
  fb = inject(FormBuilder);
  sb = inject(MatSnackBar);
  dialogRef = inject(DialogRef<RecoverComponent>);

  email = this.fb.control('', [Validators.email]);

  onSubmit() {
    const email = this.email.value;
    if (!email) return;

    sendPasswordResetEmail(this.auth, email)
      .then(() => {
        this.sb.open('El correo de recuperacion ha sido enviado!', 'Ok', { duration: 3500 });
        this.dialogRef.close();
      })
      .catch(() => this.sb.open('Ha ocurrido un problema. Intentalo de nuevo.', 'Ok', { duration: 3500 }));
  }
}
