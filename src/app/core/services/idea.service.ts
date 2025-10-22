import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Idea } from '../models';
import { ApiDeleteResponse } from '../interfaces';
import { ApiService } from './api.service';
import { IdeaDto } from '../../store/ideas/ideas.models';

@Injectable({
	providedIn: 'root',
})
export class IdeaService {
	#apiService = inject(ApiService);
	#endpoint = 'ideas/';

	findAll(): Observable<Idea[]> {
		return this.#apiService.get<Idea[]>(this.#endpoint);
	}

	find(id: string): Observable<Idea> {
		return this.#apiService.get<Idea>(this.#endpoint + id);
	}

	create(idea: Partial<IdeaDto>): Observable<Idea> {
		return this.#apiService.post<Idea>(this.#endpoint, idea);
	}

	update(id: string, idea: Partial<IdeaDto>): Observable<Idea> {
		return this.#apiService.patch<Idea>(this.#endpoint + id, idea);
	}

	delete(id: string): Observable<ApiDeleteResponse> {
		return this.#apiService.delete<ApiDeleteResponse>(this.#endpoint + id);
	}
}
