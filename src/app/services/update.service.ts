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

  find(id: string): Observable<Update> {
    return this.http.get<Update>(this.apiBaseUrl + id);
  }

  create(update: Update): Observable<Update> {
    return this.http.post<Update>(this.apiBaseUrl, update);
  }

  update(id: string, update: Update): Observable<ApiUpdateResponse> {
    return this.http.patch<ApiUpdateResponse>(this.apiBaseUrl + id, update);
  }

  delete(id: string): Observable<ApiDeleteResponse> {
    return this.http.delete<ApiDeleteResponse>(this.apiBaseUrl + id);
  }
}
