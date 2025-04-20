import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiDeleteResponse } from '../interfaces/api-delete-response';
import { ApiUpdateResponse } from '../interfaces/api-update-response';
import { Test } from '../interfaces/test';
import {
	Document,
	HeadingLevel,
	Packer,
	PageOrientation,
	Paragraph,
	Table,
	TableCell,
	TableRow,
	TextRun,
	WidthType,
} from 'docx';
import { saveAs } from 'file-saver';
import { PretifyPipe } from '../pipes/pretify.pipe';

@Injectable({
	providedIn: 'root',
})
export class TestService {
	private http = inject(HttpClient);
	private apiBaseUrl = environment.apiUrl + 'tests/';
	private config = {
		withCredentials: true,
		headers: new HttpHeaders({
			'Content-Type': 'application/json',
			Authorization: 'Bearer ' + localStorage.getItem('access_token'),
		}),
	};

	findAll(filters?: any): Observable<Test[]> {
		let params = new HttpParams();
		if (filters) {
			Object.keys(filters).forEach((key) => {
				params = params.set(key, filters[key]);
			});
		}
		return this.http.get<Test[]>(this.apiBaseUrl, {
			params,
			...this.config,
		});
	}

	find(id: string): Observable<Test> {
		return this.http.get<Test>(this.apiBaseUrl + id, this.config);
	}

	create(plan: any): Observable<Test> {
		return this.http.post<Test>(this.apiBaseUrl, plan, this.config);
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

	async download(test: Test) {
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
					children: test.body.split('\n').map((text) => {
						if (!text || text.startsWith('__')) return this.p('');

						if (text.startsWith('# '))
							return this.heading(text.slice(2));

						if (text.startsWith('## '))
							return this.heading(
								text.slice(3),
								HeadingLevel.HEADING_2,
							);

						if (text.startsWith('### '))
							return this.heading(
								text.slice(4),
								HeadingLevel.HEADING_3,
							);

						if (text.startsWith('#### '))
							return this.heading(
								text.slice(5),
								HeadingLevel.HEADING_4,
							);

						if (text.includes('**'))
							return this.p(text.slice(2), true);

						if (text.startsWith('|-'))
							return this.table(
								text.slice(1).replaceAll('-', ''),
							);

						if (text.startsWith('| '))
							return this.table(text.slice(1));

						return this.p(text);
					}),
				},
			],
		});
		const blob = await Packer.toBlob(doc);
		saveAs(
			blob,
			`Examen de ${this.pretify(test.subject)} de ${this.pretify(test.section.year)} de ${this.pretify(test.section.level)}.docx`,
		);
	}

	private pretify(str: string) {
		return new PretifyPipe().transform(str);
	}

	private heading(
		text: string,
		level: any = HeadingLevel.HEADING_1,
	): Paragraph {
		return new Paragraph({
			children: [
				new TextRun({
					color: '#000000',
					text,
				}),
			],
			heading: level,
		});
	}

	private table(text: string): Table {
		return new Table({
			width: {
				size: 100,
				type: WidthType.PERCENTAGE,
			},
			rows: text.split('|').map((s) => {
				return new TableRow({
					children: [new TableCell({ children: [this.p(s)] })],
				});
			}),
		});
	}

	private p(text: string, bold = false): Paragraph {
		if (bold) {
			const sections = text.split('**');
			return new Paragraph({
				children: sections.map((s, i) => {
					if (i === 0) return new TextRun({ text: s, bold: true });
					else return new TextRun({ text: s });
				}),
			});
		}
		return new Paragraph({ text });
	}
}
