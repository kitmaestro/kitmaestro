import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { EstimationScale } from '../interfaces/estimation-scale';
import { ApiUpdateResponse } from '../interfaces/api-update-response';
import { ApiDeleteResponse } from '../interfaces/api-delete-response';

@Injectable({
	providedIn: 'root',
})
export class EstimationScaleService {
	private http = inject(HttpClient);
	private apiBaseUrl = environment.apiUrl + 'estimation-scales/';
	private config = {
		withCredentials: true,
		headers: new HttpHeaders({
			'Content-Type': 'application/json',
			Authorization: 'Bearer ' + localStorage.getItem('access_token'),
		}),
	};

	findAll(): Observable<EstimationScale[]> {
		return this.http.get<EstimationScale[]>(this.apiBaseUrl, this.config);
	}

	find(id: string): Observable<EstimationScale> {
		return this.http.get<EstimationScale>(
			this.apiBaseUrl + id,
			this.config,
		);
	}

	create(plan: EstimationScale): Observable<EstimationScale> {
		return this.http.post<EstimationScale>(
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
