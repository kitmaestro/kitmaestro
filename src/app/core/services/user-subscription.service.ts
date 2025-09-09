import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { UserSubscription } from '../interfaces/user-subscription';
import { ApiUpdateResponse } from '../interfaces/api-update-response';
import { ApiDeleteResponse } from '../interfaces/api-delete-response';
import { ApiService } from './api.service';

@Injectable({
	providedIn: 'root',
})
export class UserSubscriptionService {
	#apiService = inject(ApiService);
	private apiBaseUrl = 'user-subscriptions/';

	private subscriptionSubject = new BehaviorSubject<UserSubscription | null>(null);
	public subscription$ = this.subscriptionSubject.asObservable();

	private setSubscription(subscription: UserSubscription | null) {
		this.subscriptionSubject.next(subscription);
	}

	get subscription(): UserSubscription | null {
		return this.subscriptionSubject.value;
	}

	constructor() {
		this.checkSubscription().subscribe();
	}

	countSubscriptions(): Observable<{ subscriptions: number }> {
		return this.#apiService.get<{ subscriptions: number }>(
			'user-subscriptions/count',
		);
	}

	findAll(): Observable<UserSubscription[]> {
		return this.#apiService.get<UserSubscription[]>(this.apiBaseUrl);
	}

	find(id: string): Observable<UserSubscription> {
		return this.#apiService.get<UserSubscription>(this.apiBaseUrl + id);
	}

	findByUser(id: string): Observable<UserSubscription> {
		return this.#apiService.get<UserSubscription>(this.apiBaseUrl + 'by-user/' + id);
	}

	checkSubscription(): Observable<UserSubscription> {
		return this.#apiService.get<UserSubscription>(this.apiBaseUrl + 'me').pipe(
			// Update the current subscription when fetched
			tap((subscription) => this.setSubscription(subscription)),
		);
	}

	create(data: any) {
		return this.#apiService.post<UserSubscription>(this.apiBaseUrl, data);
	}

	subscribe(
		subscriptionType: string,
		method: string,
		duration: number,
		amount: number,
		user?: string,
	): Observable<UserSubscription> {
		const subscription = {
			user: user ? user : undefined,
			subscriptionType,
			status: 'active',
			startDate: new Date(),
			endDate: new Date(
				new Date().valueOf() + duration * 24 * 60 * 60 * 1000,
			),
			method,
			amount,
		};

		return this.#apiService.post<UserSubscription>(this.apiBaseUrl, subscription);
	}

	addReferral(referral: UserSubscription): Observable<UserSubscription> {
		return this.#apiService.post<UserSubscription>(this.apiBaseUrl, referral);
	}

	updateReferral(id: string, referral: any): Observable<ApiUpdateResponse> {
		return this.#apiService.patch<ApiUpdateResponse>(this.apiBaseUrl + id, referral);
	}

	deleteReferral(id: string): Observable<ApiDeleteResponse> {
		return this.#apiService.delete<ApiDeleteResponse>(this.apiBaseUrl + id);
	}
}
