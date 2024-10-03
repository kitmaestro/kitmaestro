import { inject, Injectable } from '@angular/core';
import { ApiDeleteResponse } from '../interfaces/api-delete-response';
import { Observable } from 'rxjs';
import { ApiUpdateResponse } from '../interfaces/api-update-response';
import { TodoList } from '../interfaces/todo-list';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TodoListService {
  private http = inject(HttpClient);
  private apiBaseUrl = environment.apiUrl + 'todo-lists/';
  private config = {
    withCredentials: true,
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
    }),
  };

  findAll(): Observable<TodoList[]> {
    return this.http.get<TodoList[]>(this.apiBaseUrl, this.config);
  }

  findOne(id: string): Observable<TodoList> {
    return this.http.get<TodoList>(this.apiBaseUrl + id, this.config);
  }

  create(plan: any): Observable<TodoList> {
    return this.http.post<TodoList>(this.apiBaseUrl, plan, this.config);
  }

  update(id: string, plan: any): Observable<ApiUpdateResponse> {
    return this.http.patch<ApiUpdateResponse>(this.apiBaseUrl + id, plan, this.config);
  }

  delete(id: string): Observable<ApiDeleteResponse> {
    return this.http.delete<ApiDeleteResponse>(this.apiBaseUrl + id, this.config);
  }
}
