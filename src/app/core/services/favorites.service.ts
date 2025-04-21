import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AppEntry } from '../interfaces/app-entry';
import { Observable } from 'rxjs';
import { ApiUpdateResponse } from '../interfaces/api-update-response';
import { ApiDeleteResponse } from '../interfaces/api-delete-response';

@Injectable({
	providedIn: 'root',
})
export class FavoritesService {
	private http = inject(HttpClient);
	private apiBaseUrl = environment.apiUrl + 'favorite-tools/';
	private config = {
		withCredentials: true,
		headers: new HttpHeaders({
			'Content-Type': 'application/json',
			Authorization: 'Bearer ' + localStorage.getItem('access_token'),
		}),
	};

	findAll(): Observable<{ user: string; tools: AppEntry[] }> {
		return this.http.get<{ user: string; tools: AppEntry[] }>(
			this.apiBaseUrl,
			this.config,
		);
	}

	create(data: AppEntry[]): Observable<{ user: string; tools: AppEntry[] }> {
		return this.http.post<{ user: string; tools: AppEntry[] }>(
			this.apiBaseUrl,
			data,
			this.config,
		);
	}

	update(data: any): Observable<ApiUpdateResponse> {
		return this.http.patch<ApiUpdateResponse>(
			this.apiBaseUrl,
			data,
			this.config,
		);
	}
}
