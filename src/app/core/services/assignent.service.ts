import { Observable, of } from "rxjs"
import { Assignment } from "../models"
import { inject, Injectable } from "@angular/core"
import { ApiService } from "./api.service"
import { AssignmentDto } from "../../store/assignments/assignments.models"

@Injectable({ providedIn: 'root' })
export class AssignmentService {
	#apiService = inject(ApiService)
	#endpoint = 'assignments'

	getAssignments(): Observable<Assignment[]> {
		return this.#apiService.get(this.#endpoint)
	}

	addAssignment(assignment: Partial<AssignmentDto>): Observable<Assignment> {
		return this.#apiService.post(this.#endpoint, assignment)
	}
}