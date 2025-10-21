import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { DidacticResource } from '../models';
import { ApiDeleteResponse } from '../interfaces';
import { ApiService } from './api.service';

@Injectable({
	providedIn: 'root',
})
export class DidacticResourceService {
	#apiService = inject(ApiService);
	#endpoint = 'didactic-resources/';

	findAll(filters?: any): Observable<DidacticResource[]> {
		return this.#apiService.get<DidacticResource[]>(
			this.#endpoint,
			filters,
		);
	}

	findOne(id: string): Observable<DidacticResource> {
		return this.#apiService.get<DidacticResource>(this.#endpoint + id);
	}

	findByUser(id: string): Observable<DidacticResource[]> {
		return this.#apiService.get<DidacticResource[]>(
			this.#endpoint + 'by-user/' + id,
		);
	}

	findMyResources(): Observable<DidacticResource[]> {
		return this.#apiService.get<DidacticResource[]>(
			this.#endpoint + 'my-resources',
		);
	}

	create(resource: any): Observable<DidacticResource> {
		return this.#apiService.post<DidacticResource>(
			this.#endpoint,
			resource,
		);
	}

	update(id: string, resource: any): Observable<DidacticResource> {
		return this.#apiService.patch<DidacticResource>(
			this.#endpoint + id,
			resource,
		);
	}

	delete(id: string): Observable<ApiDeleteResponse> {
		return this.#apiService.delete<ApiDeleteResponse>(this.#endpoint + id);
	}

	bookmark(id: string): Observable<DidacticResource> {
		return this.#apiService.post<DidacticResource>(
			this.#endpoint + id + '/bookmark',
			{},
		);
	}

	like(id: string): Observable<DidacticResource> {
		return this.#apiService.post<DidacticResource>(
			this.#endpoint + id + '/like',
			{},
		);
	}

	dislike(id: string): Observable<DidacticResource> {
		return this.#apiService.post<DidacticResource>(
			this.#endpoint + id + '/dislike',
			{},
		);
	}

	buy(id: string): Observable<DidacticResource> {
		return this.#apiService.post<DidacticResource>(
			this.#endpoint + id + '/buy',
			{},
		);
	}

	download(id: string): Observable<DidacticResource> {
		return this.#apiService.post<DidacticResource>(
			this.#endpoint + id + '/download',
			{},
		);
	}
}
