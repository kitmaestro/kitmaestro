import { inject, Injectable, isDevMode } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserSettings } from '../interfaces/user-settings';
import { ApiUpdateResponse } from '../interfaces/api-update-response';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  http = inject(HttpClient)
  apiUrl = environment.apiUrl + 'auth/';

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

  profile(): Observable<UserSettings> {
    return this.http.get<UserSettings>(this.apiUrl + 'profile', { withCredentials: true })
  }

  update(data: UserSettings): Observable<ApiUpdateResponse> {
    return this.http.patch<ApiUpdateResponse>(this.apiUrl + 'profile', data, { withCredentials: true })
  }
}
