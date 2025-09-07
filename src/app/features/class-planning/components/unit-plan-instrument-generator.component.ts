import {
	Component,
	inject,
	OnInit,
	Pipe,
	PipeTransform,
	Input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MarkdownComponent } from 'ngx-markdown';
import { UnitPlan } from '../../../core/interfaces';
import { AiService } from '../../../core/services/ai.service';
import { RubricService } from '../../../core/services/rubric.service';
import { ChecklistService } from '../../../core/services/checklist.service';
import { EstimationScaleService } from '../../../core/services/estimation-scale.service';
import { TestService } from '../../../core/services/test.service';
import { RubricComponent } from '../../assessments/rubric/rubric.component';
import { ChecklistComponent } from '../../assessments/checklist/checklist.component';

export const generateRubricPrompt = `
Crea el contenido para una Rúbrica Analítica en formato JSON.
**Contexto:**
- Unidad de Aprendizaje: "[unit_title]"
- Grado: [grade_level]
- Asignatura(s): [subjects]
- Indicadores de Logro a Evaluar:
[indicators]
- Niveles de Desempeño: Logrado, En Proceso, Iniciado.

**Estructura JSON Requerida:**
{
  "title": "Rúbrica para Evaluar: [unit_title]",
  "criteria": [
    {
      "indicator": "El primer indicador de logro de la lista.",
      "maxScore": 10,
      "criterion": [
        {"name": "Descripción detallada para el nivel 'Logrado' de este indicador.", "score": 10},
        {"name": "Descripción detallada para el nivel 'En Proceso' de este indicador.", "score": 7},
        {"name": "Descripción detallada para el nivel 'Iniciado' de este indicador.", "score": 4}
      ]
    }
  ]
}
Genera un objeto "criteria" por cada indicador de logro proporcionado. La respuesta debe ser únicamente el objeto JSON.`;

export const generateChecklistPrompt = `
Crea el contenido para una Lista de Cotejo en formato JSON.
**Contexto:**
- Unidad de Aprendizaje: "[unit_title]"
- Grado: [grade_level]
- Indicadores de Logro Clave:
[indicators]

**Instrucción:**
Basado en los indicadores de logro, genera una lista de 5 a 7 criterios de evaluación claros y concisos que puedan ser respondidos con "Sí" o "No".

**Estructura JSON Requerida:**
{
  "title": "Lista de Cotejo: [unit_title]",
  "criteria": [
    "Primer criterio observable.",
    "Segundo criterio observable."
  ]
}
La respuesta debe ser únicamente el objeto JSON.`;

export const generateEstimationScalePrompt = `
Crea el contenido para una Escala de Estimación Numérica en formato JSON.
**Contexto:**
- Unidad de Aprendizaje: "[unit_title]"
- Grado: [grade_level]
- Indicadores de Logro a Evaluar:
[indicators]
- Niveles de Desempeño (Escala): Siempre (3), Frecuentemente (2), A veces (1), Nunca (0).

**Instrucción:**
Basado en los indicadores de logro, genera una lista de 5 a 7 criterios o afirmaciones observables para ser evaluadas con la escala proporcionada.

**Estructura JSON Requerida:**
{
  "title": "Escala de Estimación: [unit_title]",
  "criteria": [
    "Primer criterio/afirmación observable.",
    "Segundo criterio/afirmación observable."
  ],
  "levels": ["Siempre (3)", "Frecuentemente (2)", "A veces (1)", "Nunca (0)"]
}
La respuesta debe ser únicamente el objeto JSON.`;

export const generateTestPrompt = `
Crea un Examen Corto en formato JSON.
**Contexto:**
- Unidad de Aprendizaje: "[unit_title]"
- Grado: [grade_level]
- Asignatura: [subject]
- Contenidos Principales:
[contents]

**Instrucción:**
Diseña un examen corto (3 a 5 preguntas variadas: selección múltiple, verdadero/falso, respuesta corta) que evalúe los contenidos listados. El cuerpo del examen debe estar en formato Markdown.

**Estructura JSON Requerida:**
{
  "body": "### Examen: [unit_title]\\n\\n**Nombre:** ________________________\\n\\n**Fecha:** _________\\n\\n**I. Selección Múltiple**\\n\\n1. Pregunta 1...\\n   a) Opción A\\n   b) Opción B\\n\\n**II. Verdadero o Falso**\\n\\n1. Afirmación...",
  "answers": "Respuestas:\\nI. 1. b\\nII. 1. Verdadero"
}
La respuesta debe ser únicamente el objeto JSON.`;

// --- COMPONENTE ---
@Component({
	selector: 'app-unit-plan-instrument-generator',
	standalone: true,
	imports: [
		CommonModule,
		RouterModule,
		ReactiveFormsModule,
		MatCardModule,
		MatSnackBarModule,
		MatButtonModule,
		MatIconModule,
		MatFormFieldModule,
		MatSelectModule,
		MatProgressBarModule,
		MarkdownComponent,
		RubricComponent,
		ChecklistComponent,
	],
	template: `
		<div class="container">
			<mat-card>
				<mat-card-header>
					<mat-card-title
						>Generador de Instrumentos de Evaluación</mat-card-title
					>
					<mat-card-subtitle
						>Para la unidad:
						{{ unitPlan?.title }}</mat-card-subtitle
					>
				</mat-card-header>
				<mat-card-content>
					<form
						[formGroup]="instrumentForm"
						(ngSubmit)="generateInstruments()"
					>
						<div class="form-grid">
							<mat-form-field appearance="outline">
								<mat-label
									>Instrumento para Evaluación
									Formativa</mat-label
								>
								<mat-select formControlName="formativeType">
									<mat-option
										*ngFor="let type of instrumentTypes"
										[value]="type.id"
										>{{ type.name }}</mat-option
									>
								</mat-select>
							</mat-form-field>
							<mat-form-field appearance="outline">
								<mat-label
									>Instrumento para Evaluación
									Sumativa</mat-label
								>
								<mat-select formControlName="summativeType">
									<mat-option
										*ngFor="let type of instrumentTypes"
										[value]="type.id"
										>{{ type.name }}</mat-option
									>
								</mat-select>
							</mat-form-field>
						</div>
						<div *ngIf="isGenerating" class="progress-section">
							<p>Generando instrumentos, por favor espere...</p>
							<mat-progress-bar
								mode="indeterminate"
							></mat-progress-bar>
						</div>
						<mat-card-actions align="end">
							<button
								mat-raised-button
								color="primary"
								type="submit"
								[disabled]="
									isGenerating || instrumentForm.invalid
								"
							>
								<mat-icon>psychology</mat-icon> Generar
								Instrumentos
							</button>
						</mat-card-actions>
					</form>

					<div
						*ngIf="
							generatedFormativeInstrument ||
							generatedSummativeInstrument
						"
					>
						<!-- Columna Formativa -->
						<div *ngIf="generatedFormativeInstrument">
							<mat-card class="instrument-card">
								<mat-card-header>
									<mat-card-title
										>Instrumento Formativo</mat-card-title
									>
									<mat-card-subtitle>{{
										generatedFormativeInstrument.title
									}}</mat-card-subtitle>
								</mat-card-header>
								<mat-card-content>
									<ng-container
										[ngSwitch]="
											instrumentForm.value.formativeType
										"
									>
										<div *ngSwitchCase="'rubric'">
											<app-rubric
												[rubric]="
													generatedFormativeInstrument
												"
											></app-rubric>
										</div>
										<div *ngSwitchCase="'checklist'">
											<app-checklist
												[checklist]="
													generatedFormativeInstrument
												"
											></app-checklist>
										</div>
										<!-- Agrega más casos para otros tipos -->
									</ng-container>
								</mat-card-content>
								<mat-card-actions align="end"
									><button mat-button color="primary">
										Guardar
									</button></mat-card-actions
								>
							</mat-card>
						</div>
						<!-- Columna Sumativa -->
						<div *ngIf="generatedSummativeInstrument">
							<mat-card class="instrument-card">
								<mat-card-header>
									<mat-card-title
										>Instrumento Sumativo</mat-card-title
									>
									<mat-card-subtitle>{{
										generatedSummativeInstrument.title ||
											'Examen'
									}}</mat-card-subtitle>
								</mat-card-header>
								<mat-card-content>
									<ng-container
										[ngSwitch]="
											instrumentForm.value.summativeType
										"
									>
										<div *ngSwitchCase="'test'">
											<markdown
												[data]="
													generatedSummativeInstrument.body
												"
											></markdown>
										</div>
										<div *ngSwitchCase="'rubric'">
											<app-rubric
												[rubric]="
													generatedSummativeInstrument
												"
											></app-rubric>
										</div>
										<div *ngSwitchCase="'checklist'">
											<app-checklist
												[checklist]="
													generatedSummativeInstrument
												"
											></app-checklist>
										</div>
									</ng-container>
								</mat-card-content>
								<mat-card-actions align="end"
									><button mat-button color="primary">
										Guardar
									</button></mat-card-actions
								>
							</mat-card>
						</div>
					</div>
				</mat-card-content>
			</mat-card>
		</div>
	`,
	styles: [
		`
			.container {
				padding: 24px;
			}
			.form-grid {
				display: grid;
				grid-template-columns: 1fr 1fr;
				gap: 16px;
				margin-bottom: 16px;
			}
			.progress-section {
				margin: 24px 0;
			}
			.results-grid {
				display: grid;
				grid-template-columns: 1fr 1fr;
				gap: 24px;
				margin-top: 24px;
			}
			.instrument-card {
				height: 100%;
				display: flex;
				flex-direction: column;
			}
			.instrument-card mat-card-content {
				flex-grow: 1;
			}
			.checklist {
				list-style-type: '☑️ ';
				padding-left: 20px;
			}
		`,
	],
})
export class UnitPlanInstrumentGeneratorComponent implements OnInit {
	@Input() unitPlan: UnitPlan | null = null;

	private fb = inject(FormBuilder);
	private aiService = inject(AiService);
	private sb = inject(MatSnackBar);
	// Inyecta los servicios de guardado
	private rubricService = inject(RubricService);
	private checklistService = inject(ChecklistService);
	private estimationScaleService = inject(EstimationScaleService);
	private testService = inject(TestService);

	isGenerating = false;
	instrumentTypes = [
		{ id: 'rubric', name: 'Rúbrica' },
		{ id: 'checklist', name: 'Lista de Cotejo' },
		// { id: 'estimation-scale', name: 'Escala de Estimación' },
		{ id: 'test', name: 'Prueba Escrita' },
	];

	generatedFormativeInstrument: any = null;
	generatedSummativeInstrument: any = null;

	instrumentForm = this.fb.group({
		formativeType: ['', Validators.required],
		summativeType: ['', Validators.required],
	});

	ngOnInit(): void {
		if (!this.unitPlan) {
			console.error('El componente requiere un [unitPlan] como Input.');
			this.sb.open(
				'Error: No se proporcionó una unidad de aprendizaje.',
				'Cerrar',
			);
		}
	}

	async generateInstruments() {
		if (this.instrumentForm.invalid || !this.unitPlan) return;

		this.isGenerating = true;
		this.generatedFormativeInstrument = null;
		this.generatedSummativeInstrument = null;

		const { formativeType, summativeType } = this.instrumentForm.value;

		try {
			const formativePromise = this.generateInstrument(formativeType!);
			const summativePromise = this.generateInstrument(summativeType!);

			const [formativeResult, summativeResult] = await Promise.all([
				formativePromise,
				summativePromise,
			]);

			this.generatedFormativeInstrument = formativeResult;
			this.generatedSummativeInstrument = summativeResult;

			// switch (formativeType) {
			//     case 'rubric': {
			//         this.rubricService.create(formativeResult).subscribe();
			//         break;
			//     }
			//     case 'checklist': {
			//         this.checklistService.create(formativeResult).subscribe();
			//         break;
			//     }
			//     case 'estimation-scale': {
			//         this.estimationScaleService.create(formativeResult).subscribe();
			//         break;
			//     }
			//     case 'test': {
			//         this.testService.create(formativeResult).subscribe();
			//         break;
			//     }
			// }

			// switch (summativeType) {
			//     case 'rubric': {
			//         this.rubricService.create(summativeResult).subscribe();
			//         break;
			//     }
			//     case 'checklist': {
			//         this.checklistService.create(summativeResult).subscribe();
			//         break;
			//     }
			//     case 'estimation-scale': {
			//         this.estimationScaleService.create(summativeResult).subscribe();
			//         break;
			//     }
			//     case 'test': {
			//         this.testService.create(summativeResult).subscribe();
			//         break;
			//     }
			// }

			this.sb.open('Instrumentos generados con éxito.', 'Ok', {
				duration: 3000,
			});
		} catch (error) {
			console.error(error);
			this.sb.open('Ocurrió un error durante la generación.', 'Cerrar');
		} finally {
			this.isGenerating = false;
		}
	}

	private async generateInstrument(type: string): Promise<any> {
		if (!this.unitPlan) throw new Error('UnitPlan no está disponible.');

		const indicators = this.unitPlan.contents
			.flatMap((c) => c.achievement_indicators)
			.join('\n- ');
		const contents = this.unitPlan.contents
			.map((c) => c.title)
			.join('\n- ');
		const gradeLevel = `${this.unitPlan.section.year} de ${this.unitPlan.section.level}`;
		const subjects = this.unitPlan.subjects.join(', ');

		let prompt = '';
		switch (type) {
			case 'rubric':
				prompt = generateRubricPrompt;
				break;
			case 'checklist':
				prompt = generateChecklistPrompt;
				break;
			case 'estimation-scale':
				prompt = generateEstimationScalePrompt;
				break;
			case 'test':
				prompt = generateTestPrompt;
				break;
			default:
				throw new Error('Tipo de instrumento no válido');
		}

		prompt = prompt
			.replace('[unit_title]', this.unitPlan.title)
			.replace('[grade_level]', gradeLevel)
			.replace('[subjects]', subjects)
			.replace('[indicators]', indicators)
			.replace('[contents]', contents)
			.replace('[subject]', this.unitPlan.subjects[0]);

		const res = await this.aiService.geminiAi(prompt).toPromise();
		if (!res) throw new Error('Sin respuesta de la IA.');

		const jsonStartsAt = res.response.indexOf('{');
		const jsonEndsAt = res.response.lastIndexOf('}') + 1;
		const instrument = JSON.parse(
			res.response.slice(jsonStartsAt, jsonEndsAt),
		);
		instrument.unitPlan = this.unitPlan._id;
		return instrument;
	}
}
