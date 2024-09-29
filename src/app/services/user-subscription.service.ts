import { Injectable, inject, isDevMode } from '@angular/core';
import { Observable } from 'rxjs';
import { UserSubscription } from '../interfaces/user-subscription';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiUpdateResponse } from '../interfaces/api-update-response';
import { ApiDeleteResponse } from '../interfaces/api-delete-response';

@Injectable({
  providedIn: 'root'
})
export class UserSubscriptionService {
  private http = inject(HttpClient);
  private apiBaseUrl = isDevMode() ? 'http://localhost:3000/user-subscriptions/' : 'http://api.kitmaestro.com/user-subscriptions/';

  private config = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('access_token')
    })
  };

  findAll(): Observable<UserSubscription[]> {
    return this.http.get<UserSubscription[]>(this.apiBaseUrl, this.config);
  }

  find(id: string): Observable<UserSubscription> {
    return this.http.get<UserSubscription>(this.apiBaseUrl + id, this.config);
  }

  findByUser(id: string): Observable<UserSubscription> {
    return this.http.get<UserSubscription>(this.apiBaseUrl + 'by-user/' + id, this.config);
  }

  checkSubscription(): Observable<UserSubscription> {
    return this.http.get<UserSubscription>(this.apiBaseUrl + 'me', this.config);
  }

  addReferral(referral: UserSubscription): Observable<UserSubscription> {
    return this.http.post<UserSubscription>(this.apiBaseUrl, referral, this.config);
  }

  updateReferral(id: string, referral: any): Observable<ApiUpdateResponse> {
    return this.http.patch<ApiUpdateResponse>(this.apiBaseUrl + id, referral, this.config);
  }

  deleteReferral(id: string): Observable<ApiDeleteResponse> {
    return this.http.delete<ApiDeleteResponse>(this.apiBaseUrl + id, this.config);
  }
}
