import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject, isDevMode } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PlanningService {
  private http = inject(HttpClient);
  private apiBaseUrl = isDevMode() ? 'http://localhost:3000/' : 'http://45.79.180.237/';
  private config = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
    }),
  };
}
