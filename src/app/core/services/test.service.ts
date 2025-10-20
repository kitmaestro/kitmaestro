import { inject, Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { ApiDeleteResponse } from '../interfaces'
import { Test } from '../models/test'
import {
	Document,
	HeadingLevel,
	Packer,
	PageOrientation,
	Paragraph,
	Table,
	TableCell,
	TableRow,
	TextRun,
	WidthType,
} from 'docx'
import { saveAs } from 'file-saver'
import { PretifyPipe } from '../../shared'
import { ApiService } from './api.service'

@Injectable({
	providedIn: 'root',
})
export class TestService {
	#apiService = inject(ApiService)
	#enpoint = 'tests/'

	findAll(filters?: any): Observable<Test[]> {
		return this.#apiService.get<Test[]>(this.#enpoint, filters)
	}

	find(id: string): Observable<Test> {
		return this.#apiService.get<Test>(this.#enpoint + id)
	}

	create(plan: any): Observable<Test> {
		return this.#apiService.post<Test>(this.#enpoint, plan)
	}

	update(id: string, plan: any): Observable<Test> {
		return this.#apiService.patch<Test>(this.#enpoint + id, plan)
	}

	delete(id: string): Observable<ApiDeleteResponse> {
		return this.#apiService.delete<ApiDeleteResponse>(this.#enpoint + id)
	}

	async download(test: Test) {
		const doc = new Document({
			sections: [
				{
					properties: {
						page: {
							size: {
								orientation: PageOrientation.PORTRAIT,
								height: '279mm',
								width: '216mm',
							},
						},
					},
					children: test.body.split('\n').map((text) => {
						if (!text || text.startsWith('__')) return this.p('')

						if (text.startsWith('# '))
							return this.heading(text.slice(2))

						if (text.startsWith('## '))
							return this.heading(
								text.slice(3),
								HeadingLevel.HEADING_2,
							)

						if (text.startsWith('### '))
							return this.heading(
								text.slice(4),
								HeadingLevel.HEADING_3,
							)

						if (text.startsWith('#### '))
							return this.heading(
								text.slice(5),
								HeadingLevel.HEADING_4,
							)

						if (text.includes('**'))
							return this.p(text.slice(2), true)

						if (text.startsWith('|-'))
							return this.table(
								text.slice(1).replaceAll('-', ''),
							)

						if (text.startsWith('| '))
							return this.table(text.slice(1))

						return this.p(text)
					}),
				},
			],
		})
		const blob = await Packer.toBlob(doc)
		saveAs(
			blob,
			`Examen de ${this.pretify(test.subject)} de ${this.pretify(test.section.year)} de ${this.pretify(test.section.level)}.docx`,
		)
	}

	private pretify(str: string) {
		return new PretifyPipe().transform(str)
	}

	private heading(
		text: string,
		level: any = HeadingLevel.HEADING_1,
	): Paragraph {
		return new Paragraph({
			children: [
				new TextRun({
					color: '#000000',
					text,
				}),
			],
			heading: level,
		})
	}

	private table(text: string): Table {
		return new Table({
			width: {
				size: 100,
				type: WidthType.PERCENTAGE,
			},
			rows: text.split('|').map((s) => {
				return new TableRow({
					children: [new TableCell({ children: [this.p(s)] })],
				})
			}),
		})
	}

	private p(text: string, bold = false): Paragraph {
		if (bold) {
			const sections = text.split('**')
			return new Paragraph({
				children: sections.map((s, i) => {
					if (i === 0) return new TextRun({ text: s, bold: true })
					else return new TextRun({ text: s })
				}),
			})
		}
		return new Paragraph({ text })
	}
}
