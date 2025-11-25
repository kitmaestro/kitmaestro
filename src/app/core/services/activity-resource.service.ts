import { inject, Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { ActivityResource } from '../models';
import { ActivityResourceDto } from '../../store';

@Injectable({
	providedIn: 'root',
})
export class ActivityResourceService {
	#apiService = inject(ApiService);
	#endpoint = 'activity-resources';

	findAll(filters: any): Observable<ActivityResource[]> {
		return this.#apiService.get(this.#endpoint, filters);
	}

	findOne(id: string): Observable<ActivityResource> {
		return this.#apiService.get(`${this.#endpoint}/${id}`);
	}

	create(data: Partial<ActivityResourceDto>): Observable<ActivityResource> {
		return this.#apiService.post(this.#endpoint, data);
	}

	update(id: string, data: Partial<ActivityResourceDto>): Observable<ActivityResource> {
		return this.#apiService.put(`${this.#endpoint}/${id}`, data);
	}

	delete(id: string): Observable<void> {
		return this.#apiService.delete(`${this.#endpoint}/${id}`);
	}
}
