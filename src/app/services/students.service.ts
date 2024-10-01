import { Injectable, inject, isDevMode } from '@angular/core';
import { Auth, User, authState } from '@angular/fire/auth';
import { Firestore, collection, collectionData, query, where } from '@angular/fire/firestore';
import { Student } from '../interfaces/student';
import { Observable, concatAll, map, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiUpdateResponse } from '../interfaces/api-update-response';
import { ApiDeleteResponse } from '../interfaces/api-delete-response';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StudentsService {
  private http = inject(HttpClient);
  private apiBaseUrl = environment.apiUrl + 'students/';
  private config = {
    withCredentials: true,
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
    }),
  };

  auth = inject(Auth);
  firestore = inject(Firestore);

  user$: Observable<User | null> = authState(this.auth);
  studentsRef = collection(this.firestore, 'students');
  classSections$: Observable<Student[]> = this.user$.pipe(
    map(user => {
      if (user) {
        return collectionData(query(this.studentsRef, where('uid', '==', user.uid)), { idField: 'id' }) as Observable<Student[]>
      }
      return of([]);
    }),
    concatAll()
  );

  bySection(section: string): Observable<Student[]> {
    return this.user$.pipe(
      map(user => {
        if (user) {
          return collectionData(query(this.studentsRef, where('section', '==', section)), { idField: 'id' }) as Observable<Student[]>;
        }
        return of([]);
      }),
      concatAll(),
    )
  }

  findAll(): Observable<Student[]> {
    return this.http.get<Student[]>(this.apiBaseUrl, this.config);
  }

  find(id: string): Observable<Student> {
    return this.http.get<Student>(this.apiBaseUrl + id, this.config);
  }

  create(plan: Student): Observable<Student> {
    return this.http.post<Student>(this.apiBaseUrl, plan, this.config);
  }

  update(id: string, plan: any): Observable<ApiUpdateResponse> {
    return this.http.patch<ApiUpdateResponse>(this.apiBaseUrl + id, plan, this.config);
  }

  delete(id: string): Observable<ApiDeleteResponse> {
    return this.http.delete<ApiDeleteResponse>(this.apiBaseUrl + id, this.config);
  }

  download(id: string, format: 'docx' | 'pdf' = 'pdf'): Observable<{ pdf: string}> {
    return this.http.get<{ pdf: string }>(this.apiBaseUrl + id + '/' + format, this.config);
  }
}
