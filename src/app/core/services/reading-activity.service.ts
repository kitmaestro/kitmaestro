import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ReadingActivity } from '../models';
import { ApiDeleteResponse } from '../interfaces';
import { ApiService } from './api.service';
import {
	AlignmentType,
	Document,
	HeadingLevel,
	ImageRun,
	Packer,
	PageOrientation,
	Paragraph,
	TextRun,
} from 'docx';
import { saveAs } from 'file-saver';

@Injectable({
	providedIn: 'root',
})
export class ReadingActivityService {
	#apiService = inject(ApiService);
	#endpoint = 'reading-activities/';

	findAll(): Observable<ReadingActivity[]> {
		return this.#apiService.get<ReadingActivity[]>(this.#endpoint);
	}

	find(id: string): Observable<ReadingActivity> {
		return this.#apiService.get<ReadingActivity>(this.#endpoint + id);
	}

	create(plan: ReadingActivity): Observable<ReadingActivity> {
		return this.#apiService.post<ReadingActivity>(this.#endpoint, plan);
	}

	update(id: string, plan: any): Observable<ReadingActivity> {
		return this.#apiService.patch<ReadingActivity>(
			this.#endpoint + id,
			plan,
		);
	}

	delete(id: string): Observable<ApiDeleteResponse> {
		return this.#apiService.delete<ApiDeleteResponse>(this.#endpoint + id);
	}

	async download(activity: ReadingActivity) {
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
							children: [logoMinerd],
							alignment: AlignmentType.CENTER,
						}),
						new Paragraph({
							children: [
								new TextRun({
									color: '#000000',
									text: activity.user.schoolName,
								}),
							],
							heading: HeadingLevel.HEADING_1,
							alignment: AlignmentType.CENTER,
						}),
						new Paragraph({
							children: [
								new TextRun({
									color: '#000000',
									text: `${activity.section.name} | Año Escolar 2024-2025`,
								}),
							],
							heading: HeadingLevel.HEADING_3,
							alignment: AlignmentType.CENTER,
						}),
						new Paragraph({
							children: [
								new TextRun({
									color: '#000000',
									text: `${activity.user.title}. ${activity.user.firstname} ${activity.user.lastname}`,
								}),
							],
							heading: HeadingLevel.HEADING_2,
							alignment: AlignmentType.CENTER,
						}),
						new Paragraph({
							children: [
								new TextRun({
									color: '#000000',
									text: 'Actividad de Lectura Guiada',
								}),
							],
							heading: HeadingLevel.HEADING_3,
							alignment: AlignmentType.CENTER,
						}),
						new Paragraph(''),
						new Paragraph({
							children: [
								new TextRun({
									color: '#000000',
									text: 'Nombre: _____________________________________ Fecha: ____________________',
								}),
							],
							alignment: AlignmentType.CENTER,
						}),
						new Paragraph({
							children: [
								new TextRun({
									color: '#000000',
									text: 'Lee detenidamente el siguiente texto y responde las preguntas.',
								}),
							],
							heading: HeadingLevel.HEADING_3,
						}),
						new Paragraph({
							children: [
								new TextRun({
									color: '#000000',
									text: activity.title,
								}),
							],
							heading: HeadingLevel.HEADING_4,
						}),
						new Paragraph(activity.text),
						new Paragraph(''),
						new Paragraph({
							children: [
								new TextRun({ text: 'Responde:', bold: true }),
							],
						}),
						new Paragraph(''),
						...activity.questions.flatMap((q, i) => [
							new Paragraph({
								children: [
									new TextRun({
										text: i + 1 + q,
										bold: true,
									}),
								],
							}),
							new Paragraph(''),
						]),
					],
				},
			],
		});
		const blob = await Packer.toBlob(doc);
		saveAs(blob, `Lectura guiada - ${activity.title}.docx`);
	}
}
