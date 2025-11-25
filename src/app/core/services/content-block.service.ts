import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ContentBlock } from '../models';
import { ApiDeleteResponse } from '../interfaces';
import { ApiService } from './api.service';
import { ContentBlockDto } from '../../store/content-blocks/content-blocks.models';

@Injectable({
	providedIn: 'root',
})
export class ContentBlockService {
	#apiService = inject(ApiService);
	#endpoint = 'content-blocks/';

	findAll(filters?: any): Observable<ContentBlock[]> {
		return this.#apiService.get<ContentBlock[]>(this.#endpoint, filters);
	}

	find(id: string): Observable<ContentBlock> {
		return this.#apiService.get<ContentBlock>(this.#endpoint + id);
	}

	create(block: Partial<ContentBlockDto>): Observable<ContentBlock> {
		return this.#apiService.post<ContentBlock>(this.#endpoint, block);
	}

	update(
		id: string,
		block: Partial<ContentBlockDto>,
	): Observable<ContentBlock> {
		return this.#apiService.patch<ContentBlock>(this.#endpoint + id, block);
	}

	delete(id: string): Observable<ApiDeleteResponse> {
		return this.#apiService.delete<ApiDeleteResponse>(this.#endpoint + id);
	}
}
