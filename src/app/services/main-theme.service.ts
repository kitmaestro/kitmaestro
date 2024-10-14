import { inject, Injectable } from '@angular/core';
import { ApiDeleteResponse } from '../interfaces/api-delete-response';
import { Observable } from 'rxjs';
import { ApiUpdateResponse } from '../interfaces/api-update-response';
import { MainTheme } from '../interfaces/main-theme';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MainThemeService {
  private http = inject(HttpClient);
  private apiBaseUrl = environment.apiUrl + 'main-themes/';
  private config = {
    withCredentials: true,
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
    }),
  };

  findAll(filters: any): Observable<MainTheme[]> {
    let params = new HttpParams();
    Object.keys(filters).forEach(key => {
      params = params.set(key, filters[key]);
    });
    return this.http.get<MainTheme[]>(this.apiBaseUrl, { ...this.config, params });
  }

  find(id: string): Observable<MainTheme> {
    return this.http.get<MainTheme>(this.apiBaseUrl + id, this.config);
  }

  create(theme: MainTheme): Observable<MainTheme> {
    return this.http.post<MainTheme>(this.apiBaseUrl, theme, this.config);
  }

  update(id: string, theme: any): Observable<ApiUpdateResponse> {
    return this.http.patch<ApiUpdateResponse>(this.apiBaseUrl + id, theme, this.config);
  }

  delete(id: string): Observable<ApiDeleteResponse> {
    return this.http.delete<ApiDeleteResponse>(this.apiBaseUrl + id, this.config);
  }
}
