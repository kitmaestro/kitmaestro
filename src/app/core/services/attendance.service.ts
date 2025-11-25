import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Attendance, AttendanceCalendar } from '../models';
import { ApiDeleteResponse } from '../interfaces';
import { ApiService } from './api.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Injectable({
	providedIn: 'root',
})
export class AttendanceService {
	#apiService = inject(ApiService);
	#endpoint = 'attendance/';

	findAll(filters?: any): Observable<Attendance[]> {
		return this.#apiService.get<Attendance[]>(this.#endpoint, filters);
	}

	find(id: string): Observable<Attendance> {
		return this.#apiService.get<Attendance>(this.#endpoint + id);
	}

	create(block: Attendance): Observable<Attendance> {
		return this.#apiService.post<Attendance>(this.#endpoint, block);
	}

	update(id: string, block: any): Observable<Attendance> {
		return this.#apiService.patch<Attendance>(this.#endpoint + id, block);
	}

	delete(id: string): Observable<ApiDeleteResponse> {
		return this.#apiService.delete<ApiDeleteResponse>(this.#endpoint + id);
	}

	exportToExcel(
		attendance: Attendance[],
		calendar: AttendanceCalendar,
	): void {
		const workbook: XLSX.WorkBook = XLSX.utils.book_new();
		const sheetData: any[][] = [];

		const headers = ['#', 'Estudiante'];
		calendar.weeks.forEach((week) => {
			week.days.forEach((day) => {
				headers.push(`${day.dayOfTheWeek} ${day.date}`);
			});
		});
		headers.push('P', 'T', 'A', 'E');
		sheetData.push(headers);

		attendance.forEach((att, index) => {
			const row: any[] = [];
			row.push(index + 1);
			row.push(`${att.student.firstname} ${att.student.lastname}`);

			calendar.weeks.forEach((week) => {
				week.days.forEach((day) => {
					const attendanceData = att.data.find(
						(d) => d.date === parseInt(day.date),
					);
					if (attendanceData) {
						switch (attendanceData.attendance) {
							case 'PRESENTE':
								row.push('P');
								break;
							case 'TARDE':
								row.push('T');
								break;
							case 'AUSENTE':
								row.push('A');
								break;
							case 'EXCUSA':
								row.push('E');
								break;
							default:
								row.push('');
						}
					} else {
						row.push('');
					}
				});
			});

			const summary = { P: 0, T: 0, A: 0, E: 0 };
			att.data.forEach((d) => {
				summary[d.attendance[0] as keyof typeof summary]++;
			});
			row.push(summary.P, summary.T, summary.A, summary.E);

			sheetData.push(row);
		});

		const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(sheetData);
		XLSX.utils.book_append_sheet(workbook, worksheet, 'Asistencia');

		const excelBuffer: any = XLSX.write(workbook, {
			bookType: 'xlsx',
			type: 'array',
		});
		const data: Blob = new Blob([excelBuffer], {
			type: 'application/octet-stream',
		});
		const month = [
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
		][attendance[0].month - 1];
		saveAs(
			data,
			`Asistencia de ${attendance[0].section.name} - ${month} ${attendance[0].year}.xlsx`,
		);
	}
}
