import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models';
import { ApiService } from './api.service';
import {
	LoginDto,
	LoginOrSignupResponse,
	LogoutResponse,
	PasswordRecoverResponse,
	PasswordResetDto,
	PasswordResetResponse,
	SignupDto,
} from '../../store/auth/auth.models';

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	#api = inject(ApiService);
	#endpoint = 'auth/';

	login({
		email,
		password,
		remember,
	}: LoginDto): Observable<LoginOrSignupResponse> {
		return this.#api.post<LoginOrSignupResponse>(this.#endpoint + 'login', {
			email,
			password,
			remember,
		});
	}

	signup({ email, password }: SignupDto): Observable<LoginOrSignupResponse> {
		return this.#api.post<LoginOrSignupResponse>(
			this.#endpoint + 'signup',
			{ email, password },
		);
	}

	logout(): Observable<LogoutResponse> {
		return this.#api.post<LogoutResponse>(this.#endpoint + 'logout', {});
	}

	profile(): Observable<User> {
		return this.#api.get<User>(this.#endpoint + 'profile');
	}

	update(data: Partial<User>): Observable<User> {
		return this.#api.patch<User>(this.#endpoint + 'profile', data);
	}

	recover(email: string): Observable<PasswordRecoverResponse> {
		return this.#api.post<PasswordRecoverResponse>(
			this.#endpoint + 'recover',
			{ email },
		);
	}

	resetPassword(
		payload: PasswordResetDto,
	): Observable<PasswordResetResponse> {
		return this.#api.post<PasswordRecoverResponse>(
			this.#endpoint + 'reset-password',
			payload,
		);
	}
}
