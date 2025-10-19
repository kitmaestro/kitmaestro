import { Injectable, inject } from '@angular/core'
import { Observable } from 'rxjs'
import { User } from '../interfaces'
import { ApiUpdateResponse, ApiDeleteResponse } from '../interfaces'
import { ApiService } from './api.service'
import { UserDto } from '../../store/users/users.models'

@Injectable({
	providedIn: 'root',
})
export class UserService {
	#apiService = inject(ApiService)
	private endpoint = 'users/'

	countUsers(): Observable<{ users: number }> {
		return this.#apiService.get<{ users: number }>('users/count')
	}

	findAll(): Observable<User[]> {
		return this.#apiService.get<User[]>(this.endpoint)
	}

	find(id: string): Observable<User> {
		return this.#apiService.get<User>(this.endpoint + id)
	}

	create(data: Partial<UserDto>): Observable<User> {
		return this.#apiService.post<User>(this.endpoint, data)
	}

	getSettings(userId?: string): Observable<User> {
		return userId ? this.#apiService.get<User>(this.endpoint + userId) : this.#apiService.get<User>('auth/profile')
	}

	update(id: string, user: Partial<UserDto>): Observable<{ success: boolean, data: User }> {
		return this.#apiService.patch<{ success: boolean, data: User }>(this.endpoint + id, user)
	}

	delete(id: string): Observable<ApiDeleteResponse> {
		return this.#apiService.delete<ApiDeleteResponse>(this.endpoint + id)
	}

	setPhotoUrl(photoURL: string): Observable<ApiUpdateResponse> {
		return this.#apiService.patch<ApiUpdateResponse>(this.endpoint + 'auth/profile', { photoURL })
	}
}
