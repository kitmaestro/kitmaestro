import { Injectable, inject, isDevMode } from '@angular/core';
import { Observable } from 'rxjs';
import { UserSettings } from '../interfaces/user-settings';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiUpdateResponse } from '../interfaces/api-update-response';

@Injectable({
  providedIn: 'root'
})
export class UserSettingsService {
  private http = inject(HttpClient);
  private config = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('access_token')}`
    })
  };

  private apiBaseUrl = isDevMode() ? 'http://localhost:3000/' : 'http://api.kitmaestro.com/';

  getSettings(userId?: string): Observable<UserSettings> {
    if (userId) {
      return this.http.get<UserSettings>(this.apiBaseUrl + 'users/' + userId, this.config);
    }
    return this.http.get<UserSettings>(this.apiBaseUrl + 'auth/profile', this.config);
  }

  update(user: any): Observable<ApiUpdateResponse> {
    return this.http.patch<ApiUpdateResponse>(this.apiBaseUrl + 'auth/profile', user, this.config);
  }

  setPhotoUrl(photoURL: string): Observable<ApiUpdateResponse> {
    return this.http.patch<ApiUpdateResponse>(this.apiBaseUrl + 'auth/profile', { photoURL }, this.config);
  }
}
