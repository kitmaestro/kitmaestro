import { inject, Injectable } from '@angular/core';
import { SubjectConceptList } from '../models';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { ApiDeleteResponse } from '../interfaces';

@Injectable({
	providedIn: 'root',
})
export class SubjectConceptListService {
	#apiService = inject(ApiService);
	#endpoint = 'subject-concept-lists/';

	findAll(filters: any): Observable<SubjectConceptList[]> {
		return this.#apiService.get<SubjectConceptList[]>(
			this.#endpoint,
			filters,
		);
	}

	find(id: string): Observable<SubjectConceptList> {
		return this.#apiService.get<SubjectConceptList>(this.#endpoint + id);
	}

	create(list: Partial<SubjectConceptList>): Observable<SubjectConceptList> {
		return this.#apiService.post<SubjectConceptList>(this.#endpoint, list);
	}

	update(
		id: string,
		list: Partial<SubjectConceptList>,
	): Observable<SubjectConceptList> {
		return this.#apiService.patch<SubjectConceptList>(
			this.#endpoint + id,
			list,
		);
	}

	delete(id: string): Observable<ApiDeleteResponse> {
		return this.#apiService.delete<ApiDeleteResponse>(this.#endpoint + id);
	}

	download(
		id: string,
		format: 'docx' | 'pdf' = 'pdf',
	): Observable<{ pdf: string }> {
		return this.#apiService.get<{ pdf: string }>(
			this.#endpoint + id + '/' + format,
		);
	}
}
