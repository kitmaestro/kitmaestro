import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, isDevMode } from '@angular/core';
import { UnitPlan } from '../interfaces/unit-plan';
import { Observable } from 'rxjs';
import { ApiUpdateResponse } from '../interfaces/api-update-response';
import { ApiDeleteResponse } from '../interfaces/api-delete-response';
import { environment } from '../../environments/environment';
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
} from 'docx';
import saveAs from 'file-saver';
import { PretifyPipe } from '../pipes/pretify.pipe';

@Injectable({
	providedIn: 'root',
})
export class UnitPlanService {
	private http = inject(HttpClient);
	private apiBaseUrl = environment.apiUrl + 'unit-plans/';
	private config = {
		withCredentials: true,
		headers: new HttpHeaders({
			'Content-Type': 'application/json',
			Authorization: 'Bearer ' + localStorage.getItem('access_token'),
		}),
	};

	findAll(): Observable<UnitPlan[]> {
		return this.http.get<UnitPlan[]>(this.apiBaseUrl, this.config);
	}

	findOne(id: string): Observable<UnitPlan> {
		return this.http.get<UnitPlan>(this.apiBaseUrl + id, this.config);
	}

	create(plan: any): Observable<UnitPlan> {
		return this.http.post<UnitPlan>(this.apiBaseUrl, plan, this.config);
	}

	update(id: string, plan: any): Observable<ApiUpdateResponse> {
		return this.http.patch<ApiUpdateResponse>(
			this.apiBaseUrl + id,
			plan,
			this.config,
		);
	}

	delete(id: string): Observable<ApiDeleteResponse> {
		return this.http.delete<ApiDeleteResponse>(
			this.apiBaseUrl + id,
			this.config,
		);
	}

	private pretify(str: string) {
		return new PretifyPipe().transform(str);
	}

	private pretifyCompetence(value: string, level: string) {
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

	async download(plan: UnitPlan) {
		const logo = await fetch(environment.apiUrl + 'logo-minerd');
		const { data } = await logo.json();

		const logoMinerd = new ImageRun({
			type: 'png',
			data,
			transformation: {
				width: 300,
				height: 233,
			},
			// floating: {
			//   horizontalPosition: {
			//     align: 'center'
			//   },
			//   verticalPosition: {
			//     align: 'inside'
			//   },
			//   wrap: {
			//     type: TextWrappingType.TOP_AND_BOTTOM,
			//     side: TextWrappingSide.BOTH_SIDES,
			//   },
			// }
		});
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
			],
		});
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
									text: plan.section.school.name,
								}),
							],
							heading: HeadingLevel.HEADING_1,
							alignment: AlignmentType.CENTER,
						}),
						new Paragraph({
							children: [
								new TextRun({
									// color: '#000000',
									text: 'Año Escolar 2024 - 2025',
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
										this.pretify(plan.section.year) +
										' de ' +
										this.pretify(plan.section.level),
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
													: '') + this.pretify(s),
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
									text: this.pretifyCompetence(
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
									text: this.pretify(subject),
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
		});
		const blob = await Packer.toBlob(doc);
		saveAs(blob, `${plan.title}.docx`);
	}
}
