import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { UserSubscription } from '../interfaces/user-subscription';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiUpdateResponse } from '../interfaces/api-update-response';
import { ApiDeleteResponse } from '../interfaces/api-delete-response';
import { environment } from '../../../environments/environment';
import { ApiService } from './api.service';

@Injectable({
	providedIn: 'root',
})
export class UserSubscriptionService {
	#apiService = inject(ApiService);
	private http = inject(HttpClient);
	private apiBaseUrl = environment.apiUrl + 'user-subscriptions/';

	private config = {
		withCredentials: true,
		headers: new HttpHeaders({
			'Content-Type': 'application/json',
			Authorization: 'Bearer ' + localStorage.getItem('access_token'),
		}),
	};

	countSubscriptions(): Observable<{ subscriptions: number }> {
		return this.#apiService.get<{ subscriptions: number }>(
			'user-subscriptions/count',
		);
	}

	findAll(): Observable<UserSubscription[]> {
		return this.http.get<UserSubscription[]>(this.apiBaseUrl, this.config);
	}

	find(id: string): Observable<UserSubscription> {
		return this.http.get<UserSubscription>(
			this.apiBaseUrl + id,
			this.config,
		);
	}

	findByUser(id: string): Observable<UserSubscription> {
		return this.http.get<UserSubscription>(
			this.apiBaseUrl + 'by-user/' + id,
			this.config,
		);
	}

	checkSubscription(): Observable<UserSubscription> {
		return this.http.get<UserSubscription>(
			this.apiBaseUrl + 'me',
			this.config,
		);
	}

	create(data: any) {
		return this.http.post<UserSubscription>(
			this.apiBaseUrl,
			data,
			this.config,
		);
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

		return this.http.post<UserSubscription>(
			this.apiBaseUrl,
			subscription,
			this.config,
		);
	}

	getEvaluationSubscription(user?: string): Observable<UserSubscription> {
		const subscription = {
			user: user ? user : undefined,
			subscriptionType: 'Premium Evaluation',
			status: 'active',
			startDate: new Date(),
			endDate: new Date(new Date().valueOf() + 3 * 24 * 60 * 60 * 1000),
			method: 'none',
			amount: 0,
		};

		return this.http.post<UserSubscription>(
			this.apiBaseUrl,
			subscription,
			this.config,
		);
	}

	addReferral(referral: UserSubscription): Observable<UserSubscription> {
		return this.http.post<UserSubscription>(
			this.apiBaseUrl,
			referral,
			this.config,
		);
	}

	updateReferral(id: string, referral: any): Observable<ApiUpdateResponse> {
		return this.http.patch<ApiUpdateResponse>(
			this.apiBaseUrl + id,
			referral,
			this.config,
		);
	}

	deleteReferral(id: string): Observable<ApiDeleteResponse> {
		return this.http.delete<ApiDeleteResponse>(
			this.apiBaseUrl + id,
			this.config,
		);
	}
}
