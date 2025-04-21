import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { CompetenceEntry } from '../interfaces/competence-entry';
import { Observable } from 'rxjs';
import { ApiUpdateResponse } from '../interfaces/api-update-response';
import { ApiDeleteResponse } from '../interfaces/api-delete-response';
import { environment } from '../../../environments/environment';

@Injectable({
	providedIn: 'root',
})
export class CompetenceService {
	private http = inject(HttpClient);

	private apiBaseUrl = environment.apiUrl + 'competence/';
	private config = {
		withCredentials: true,
		headers: new HttpHeaders({
			'Content-Type': 'application/json',
			Authorization: 'Bearer ' + localStorage.getItem('access_token'),
		}),
	};

	createCompetence(data: CompetenceEntry): Observable<CompetenceEntry> {
		return this.http.post<CompetenceEntry>(
			this.apiBaseUrl,
			data,
			this.config,
		);
	}

	findAll(filters?: any): Observable<CompetenceEntry[]> {
		let params = new HttpParams();
		if (filters) {
			Object.keys(filters).forEach((key) => {
				params = params.set(key, filters[key]);
			});
		}
		return this.http.get<CompetenceEntry[]>(this.apiBaseUrl, {
			params,
			...this.config,
		});
	}

	findByLevel(level: string): Observable<CompetenceEntry[]> {
		return this.http.get<CompetenceEntry[]>(
			this.apiBaseUrl + 'by-level/' + level,
			this.config,
		);
	}

	findByGrade(grade: string): Observable<CompetenceEntry[]> {
		return this.http.get<CompetenceEntry[]>(
			this.apiBaseUrl + 'by-grade/' + grade,
			this.config,
		);
	}

	findBySubject(subject: string): Observable<CompetenceEntry[]> {
		return this.http.get<CompetenceEntry[]>(
			this.apiBaseUrl + 'by-subject/' + subject,
			this.config,
		);
	}

	findOne(id: string): Observable<CompetenceEntry> {
		return this.http.get<CompetenceEntry>(
			this.apiBaseUrl + id,
			this.config,
		);
	}

	update(id: string, competence: any): Observable<ApiUpdateResponse> {
		return this.http.patch<ApiUpdateResponse>(
			this.apiBaseUrl + id,
			competence,
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
