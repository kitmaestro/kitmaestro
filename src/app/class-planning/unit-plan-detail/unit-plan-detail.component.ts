import { Component, inject, OnInit } from '@angular/core';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { UnitPlanService } from '../../services/unit-plan.service';
import { Observable, tap } from 'rxjs';
import { UnitPlan } from '../../interfaces/unit-plan';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { IsPremiumComponent } from '../../ui/alerts/is-premium/is-premium.component';
import { UserSettingsService } from '../../services/user-settings.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PdfService } from '../../services/pdf.service';
import { UnitPlanComponent } from '../unit-plan/unit-plan.component';
import { AlignmentType, Document, HeadingLevel, ImageRun, Packer, PageOrientation, Paragraph, Table, TableCell, TableRow, TextRun, TextWrappingSide, TextWrappingType, WidthType } from 'docx';
import { saveAs } from 'file-saver';
import { PretifyPipe } from '../../pipes/pretify.pipe';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-unit-plan-detail',
  standalone: true,
  imports: [
    RouterModule,
    AsyncPipe,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    IsPremiumComponent,
    CommonModule,
    MatSnackBarModule,
    UnitPlanComponent,
  ],
  templateUrl: './unit-plan-detail.component.html',
  styleUrl: './unit-plan-detail.component.scss'
})
export class UnitPlanDetailComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private unitPlanService = inject(UnitPlanService);
  private userSettingsService = inject(UserSettingsService);
  private sb = inject(MatSnackBar);
  private pdfService = inject(PdfService);
  printing = false;
  planId = this.route.snapshot.paramMap.get('id') || '';
  plan: UnitPlan | null = null;

  plan$: Observable<UnitPlan> = this.unitPlanService.findOne(this.planId).pipe(tap(_ => {
    if (!_) {
      this.router.navigate(['/unit-plans/list']).then(() => {
        this.sb.open('Este plan no ha sido encontrado', 'Ok', { duration: 2500 });
      });
    } else {
      this.plan = _;
    }
  }));
  userSettings$ = this.userSettingsService.getSettings();

  isPrintView = window.location.href.includes('print');

  ngOnInit() {
    if (this.isPrintView) {
      setTimeout(() => {
        window.print()
      }, 2000);
    }
  }
  
  pretify(value: string): string {
    return new PretifyPipe().transform(value);
  }

  pretifyCompetence(value: string, level: string) {
    if (level == 'PRIMARIA') {
      if (value == 'Comunicativa') {
        return 'Comunicativa';
      }
      if (value.includes('Pensamiento')) {
        return 'Pensamiento Lógico Creativo y Crítico; Resolución de Problemas; Tecnológica y Científica';
      }
      if (value.includes('Ciudadana')) {
        return 'Ética Y Ciudadana; Desarrollo Personal y Espiritual; Ambiental y de la Salud';
      }
    } else {
      if (value == 'Comunicativa') {
        return 'Comunicativa';
      }
      if (value == 'Pensamiento Logico') {
        return 'Pensamiento Lógico, Creativo y Crítico';
      }
      if (value == 'Resolucion De Problemas') {
        return 'Resolución de Problemas';
      }
      if (value == 'Ciencia Y Tecnologia') {
        return 'Tecnológica y Científica';
      }
      if (value == 'Etica Y Ciudadana') {
        return 'Ética y Ciudadana';
      }
      if (value == 'Desarrollo Personal Y Espiritual') {
        return 'Desarrollo Personal y Espiritual';
      }
      if (value == 'Ambiental Y De La Salud') {
        return 'Ambiental y de la Salud';
      }
    }
    return value;
  }

  async download() {
    if (!this.plan)
      return;
    this.printing = true;
    this.sb.open('Tu descarga empezara en breve, espera un momento...', 'Ok', { duration: 2500 });
    // const response = await fetch(
    //   "https://api.algobook.info/v1/randomimage?category=education"
    // );
    // const img = await response.arrayBuffer();
    const logo = await fetch(environment.apiUrl + 'logo-minerd')
    const {data} = await logo.json();

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
        type: WidthType.PERCENTAGE
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
                      bold: true
                    })
                  ],
                  alignment: AlignmentType.CENTER,
                })
              ],
              columnSpan: 3,
            })
          ]
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({
                children: [
                    new TextRun({
                      text: 'Conceptuales',
                      bold: true
                    })
                  ]
              })]
            }),
            new TableCell({
              children: [new Paragraph({
                children: [
                    new TextRun({
                      text: 'Procedimentales',
                      bold: true
                    })
                  ]
              })]
            }),
            new TableCell({
              children: [new Paragraph({
                children: [
                    new TextRun({
                      text: 'Actitudinales',
                      bold: true
                    })
                  ]
              })]
            })
          ]
        }),
        new TableRow({
          children: [
            new TableCell({
              children: this.plan.contents.flatMap(block => block.concepts.map(concept => new Paragraph(concept)))
            }),
            new TableCell({
              children: this.plan.contents.flatMap(block => block.procedures.map(procedure => new Paragraph(procedure)))
            }),
            new TableCell({
              children: this.plan.contents.flatMap(block => block.attitudes.map(attitude => new Paragraph(attitude)))
            })
          ]
        })
      ]
    });
    const activitiesTable = new Table({
      width: {
        size: 100,
        type: WidthType.PERCENTAGE
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
                      bold: true
                    })
                  ],
                  alignment: AlignmentType.CENTER,
                })
              ],
              columnSpan: 3,
            })
          ]
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({
                children: [
                    new TextRun({
                      text: 'Actividades de Enseñanza',
                      bold: true
                    })
                  ]
              })]
            }),
            new TableCell({
              children: [new Paragraph({
                children: [
                    new TextRun({
                      text: 'Actividades de Aprendizaje',
                      bold: true
                    })
                  ]
              })]
            }),
            new TableCell({
              children: [new Paragraph({
                children: [
                    new TextRun({
                      text: 'Actividades de Evaluación',
                      bold: true
                    })
                  ]
              })]
            })
          ]
        }),
        new TableRow({
          children: [
            new TableCell({
              children: this.plan.teacherActivities.flatMap(block => block.activities.map(concept => new Paragraph(concept)))
            }),
            new TableCell({
              children: this.plan.contents.flatMap(block => block.procedures.map(procedure => new Paragraph(procedure)))
            }),
            new TableCell({
              children: this.plan.contents.flatMap(block => block.attitudes.map(attitude => new Paragraph(attitude)))
            })
          ]
        })
      ]
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
              }
            }
          },
          children: [
            new Paragraph({
              children: [
                logoMinerd
              ],
              alignment: AlignmentType.CENTER,
            }),
            new Paragraph({
              children: [
                new TextRun({
                  // color: '#000000',
                  text: this.plan.section.school.name,
                })
              ],
              heading: HeadingLevel.HEADING_1,
              alignment: AlignmentType.CENTER,
            }),
            new Paragraph({
              children: [
                new TextRun({
                  // color: '#000000',
                  text: "Año Escolar 2024 - 2025"
                })
              ],
              heading: HeadingLevel.HEADING_2,
              alignment: AlignmentType.CENTER,
            }),
            new Paragraph({
              children: [
                new TextRun({
                  // color: '#000000',
                  text: this.pretify(this.plan.section.year) + " de " + this.pretify(this.plan.section.level),
                })
              ],
              heading: HeadingLevel.HEADING_2,
              alignment: AlignmentType.CENTER,
            }),
            new Paragraph({
              children: [
                new TextRun({
                  // color: '#000000',
                  text: "Docente:"
                })
              ],
              heading: HeadingLevel.HEADING_2,
              alignment: AlignmentType.CENTER,
            }),
            new Paragraph({
              children: [
                new TextRun({
                  // color: '#000000',
                  text: `${this.plan.user.title}. ${this.plan.user.firstname} ${this.plan.user.lastname}`,
                })
              ],
              heading: HeadingLevel.HEADING_3,
              alignment: AlignmentType.CENTER,
            }),
            new Paragraph({
              children: [
                new TextRun({
                  // color: '#000000',
                  text: "Unidad de Aprendizaje"
                })
              ],
              heading: HeadingLevel.HEADING_2,
              alignment: AlignmentType.CENTER,
            }),
            new Paragraph({
              children: [
                new TextRun({
                  // color: '#000000',
                  text: '" ' + this.plan.title + ' "',
                })
              ],
              heading: HeadingLevel.HEADING_3,
              alignment: AlignmentType.CENTER,
            }),
            new Paragraph({
              children: [
                new TextRun({
                  // color: '#000000',
                  text: "Asignatura" + (this.plan.subjects.length > 1 ? "s:" : ":"),
                })
              ],
              heading: HeadingLevel.HEADING_2,
              alignment: AlignmentType.CENTER,
            }),
            new Paragraph({
              children: [
                new TextRun({
                  // color: '#000000',
                  text: this.plan.subjects.map((s, i, arr) => ((arr.length > 1 && i == arr.length - 1) ? "y " : "") + this.pretify(s)).join(", "),
                })
              ],
              heading: HeadingLevel.HEADING_3,
              alignment: AlignmentType.CENTER,
            }),
            new Paragraph({
              children: [
                new TextRun({
                  // color: '#000000',
                  text: "Eje Transversal:",
                })
              ],
              heading: HeadingLevel.HEADING_2,
              alignment: AlignmentType.CENTER,
            }),
            new Paragraph({
              children: [
                new TextRun({
                  // color: '#000000',
                  text: this.plan.mainThemeCategory,
                })
              ],
              heading: HeadingLevel.HEADING_3,
              alignment: AlignmentType.CENTER,
            }),
            new Paragraph({
              children: [
                new TextRun({
                  // color: '#000000',
                  text: "Duración Aproximada:",
                })
              ],
              heading: HeadingLevel.HEADING_2,
              alignment: AlignmentType.CENTER,
            }),
            new Paragraph({
              children: [
                new TextRun({
                  // color: '#000000',
                  text: this.plan.duration + " Semanas",
                })
              ],
              heading: HeadingLevel.HEADING_3,
              alignment: AlignmentType.CENTER,
            }),
          ]
        },
        // body
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
                new TextRun({
                  text: "Situación de Aprendizaje"
                })
              ],
              heading: HeadingLevel.HEADING_3
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: this.plan.learningSituation
                })
              ],
            }),
            new Paragraph({ text: "Competencias Fundamentales", heading: HeadingLevel.HEADING_3 }),
            ...this.plan.competence.map(c => new Paragraph({
              text: this.pretifyCompetence(c.name, this.plan?.section.level || 'PRIMARIA'),
              bullet: {
                level: 0
              }
            })),
            new Paragraph({ text: "Competencias Específicas del Grado", heading: HeadingLevel.HEADING_3 }),
            ...this.plan.competence.flatMap(c => c.entries.map(entry => new Paragraph({
              text: entry,
              bullet: {
                level: 0
              }
            }))),
            new Paragraph({ text: "Criterios de Evaluación", heading: HeadingLevel.HEADING_3 }),
            ...this.plan.competence.flatMap(c => c.criteria.map(entry => new Paragraph({
              text: entry,
              bullet: {
                level: 0
              }
            }))),
            new Paragraph({ text: (this.plan.subjects.length > 1 ? "Ejes Transversales: " : "Eje Transversal: ") + this.plan.mainThemeCategory, heading: HeadingLevel.HEADING_3 }),
            ...this.plan.mainThemes.flatMap(theme => theme.topics.map(entry => new Paragraph({
              text: entry,
              bullet: {
                level: 0
              }
            }))),
            new Paragraph({ text: (this.plan.subjects.length > 1 ? "Asignaturas" : "Asignatura"), heading: HeadingLevel.HEADING_3 }),
            ...this.plan.subjects.flatMap(subject => new Paragraph({
              text: this.pretify(subject),
              bullet: {
                level: 0
              }
            })),
            new Paragraph({ text: "Estrategias de Enseñanza y Aprendizaje", heading: HeadingLevel.HEADING_3 }),
            ...this.plan.strategies.flatMap(strategy => new Paragraph({
              text: strategy,
              bullet: {
                level: 0
              }
            })),
            new Paragraph({ text: "Indicadores de Logro", heading: HeadingLevel.HEADING_3 }),
            ...this.plan.contents.flatMap(content => content.achievement_indicators.map(indicator => new Paragraph({
              text: indicator,
              bullet: {
                level: 0
              }
            }))),
            new Paragraph(''),
            contentsTable,
            new Paragraph(''),
            activitiesTable,
            new Paragraph(''),
            new Paragraph({
              text: "Técnicas e Instrumentos de Evaluación",
              heading: HeadingLevel.HEADING_3
            }),
            ...this.plan.instruments.map(instrument => new Paragraph({ text: instrument, bullet: { level: 0 }})),
            new Paragraph({
              text: "Medios y Recursos",
              heading: HeadingLevel.HEADING_3
            }),
            ...this.plan.resources.map(resource => new Paragraph({ text: resource, bullet: { level: 0 } })),
          ]
        }
      ]
    });
    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${this.plan.title}.docx`);
    this.printing = false;
  }

  indicators(plan: UnitPlan) {
    return plan.contents.map(c => ({achievement_indicators: c.achievement_indicators, subject: c.subject}))
  }

  goBack() {
    window.history.back();
  }

  pretifySubject(subject: string) {
    if (subject == 'LENGUA_ESPANOLA') {
      return 'Lengua Española';
    }
    if (subject == 'MATEMATICA') {
      return 'Matemática';
    }
    if (subject == 'CIENCIAS_SOCIALES') {
      return 'Ciencias Sociales';
    }
    if (subject == 'CIENCIAS_NATURALES') {
      return 'Ciencias de la Naturaleza';
    }
    if (subject == 'INGLES') {
      return 'Inglés';
    }
    if (subject == 'FRANCES') {
      return 'Francés';
    }
    if (subject == 'FORMACION_HUMANA') {
      return 'Formación Integral Humana y Religiosa';
    }
    if (subject == 'EDUCACION_FISICA') {
      return 'Educación Física';
    }
    if (subject == 'EDUCACION_ARTISTICA') {
      return 'Educación Artística';
    }
    return 'Talleres Optativos';
  }

  printPlan() {
    this.sb.open('Estamos exportando tu plan. No te muevas!', 'Ok', { duration: 2500 })
    this.pdfService.exportToPdf('table', 'Unidad de Aprendizaje ' + this.route.snapshot.paramMap.get('id'), false);
  }

  deletePlan() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.unitPlanService.delete(id).subscribe((result) => {
        if (result.deletedCount == 1) {
          this.router.navigate(['/unit-plans']).then(() => {
            this.sb.open('El plan ha sido eliminado.', 'Ok', { duration: 2500 });
          })
        }
      });
    } else {
      this.sb.open('No se puede eliminar el plan. Se produjo un error.', 'Ok', { duration: 2500 });
    }
  }
}
