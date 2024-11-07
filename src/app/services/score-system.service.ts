import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { ScoreSystem } from '../interfaces/score-system';
import { ApiUpdateResponse } from '../interfaces/api-update-response';
import { ApiDeleteResponse } from '../interfaces/api-delete-response';

@Injectable({
  providedIn: 'root'
})
export class ScoreSystemService {
  private http = inject(HttpClient);
  private apiBaseUrl = environment.apiUrl + 'score-systems/';
  private config = {
    withCredentials: true,
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
    }),
  };

  findAll(): Observable<ScoreSystem[]> {
    return this.http.get<ScoreSystem[]>(this.apiBaseUrl, this.config);
  }

  find(id: string): Observable<ScoreSystem> {
    return this.http.get<ScoreSystem>(this.apiBaseUrl + id, this.config);
  }

  create(plan: ScoreSystem): Observable<ScoreSystem> {
    return this.http.post<ScoreSystem>(this.apiBaseUrl, plan, this.config);
  }

  update(id: string, plan: any): Observable<ApiUpdateResponse> {
    return this.http.patch<ApiUpdateResponse>(this.apiBaseUrl + id, plan, this.config);
  }

  delete(id: string): Observable<ApiDeleteResponse> {
    return this.http.delete<ApiDeleteResponse>(this.apiBaseUrl + id, this.config);
  }
}
