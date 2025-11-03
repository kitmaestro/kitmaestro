import { inject, Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { DidacticPlan } from '../models';

@Injectable({
	providedIn: 'root',
})
export class DidacticPlanService {
	#apiService = inject(ApiService);
	#endpoint = 'didactic-sequence-plans';

	findAll(filters: any): Observable<DidacticPlan[]> {
		return this.#apiService.get(this.#endpoint, filters);
	}

	findOne(id: string): Observable<DidacticPlan> {
		return this.#apiService.get(`${this.#endpoint}/${id}`);
	}

	create(data: any): Observable<DidacticPlan> {
		return this.#apiService.post(this.#endpoint, data);
	}

	update(id: string, data: any): Observable<DidacticPlan> {
		return this.#apiService.put(`${this.#endpoint}/${id}`, data);
	}

	delete(id: string): Observable<void> {
		return this.#apiService.delete(`${this.#endpoint}/${id}`);
	}
}
