import { inject, Injectable } from '@angular/core'
import { ApiService } from './api.service'
import { Observable } from 'rxjs'
import { DidacticSequencePlan } from '../models'

@Injectable({
  providedIn: 'root'
})
export class DidacticSequencePlanService {
  #apiService = inject(ApiService)
  #endpoint = 'didactic-sequence-plans'

  findAll(filters: any): Observable<DidacticSequencePlan[]> {
    return this.#apiService.get(this.#endpoint, filters)
  }

  findOne(id: string): Observable<DidacticSequencePlan> {
    return this.#apiService.get(`${this.#endpoint}/${id}`)
  }

  create(data: any): Observable<DidacticSequencePlan> {
    return this.#apiService.post(this.#endpoint, data)
  }

  update(id: string, data: any): Observable<DidacticSequencePlan> {
    return this.#apiService.put(`${this.#endpoint}/${id}`, data)
  }

  delete(id: string): Observable<void> {
    return this.#apiService.delete(`${this.#endpoint}/${id}`)
  }
}
