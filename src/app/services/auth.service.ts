import { inject, Injectable, isDevMode } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserSettings } from '../interfaces/user-settings';
import { ApiUpdateResponse } from '../interfaces/api-update-response';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  http = inject(HttpClient)
  apiUrl = isDevMode() ? 'http://localhost:3000/auth/' : 'http://api.kitmaestro.com/auth/';

  login(email: string, password: string): Observable<{ user: UserSettings, access_token: string }> {
    return this.http.post<{ user: UserSettings, access_token: string }>(this.apiUrl + 'login', {
      email,
      password
    })
  }

  googleSignup(user: any): Observable<{ user: UserSettings, access_token: string }> {
    return this.http.post<{ user: UserSettings, access_token: string }>(this.apiUrl + 'google-login', {
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL
    });
  }

  signup(email: string, password: string): Observable<{ user: UserSettings, access_token: string }> {
    return this.http.post<{ user: UserSettings, access_token: string }>(this.apiUrl + 'signup', {
      email,
      password
    })
  }

  profile(): Observable<UserSettings> {
    return this.http.get<UserSettings>(this.apiUrl + 'profile', {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      })
    })
  }

  update(data: UserSettings): Observable<ApiUpdateResponse> {
    return this.http.patch<ApiUpdateResponse>(this.apiUrl + 'profile', data, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      })
    })
  }
}
