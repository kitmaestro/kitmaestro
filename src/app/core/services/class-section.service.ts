import { Injectable, inject } from '@angular/core'
import { Observable } from 'rxjs'
import { ApiDeleteResponse } from '../interfaces'
import { ClassSection } from '../models'
import { ApiService } from './api.service'
import { ClassSectionDto } from '../../store/class-sections/class-sections.models'

@Injectable({
	providedIn: 'root',
})
export class ClassSectionService {
	#apiService = inject(ApiService)
	#endpoint = 'class-sections/'

	findAll(filters?: any): Observable<ClassSection[]> {
		return this.#apiService.get<ClassSection[]>(this.#endpoint + 'all', filters)
	}

	findSections(): Observable<ClassSection[]> {
		return this.#apiService.get<ClassSection[]>(this.#endpoint)
	}

	findSection(id: string): Observable<ClassSection> {
		return this.#apiService.get<ClassSection>(this.#endpoint + id)
	}

	addSection(section: Partial<ClassSectionDto>): Observable<ClassSection> {
		return this.#apiService.post<ClassSection>(this.#endpoint, section)
	}

	updateSection(id: string, section: Partial<ClassSectionDto>): Observable<ClassSection> {
		return this.#apiService.patch<ClassSection>(this.#endpoint + id, section)
	}

	deleteSection(id: string): Observable<ApiDeleteResponse> {
		return this.#apiService.delete<ApiDeleteResponse>(this.#endpoint + id)
	}
}
