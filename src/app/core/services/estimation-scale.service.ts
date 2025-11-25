import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EstimationScale } from '../models';
import { ApiDeleteResponse } from '../interfaces';
import { ApiService } from './api.service';
import { EstimationScaleDto } from '../../store/estimation-scales/estimation-scales.models';

@Injectable({
	providedIn: 'root',
})
export class EstimationScaleService {
	#apiService = inject(ApiService);
	#endpoint = 'estimation-scales/';

	findAll(): Observable<EstimationScale[]> {
		return this.#apiService.get<EstimationScale[]>(this.#endpoint);
	}

	find(id: string): Observable<EstimationScale> {
		return this.#apiService.get<EstimationScale>(this.#endpoint + id);
	}

	create(plan: Partial<EstimationScaleDto>): Observable<EstimationScale> {
		return this.#apiService.post<EstimationScale>(this.#endpoint, plan);
	}

	update(
		id: string,
		plan: Partial<EstimationScaleDto>,
	): Observable<EstimationScale> {
		return this.#apiService.patch<EstimationScale>(
			this.#endpoint + id,
			plan,
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
