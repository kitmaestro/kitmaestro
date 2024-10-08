import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Rubric } from '../interfaces/rubric';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiUpdateResponse } from '../interfaces/api-update-response';
import { ApiDeleteResponse } from '../interfaces/api-delete-response';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RubricService {
  private http = inject(HttpClient);
  private apiBaseUrl = environment.apiUrl + 'rubrics/';
  private config = {
    withCredentials: true,
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
    }),
  };

  findAll(): Observable<Rubric[]> {
    return this.http.get<Rubric[]>(this.apiBaseUrl, this.config);
  }

  find(id: string): Observable<Rubric> {
    return this.http.get<Rubric>(this.apiBaseUrl + id, this.config);
  }

  create(plan: Rubric): Observable<Rubric> {
    return this.http.post<Rubric>(this.apiBaseUrl, plan, this.config);
  }

  update(id: string, plan: any): Observable<ApiUpdateResponse> {
    return this.http.patch<ApiUpdateResponse>(this.apiBaseUrl + id, plan, this.config);
  }

  delete(id: string): Observable<ApiDeleteResponse> {
    return this.http.delete<ApiDeleteResponse>(this.apiBaseUrl + id, this.config);
  }

  download(id: string, format: 'docx' | 'pdf' = 'pdf'): Observable<{ pdf: string}> {
    return this.http.get<{ pdf: string }>(this.apiBaseUrl + id + '/' + format, this.config);
  }
}
