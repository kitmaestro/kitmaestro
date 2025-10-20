import { inject, Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { ApiDeleteResponse } from '../interfaces'
import { ApiUpdateResponse } from '../interfaces'
import { Checklist } from '../models'
import { ApiService } from './api.service'
import {
	AlignmentType,
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
import { PretifyPipe } from '../../shared/pipes/pretify.pipe'

@Injectable({
	providedIn: 'root',
})
export class ChecklistService {
	#apiService = inject(ApiService)
	#endpoint = 'checklists/'

	findAll(filters?: any): Observable<Checklist[]> {
		return this.#apiService.get<Checklist[]>(this.#endpoint, filters)
	}

	find(id: string): Observable<Checklist> {
		return this.#apiService.get<Checklist>(this.#endpoint + id)
	}

	create(idea: Checklist): Observable<Checklist> {
		return this.#apiService.post<Checklist>(this.#endpoint, idea)
	}

	update(id: string, idea: any): Observable<ApiUpdateResponse> {
		return this.#apiService.patch<ApiUpdateResponse>(this.#endpoint + id, idea)
	}

	delete(id: string): Observable<ApiDeleteResponse> {
		return this.#apiService.delete<ApiDeleteResponse>(this.#endpoint + id)
	}

	private pretify(str: string) {
		return new PretifyPipe().transform(str)
	}

	async download(list: Checklist) {
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
					children: [
						new Paragraph({
							children: [
								new TextRun({
									text: list.title,
									color: '#000000',
								}),
							],
							heading: HeadingLevel.HEADING_1,
							alignment: AlignmentType.CENTER,
						}),
						new Paragraph({
							children: [
								new TextRun({
									text: list.activityType,
									color: '#000000',
								}),
							],
							heading: HeadingLevel.HEADING_2,
							alignment: AlignmentType.CENTER,
						}),
						new Paragraph({
							children: [
								new TextRun({
									text: 'Lista de Cotejo',
									color: '#000000',
								}),
							],
							heading: HeadingLevel.HEADING_2,
							alignment: AlignmentType.CENTER,
						}),
						new Paragraph({
							children: [
								new TextRun({
									text: 'Competencias Fundamentales',
									color: '#000000',
								}),
							],
							heading: HeadingLevel.HEADING_3,
						}),
						...list.competence.flatMap(
							(c) =>
								new Paragraph({
									text: this.pretify(c.name),
									bullet: { level: 0 },
								}),
						),
						new Paragraph({
							children: [
								new TextRun({
									text: 'Competencias Específicas',
									color: '#000000',
								}),
							],
							heading: HeadingLevel.HEADING_3,
						}),
						...list.competence
							.flatMap((c) => c.entries)
							.map(
								(c) =>
									new Paragraph({
										text: c,
										bullet: { level: 0 },
									}),
							),
						new Paragraph({
							children: [
								new TextRun({
									text: 'Indicadores de Logro',
									color: '#000000',
								}),
							],
							heading: HeadingLevel.HEADING_3,
						}),
						...list.contentBlock.achievement_indicators.flatMap(
							(c) =>
								new Paragraph({
									text: c,
									bullet: { level: 0 },
								}),
						),
						new Paragraph(''),
						new Paragraph({
							children: [
								new TextRun({
									text: 'Actividad o Evidencia',
									bold: true,
								}),
								new TextRun(': ' + list.activity),
							],
						}),
						new Paragraph(''),
						new Paragraph({
							children: [
								new TextRun({ text: 'Nombre', bold: true }),
								new TextRun(': ____________________________\t'),
								new TextRun({ text: 'Curso', bold: true }),
								new TextRun(': ______________\t\t'),
								new TextRun({ text: 'Fecha', bold: true }),
								new TextRun(': __________'),
							],
						}),
						new Paragraph(''),
						new Table({
							width: {
								size: 100,
								type: WidthType.PERCENTAGE,
							},
							rows: [
								new TableRow({
									children: [
										new TableCell({
											children: [
												new Paragraph({
													children: [
														new TextRun({
															text: 'Criterio de Evaluación',
															bold: true,
														}),
													],
												}),
											],
										}),
										new TableCell({
											children: [
												new Paragraph({
													children: [
														new TextRun({
															text: 'Sí',
															bold: true,
														}),
													],
												}),
											],
										}),
										new TableCell({
											children: [
												new Paragraph({
													children: [
														new TextRun({
															text: 'No',
															bold: true,
														}),
													],
												}),
											],
										}),
										new TableCell({
											children: [
												new Paragraph({
													children: [
														new TextRun({
															text: 'Observaciones',
															bold: true,
														}),
													],
												}),
											],
										}),
									],
									tableHeader: true,
								}),
								...list.criteria.map(
									(c) =>
										new TableRow({
											children: [
												new TableCell({
													children: [
														new Paragraph(c),
													],
												}),
												new TableCell({
													children: [
														new Paragraph(''),
													],
												}),
												new TableCell({
													children: [
														new Paragraph(''),
													],
												}),
												new TableCell({
													children: [
														new Paragraph(''),
													],
												}),
											],
										}),
								),
							],
						}),
						new Paragraph(''),
					],
				},
			],
		})
		const blob = await Packer.toBlob(doc)
		saveAs(blob, 'Lista de cotejo ' + list.title + '.docx')
	}
}
