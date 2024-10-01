import { Injectable, inject, isDevMode } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiUpdateResponse } from '../interfaces/api-update-response';
import { ApiDeleteResponse } from '../interfaces/api-delete-response';
import { ClassSection } from '../interfaces/class-section';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClassSectionService {
  private http = inject(HttpClient);
  private apiBaseUrl = environment.apiUrl + 'class-sections/';
  private config = {
    withCredentials: true,
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
    }),
  };

  findAll(): Observable<ClassSection[]> {
    return this.http.get<ClassSection[]>(this.apiBaseUrl + 'all', this.config);
  }

  findSections(): Observable<ClassSection[]> {
    return this.http.get<ClassSection[]>(this.apiBaseUrl, this.config);
  }

  findSection(id: string): Observable<ClassSection> {
    return this.http.get<ClassSection>(this.apiBaseUrl + id, this.config);
  }

  addSection(section: ClassSection): Observable<ClassSection> {
    return this.http.post<ClassSection>(this.apiBaseUrl, section, this.config);
  }

  updateSection(id: string, section: any): Observable<ApiUpdateResponse> {
    return this.http.patch<ApiUpdateResponse>(this.apiBaseUrl + id, section, this.config);
  }

  deleteSection(id: string): Observable<ApiDeleteResponse> {
    return this.http.delete<ApiDeleteResponse>(this.apiBaseUrl + id, this.config);
  }
}
