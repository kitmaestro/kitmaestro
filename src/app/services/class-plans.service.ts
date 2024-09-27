import { inject, Injectable, isDevMode } from '@angular/core';
import { Observable } from 'rxjs';
import { ClassPlan } from '../interfaces/class-plan';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiUpdateResponse } from '../interfaces/api-update-response';
import { ApiDeleteResponse } from '../interfaces/api-delete-response';

@Injectable({
  providedIn: 'root'
})
export class ClassPlansService {
  private http = inject(HttpClient);
  private apiBaseUrl = isDevMode() ? 'http://localhost:3000/class-plans/' : 'http://45.79.180.237/class-plans/';
  private config = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
    }),
  };

  findAll(): Observable<ClassPlan[]> {
    return this.http.get<ClassPlan[]>(this.apiBaseUrl, this.config);
  }

  find(id: string): Observable<ClassPlan> {
    return this.http.get<ClassPlan>(this.apiBaseUrl + id, this.config);
  }

  addPlan(plan: ClassPlan): Observable<ClassPlan> {
    return this.http.post<ClassPlan>(this.apiBaseUrl, plan, this.config);
  }

  updatePlan(id: string, plan: any): Observable<ApiUpdateResponse> {
    return this.http.patch<ApiUpdateResponse>(this.apiBaseUrl + id, plan, this.config);
  }

  deletePlan(id: string): Observable<ApiDeleteResponse> {
    return this.http.delete<ApiDeleteResponse>(this.apiBaseUrl + id, this.config);
  }
}
