import { Observable } from "rxjs";
import { Grade } from "../interfaces/grade";
import { inject, Injectable } from "@angular/core";
import { ApiService } from "./api.service";

@Injectable({ providedIn: 'root' })
export class GradeService {
	private apiService = inject(ApiService);

	getGrades(assignment: string): Observable<Grade[]> {
		return this.apiService.get<Grade[]>('/grades', { assignment });
	}

	saveGrades(grades: Grade[]): Observable<{ message: string }> {
		return this.apiService.post<{ message: string }>('/grades', grades);
	}

	updateGrades(grades: Grade[]): Observable<{ message: string }> {
		return this.apiService.put<{ message: string }>('/grades', grades);
	}
}
