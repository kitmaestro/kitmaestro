import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ClassPlansService } from '../../services/class-plans.service';
import { IsPremiumComponent } from '../../ui/alerts/is-premium/is-premium.component';
import { UserSettingsService } from '../../services/user-settings.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PdfService } from '../../services/pdf.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { tap } from 'rxjs';
import { Document, Packer, PageOrientation, Paragraph, Table, TableCell, TableRow, TextRun, WidthType } from 'docx';
import { ClassPlan } from '../../interfaces/class-plan';
import { saveAs } from 'file-saver';
import { PretifyPipe } from '../../pipes/pretify.pipe';

@Component({
    selector: 'app-class-plan-detail',
    imports: [
        RouterModule,
        CommonModule,
        IsPremiumComponent,
        MatSnackBarModule,
        MatCardModule,
        MatButtonModule,
    ],
    templateUrl: './class-plan-detail.component.html',
    styleUrl: './class-plan-detail.component.scss'
})
export class ClassPlanDetailComponent {
  route = inject(ActivatedRoute);
  router = inject(Router);
  planId = this.route.snapshot.paramMap.get('id') || '';
  classPlanService = inject(ClassPlansService);
  plan$ = this.classPlanService.find(this.planId).pipe(tap(_ => {this.plan = _; console.log(_)}));
  userSettingsService = inject(UserSettingsService);
  settings$ = this.userSettingsService.getSettings();
  sb = inject(MatSnackBar);
  pdfService = inject(PdfService);
  plan: ClassPlan | null = null;
  printing = false;

  pretify(str: string) {
    return (new PretifyPipe()).transform(str);
  }

  printPlan() {
    this.sb.open('La descarga empezara en un instante. No quites esta pantalla hasta que finalicen las descargas.', 'Ok', { duration: 3000 });
    this.plan$.subscribe(plan => {
      if (plan) {
        this.pdfService.createAndDownloadFromHTML('class-plan', `Plan de Clases ${plan.section.name} de ${plan.section.level.toLowerCase()} - ${this.pretify(plan.subject || '')}`, false);
      }
    });
  }

  async downloadPlan() {
    if (!this.plan) {
      this.sb.open('El plan no ha sido encontrado o cargado todavia', 'Ok', { duration: 2500 })
      return;
    }
    this.printing = true;
    const date = new Date(this.plan.date).toISOString().split('T')[0].split('-').reverse().join('-');
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
                new Paragraph({ text: this.plan.section.school.name })
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
                new Paragraph({ text: this.pretify(this.plan.section.year) + " de " + this.pretify(this.plan.section.level) })
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
                new Paragraph({ text: this.pretify(this.plan.subject) })
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
                new Paragraph({ text: `${this.plan.user.title}. ${this.plan.user.firstname} ${this.plan.user.lastname}` })
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
              children: [new Paragraph({ text: this.plan.strategies.join(', '), })],
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
              children: [new Paragraph({ text: this.plan.objective, })],
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
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Inicio ', bold: true }), new TextRun({ text: `(${this.plan.introduction.duration} minutos)` })] })] }),
            new TableCell({ children: [new Paragraph({ text: this.plan.competence })], rowSpan: 4 }),
            new TableCell({ children: this.plan.introduction.activities.map(activity => new Paragraph({ text: "- " + activity })), columnSpan: 2 }),
            new TableCell({ children: [new Paragraph({ text: this.plan.introduction.layout })] }),
            new TableCell({ children: this.plan.introduction.resources.map(res => new Paragraph({ text: "- " + res })) }),
          ]
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Desarrollo ', bold: true }), new TextRun({ text: `(${this.plan.main.duration} minutos)` })] })] }),
            new TableCell({ children: this.plan.main.activities.map(activity => new Paragraph({ text: "- " + activity })), columnSpan: 2 }),
            new TableCell({ children: [new Paragraph({ text: this.plan.main.layout })] }),
            new TableCell({ children: this.plan.main.resources.map(res => new Paragraph({ text: "- " + res })) }),
          ]
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Cierre ', bold: true }), new TextRun({ text: `(${this.plan.closing.duration} minutos)` })] })] }),
            new TableCell({ children: this.plan.closing.activities.map(activity => new Paragraph({ text: "- " + activity })), columnSpan: 2 }),
            new TableCell({ children: [new Paragraph({ text: this.plan.closing.layout })] }),
            new TableCell({ children: this.plan.closing.resources.map(res => new Paragraph({ text: "- " + res })) }),
          ]
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Actividades Complementarias', bold: true })] })] }),
            new TableCell({ children: this.plan.supplementary.activities.map(activity => new Paragraph({ text: "- " + activity })), columnSpan: 2 }),
            new TableCell({ children: [new Paragraph({ text: this.plan.supplementary.layout })] }),
            new TableCell({ children: this.plan.supplementary.resources.map(res => new Paragraph({ text: "- " + res })) }),
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
              children: [new Paragraph(this.plan.vocabulary.join(', '))],
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
              children: [new Paragraph(this.plan.readings)],
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

    const plan = new Document({
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
            new Paragraph({
              children: [
                planTable
              ]
            }),
          ]
        }
      ]
    })
    const blob = await Packer.toBlob(plan);
    saveAs(blob, `Plan diario - ${this.pretify(this.plan.subject)} - ${date}.docx`);
    this.printing = false;
  }

  deletePlan() {
    this.classPlanService.deletePlan(this.planId).subscribe(res => {
      if (res.deletedCount == 1) {
        this.router.navigate(['/class-plans']).then(() => {
          this.sb.open('Se ha eliminado el plan', 'Ok', { duration: 2500 });
        });
      }
    })
  }

  goBack() {
    window.history.back()
  }
}
