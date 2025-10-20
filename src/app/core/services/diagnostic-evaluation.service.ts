import { inject, Injectable } from '@angular/core'
import { ApiService } from './api.service'
import { Observable } from 'rxjs'
import { GeneratedEvaluation } from '../models'
import { DiagnosticEvaluationDto } from '../../store/diagnostic-evaluations/diagnostic-evaluations.models'

@Injectable({
	providedIn: 'root',
})
export class DiagnosticEvaluationService {
	#apiService = inject(ApiService)
	readonly #endpoint = 'diagnostic-evaluations'

	findAll(filters: any = {}): Observable<GeneratedEvaluation[]> {
		return this.#apiService.get(this.#endpoint, filters)
	}

	findOne(id: string): Observable<GeneratedEvaluation> {
		return this.#apiService.get(`${this.#endpoint}/${id}`)
	}

	create(data: Partial<DiagnosticEvaluationDto>): Observable<GeneratedEvaluation> {
		return this.#apiService.post(this.#endpoint, data)
	}

	update(id: string, data: Partial<DiagnosticEvaluationDto>): Observable<GeneratedEvaluation> {
		return this.#apiService.put(`${this.#endpoint}/${id}`, data)
	}

	delete(id: string) {
		return this.#apiService.delete(`${this.#endpoint}/${id}`)
	}
}
