import { inject, Injectable } from '@angular/core';
import { ClassSchedule } from '../interfaces/class-schedule';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiUpdateResponse } from '../interfaces/api-update-response';
import { ApiDeleteResponse } from '../interfaces/api-delete-response';
import { environment } from '../../environments/environment';

@Injectable({
	providedIn: 'root',
})
export class ClassScheduleService {
	private http = inject(HttpClient);
	private apiBaseUrl = environment.apiUrl + 'schedules/';
	private config = {
		withCredentials: true,
		headers: new HttpHeaders({
			'Content-Type': 'application/json',
			Authorization: 'Bearer ' + localStorage.getItem('access_token'),
		}),
	};

	findAll(): Observable<ClassSchedule[]> {
		return this.http.get<ClassSchedule[]>(this.apiBaseUrl, this.config);
	}

	find(id: string): Observable<ClassSchedule> {
		return this.http.get<ClassSchedule>(this.apiBaseUrl + id, this.config);
	}

	create(schedule: ClassSchedule): Observable<ClassSchedule> {
		return this.http.post<ClassSchedule>(
			this.apiBaseUrl,
			schedule,
			this.config,
		);
	}

	update(id: string, schedule: any): Observable<ApiUpdateResponse> {
		return this.http.patch<ApiUpdateResponse>(
			this.apiBaseUrl + id,
			schedule,
			this.config,
		);
	}

	delete(id: string): Observable<ApiDeleteResponse> {
		return this.http.delete<ApiDeleteResponse>(
			this.apiBaseUrl + id,
			this.config,
		);
	}
}
