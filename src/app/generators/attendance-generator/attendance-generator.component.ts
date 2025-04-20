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
import { IsPremiumComponent } from '../../ui/alerts/is-premium/is-premium.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { StudentsService } from '../../services/students.service';
import { ClassSectionService } from '../../services/class-section.service';
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
	templateUrl: './attendance-generator.component.html',
	styleUrl: './attendance-generator.component.scss',
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
