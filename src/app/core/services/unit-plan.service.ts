import { inject, Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import {
	ImageRun,
	Table,
	WidthType,
	TableRow,
	TableCell,
	Paragraph,
	TextRun,
	AlignmentType,
	PageOrientation,
	HeadingLevel,
	Packer,
	Document,
} from 'docx'
import saveAs from 'file-saver'
import { PretifyPipe } from '../../shared/pipes'
import { ApiDeleteResponse } from '../interfaces'
import { ApiService } from './api.service'
import { User, ClassPlan, UnitPlan } from '../models'
import { UnitPlanDto } from '../../store/unit-plans/unit-plans.models'

@Injectable({
	providedIn: 'root',
})
export class UnitPlanService {
	#apiService = inject(ApiService)
	#endpoint = 'unit-plans/'
	#pretify = (new PretifyPipe()).transform

	countPlans(): Observable<{ plans: number }> {
		return this.#apiService.get<{ plans: number }>(this.#endpoint + 'count')
	}

	findAll(): Observable<UnitPlan[]> {
		return this.#apiService.get<UnitPlan[]>(this.#endpoint)
	}

	findOne(id: string): Observable<UnitPlan> {
		return this.#apiService.get<UnitPlan>(this.#endpoint + id)
	}

	create(plan: Partial<UnitPlanDto>): Observable<UnitPlan> {
		return this.#apiService.post<UnitPlan>(this.#endpoint, plan)
	}

	update(id: string, plan: Partial<UnitPlanDto>): Observable<UnitPlan> {
		return this.#apiService.patch<UnitPlan>(this.#endpoint + id, plan)
	}

	delete(id: string): Observable<ApiDeleteResponse> {
		return this.#apiService.delete<ApiDeleteResponse>(this.#endpoint + id)
	}

	#pretifyCompetence(value: string, level: string) {
		if (level === 'PRIMARIA') {
			if (value === 'Comunicativa') {
				return 'Comunicativa'
			}
			if (value.includes('Pensamiento')) {
				return 'Pensamiento Lógico Creativo y Crítico; Resolución de Problemas; Tecnológica y Científica';
			}
			if (value.includes('Ciudadana')) {
				return 'Ética Y Ciudadana; Desarrollo Personal y Espiritual; Ambiental y de la Salud';
			}
		} else {
			if (value === 'Comunicativa') {
				return 'Comunicativa'
			}
			if (value === 'Pensamiento Logico') {
				return 'Pensamiento Lógico, Creativo y Crítico'
			}
			if (value === 'Resolucion De Problemas') {
				return 'Resolución de Problemas'
			}
			if (value === 'Ciencia Y Tecnologia') {
				return 'Tecnológica y Científica'
			}
			if (value === 'Etica Y Ciudadana') {
				return 'Ética y Ciudadana'
			}
			if (value === 'Desarrollo Personal Y Espiritual') {
				return 'Desarrollo Personal y Espiritual'
			}
			if (value === 'Ambiental Y De La Salud') {
				return 'Ambiental y de la Salud'
			}
		}
		return value
	}

	async download(plan: UnitPlan, classPlans: ClassPlan[] = [], user: User) {
		const logo = await fetch(this.#apiService.getApiUrl() + 'logo-minerd')
		const { data } = await logo.json()

		const logoMinerd = new ImageRun({
			type: 'png',
			data,
			transformation: {
				width: 300,
				height: 233,
			},
		})
		const contentsTable = new Table({
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
											text: 'Contenidos',
											bold: true,
										}),
									],
									alignment: AlignmentType.CENTER,
								}),
							],
							columnSpan: 3,
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
											text: 'Conceptuales',
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
											text: 'Procedimentales',
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
											text: 'Actitudinales',
											bold: true,
										}),
									],
								}),
							],
						}),
					],
				}),
				new TableRow({
					children: [
						new TableCell({
							children: plan.contents.flatMap((block) =>
								block.concepts.map(
									(concept) => new Paragraph(concept),
								),
							),
						}),
						new TableCell({
							children: plan.contents.flatMap((block) =>
								block.procedures.map(
									(procedure) => new Paragraph(procedure),
								),
							),
						}),
						new TableCell({
							children: plan.contents.flatMap((block) =>
								block.attitudes.map(
									(attitude) => new Paragraph(attitude),
								),
							),
						}),
					],
				}),
			],
		})
		const activityRows: TableRow[] = []
		if (classPlans.length > 0) {
			activityRows.push(
				new TableRow({
					children: [
						new TableCell({
							children: [
								new Paragraph({
									children: [
										new TextRun({
											text: 'Fecha',
											bold: true,
										}),
									],
									alignment: AlignmentType.CENTER,
								}),
							],
						}),
						new TableCell({
							children: [
								new Paragraph({
									children: [
										new TextRun({
											text: 'Actividades de Aprendizaje',
											bold: true,
										}),
									],
									alignment: AlignmentType.CENTER,
								}),
							],
						}),
						new TableCell({
							children: [
								new Paragraph({
									children: [
										new TextRun({
											text: 'Evidencia',
											bold: true,
										}),
									],
									alignment: AlignmentType.CENTER,
								}),
							],
						}),
						new TableCell({
							children: [
								new Paragraph({
									children: [
										new TextRun({
											text: 'Tecnicas e Instrumentos de Evaluación',
											bold: true,
										}),
									],
									alignment: AlignmentType.CENTER,
								}),
							],
						}),
						new TableCell({
							children: [
								new Paragraph({
									children: [
										new TextRun({
											text: 'Metacognición',
											bold: true,
										}),
									],
									alignment: AlignmentType.CENTER,
								}),
							],
						}),
						new TableCell({
							children: [
								new Paragraph({
									children: [
										new TextRun({
											text: 'Recursos',
											bold: true,
										}),
									],
									alignment: AlignmentType.CENTER,
								}),
							],
						}),
					],
				}),
			)
			activityRows.push(
				...classPlans.map((cp) => {
					return new TableRow({
						children: [
							new TableCell({
								children: [
									new Paragraph({
										children: [new TextRun('')],
									}),
								],
							}), // empty date
							new TableCell({
								children: [
									new Paragraph({
										children: [
											{
												bold: true,
												break: 1,
												text: 'Inicio',
											},
											...cp.introduction.activities.map(
												(s) => ({ text: s, break: 1 }),
											),
											{
												bold: true,
												break: 1,
												text: 'Desarrollo',
											},
											...cp.main.activities.map((s) => ({
												text: s,
												break: 1,
											})),
											{
												bold: true,
												break: 1,
												text: 'Cierre',
											},
											...cp.closing.activities.map(
												(s) => ({ text: s, break: 1 }),
											),
										].map((res) => new TextRun(res)),
									}),
								],
							}),
							new TableCell({
								children: [
									new Paragraph({
										children: [new TextRun('')],
									}),
								],
							}), // empty evidence
							new TableCell({
								children: [
									new Paragraph({
										children: plan.instruments.map(
											(i) => new TextRun(i),
										),
									}),
								],
							}),
							new TableCell({
								children: [
									new Paragraph({
										children: [
											'¿Qué te aprendiste de este tema hoy?',
											'¿Qué tan importante es este tema a lo largo de sus vidas?',
											'¿Qué te pareció el tema del día de hoy?',
											'¿Cómo aprendí estos conocimientos?',
											'¿Cuál fue la parte que más te intereso?',
											'¿Como nos beneficiamos de los conocimientos aprendido hoy?',
											'¿En qué nos ayuda para convivir mejor este tema?',
										].map((s) => new TextRun(s)),
									}),
								],
							}), // fixed metacognition
							new TableCell({
								children: [
									new Paragraph({
										children: [
											...cp.introduction.resources,
											...cp.main.resources,
											...cp.closing.resources,
										].map(
											(res) =>
												new TextRun({
													text: `- ${res}\n`,
													break: 1,
												}),
										),
									}),
								],
							}),
						],
					})
				}),
			)
		} else {
			activityRows.push(
				new TableRow({
					children: [
						new TableCell({
							children: [
								new Paragraph({
									children: [
										new TextRun({
											text: 'Actividades de Enseñanza',
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
											text: 'Actividades de Aprendizaje',
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
											text: 'Actividades de Evaluación',
											bold: true,
										}),
									],
								}),
							],
						}),
					],
				}),
			)
			activityRows.push(
				new TableRow({
					children: [
						new TableCell({
							children: plan.teacherActivities.flatMap((block) =>
								block.activities.map(
									(concept) => new Paragraph(concept),
								),
							),
						}),
						new TableCell({
							children: plan.contents.flatMap((block) =>
								block.procedures.map(
									(procedure) => new Paragraph(procedure),
								),
							),
						}),
						new TableCell({
							children: plan.contents.flatMap((block) =>
								block.attitudes.map(
									(attitude) => new Paragraph(attitude),
								),
							),
						}),
					],
				}),
			)
		}
		const activitiesTable = new Table({
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
											text: 'Actividades',
											bold: true,
										}),
									],
									alignment: AlignmentType.CENTER,
								}),
							],
							columnSpan: classPlans.length ? 6 : 3,
						}),
					],
				}),
				...activityRows,
			],
		})
		const doc = new Document({
			sections: [
				// presentation
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
							children: [logoMinerd],
							alignment: AlignmentType.CENTER,
						}),
						new Paragraph({
							children: [
								new TextRun({
									// color: '#000000',
									text: user.schoolName,
								}),
							],
							heading: HeadingLevel.HEADING_1,
							alignment: AlignmentType.CENTER,
						}),
						new Paragraph({
							children: [
								new TextRun({
									// color: '#000000',
									text: 'Año Escolar 2025 - 2026',
								}),
							],
							heading: HeadingLevel.HEADING_2,
							alignment: AlignmentType.CENTER,
						}),
						new Paragraph({
							children: [
								new TextRun({
									// color: '#000000',
									text:
										this.#pretify(plan.section.year) +
										' de ' +
										this.#pretify(plan.section.level),
								}),
							],
							heading: HeadingLevel.HEADING_2,
							alignment: AlignmentType.CENTER,
						}),
						new Paragraph({
							children: [
								new TextRun({
									// color: '#000000',
									text: 'Docente:',
								}),
							],
							heading: HeadingLevel.HEADING_2,
							alignment: AlignmentType.CENTER,
						}),
						new Paragraph({
							children: [
								new TextRun({
									// color: '#000000',
									text: `${plan.user.title}. ${plan.user.firstname} ${plan.user.lastname}`,
								}),
							],
							heading: HeadingLevel.HEADING_3,
							alignment: AlignmentType.CENTER,
						}),
						new Paragraph({
							children: [
								new TextRun({
									// color: '#000000',
									text: 'Unidad de Aprendizaje',
								}),
							],
							heading: HeadingLevel.HEADING_2,
							alignment: AlignmentType.CENTER,
						}),
						new Paragraph({
							children: [
								new TextRun({
									// color: '#000000',
									text: '" ' + plan.title + ' "',
								}),
							],
							heading: HeadingLevel.HEADING_3,
							alignment: AlignmentType.CENTER,
						}),
						new Paragraph({
							children: [
								new TextRun({
									// color: '#000000',
									text:
										'Asignatura' +
										(plan.subjects.length > 1 ? 's:' : ':'),
								}),
							],
							heading: HeadingLevel.HEADING_2,
							alignment: AlignmentType.CENTER,
						}),
						new Paragraph({
							children: [
								new TextRun({
									// color: '#000000',
									text: plan.subjects
										.map(
											(s, i, arr) =>
												(arr.length > 1 &&
												i === arr.length - 1
													? 'y '
													: '') + this.#pretify(s),
										)
										.join(', '),
								}),
							],
							heading: HeadingLevel.HEADING_3,
							alignment: AlignmentType.CENTER,
						}),
						new Paragraph({
							children: [
								new TextRun({
									// color: '#000000',
									text: 'Eje Transversal:',
								}),
							],
							heading: HeadingLevel.HEADING_2,
							alignment: AlignmentType.CENTER,
						}),
						new Paragraph({
							children: [
								new TextRun({
									// color: '#000000',
									text: plan.mainThemeCategory,
								}),
							],
							heading: HeadingLevel.HEADING_3,
							alignment: AlignmentType.CENTER,
						}),
						new Paragraph({
							children: [
								new TextRun({
									// color: '#000000',
									text: 'Duración Aproximada:',
								}),
							],
							heading: HeadingLevel.HEADING_2,
							alignment: AlignmentType.CENTER,
						}),
						new Paragraph({
							children: [
								new TextRun({
									// color: '#000000',
									text: plan.duration + ' Semanas',
								}),
							],
							heading: HeadingLevel.HEADING_3,
							alignment: AlignmentType.CENTER,
						}),
					],
				},
				// body
				{
					properties: {
						page: {
							size: {
								orientation: PageOrientation.LANDSCAPE,
								height: '279mm',
								width: '216mm',
							},
						},
					},
					children: [
						new Paragraph({
							children: [
								new TextRun({
									text: 'Situación de Aprendizaje',
								}),
							],
							heading: HeadingLevel.HEADING_3,
						}),
						new Paragraph({
							children: [
								new TextRun({
									text: plan.learningSituation,
								}),
							],
						}),
						new Paragraph({
							text: 'Competencias Fundamentales',
							heading: HeadingLevel.HEADING_3,
						}),
						...plan.competence.map(
							(c) =>
								new Paragraph({
									text: this.#pretifyCompetence(
										c.name,
										plan.section.level || 'PRIMARIA',
									),
									bullet: {
										level: 0,
									},
								}),
						),
						new Paragraph({
							text: 'Competencias Específicas del Grado',
							heading: HeadingLevel.HEADING_3,
						}),
						...plan.competence.flatMap((c) =>
							c.entries.map(
								(entry) =>
									new Paragraph({
										text: entry,
										bullet: {
											level: 0,
										},
									}),
							),
						),
						new Paragraph({
							text: 'Criterios de Evaluación',
							heading: HeadingLevel.HEADING_3,
						}),
						...plan.competence.flatMap((c) =>
							c.criteria.map(
								(entry) =>
									new Paragraph({
										text: entry,
										bullet: {
											level: 0,
										},
									}),
							),
						),
						new Paragraph({
							text:
								(plan.subjects.length > 1
									? 'Ejes Transversales: '
									: 'Eje Transversal: ') +
								plan.mainThemeCategory,
							heading: HeadingLevel.HEADING_3,
						}),
						...plan.mainThemes.flatMap((theme) =>
							theme.topics.map(
								(entry) =>
									new Paragraph({
										text: entry,
										bullet: {
											level: 0,
										},
									}),
							),
						),
						new Paragraph({
							text:
								plan.subjects.length > 1
									? 'Asignaturas'
									: 'Asignatura',
							heading: HeadingLevel.HEADING_3,
						}),
						...plan.subjects.flatMap(
							(subject) =>
								new Paragraph({
									text: this.#pretify(subject),
									bullet: {
										level: 0,
									},
								}),
						),
						new Paragraph({
							text: 'Estrategias de Enseñanza y Aprendizaje',
							heading: HeadingLevel.HEADING_3,
						}),
						...plan.strategies.flatMap(
							(strategy) =>
								new Paragraph({
									text: strategy,
									bullet: {
										level: 0,
									},
								}),
						),
						new Paragraph({
							text: 'Indicadores de Logro',
							heading: HeadingLevel.HEADING_3,
						}),
						...plan.contents.flatMap((content) =>
							content.achievement_indicators.map(
								(indicator) =>
									new Paragraph({
										text: indicator,
										bullet: {
											level: 0,
										},
									}),
							),
						),
						new Paragraph(''),
						contentsTable,
						new Paragraph(''),
						activitiesTable,
						new Paragraph(''),
						new Paragraph({
							text: 'Técnicas e Instrumentos de Evaluación',
							heading: HeadingLevel.HEADING_3,
						}),
						...plan.instruments.map(
							(instrument) =>
								new Paragraph({
									text: instrument,
									bullet: { level: 0 },
								}),
						),
						new Paragraph({
							text: 'Medios y Recursos',
							heading: HeadingLevel.HEADING_3,
						}),
						...plan.resources.map(
							(resource) =>
								new Paragraph({
									text: resource,
									bullet: { level: 0 },
								}),
						),
					],
				},
			],
		})
		const blob = await Packer.toBlob(doc)
		saveAs(blob, `${plan.title}.docx`)
	}
}
