import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../interfaces';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiUpdateResponse } from '../interfaces/api-update-response';
import { environment } from '../../../environments/environment';
import { ApiDeleteResponse } from '../interfaces/api-delete-response';
import { ApiService } from './api.service';

@Injectable({
	providedIn: 'root',
})
export class UserService {
	#apiService = inject(ApiService);
	private http = inject(HttpClient);
	private config = {
		withCredentials: true,
		headers: new HttpHeaders({
			'Content-Type': 'application/json',
			Authorization: `Bearer ${localStorage.getItem('access_token')}`,
		}),
	};

	private apiBaseUrl = environment.apiUrl + 'users/';

	countUsers(): Observable<{ users: number }> {
		return this.#apiService.get<{ users: number }>('users/count');
	}

	findAll(): Observable<User[]> {
		return this.http.get<User[]>(this.apiBaseUrl, this.config);
	}

	find(id: string): Observable<User> {
		return this.http.get<User>(this.apiBaseUrl + id, this.config);
	}

	create(data: any): Observable<User> {
		return this.http.post<User>(this.apiBaseUrl, data, this.config);
	}

	getSettings(userId?: string): Observable<User> {
		if (userId) {
			return this.http.get<User>(
				this.apiBaseUrl + userId,
				this.config,
			);
		}
		return this.http.get<User>(
			environment.apiUrl + 'auth/profile',
			this.config,
		);
	}

	update(id: string, user: any): Observable<ApiUpdateResponse> {
		return this.http.patch<ApiUpdateResponse>(
			this.apiBaseUrl + id,
			user,
			this.config,
		);
	}

	delete(id: string): Observable<ApiDeleteResponse> {
		return this.http.delete<ApiDeleteResponse>(
			this.apiBaseUrl + id,
			this.config,
		);
	}

	setPhotoUrl(photoURL: string): Observable<ApiUpdateResponse> {
		return this.http.patch<ApiUpdateResponse>(
			this.apiBaseUrl + 'auth/profile',
			{ photoURL },
			this.config,
		);
	}
}
