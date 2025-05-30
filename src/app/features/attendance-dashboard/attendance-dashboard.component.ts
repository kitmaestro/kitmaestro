import { Component, inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ClassSectionService } from '../../core/services/class-section.service';
import { ClassSection } from '../../core/interfaces/class-section';
import { PretifyPipe } from '../../shared/pipes/pretify.pipe';
import { StudentsService } from '../../core/services/students.service';
import { Student } from '../../core/interfaces/student';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
	Attendance,
	AttendanceCalendar,
	AttendanceWeek,
} from '../../core/interfaces/attendance';
import { AttendanceService } from '../../core/services/attendance.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
	selector: 'app-attendance-dashboard',
	imports: [
		MatCardModule,
		MatInputModule,
		MatSelectModule,
		MatButtonModule,
		MatFormFieldModule,
		MatIconModule,
		MatSnackBarModule,
		PretifyPipe,
		ReactiveFormsModule,
		RouterLink,
	],
	templateUrl: './attendance-dashboard.component.html',
	styleUrl: './attendance-dashboard.component.scss',
})
export class AttendanceDashboardComponent implements OnInit {
	private sectionService = inject(ClassSectionService);
	private studentService = inject(StudentsService);
	private sb = inject(MatSnackBar);
	private route = inject(ActivatedRoute);
	private attendanceService = inject(AttendanceService);
	private id = this.route.snapshot.queryParamMap.get('section');

	sections: ClassSection[] = [];
	students: Student[] = [];
	attendance: Attendance[] = [];
	holidays: string[] = [];
	section: FormControl = new FormControl<string>('');
	month: FormControl = new FormControl<number>(new Date().getMonth() + 1);
	year: FormControl = new FormControl<number>(new Date().getFullYear());

	mode = 'Jornada Extendida';
	monthName = '';
	saving = false;
	downloading = false;
	removing = false;
	remote = false;
	calendar: AttendanceCalendar = {
		daysPerWeek: 5,
		weeks: [],
	};

	createThisMonthAttendance() {
		setTimeout(() => {
			this.students.forEach((student) => {
				const attendance: any = {
					year: this.year.value,
					month: this.month.value,
					section: this.section.value,
					student,
					data: this.calendar.weeks
						.flatMap((w) => w.days)
						.map((day) => ({
							attendance: 'PRESENTE',
							date: parseInt(day.date),
						})),
				};
				this.attendance.push(attendance);
			});
		}, 1000);
	}

	fetchAttendance(year: number, month: number) {
		this.attendanceService
			.findAll({ section: this.section.value, year, month })
			.subscribe({
				next: (attendance) => {
					if (attendance.length) {
						this.attendance = attendance;
						this.remote = true;
					} else {
						this.createThisMonthAttendance();
					}
				},
				error: (err) => {
					console.log(err.message);
				},
			});
	}

	deleteEntries() {
		this.removing = true;
		let count = 0;
		if (this.remote) {
			this.attendance.forEach((entry) => {
				this.attendanceService.delete(entry._id).subscribe(
					(res) => {
						if (res.deletedCount > 0) {
							count++;
							if (count === this.attendance.length) {
								this.makeCalendar();
								this.removing = false;
							}
						}
					},
					(error) => {
						console.log(error.message);
						count++;
						if (count === this.attendance.length) {
							this.makeCalendar();
							this.removing = false;
						}
					},
				);
			});
		} else {
			this.makeCalendar();
		}
	}

	download() {
		this.downloading = true;
		this.attendanceService.exportToExcel(this.attendance, this.calendar);
		this.downloading = false;
	}

	onSave() {
		let count = 0;
		let errors = false;
		if (this.saving) return;
		this.saving = true;
		this.attendance.forEach((attendance) => {
			if (this.remote) {
				const sus = this.attendanceService
					.update(attendance._id, attendance)
					.subscribe({
						next: (res) => {
							sus.unsubscribe();
							count += 1;
							if (count === this.attendance.length) {
								this.sb.open(
									'Guardado finalizado ' +
										(errors
											? 'con errores'
											: 'sin errores'),
									'Ok',
									{ duration: 2500 },
								);
								this.saving = false;
							}
						},
						error: (err) => {
							sus.unsubscribe();
							count += 1;
							errors = true;
							console.log(err.message);
							if (count === this.attendance.length) {
								this.sb.open(
									'Guardado finalizado con errores',
									'Ok',
									{ duration: 2500 },
								);
								this.saving = false;
							}
						},
					});
			} else {
				const sus = this.attendanceService
					.create(attendance)
					.subscribe({
						next: (res) => {
							sus.unsubscribe();
							count += 1;
							if (count === this.attendance.length) {
								this.sb.open(
									'Guardado finalizado ' +
										(errors
											? 'con errores'
											: 'sin errores'),
									'Ok',
									{ duration: 2500 },
								);
								this.saving = false;
							}
						},
						error: (err) => {
							sus.unsubscribe();
							count += 1;
							errors = true;
							console.log(err.message);
							if (count === this.attendance.length) {
								this.sb.open(
									'Guardado finalizado con errores',
									'Ok',
									{ duration: 2500 },
								);
								this.saving = false;
							}
						},
					});
			}
		});
	}

	loadSections() {
		this.sectionService.findSections().subscribe({
			next: (sections) => {
				if (sections.length) {
					this.sections = sections;
					if (this.id) {
						const section = sections.find((s) => s._id === this.id);
						if (section) {
							this.section.setValue(section._id);
							this.onSectionSelect({ value: section._id });
						}
					}
				} else {
					this.sb.open(
						'Necesitas crear al menos una sesion para usar esta herramienta.',
						'Ok',
						{ duration: 2500 },
					);
				}
			},
			error: (err) => {
				console.log(err.message);
			},
			complete: () => {},
		});
	}

	getWeekCount(year: number, month: number): number {
		const date = new Date(year, month - 1, 1);
		const firstDay = date.getDay();
		let count = 1;
		while (date.getMonth() === month - 1) {
			date.setDate(date.getDate() + 1);
			if (date.getDay() === firstDay) {
				count++;
			}
		}
		return count;
	}

	makeCalendar() {
		this.monthName = [
			'Enero',
			'Febrero',
			'Marzo',
			'Abril',
			'Mayo',
			'Junio',
			'Julio',
			'Agosto',
			'Septiembre',
			'Octubre',
			'Noviembre',
			'Diciembre',
		][this.month.value - 1];
		switch (this.mode) {
			case 'Matutina':
			case 'Vespertina':
			case 'Nocturna':
			case 'Jornada Extendida': {
				this.calendar.daysPerWeek = 5;
				const date = new Date(this.year.value, this.month.value - 1, 1);
				const dayOfTheWeek = (d: Date) =>
					['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'][
						d.getDay()
					];
				const dateStr = (d: Date) =>
					d.getDate().toString().padStart(2, '0');
				const weeksInMonth = this.getWeekCount(
					this.year.value,
					this.month.value,
				);
				const weeks: AttendanceWeek[] = [];
				for (let i = 0; i < weeksInMonth; i++) {
					const week: AttendanceWeek = {
						days: [],
						week: i + 1,
					};
					// insert before this month days
					if (i === 0) {
						const firstDay = date.getDay();
						if (firstDay === 0) {
							date.setDate(date.getDate() + 1);
							for (let j = 5; j > 0; j--) {
								const d = new Date(date);
								d.setDate(d.getDate() - j);
								week.days.push({
									date: '',
									dayOfTheWeek: dayOfTheWeek(d),
								});
							}
							continue;
						}
						if (firstDay === 6) {
							date.setDate(date.getDate() + 2);
							for (let j = 5; j > 0; j--) {
								const d = new Date(date);
								d.setDate(d.getDate() - j);
								week.days.push({
									date: '',
									dayOfTheWeek: dayOfTheWeek(d),
								});
							}
							continue;
						}
						const daysToFill = date.getDay() - 1;
						for (let j = daysToFill; j > 0; j--) {
							const d = new Date(date);
							d.setDate(d.getDate() - j);
							week.days.push({
								date: '',
								dayOfTheWeek: dayOfTheWeek(d),
							});
						}
						for (let j = firstDay; j < 6; j++) {
							week.days.push({
								date: dateStr(date),
								dayOfTheWeek: dayOfTheWeek(date),
							});
							date.setDate(date.getDate() + 1);
						}
						date.setDate(date.getDate() + 1);
					} else {
						for (let j = 0; j < 7; j++) {
							if (![0, 6].includes(date.getDay())) {
								if (date.getMonth() === this.month.value - 1) {
									week.days.push({
										date: dateStr(date),
										dayOfTheWeek: dayOfTheWeek(date),
									});
								} else {
									week.days.push({
										date: '',
										dayOfTheWeek: dayOfTheWeek(date),
									});
								}
							}
							date.setDate(date.getDate() + 1);
						}
					}
					weeks.push(week);
				}
				this.calendar.weeks = weeks;
				break;
			}
			case 'Sabatina': {
				this.calendar.daysPerWeek = 1;
				break;
			}
			case 'Dominical': {
				this.calendar.daysPerWeek = 1;
				break;
			}
			default: {
				return;
			}
		}
	}

	onSectionSelect(event: any) {
		const section = this.sections.find((s) => s._id === event.value);
		if (section) {
			this.mode === section.school.journey;
		}
		this.fetchAttendance(this.year.value, this.month.value);
		this.makeCalendar();
		this.studentService.findBySection(event.value).subscribe({
			next: (students) => {
				if (students.length) {
					this.students = students;
					this.setHolidays();
				} else {
					this.sb.open(
						'Necesitas registrar tus estudiantes primero.',
						'Ok',
						{ duration: 2500 },
					);
				}
			},
			error: (err) => {
				console.log(err.message);
			},
			complete: () => {},
		});
	}

	setHolidays() {
		this.holidays = [
			[1, 2, 3, 6, 21, 26],
			[27],
			[],
			[14, 15, 16, 17, 18],
			[5],
			[19],
			[
				1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
				19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
			],
			[16],
			[24],
			[],
			[6],
			[25],
		][this.month.value - 1].map((v: number) =>
			v.toString().padStart(2, '0'),
		);
	}

	onMonthSelect(event: any) {
		if (event.value > 12) {
			this.month.setValue(1);
			this.year.setValue(this.year.value + 1);
		}
		this.setHolidays();
		this.fetchAttendance(this.year.value, event.value);
		this.makeCalendar();
	}

	onYearSelect(event: any) {
		this.fetchAttendance(event.value, this.month.value);
		this.makeCalendar();
	}

	ngOnInit() {
		this.loadSections();
	}

	getAttendanceDay(student: string, day: string) {
		const at = this.attendance.find((a) => a.student._id === student);
		if (at) {
			const d = at.data.find((d) => d.date === parseInt(day));
			if (d) {
				return d.attendance;
			}
		}
		return '';
	}

	toggleAttendance(student: string, day: string) {
		const current = this.getAttendanceDay(student, day);
		const entry = this.attendance
			.find((a) => a.student._id === student)
			?.data.find((d) => d.date === parseInt(day));
		if (!entry) return;

		switch (current) {
			case 'PRESENTE': {
				entry.attendance = 'TARDE';
				return;
			}
			case 'TARDE': {
				entry.attendance = 'AUSENTE';
				return;
			}
			case 'AUSENTE': {
				entry.attendance = 'EXCUSA';
				return;
			}
			case 'EXCUSA': {
				entry.attendance = 'FERIADO';
				return;
			}
			default: {
				entry.attendance = 'PRESENTE';
				return;
			}
		}
	}

	getDayTotal(day: string) {
		if (this.holidays.includes(day)) return '';
		return (
			this.attendance
				.flatMap((a) =>
					a.data
						.filter((d) => d.date === parseInt(day))
						.map((d) => d.attendance),
				)
				.reduce((p, c) => p + (c === 'PRESENTE' ? 1 : 0), 0) || ''
		);
	}

	getStudentTotalP(student: string) {
		const at = this.attendance.filter((a) => a.student._id === student);
		return at.flatMap((a) =>
			a.data.filter(
				(d) =>
					!this.holidays.includes(`${d.date}`.padStart(2, '0')) &&
					d.attendance === 'PRESENTE',
			),
		).length;
	}

	getStudentTotalT(student: string) {
		const at = this.attendance.filter((a) => a.student._id === student);
		return at.flatMap((a) =>
			a.data.filter(
				(d) =>
					!this.holidays.includes(`${d.date}`.padStart(2, '0')) &&
					d.attendance === 'TARDE',
			),
		).length;
	}

	getStudentTotalA(student: string) {
		const at = this.attendance.filter((a) => a.student._id === student);
		return at.flatMap((a) =>
			a.data.filter(
				(d) =>
					!this.holidays.includes(`${d.date}`.padStart(2, '0')) &&
					d.attendance === 'AUSENTE',
			),
		).length;
	}

	getStudentTotalE(student: string) {
		const at = this.attendance.filter((a) => a.student._id === student);
		return at.flatMap((a) =>
			a.data.filter(
				(d) =>
					!this.holidays.includes(`${d.date}`.padStart(2, '0')) &&
					d.attendance === 'EXCUSA',
			),
		).length;
	}
}
