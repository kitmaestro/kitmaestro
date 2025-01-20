import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { DidacticResource } from '../interfaces/didactic-resource';
import { Observable } from 'rxjs';
import { ApiUpdateResponse } from '../interfaces/api-update-response';
import { ApiDeleteResponse } from '../interfaces/api-delete-response';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DidacticResourceService {
  private http = inject(HttpClient);
  private apiBaseUrl = environment.apiUrl + 'didactic-resources/'
  private config = {
    withCredentials: true,
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
    }),
  };

  findAll(filters?: any): Observable<DidacticResource[]> {
    let params = new HttpParams();
    if (filters) {
      for (let filter in filters) {
        params = params.append(filter, filters[filter]);
      }
    }
    return this.http.get<DidacticResource[]>(this.apiBaseUrl, { ...this.config, params });
  }

  findOne(id: string): Observable<DidacticResource> {
    return this.http.get<DidacticResource>(this.apiBaseUrl + id, this.config);
  }

  findByUser(id: string): Observable<DidacticResource[]> {
    return this.http.get<DidacticResource[]>(this.apiBaseUrl + 'by-user/' + id, this.config);
  }

  findMyResources(): Observable<DidacticResource[]> {
    return this.http.get<DidacticResource[]>(this.apiBaseUrl + 'my-resources', this.config);
  }

  create(resource: any): Observable<DidacticResource> {
    return this.http.post<DidacticResource>(this.apiBaseUrl, resource, this.config);
  }

  update(id: string, resource: any): Observable<ApiUpdateResponse> {
    return this.http.patch<ApiUpdateResponse>(this.apiBaseUrl + id, resource, this.config);
  }

  delete(id: string): Observable<ApiDeleteResponse> {
    return this.http.delete<ApiDeleteResponse>(this.apiBaseUrl + id, this.config);
  }

  bookmark(id: string): Observable<ApiUpdateResponse> {
    return this.http.post<ApiUpdateResponse>(this.apiBaseUrl+ id + '/bookmark', {}, this.config);
  }

  like(id: string): Observable<ApiUpdateResponse> {
    return this.http.post<ApiUpdateResponse>(this.apiBaseUrl+ id + '/like', {}, this.config);
  }

  dislike(id: string): Observable<ApiUpdateResponse> {
    return this.http.post<ApiUpdateResponse>(this.apiBaseUrl+ id + '/dislike', {}, this.config);
  }

  buy(id: string): Observable<ApiUpdateResponse> {
    return this.http.post<ApiUpdateResponse>(this.apiBaseUrl+ id + '/buy', {}, this.config);
  }

  download(id: string): Observable<ApiUpdateResponse> {
    return this.http.post<ApiUpdateResponse>(this.apiBaseUrl+ id + '/download', {}, this.config);
  }
}
