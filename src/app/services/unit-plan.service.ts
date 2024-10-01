import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, isDevMode } from '@angular/core';
import { UnitPlan } from '../interfaces/unit-plan';
import { Observable } from 'rxjs';
import { ApiUpdateResponse } from '../interfaces/api-update-response';
import { ApiDeleteResponse } from '../interfaces/api-delete-response';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UnitPlanService {
  private http = inject(HttpClient);
  private apiBaseUrl = environment.apiUrl + 'unit-plans/';
  private config = {
    withCredentials: true,
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
    }),
  };

  findAll(): Observable<UnitPlan[]> {
    return this.http.get<UnitPlan[]>(this.apiBaseUrl, this.config);
  }

  findOne(id: string): Observable<UnitPlan> {
    return this.http.get<UnitPlan>(this.apiBaseUrl + id, this.config);
  }

  create(plan: any): Observable<UnitPlan> {
    return this.http.post<UnitPlan>(this.apiBaseUrl, plan, this.config);
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
