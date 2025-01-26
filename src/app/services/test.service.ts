import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiDeleteResponse } from '../interfaces/api-delete-response';
import { ApiUpdateResponse } from '../interfaces/api-update-response';
import { Test } from '../interfaces/test';

@Injectable({
  providedIn: 'root'
})
export class TestService {
  private http = inject(HttpClient);
  private apiBaseUrl = environment.apiUrl + 'tests/';
  private config = {
	withCredentials: true,
	headers: new HttpHeaders({
	  'Content-Type': 'application/json',
	  'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
	}),
  };

  findAll(filters?: any): Observable<Test[]> {
	let params = new HttpParams();
	if (filters) {
	  Object.keys(filters).forEach(key => {
		params = params.set(key, filters[key]);
	  });
	}
	return this.http.get<Test[]>(this.apiBaseUrl, { params, ...this.config });
  }

  find(id: string): Observable<Test> {
	return this.http.get<Test>(this.apiBaseUrl + id, this.config);
  }

  create(plan: any): Observable<Test> {
	return this.http.post<Test>(this.apiBaseUrl, plan, this.config);
  }

  update(id: string, plan: any): Observable<ApiUpdateResponse> {
	return this.http.patch<ApiUpdateResponse>(this.apiBaseUrl + id, plan, this.config);
  }

  delete(id: string): Observable<ApiDeleteResponse> {
	return this.http.delete<ApiDeleteResponse>(this.apiBaseUrl + id, this.config);
  }
}
