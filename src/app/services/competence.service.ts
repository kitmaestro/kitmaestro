import { Injectable, inject, isDevMode } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DocumentReference, Firestore, addDoc, collection, collectionData, doc, docData, query, where } from '@angular/fire/firestore';
import { CompetenceEntry } from '../interfaces/competence-entry';
import { Observable, concatAll, from, map } from 'rxjs';
import { ApiUpdateResponse } from '../interfaces/api-update-response';
import { ApiDeleteResponse } from '../interfaces/api-delete-response';

@Injectable({
  providedIn: 'root'
})
export class CompetenceService {
  private http = inject(HttpClient);
  private firestore = inject(Firestore);
  private competenceColRef = collection(this.firestore, 'competence');

  private apiBaseUrl = isDevMode() ? 'http://localhost:3000/competence/' : 'http://45.79.180.237/competence/';
  private config = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
    }),
  };

  createCompetence(data: CompetenceEntry): Observable<CompetenceEntry> {
    return this.http.post<CompetenceEntry>(this.apiBaseUrl, data, this.config);
  }

  findAll(): Observable<CompetenceEntry[]> {
    return this.http.get<CompetenceEntry[]>(this.apiBaseUrl, this.config);
  }

  findByLevel(level: string): Observable<CompetenceEntry[]> {
    return this.http.get<CompetenceEntry[]>(this.apiBaseUrl + 'by-level/' + level, this.config);
  }

  findByGrade(grade: string): Observable<CompetenceEntry[]> {
    return this.http.get<CompetenceEntry[]>(this.apiBaseUrl + 'by-grade/' + grade, this.config);
  }

  findBySubject(subject: string): Observable<CompetenceEntry[]> {
    return this.http.get<CompetenceEntry[]>(this.apiBaseUrl + 'by-subject/' + subject, this.config);
  }

  findOne(id: string): Observable<CompetenceEntry> {
    return this.http.get<CompetenceEntry>(this.apiBaseUrl + id, this.config);
  }

  update(id: string, competence: any): Observable<ApiUpdateResponse> {
    return this.http.patch<ApiUpdateResponse>(this.apiBaseUrl + id, competence, this.config);
  }

  delete(id: string): Observable<ApiDeleteResponse> {
    return this.http.delete<ApiDeleteResponse>(this.apiBaseUrl + id, this.config);
  }
}
