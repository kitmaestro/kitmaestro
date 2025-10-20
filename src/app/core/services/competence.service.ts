import { Injectable, inject } from '@angular/core'
import { Observable } from 'rxjs'
import { CompetenceEntry } from '../models'
import { ApiUpdateResponse, ApiDeleteResponse } from '../interfaces'
import { ApiService } from './api.service'

@Injectable({
	providedIn: 'root',
})
export class CompetenceService {
	#apiService = inject(ApiService)
	#endpoint = 'competence/'

	createCompetence(data: CompetenceEntry): Observable<CompetenceEntry> {
		return this.#apiService.post<CompetenceEntry>(this.#endpoint, data)
	}

	findAll(filters?: any): Observable<CompetenceEntry[]> {
		return this.#apiService.get<CompetenceEntry[]>(this.#endpoint, filters)
	}

	findByLevel(level: string): Observable<CompetenceEntry[]> {
		return this.#apiService.get<CompetenceEntry[]>(this.#endpoint + 'by-level/' + level)
	}

	findByGrade(grade: string): Observable<CompetenceEntry[]> {
		return this.#apiService.get<CompetenceEntry[]>(this.#endpoint + 'by-grade/' + grade)
	}

	findBySubject(subject: string): Observable<CompetenceEntry[]> {
		return this.#apiService.get<CompetenceEntry[]>(this.#endpoint + 'by-subject/' + subject)
	}

	findOne(id: string): Observable<CompetenceEntry> {
		return this.#apiService.get<CompetenceEntry>(this.#endpoint + id)
	}

	update(id: string, competence: any): Observable<ApiUpdateResponse> {
		return this.#apiService.patch<ApiUpdateResponse>(this.#endpoint + id, competence)
	}

	delete(id: string): Observable<ApiDeleteResponse> {
		return this.#apiService.delete<ApiDeleteResponse>(this.#endpoint + id)
	}
}