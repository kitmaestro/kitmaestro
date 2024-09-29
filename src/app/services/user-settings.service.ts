import { Injectable, inject, isDevMode } from '@angular/core';
import { Observable } from 'rxjs';
import { UserSettings } from '../interfaces/user-settings';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserSettingsService {
  private http = inject(HttpClient);
  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
  });

  private user$: Observable<UserSettings> = this.getSettings();

  private apiBaseUrl = isDevMode() ? 'http://localhost:3000/' : 'http://api.kitmaestro.com/';

  getSettings(userId?: string): Observable<UserSettings> {
    if (userId) {
      return this.http.get<UserSettings>(this.apiBaseUrl + 'users/' + userId, { headers: this.headers });
    }
    return this.http.get<UserSettings>(this.apiBaseUrl + 'auth/profile', { headers: this.headers });
  }

  update(user: UserSettings) {
    return this.http.patch(this.apiBaseUrl + 'auth/profile', user, { headers: this.headers });
  }

  setPhotoUrl(photoURL: string): Observable<any> {
    return this.http.patch<any>(this.apiBaseUrl + 'auth/profile', { photoURL }, { headers: this.headers });
  }
}
