import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { RecoveryPlan } from '../models';
import { ApiDeleteResponse } from '../interfaces';
import { ApiService } from './api.service';
import {
	Document,
	Packer,
	Paragraph,
	HeadingLevel,
	Table,
	TableRow,
	TableCell,
	WidthType,
	PageOrientation,
	TextRun,
} from 'docx';
import { saveAs } from 'file-saver';
import { PretifyPipe } from '../../shared/pipes/pretify.pipe';

type RecoveryPlanDto = Partial<RecoveryPlan>;

@Injectable({
	providedIn: 'root',
})
export class RecoveryPlanService {
	#apiService = inject(ApiService);
	#endpoint = 'recovery-plans/';
	#pretifyPipe = (new PretifyPipe()).transform;
	#formatDate = (date: string | Date) => (date instanceof Date ? date : new Date(date)).toLocaleDateString('es-ES', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
	});

	create(data: RecoveryPlanDto): Observable<RecoveryPlan> {
		return this.#apiService.post<RecoveryPlan>(this.#endpoint, data);
	}

	findAll(filters?: Record<string, any>): Observable<RecoveryPlan[]> {
		return this.#apiService.get<RecoveryPlan[]>(this.#endpoint, filters);
	}

	findOne(id: string): Observable<RecoveryPlan> {
		return this.#apiService.get<RecoveryPlan>(this.#endpoint + id);
	}

	update(
		id: string,
		data: RecoveryPlanDto,
	): Observable<RecoveryPlan> {
		return this.#apiService.patch<RecoveryPlan>(
			this.#endpoint + id,
			data,
		);
	}

	delete(id: string): Observable<ApiDeleteResponse> {
		return this.#apiService.delete<ApiDeleteResponse>(this.#endpoint + id);
	}

	#markdownCleanUp(str: string) {
		return str.replaceAll('**', '')
	}

	download(plan: RecoveryPlan) {
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
							text: `Plan de Recuperación del ${(plan.period + '').toUpperCase()} - ${this.#pretifyPipe(
								plan.subject,
							)}`,
							heading: HeadingLevel.TITLE,
						}),
						new Paragraph({
							text: 'Escuela',
							heading: HeadingLevel.HEADING_2,
						}),
						new Paragraph({ text: plan.user.schoolName }),
						new Paragraph({
							text: 'Docente',
							heading: HeadingLevel.HEADING_2,
						}),
						new Paragraph({ text: `${plan.user.title}. ${plan.user.firstname} ${plan.user.lastname}` }),
						new Paragraph({
							text: 'Sección',
							heading: HeadingLevel.HEADING_2,
						}),
						new Paragraph({ text: plan.section.name }),
						new Paragraph({
							text: 'Asignatura',
							heading: HeadingLevel.HEADING_2,
						}),
						new Paragraph({
							text: this.#pretifyPipe(plan.subject),
						}),
						new Paragraph({
							text: 'Periodo',
							heading: HeadingLevel.HEADING_2,
						}),
						new Paragraph({ text: (plan.period + '').toUpperCase() }),
						new Paragraph({
							text: 'Fecha de aplicación',
							heading: HeadingLevel.HEADING_2,
						}),
						new Paragraph({
							text: `Desde ${this.#formatDate(plan.startingDate)} hasta ${this.#formatDate(plan.endingDate)}`,
						}),
						new Paragraph({
							text: 'Diagnóstico',
							heading: HeadingLevel.HEADING_2,
						}),
						new Paragraph({ text: plan.diagnostic }),
						new Paragraph({
							text: 'Justificación',
							heading: HeadingLevel.HEADING_2,
						}),
						new Paragraph({ text: plan.justification }),
						new Paragraph({
							text: 'Estudiantes',
							heading: HeadingLevel.HEADING_2,
						}),
						...plan.students.map(
							(student) =>
								new Paragraph({
									text: `${student.firstname} ${student.lastname}`,
									bullet: { level: 0 },
								}),
						),
						new Paragraph({
							text: 'Objetivo General',
							heading: HeadingLevel.HEADING_2,
						}),
						new Paragraph({ text: plan.generalObjective }),
						new Paragraph({
							text: 'Objetivos Específicos',
							heading: HeadingLevel.HEADING_2,
						}),
						...plan.specificObjectives.map(
							(objective) =>
								new Paragraph({
									text: objective,
									bullet: { level: 0 },
								}),
						),
						new Paragraph({
							text: 'Competencias',
							heading: HeadingLevel.HEADING_2,
						}),
						...plan.competence.flatMap((competence) =>
							competence.criteria.map(
								(criterion) =>
									new Paragraph({
										text: criterion,
										bullet: { level: 0 },
									}),
							),
						),
						new Paragraph({
							text: 'Indicadores de Logro',
							heading: HeadingLevel.HEADING_2,
						}),
						...plan.achievementIndicators.map(
							(indicator) =>
								new Paragraph({
									text: indicator,
									bullet: { level: 0 },
								}),
						),
						new Paragraph({
							text: 'Actividades',
							heading: HeadingLevel.HEADING_2,
						}),
						this.createActivitiesTable(plan.activities),
						new Paragraph({
							text: 'Instrumentos de Evaluación',
							heading: HeadingLevel.HEADING_2,
						}),
						...plan.evalutionInstruments.map(
							(instrument) =>
								new Paragraph({
									text: this.#markdownCleanUp(instrument),
									bullet: { level: 0 },
								}),
						),
						new Paragraph({
							text: 'Criterios de Éxito',
							heading: HeadingLevel.HEADING_2,
						}),
						...plan.successCriteria.map(
							(criterion) =>
								new Paragraph({
									text: criterion,
									bullet: { level: 0 },
								}),
						),
						new Paragraph({
							text: 'Actores Involucrados',
							heading: HeadingLevel.HEADING_2,
						}),
						...plan.actors.map(
							(actor) =>
								new Paragraph({
									text: actor.toString(),
									bullet: { level: 0 },
								}),
						),
					],
				},
			],
		});

		Packer.toBlob(doc).then((blob) => {
			saveAs(blob, 'plan-de-recuperacion.docx');
		});
	}

	private createActivitiesTable(activities: any[]): Table {
		return new Table({
			width: { size: 100, type: WidthType.PERCENTAGE },
			rows: [
				new TableRow({
					children: [
						new TableCell({
							children: [new Paragraph({ children: [ new TextRun({ text: 'Nombre', bold: true }) ] })],
							width: { size: 15, type: WidthType.PERCENTAGE },
						}),
						new TableCell({
							children: [new Paragraph({ children: [ new TextRun({ text: 'Fecha', bold: true }) ] })],
							width: { size: 10, type: WidthType.PERCENTAGE },
						}),
						new TableCell({
							children: [new Paragraph({ children: [ new TextRun({ text: 'Descripción', bold: true }) ] })],
							width: { size: 25, type: WidthType.PERCENTAGE },
						}),
						new TableCell({
							children: [new Paragraph({ children: [ new TextRun({ text: 'Estrategias', bold: true }) ] })],
							width: { size: 20, type: WidthType.PERCENTAGE },
						}),
						new TableCell({
							children: [new Paragraph({ children: [ new TextRun({ text: 'Recursos', bold: true }) ] })],
							width: { size: 15, type: WidthType.PERCENTAGE },
						}),
						new TableCell({
							children: [new Paragraph({ children: [ new TextRun({ text: 'Evaluación Formativa', bold: true }) ] })],
							width: { size: 15, type: WidthType.PERCENTAGE },
						}),
					],
				}),
				...activities.map(
					(activity) =>
						new TableRow({
							children: [
								new TableCell({
									children: [new Paragraph(activity.title)],
								}),
								new TableCell({
									children: [
										new Paragraph(
											this.#formatDate(activity.date) || '',
										),
									],
								}),
								new TableCell({
									children: activity.activities.map(
										(el: string) => new Paragraph(this.#markdownCleanUp(el)),
									),
								}),
								new TableCell({
									children: activity.estrategies.map(
										(el: string) =>
											new Paragraph({
												text: el,
											}),
									),
								}),
								new TableCell({
									children: activity.resources.map(
										(el: string) =>
											new Paragraph({
												text: el,
											}),
									),
								}),
								new TableCell({
									children: [
										new Paragraph(
											activity.formativeEvaluation,
										),
									],
								}),
							],
						}),
				),
			],
		});
	}
}
