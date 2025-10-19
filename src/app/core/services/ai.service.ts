import { inject, Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { GradePeriod } from '../interfaces/grade-period'
import { ApiService } from './api.service'

@Injectable({
	providedIn: 'root',
})
export class AiService {
	#apiService = inject(ApiService)
	#endpoint = 'ai/'

	geminiAi(question: string) {
		return this.#apiService.post<{ response: string }>(this.#endpoint + 'gemini', { prompt: question })
	}

	generateImage(inputs: string): Observable<{ result: string }> {
		return this.#apiService.post<{ result: string }>(this.#endpoint + 'image', { prompt: inputs })
	}

	generatePeriod(config: {
		average?: number
		min: number
		max: number
		elements: number
		minGrade: number
	}): GradePeriod[] {
		const { average, min, max, elements, minGrade } = config

		const range = max - min

		const grades: { p: number; rp: number }[] = []

		for (let i = 0; i < elements; i++) {
			const p = Math.round(Math.random() * range + min)
			const rp = p < minGrade ? Math.round(Math.random() * range + p) : 0
			grades.push({ p, rp })
		}

		if (average) {
			let currentAverage: number = Math.round(
				grades.reduce(
					(acc, curr) => acc + (curr.rp > 0 ? curr.rp : curr.p),
					0,
				) / elements,
			)
			let adjustment: number = average - currentAverage
			let adjustedNumbers: GradePeriod[] = grades.map((num) =>
				num.rp > 0
					? { rp: num.rp + adjustment, p: num.p }
					: { p: num.p + adjustment, rp: 0 },
			)

			while (true) {
				currentAverage = Math.round(
					adjustedNumbers.reduce(
						(acc, curr) => acc + (curr.rp > 0 ? curr.rp : curr.p),
						0,
					) / elements,
				)
				if (currentAverage === average) {
					break
				}
				adjustment = average - currentAverage
				adjustedNumbers = grades.map((num) =>
					num.rp > 0
						? { rp: num.rp + adjustment, p: num.p }
						: { p: num.p + adjustment, rp: 0 },
				)
			}
			return adjustedNumbers
		}

		return grades
	}
}