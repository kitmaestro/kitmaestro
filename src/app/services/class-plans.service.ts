import { inject, Injectable, isDevMode } from '@angular/core';
import { Observable } from 'rxjs';
import { ClassPlan } from '../interfaces/class-plan';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiUpdateResponse } from '../interfaces/api-update-response';
import { ApiDeleteResponse } from '../interfaces/api-delete-response';
import { environment } from '../../environments/environment';
import { Document, Packer, PageOrientation, Paragraph, Table, TableCell, TableRow, TextRun, WidthType } from 'docx';
import { saveAs } from 'file-saver';
import { PretifyPipe } from '../pipes/pretify.pipe';

@Injectable({
  providedIn: 'root'
})
export class ClassPlansService {
  private http = inject(HttpClient);
  private apiBaseUrl = environment.apiUrl + 'class-plans/';
  private config = {
    withCredentials: true,
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
    }),
  };
  private pretify = (new PretifyPipe()).transform;

  findAll(): Observable<ClassPlan[]> {
    return this.http.get<ClassPlan[]>(this.apiBaseUrl, this.config);
  }

  find(id: string): Observable<ClassPlan> {
    return this.http.get<ClassPlan>(this.apiBaseUrl + id, this.config);
  }

  addPlan(plan: ClassPlan): Observable<ClassPlan> {
    return this.http.post<ClassPlan>(this.apiBaseUrl, plan, this.config);
  }

  updatePlan(id: string, plan: any): Observable<ApiUpdateResponse> {
    return this.http.patch<ApiUpdateResponse>(this.apiBaseUrl + id, plan, this.config);
  }

  deletePlan(id: string): Observable<ApiDeleteResponse> {
    return this.http.delete<ApiDeleteResponse>(this.apiBaseUrl + id, this.config);
  }

  async download(plan: ClassPlan) {
    const date = new Date(plan.date).toISOString().split('T')[0].split('-').reverse().join('-');
    const planTable = new Table({
      width: {
        size: 100,
        type: WidthType.PERCENTAGE
      },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              columnSpan: 2,
              children: [
                new Paragraph({ children: [new TextRun({ text: "Centro Educativo:", bold: true })] })
              ]
            }),
            new TableCell({
              columnSpan: 4,
              children: [
                new Paragraph({ text: plan.section.school.name })
              ]
            }),
          ]
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({ children: [new TextRun({ text: "Grado:", bold: true })] })
              ]
            }),
            new TableCell({
              columnSpan: 2,
              children: [
                new Paragraph({ text: this.pretify(plan.section.year) + " de " + this.pretify(plan.section.level) })
              ]
            }),
            new TableCell({
              children: [
                new Paragraph({ children: [new TextRun({ text: "Área Curricular:", bold: true })] })
              ]
            }),
            new TableCell({
              columnSpan: 2,
              children: [
                new Paragraph({ text: this.pretify(plan.subject) })
              ]
            }),
          ]
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({ children: [new TextRun({ text: "Fecha:", bold: true })] })
              ]
            }),
            new TableCell({
              columnSpan: 2,
              children: [
                new Paragraph({ text: date })
              ]
            }),
            new TableCell({
              children: [
                new Paragraph({ children: [new TextRun({ text: "Docente:", bold: true })] })
              ]
            }),
            new TableCell({
              columnSpan: 2,
              children: [
                new Paragraph({ text: `${plan.user.title}. ${plan.user.firstname} ${plan.user.lastname}` })
              ]
            }),
          ]
        }),
        new TableRow({
          children: [
            new TableCell({
              columnSpan: 2,
              children: [
                new Paragraph({ children: [new TextRun({ text: "Estrategias y técnicas de enseñanza-aprendizaje:", bold: true })] })
              ]
            }),
            new TableCell({
              columnSpan: 4,
              children: [new Paragraph({ text: plan.strategies.join(', '), })],
            }),
          ]
        }),
        new TableRow({
          children: [
            new TableCell({
              columnSpan: 2,
              children: [
                new Paragraph({ children: [new TextRun({ text: "Intencion Pedagógica:", bold: true })] })
              ]
            }),
            new TableCell({
              columnSpan: 4,
              children: [new Paragraph({ text: plan.objective, })],
            }),
          ]
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Momento / Duración', bold: true })] })] }),
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Competencias Especificas', bold: true })] })] }),
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Actividades', bold: true })] })], columnSpan: 2 }),
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Organización de los Estudiantes', bold: true })] })] }),
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Recursos', bold: true })] })] }),
          ]
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Inicio ', bold: true }), new TextRun({ text: `(${plan.introduction.duration} minutos)` })] })] }),
            new TableCell({ children: [new Paragraph({ text: plan.competence })], rowSpan: 4 }),
            new TableCell({ children: plan.introduction.activities.map(activity => new Paragraph({ text: "- " + activity })), columnSpan: 2 }),
            new TableCell({ children: [new Paragraph({ text: plan.introduction.layout })] }),
            new TableCell({ children: plan.introduction.resources.map(res => new Paragraph({ text: "- " + res })) }),
          ]
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Desarrollo ', bold: true }), new TextRun({ text: `(${plan.main.duration} minutos)` })] })] }),
            new TableCell({ children: plan.main.activities.map(activity => new Paragraph({ text: "- " + activity })), columnSpan: 2 }),
            new TableCell({ children: [new Paragraph({ text: plan.main.layout })] }),
            new TableCell({ children: plan.main.resources.map(res => new Paragraph({ text: "- " + res })) }),
          ]
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Cierre ', bold: true }), new TextRun({ text: `(${plan.closing.duration} minutos)` })] })] }),
            new TableCell({ children: plan.closing.activities.map(activity => new Paragraph({ text: "- " + activity })), columnSpan: 2 }),
            new TableCell({ children: [new Paragraph({ text: plan.closing.layout })] }),
            new TableCell({ children: plan.closing.resources.map(res => new Paragraph({ text: "- " + res })) }),
          ]
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Actividades Complementarias', bold: true })] })] }),
            new TableCell({ children: plan.supplementary.activities.map(activity => new Paragraph({ text: "- " + activity })), columnSpan: 2 }),
            new TableCell({ children: [new Paragraph({ text: plan.supplementary.layout })] }),
            new TableCell({ children: plan.supplementary.resources.map(res => new Paragraph({ text: "- " + res })) }),
          ]
        }),
        new TableRow({
          children: [
            new TableCell({
              columnSpan: 2,
              children: [
                new Paragraph({ children: [new TextRun({ text: "Vocabulario del día/de la semana:", bold: true })] })
              ]
            }),
            new TableCell({
              columnSpan: 4,
              children: [new Paragraph(plan.vocabulary.join(', '))],
            }),
          ]
        }),
        new TableRow({
          children: [
            new TableCell({
              columnSpan: 2,
              children: [
                new Paragraph({ children: [new TextRun({ text: "Lecturas recomendadas/ o libro de la semana:", bold: true })] })
              ]
            }),
            new TableCell({
              columnSpan: 4,
              children: [new Paragraph(plan.readings)],
            }),
          ]
        }),
        new TableRow({
          children: [
            new TableCell({
              columnSpan: 2,
              children: [
                new Paragraph({ children: [new TextRun({ text: "Observaciones:", bold: true })] })
              ]
            }),
            new TableCell({
              columnSpan: 4,
              children: [new Paragraph('')],
            }),
          ]
        }),
        new TableRow({
          children: [
            new TableCell({ children: [] }),
            new TableCell({ children: [] }),
            new TableCell({ children: [] }),
            new TableCell({ children: [] }),
            new TableCell({ children: [] }),
            new TableCell({ children: [] }),
          ]
        }),
      ]
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
              }
            }
          },
          children: [
            planTable
          ]
        }
      ]
    })
    const blob = await Packer.toBlob(doc);
    saveAs(blob, `Plan diario - ${this.pretify(plan.subject)} - ${date}.docx`);
  }
}
