import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
	MAT_DIALOG_DATA,
	MatDialogModule,
	MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { StudentsService } from '../../core/services/students.service';

@Component({
	selector: 'app-student-form',
	imports: [
		ReactiveFormsModule,
		RouterModule,
		MatInputModule,
		MatFormFieldModule,
		MatButtonModule,
		MatDialogModule,
		MatSelectModule,
		MatSnackBarModule,
	],
	template: `
		<h2 mat-dialog-title>{{ id ? 'Editar' : 'Registrar' }} Estudiante</h2>
		<mat-dialog-content>
			<form (ngSubmit)="onSubmit()" [formGroup]="studentForm">
				<mat-form-field>
					<mat-label>Nombre(s)</mat-label>
					<input type="text" formControlName="firstname" matInput />
				</mat-form-field>
				<mat-form-field>
					<mat-label>Apellido(s)</mat-label>
					<input type="text" formControlName="lastname" matInput />
				</mat-form-field>
				<mat-form-field>
					<mat-label>Sexo</mat-label>
					<mat-select formControlName="gender">
						<mat-option value="Masculino">Masculino</mat-option>
						<mat-option value="Femenino">Femenino</mat-option>
					</mat-select>
				</mat-form-field>
				<mat-form-field>
					<mat-label>Fecha de Nacimiento</mat-label>
					<input type="date" formControlName="birth" matInput />
				</mat-form-field>
				<div style="margin-top: 20px">
					<button
						type="submit"
						style="margin-left: auto; display: block"
						mat-raised-button
						color="primary"
					>
						Guardar
					</button>
				</div>
			</form>
		</mat-dialog-content>
	`,
	styles: `
		mat-form-field {
			width: 100%;
		}
	`,
})
export class StudentFormComponent {
	private fb = inject(FormBuilder);
	private sb = inject(MatSnackBar);
	private dialogRef = inject(MatDialogRef<StudentFormComponent>);
	private studentService = inject(StudentsService);

	id = '';

	studentForm = this.fb.group({
		firstname: ['', Validators.required],
		lastname: ['', Validators.required],
		gender: ['Masculino', Validators.required],
		birth: [''],
		user: ['', Validators.required],
		section: ['', Validators.required],
	});

	constructor(
		@Inject(MAT_DIALOG_DATA)
		public data: any,
	) {
		if (data._id) {
			this.id = data._id;
			this.studentForm.get('firstname')?.setValue(data.firstname);
			this.studentForm.get('lastname')?.setValue(data.lastname);
			this.studentForm.get('gender')?.setValue(data.gender);
			this.studentForm
				.get('birth')
				?.setValue(
					new Date(+new Date(data.birth) - 1000 * 60 * 60 * 24)
						.toISOString()
						.split('T')[0],
				);
		}
		this.studentForm.get('user')?.setValue(data.user);
		this.studentForm.get('section')?.setValue(data.section);
	}

	onSubmit() {
		if (this.studentForm.valid) {
			const student: any = this.studentForm.value;
			student.birth = new Date(
				+new Date(student.birth) + 1000 * 60 * 60 * 24,
			);
			if (this.id) {
				this.studentService
					.update(this.id, student)
					.subscribe((result) => this.dialogRef.close(result));
			} else {
				this.studentService
					.create(student)
					.subscribe((result) => this.dialogRef.close(result));
			}
		}
	}
}
