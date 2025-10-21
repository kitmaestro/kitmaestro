import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Todo } from '../models';
import { ApiService } from './api.service';
import { ApiDeleteResponse } from '../interfaces';

@Injectable({
	providedIn: 'root',
})
export class TodoService {
	#apiService = inject(ApiService);
	#endpoint = 'todos/';

	findAll(): Observable<Todo[]> {
		return this.#apiService.get<Todo[]>(this.#endpoint);
	}

	findOne(id: string): Observable<Todo> {
		return this.#apiService.get<Todo>(this.#endpoint + id);
	}

	findByList(id: string): Observable<Todo[]> {
		return this.#apiService.get<Todo[]>(this.#endpoint + 'by-list/' + id);
	}

	create(todo: Todo): Observable<Todo> {
		return this.#apiService.post<Todo>(this.#endpoint, todo);
	}

	update(id: string, todo: any): Observable<Todo> {
		return this.#apiService.patch<Todo>(this.#endpoint + id, todo);
	}

	delete(id: string): Observable<ApiDeleteResponse> {
		return this.#apiService.delete<ApiDeleteResponse>(this.#endpoint + id);
	}
}
