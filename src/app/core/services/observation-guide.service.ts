import { inject, Injectable, isDevMode } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiUpdateResponse } from '../interfaces/api-update-response';
import { ApiDeleteResponse } from '../interfaces/api-delete-response';
import { environment } from '../../../environments/environment';
import { ObservationGuide } from '../interfaces/observation-guide';

@Injectable({
	providedIn: 'root',
})
export class ObservationGuideService {
	private http = inject(HttpClient);
	private apiBaseUrl = environment.apiUrl + 'observation-guides/';
	private config = {
		withCredentials: true,
		headers: new HttpHeaders({
			'Content-Type': 'application/json',
			Authorization: 'Bearer ' + localStorage.getItem('access_token'),
		}),
	};

	findAll(): Observable<ObservationGuide[]> {
		return this.http.get<ObservationGuide[]>(this.apiBaseUrl, this.config);
	}

	find(id: string): Observable<ObservationGuide> {
		return this.http.get<ObservationGuide>(
			this.apiBaseUrl + id,
			this.config,
		);
	}

	create(plan: ObservationGuide): Observable<ObservationGuide> {
		return this.http.post<ObservationGuide>(
			this.apiBaseUrl,
			plan,
			this.config,
		);
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
