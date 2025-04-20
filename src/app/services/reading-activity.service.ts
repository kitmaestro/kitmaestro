import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { ReadingActivity } from '../interfaces/reading-activity';
import { Observable } from 'rxjs';
import { ApiUpdateResponse } from '../interfaces/api-update-response';
import { ApiDeleteResponse } from '../interfaces/api-delete-response';
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
	private http = inject(HttpClient);
	private apiBaseUrl = environment.apiUrl + 'reading-activities/';
	private config = {
		withCredentials: true,
		headers: new HttpHeaders({
			'Content-Type': 'application/json',
			Authorization: 'Bearer ' + localStorage.getItem('access_token'),
		}),
	};

	findAll(): Observable<ReadingActivity[]> {
		return this.http.get<ReadingActivity[]>(this.apiBaseUrl, this.config);
	}

	find(id: string): Observable<ReadingActivity> {
		return this.http.get<ReadingActivity>(
			this.apiBaseUrl + id,
			this.config,
		);
	}

	create(plan: ReadingActivity): Observable<ReadingActivity> {
		return this.http.post<ReadingActivity>(
			this.apiBaseUrl,
			plan,
			this.config,
		);
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

	async download(activity: ReadingActivity) {
		const logo = await fetch(environment.apiUrl + 'logo-minerd');
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
									text: activity.section.school.name,
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
