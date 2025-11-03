import { Component, Inject, inject, Input, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
	MAT_DIALOG_DATA,
	MatDialogModule,
	MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { LogRegistryEntryService } from '../../core/services/log-registry-entry.service';
import { LogRegistryEntry } from '../../core';
import { Student } from '../../core/models';
import { StudentsService } from '../../core/services/students.service';
import { ClassSection } from '../../core/models';
import { ClassSectionService } from '../../core/services/class-section.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import {
	createLogRegistryEntrySuccess,
	loadSections,
	loadStudentsBySection,
	selectAllClassSections,
	updateLogRegistryEntry,
	updateLogRegistryEntrySuccess,
} from '../../store';
import { selectSectionStudents } from '../../store/students/students.selectors';
import { Actions, ofType } from '@ngrx/effects';
import { Subject, takeUntil } from 'rxjs';

@Component({
	selector: 'app-log-registry-entry-edit-form',
	imports: [
		ReactiveFormsModule,
		MatFormFieldModule,
		MatSelectModule,
		MatDialogModule,
		MatSnackBarModule,
		MatButtonModule,
		MatIconModule,
		MatInputModule,
	],
	template: `
		<h2 mat-dialog-title>Editar Entrada de Registro Anecdótico</h2>
		<mat-dialog-content>
			<form (ngSubmit)="update()" [formGroup]="entryForm">
				<div
					style="
						display: grid;
						gap: 12px;
						margin-top: 12px;
						grid-template-columns: 1fr 1fr;
					"
				>
					<div>
						<mat-form-field appearance="outline">
							<mat-label>Fecha</mat-label>
							<input
								formControlName="date"
								type="date"
								matInput
							/>
						</mat-form-field>
					</div>
					<div>
						<mat-form-field appearance="outline">
							<mat-label>Hora</mat-label>
							<input
								formControlName="hour"
								type="time"
								matInput
							/>
						</mat-form-field>
					</div>
				</div>
				<div
					style="
						display: grid;
						gap: 12px;
						margin-top: 12px;
						grid-template-columns: 1fr 1fr;
					"
				>
					<div>
						<mat-form-field appearance="outline">
							<mat-label>Lugar</mat-label>
							<mat-select
								formControlName="place"
								(selectionChange)="loadStudents()"
							>
								@for (place of placeOptions; track $index) {
									<mat-option [value]="place">{{
										place
									}}</mat-option>
								}
							</mat-select>
						</mat-form-field>
					</div>
					<div>
						<mat-form-field appearance="outline">
							<mat-label>Evento o Situaci&oacute;n</mat-label>
							<mat-select
								formControlName="type"
								(selectionChange)="loadStudents()"
							>
								@for (type of eventTypes; track $index) {
									<mat-option [value]="type">{{
										type
									}}</mat-option>
								}
							</mat-select>
						</mat-form-field>
					</div>
				</div>
				<div
					style="
						display: grid;
						gap: 12px;
						margin-top: 12px;
						grid-template-columns: 1fr 1fr;
					"
				>
					<div>
						<mat-form-field appearance="outline">
							<mat-label>Curso</mat-label>
							<mat-select
								formControlName="section"
								(selectionChange)="loadStudents()"
							>
								@for (
									section of sections();
									track section._id
								) {
									<mat-option [value]="section._id">{{
										section.name
									}}</mat-option>
								}
							</mat-select>
						</mat-form-field>
					</div>
					<div>
						<mat-form-field appearance="outline">
							<mat-label>Estudiante(s)</mat-label>
							<mat-select formControlName="students" multiple>
								@for (
									student of students();
									track student._id
								) {
									<mat-option [value]="student._id"
										>{{ student.firstname }}
										{{ student.lastname }}</mat-option
									>
								}
							</mat-select>
						</mat-form-field>
					</div>
				</div>
				<div>
					<mat-form-field appearance="outline">
						<mat-label>Descripción</mat-label>
						<textarea
							rows="4"
							formControlName="description"
							matInput
						></textarea>
					</mat-form-field>
				</div>
				<div>
					<mat-form-field appearance="outline">
						<mat-label>Interpretación y Comentarios</mat-label>
						<textarea
							rows="4"
							formControlName="comments"
							matInput
						></textarea>
					</mat-form-field>
				</div>
				<div style="display: flex">
					<button
						mat-button
						style="margin-left: auto"
						type="button"
						(click)="close()"
					>
						Cancelar
					</button>
					<button
						mat-flat-button
						style="margin-left: 6px"
						type="submit"
						(click)="update()"
					>
						Guardar
					</button>
				</div>
			</form>
		</mat-dialog-content>
	`,
	styles: 'mat-form-field {width: 100%;}',
})
export class LogRegistryEntryEditFormComponent implements OnInit {
	#store = inject(Store);
	#actions$ = inject(Actions);
	private dialogRef = inject(MatDialogRef<LogRegistryEntryEditFormComponent>);
	private fb = inject(FormBuilder);
	private data = inject<LogRegistryEntry>(MAT_DIALOG_DATA);

	public entry: LogRegistryEntry | null = null;
	public sections = this.#store.selectSignal(selectAllClassSections);
	public students = this.#store.selectSignal(selectSectionStudents);
	id = '';

	#destroy$ = new Subject<void>();

	eventTypes = [
		'Mejora de comportamiento',
		'Mejora de escritura',
		'Mejora de lectura',
		'Mejora de comprensión',
		'Mejora en matemática',
		'Interrupción de la clase',
		'Salida sin permiso',
		'Comportamiento inadecuado en clase',
		'Pelea',
		'Incumplimiento de acuerdo',
		'Asignación no entregada',
		'Asignación no satisfactoria',
	];

	placeOptions = [
		'El salón de clases',
		'El baño',
		'El patio',
		'La puerta',
		'La cancha',
		'Casa',
	];

	public entryForm = this.fb.group({
		date: [''],
		hour: [''],
		type: [''],
		section: [''],
		place: [''],
		students: [''],
		description: [''],
		comments: [''],
	});

	loadStudents() {
		const sectionId = this.entryForm.get('section')?.value;
		if (sectionId) {
			this.#store.dispatch(loadStudentsBySection({ sectionId }));
		}
	}

	ngOnInit() {
		if (this.data) {
			this.#store.dispatch(loadSections());
			this.loadStudents();
			this.id = this.data._id;
			const data: any = this.data;
			const [date, hour] = new Date(
				+new Date(data.date) - 4 * 60 * 60 * 1000,
			)
				.toISOString()
				.split('T');
			this.entryForm.setValue({
				date,
				hour: hour.slice(0, 5),
				type: data.type,
				section: data.section._id,
				place: data.place,
				students: data.students.map((s: Student) => s._id),
				description: data.description,
				comments: data.comments,
			});
		} else {
			this.dialogRef.close();
		}
	}

	ngOnDestroy() {
		this.#destroy$.next();
		this.#destroy$.complete();
	}

	update() {
		const data: any = this.entryForm.value;
		const [y, M, d] = data.date.split('-');
		const [m, s] = data.hour.split(':');
		const entry: any = {
			date: new Date(y, M, d, m, s),
			type: data.type,
			section: data.section,
			place: data.place,
			students: data.students,
			description: data.description,
			comments: data.comments,
		};
		this.#store.dispatch(
			updateLogRegistryEntry({ id: this.id, data: entry }),
		);
		this.#actions$
			.pipe(
				ofType(updateLogRegistryEntrySuccess),
				takeUntil(this.#destroy$),
			)
			.subscribe(() => {
				this.dialogRef.close();
			});
	}

	close() {
		this.dialogRef.close();
	}
}
