import { Injectable, inject } from '@angular/core';
import { Student } from '../models';
import { Observable } from 'rxjs';
import { ApiDeleteResponse } from '../interfaces';
import { ApiService } from './api.service'

@Injectable({
	providedIn: 'root',
})
export class StudentsService {
	#apiService = inject(ApiService)
	#endpoint = 'students/'

	findBySection(section: string): Observable<Student[]> {
		return this.#apiService.get<Student[]>(this.#endpoint + 'by-section/' + section)
	}

	findAll(): Observable<Student[]> {
		return this.#apiService.get<Student[]>(this.#endpoint)
	}

	find(id: string): Observable<Student> {
		return this.#apiService.get<Student>(this.#endpoint + id)
	}

	create(plan: Student): Observable<Student> {
		return this.#apiService.post<Student>(this.#endpoint, plan)
	}

	update(id: string, plan: any): Observable<Student> {
		return this.#apiService.patch<Student>(this.#endpoint + id, plan)
	}

	delete(id: string): Observable<ApiDeleteResponse> {
		return this.#apiService.delete<ApiDeleteResponse>(this.#endpoint + id)
	}
}
