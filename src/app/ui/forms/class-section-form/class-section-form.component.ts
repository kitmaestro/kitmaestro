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
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ClassSectionService } from '../../../services/class-section.service';
import { ClassSection } from '../../../interfaces/class-section';
import { SchoolService } from '../../../services/school.service';
import { School } from '../../../interfaces/school';

@Component({
	selector: 'app-class-section-form',
	imports: [
		MatDialogModule,
		ReactiveFormsModule,
		MatButtonModule,
		MatInputModule,
		MatFormFieldModule,
		MatSelectModule,
		MatSnackBarModule,
		CommonModule,
	],
	templateUrl: './class-section-form.component.html',
	styleUrl: './class-section-form.component.scss',
})
export class ClassSectionFormComponent {
	private fb = inject(FormBuilder);
	private dialogRef = inject(MatDialogRef<ClassSectionFormComponent>);
	private classSectionService = inject(ClassSectionService);
	private schoolService = inject(SchoolService);
	sb = inject(MatSnackBar);
	saving = false;
	id = '';

	schools: School[] = [];

	sectionForm = this.fb.group({
		school: ['', Validators.required],
		name: ['', Validators.required],
		level: ['', Validators.required],
		year: ['', Validators.required],
		subjects: [[] as string[], Validators.required],
	});

	subjectOptions: { label: string; value: string }[] = [
		{ value: 'LENGUA_ESPANOLA', label: 'Lengua Española' },
		{ value: 'MATEMATICA', label: 'Matemática' },
		{ value: 'CIENCIAS_SOCIALES', label: 'Ciencias Sociales' },
		{ value: 'CIENCIAS_NATURALES', label: 'Ciencias de la Naturaleza' },
		{ value: 'INGLES', label: 'Inglés' },
		{ value: 'FRANCES', label: 'Francés' },
		{ value: 'EDUCACION_ARTISTICA', label: 'Educación Artística' },
		{ value: 'EDUCACION_FISICA', label: 'Educación Física' },
		{
			value: 'FORMACION_HUMANA',
			label: 'Formación Integral Humana y Religiosa',
		},
		{ value: 'TALLERES_OPTATIVOS', label: 'Talleres Optativos' },
	];

	constructor(
		@Inject(MAT_DIALOG_DATA)
		public data: ClassSection,
	) {
		if (data) {
			const { school, name, level, year, subjects, _id: id } = data;

			this.sectionForm.setValue({
				school: school ? school._id : '',
				name: name ? name : '',
				level: level ? level : '',
				year: year ? year : '',
				subjects: subjects ? subjects : [],
			});

			this.id = id || '';
		}
		this.schoolService
			.findAll()
			.subscribe((schools) => (this.schools = schools));
	}

	onSubmit() {
		if (this.sectionForm.valid) {
			this.saving = true;
			const { school, name, level, year, subjects } =
				this.sectionForm.value;
			if (this.data) {
				this.classSectionService
					.updateSection(this.id, {
						school,
						name,
						level,
						year,
						subjects,
					})
					.subscribe((res) => {
						if (res.modifiedCount === 1) {
							this.sb.open(
								'Sección actualizada con éxito.',
								'Ok',
								{ duration: 2500 },
							);
							this.dialogRef.close(res);
						}
					});
			} else {
				const section: any = { school, name, level, year, subjects };
				this.classSectionService
					.addSection(section)
					.subscribe((result) => {
						this.sb.open('Sección creada con éxito.', 'Ok', {
							duration: 2500,
						});
						this.dialogRef.close(result);
					});
			}
		}
	}
}
