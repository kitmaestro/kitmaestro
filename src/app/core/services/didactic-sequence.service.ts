import { inject, Injectable } from '@angular/core'
import { ApiService } from './api.service'
import { Observable } from 'rxjs'
import { DidacticSequence } from '../models'

@Injectable({
  providedIn: 'root'
})
export class DidacticSequenceService {
  #apiService = inject(ApiService)
  #endpoint = 'didactic-sequences'

  findAll(filters: any): Observable<DidacticSequence[]> {
    return this.#apiService.get(this.#endpoint, filters)
  }

  findOne(id: string): Observable<DidacticSequence> {
    return this.#apiService.get(`${this.#endpoint}/${id}`)
  }

  create(data: any): Observable<DidacticSequence> {
    return this.#apiService.post(this.#endpoint, data)
  }

  update(id: string, data: any): Observable<DidacticSequence> {
    return this.#apiService.put(`${this.#endpoint}/${id}`, data)
  }

  delete(id: string): Observable<void> {
    return this.#apiService.delete(`${this.#endpoint}/${id}`)
  }
}
