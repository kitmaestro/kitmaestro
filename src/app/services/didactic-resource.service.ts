import { Injectable, inject, isDevMode } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DidacticResource } from '../interfaces/didactic-resource';
import { Observable } from 'rxjs';
import { ApiUpdateResponse } from '../interfaces/api-update-response';
import { ApiDeleteResponse } from '../interfaces/api-delete-response';

@Injectable({
  providedIn: 'root'
})
export class DidacticResourceService {
  private http = inject(HttpClient);
  private apiBaseUrl = isDevMode() ? 'http://localhost:3000/didactic-resources/' : 'http://45.79.180.237/didactic-resources/'
  private config = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
    }),
  };

  findAll(): Observable<DidacticResource[]> {
    return this.http.get<DidacticResource[]>(this.apiBaseUrl, this.config);
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

  bookmark(id: string) {
    return this.http.post(this.apiBaseUrl+ id + '/bookmark', this.config);
  }

  like(id: string) {
    return this.http.post(this.apiBaseUrl+ id + '/like', this.config);
  }

  dislike(id: string) {
    return this.http.post(this.apiBaseUrl+ id + '/dislike', this.config);
  }

  buy(id: string) {
    return this.http.post(this.apiBaseUrl+ id + '/buy', this.config);
  }

  download(id: string) {
    return this.http.post(this.apiBaseUrl+ id + '/download', this.config);
  }
}
