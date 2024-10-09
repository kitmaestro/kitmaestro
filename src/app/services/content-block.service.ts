import { inject, Injectable } from '@angular/core';
import { ContentBlock } from '../interfaces/content-block';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiDeleteResponse } from '../interfaces/api-delete-response';
import { ApiUpdateResponse } from '../interfaces/api-update-response';

@Injectable({
  providedIn: 'root'
})
export class ContentBlockService {
  private http = inject(HttpClient);
  private apiBaseUrl = environment.apiUrl + 'content-blocks/';
  private config = {
    withCredentials: true,
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
    }),
  };

  findAll(filters: any): Observable<ContentBlock[]> {
    let params = new HttpParams();
    Object.keys(filters).forEach(key => {
      params = params.set(key, filters[key]);
    });
    return this.http.get<ContentBlock[]>(this.apiBaseUrl, { ...this.config, params });
  }

  find(id: string): Observable<ContentBlock> {
    return this.http.get<ContentBlock>(this.apiBaseUrl + id, this.config);
  }

  create(list: ContentBlock): Observable<ContentBlock> {
    return this.http.post<ContentBlock>(this.apiBaseUrl, list, this.config);
  }

  update(id: string, list: any): Observable<ApiUpdateResponse> {
    return this.http.patch<ApiUpdateResponse>(this.apiBaseUrl + id, list, this.config);
  }

  delete(id: string): Observable<ApiDeleteResponse> {
    return this.http.delete<ApiDeleteResponse>(this.apiBaseUrl + id, this.config);
  }
}
