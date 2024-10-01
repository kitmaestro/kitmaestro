import { Injectable, inject, isDevMode } from '@angular/core';
import { Auth, authState, User } from '@angular/fire/auth';
import { addDoc, collection, collectionData, deleteDoc, doc, docData, DocumentReference, Firestore, query, updateDoc, where } from '@angular/fire/firestore';
import { concatAll, map, Observable, of } from 'rxjs';
import { Todo } from '../interfaces/todo';
import { TodoList } from '../interfaces/todo-list';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiUpdateResponse } from '../interfaces/api-update-response';
import { ApiDeleteResponse } from '../interfaces/api-delete-response';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private http = inject(HttpClient);
  private apiBaseUrl = environment.apiUrl;
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

  create(plan: Todo): Observable<Todo> {
    return this.http.post<Todo>(this.apiBaseUrl, plan, this.config);
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

  private auth = inject(Auth);
  private firestore = inject(Firestore);

  private user$: Observable<User | null> = authState(this.auth);
  private todosRef = collection(this.firestore, 'todos');
  private todoListsRef = collection(this.firestore, 'todo-lists');

  todos$: Observable<Todo[]> = this.user$.pipe(
    map(user => {
      if (user) {
        return collectionData(query(this.todosRef, where('uid', '==', user.uid)), { idField: 'id' }) as Observable<Todo[]>
      }
      return of([]);
    }),
    concatAll()
  )

  todoLists$: Observable<TodoList[]> = this.user$.pipe(
    map(user => {
      if (user) {
        return collectionData(query(this.todoListsRef, where('uid', '==', user.uid)), { idField: 'id' }) as Observable<TodoList[]>
      }
      return of([]);
    }),
    concatAll()
  )

  find(id: string): Observable<Todo | undefined> {
    return docData<Todo>(doc(this.firestore, 'todos', id) as DocumentReference<Todo>);
  }

  findByList(id: string): Observable<Todo[]> {
    return this.todos$.pipe(
      map(todos => todos.filter(todo => todo.listId == id))
    )
  }

  findList(id: string): Observable<TodoList | undefined> {
    return docData<TodoList>(doc(this.firestore, 'todo-lists', id) as DocumentReference<TodoList>);
  }

  addTodo(todo: Todo) {
    return addDoc(this.todosRef, todo);
  }

  addList(list: TodoList) {
    return addDoc(this.todoListsRef, list);
  }

  updateTodo(id: string, todo: any) {
    return updateDoc(doc(this.firestore, 'todos', id), todo);
  }

  updateList(id: string, list: any) {
    return updateDoc(doc(this.firestore, 'todo-lists', id), list);
  }

  deleteTodo(id: string) {
    return deleteDoc(doc(this.firestore, 'todos', id));
  }

  deleteList(id: string) {
    const sus = this.findByList(id).subscribe(todos => {
      sus.unsubscribe();
      todos.forEach(todo => this.deleteTodo(todo.id))
    })
    return deleteDoc(doc(this.firestore, 'todo-lists', id));
  }
}
