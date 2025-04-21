import { DialogRef } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth.service';

@Component({
	selector: 'app-recover',
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
	styleUrl: './recover.component.scss',
})
export class RecoverComponent {
	private fb = inject(FormBuilder);
	private sb = inject(MatSnackBar);
	private dialogRef = inject(DialogRef<RecoverComponent>);
	private authService = inject(AuthService);

	email = this.fb.control('', [Validators.email, Validators.required]);

	onSubmit() {
		const email = this.email.value;
		if (!email) return;

		this.authService.recover(email.trim()).subscribe({
			next: (res) => {
				console.log(res);
				this.sb.open(
					'El correo de recuperacion ha sido enviado!',
					'Ok',
					{ duration: 2500 },
				);
				this.dialogRef.close();
			},
			error: (err) => {
				console.log(err.message);
				this.sb.open(
					'Ha ocurrido un problema. Intentalo de nuevo.',
					'Ok',
					{ duration: 2500 },
				);
			},
		});
	}
}
