import { Injectable, inject } from '@angular/core';
import { Auth, authState, User } from '@angular/fire/auth';
import { addDoc, collection, collectionData, deleteDoc, doc, docData, DocumentReference, Firestore, query, updateDoc, where } from '@angular/fire/firestore';
import { concatAll, map, Observable, of } from 'rxjs';
import { Todo } from '../interfaces/todo';
import { TodoList } from '../interfaces/todo-list';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

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
