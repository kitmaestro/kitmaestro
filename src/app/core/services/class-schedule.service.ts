import { inject, Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { ClassSchedule } from '../interfaces/class-schedule'
import { ApiUpdateResponse } from '../interfaces/api-update-response'
import { ApiDeleteResponse } from '../interfaces/api-delete-response'
import { ApiService } from './api.service'

@Injectable({
	providedIn: 'root',
})
export class ClassScheduleService {
	#apiService = inject(ApiService)
	#endpoint = 'schedules/'

	findAll(): Observable<ClassSchedule[]> {
		return this.#apiService.get<ClassSchedule[]>(this.#endpoint)
	}

	find(id: string): Observable<ClassSchedule> {
		return this.#apiService.get<ClassSchedule>(this.#endpoint + id)
	}

	create(schedule: any): Observable<ClassSchedule> {
		return this.#apiService.post<ClassSchedule>(this.#endpoint, schedule)
	}

	update(id: string, schedule: any): Observable<ApiUpdateResponse> {
		return this.#apiService.patch<ApiUpdateResponse>(this.#endpoint + id, schedule)
	}

	delete(id: string): Observable<ApiDeleteResponse> {
		return this.#apiService.delete<ApiDeleteResponse>(this.#endpoint + id)
	}
}
