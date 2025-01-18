import { inject, Injectable } from '@angular/core';
import { ApiDeleteResponse } from '../interfaces/api-delete-response';
import { Observable } from 'rxjs';
import { ApiUpdateResponse } from '../interfaces/api-update-response';
import { Checklist } from '../interfaces/checklist';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AlignmentType, Document, HeadingLevel, Packer, PageOrientation, Paragraph, Table, TableCell, TableRow, TextRun, WidthType } from 'docx';
import { saveAs } from 'file-saver';
import { PretifyPipe } from '../pipes/pretify.pipe';

@Injectable({
  providedIn: 'root'
})
export class ChecklistService {
  private http = inject(HttpClient);
  private apiBaseUrl = environment.apiUrl + 'checklists/';
  private config = {
    withCredentials: true,
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
    }),
  };

  findAll(filters?: any): Observable<Checklist[]> {
    let params = new HttpParams();
    if (filters) {
      Object.keys(filters).forEach(key => {
        params = params.set(key, filters[key]);
      });
    }
    return this.http.get<Checklist[]>(this.apiBaseUrl, { ...this.config, params });
  }

  find(id: string): Observable<Checklist> {
    return this.http.get<Checklist>(this.apiBaseUrl + id, this.config);
  }

  create(idea: Checklist): Observable<Checklist> {
    return this.http.post<Checklist>(this.apiBaseUrl, idea, this.config);
  }

  update(id: string, idea: any): Observable<ApiUpdateResponse> {
    return this.http.patch<ApiUpdateResponse>(this.apiBaseUrl + id, idea, this.config);
  }

  delete(id: string): Observable<ApiDeleteResponse> {
    return this.http.delete<ApiDeleteResponse>(this.apiBaseUrl + id, this.config);
  }

  private pretify(str: string) {
    return (new PretifyPipe()).transform(str);
  }

  async download(list: Checklist) {
    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              size: {
                orientation: PageOrientation.PORTRAIT,
                height: '279mm',
                width: '216mm',
              }
            }
          },
          children: [
            new Paragraph({
              children: [
                new TextRun({ text: list.title, color: '#000000' })
              ],
              heading: HeadingLevel.HEADING_1,
              alignment: AlignmentType.CENTER,
            }),
            new Paragraph({
              children: [
                new TextRun({ text: list.activityType, color: '#000000' })
              ],
              heading: HeadingLevel.HEADING_2,
              alignment: AlignmentType.CENTER,
            }),
            new Paragraph({
              children: [
                new TextRun({ text: 'Lista de Cotejo', color: '#000000' })
              ],
              heading: HeadingLevel.HEADING_2,
              alignment: AlignmentType.CENTER,
            }),
            new Paragraph({
              children: [
                new TextRun({ text: 'Competencias Fundamentales', color: '#000000' })
              ],
              heading: HeadingLevel.HEADING_3,
            }),
            ...list.competence.flatMap(c => new Paragraph({ text: this.pretify(c.name), bullet: { level: 0 } })),
            new Paragraph({
              children: [
                new TextRun({ text: 'Competencias Específicas', color: '#000000' })
              ],
              heading: HeadingLevel.HEADING_3,
            }),
            ...list.competence.flatMap(c => c.entries).map(c => new Paragraph({ text: c, bullet: { level: 0 } })),
            new Paragraph({
              children: [
                new TextRun({ text: 'Indicadores de Logro', color: '#000000' })
              ],
              heading: HeadingLevel.HEADING_3,
            }),
            ...list.contentBlock.achievement_indicators.flatMap(c => new Paragraph({ text: c, bullet: { level: 0 } })),
            new Paragraph(''),
            new Paragraph({ children: [
              new TextRun({ text: 'Actividad o Evidencia', bold: true }),
              new TextRun(': ' + list.activity)
            ]}),
            new Paragraph(''),
            new Paragraph({
              children: [
                new TextRun({ text: 'Nombre', bold: true }),
                new TextRun(': ____________________________\t'),
                new TextRun({ text: 'Curso', bold: true, }),
                new TextRun(': ______________\t\t'),
                new TextRun({ text: 'Fecha', bold: true, }),
                new TextRun(': __________'),
              ]
            }),
            new Paragraph(''),
            new Table({
              width: {
                size: 100,
                type: WidthType.PERCENTAGE,
              },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      children: [
                        new Paragraph({ children: [ new TextRun({ text: 'Criterio de Evaluación', bold: true  }) ] }),
                      ],
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({ children: [ new TextRun({ text: 'Sí', bold: true  }) ] }),
                      ]
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({ children: [ new TextRun({ text: 'No', bold: true  }) ] }),
                      ]
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({ children: [ new TextRun({ text: 'Observaciones', bold: true  }) ] }),
                      ]
                    }),
                  ],
                  tableHeader: true,
                }),
                ...list.criteria.map(c => new TableRow({ children: [new TableCell({ children: [new Paragraph(c)] }), new TableCell({ children: [new Paragraph('')] }), new TableCell({ children: [new Paragraph('')] }), new TableCell({ children: [new Paragraph('')] }), ] }))
              ]
            }),
            new Paragraph(''),
          ]
        }
      ]
    });
    const blob = await Packer.toBlob(doc);
    saveAs(blob, 'Lista de cotejo ' + list.title + '.docx');
  }
}
