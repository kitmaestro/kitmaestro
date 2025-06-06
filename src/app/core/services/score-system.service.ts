import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import {
	GradingActivity,
	GroupedGradingActivity,
	ScoreSystem,
} from '../interfaces/score-system';
import { ApiUpdateResponse } from '../interfaces/api-update-response';
import { ApiDeleteResponse } from '../interfaces/api-delete-response';
import { PretifyPipe } from '../../shared/pipes/pretify.pipe';
import {
	Table,
	WidthType,
	TableRow,
	TableCell,
	Paragraph,
	TextRun,
	PageOrientation,
	HeadingLevel,
	AlignmentType,
	Packer,
	Document,
} from 'docx';
import saveAs from 'file-saver';
import { Student } from '../interfaces/student';

@Injectable({
	providedIn: 'root',
})
export class ScoreSystemService {
	private http = inject(HttpClient);
	private apiBaseUrl = environment.apiUrl + 'score-systems/';
	private config = {
		withCredentials: true,
		headers: new HttpHeaders({
			'Content-Type': 'application/json',
			Authorization: 'Bearer ' + localStorage.getItem('access_token'),
		}),
	};

	findAll(): Observable<ScoreSystem[]> {
		return this.http.get<ScoreSystem[]>(this.apiBaseUrl, this.config);
	}

	find(id: string): Observable<ScoreSystem> {
		return this.http.get<ScoreSystem>(this.apiBaseUrl + id, this.config);
	}

	create(plan: any): Observable<ScoreSystem> {
		return this.http.post<ScoreSystem>(this.apiBaseUrl, plan, this.config);
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

	pretify(str: string) {
		return new PretifyPipe().transform(str);
	}

	groupByCompetence(
		gradingActivities: GradingActivity[],
	): GroupedGradingActivity[] {
		const grouped = gradingActivities.reduce((acc, activity) => {
			// Si ya existe un grupo con la misma competencia, añade la actividad al grupo
			const existingGroup = acc.find(
				(group) => group.competence === activity.competence,
			);

			if (existingGroup) {
				existingGroup.grading.push(activity);
				existingGroup.total += activity.points;
			} else {
				// Si no existe, crea un nuevo grupo para esta competencia
				acc.push({
					competence: activity.competence,
					grading: [activity],
					total: activity.points,
				});
			}

			return acc;
		}, [] as GroupedGradingActivity[]);

		return grouped;
	}

	async download(scoreSystem: ScoreSystem, students: Student[]) {
		const grouped = this.groupByCompetence(scoreSystem.activities);
		const gradingTable = new Table({
			width: {
				size: 100,
				type: WidthType.PERCENTAGE,
			},
			rows: [
				new TableRow({
					tableHeader: true,
					children: [
						new TableCell({
							children: [
								new Paragraph({
									children: [
										new TextRun({
											text: 'Competencia',
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
											text: 'Item o Actividad',
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
											text: 'Criterios de Evaluación',
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
											text: 'Puntuación',
											bold: true,
										}),
									],
								}),
							],
						}),
					],
				}),
				...grouped.flatMap((group) => {
					const rows = group.grading.map((activities, i) => {
						if (i === 0) {
							return new TableRow({
								children: [
									new TableCell({
										rowSpan: group.grading.length + 1,
										children: [
											new Paragraph(
												'Competencia ' +
													group.competence,
											),
										],
									}),
									new TableCell({
										children: [
											new Paragraph(
												`${activities.activity} (${activities.activityType})`,
											),
										],
									}),
									new TableCell({
										children: activities.criteria.map(
											(criterion) =>
												new Paragraph({
													text: '- ' + criterion,
												}),
										),
									}),
									new TableCell({
										children: [
											new Paragraph(
												`${activities.points} Puntos`,
											),
										],
									}),
								],
							});
						} else {
							return new TableRow({
								children: [
									new TableCell({
										children: [
											new Paragraph(
												`${activities.activity} (${activities.activityType})`,
											),
										],
									}),
									new TableCell({
										children: activities.criteria.map(
											(criterion) =>
												new Paragraph({
													text: '- ' + criterion,
												}),
										),
									}),
									new TableCell({
										children: [
											new Paragraph(
												`${activities.points} Puntos`,
											),
										],
									}),
								],
							});
						}
					});
					rows.push(
						new TableRow({
							children: [
								new TableCell({
									columnSpan: 2,
									children: [
										new Paragraph({
											children: [
												new TextRun({
													bold: true,
													text: 'Total',
												}),
											],
										}),
									],
								}),
								new TableCell({
									children: [
										new Paragraph(`${group.total} Puntos`),
									],
								}),
							],
						}),
					);
					return rows;
				}),
			],
		});
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
					children: [
						new Paragraph({
							children: [
								new TextRun({
									color: '#000000',
									text: scoreSystem.section.school.name,
								}),
							],
							heading: HeadingLevel.HEADING_1,
							alignment: AlignmentType.CENTER,
						}),
						new Paragraph({
							children: [
								new TextRun({
									color: '#000000',
									text:
										'Sistema de Calificación de ' +
										this.pretify(
											scoreSystem.content[0].subject,
										),
								}),
							],
							heading: HeadingLevel.HEADING_2,
							alignment: AlignmentType.CENTER,
						}),
						new Paragraph({
							children: [
								new TextRun({
									color: '#000000',
									text: `${scoreSystem.user.title}. ${scoreSystem.user.firstname} ${scoreSystem.user.lastname}`,
								}),
							],
							heading: HeadingLevel.HEADING_3,
							alignment: AlignmentType.CENTER,
						}),
						new Paragraph({
							children: [
								new TextRun({
									color: '#000000',
									text: scoreSystem.section.name,
								}),
							],
							heading: HeadingLevel.HEADING_3,
							alignment: AlignmentType.CENTER,
						}),
						new Paragraph({
							children: [
								new TextRun({
									color: '#000000',
									text: scoreSystem.content
										.flatMap((c) => c.title)
										.join(', '),
								}),
							],
							heading: HeadingLevel.HEADING_3,
							alignment: AlignmentType.CENTER,
						}),
						new Paragraph({
							children: [
								new TextRun({
									color: '#000000',
									text: `1. Esquema de Puntuación`,
								}),
							],
							heading: HeadingLevel.HEADING_4,
						}),
						gradingTable,
						...grouped.flatMap((group, i) => {
							return [
								new Paragraph(''),
								new Paragraph({
									text: `${i + 2}. Matríz de Ponderación ${i + 1}: Competencia ${group.competence}`,
									heading: HeadingLevel.HEADING_4,
								}),
								new Table({
									width: {
										size: 100,
										type: WidthType.PERCENTAGE,
									},
									rows: [
										new TableRow({
											children: [
												new TableCell({
													rowSpan: 2,
													children: [
														new Paragraph({
															children: [
																new TextRun({
																	bold: true,
																	text: 'No.',
																}),
															],
														}),
													],
												}),
												new TableCell({
													rowSpan: 2,
													children: [
														new Paragraph({
															children: [
																new TextRun({
																	bold: true,
																	text: 'Estudiante',
																}),
															],
														}),
													],
												}),
												new TableCell({
													columnSpan:
														group.grading.length,
													children: [
														new Paragraph({
															children: [
																new TextRun({
																	bold: true,
																	text: `Competencia ${group.competence}`,
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
																	bold: true,
																	text: 'Total',
																}),
															],
														}),
													],
												}),
											],
										}),
										new TableRow({
											children: [
												...group.grading.map(
													(grading) =>
														new TableCell({
															children: [
																new Paragraph(
																	`${grading.activity} (${grading.activityType})`,
																),
																new Paragraph({
																	children: [
																		new TextRun(
																			{
																				bold: true,
																				text: `${grading.points} Puntos`,
																			},
																		),
																	],
																}),
															],
														}),
												),
												new TableCell({
													children: [
														new Paragraph(
															`${group.total}`,
														),
													],
												}),
											],
										}),
										...students.flatMap(
											(student, i) =>
												new TableRow({
													children: [
														new TableCell({
															children: [
																new Paragraph(
																	`${i + 1}`,
																),
															],
														}),
														new TableCell({
															children: [
																new Paragraph(
																	`${student.firstname} ${student.lastname}`,
																),
															],
														}),
														...group.grading.map(
															() =>
																new TableCell({
																	children: [
																		new Paragraph(
																			'',
																		),
																	],
																}),
														),
														new TableCell({
															children: [
																new Paragraph(
																	'',
																),
															],
														}),
													],
												}),
										),
									],
								}),
							];
						}),
					],
				},
			],
		});
		const blob = await Packer.toBlob(doc);
		saveAs(
			blob,
			`${scoreSystem.content.flatMap((c) => c.title)[0]} - Sistema de Calificacion.docx`,
		);
	}
}
