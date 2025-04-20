import { Injectable, inject } from '@angular/core';
import { Student } from '../interfaces/student';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiUpdateResponse } from '../interfaces/api-update-response';
import { ApiDeleteResponse } from '../interfaces/api-delete-response';
import { environment } from '../../environments/environment';

@Injectable({
	providedIn: 'root',
})
export class StudentsService {
	private http = inject(HttpClient);
	private apiBaseUrl = environment.apiUrl + 'students/';
	private config = {
		withCredentials: true,
		headers: new HttpHeaders({
			'Content-Type': 'application/json',
			Authorization: 'Bearer ' + localStorage.getItem('access_token'),
		}),
	};

	findBySection(section: string): Observable<Student[]> {
		return this.http.get<Student[]>(
			this.apiBaseUrl + 'by-section/' + section,
			this.config,
		);
	}

	findAll(): Observable<Student[]> {
		return this.http.get<Student[]>(this.apiBaseUrl, this.config);
	}

	find(id: string): Observable<Student> {
		return this.http.get<Student>(this.apiBaseUrl + id, this.config);
	}

	create(plan: Student): Observable<Student> {
		return this.http.post<Student>(this.apiBaseUrl, plan, this.config);
	}

	update(id: string, plan: any): Observable<ApiUpdateResponse> {
		return this.http.patch<ApiUpdateResponse>(
			this.apiBaseUrl + id,
			plan,
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
