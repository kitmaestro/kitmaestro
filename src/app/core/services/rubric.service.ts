import { inject, Injectable } from '@angular/core'
import { lastValueFrom, Observable } from 'rxjs'
import { Rubric, Student } from '../models'
import { ApiDeleteResponse } from '../interfaces'
import { ApiService } from './api.service'
import { StudentsService } from './students.service'
import {
	Document,
	HeadingLevel,
	ISectionOptions,
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
import { RubricDto } from '../../store/rubrics/rubrics.models'

@Injectable({
	providedIn: 'root',
})
export class RubricService {
	#apiService = inject(ApiService)
	#studentService = inject(StudentsService)
	#endpoint = 'rubrics/'

	findAll(filter?: any): Observable<Rubric[]> {
		return this.#apiService.get<Rubric[]>(this.#endpoint, filter)
	}

	find(id: string): Observable<Rubric> {
		return this.#apiService.get<Rubric>(this.#endpoint + id)
	}

	create(plan: Partial<RubricDto>): Observable<Rubric> {
		return this.#apiService.post<Rubric>(this.#endpoint, plan)
	}

	update(id: string, plan: Partial<RubricDto>): Observable<Rubric> {
		return this.#apiService.patch<Rubric>(this.#endpoint + id, plan)
	}

	delete(id: string): Observable<ApiDeleteResponse> {
		return this.#apiService.delete<ApiDeleteResponse>(this.#endpoint + id)
	}

	async download(rubric: Rubric) {
		const properties: any = {
			page: {
				size: {
					orientation: PageOrientation.PORTRAIT,
					height: '279mm',
					width: '216mm',
				},
			},
		}
		const students = await lastValueFrom(
			this.#studentService.findBySection(rubric.section._id),
		)
		const sections: ISectionOptions[] = []
		const title = new Paragraph({
			children: [new TextRun({ text: 'Rúbrica' })],
			heading: HeadingLevel.HEADING_2,
		})
		const subtitle = new Paragraph({
			children: [new TextRun({ text: rubric.title })],
			heading: HeadingLevel.HEADING_3,
		})
		const sectionName = new Paragraph({
			children: [new TextRun({ text: rubric.section.name })],
			heading: HeadingLevel.HEADING_3,
		})
		const competenceTitle = new Paragraph({
			children: [new TextRun({ text: 'Competencias Específicas' })],
			heading: HeadingLevel.HEADING_3,
		})
		const competence: Paragraph[] = rubric.competence.map(
			(c) => new Paragraph({ text: c, bullet: { level: 0 } }),
		)
		const indicatorsTitle = new Paragraph({
			children: [new TextRun({ text: 'Indicadores de Logro' })],
			heading: HeadingLevel.HEADING_3,
		})
		const indicators: Paragraph[] = rubric.achievementIndicators.map(
			(c) => new Paragraph({ text: c, bullet: { level: 0 } }),
		)
		const activity = new Paragraph({
			children: [
				new TextRun({ text: 'Evidencia o Actividad:', bold: true }),
				new TextRun(rubric.activity),
			],
		})
		const table: { content: Table[] } = {} as any
		if (students.length) {
			if (rubric.rubricType !== 'SINTETICA') {
				table.content = rubric.criteria.flatMap((indicator) => {
					return new Table({
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
														text: 'Criterio o indicador: ',
														bold: true,
													}),
													new TextRun(
														indicator.indicator,
													),
												],
											}),
										],
										columnSpan:
											rubric.progressLevels.length + 1,
									}),
								],
							}),
							new TableRow({
								children: [
									new TableCell({
										children: [
											new Paragraph({
												children: [
													new TextRun({
														text: 'Estudiantes',
														bold: true,
													}),
												],
											}),
										],
										rowSpan: 2,
									}),
									...rubric.progressLevels.map(
										(l, i) =>
											new TableCell({
												children: [
													new Paragraph({
														children: [
															new TextRun({
																text: `Nivel ${i + 1}\n${l}`,
																bold: true,
															}),
														],
													}),
												],
											}),
									),
								],
							}),
							new TableRow({
								children: indicator.criterion.map(
									(c, i) =>
										new TableCell({
											children: [
												new Paragraph({
													children: [
														new TextRun({
															text: `${c.name} (${c.score})`,
															bold: true,
														}),
													],
												}),
											],
										}),
								),
							}),
							...(students.length > 0
								? students
								: Array.from({ length: 45 }).map(
										() =>
											({
												firstname: '',
												lastname: '',
											}) as any as Student,
									)
							).map(
								(student, i) =>
									new TableRow({
										children: [
											new TableCell({
												children: [
													new Paragraph(
														`${i + 1}. ${student.firstname} ${student.lastname}`,
													),
												],
											}),
											...Array.from({
												length: rubric.progressLevels
													.length,
											}).map(
												() =>
													new TableCell({
														children: [
															new Paragraph(''),
														],
													}),
											),
										],
									}),
							),
						],
					})
				})
				const section: ISectionOptions = {
					properties,
					children: [
						title,
						subtitle,
						sectionName,
						competenceTitle,
						...competence,
						indicatorsTitle,
						...indicators,
						activity,
						new Paragraph(''),
						...table.content,
						new Paragraph(''),
					],
				}
				sections.push(section)
			} else {
				table.content = [
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
														text: 'Criterios o Indicadores',
														bold: true,
													}),
												],
											}),
										],
										rowSpan: 2,
									}),
									new TableCell({
										children: [
											new Paragraph({
												children: [
													new TextRun({
														text: 'Niveles de Desempeño',
														bold: true,
													}),
												],
											}),
										],
										columnSpan:
											rubric.progressLevels.length,
									}),
								],
							}),
							new TableRow({
								children: rubric.progressLevels.map(
									(level, i) =>
										new TableCell({
											children: [
												new Paragraph({
													children: [
														new TextRun({
															text: `Nivel ${i + 1}\n${level}`,
															bold: true,
														}),
													],
												}),
											],
										}),
								),
							}),
							...rubric.criteria.flatMap(
								(criteria) =>
									new TableRow({
										children: [
											new TableCell({
												children: [
													new Paragraph(
														criteria.indicator,
													),
												],
											}),
											...criteria.criterion.map(
												(c) =>
													new TableCell({
														children: [
															new Paragraph(
																`${c.name} (${c.score})`,
															),
														],
													}),
											),
										],
									}),
							),
						],
					}),
				]
				students.forEach((student) => {
					const section: ISectionOptions = {
						properties,
						children: [
							title,
							subtitle,
							sectionName,
							new Paragraph({
								children: [
									new TextRun({
										text: 'Estudiante: ',
										bold: true,
									}),
									new TextRun(
										`${student.firstname} ${student.lastname}\t`,
									),
									new TextRun({
										text: 'Fecha: ',
										bold: true,
									}),
									new TextRun('____________'),
								],
							}),
							competenceTitle,
							...competence,
							indicatorsTitle,
							...indicators,
							activity,
							new Paragraph(''),
							...table.content,
							new Paragraph(''),
						],
					}
					sections.push(section)
				})
			}
		} else {
			if (rubric.rubricType !== 'SINTETICA') {
				table.content = rubric.criteria.flatMap((indicator) => {
					const emptyRowsAmount = 45
					const emptyRowsCells = Array.from({
						length: rubric.progressLevels.length + 1,
					}).map(
						() =>
							new TableCell({
								children: [
									new Paragraph({
										children: [
											new TextRun({
												size: 12,
												text: '',
											}),
										],
									}),
								],
							}),
					)
					const emptyRows = Array.from({
						length: emptyRowsAmount,
					}).map(() => new TableRow({ children: emptyRowsCells }))
					return new Table({
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
														text: 'Criterio o indicador: ',
														bold: true,
													}),
													new TextRun(
														indicator.indicator,
													),
												],
											}),
										],
										columnSpan:
											rubric.progressLevels.length + 1,
									}),
								],
							}),
							new TableRow({
								children: [
									new TableCell({
										children: [
											new Paragraph({
												children: [
													new TextRun({
														text: 'Estudiantes',
														bold: true,
													}),
												],
											}),
										],
										rowSpan: 2,
									}),
									...rubric.progressLevels.map(
										(l, i) =>
											new TableCell({
												children: [
													new Paragraph({
														children: [
															new TextRun({
																text: `Nivel ${i + 1}\n${l}`,
																bold: true,
															}),
														],
													}),
												],
											}),
									),
								],
							}),
							new TableRow({
								children: indicator.criterion.map(
									(c, i) =>
										new TableCell({
											children: [
												new Paragraph({
													children: [
														new TextRun({
															text: `${c.name} (${c.score})`,
															bold: true,
														}),
													],
												}),
											],
										}),
								),
							}),
							...emptyRows,
						],
					})
				})
			} else {
				table.content = [
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
														text: 'Criterios o Indicadores',
														bold: true,
													}),
												],
											}),
										],
										rowSpan: 2,
									}),
									new TableCell({
										children: [
											new Paragraph({
												children: [
													new TextRun({
														text: 'Niveles de Desempeño',
														bold: true,
													}),
												],
											}),
										],
										columnSpan:
											rubric.progressLevels.length,
									}),
								],
							}),
							new TableRow({
								children: rubric.progressLevels.map(
									(level, i) =>
										new TableCell({
											children: [
												new Paragraph({
													children: [
														new TextRun({
															text: `Nivel ${i + 1}\n${level}`,
															bold: true,
														}),
													],
												}),
											],
										}),
								),
							}),
							...rubric.criteria.map(
								(criteria) =>
									new TableRow({
										children: criteria.criterion.map(
											(c) =>
												new TableCell({
													children: [
														new Paragraph(
															`${c.name} (${c.score})`,
														),
													],
												}),
										),
									}),
							),
						],
					}),
				]
			}
			if (rubric.rubricType !== 'SINTETICA') {
				const section: ISectionOptions = {
					properties,
					children: [
						title,
						subtitle,
						sectionName,
						competenceTitle,
						...competence,
						indicatorsTitle,
						...indicators,
						activity,
						new Paragraph(''),
						...table.content,
						new Paragraph(''),
					],
				}
				sections.push(section)
			} else {
				const section: ISectionOptions = {
					properties,
					children: [
						title,
						subtitle,
						sectionName,
						new Paragraph({
							children: [
								new TextRun({
									text: 'Estudiante: ',
									bold: true,
								}),
								new TextRun('___________________________\t'),
								new TextRun({ text: ' Fecha: ', bold: true }),
								new TextRun('_____________'),
							],
						}),
						competenceTitle,
						...competence,
						indicatorsTitle,
						...indicators,
						activity,
						new Paragraph(''),
						...table.content,
						new Paragraph(''),
					],
				}
				sections.push(section)
			}
		}
		const doc = new Document({
			sections,
		})
		const blob = await Packer.toBlob(doc)
		saveAs(blob, `${rubric.title} - Rubrica.docx`)
	}
}
