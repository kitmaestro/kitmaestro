import {
	Component,
	inject,
	OnInit,
	OnDestroy,
	signal,
	computed,
} from '@angular/core';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { AiService } from '../../../core/services/ai.service';
import { RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectAuthUser } from '../../../store/auth/auth.selectors';
import { selectAllClassSections } from '../../../store/class-sections/class-sections.selectors';
import { loadSections } from '../../../store/class-sections/class-sections.actions';
import { saveAs } from 'file-saver';
import {
	Document,
	Packer,
	Paragraph,
	Table,
	TableCell,
	TableRow,
	WidthType,
} from 'docx';
import { loadPlans, selectAllUnitPlans } from '../../../store';
import { ClassSection, UnitPlan, User } from '../../../core';
import { EvaluationPlan } from '../../../core/models/evaluation-plan';
import { EvaluationPlanComponent } from '../components/evaluation-plan.component';
import { PretifyPipe } from '../../../shared';

@Component({
	selector: 'app-evaluation-plan-generator',
	imports: [
		ReactiveFormsModule,
		MatSnackBarModule,
		MatFormFieldModule,
		MatSelectModule,
		MatInputModule,
		MatButtonModule,
		MatIconModule,
		MatChipsModule,
		RouterModule,
		EvaluationPlanComponent,
	],
	template: `
		<div
			style="display: flex; align-items: center; margin-bottom: 16px; margin-top: 16px; justify-content: space-between;"
		>
			<h2>Generador de Planificación de Evaluación</h2>
			<div>
				<button mat-button routerLink="/planning" color="accent">
					Volver a Planificación
				</button>
			</div>
		</div>

		<div>
			<form [formGroup]="basicInfoForm" style="padding-top: 16px">
				<ng-template matStepLabel>Información Básica</ng-template>

				<div class="cols-2">
					<mat-form-field appearance="outline">
						<mat-label>Sección/Grado</mat-label>
						<mat-select
							formControlName="classSection"
							required
							(selectionChange)="onSectionChange($event)"
						>
							@for (
								section of classSections();
								track section._id
							) {
								<mat-option [value]="section._id">
									{{ section.name }}
								</mat-option>
							}
						</mat-select>
					</mat-form-field>

					<mat-form-field appearance="outline">
						<mat-label>Unidad de Aprendizaje</mat-label>
						<mat-select
							formControlName="plan"
							required
							(seletionChange)="onPlanChange()"
						>
							@for (plan of unitPlans(); track plan._id) {
								<mat-option [value]="plan._id">
									{{ plan.title }}
								</mat-option>
							}
						</mat-select>
					</mat-form-field>
				</div>

				<div class="cols-2">
					<mat-form-field appearance="outline">
						<mat-label>Tipos de Evaluación</mat-label>
						<mat-select formControlName="evaluationTypes" required>
							<mat-option value="Diagnóstica"
								>Diagnóstica</mat-option
							>
							<mat-option value="Formativa"
								>Formativa (Retroalimentación)</mat-option
							>
							<mat-option value="Sumativa">Sumativa</mat-option>
						</mat-select>
					</mat-form-field>

					<mat-form-field appearance="outline">
						<mat-label>Evaluación según Participantes</mat-label>
						<mat-select
							formControlName="evaluationParticipants"
							required
						>
							<mat-option value="Autoevaluación"
								>Autoevaluación</mat-option
							>
							<mat-option value="Coevaluación"
								>Coevaluación</mat-option
							>
							<mat-option value="Heteroevaluación"
								>Heteroevaluación</mat-option
							>
						</mat-select>
					</mat-form-field>
				</div>

				<div style="text-align: end; margin-top: 16px">
					@if (generatedPlan) {
						<button
							mat-flat-button
							color="primary"
							(click)="savePlan()"
							style="margin-left: 8px"
						>
							Guardar Planificación
						</button>
					}
					<button
						mat-button
						color="primary"
						(click)="generateEvaluationPlan()"
						[disabled]="generating"
					>
						<mat-icon>bolt</mat-icon>
						@if (generating) {
							<span>Generando...</span>
						} @else {
							<span>Generar Planificación</span>
						}
					</button>
				</div>
			</form>
		</div>

		@if (generatedPlan) {
			<div style="padding-top: 16px">
				<div style="margin-bottom: 16px">
					<h3>Planificación Generada</h3>
					<button
						mat-button
						color="primary"
						(click)="copyToClipboard()"
					>
						Copiar al Portapapeles
					</button>
					<button
						mat-button
						color="accent"
						(click)="downloadAsDocx()"
						style="margin-left: 8px"
					>
						Descargar DOCX
					</button>
				</div>

				<app-evaluation-plan
					[plan]="generatedPlan"
				></app-evaluation-plan>
			</div>
		}
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
	`,
})
export class EvaluationPlanGeneratorComponent implements OnInit, OnDestroy {
	private store = inject(Store);
	private aiService = inject(AiService);
	private fb = inject(FormBuilder);
	private sb = inject(MatSnackBar);
	private pretify = new PretifyPipe().transform;

	user = this.store.selectSignal(selectAuthUser);
	classSections = this.store.selectSignal(selectAllClassSections);
	allPlans = this.store.selectSignal(selectAllUnitPlans);
	unitPlans = signal<UnitPlan[]>([]);

	generating = false;
	generatedPlan: EvaluationPlan | null = null;
	destroy$ = new Subject<void>();
	selectedPlan = signal<UnitPlan | null>(null);

	basicInfoForm = this.fb.group({
		classSection: ['', Validators.required],
		plan: ['', Validators.required],
		evaluationTypes: ['Diagnóstica', Validators.required],
		evaluationParticipants: ['Autoevaluación', Validators.required],
	});

	ngOnInit() {
		this.store.dispatch(loadSections());
		this.store.dispatch(loadPlans());
	}

	ngOnDestroy() {
		this.destroy$.next();
		this.destroy$.complete();
	}

	generateEvaluationPlan() {
		const formData = this.basicInfoForm.getRawValue();
		const classSection = this.classSections().find(
			(cs) => cs._id == formData.classSection,
		);
		const plan = this.unitPlans().find((p) => p._id == formData.plan);
		const evaluationParticipants = formData.evaluationParticipants;
		const evaluationTypes = formData.evaluationTypes;
		const user = this.user();

		if (
			!plan ||
			!classSection ||
			!user ||
			!evaluationParticipants ||
			!evaluationTypes
		)
			return;

		const data: {
			classSection: ClassSection;
			plan: UnitPlan;
			evaluationParticipants: string;
			evaluationTypes: string;
		} = {
			classSection,
			plan,
			evaluationParticipants,
			evaluationTypes,
		};

		this.generating = true;

		const prompt = this.buildEvaluationPlanPrompt(data);

		this.aiService.geminiAi(prompt).subscribe({
			next: (response) => {
				this.generating = false;
				try {
					const start = response.response.indexOf('{');
					const end = response.response.lastIndexOf('}') + 1;
					const planData = JSON.parse(
						response.response.substring(start, end),
					);
					this.generatedPlan = {
						user,
						unitPlan: plan,
						evaluationAreas: planData.evaluationAreas,
					} as any;
					this.sb.open('Planificación generada exitosamente', 'Ok', {
						duration: 3000,
					});
					console.log(this.generatedPlan);
				} catch (error) {
					console.error('Error parsing AI response:', error);
					this.sb.open(
						'Error al generar la planificación. Intenta de nuevo.',
						'Ok',
						{ duration: 5000 },
					);
				}
			},
			error: (error) => {
				this.generating = false;
				console.error('AI Service error:', error);
				this.sb.open('Error al conectar con el servicio de IA', 'Ok', {
					duration: 5000,
				});
			},
		});
	}

	onSectionChange(event: MatSelectChange) {
		this.unitPlans.set(
			this.allPlans().filter((plan) => plan.section._id === event.value),
		);
	}

	onPlanChange() {
		const plan = this.unitPlans().find(
			(plan) => plan._id === this.basicInfoForm.value.plan,
		);
		if (plan) this.selectedPlan.set(plan);
	}

	private buildEvaluationPlanPrompt({
		classSection,
		plan,
		evaluationParticipants,
		evaluationTypes,
	}: {
		classSection: ClassSection;
		plan: UnitPlan;
		evaluationParticipants: string;
		evaluationTypes: string;
	}): string {
		const comunicativa = plan.competence
			.find((c) => c.name === 'Comunicativa')
			?.entries.join(', ');
		const pensamiento = plan.competence
			.find((c) => c.name === 'Pensamiento')
			?.entries.join(', ');
		const etica = plan.competence
			.find((c) => c.name === 'Ciudadana')
			?.entries.join(', ');
		return `
      Genera una planificación de evaluación basada en la metodología matricial de Tobón para educación ${classSection?.level} ${classSection?.year}.

      INFORMACIÓN BÁSICA:
      - Título: ${plan.title}
      - Grado: ${this.pretify(classSection.year)} de ${this.pretify(classSection.level)}
      - Competencia Comunicativa: ${comunicativa}
      - Pensamiento Lógico, Creativo y Crítico: ${pensamiento}
      - Ética y Ciudadana: ${etica}

      CONFIGURACIÓN DE EVALUACIÓN:
      - Tipo: ${evaluationTypes}
      - Participante: ${evaluationParticipants}

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
    `;
	}

	copyToClipboard() {
		if (!this.generatedPlan) return;

		const text = this.formatPlanAsText(this.generatedPlan);
		navigator.clipboard.writeText(text).then(() => {
			this.sb.open('Planificación copiada al portapapeles', 'Ok', {
				duration: 3000,
			});
		});
	}

	async downloadAsDocx() {
		if (!this.generatedPlan) return;

		const doc = new Document({
			sections: [
				{
					properties: {},
					children: [
						new Paragraph({
							text: this.generatedPlan.unitPlan.title,
							heading: 'Title',
						}),
						new Paragraph({
							text: `Generado el: ${new Date(this.generatedPlan.createdAt).toLocaleDateString()}`,
						}),
						new Paragraph({ text: '' }),
						...this.generateDocxContent(this.generatedPlan),
					],
				},
			],
		});

		const blob = await Packer.toBlob(doc);
		saveAs(blob, `${this.generatedPlan.unitPlan.title}.docx`);
	}

	private generateDocxContent(plan: EvaluationPlan): any[] {
		const content: any = [];

		for (const area of plan.evaluationAreas) {
			content.push(
				new Paragraph({
					text: area.curricularArea,
					heading: 'Heading2',
				}),
			);

			const tableRows = [
				new TableRow({
					children: [
						new TableCell({
							children: [new Paragraph('Aspecto')],
							width: { size: 20, type: WidthType.PERCENTAGE },
						}),
						new TableCell({
							children: [new Paragraph('Indicadores')],
							width: { size: 25, type: WidthType.PERCENTAGE },
						}),
						new TableCell({
							children: [new Paragraph('Criterios')],
							width: { size: 25, type: WidthType.PERCENTAGE },
						}),
						new TableCell({
							children: [new Paragraph('Evidencias')],
							width: { size: 30, type: WidthType.PERCENTAGE },
						}),
					],
				}),
			];

			for (const aspect of area.competenceAspects) {
				tableRows.push(
					new TableRow({
						children: [
							new TableCell({
								children: [new Paragraph(aspect.aspect)],
							}),
							new TableCell({
								children: aspect.indicators.map(
									(ind) => new Paragraph(`• ${ind}`),
								),
							}),
							new TableCell({
								children: aspect.criteria.map(
									(crit) => new Paragraph(`• ${crit}`),
								),
							}),
							new TableCell({
								children: aspect.evidences.map(
									(ev) =>
										new Paragraph(
											`• ${ev.description} (${ev.weighting}% - ${ev.instrument})`,
										),
								),
							}),
						],
					}),
				);
			}

			content.push(new Table({ rows: tableRows }));
			content.push(new Paragraph({ text: '' }));
		}

		return content;
	}

	private formatPlanAsText(plan: EvaluationPlan): string {
		let text = `PLANIFICACIÓN DE EVALUACIÓN\n${'='.repeat(50)}\n\n`;
		text += `Título: ${plan.unitPlan.title}\n`;
		text += `Fecha: ${new Date(plan.createdAt).toLocaleDateString()}\n\n`;

		for (const area of plan.evaluationAreas) {
			text += `ÁREA: ${area.curricularArea}\n`;
			text += `Tipos de evaluación: ${area.evaluationTypes.join(', ')}\n`;
			text += `Participantes: ${area.evaluationParticipants.join(', ')}\n\n`;

			for (const aspect of area.competenceAspects) {
				text += `Aspecto: ${aspect.aspect}\n`;
				text += `Indicadores:\n${aspect.indicators.map((i) => `• ${i}`).join('\n')}\n`;
				text += `Criterios:\n${aspect.criteria.map((c) => `• ${c}`).join('\n')}\n`;
				text += `Evidencias:\n${aspect.evidences.map((e) => `• ${e.description} (${e.weighting}% - ${e.instrument})`).join('\n')}\n\n`;
			}
			text += '\n';
		}

		return text;
	}

	savePlan() {
		if (!this.generatedPlan) return;

		// TODO: Implementar guardado en base de datos cuando esté disponible el backend
		this.sb.open('Funcionalidad de guardado pronto disponible', 'Ok', {
			duration: 3000,
		});
	}

	get selectedSection() {
		const sectionId = this.basicInfoForm.value.classSection;
		return this.classSections().find((s) => s._id === sectionId);
	}
}
