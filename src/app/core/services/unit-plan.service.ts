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
	ShadingType,
	VerticalAlign,
} from 'docx';
import saveAs from 'file-saver';
import { PretifyPipe } from '../../shared/pipes';
import { ApiDeleteResponse } from '../interfaces';
import { ApiService } from './api.service';
import { User, ClassPlan, UnitPlan } from '../models';
import { UnitPlanDto } from '../../store/unit-plans/unit-plans.models';
import { MarkdownService } from 'ngx-markdown';
import { Store } from '@ngrx/store';
import { selectAuthUserSettings } from '../../store/auth/auth.selectors';

@Injectable({
	providedIn: 'root',
})
export class UnitPlanService {
	#markdown = inject(MarkdownService);
	#store = inject(Store);
	#apiService = inject(ApiService);
	#endpoint = 'unit-plans/';
	#pretify = new PretifyPipe().transform;
	settings = this.#store.selectSignal(selectAuthUserSettings);

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
			spacing: {
				before: 2,
				after: 2,
			}
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
			{ title: 'Competencias Fundamentales', content: plan.competence.map(c => this.#pretify(c.name)), list: true },
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
			{ title: 'Tiempo Asignado', content: `${plan.duration} Semana${plan.duration > 1 ? 's' : ''}` },
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
								text: this.#pretify(c.name, plan.section.level || 'PRIMARIA'),
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

	#createEmptyCell(columnSpan = 1, rowSpan = 1) {
		return new TableCell({
			children: [new Paragraph('')],
			columnSpan,
			rowSpan,
		})
	}

	#createCell(text: string, columnSpan = 1, rowSpan = 1) {
		return new TableCell({
			children: [new Paragraph({ children: [new TextRun({ text })] })],
			columnSpan,
			rowSpan,
		})
	}

	#createCellWithList(list: string[], columnSpan = 1, rowSpan = 1) {
		return new TableCell({
			children: list.map(item => new Paragraph({ children: [new TextRun({ text: `- ${item}` })] })),
			columnSpan,
			rowSpan,
		})
	}

	#createHeaderCell(text: string, columnSpan = 1, rowSpan = 1, center = false) {
		const settings = this.settings()
		const fill = (settings?.['preferredTemplateColor'] as string).slice(1) ?? '00b0ff';
		return new TableCell({
			children: [new Paragraph({ children: [new TextRun({ text, bold: true })], alignment: center ? AlignmentType.CENTER : AlignmentType.LEFT, spacing: { before: 2, after: 2 } })],
			columnSpan,
			rowSpan,
			verticalAlign: VerticalAlign.CENTER,
			shading: { fill, color: 'auto', type: ShadingType.CLEAR },
		})
	}

	#createUnitPlanV2(plan: UnitPlan, classPlans: ClassPlan[], user: User): ISectionOptions {
		const isPrimary = (plan.sections.length ? plan.sections[0] : plan.section).level === 'PRIMARIA'
		const compCat = isPrimary ? ['Comunicativa', 'Pensamiento Logico', 'Etica Y Ciudadana'] : ['Comunicativa', 'Pensamiento Logico', 'Resolucion De Problemas', 'Ciencia Y Tecnologia', 'Etica Y Ciudadana', 'Desarrollo Personal Y Espiritual', 'Ambiental Y De La Salud'];
		const unitPlanTable = new Table({
			width: {
				size: '100%',
				type: WidthType.PERCENTAGE,
			},
			columnWidths: [
				12.5,
				12.5,
				12.5,
				12.5,
				12.5,
				12.5,
				12.5,
				12.5,
			],
			rows: [
				//identification
				new TableRow({ children: [
					this.#createHeaderCell('Competencias Fundamentales', 1, 1, true),
					...(isPrimary ?
					compCat.map((c, i) => this.#createCell(this.#pretify(c), i === 1 ? 3 : 2)) :
					plan.competence.map((c) => this.#createCell(this.#pretify(c.name, 'SECUNDARIA'))))
				] }),
				new TableRow({ children: [
					this.#createHeaderCell('Competencias Específicas del Grado', 1, 1, true),
					...(isPrimary ?
						compCat.map((cat, i) => this.#createCellWithList(plan.competence.filter(e => e.name == cat).flatMap(c => c.entries), i === 1 ? 3 : 2)) :
						plan.competence.map((c) => this.#createCellWithList(c.entries)))
				] }),
				new TableRow({ children: [
					this.#createHeaderCell('Criterios de Evaluación', 1, 1, true),
					...(isPrimary ?
						compCat.map((cat, i) => this.#createCellWithList(plan.competence.filter(e => e.name == cat).flatMap(c => c.criteria), i === 1 ? 3 : 2)) :
						plan.competence.map((c) => this.#createCellWithList(c.criteria)))
				] }),
				new TableRow({
					children: [
						this.#createHeaderCell('Eje Transversal'),
						this.#createCell(`${plan.mainThemeCategory}: ${plan.mainThemes.flatMap(t => t.topics).join(', ')}`, 7),
					]
				}),
				new TableRow({
					children: [
						this.#createHeaderCell(`Área${plan.subjects.length > 1 ? 's' : ''} Articulada${plan.subjects.length > 1 ? 's' : ''}`),
						this.#createCellWithList(plan.subjects.map(s => this.#pretify(s)), 7),
					]
				}),
				new TableRow({
					children: [
						this.#createHeaderCell('Estrategias de Enseñanza y Aprendizaje'),
						this.#createCellWithList(plan.strategies, 7),
					]
				}),
				new TableRow({
					children: [
						this.#createHeaderCell('Situación de Aprendizaje'),
						this.#createCell(this.#markdownCleanUp(plan.learningSituation), 7),
					]
				}),
				new TableRow({
					children: [
						this.#createHeaderCell('Contenidos', 6, 1, true),
						this.#createHeaderCell('Criterios de evaluación', 1, 2, true),
						this.#createHeaderCell('Indicadores de Logro', 1, 2, true),
					]
				}),
				new TableRow({
					children: [
						this.#createHeaderCell('Conceptuales', 2, 1, true),
						this.#createHeaderCell('Procedimentales', 2, 1, true),
						this.#createHeaderCell('Actitudinales', 2, 1, true),
					]
				}),
				new TableRow({
					children: [
						this.#createCellWithList(plan.contents.flatMap(c => c.concepts), 2),
						this.#createCellWithList(plan.contents.flatMap(c => c.procedures), 2),
						this.#createCellWithList(plan.contents.flatMap(c => c.attitudes), 2),
						this.#createCellWithList(plan.competence.flatMap(c => c.criteria).filter((v, i, a) => a.indexOf(v) === i)),
						this.#createCellWithList(plan.contents.flatMap(c => c.achievement_indicators).filter((v, i, a) => a.indexOf(v) === i)),
					]
				}),
				new TableRow({
					children: [
						this.#createHeaderCell('Actividades (de enseñanza, de aprendizaje y de evaluación)', 6, 1, true),
						this.#createHeaderCell('Evaluación: Técnicas e instrumentos', 1, 1, true),
						this.#createHeaderCell('Medios y Recursos', 1, 1, true),
					]
				}),
				new TableRow({
					children: [
						new TableCell({ children: [
							new Paragraph({ children: [new TextRun({ text: 'De enseñanza', bold: true })] }),
							...plan.teacherActivities.flatMap(block => {
								return [
									new Paragraph({ children: plan.subjects.length == 1 ? [] : [new TextRun({ text: this.#pretify(block.subject), bold: true })] }),
									...block.activities.map(activity => new Paragraph({ text: '- ' + this.#markdownCleanUp(activity) }))
								]
							}),
							new Paragraph(''),
							new Paragraph({ children: [new TextRun({ text: 'De aprendizaje', bold: true })] }),
							...plan.studentActivities.flatMap(block => {
								return [
									new Paragraph({ children: plan.subjects.length == 1 ? [] : [new TextRun({ text: this.#pretify(block.subject), bold: true })] }),
									...block.activities.map(activity => new Paragraph({ text: '- ' + this.#markdownCleanUp(activity) }))
								]
							}),
							new Paragraph(''),
							new Paragraph({ children: [new TextRun({ text: 'De evaluación', bold: true })] }),
							...plan.evaluationActivities.flatMap(block => {
								return [
									new Paragraph({ children: plan.subjects.length == 1 ? [] : [new TextRun({ text: this.#pretify(block.subject), bold: true })] }),
									...block.activities.map(activity => new Paragraph({ text: '- ' + this.#markdownCleanUp(activity) }))
								]
							}),
						],
						columnSpan: 6,
					}),
					this.#createCellWithList(plan.instruments),
					this.#createCellWithList(plan.resources),
					]
				}),
			]
		})
		const classPlanTables: Table[] = []
		let sessionNumber = 1
		for (const classPlan of classPlans) {
			const date = new Date(classPlan.date).toISOString().split('T')[0].split('-').reverse().join('-')
			const classPlanTable = new Table({
				width: {
					size: '100%',
					type: WidthType.PERCENTAGE,
				},
				columnWidths: [20, 20, 20, 20, 20],
				rows: [
					new TableRow({
						children: [
							this.#createHeaderCell('#'),
							this.#createHeaderCell('Fecha: ' + date),
							this.#createHeaderCell('Área: ' + this.#pretify(classPlan.subject)),
							this.#createHeaderCell(`Docente: ${user.title}. ${user.firstname} ${user.lastname}`),
							this.#createHeaderCell('Grado y Sección: ' + classPlan.section.name),
						]
					}),
					new TableRow({
						children: [
							this.#createHeaderCell('Intención Pedagógica'),
							this.#createCell(classPlan.objective, 4),
						]
					}),
					new TableRow({
						children: [
							this.#createHeaderCell('Indicador de Logro'),
							this.#createCell(classPlan.achievementIndicator, 4),
						]
					}),
					new TableRow({
						children: [
							this.#createHeaderCell('Competencias específicas del grado ', 2),
							this.#createHeaderCell('Momentos/Actividades/Duración', 2),
							this.#createHeaderCell('Recursos'),
						]
					}),
					new TableRow({
						children: [
							this.#createCell(classPlan.competence, 2),
							new TableCell({
								children: [
									new Paragraph({ children: [new TextRun({ text: `Inicio (${classPlan.introduction.duration} minutos):`, bold: true })]}),
									...classPlan.introduction.activities.map((activity, i) => new Paragraph({ text: `Actividad ${i + 1}: ${this.#markdownCleanUp(activity)}` })),
									new Paragraph({ children: [new TextRun({ text: `Desarrollo (${classPlan.main.duration} minutos):`, bold: true })]}),
									...classPlan.main.activities.map((activity, i) => new Paragraph({ text: `Actividad ${i + 1}: ${this.#markdownCleanUp(activity)}` })),
									new Paragraph({ children: [new TextRun({ text: `Cierre (${classPlan.closing.duration} minutos):`, bold: true })]}),
									...classPlan.closing.activities.map((activity, i) => new Paragraph({ text: `Actividad ${i + 1}: ${this.#markdownCleanUp(activity)}` })),
								],
								columnSpan: 2,
							}),
							this.#createCellWithList([classPlan.introduction.resources, classPlan.main.resources, classPlan.closing.resources].flat()),
						]
					}),
				]
			})
			classPlanTables.push(classPlanTable)
			sessionNumber++
		}
		const section = {
			properties: this.#documentProperties(false),
			children: [
				unitPlanTable,
				new Paragraph(''),
				...classPlanTables.flatMap(t => [t, new Paragraph('')])
			]
		}
		return section
	}

	#createUnitPlanV1(plan: UnitPlan, classPlans: ClassPlan[], user: User): ISectionOptions {
		const isPrimary = (plan.sections.length ? plan.sections[0] : plan.section).level === 'PRIMARIA'
		const compCat = isPrimary ? ['Comunicativa', 'Pensamiento Logico', 'Etica Y Ciudadana'] : ['Comunicativa', 'Pensamiento Logico', 'Resolucion De Problemas', 'Ciencia Y Tecnologia', 'Etica Y Ciudadana', 'Desarrollo Personal Y Espiritual', 'Ambiental Y De La Salud'];
		const activityRows: TableRow[] = []
		if (classPlans.length) {
			const headers = new TableRow({
				children: [
					this.#createHeaderCell('Fecha'),
					this.#createHeaderCell('Actividades de Aprendizaje', 2),
					this.#createHeaderCell('Evidencia'),
					this.#createHeaderCell('Técnicas e Instrumentos de Evaluación'),
					this.#createHeaderCell('Metacognición'),
					this.#createHeaderCell('Recursos')
				]
			})
			activityRows.push(headers)
			for (const session of classPlans) {
				activityRows.push(new TableRow({
					children: [
						this.#createCell(new Date(session.date).toISOString().split('T')[0].split('-').reverse().join('-')),
						new TableCell({
							children: [
								new Paragraph({ children: [new TextRun({ text: 'Inicio', bold: true })] }),
								...session.introduction.activities.map(activity => new Paragraph({ text: `- ${activity}` })),
								new Paragraph({ children: [new TextRun({ text: 'Desarrollo', bold: true })] }),
								...session.main.activities.map(activity => new Paragraph({ text: `- ${activity}` })),
								new Paragraph({ children: [new TextRun({ text: 'Cierre', bold: true })] }),
								...session.closing.activities.map(activity => new Paragraph({ text: `- ${activity}` })),
							], columnSpan: 2,
						}),
						this.#createCell(''),
						this.#createCell(''),
						this.#createCellWithList([
							'¿Qué te aprendiste de este tema hoy?',
							'¿Qué tan importante es este tema a lo largo de sus vidas?',
							'¿Qué te pareció el tema del día de hoy?',
							'¿Cómo aprendí estos conocimientos?',
							'¿Cuál fue la parte que más te intereso?',
							'¿Como nos beneficiamos de los conocimientos aprendido hoy?',
							'¿En qué nos ayuda para convivir mejor este tema?'
						]),
						this.#createCellWithList(session.introduction.resources),
					]
				}))
			}
		} else {
			activityRows.push(new TableRow({ children: [
				this.#createHeaderCell('Actividades de Enseñanza', 2, 1, true),
				this.#createHeaderCell('Actividades de Aprendizaje', 3, 1, true),
				this.#createHeaderCell('Actividades de Evaluación', 2, 1, true)]
			}))
			activityRows.push(new TableRow({ children: [
				new TableCell({ children: plan.teacherActivities.flatMap(block => {
					return [
						new Paragraph({ children: [new TextRun({ text: this.#pretify(block.subject), bold: true })] }),
						...block.activities.map(activity => new Paragraph({ text: '- ' + this.#markdownCleanUp(activity) }))
					]
		 		}), columnSpan: 2 }),
				new TableCell({ children: plan.studentActivities.flatMap(block => {
					return [
						new Paragraph({ children: [new TextRun({ text: this.#pretify(block.subject), bold: true })] }),
						...block.activities.map(activity => new Paragraph({ text: '- ' + this.#markdownCleanUp(activity) }))
					]
		 		}), columnSpan: 3 }),
				new TableCell({ children: plan.evaluationActivities.flatMap(block => {
					return [
						new Paragraph({ children: [new TextRun({ text: this.#pretify(block.subject), bold: true })] }),
						...block.activities.map(activity => new Paragraph({ text: '- ' + this.#markdownCleanUp(activity) }))
					]
		 		}), columnSpan: 2 }),
			]}))
			activityRows.push(new TableRow({ children: [
				this.#createHeaderCell('Técnicas e Instrumentos de Evaluación', 5),
				this.#createHeaderCell('Medios y Recursos', 2)
			] }))
			activityRows.push(new TableRow({ children: [
				this.#createCellWithList(plan.instruments, 5),
				this.#createCellWithList(plan.resources, 2),
			] }))
		}
		const table = new Table({
			width: {
				size: '100%',
				type: WidthType.PERCENTAGE,
			},
			columnWidths: [
				100/7,
				100/7,
				100/7,
				100/7,
				100/7,
				100/7,
				100/7,
			],
			rows: [
				new TableRow({
					children: [
						this.#createHeaderCell('Centro Educativo'),
						this.#createCell(user.schoolName, 3),
						this.#createHeaderCell('Grado y Sección'),
						this.#createCell(plan.sections.length ? plan.sections.map(s => `${this.#pretify(s.year)} de ${this.#pretify(s.level)}`).join(', ') : plan.section.name, 2),
					]
				}),
				new TableRow({
					children: [
						this.#createHeaderCell('Docente'),
						this.#createCell(`${user.title}. ${user.firstname} ${user.lastname}`, 3),
						this.#createHeaderCell('Tiempo Asignado'),
						this.#createCell(`${plan.duration} Semana${plan.duration > 1 ? 's' : ''}`, 2),
					]
				}),
				new TableRow({
					children: [
						this.#createHeaderCell('Situación de Aprendizaje'),
						this.#createCell(this.#markdownCleanUp(plan.learningSituation), 6),
					]
				}),
				new TableRow({ children: [this.#createHeaderCell('Competencias Fundamentales', 7, 1, true)] }),
				new TableRow({ children: isPrimary ?
					compCat.map((c, i) => this.#createCell(this.#pretify(c), i === 1 ? 3 : 2)) :
					plan.competence.map((c) => this.#createCell(this.#pretify(c.name, 'SECUNDARIA')))
				}),
				new TableRow({ children: [this.#createHeaderCell('Competencias Específicas del Grado', 7, 1, true)] }),
				new TableRow({ children: isPrimary ?
					compCat.map((cat, i) => this.#createCellWithList(plan.competence.filter(e => e.name == cat).flatMap(c => c.entries), i === 1 ? 3 : 2)) :
					plan.competence.map((c) => this.#createCellWithList(c.entries))
				}),
				new TableRow({ children: [this.#createHeaderCell('Criterios de Evaluación', 7, 1, true)] }),
				new TableRow({ children: isPrimary ?
					compCat.map((cat, i) => this.#createCellWithList(plan.competence.filter(e => e.name == cat).flatMap(c => c.criteria), i === 1 ? 3 : 2)) :
					plan.competence.map((c) => this.#createCellWithList(c.criteria))
				}),
				new TableRow({
					children: [
						this.#createHeaderCell('Eje Transversal'),
						this.#createCell(`${plan.mainThemeCategory}: ${plan.mainThemes.flatMap(t => t.topics).join(', ')}`, 6),
					]
				}),
				new TableRow({
					children: [
						this.#createHeaderCell(`Área${plan.subjects.length > 1 ? 's' : ''} Curricular${plan.subjects.length > 1 ? 'es' : ''}`),
						this.#createCellWithList(plan.subjects.map(s => this.#pretify(s)), 6),
					]
				}),
				new TableRow({
					children: [
						this.#createHeaderCell('Estrategias de Enseñanza y Aprendizaje'),
						this.#createCellWithList(plan.strategies, 6),
					]
				}),
				new TableRow({
					children: [
						this.#createHeaderCell('Indicadores de Logro'),
						this.#createCellWithList(plan.contents.flatMap(c => c.achievement_indicators), 6),
					]
				}),
				new TableRow({ children: [this.#createHeaderCell('Contenidos', 7, 1, true)] }),
				new TableRow({ children: [
					this.#createHeaderCell('Conceptuales', 2, 1 ,true),
					this.#createHeaderCell('Procedimentales', 3, 1 ,true),
					this.#createHeaderCell('Actitudinales', 2, 1 ,true)
				] }),
				new TableRow({ children: [
					this.#createCellWithList(plan.contents.flatMap(c => c.concepts), 2),
					this.#createCellWithList(plan.contents.flatMap(c => c.procedures), 3),
					this.#createCellWithList(plan.contents.flatMap(c => c.attitudes), 2)
				] }),
				new TableRow({ children: [this.#createHeaderCell('Actividades', 7, 1, true)] }),
				...activityRows,
			]
		})
		const section = {
			properties: this.#documentProperties(false),
			children: [
				table
			]
		}
		return section
	}

	async download(plan: UnitPlan, classPlans: ClassPlan[] = [], user: User) {
		const settings = this.settings();
		if (!settings) return;
		const unitPlanTemplate = settings['preferredUnitPlanScheme'] || 'unitplan1';
		const classPlanTemplate = settings['preferredClassPlanScheme'] || 'classplan1';
		const logoMinerd = await this.fetchLogo();
		const config: { vertical: boolean, sections: ISectionOptions[] } = {
			vertical: false,
			sections: []
		}
		switch (unitPlanTemplate) {
			case 'unitplan1':
				config.sections = [
					this.#createUnitPlanV1(plan, classPlans, user),
				]
				break;
			case 'unitplan2':
				config.sections = [
					this.#createUnitPlanV2(plan, classPlans, user),
				]
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
