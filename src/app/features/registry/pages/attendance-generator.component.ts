import { Component, inject } from '@angular/core';
import {
	FormArray,
	FormBuilder,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { IsPremiumComponent } from '../../../shared/ui/is-premium.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { StudentsService } from '../../../core/services/students.service';
import { ClassSectionService } from '../../../core/services/class-section.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { tap } from 'rxjs';

interface Student {
	name: string;
	attendanceProbability: number;
	justifiedProbability: number;
	onTimeProbability: number;
}

interface AttendanceRecord {
	id: number;
	name: string;
	attendance: ('P' | 'A' | 'T' | 'E')[];
}

@Component({
	selector: 'app-attendance-generator',
	imports: [
		IsPremiumComponent,
		ReactiveFormsModule,
		MatCardModule,
		MatButtonModule,
		MatTableModule,
		MatFormFieldModule,
		MatSelectModule,
		MatInputModule,
		MatIconModule,
		AsyncPipe,
		CommonModule,
	],
	template: `
		<app-is-premium>
			<div>
				<div>
					<h2>Generador de Asistencia</h2>
				</div>
				<div>
					<form [formGroup]="studentsForm" (ngSubmit)="onSubmit()">
						<div class="student-container">
							<div
								style="flex: 1 1 auto; display: block"
								formArrayName="students"
							>
								<div>
									<mat-form-field
										style="min-width: calc(50% - 8px)"
										appearance="outline"
									>
										<mat-label
											>D&iacute;as de Clase</mat-label
										>
										<input
											type="number"
											min="1"
											max="25"
											matInput
											[formControl]="numberOfDays"
										/>
									</mat-form-field>
								</div>
								@for (
									student of students.controls;
									track $index
								) {
									<div
										class="student"
										[formGroupName]="$index"
									>
										<mat-form-field appearance="outline">
											<mat-label>Nombre</mat-label>
											<input
												type="text"
												matInput
												formControlName="name"
											/>
										</mat-form-field>
										<mat-form-field appearance="outline">
											<mat-label
												>Probabilidad de
												Asistencia</mat-label
											>
											<input
												type="number"
												min="0"
												max="100"
												required
												matInput
												formControlName="attendanceProbability"
											/>
										</mat-form-field>
										<mat-form-field appearance="outline">
											<mat-label
												>Probabilidad de
												Excusa</mat-label
											>
											<input
												type="number"
												min="0"
												max="100"
												required
												matInput
												formControlName="justifiedProbability"
											/>
										</mat-form-field>
										<mat-form-field appearance="outline">
											<mat-label
												>Probabilidad de Llegar a
												Temprano</mat-label
											>
											<input
												type="number"
												min="0"
												max="100"
												required
												matInput
												formControlName="onTimeProbability"
											/>
										</mat-form-field>
										@if (students.length > 1) {
											<button
												(click)="removeStudent($index)"
												mat-icon-button
												color="warn"
												type="button"
											>
												<mat-icon>delete</mat-icon>
											</button>
										}
									</div>
								}
							</div>
							<div class="side-panel">
								<div
									class="panel-section"
									style="
										min-width: fit-content;
										border: 1px solid #ddd;
										padding: 12px;
										margin-bottom: 12px;
									"
								>
									<h3>Agregar Estudiantes</h3>
									<mat-form-field
										style="margin-right: 16px; margin-bottom: 0"
										appearance="outline"
									>
										<mat-label>Cantidad</mat-label>
										<input
											type="number"
											min="1"
											matInput
											[formControl]="numberOfStudents"
										/>
									</mat-form-field>
									<button
										mat-button
										style="display: block; width: 100%"
										color="accent"
										type="button"
										(click)="addStudent()"
									>
										<mat-icon>add</mat-icon>
										Agregar Estudiante(s)
									</button>
								</div>
								<div
									class="panel-section"
									style="
										min-width: fit-content;
										border: 1px solid #ddd;
										padding: 12px;
										margin-bottom: 12px;
									"
								>
									<h3>Importar Estudiantes</h3>
									<mat-form-field
										style="margin-right: 16px; margin-bottom: 0"
										appearance="outline"
									>
										<mat-label>Secci&oacute;n</mat-label>
										<mat-select [formControl]="section">
											<ng-container
												*ngIf="
													sections$
														| async as sections
												"
											>
												<mat-option
													[value]="sec._id"
													*ngFor="let sec of sections"
													>{{ sec.name }}</mat-option
												>
											</ng-container>
										</mat-select>
									</mat-form-field>
									<button
										mat-button
										style="display: block; width: 100%"
										color="accent"
										type="button"
										(click)="importStudents()"
									>
										<mat-icon>upload</mat-icon>
										Importar Estudiantes
									</button>
								</div>
							</div>
						</div>
						<div>
							<button
								style="display: block; margin-left: auto"
								mat-flat-button
								color="primary"
								type="submit"
							>
								<mat-icon>bolt</mat-icon>
								Generar
							</button>
						</div>
					</form>
				</div>
			</div>

			@if (attendanceRecords.length) {
				<table
					mat-table
					class="mat-elevation-z8"
					style="margin-top: 24px"
					[dataSource]="attendanceRecords"
				>
					<ng-container matColumnDef="id">
						<th mat-header-cell *matHeaderCellDef>No.</th>
						<td mat-cell *matCellDef="let element">
							{{ element.id }}
						</td>
					</ng-container>

					<ng-container matColumnDef="name">
						<th mat-header-cell *matHeaderCellDef>Nombre</th>
						<td mat-cell *matCellDef="let element">
							{{ element.name }}
						</td>
					</ng-container>

					@for (
						col of [].constructor(numberOfDays.value);
						track $index
					) {
						<ng-container [matColumnDef]="'day-' + $index">
							<th mat-header-cell *matHeaderCellDef>
								{{ $index + 1 }}
							</th>
							<td mat-cell *matCellDef="let element">
								{{ element.attendance[$index] }}
							</td>
						</ng-container>
					}

					<ng-container matColumnDef="Presente">
						<th mat-header-cell *matHeaderCellDef>Presente</th>
						<td mat-cell *matCellDef="let element">
							{{ attendanceTotals(element.attendance).p }}
						</td>
					</ng-container>

					<ng-container matColumnDef="Tardanza">
						<th mat-header-cell *matHeaderCellDef>Tardanza</th>
						<td mat-cell *matCellDef="let element">
							{{ attendanceTotals(element.attendance).t }}
						</td>
					</ng-container>

					<ng-container matColumnDef="Ausente">
						<th mat-header-cell *matHeaderCellDef>Ausente</th>
						<td mat-cell *matCellDef="let element">
							{{ attendanceTotals(element.attendance).a }}
						</td>
					</ng-container>

					<ng-container matColumnDef="Excusa">
						<th mat-header-cell *matHeaderCellDef>Excusa</th>
						<td mat-cell *matCellDef="let element">
							{{ attendanceTotals(element.attendance).e }}
						</td>
					</ng-container>

					<tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
					<tr
						mat-row
						*matRowDef="let row; columns: displayedColumns"
					></tr>
				</table>
			}
		</app-is-premium>
	`,
	styles: `
		.student {
			display: flex;
			gap: 16px;

			&-container {
				display: flex;
				gap: 16px;
			}

			@media screen and (max-width: 1200px) {
				&-container {
					flex-direction: column-reverse;
				}
			}
		}

		mat-form-field {
			width: 100%;
		}

		.side-panel {
			@media screen and (max-width: 1200px) {
				display: flex;
				gap: 16px;
				width: 100%;

				.panel-section {
					display: block;
					flex: 1 1 auto;
				}
			}
		}
	`,
})
export class AttendanceGeneratorComponent {
	fb = inject(FormBuilder);
	studentsService = inject(StudentsService);
	classSectionService = inject(ClassSectionService);

	sections$ = this.classSectionService
		.findSections()
		.pipe(tap((s) => this.section.setValue(s[0] ? s[0]._id || '' : '')));

	working = true;
	displayedColumns = ['id', 'name'];
	attendanceRecords: AttendanceRecord[] = [];

	studentsForm = this.fb.group({
		students: this.fb.array([
			this.fb.group({
				name: [''],
				attendanceProbability: [90],
				justifiedProbability: [90],
				onTimeProbability: [80],
			}),
		]),
	});
	numberOfDays = this.fb.control(15);
	numberOfStudents = this.fb.control(1);
	section = this.fb.control('', Validators.required);

	generateAttendance(
		students: Student[],
		numberOfDays: number,
	): AttendanceRecord[] {
		const attendanceRecords: AttendanceRecord[] = [];

		students.forEach((student, index) => {
			const attendance: ('P' | 'A' | 'T' | 'E')[] = [];

			for (let i = 0; i < numberOfDays; i++) {
				const randomNumber = Math.random() * 100; // Generate a random number between 0 and 100

				if (randomNumber < student.attendanceProbability) {
					const lateNumber = Math.random() * 100; // Generate a random number between 0 and 100 for tardiness
					if (lateNumber < student.onTimeProbability) {
						attendance.push('P'); // Present
					} else {
						attendance.push('T'); // Late
					}
				} else {
					const justifiedNumber = Math.random() * 100; // Generate a random number between 0 and 100 for justification
					if (justifiedNumber < student.justifiedProbability) {
						attendance.push('E'); // Excused absence
					} else {
						attendance.push('A'); // Absent
					}
				}
			}

			attendanceRecords.push({
				id: index + 1,
				name: student.name,
				attendance: attendance,
			});
		});

		return attendanceRecords;
	}

	createSummaryRow(): string[] {
		const summary: string[] = [];
		const attendance = this.attendanceRecords.map((r) => r.attendance);
		const days = this.numberOfDays.value || 15;

		for (let i = 0; i < days; i++) {
			const qty = attendance.filter(
				(a) => a[i] === 'P' || a[i] === 'T',
			).length;

			summary.push(qty > 0 ? qty.toString() : '');
		}

		return summary;
	}

	onSubmit() {
		if (this.studentsForm.valid) {
			const students = this.studentsForm.value
				.students as any as Student[];
			const numberOfDays = this.numberOfDays.value || 15;
			this.displayedColumns = ['id', 'name'];
			for (let i = 0; i < numberOfDays; i++) {
				this.displayedColumns.push('day-' + i);
			}
			this.displayedColumns.push(
				'Presente',
				'Tardanza',
				'Ausente',
				'Excusa',
			);
			this.attendanceRecords = this.generateAttendance(
				students,
				numberOfDays,
			);
			const summary: AttendanceRecord = {
				attendance: this.createSummaryRow() as any,
				id: '' as any,
				name: 'TOTAL DE ASISTENCIA DIARIA',
			};
			this.attendanceRecords.push(summary);
		}
	}

	importStudents() {
		const section = this.section.value;
		if (!section) return;

		this.students.clear();

		const sus = this.studentsService.findBySection(section).subscribe({
			next: (students) => {
				students.forEach((student) => {
					const control = this.fb.group({
						name: [student.firstname + ' ' + student.lastname],
						attendanceProbability: [90],
						justifiedProbability: [90],
						onTimeProbability: [80],
					});
					this.students.push(control);
				});
			},
			complete() {
				sus.unsubscribe();
			},
		});
	}

	addStudent() {
		const qty = this.numberOfStudents.value;
		if (!qty) return;

		for (let i = 0; i < qty; i++) {
			const control = this.fb.group({
				name: [''],
				attendanceProbability: [90],
				justifiedProbability: [90],
				onTimeProbability: [80],
			});
			this.students.push(control);
		}
	}

	removeStudent(index: number) {
		this.students.removeAt(index);
	}

	attendanceTotals(attendance: string[]) {
		const totals = attendance.reduce(
			(p: { p: number; t: number; a: number; e: number }, c: string) => {
				p.p += c === 'P' ? 1 : 0;
				p.t += c === 'T' ? 1 : 0;
				p.a += c === 'A' ? 1 : 0;
				p.e += c === 'E' ? 1 : 0;

				return p;
			},
			{ p: 0, t: 0, a: 0, e: 0 },
		);

		if (!totals.a && !totals.p && !totals.e && !totals.t) {
			return {
				a: '',
				p: '',
				t: '',
				e: '',
			};
		}

		return totals;
	}

	get students() {
		return this.studentsForm.get('students') as FormArray;
	}
}
