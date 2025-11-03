import { inject, Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { DidacticActivity } from '../models';

@Injectable({
	providedIn: 'root',
})
export class DidacticActivityService {
	#apiService = inject(ApiService);
	#endpoint = 'didactic-activities';

	findAll(filters: any): Observable<DidacticActivity[]> {
		return this.#apiService.get(this.#endpoint, filters);
	}

	findOne(id: string): Observable<DidacticActivity> {
		return this.#apiService.get(`${this.#endpoint}/${id}`);
	}

	create(data: any): Observable<DidacticActivity> {
		return this.#apiService.post(this.#endpoint, data);
	}

	update(id: string, data: any): Observable<DidacticActivity> {
		return this.#apiService.put(`${this.#endpoint}/${id}`, data);
	}

	delete(id: string): Observable<void> {
		return this.#apiService.delete(`${this.#endpoint}/${id}`);
	}
}
