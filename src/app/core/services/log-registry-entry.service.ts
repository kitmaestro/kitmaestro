import { Injectable, inject } from '@angular/core'
import { Observable } from 'rxjs'
import { LogRegistryEntry } from '../interfaces/log-registry-entry'
import { ApiDeleteResponse } from '../interfaces'
import { ApiService } from './api.service'

@Injectable({
	providedIn: 'root',
})
export class LogRegistryEntryService {
	#apiService = inject(ApiService)
	#endpoint = 'log-registry-entries/'

	findAll(): Observable<LogRegistryEntry[]> {
		return this.#apiService.get<LogRegistryEntry[]>(this.#endpoint)
	}

	find(id: string): Observable<LogRegistryEntry> {
		return this.#apiService.get<LogRegistryEntry>(this.#endpoint + id)
	}

	create(plan: LogRegistryEntry): Observable<LogRegistryEntry> {
		return this.#apiService.post<LogRegistryEntry>(this.#endpoint, plan)
	}

	update(id: string, plan: any): Observable<LogRegistryEntry> {
		return this.#apiService.patch<LogRegistryEntry>(this.#endpoint + id, plan)
	}

	delete(id: string): Observable<ApiDeleteResponse> {
		return this.#apiService.delete<ApiDeleteResponse>(this.#endpoint + id)
	}

	download(
		id: string,
		format: 'docx' | 'pdf' = 'pdf',
	): Observable<{ pdf: string }> {
		return this.#apiService.get<{ pdf: string }>(this.#endpoint + id + '/' + format)
	}
}
