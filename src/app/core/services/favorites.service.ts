import { inject, Injectable } from '@angular/core'
import { AppEntry } from '../interfaces'
import { Observable } from 'rxjs'
import { ApiUpdateResponse } from '../interfaces'
import { ApiService } from './api.service'

@Injectable({
	providedIn: 'root',
})
export class FavoritesService {
	#apiService = inject(ApiService)
	#endpoint = 'favorite-tools/'

	findAll(): Observable<{ user: string, tools: AppEntry[] }> {
		return this.#apiService.get<{ user: string, tools: AppEntry[] }>(this.#endpoint)
	}

	create(data: AppEntry[]): Observable<{ user: string, tools: AppEntry[] }> {
		return this.#apiService.post<{ user: string, tools: AppEntry[] }>(this.#endpoint, data)
	}

	update(data: any): Observable<ApiUpdateResponse> {
		return this.#apiService.patch<ApiUpdateResponse>(this.#endpoint, data)
	}
}
