import { inject, Injectable } from '@angular/core';
import { SubjectConceptList } from '../interfaces/subject-concept-list';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiDeleteResponse } from '../interfaces/api-delete-response';
import { ApiUpdateResponse } from '../interfaces/api-update-response';

@Injectable({
	providedIn: 'root',
})
export class SubjectConceptListService {
	private http = inject(HttpClient);
	private apiBaseUrl = environment.apiUrl + 'subject-concept-lists/';
	private config = {
		withCredentials: true,
		headers: new HttpHeaders({
			'Content-Type': 'application/json',
			Authorization: 'Bearer ' + localStorage.getItem('access_token'),
		}),
	};

	findAll(filters: any): Observable<SubjectConceptList[]> {
		let params = new HttpParams();
		Object.keys(filters).forEach((key) => {
			params = params.set(key, filters[key]);
		});
		return this.http.get<SubjectConceptList[]>(this.apiBaseUrl, {
			...this.config,
			params,
		});
	}

	find(id: string): Observable<SubjectConceptList> {
		return this.http.get<SubjectConceptList>(
			this.apiBaseUrl + id,
			this.config,
		);
	}

	create(list: SubjectConceptList): Observable<SubjectConceptList> {
		return this.http.post<SubjectConceptList>(
			this.apiBaseUrl,
			list,
			this.config,
		);
	}

	update(id: string, list: any): Observable<ApiUpdateResponse> {
		return this.http.patch<ApiUpdateResponse>(
			this.apiBaseUrl + id,
			list,
			this.config,
		);
	}

	delete(id: string): Observable<ApiDeleteResponse> {
		return this.http.delete<ApiDeleteResponse>(
			this.apiBaseUrl + id,
			this.config,
		);
	}

	download(
		id: string,
		format: 'docx' | 'pdf' = 'pdf',
	): Observable<{ pdf: string }> {
		return this.http.get<{ pdf: string }>(
			this.apiBaseUrl + id + '/' + format,
			this.config,
		);
	}
}
