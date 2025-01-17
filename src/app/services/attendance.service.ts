import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Attendance, AttendanceCalendar } from '../interfaces/attendance';
import { ApiUpdateResponse } from '../interfaces/api-update-response';
import { ApiDeleteResponse } from '../interfaces/api-delete-response';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  private http = inject(HttpClient);
  private apiBaseUrl = environment.apiUrl + 'attendance/';
  private config = {
    withCredentials: true,
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
    }),
  };

  findAll(filters?: any): Observable<Attendance[]> {
    let params = new HttpParams();
    if (filters) {
      Object.keys(filters).forEach(key => {
        params = params.set(key, filters[key]);
      });
    }
    return this.http.get<Attendance[]>(this.apiBaseUrl, { ...this.config, params });
  }

  find(id: string): Observable<Attendance> {
    return this.http.get<Attendance>(this.apiBaseUrl + id, this.config);
  }

  create(block: Attendance): Observable<Attendance> {
    return this.http.post<Attendance>(this.apiBaseUrl, block, this.config);
  }

  update(id: string, block: any): Observable<ApiUpdateResponse> {
    return this.http.patch<ApiUpdateResponse>(this.apiBaseUrl + id, block, this.config);
  }

  delete(id: string): Observable<ApiDeleteResponse> {
    return this.http.delete<ApiDeleteResponse>(this.apiBaseUrl + id, this.config);
  }

  exportToExcel(attendance: Attendance[], calendar: AttendanceCalendar): void {
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    const sheetData: any[][] = [];

    // Encabezados
    const headers = ['#', 'Estudiante'];
    calendar.weeks.forEach(week => {
      week.days.forEach(day => {
        headers.push(`${day.dayOfTheWeek} ${day.date}`);
      });
    });
    headers.push('P', 'T', 'A', 'E'); // Resumen
    sheetData.push(headers);

    // Rellenar las filas
    attendance.forEach((att, index) => {
      const row: any[] = [];
      row.push(index + 1); // Índice
      row.push(`${att.student.firstname} ${att.student.lastname}`); // Nombre del estudiante

      // Agregar datos de asistencia por día
      calendar.weeks.forEach(week => {
        week.days.forEach(day => {
          const attendanceData = att.data.find(d => d.date === parseInt(day.date));
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

      // Resumen (P, T, A, E)
      const summary = { P: 0, T: 0, A: 0, E: 0 };
      att.data.forEach(d => {
        summary[d.attendance[0] as keyof typeof summary]++;
      });
      row.push(summary.P, summary.T, summary.A, summary.E);

      sheetData.push(row);
    });

    // Crear hoja de cálculo
    const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(sheetData);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Asistencia');

    // Exportar a archivo
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    const month = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'][attendance[0].month - 1]
    saveAs(data, `Asistencia de ${attendance[0].section.name} - ${month} ${attendance[0].year}.xlsx`);
  }
}
