import { inject, Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { MainTheme } from '../models'
import { ApiDeleteResponse, ApiUpdateResponse } from '../interfaces'
import { ApiService } from './api.service'

@Injectable({
	providedIn: 'root',
})
export class MainThemeService {
	#apiService = inject(ApiService)
	#endpoint = 'main-themes/'

	findAll(filters: any): Observable<MainTheme[]> {
		return this.#apiService.get<MainTheme[]>(this.#endpoint, filters)
	}

	find(id: string): Observable<MainTheme> {
		return this.#apiService.get<MainTheme>(this.#endpoint + id)
	}

	create(theme: MainTheme): Observable<MainTheme> {
		return this.#apiService.post<MainTheme>(this.#endpoint, theme)
	}

	update(id: string, theme: any): Observable<ApiUpdateResponse> {
		return this.#apiService.patch<ApiUpdateResponse>(this.#endpoint + id, theme)
	}

	delete(id: string): Observable<ApiDeleteResponse> {
		return this.#apiService.delete<ApiDeleteResponse>(this.#endpoint + id)
	}
}
