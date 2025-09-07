import { inject, Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { GeneratedEvaluation } from '../interfaces';

@Injectable({
	providedIn: 'root',
})
export class DiagnosticEvaluationService {
	private apiService = inject(ApiService);
	private readonly endpoint = 'diagnostic-evaluations';

	findAll(filters: any = {}): Observable<GeneratedEvaluation[]> {
		return this.apiService.get(this.endpoint, filters);
	}

	findOne(id: string): Observable<GeneratedEvaluation> {
		return this.apiService.get(`${this.endpoint}/${id}`);
	}

	create(data: any): Observable<GeneratedEvaluation> {
		return this.apiService.post(this.endpoint, data);
	}

	update(id: string, data: any): Observable<GeneratedEvaluation> {
		return this.apiService.put(`${this.endpoint}/${id}`, data);
	}

	delete(id: string) {
		return this.apiService.delete(`${this.endpoint}/${id}`);
	}
}
