import { inject, Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { Update } from '../models'
import { ApiDeleteResponse } from '../interfaces'
import { ApiService } from './api.service'

@Injectable({
	providedIn: 'root',
})
export class UpdateService {
	#apiService = inject(ApiService)
	#endpoint = 'updates/'

	findAll(): Observable<Update[]> {
		return this.#apiService.get<Update[]>(this.#endpoint)
	}

	find(id: string): Observable<Update> {
		return this.#apiService.get<Update>(this.#endpoint + id)
	}

	create(update: Partial<Update>): Observable<Update> {
		return this.#apiService.post<Update>(this.#endpoint, update)
	}

	update(id: string, update: Partial<Update>): Observable<Update> {
		return this.#apiService.patch<Update>(this.#endpoint + id, update)
	}

	delete(id: string): Observable<ApiDeleteResponse> {
		return this.#apiService.delete<ApiDeleteResponse>(this.#endpoint + id)
	}
}
