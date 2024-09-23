import { Injectable, inject, isDevMode } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

  findAll(): Observable<DidacticResource[]> {
    return this.http.get<DidacticResource[]>(this.apiBaseUrl);
  }

  findOne(id: string): Observable<DidacticResource> {
    return this.http.get<DidacticResource>(this.apiBaseUrl + id);
  }

  findByUser(id: string): Observable<DidacticResource[]> {
    return this.http.get<DidacticResource[]>(this.apiBaseUrl + 'by-user/' + id);
  }

  findMyResources(): Observable<DidacticResource[]> {
    return this.http.get<DidacticResource[]>(this.apiBaseUrl+'my-resources');
  }

  create(resource: any): Observable<DidacticResource> {
    return this.http.post<DidacticResource>(this.apiBaseUrl, resource);
  }

  update(id: string, resource: any): Observable<ApiUpdateResponse> {
    return this.http.patch<ApiUpdateResponse>(this.apiBaseUrl + id, resource);
  }

  delete(id: string): Observable<ApiDeleteResponse> {
    return this.http.delete<ApiDeleteResponse>(this.apiBaseUrl + id);
  }

  bookmark(id: string) {
    return this.http.post(this.apiBaseUrl+ id + '/bookmark', {});
  }

  like(id: string) {
    return this.http.post(this.apiBaseUrl+ id + '/like', {});
  }

  dislike(id: string) {
    return this.http.post(this.apiBaseUrl+ id + '/dislike', {});
  }

  buy(id: string) {
    return this.http.post(this.apiBaseUrl+ id + '/buy', {});
  }

  download(id: string) {
    return this.http.post(this.apiBaseUrl+ id + '/download', {});
  }
}
