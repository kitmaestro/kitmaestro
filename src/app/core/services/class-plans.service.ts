import { inject, Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { ClassPlan } from '../models'
import { ApiDeleteResponse } from '../interfaces'
import {
	Document,
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
import { ApiService } from './api.service'
import { ClassPlanDto } from '../../store/class-plans/class-plans.models'

@Injectable({
	providedIn: 'root',
})
export class ClassPlansService {
	#apiService = inject(ApiService)
	#endpoint = 'class-plans/'
	#pretify = new PretifyPipe().transform

	countPlans(): Observable<{ plans: number }> {
		return this.#apiService.get<{ plans: number }>('class-plans/count')
	}

	findAll(filters?: any): Observable<ClassPlan[]> {
		return this.#apiService.get<ClassPlan[]>(this.#endpoint, filters)
	}

	find(id: string): Observable<ClassPlan> {
		return this.#apiService.get<ClassPlan>(this.#endpoint + id)
	}

	addPlan(plan: Partial<ClassPlanDto>): Observable<ClassPlan> {
		return this.#apiService.post<ClassPlan>(this.#endpoint, plan)
	}

	updatePlan(id: string, plan: any): Observable<ClassPlan> {
		return this.#apiService.patch<ClassPlan>(this.#endpoint + id, plan)
	}

	deletePlan(id: string): Observable<ApiDeleteResponse> {
		return this.#apiService.delete<ApiDeleteResponse>(this.#endpoint + id)
	}

	async download(plan: ClassPlan) {
		const date = new Date(plan.date)
			.toISOString()
			.split('T')[0]
			.split('-')
			.reverse()
			.join('-')
		const planTable = new Table({
			width: {
				size: 100,
				type: WidthType.PERCENTAGE,
			},
			rows: [
				new TableRow({
					children: [
						new TableCell({
							columnSpan: 2,
							children: [
								new Paragraph({
									children: [
										new TextRun({
											text: 'Centro Educativo:',
											bold: true,
										}),
									],
								}),
							],
						}),
						new TableCell({
							columnSpan: 4,
							children: [
								new Paragraph({
									text: plan.user.schoolName,
								}),
							],
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
											text: 'Grado:',
											bold: true,
										}),
									],
								}),
							],
						}),
						new TableCell({
							columnSpan: 2,
							children: [
								new Paragraph({
									text:
										this.#pretify(plan.section.year) +
										' de ' +
										this.#pretify(plan.section.level),
								}),
							],
						}),
						new TableCell({
							children: [
								new Paragraph({
									children: [
										new TextRun({
											text: 'Área Curricular:',
											bold: true,
										}),
									],
								}),
							],
						}),
						new TableCell({
							columnSpan: 2,
							children: [
								new Paragraph({
									text: this.#pretify(plan.subject),
								}),
							],
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
											text: 'Fecha:',
											bold: true,
										}),
									],
								}),
							],
						}),
						new TableCell({
							columnSpan: 2,
							children: [new Paragraph({ text: date })],
						}),
						new TableCell({
							children: [
								new Paragraph({
									children: [
										new TextRun({
											text: 'Docente:',
											bold: true,
										}),
									],
								}),
							],
						}),
						new TableCell({
							columnSpan: 2,
							children: [
								new Paragraph({
									text: `${plan.user.title}. ${plan.user.firstname} ${plan.user.lastname}`,
								}),
							],
						}),
					],
				}),
				new TableRow({
					children: [
						new TableCell({
							columnSpan: 2,
							children: [
								new Paragraph({
									children: [
										new TextRun({
											text: 'Estrategias y técnicas de enseñanza-aprendizaje:',
											bold: true,
										}),
									],
								}),
							],
						}),
						new TableCell({
							columnSpan: 4,
							children: [
								new Paragraph({
									text: plan.strategies.join(', '),
								}),
							],
						}),
					],
				}),
				new TableRow({
					children: [
						new TableCell({
							columnSpan: 2,
							children: [
								new Paragraph({
									children: [
										new TextRun({
											text: 'Intención Pedagógica:',
											bold: true,
										}),
									],
								}),
							],
						}),
						new TableCell({
							columnSpan: 4,
							children: [new Paragraph({ text: plan.objective })],
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
											text: 'Momento / Duración',
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
											text: 'Competencias Específicas',
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
											text: 'Actividades',
											bold: true,
										}),
									],
								}),
							],
							columnSpan: 2,
						}),
						new TableCell({
							children: [
								new Paragraph({
									children: [
										new TextRun({
											text: 'Organización de los Estudiantes',
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
											text: 'Recursos',
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
							children: [
								new Paragraph({
									children: [
										new TextRun({
											text: 'Inicio ',
											bold: true,
										}),
										new TextRun({
											text: `(${plan.introduction.duration} minutos)`,
										}),
									],
								}),
							],
						}),
						new TableCell({
							children: [
								new Paragraph({ text: plan.competence }),
							],
							rowSpan: 4,
						}),
						new TableCell({
							children: plan.introduction.activities.map(
								(activity) =>
									new Paragraph({ text: '- ' + activity }),
							),
							columnSpan: 2,
						}),
						new TableCell({
							children: [
								new Paragraph({
									text: plan.introduction.layout,
								}),
							],
						}),
						new TableCell({
							children: plan.introduction.resources.map(
								(res) => new Paragraph({ text: '- ' + res }),
							),
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
											text: 'Desarrollo ',
											bold: true,
										}),
										new TextRun({
											text: `(${plan.main.duration} minutos)`,
										}),
									],
								}),
							],
						}),
						new TableCell({
							children: plan.main.activities.map(
								(activity) =>
									new Paragraph({ text: '- ' + activity }),
							),
							columnSpan: 2,
						}),
						new TableCell({
							children: [
								new Paragraph({ text: plan.main.layout }),
							],
						}),
						new TableCell({
							children: plan.main.resources.map(
								(res) => new Paragraph({ text: '- ' + res }),
							),
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
											text: 'Cierre ',
											bold: true,
										}),
										new TextRun({
											text: `(${plan.closing.duration} minutos)`,
										}),
									],
								}),
							],
						}),
						new TableCell({
							children: plan.closing.activities.map(
								(activity) =>
									new Paragraph({ text: '- ' + activity }),
							),
							columnSpan: 2,
						}),
						new TableCell({
							children: [
								new Paragraph({ text: plan.closing.layout }),
							],
						}),
						new TableCell({
							children: plan.closing.resources.map(
								(res) => new Paragraph({ text: '- ' + res }),
							),
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
											text: 'Actividades Complementarias',
											bold: true,
										}),
									],
								}),
							],
						}),
						new TableCell({
							children: plan.supplementary.activities.map(
								(activity) =>
									new Paragraph({ text: '- ' + activity }),
							),
							columnSpan: 2,
						}),
						new TableCell({
							children: [
								new Paragraph({
									text: plan.supplementary.layout,
								}),
							],
						}),
						new TableCell({
							children: plan.supplementary.resources.map(
								(res) => new Paragraph({ text: '- ' + res }),
							),
						}),
					],
				}),
				new TableRow({
					children: [
						new TableCell({
							columnSpan: 2,
							children: [
								new Paragraph({
									children: [
										new TextRun({
											text: 'Vocabulario del día/de la semana:',
											bold: true,
										}),
									],
								}),
							],
						}),
						new TableCell({
							columnSpan: 4,
							children: [
								new Paragraph(plan.vocabulary.join(', ')),
							],
						}),
					],
				}),
				new TableRow({
					children: [
						new TableCell({
							columnSpan: 2,
							children: [
								new Paragraph({
									children: [
										new TextRun({
											text: 'Lecturas recomendadas/ o libro de la semana:',
											bold: true,
										}),
									],
								}),
							],
						}),
						new TableCell({
							columnSpan: 4,
							children: [new Paragraph(plan.readings || '')],
						}),
					],
				}),
				new TableRow({
					children: [
						new TableCell({
							columnSpan: 2,
							children: [
								new Paragraph({
									children: [
										new TextRun({
											text: 'Observaciones:',
											bold: true,
										}),
									],
								}),
							],
						}),
						new TableCell({
							columnSpan: 4,
							children: [new Paragraph('')],
						}),
					],
				}),
				new TableRow({
					children: [
						new TableCell({ children: [] }),
						new TableCell({ children: [] }),
						new TableCell({ children: [] }),
						new TableCell({ children: [] }),
						new TableCell({ children: [] }),
						new TableCell({ children: [] }),
					],
				}),
			],
		})

		const doc = new Document({
			sections: [
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
					children: [planTable],
				},
			],
		})
		const blob = await Packer.toBlob(doc)
		saveAs(
			blob,
			`Plan diario - ${this.#pretify(plan.subject)} - ${date}.docx`,
		)
	}
}
