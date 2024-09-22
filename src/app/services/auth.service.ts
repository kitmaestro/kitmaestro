import { inject, Injectable, isDevMode } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  http = inject(HttpClient)
  apiUrl = isDevMode() ? 'http://localhost:3000' : 'http://45.79.180.237';

  login(email: string, password: string): Observable<{ access_token: string }> {
    return this.http.post<{ access_token: string }>(this.apiUrl + '/auth/login', {
      email,
      password
    })
  }

  signup(email: string, password: string): Observable<{ access_token: string }> {
    return this.http.post<{ access_token: string }>(this.apiUrl + '/auth/signup', {
      email,
      password
    })
  }

  profile() {
    return this.http.get(this.apiUrl + '/auth/profile', {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      })
    })
  }
}
