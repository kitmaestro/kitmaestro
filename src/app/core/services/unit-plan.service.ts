import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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
	ISectionOptions,
} from 'docx';
import saveAs from 'file-saver';
import { PretifyPipe } from '../../shared/pipes';
import { ApiDeleteResponse } from '../interfaces';
import { ApiService } from './api.service';
import { User, ClassPlan, UnitPlan } from '../models';
import { UnitPlanDto } from '../../store/unit-plans/unit-plans.models';
import { MarkdownService } from 'ngx-markdown';

@Injectable({
	providedIn: 'root',
})
export class UnitPlanService {
	#markdown = inject(MarkdownService);
	#apiService = inject(ApiService);
	#endpoint = 'unit-plans/';
	#pretify = new PretifyPipe().transform;

	countPlans(): Observable<{ plans: number }> {
		return this.#apiService.get<{ plans: number }>(
			this.#endpoint + 'count',
		);
	}

	findAll(filters?: any): Observable<UnitPlan[]> {
		return this.#apiService.get<UnitPlan[]>(this.#endpoint, filters);
	}

	findOne(id: string): Observable<UnitPlan> {
		return this.#apiService.get<UnitPlan>(this.#endpoint + id);
	}

	create(plan: Partial<UnitPlanDto>): Observable<UnitPlan> {
		return this.#apiService.post<UnitPlan>(this.#endpoint, plan);
	}

	update(id: string, plan: Partial<UnitPlanDto>): Observable<UnitPlan> {
		return this.#apiService.patch<UnitPlan>(this.#endpoint + id, plan);
	}

	delete(id: string): Observable<ApiDeleteResponse> {
		return this.#apiService.delete<ApiDeleteResponse>(this.#endpoint + id);
	}

	#pretifyCompetence(value: string, level: string) {
		if (level === 'PRIMARIA') {
			if (value === 'Comunicativa') {
				return 'Comunicativa';
			}
			if (value.includes('Pensamiento')) {
				return 'Pensamiento Lógico Creativo y Crítico; Resolución de Problemas; Tecnológica y Científica';
			}
			if (value.includes('Ciudadana')) {
				return 'Ética Y Ciudadana; Desarrollo Personal y Espiritual; Ambiental y de la Salud';
			}
		} else {
			if (value === 'Comunicativa') {
				return 'Comunicativa';
			}
			if (value === 'Pensamiento Logico') {
				return 'Pensamiento Lógico, Creativo y Crítico';
			}
			if (value === 'Resolucion De Problemas') {
				return 'Resolución de Problemas';
			}
			if (value === 'Ciencia Y Tecnologia') {
				return 'Tecnológica y Científica';
			}
			if (value === 'Etica Y Ciudadana') {
				return 'Ética y Ciudadana';
			}
			if (value === 'Desarrollo Personal Y Espiritual') {
				return 'Desarrollo Personal y Espiritual';
			}
			if (value === 'Ambiental Y De La Salud') {
				return 'Ambiental y de la Salud';
			}
		}
		return value;
	}

	private async fetchLogo(): Promise<ImageRun> {
		const logo = await fetch(this.#apiService.getApiUrl() + 'logo-minerd');
		const { data } = await logo.json();

		const logoMinerd = new ImageRun({
			type: 'png',
			data,
			transformation: {
				width: 300,
				height: 233,
			},
		});

		return logoMinerd
	}

	#documentProperties(vertical: boolean): any {
		if (vertical) {
			return {
				page: {
					size: {
						orientation: PageOrientation.PORTRAIT,
						height: '279mm',
						width: '216mm',
					},
				},
			}
		} else {
			return {
				page: {
					size: {
						orientation: PageOrientation.LANDSCAPE,
						height: '279mm',
						width: '216mm',
					},
				},
			}
		}
	}

	#createHeader(level: 1 | 2 | 3 | 4, text: string, center = true) {
		const children = [new TextRun({ text })];
		const alignment = center ? AlignmentType.CENTER : AlignmentType.LEFT;
		let heading: any = null
		switch (level) {
			case 1:
				heading = HeadingLevel.HEADING_1;
				break;
			case 2:
				heading = HeadingLevel.HEADING_2;
				break;
			case 3:
				heading = HeadingLevel.HEADING_3;
				break;
			case 4:
				heading = HeadingLevel.HEADING_4;
				break;
			default:
				heading = HeadingLevel.HEADING_1;
				break;
		}
		return new Paragraph({
			children,
			heading,
			alignment,
		})
	}

	#createPresentationSheet(plan: UnitPlan, user: User, logo: ImageRun): ISectionOptions {
		const subjects = plan.subjects.map((s, i, arr) => (arr.length > 1 && i === arr.length - 1 ? 'y ' : '') + this.#pretify(s)).join(', ')
		const sections = plan.sections.length > 0 ? plan.sections.map(section => section.name).join(', ') : this.#pretify(plan.section.year) + ' de ' + this.#pretify(plan.section.level)
		return {
			properties: this.#documentProperties(true),
			children: [
				new Paragraph({ children: [logo], alignment: AlignmentType.CENTER }),
				this.#createHeader(1, user.schoolName),
				this.#createHeader(2, 'Año Escolar 2025 - 2026'),
				this.#createHeader(2, sections),
				this.#createHeader(2, 'Docente:'),
				this.#createHeader(3, `${plan.user.title}. ${plan.user.firstname} ${plan.user.lastname}`),
				this.#createHeader(2, 'Unidad de Aprendizaje'),
				this.#createHeader(3, '" ' + plan.title + ' "'),
				this.#createHeader(2, 'Asignatura' + (plan.subjects.length > 1 ? 's:' : ':')),
				this.#createHeader(3, subjects),
				this.#createHeader(2, 'Eje Transversal:'),
				this.#createHeader(3, plan.mainThemeCategory),
				this.#createHeader(2, 'Duración Aproximada:'),
				this.#createHeader(3, plan.duration + ' Semanas'),
			],
		}
	}

	#markdownCleanUp(str: string) {
		return str.replaceAll('**', '')
	}

	#createTablelessPlanContent(plan: UnitPlan, classPlans: ClassPlan[]): ISectionOptions {
		const classPlanSections: { title: string, list?: boolean, content: string | string[] }[] = classPlans.length > 0 ? [
			{ title: 'Secuencia Didactica', content: [] },
			...classPlans.map((cp, index) => ({
				title: 'Clase #' + (index + 1),
				content: [
					'Fecha: ' + (new Date(cp.date).toISOString().split('T')[0].split('-').reverse().join('-')),
					'Intención pedagógica:',
					cp.objective,
					'Competencia Específica:',
					cp.competence,
					'Actividades de Enseñanza',
					'Inicio:',
					...cp.introduction.activities.map(this.#markdownCleanUp).map(s => '- ' + s),
					'Desarrollo:',
					...cp.main.activities.map(this.#markdownCleanUp).map(s => '- ' + s),
					'Cierre:',
					...cp.closing.activities.map(this.#markdownCleanUp).map(s => '- ' + s),
					'Recursos:',
					...[cp.introduction.resources, cp.main.resources, cp.closing.resources].flat().filter((r, i, arr) => arr.indexOf(r) === i),
				]
			}))
		] :[
			{ title: 'Actividades de Enseñanza', content: [] },
			...plan.teacherActivities.map(a => ({ title: this.#pretify(a.subject), list: true, content: a.activities.map(this.#markdownCleanUp) })),
			{ title: 'Actividades de Aprendizaje', content: [] },
			...plan.studentActivities.map(a => ({ title: this.#pretify(a.subject), list: true, content: a.activities.map(this.#markdownCleanUp) })),
			{ title: 'Actividades de Evaluación', content: [] },
			...plan.evaluationActivities.map(a => ({ title: this.#pretify(a.subject), list: true, content: a.activities.map(this.#markdownCleanUp) })),
		]
		const sections: { title: string, list?: boolean, content: string | string[] }[] = [
			{ title: 'Situación de Aprendizaje', content: this.#markdownCleanUp(plan.learningSituation) },
			{ title: 'Competencias Fundamentales', content: plan.competence.map(c => c.name), list: true },
			{ title: 'Competencias Específicas del Grado', content: plan.competence.flatMap(c => c.entries), list: true },
			{ title: 'Criterios de Evaluación', content: plan.competence.flatMap(c => c.criteria), list: true },
			{ title: 'Eje transversal: ' + plan.mainThemeCategory, content: plan.mainThemes.flatMap(t => t.topics) },
			{ title: 'Asignaturas', content: plan.subjects.map(s => this.#pretify(s)), list: true },
			{ title: 'Estrategias de Enseñanza-Aprendizaje', content: plan.strategies, list: true },
			{ title: 'Indicadores de Logro', content: plan.contents.flatMap(c => c.achievement_indicators), list: true },
			{ title: 'Contenidos', content: [] },
			{ title: 'Conceptuales', content: plan.contents.flatMap(c => c.concepts), list: true },
			{ title: 'Procedimentales', content: plan.contents.flatMap(c => c.procedures), list: true },
			{ title: 'Actitudinales', content: plan.contents.flatMap(c => c.attitudes), list: true },
			...classPlanSections,
			{ title: 'Instrumentos De Evaluación', content: plan.instruments, list: true },
			{ title: 'Recursos', content: plan.resources, list: true },
			{ title: 'Tiempo Asignado', content: `${plan.duration} Semanas` },
		]

		return {
			properties: this.#documentProperties(true),
			children: sections.flatMap(section => {
				const title = this.#createHeader(section.title == 'Secuencia Didactica' ? 2 : 3, section.title, false)
				if (Array.isArray(section.content)) {
					return [title, ...section.content.map(c => new Paragraph({ children: [new TextRun({ text: c, bold: ['Intención pedagógica:', 'Competencia Específica:', 'Actividades de Enseñanza', 'Inicio:', 'Desarrollo:', 'Cierre:', 'Recursos:'].includes(c) || c.startsWith('Fecha:') })], bullet: section.list ? { level: 0 } : undefined }))]
				}
				return [title, new Paragraph({ children: [new TextRun({ text: section.content })] })]
			})
		}
	}

	#createSection(plan: UnitPlan) {
		return [
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
					// contentsTable,
					new Paragraph(''),
					// activitiesTable,
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
		]
	}

	async download(plan: UnitPlan, classPlans: ClassPlan[] = [], user: User, unitPlanTemplate: 'unitplan1' | 'unitplan2' | 'unitplan3' = 'unitplan3', classPlanTemplate: 'classplan1' | 'classplan2' = 'classplan1') {
		const logoMinerd = await this.fetchLogo();
		const config: { vertical: boolean, sections: ISectionOptions[] } = {
			vertical: false,
			sections: []
		}
		switch (unitPlanTemplate) {
			case 'unitplan1':
				break;
			case 'unitplan2':
				break;
			case 'unitplan3':
				config.vertical = true;
				config.sections = [
					this.#createPresentationSheet(plan, user, logoMinerd),
					this.#createTablelessPlanContent(plan, classPlans),
				];
				break;
			default:
				break;
		}
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
		});
		const activityRows: TableRow[] = [];
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
			);
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
					});
				}),
			);
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
			);
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
			);
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
		});
		const doc = new Document({
			sections: config.sections,
		});
		const blob = await Packer.toBlob(doc);
		saveAs(blob, `${plan.title}.docx`);
	}
}
