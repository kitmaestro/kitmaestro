import { inject, Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { ApiDeleteResponse, ApiUpdateResponse } from '../interfaces'
import { TodoList } from '../models'
import { ApiService } from './api.service'

@Injectable({
	providedIn: 'root',
})
export class TodoListService {
	#apiService = inject(ApiService)
	#endpoint = 'todo-lists/'

	findAll(): Observable<TodoList[]> {
		return this.#apiService.get<TodoList[]>(this.#endpoint)
	}

	findOne(id: string): Observable<TodoList> {
		return this.#apiService.get<TodoList>(this.#endpoint + id)
	}

	create(plan: any): Observable<TodoList> {
		return this.#apiService.post<TodoList>(this.#endpoint, plan)
	}

	update(id: string, plan: any): Observable<ApiUpdateResponse> {
		return this.#apiService.patch<ApiUpdateResponse>(this.#endpoint + id, plan)
	}

	delete(id: string): Observable<ApiDeleteResponse> {
		return this.#apiService.delete<ApiDeleteResponse>(this.#endpoint + id)
	}
}
