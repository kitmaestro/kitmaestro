import { Component, inject, OnInit, OnDestroy } from '@angular/core'
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatStepperModule } from '@angular/material/stepper'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatSelectModule } from '@angular/material/select'
import { MatInputModule } from '@angular/material/input'
import { MatChipsModule } from '@angular/material/chips'
import { MatTableModule } from '@angular/material/table'
import { AiService } from '../../../core/services/ai.service'
import { Router, RouterModule } from '@angular/router'
import { Subject } from 'rxjs'
import { Store } from '@ngrx/store'
import { selectAuthUser } from '../../../store/auth/auth.selectors'
import { selectAllClassSections } from '../../../store/class-sections/class-sections.selectors'
import { loadSections } from '../../../store/class-sections/class-sections.actions'
import { saveAs } from 'file-saver'
import { Document, Packer, Paragraph, Table, TableCell, TableRow, WidthType } from 'docx'
import { loadPlans, selectAllUnitPlans } from '../../../store'

interface EvaluationPlan {
    user: string
    section: string
    title: string
    fundamentalCompetences: FundamentalCompetence[]
    evaluationAreas: EvaluationArea[]
    createdAt: Date
}

interface FundamentalCompetence {
    name: string
    specificCompetences: string[]
}

interface EvaluationArea {
    curricularArea: string
    grade: string
    evaluationTypes: string[]
    evaluationParticipants: string[]
    competenceAspects: CompetenceAspect[]
}

interface CompetenceAspect {
    aspect: string
    indicators: string[]
    criteria: string[]
    evidences: Evidence[]
}

interface Evidence {
    description: string
    weighting: number
    instrument: string
}

@Component({
    selector: 'app-evaluation-plan-generator',
    imports: [
        ReactiveFormsModule,
        MatSnackBarModule,
        MatStepperModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatChipsModule,
        MatTableModule,
        RouterModule,
    ],
    template: `
    <div style="display: flex; align-items: center; margin-bottom: 16px; margin-top: 16px; justify-content: space-between;">
      <h2>Generador de Planificación de Evaluación</h2>
      <div>
        <button mat-button routerLink="/planning" color="accent">
          Volver a Planificación
        </button>
      </div>
    </div>

    <mat-stepper linear #stepper>
      <mat-step [stepControl]="basicInfoForm">
        <form [formGroup]="basicInfoForm" style="padding-top: 16px">
          <ng-template matStepLabel>Información Básica</ng-template>
          
          <div class="cols-2">
            <mat-form-field appearance="outline">
              <mat-label>Sección/Grado</mat-label>
              <mat-select formControlName="classSection" required>
                @for (section of unitPlans(); track section._id) {
                  <mat-option [value]="section._id">
                    {{ section.title }}
                  </mat-option>
                }
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Título de la Planificación</mat-label>
              <input matInput formControlName="title" required>
            </mat-form-field>
          </div>

          <div>
            <h3>Competencias Fundamentales</h3>
            <div class="cols-2">
              <mat-form-field appearance="outline">
                <mat-label>Competencia Comunicativa</mat-label>
                <textarea matInput formControlName="communicativeCompetence" 
                         placeholder="Describa las competencias específicas..." rows="3"></textarea>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Pensamiento Lógico, Creativo y Crítico</mat-label>
                <textarea matInput formControlName="logicalThinkingCompetence" 
                         placeholder="Describa las competencias específicas..." rows="3"></textarea>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Ética y Ciudadana</mat-label>
                <textarea matInput formControlName="ethicalCompetence" 
                         placeholder="Describa las competencias específicas..." rows="3"></textarea>
              </mat-form-field>
            </div>
          </div>

          <div style="text-align: end; margin-top: 16px">
            <button mat-flat-button matStepperNext [disabled]="basicInfoForm.invalid">
              Siguiente
            </button>
          </div>
        </form>
      </mat-step>

      <mat-step [stepControl]="evaluationConfigForm">
        <form [formGroup]="evaluationConfigForm" style="padding-top: 16px">
          <ng-template matStepLabel>Configuración de Evaluación</ng-template>
          
          <div class="cols-2">
            <mat-form-field appearance="outline">
              <mat-label>Tipos de Evaluación</mat-label>
              <mat-select formControlName="evaluationTypes" multiple required>
                <mat-option value="Diagnóstica">Diagnóstica</mat-option>
                <mat-option value="Formativa">Formativa (Retroalimentación)</mat-option>
                <mat-option value="Sumativa">Sumativa</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Evaluación según Participantes</mat-label>
              <mat-select formControlName="evaluationParticipants" multiple required>
                <mat-option value="Autoevaluación">Autoevaluación</mat-option>
                <mat-option value="Coevaluación">Coevaluación</mat-option>
                <mat-option value="Heteroevaluación">Heteroevaluación</mat-option>
              </mat-select>
            </mat-form-field>
          </div>

          <div style="text-align: end; margin-top: 16px">
            <button mat-button matStepperPrevious>Anterior</button>
            <button mat-flat-button matStepperNext [disabled]="evaluationConfigForm.invalid" 
                    style="margin-left: 8px">
              Siguiente
            </button>
          </div>
        </form>
      </mat-step>

      <mat-step>
        <ng-template matStepLabel>Generar Planificación</ng-template>
        <div style="padding-top: 16px">
          @if (generatedPlan) {
            <div style="margin-bottom: 16px">
              <h3>Planificación Generada</h3>
              <button mat-button color="primary" (click)="copyToClipboard()">
                Copiar al Portapapeles
              </button>
              <button mat-button color="accent" (click)="downloadAsDocx()" style="margin-left: 8px">
                Descargar DOCX
              </button>
            </div>
            
            <div style="overflow-x: auto;">
              <table mat-table [dataSource]="generatedPlan.evaluationAreas" class="mat-elevation-z2">
                <ng-container matColumnDef="curricularArea">
                  <th mat-header-cell *matHeaderCellDef>Área Curricular</th>
                  <td mat-cell *matCellDef="let area">{{ area.curricularArea }}</td>
                </ng-container>

                <ng-container matColumnDef="evaluationTypes">
                  <th mat-header-cell *matHeaderCellDef>Tipo de Evaluación</th>
                  <td mat-cell *matCellDef="let area">{{ area.evaluationTypes.join(', ') }}</td>
                </ng-container>

                <ng-container matColumnDef="evaluationParticipants">
                  <th mat-header-cell *matHeaderCellDef>Participantes</th>
                  <td mat-cell *matCellDef="let area">{{ area.evaluationParticipants.join(', ') }}</td>
                </ng-container>

                <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
              </table>
            </div>

            @for (area of generatedPlan.evaluationAreas; track area.curricularArea) {
              <div style="margin-top: 24px">
                <h4>{{ area.curricularArea }}</h4>
                <table style="width: 100%; border-collapse: collapse; margin-top: 8px">
                  <thead>
                    <tr>
                      <th style="border: 1px solid #ccc; padding: 8px; background: #f5f5f5">
                        Aspecto de la Competencia
                      </th>
                      <th style="border: 1px solid #ccc; padding: 8px; background: #f5f5f5">
                        Indicadores de Logro
                      </th>
                      <th style="border: 1px solid #ccc; padding: 8px; background: #f5f5f5">
                        Criterios
                      </th>
                      <th style="border: 1px solid #ccc; padding: 8px; background: #f5f5f5">
                        Evidencias
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (aspect of area.competenceAspects; track aspect.aspect) {
                      <tr>
                        <td style="border: 1px solid #ccc; padding: 8px; vertical-align: top">
                          {{ aspect.aspect }}
                        </td>
                        <td style="border: 1px solid #ccc; padding: 8px; vertical-align: top">
                          <ul style="margin: 0; padding-left: 16px">
                            @for (indicator of aspect.indicators; track indicator) {
                              <li>{{ indicator }}</li>
                            }
                          </ul>
                        </td>
                        <td style="border: 1px solid #ccc; padding: 8px; vertical-align: top">
                          <ul style="margin: 0; padding-left: 16px">
                            @for (criterion of aspect.criteria; track criterion) {
                              <li>{{ criterion }}</li>
                            }
                          </ul>
                        </td>
                        <td style="border: 1px solid #ccc; padding: 8px; vertical-align: top">
                          <ul style="margin: 0; padding-left: 16px">
                            @for (evidence of aspect.evidences; track evidence.description) {
                              <li>
                                {{ evidence.description }} 
                                ({{ evidence.weighting }}% - {{ evidence.instrument }})
                              </li>
                            }
                          </ul>
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            }
          } @else {
            <div style="text-align: center; padding: 32px">
              <p>Haz click en generar para crear tu planificación de evaluación</p>
              <button mat-flat-button color="primary" (click)="generateEvaluationPlan()" [disabled]="generating">
                @if (generating) {
                  <span>Generando...</span>
                } @else {
                  <span>Generar Planificación</span>
                }
              </button>
            </div>
          }
        </div>

        <div style="text-align: end; margin-top: 16px">
          <button mat-button matStepperPrevious>Anterior</button>
          @if (generatedPlan) {
            <button mat-flat-button color="primary" (click)="savePlan()" style="margin-left: 8px">
              Guardar Planificación
            </button>
          }
        </div>
      </mat-step>
    </mat-stepper>
  `,
    styles: `
    mat-form-field {
      width: 100%;
    }

    .cols-2 {
      display: grid;
      row-gap: 16px;
      column-gap: 16px;
      margin-bottom: 16px;
      grid-template-columns: 1fr;

      @media screen and (min-width: 960px) {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    th, td {
      border: 1px solid #ccc;
      padding: 8px;
      text-align: left;
    }

    th {
      background-color: #f5f5f5;
      font-weight: bold;
    }
  `
})
export class EvaluationPlanGeneratorComponent implements OnInit, OnDestroy {
    private store = inject(Store)
    private aiService = inject(AiService)
    private fb = inject(FormBuilder)
    private sb = inject(MatSnackBar)

    user = this.store.selectSignal(selectAuthUser)
    classSections = this.store.selectSignal(selectAllClassSections)
    unitPlans = this.store.selectSignal(selectAllUnitPlans)

    generating = false
    generatedPlan: EvaluationPlan | null = null
    displayedColumns = ['curricularArea', 'evaluationTypes', 'evaluationParticipants']
    destroy$ = new Subject<void>()

    basicInfoForm = this.fb.group({
        classSection: ['', Validators.required],
        title: ['', Validators.required],
        communicativeCompetence: ['', Validators.required],
        logicalThinkingCompetence: ['', Validators.required],
        ethicalCompetence: ['', Validators.required]
    })

    evaluationConfigForm = this.fb.group({
        evaluationTypes: [[], Validators.required],
        evaluationParticipants: [[], Validators.required]
    })

    ngOnInit() {
        this.store.dispatch(loadSections())
        this.store.dispatch(loadPlans())
    }

    ngOnDestroy() {
        this.destroy$.next()
        this.destroy$.complete()
    }

    generateEvaluationPlan() {
        const basicInfo = this.basicInfoForm.value
        const evaluationConfig = this.evaluationConfigForm.value

        if (!basicInfo.classSection || !this.selectedSection) return

        this.generating = true

        const prompt = this.buildEvaluationPlanPrompt(basicInfo, evaluationConfig)

        this.aiService.geminiAi(prompt).subscribe({
            next: (response) => {
                this.generating = false
                try {
                    const planData = JSON.parse(response.response)
                    this.generatedPlan = {
                        user: this.user()?._id || '',
                        section: basicInfo.classSection!,
                        title: basicInfo.title!,
                        fundamentalCompetences: planData.fundamentalCompetences,
                        evaluationAreas: planData.evaluationAreas,
                        createdAt: new Date()
                    }
                    this.sb.open('Planificación generada exitosamente', 'Ok', { duration: 3000 })
                } catch (error) {
                    console.error('Error parsing AI response:', error)
                    this.sb.open('Error al generar la planificación. Intenta de nuevo.', 'Ok', { duration: 5000 })
                }
            },
            error: (error) => {
                this.generating = false
                console.error('AI Service error:', error)
                this.sb.open('Error al conectar con el servicio de IA', 'Ok', { duration: 5000 })
            }
        })
    }

    private buildEvaluationPlanPrompt(basicInfo: any, evaluationConfig: any): string {
        const section = this.selectedSection
        return `
      Genera una planificación de evaluación basada en la metodología matricial de Tobón para educación ${section?.level} ${section?.year}.
      
      INFORMACIÓN BÁSICA:
      - Título: ${basicInfo.title}
      - Grado: ${section?.level} ${section?.year}
      - Competencia Comunicativa: ${basicInfo.communicativeCompetence}
      - Pensamiento Lógico, Creativo y Crítico: ${basicInfo.logicalThinkingCompetence}
      - Ética y Ciudadana: ${basicInfo.ethicalCompetence}
      
      CONFIGURACIÓN DE EVALUACIÓN:
      - Tipos: ${evaluationConfig.evaluationTypes?.join(', ')}
      - Participantes: ${evaluationConfig.evaluationParticipants?.join(', ')}
      
      ESTRUCTURA REQUERIDA (devuélvelo como JSON válido):
      {
        "fundamentalCompetences": [
          {
            "name": "string",
            "specificCompetences": ["string"]
          }
        ],
        "evaluationAreas": [
          {
            "curricularArea": "string",
            "grade": "string",
            "evaluationTypes": ["string"],
            "evaluationParticipants": ["string"],
            "competenceAspects": [
              {
                "aspect": "string",
                "indicators": ["string"],
                "criteria": ["string"],
                "evidences": [
                  {
                    "description": "string",
                    "weighting": number,
                    "instrument": "string"
                  }
                ]
              }
            ]
          }
        ]
      }
      
      Las áreas curriculares deben ser: Competencia Comunicativa, Pensamiento Lógico, Creativo y Crítico; Resolución de Problemas; Tecnológica y Científica, Ética y Ciudadana; Desarrollo Personal y Espiritual; Ambiental y de la Salud.
      
      Asegúrate que la suma de las ponderaciones por área sea 100%.
    `
    }

    copyToClipboard() {
        if (!this.generatedPlan) return

        const text = this.formatPlanAsText(this.generatedPlan)
        navigator.clipboard.writeText(text).then(() => {
            this.sb.open('Planificación copiada al portapapeles', 'Ok', { duration: 3000 })
        })
    }

    async downloadAsDocx() {
        if (!this.generatedPlan) return

        const doc = new Document({
            sections: [{
                properties: {},
                children: [
                    new Paragraph({
                        text: this.generatedPlan.title,
                        heading: "Title"
                    }),
                    new Paragraph({
                        text: `Generado el: ${this.generatedPlan.createdAt.toLocaleDateString()}`
                    }),
                    new Paragraph({ text: "" }),
                    ...this.generateDocxContent(this.generatedPlan)
                ]
            }]
        })

        const blob = await Packer.toBlob(doc)
        saveAs(blob, `${this.generatedPlan.title}.docx`)
    }

    private generateDocxContent(plan: EvaluationPlan): any[] {
        const content: any = []

        for (const area of plan.evaluationAreas) {
            content.push(new Paragraph({ text: area.curricularArea, heading: "Heading2" }))

            const tableRows = [
                new TableRow({
                    children: [
                        new TableCell({ children: [new Paragraph("Aspecto")], width: { size: 20, type: WidthType.PERCENTAGE } }),
                        new TableCell({ children: [new Paragraph("Indicadores")], width: { size: 25, type: WidthType.PERCENTAGE } }),
                        new TableCell({ children: [new Paragraph("Criterios")], width: { size: 25, type: WidthType.PERCENTAGE } }),
                        new TableCell({ children: [new Paragraph("Evidencias")], width: { size: 30, type: WidthType.PERCENTAGE } })
                    ]
                })
            ]

            for (const aspect of area.competenceAspects) {
                tableRows.push(
                    new TableRow({
                        children: [
                            new TableCell({ children: [new Paragraph(aspect.aspect)] }),
                            new TableCell({ children: aspect.indicators.map(ind => new Paragraph(`• ${ind}`)) }),
                            new TableCell({ children: aspect.criteria.map(crit => new Paragraph(`• ${crit}`)) }),
                            new TableCell({
                                children: aspect.evidences.map(ev =>
                                    new Paragraph(`• ${ev.description} (${ev.weighting}% - ${ev.instrument})`)
                                )
                            })
                        ]
                    })
                )
            }

            content.push(new Table({ rows: tableRows }))
            content.push(new Paragraph({ text: "" }))
        }

        return content
    }

    private formatPlanAsText(plan: EvaluationPlan): string {
        let text = `PLANIFICACIÓN DE EVALUACIÓN\n${'='.repeat(50)}\n\n`
        text += `Título: ${plan.title}\n`
        text += `Fecha: ${plan.createdAt.toLocaleDateString()}\n\n`

        for (const area of plan.evaluationAreas) {
            text += `ÁREA: ${area.curricularArea}\n`
            text += `Tipos de evaluación: ${area.evaluationTypes.join(', ')}\n`
            text += `Participantes: ${area.evaluationParticipants.join(', ')}\n\n`

            for (const aspect of area.competenceAspects) {
                text += `Aspecto: ${aspect.aspect}\n`
                text += `Indicadores:\n${aspect.indicators.map(i => `• ${i}`).join('\n')}\n`
                text += `Criterios:\n${aspect.criteria.map(c => `• ${c}`).join('\n')}\n`
                text += `Evidencias:\n${aspect.evidences.map(e => `• ${e.description} (${e.weighting}% - ${e.instrument})`).join('\n')}\n\n`
            }
            text += '\n'
        }

        return text
    }

    savePlan() {
        if (!this.generatedPlan) return

        // TODO: Implementar guardado en base de datos cuando esté disponible el backend
        this.sb.open('Funcionalidad de guardado pronto disponible', 'Ok', { duration: 3000 })
    }

    get selectedSection() {
        const sectionId = this.basicInfoForm.value.classSection
        return this.classSections().find(s => s._id === sectionId)
    }
}