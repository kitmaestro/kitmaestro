import { inject, Injectable, isDevMode } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserSettings } from '../interfaces/user-settings';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  http = inject(HttpClient)
  apiUrl = isDevMode() ? 'http://localhost:3000/auth/' : 'http://45.79.180.237/auth/';

  login(email: string, password: string): Observable<{ user: UserSettings, access_token: string }> {
    return this.http.post<{ user: UserSettings, access_token: string }>(this.apiUrl + 'login', {
      email,
      password
    })
  }

  signup(email: string, password: string): Observable<{ user: UserSettings, access_token: string }> {
    return this.http.post<{ user: UserSettings, access_token: string }>(this.apiUrl + 'signup', {
      email,
      password
    })
  }

  profile() {
    return this.http.get(this.apiUrl + 'profile', {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      })
    })
  }
}
