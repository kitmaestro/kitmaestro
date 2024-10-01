import { Injectable, inject, isDevMode } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Referral } from '../interfaces/referral';
import { ApiUpdateResponse } from '../interfaces/api-update-response';
import { ApiDeleteResponse } from '../interfaces/api-delete-response';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReferralsService {
  private http = inject(HttpClient);
  private apiBaseUrl = environment.apiUrl + 'referrals/';

  private config = {
    withCredentials: true,
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('access_token')
    })
  };

  findAll(): Observable<Referral[]> {
    return this.http.get<Referral[]>(this.apiBaseUrl, this.config);
  }

  find(id: string): Observable<Referral> {
    return this.http.get<Referral>(this.apiBaseUrl + id, this.config);
  }

  findReferred(id: string): Observable<Referral> {
    return this.http.get<Referral>(this.apiBaseUrl + 'referred/' + id, this.config);
  }

  addReferral(referral: Referral): Observable<Referral> {
    return this.http.post<Referral>(this.apiBaseUrl, referral, this.config);
  }

  updateReferral(id: string, referral: any): Observable<ApiUpdateResponse> {
    return this.http.patch<ApiUpdateResponse>(this.apiBaseUrl + id, referral, this.config);
  }

  deleteReferral(id: string): Observable<ApiDeleteResponse> {
    return this.http.delete<ApiDeleteResponse>(this.apiBaseUrl + id, this.config);
  }
}
