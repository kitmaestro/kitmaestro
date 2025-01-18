import { inject, Injectable } from '@angular/core';
import { ApiDeleteResponse } from '../interfaces/api-delete-response';
import { Observable } from 'rxjs';
import { ApiUpdateResponse } from '../interfaces/api-update-response';
import { Checklist } from '../interfaces/checklist';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChecklistService {
  private http = inject(HttpClient);
  private apiBaseUrl = environment.apiUrl + 'checklists/';
  private config = {
    withCredentials: true,
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
    }),
  };

  findAll(filters?: any): Observable<Checklist[]> {
    let params = new HttpParams();
    if (filters) {
      Object.keys(filters).forEach(key => {
        params = params.set(key, filters[key]);
      });
    }
    return this.http.get<Checklist[]>(this.apiBaseUrl, { ...this.config, params });
  }

  find(id: string): Observable<Checklist> {
    return this.http.get<Checklist>(this.apiBaseUrl + id, this.config);
  }

  create(idea: Checklist): Observable<Checklist> {
    return this.http.post<Checklist>(this.apiBaseUrl, idea, this.config);
  }

  update(id: string, idea: any): Observable<ApiUpdateResponse> {
    return this.http.patch<ApiUpdateResponse>(this.apiBaseUrl + id, idea, this.config);
  }

  delete(id: string): Observable<ApiDeleteResponse> {
    return this.http.delete<ApiDeleteResponse>(this.apiBaseUrl + id, this.config);
  }

  download(list: Checklist) {}
}
