import { Observable, of } from "rxjs"
import { Assignment } from "../interfaces/assignment"
import { inject, Injectable } from "@angular/core"
import { ApiService } from "./api.service"

@Injectable({ providedIn: 'root' })
export class AssignmentService {
	#apiService = inject(ApiService)
	#assignments: Assignment[] = []

	getAssignments(
		sectionId: string,
		subject: string,
	): Observable<Assignment[]> {
		console.log(
			`AssignmentService: Getting assignments for ${sectionId} - ${subject}`,
		)
		return of(
			this.#assignments.filter(
				(a) => a.sectionId === sectionId && a.subject === subject,
			),
		)
	}

	addAssignment(assignment: Omit<Assignment, '_id'>): Observable<Assignment> {
		console.log('AssignmentService: Adding assignment...', assignment)
		const newAssignment: Assignment = {
			_id: `as_${Date.now()}`,
			...assignment,
		}
		this.#assignments.push(newAssignment)
		return of(newAssignment)
	}
}