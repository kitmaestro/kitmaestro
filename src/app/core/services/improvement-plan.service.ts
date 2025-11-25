import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiDeleteResponse } from '../interfaces';
import { ApiService } from './api.service';
import { ImprovementPlan } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class ImprovementPlanService {
  #apiService = inject(ApiService);
  #endpoint = 'improvement-plans/';

  findAll(filters?: any): Observable<ImprovementPlan[]> {
    return this.#apiService.get<ImprovementPlan[]>(this.#endpoint, filters);
  }

  findOne(id: string): Observable<ImprovementPlan> {
    return this.#apiService.get<ImprovementPlan>(this.#endpoint + id);
  }

  create(plan: Partial<ImprovementPlan>): Observable<ImprovementPlan> {
    return this.#apiService.post<ImprovementPlan>(this.#endpoint, plan);
  }

  update(id: string, plan: Partial<ImprovementPlan>): Observable<ImprovementPlan> {
    return this.#apiService.patch<ImprovementPlan>(this.#endpoint + id, plan);
  }

  delete(id: string): Observable<ApiDeleteResponse> {
    return this.#apiService.delete<ApiDeleteResponse>(this.#endpoint + id);
  }
}
