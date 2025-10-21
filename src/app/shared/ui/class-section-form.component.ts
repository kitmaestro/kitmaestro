import { Component, computed, Inject, inject } from '@angular/core';
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
import { ClassSection } from '../../core/models';
import { Store } from '@ngrx/store';
import {
	ClassSectionDto,
	ClassSectionStateStatus,
	createSection,
	selectClassSectionsStatus,
	updateSection,
} from '../../store/class-sections';
import { Actions } from '@ngrx/effects';
import { Subject } from 'rxjs';

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
	],
	template: `
		<h2 mat-dialog-title>{{ data ? 'Editar' : 'Crear' }} Seccion</h2>
		<mat-dialog-content>
			<form (ngSubmit)="onSubmit()" [formGroup]="sectionForm">
				<mat-form-field>
					<mat-label>Nivel</mat-label>
					<mat-select formControlName="level">
						<mat-option value="PREPRIMARIA"
							>Pre Primaria</mat-option
						>
						<mat-option value="PRIMARIA">Primaria</mat-option>
						<mat-option value="SECUNDARIA">Secundaria</mat-option>
					</mat-select>
				</mat-form-field>
				<mat-form-field>
					<mat-label>Grado</mat-label>
					<mat-select formControlName="year">
						<mat-option value="PRIMERO">Primero</mat-option>
						<mat-option value="SEGUNDO">Segundo</mat-option>
						<mat-option value="TERCERO">Tercero</mat-option>
						<mat-option value="CUARTO">Cuarto</mat-option>
						<mat-option value="QUINTO">Quinto</mat-option>
						<mat-option value="SEXTO">Sexto</mat-option>
					</mat-select>
				</mat-form-field>
				<mat-form-field>
					<mat-label>Asignaturas</mat-label>
					<mat-select multiple formControlName="subjects">
						@for (subject of subjectOptions; track subject.value) {
							<mat-option [value]="subject.value">{{
								subject.label
							}}</mat-option>
						}
					</mat-select>
				</mat-form-field>
				<mat-form-field>
					<mat-label>Nombre de la Secci&oacuten</mat-label>
					<input
						type="text"
						placeholder="1ro A"
						formControlName="name"
						required
						matInput
					/>
				</mat-form-field>
				<div style="text-align: end margin-top: 32px">
					<button
						[disabled]="saving() || sectionForm.invalid"
						type="submit"
						mat-raised-button
						color="primary"
					>
						Guardar
					</button>
				</div>
			</form>
		</mat-dialog-content>
	`,
	styles: 'mat-form-field {width: 100%}',
})
export class ClassSectionFormComponent {
	private fb = inject(FormBuilder);
	private dialogRef = inject(MatDialogRef<ClassSectionFormComponent>);
	#store = inject(Store);
	#actions$ = inject(Actions);
	sb = inject(MatSnackBar);
	data = inject<ClassSection | null>(MAT_DIALOG_DATA);
	#status = this.#store.selectSignal(selectClassSectionsStatus);
	saving = computed(
		() =>
			this.#status() === ClassSectionStateStatus.CREATING_SECTION ||
			this.#status() === ClassSectionStateStatus.UPDATING_SECTION,
	);
	id = '';

	sectionForm = this.fb.group({
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

	destroy$ = new Subject<void>();

	constructor() {
		const data = this.data;
		if (data) {
			const { name, level, year, subjects, _id: id } = data;

			this.sectionForm.setValue({
				name: name ? name : '',
				level: level ? level : '',
				year: year ? year : '',
				subjects: subjects ? subjects : [],
			});

			this.id = id || '';
		}
	}

	ngOnDestroy() {
		this.destroy$.next();
		this.destroy$.complete();
	}

	ngOnInit() {
		this.#actions$.pipe().subscribe();
	}

	onSubmit() {
		if (this.sectionForm.valid) {
			const { name, level, year, subjects } = this.sectionForm.value;
			if (!name || !level || !year || !subjects?.length) return;
			if (this.data) {
				const id = this.data._id;
				const data: ClassSectionDto = { name, level, year, subjects };
				this.#store.dispatch(updateSection({ id, data }));
			} else {
				const section: any = { name, level, year, subjects };
				this.#store.dispatch(createSection({ section }));
			}
			this.dialogRef.close();
		}
	}
}
