import { Component, OnInit, effect, inject, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
	MAT_DIALOG_DATA,
	MatDialogModule,
	MatDialogRef,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { LogRegistryEntry } from '../../core';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Student } from '../../core/models';
import { LogRegistryEntryDto } from '../../store/log-registry-entries/log-registry-entries.models';
import { Store } from '@ngrx/store';
import {
	askGemini,
	createLogRegistryEntry,
	createLogRegistryEntrySuccess,
	loadSections,
	loadStudentsBySection,
	selectAiIsGenerating,
	selectAiSerializedResult,
	selectAllClassSections,
	selectAuthUser,
	selectIsLoadingSections,
} from '../../store';
import {
	selectAllStudents,
	selectSectionStudents,
} from '../../store/students/students.selectors';
import { selectIsCreating } from '../../store/log-registry-entries/log-registry-entries.selectors';
import { Actions, ofType } from '@ngrx/effects';
import { Subject, take, takeUntil } from 'rxjs';
import { DatePipe } from '@angular/common';

@Component({
	selector: 'app-log-registry-entry-form',
	imports: [
		MatDialogModule,
		MatButtonModule,
		MatIconModule,
		MatInputModule,
		MatSelectModule,
		MatFormFieldModule,
		ReactiveFormsModule,
		FormsModule,
		DatePipe,
	],
	template: `
		<h2 mat-dialog-title>Generar Registro Anecd&oacute;tico</h2>
		<mat-dialog-content>
			@if (generated) {
				@if (logRegistryEntry; as entry) {
					<div>
						<table style="width: 100%">
							<thead>
								<tr>
									<th scope="col" colspan="4">
										Registro Anecd&oacute;tico
									</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<th>Fecha:</th>
									<td>
										{{ entry.date | date: 'dd/MM/yyyy' }}
									</td>
									<th>Hora:</th>
									<td>{{ entry.date | date: 'hh:mm a' }}</td>
								</tr>
								<tr>
									<th colspan="2">Estudiante(s)</th>
									<td colspan="2">
										{{ studentNames(entry.students) }}
									</td>
								</tr>
								<tr>
									<th colspan="4">
										Descripción del incidente, del hecho o
										situación:
									</th>
								</tr>
								<tr>
									<td colspan="4">
										<mat-form-field>
											<textarea
												[(ngModel)]="description"
												matInput
											></textarea>
										</mat-form-field>
									</td>
								</tr>
								<tr>
									<th colspan="4">
										Interpretación y comentarios
									</th>
								</tr>
								<tr>
									<td colspan="4">
										<mat-form-field>
											<textarea
												[(ngModel)]="comments"
												matInput
											></textarea>
										</mat-form-field>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				}
			} @else {
				<form [formGroup]="generatorForm">
					<mat-form-field appearance="outline">
						<mat-label>Evento</mat-label>
						<mat-select formControlName="type" required>
							@for (eventType of eventTypes; track $index) {
								<mat-option [value]="eventType">
									{{ eventType }}
								</mat-option>
							}
						</mat-select>
					</mat-form-field>
					<mat-form-field appearance="outline">
						<mat-label>Lugar</mat-label>
						<mat-select formControlName="place" required>
							@for (place of placeOptions; track $index) {
								<mat-option [value]="place">{{
									place
								}}</mat-option>
							}
						</mat-select>
					</mat-form-field>
					<div style="display: flex">
						<div style="width: 50%; padding-right: 8px">
							<mat-form-field appearance="outline">
								<mat-label>Grado</mat-label>
								<mat-select
									(selectionChange)="loadStudents()"
									formControlName="section"
									required
								>
									@for (section of sections(); track $index) {
										<mat-option [value]="section._id">{{
											section.name
										}}</mat-option>
									}
								</mat-select>
							</mat-form-field>
						</div>
						<div style="width: 50%; padding-left: 8px">
							<mat-form-field appearance="outline">
								<mat-label>Estudiante(s)</mat-label>
								<mat-select
									[multiple]="true"
									formControlName="students"
									required
								>
									@for (
										student of students();
										track student._id
									) {
										<mat-option [value]="student._id">{{
											student.firstname +
												' ' +
												student.lastname
										}}</mat-option>
									}
								</mat-select>
							</mat-form-field>
						</div>
					</div>
					<div style="display: flex">
						<div style="width: 50%; padding-right: 8px">
							<mat-form-field appearance="outline">
								<mat-label>Fecha</mat-label>
								<input
									type="date"
									matInput
									formControlName="date"
									required
								/>
							</mat-form-field>
						</div>
						<div style="width: 50%; padding-left: 8px">
							<mat-form-field appearance="outline">
								<mat-label>Hora</mat-label>
								<input
									type="time"
									matInput
									formControlName="time"
									required
								/>
							</mat-form-field>
						</div>
					</div>
				</form>
			}

			<mat-dialog-actions>
				@if (generated) {
					<button (click)="reset()" mat-button>Reiniciar</button>
				}
				<button
					[disabled]="
						generatorForm.invalid ||
						saving() ||
						loading() ||
						generating()
					"
					(click)="generate()"
					mat-button
				>
					{{ generated ? 'Regenerar' : 'Generar' }}
				</button>
				@if (generated) {
					<button
						(click)="createEntry()"
						mat-flat-button
						[disabled]="saving() || generating()"
						color="primary"
					>
						Guardar
					</button>
				}
			</mat-dialog-actions>
		</mat-dialog-content>
	`,
	styles: `
		form {
			margin-top: 12px;
			padding: 12px 0 0;
		}

		mat-form-field {
			width: 100%;
		}
	`,
})
export class LogRegistryEntryFormComponent implements OnInit {
	#store = inject(Store);
	#actions$ = inject(Actions);
	private dialogRef = inject(MatDialogRef<LogRegistryEntryFormComponent>);
	private data = inject<LogRegistryEntry>(MAT_DIALOG_DATA);
	private fb = inject(FormBuilder);
	user = this.#store.selectSignal(selectAuthUser);
	sections = this.#store.selectSignal(selectAllClassSections);
	students = this.#store.selectSignal(selectSectionStudents);
	saving = this.#store.selectSignal(selectIsCreating);
	loading = this.#store.selectSignal(selectIsLoadingSections);
	generating = this.#store.selectSignal(selectAiIsGenerating);
	generated = false;
	generatedData = this.#store.selectSignal(selectAiSerializedResult);
	id = '';

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

	generatorForm = this.fb.group({
		type: ['Mejora de comportamiento'],
		section: [''],
		date: [new Date().toISOString().split('T')[0]],
		time: [new Date().toISOString().split('T')[1].split('.')[0]],
		place: ['El salón de clases'],
		students: [''],
	});

	logRegistryEntry: LogRegistryEntry | null = null;

	description = signal('');
	comments = signal('');

	constructor() {
		effect(() => {
			const result: { description: string; comments: string } =
				this.generatedData();
			const formData: {
				type: string;
				section: string;
				date: string;
				time: string;
				place: string;
				students: string;
			} = this.generatorForm.getRawValue() as any;
			const [y, m, d] = formData.date.split('-').map((s) => +s);
			const [h, i] = formData.time.split(':').map((s) => +s);
			if (result) {
				const { description, comments } = result;
				this.description.set(description);
				this.comments.set(comments);
				const entry: any = {
					description,
					comments,
					date: new Date(y, m - 1, d, h, i),
					place: formData.place,
					type: formData.type,
					user: this.user()?._id,
					section: formData.section,
					students: formData.students,
				};
				this.logRegistryEntry = entry;
				this.generated = true;
			}
		});
	}

	loadStudents() {
		const sectionId = this.generatorForm.get('section')?.value;
		if (sectionId) {
			this.#store.dispatch(loadStudentsBySection({ sectionId }));
		}
	}

	#destroy$ = new Subject<void>();

	ngOnInit(): void {
		this.#store.dispatch(loadSections());
		if (this.data) {
			const { date, section, place, students, type } = this.data;
			const d = new Date((date as any).seconds * 1000);

			this.generatorForm.setValue({
				type,
				section: section._id || '',
				date: d.toISOString().split('T')[0],
				time: d.toISOString().split('T')[1],
				place,
				students: students.toString(),
			});
		}
	}

	studentName(student: Student | string) {
		if (typeof student === 'string') {
			const st = this.students().find((s) => s._id === student);
			if (st) {
				return `${st.firstname} ${st.lastname}`;
			}
			return student;
		} else {
			return `${student.firstname} ${student.lastname}`;
		}
	}

	studentNames(students: (Student | string)[]) {
		return students.map((s) => this.studentName(s)).join(', ');
	}

	sectionGrade(id: string) {
		const section = this.sections().find((section) => section._id === id);
		if (section) {
			return section.year.toLowerCase();
		}
		return id;
	}

	sectionName(id: string) {
		const section = this.sections().find((section) => section._id === id);
		if (section) {
			return section.name;
		}
		return '';
	}

	createEntry() {
		if (this.logRegistryEntry) {
			this.logRegistryEntry.description =
				this.description() || this.logRegistryEntry.description;
			this.logRegistryEntry.comments =
				this.comments() || this.logRegistryEntry.comments;

			const entry: LogRegistryEntryDto = this.logRegistryEntry as any;

			this.#store.dispatch(createLogRegistryEntry({ entry }));
			this.#actions$
				.pipe(
					ofType(createLogRegistryEntrySuccess),
					take(1),
					takeUntil(this.#destroy$),
				)
				.subscribe((res) => {
					this.dialogRef.close(res);
				});
		}
	}

	reset() {
		this.generated = false;
		this.logRegistryEntry = null;
	}

	generate() {
		this.generated = false;
		const logData: any = this.generatorForm.value;

		const isoStrings = new Date(logData.date).toISOString().split('T');
		const date = isoStrings[0].split('-').reverse().join('/');
		const time = isoStrings[1].split(':').slice(0, 2).join(':');

		const studentNames: string[] = logData.students.map((id: string) => {
			const student = this.students().find((s) => s._id === id);
			if (student) {
				return this.studentName(student);
			}
			return '';
		});
		const question = `Estoy llevando un registro de los avances y de las acciones tanto positivas como negativas de todos mis estudiantes.
Necesito que me ayudes a describir de manera elocuente y con altura profesional el hecho que ha ocurrido hoy, aqui te paso la informacion.
Estudiantes:
- ${studentNames.join('\n- ')}

Accion o acciones a resaltar: ${logData.type.toLowerCase()}

Lugar donde fue observado: ${logData.place.toLowerCase()}

Fecha y hora: ${date} a las ${time} (expresalo en 12 horas, AM/PM).

Responde con un objeto JSON valido con esta interfaz:
{
  description: string,
  comments: string
}

Donde 'description' es el relato en pasado de lo observado y en 'comments' escribas (desde el rol del docente guia) tu interpretacion, comentarios y una breve reflexion sobre el asuto ocurrido.`;
		this.#store.dispatch(askGemini({ question }));
	}
}
