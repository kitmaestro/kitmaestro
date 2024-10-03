import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Todo } from '../interfaces/todo';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiUpdateResponse } from '../interfaces/api-update-response';
import { ApiDeleteResponse } from '../interfaces/api-delete-response';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private http = inject(HttpClient);
  private apiBaseUrl = environment.apiUrl + 'todos/';
  private config = {
    withCredentials: true,
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
    }),
  };

  findAll(): Observable<Todo[]> {
    return this.http.get<Todo[]>(this.apiBaseUrl, this.config);
  }

  findOne(id: string): Observable<Todo> {
    return this.http.get<Todo>(this.apiBaseUrl + id, this.config);
  }

  findByList(id: string): Observable<Todo[]> {
    return this.http.get<Todo[]>(this.apiBaseUrl + 'by-list/' + id, this.config);
  }

  create(todo: Todo): Observable<Todo> {
    return this.http.post<Todo>(this.apiBaseUrl, todo, this.config);
  }

  update(id: string, todo: any): Observable<ApiUpdateResponse> {
    return this.http.patch<ApiUpdateResponse>(this.apiBaseUrl + id, todo, this.config);
  }

  delete(id: string): Observable<ApiDeleteResponse> {
    return this.http.delete<ApiDeleteResponse>(this.apiBaseUrl + id, this.config);
  }
}
