import { inject, Injectable, isDevMode } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Update } from '../interfaces/update';
import { ApiErrorResponse } from '../interfaces/api-error-response';
import { ApiUpdateResponse } from '../interfaces/api-update-response';
import { ApiDeleteResponse } from '../interfaces/api-delete-response';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UpdateService {
  private http = inject(HttpClient);
  private apiBaseUrl = environment.apiUrl + 'updates/';

  constructor(
  ) { }

  findAll(): Observable<Update[]> {
    return this.http.get<Update[]>(this.apiBaseUrl);
  }

  find(id: string): Observable<Update | ApiErrorResponse> {
    return this.http.get<Update>(this.apiBaseUrl + id);
  }

  create(update: Update): Observable<Update | ApiErrorResponse> {
    return this.http.post<Update | ApiErrorResponse>(this.apiBaseUrl, update);
  }

  update(id: string, update: Update): Observable<ApiUpdateResponse | ApiErrorResponse> {
    return this.http.patch<ApiUpdateResponse | ApiErrorResponse>(this.apiBaseUrl + id, update);
  }

  delete(id: string): Observable<ApiDeleteResponse | ApiErrorResponse> {
    return this.http.delete<ApiDeleteResponse | ApiErrorResponse>(this.apiBaseUrl + id);
  }
}
