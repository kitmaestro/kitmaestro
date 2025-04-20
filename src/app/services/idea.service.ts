import { inject, Injectable } from '@angular/core';
import { ApiDeleteResponse } from '../interfaces/api-delete-response';
import { Observable } from 'rxjs';
import { ApiUpdateResponse } from '../interfaces/api-update-response';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Idea } from '../interfaces/idea';

@Injectable({
	providedIn: 'root',
})
export class IdeaService {
	private http = inject(HttpClient);
	private apiBaseUrl = environment.apiUrl + 'ideas/';
	private config = {
		withCredentials: true,
		headers: new HttpHeaders({
			'Content-Type': 'application/json',
			Authorization: 'Bearer ' + localStorage.getItem('access_token'),
		}),
	};

	findAll(): Observable<Idea[]> {
		return this.http.get<Idea[]>(this.apiBaseUrl, this.config);
	}

	find(id: string): Observable<Idea> {
		return this.http.get<Idea>(this.apiBaseUrl + id, this.config);
	}

	create(idea: Idea): Observable<Idea> {
		return this.http.post<Idea>(this.apiBaseUrl, idea, this.config);
	}

	update(id: string, idea: any): Observable<ApiUpdateResponse> {
		return this.http.patch<ApiUpdateResponse>(
			this.apiBaseUrl + id,
			idea,
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
