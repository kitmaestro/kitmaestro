import { Injectable, inject } from '@angular/core'
import { Observable } from 'rxjs'
import { Referral } from '../models'
import { ApiUpdateResponse, ApiDeleteResponse } from '../interfaces'
import { ApiService } from './api.service'

@Injectable({
	providedIn: 'root',
})
export class ReferralsService {
	#apiService = inject(ApiService)
	#endpoint = 'referrals/'

	findAll(): Observable<Referral[]> {
		return this.#apiService.get<Referral[]>(this.#endpoint)
	}

	find(id: string): Observable<Referral> {
		return this.#apiService.get<Referral>(this.#endpoint + id)
	}

	findReferred(id: string): Observable<Referral> {
		return this.#apiService.get<Referral>(this.#endpoint + 'referred/' + id)
	}

	addReferral(referral: Referral): Observable<Referral> {
		return this.#apiService.post<Referral>(this.#endpoint, referral)
	}

	updateReferral(id: string, referral: any): Observable<ApiUpdateResponse> {
		return this.#apiService.patch<ApiUpdateResponse>(this.#endpoint + id, referral)
	}

	deleteReferral(id: string): Observable<ApiDeleteResponse> {
		return this.#apiService.delete<ApiDeleteResponse>(this.#endpoint + id)
	}
}
