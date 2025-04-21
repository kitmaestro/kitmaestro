import { Injectable, inject, isDevMode } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LogRegistryEntry } from '../interfaces/log-registry-entry';
import { ApiUpdateResponse } from '../interfaces/api-update-response';
import { ApiDeleteResponse } from '../interfaces/api-delete-response';
import { environment } from '../../../environments/environment';

@Injectable({
	providedIn: 'root',
})
export class LogRegistryEntryService {
	private http = inject(HttpClient);
	private apiBaseUrl = environment.apiUrl + 'log-registry-entries/';
	private config = {
		withCredentials: true,
		headers: new HttpHeaders({
			'Content-Type': 'application/json',
			Authorization: 'Bearer ' + localStorage.getItem('access_token'),
		}),
	};

	findAll(): Observable<LogRegistryEntry[]> {
		return this.http.get<LogRegistryEntry[]>(this.apiBaseUrl, this.config);
	}

	find(id: string): Observable<LogRegistryEntry> {
		return this.http.get<LogRegistryEntry>(
			this.apiBaseUrl + id,
			this.config,
		);
	}

	create(plan: LogRegistryEntry): Observable<LogRegistryEntry> {
		return this.http.post<LogRegistryEntry>(
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
