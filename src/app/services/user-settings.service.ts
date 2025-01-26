import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { UserSettings } from '../interfaces/user-settings';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiUpdateResponse } from '../interfaces/api-update-response';
import { environment } from '../../environments/environment';
import { ApiDeleteResponse } from '../interfaces/api-delete-response';

@Injectable({
  providedIn: 'root'
})
export class UserSettingsService {
  private http = inject(HttpClient);
  private config = {
    withCredentials: true,
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('access_token')}`
    })
  };

  private apiBaseUrl = environment.apiUrl + 'users/';

  findAll(): Observable<UserSettings[]> {
    return this.http.get<UserSettings[]>(this.apiBaseUrl, this.config);
  }

  find(id: string): Observable<UserSettings> {
    return this.http.get<UserSettings>(this.apiBaseUrl + id, this.config);
  }

  create(data: any): Observable<UserSettings> {
    return this.http.post<UserSettings>(this.apiBaseUrl, data, this.config);
  }

  getSettings(userId?: string): Observable<UserSettings> {
    if (userId) {
      return this.http.get<UserSettings>(this.apiBaseUrl + userId, this.config);
    }
    return this.http.get<UserSettings>(environment.apiUrl + 'auth/profile', this.config);
  }

  update(id: string, user: any): Observable<ApiUpdateResponse> {
    return this.http.patch<ApiUpdateResponse>(this.apiBaseUrl + id, user, this.config);
  }

  delete(id: string): Observable<ApiDeleteResponse> {
    return this.http.delete<ApiDeleteResponse>(this.apiBaseUrl + id, this.config);
  }

  setPhotoUrl(photoURL: string): Observable<ApiUpdateResponse> {
    return this.http.patch<ApiUpdateResponse>(this.apiBaseUrl + 'auth/profile', { photoURL }, this.config);
  }
}
