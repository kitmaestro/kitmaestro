import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { RecoveryPlan } from '../models';
import { ApiDeleteResponse } from '../interfaces';
import { ApiService } from './api.service';

type RecoveryPlanDto = Partial<RecoveryPlan>;

@Injectable({
	providedIn: 'root',
})
export class RecoveryPlanService {
	#apiService = inject(ApiService);
	#endpoint = 'recovery-plan/';

	create(data: RecoveryPlanDto): Observable<RecoveryPlan> {
		return this.#apiService.post<RecoveryPlan>(this.#endpoint, data);
	}

	findAll(filters?: Record<string, any>): Observable<RecoveryPlan[]> {
		return this.#apiService.get<RecoveryPlan[]>(this.#endpoint, filters);
	}

	findOne(id: string): Observable<RecoveryPlan> {
		return this.#apiService.get<RecoveryPlan>(this.#endpoint + id);
	}

	update(
		id: string,
		data: RecoveryPlanDto,
	): Observable<RecoveryPlan> {
		return this.#apiService.patch<RecoveryPlan>(
			this.#endpoint + id,
			data,
		);
	}

	delete(id: string): Observable<ApiDeleteResponse> {
		return this.#apiService.delete<ApiDeleteResponse>(this.#endpoint + id);
	}
}
