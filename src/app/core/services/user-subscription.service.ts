import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { UserSubscription } from '../models/user-subscription';
import { ApiDeleteResponse } from '../interfaces';
import { ApiService } from './api.service';
import { UserSubscriptionDto } from '../../store/user-subscriptions/user-subscriptions.models';

@Injectable({
	providedIn: 'root',
})
export class UserSubscriptionService {
	#apiService = inject(ApiService);
	#endpoint = 'user-subscriptions/';
	#subscriptionSubject = new BehaviorSubject<UserSubscription | null>(null);

	public subscription$ = this.#subscriptionSubject.asObservable();

	constructor() {
		this.checkSubscription().subscribe();
	}

	get subscription(): UserSubscription | null {
		return this.#subscriptionSubject.value;
	}

	private setSubscription(subscription: UserSubscription | null) {
		this.#subscriptionSubject.next(subscription);
	}

	countSubscriptions(): Observable<{ subscriptions: number }> {
		return this.#apiService.get<{ subscriptions: number }>(
			'user-subscriptions/count',
		);
	}

	findAll(): Observable<UserSubscription[]> {
		return this.#apiService.get<UserSubscription[]>(this.#endpoint);
	}

	find(id: string): Observable<UserSubscription> {
		return this.#apiService.get<UserSubscription>(this.#endpoint + id);
	}

	findByUser(id: string): Observable<UserSubscription> {
		return this.#apiService.get<UserSubscription>(
			this.#endpoint + 'by-user/' + id,
		);
	}

	checkSubscription(): Observable<UserSubscription> {
		return this.#apiService
			.get<UserSubscription>(this.#endpoint + 'me')
			.pipe(tap((subscription) => this.setSubscription(subscription)));
	}

	create(data: Partial<UserSubscriptionDto>) {
		return this.#apiService.post<UserSubscription>(this.#endpoint, data);
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

		return this.#apiService.post<UserSubscription>(
			this.#endpoint,
			subscription,
		);
	}

	addReferral(referral: UserSubscription): Observable<UserSubscription> {
		return this.#apiService.post<UserSubscription>(
			this.#endpoint,
			referral,
		);
	}

	updateReferral(
		id: string,
		referral: Partial<UserSubscriptionDto>,
	): Observable<UserSubscription> {
		return this.#apiService.patch<UserSubscription>(
			this.#endpoint + id,
			referral,
		);
	}

	deleteReferral(id: string): Observable<ApiDeleteResponse> {
		return this.#apiService.delete<ApiDeleteResponse>(this.#endpoint + id);
	}
}
