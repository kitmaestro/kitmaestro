import { inject, Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { ObservationGuide } from '../models'
import { ApiDeleteResponse } from '../interfaces'
import { ApiService } from './api.service'
import { ObservationGuideDto } from '../../store/observation-guides/observation-guides.models'

@Injectable({
	providedIn: 'root',
})
export class ObservationGuideService {
	#apiService = inject(ApiService)
	#endpoint = 'observation-guides/'

	findAll(): Observable<ObservationGuide[]> {
		return this.#apiService.get<ObservationGuide[]>(this.#endpoint)
	}

	find(id: string): Observable<ObservationGuide> {
		return this.#apiService.get<ObservationGuide>(this.#endpoint + id)
	}

	create(plan: Partial<ObservationGuideDto>): Observable<ObservationGuide> {
		return this.#apiService.post<ObservationGuide>(this.#endpoint, plan)
	}

	update(id: string, plan: Partial<ObservationGuideDto>): Observable<ObservationGuide> {
		return this.#apiService.patch<ObservationGuide>(
			this.#endpoint + id,
			plan,
		)
	}

	delete(id: string): Observable<ApiDeleteResponse> {
		return this.#apiService.delete<ApiDeleteResponse>(this.#endpoint + id)
	}

	download(
		id: string,
		format: 'docx' | 'pdf' = 'pdf',
	): Observable<{ pdf: string }> {
		return this.#apiService.get<{ pdf: string }>(
			this.#endpoint + id + '/' + format,
		)
	}
}
