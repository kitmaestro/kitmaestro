import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserSettings } from '../interfaces/user-settings';
import { ApiUpdateResponse } from '../interfaces/api-update-response';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http = inject(HttpClient)
  private apiUrl = environment.apiUrl + 'auth/';

  login(email: string, password: string): Observable<{ user: UserSettings, access_token: string, error?: string }> {
    return this.http.post<{ user: UserSettings, access_token: string }>(this.apiUrl + 'login', {
      email,
      password
    }, { withCredentials: true })
  }

  signup(body: { email: string, password: string, plan?: string, ref?: string }): Observable<{ user: UserSettings, access_token: string }> {
    return this.http.post<{ user: UserSettings, access_token: string }>(this.apiUrl + 'signup', body, { withCredentials: true })
  }

  logout(): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(this.apiUrl + 'logout', {}, { withCredentials: true });
  }

  profile(): Observable<UserSettings> {
    return this.http.get<UserSettings>(this.apiUrl + 'profile', { withCredentials: true });
  }

  update(data: UserSettings): Observable<ApiUpdateResponse> {
    return this.http.patch<ApiUpdateResponse>(this.apiUrl + 'profile', data, { withCredentials: true });
  }

  recover(email: string) {
    return this.http.post(this.apiUrl + 'recover', { email }, { withCredentials: true });
  }

  resetPassword(email: string, token: string, password: string) {
    return this.http.post(this.apiUrl + 'reset-password', { email, token, password }, { withCredentials: true });
  }
}
