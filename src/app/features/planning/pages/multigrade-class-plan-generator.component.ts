import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ClassSection } from '../../../core';
import { PretifyPipe } from '../../../shared/pipes/pretify.pipe';
import { AiService } from '../../../core/services/ai.service';
import { ClassPlan } from '../../../core';
import { classroomResources } from '../../../config/constants';
import { IsPremiumComponent } from '../../../shared/ui/is-premium.component';
import { MarkdownComponent } from 'ngx-markdown';
import { SimpleList } from '../../../shared';
import { Store } from '@ngrx/store';
import { selectAuthUser } from '../../../store/auth/auth.selectors';
import {
	loadSections,
	selectAllClassSections,
} from '../../../store/class-sections';
import { Subject, takeUntil } from 'rxjs';

// --- NUEVO PROMPT PARA AULAS MULTIGRADO v2 ---
export const multigradeClassPlanPrompt = `
Eres un experto en pedagogía y diseño curricular para aulas multigrado.
Tu tarea es crear un plan de clases diario detallado en formato JSON para una clase que combina los siguientes grados: [grade_levels].

**Detalles de la Clase:**
- **Asignatura:** [subject]
- **Duración Total:** [duration] minutos
- **Tema Central:** [topics]
- **Recursos Disponibles:** [resources]

**Instrucciones Clave:**
1.  Distribuye la duración total de la clase entre los momentos de inicio, desarrollo y cierre.
2.  Para las actividades de **desarrollo**, crea tareas **diferenciadas** para cada grado. Dentro del array de actividades, formatea cada string para indicar a qué grado corresponde, por ejemplo: "**Para [Grado 1]:** [Actividad específica para este grado]".
3.  Completa todos los campos del JSON de manera coherente y pedagógica.

**Estructura del Plan (JSON):**
Genera un objeto JSON con la siguiente estructura exacta:
{
  "objective": "Intención pedagógica clara y concisa para la clase.",
  "strategies": ["Estrategia 1", "Estrategia 2", "Estrategia 3"],
  "competence": "Describe la competencia específica que se trabajará en la clase.",
  "introduction": {
    "duration": 10,
    "activities": ["Actividad común para todos para iniciar la clase."],
    "resources": ["Recurso 1", "Recurso 2"],
    "layout": "Organización de los estudiantes (Ej: Círculo, Grupos pequeños)"
  },
  "main": {
    "duration": 60,
    "activities": [
      "Para [Nombre del primer grado]: Primera actividad diferenciada.",
      "Para [Nombre del primer grado]: Segunda actividad diferenciada.",
      "Para [Nombre del segundo grado]: Primera actividad diferenciada con mayor complejidad.",
      "Para [Nombre del segundo grado]: Segunda actividad diferenciada con mayor complejidad."
    ],
    "resources": ["Recurso 1", "Recurso 2"],
    "layout": "Organización para el desarrollo (Ej: Trabajo individual, Estaciones de aprendizaje)"
  },
  "closing": {
    "duration": 20,
    "activities": ["Actividad común de cierre para resumir y evaluar."],
    "resources": ["Recurso 1"],
    "layout": "Organización para el cierre (Ej: Plenaria, Puesta en común)"
  },
  "supplementary": {
    "activities": ["Actividad para estudiantes que terminen rápido o necesiten refuerzo."],
    "resources": [],
    "layout": "Individual"
  },
  "vocabulary": ["Palabra clave 1", "Palabra clave 2"],
  "readings": "Lectura recomendada o libro de la semana relacionado al tema."
}
No incluyas markup ya que no puedo visualizarlo correctamente.`;

// --- COMPONENTE ---
@Component({
	selector: 'app-multigrade-class-plan-generator',
	standalone: true,
	imports: [
		CommonModule,
		RouterModule,
		ReactiveFormsModule,
		MatSnackBarModule,
		MatButtonModule,
		MatIconModule,
		MatFormFieldModule,
		MatSelectModule,
		MatChipsModule,
		MatInputModule,
		MatProgressBarModule,
		PretifyPipe,
		DatePipe,
		IsPremiumComponent,
		MarkdownComponent,
		SimpleList,
	],
	template: `
		<app-is-premium minSubscriptionType="Plan Basico">
			<div class="container">
				<div
					style="display: flex; align-items: center; margin-bottom: 16px; margin-top: 16px; justify-content: space-between;"
				>
					<h2>Generador de Plan Diario Multigrado</h2>
				</div>
				<div>
					<form
						[formGroup]="planForm"
						(ngSubmit)="onSubmit()"
						*ngIf="!generatedPlan"
					>
						<div class="form-row">
							<mat-form-field appearance="outline">
								<mat-label
									>Grados (Selecciona Múltiples)</mat-label
								>
								<mat-select
									formControlName="classSections"
									multiple
								>
									<mat-option
										*ngFor="let section of allClassSections"
										[value]="section._id"
									>
										{{ section.name }}
									</mat-option>
								</mat-select>
							</mat-form-field>

							<mat-form-field appearance="outline">
								<mat-label>Asignatura Común</mat-label>
								<mat-select formControlName="subject">
									<mat-option
										*ngFor="
											let subject of availableSubjects
										"
										[value]="subject"
									>
										{{ subject | pretify }}
									</mat-option>
								</mat-select>
							</mat-form-field>
						</div>

						<div class="form-row">
							<mat-form-field appearance="outline">
								<mat-label>Fecha</mat-label>
								<input
									type="date"
									formControlName="date"
									matInput
								/>
							</mat-form-field>
							<mat-form-field appearance="outline">
								<mat-label>Duración (Minutos)</mat-label>
								<mat-select formControlName="duration">
									<mat-option
										*ngFor="let d of [45, 90]"
										[value]="d"
										>{{ d }} Minutos</mat-option
									>
								</mat-select>
							</mat-form-field>
						</div>

						<mat-form-field appearance="outline">
							<mat-label>Tema Central de la Clase</mat-label>
							<textarea
								matInput
								formControlName="topics"
								placeholder="Ej: La estructura del cuento y sus partes"
							></textarea>
						</mat-form-field>

						<div class="resource-section">
							<mat-label>Recursos Disponibles</mat-label>
							<mat-chip-listbox
								formControlName="resources"
								multiple
							>
								<mat-chip-option
									*ngFor="let resource of classroomResources"
									[value]="resource"
								>
									{{ resource }}
								</mat-chip-option>
							</mat-chip-listbox>
						</div>

						<div *ngIf="generating" class="progress-section">
							<p>Generando plan multigrado...</p>
							<mat-progress-bar
								mode="indeterminate"
							></mat-progress-bar>
						</div>

						<div class="mat-card-actions">
							<button
								mat-flat-button
								color="primary"
								type="submit"
								[disabled]="generating || planForm.invalid"
							>
								<mat-icon>bolt</mat-icon>
								Generar Plan
							</button>
						</div>
					</form>

					<!-- Visualización del Plan Generado -->
					<div *ngIf="generatedPlan" class="plan-view">
						<div class="shadow">
							<div class="page" id="class-plan">
								<table
									style="border-collapse: collapse; border: 1px solid gray; background-color: white; width: 100%;"
								>
									<thead>
										<tr>
											<td style="width: 160px">
												<b>Fecha</b>:
												{{
													generatedPlan.date
														| date: 'dd/MM/yyyy'
												}}
											</td>
											<td style="width: 280px">
												<b>Grados</b>:
												{{ selectedGradesText }}
											</td>
											<td>
												<b>Docente</b>:
												{{ user()?.firstname }}
												{{ user()?.lastname }}
											</td>
											<td colspan="2">
												<b>Área Curricular</b>:
												{{
													generatedPlan.subject
														| pretify
												}}
											</td>
										</tr>
										<tr>
											<td colspan="5">
												<b
													>Estrategias y técnicas de
													enseñanza-aprendizaje</b
												>:
												<ul
													style="list-style: none; padding: 0; margin: 0;"
												>
													@for (
														strategy of generatedPlan.strategies;
														track $index
													) {
														<li>
															- {{ strategy }}
														</li>
													}
												</ul>
											</td>
										</tr>
										<tr>
											<td colspan="5">
												<b>Intencion Pedagógica</b>:
												{{ generatedPlan.objective }}
											</td>
										</tr>
										<tr>
											<th>Momento / Duración</th>
											<th style="width: 18%">
												Competencias Especificas
											</th>
											<th>Actividades</th>
											<th style="width: 18%">
												Organización de los Estudiantes
											</th>
											<th style="width: 15%">Recursos</th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<td>
												<b>Inicio</b> ({{
													generatedPlan.introduction
														.duration
												}}
												Minutos)
											</td>
											<td
												rowspan="4"
												style="vertical-align: top;"
											>
												{{ generatedPlan.competence }}
											</td>
											<td>
												<markdown
													[data]="
														'- ' +
														generatedPlan.introduction.activities.join(
															'
- '
														)
													"
												/>
											</td>
											<td>
												{{
													generatedPlan.introduction
														.layout
												}}
											</td>
											<td>
												<app-simple-list
													[items]="
														generatedPlan
															.introduction
															.resources
													"
												/>
											</td>
										</tr>
										<tr>
											<td>
												<b>Desarrollo</b> ({{
													generatedPlan.main.duration
												}}
												Minutos)
											</td>
											<td>
												<markdown
													[data]="
														'- ' +
														generatedPlan.main.activities.join(
															'
- '
														)
													"
												/>
											</td>
											<td>
												{{ generatedPlan.main.layout }}
											</td>
											<td>
												<app-simple-list
													[items]="
														generatedPlan.main
															.resources
													"
												/>
											</td>
										</tr>
										<tr>
											<td>
												<b>Cierre</b> ({{
													generatedPlan.closing
														.duration
												}}
												Minutos)
											</td>
											<td>
												<markdown
													[data]="
														'- ' +
														generatedPlan.closing.activities.join(
															'
- '
														)
													"
												/>
											</td>
											<td>
												{{
													generatedPlan.closing.layout
												}}
											</td>
											<td>
												<app-simple-list
													[items]="
														generatedPlan.closing
															.resources
													"
												/>
											</td>
										</tr>
										<tr>
											<td>
												<b
													>Actividades
													Complementarias</b
												>
											</td>
											<td>
												<markdown
													[data]="
														'- ' +
														generatedPlan.supplementary.activities.join(
															'
- '
														)
													"
												/>
											</td>
											<td>
												{{
													generatedPlan.supplementary
														.layout
												}}
											</td>
											<td>
												<app-simple-list
													[items]="
														generatedPlan
															.supplementary
															.resources
													"
												/>
											</td>
										</tr>
										<tr>
											<td colspan="5">
												<b
													>Vocabulario del día/de la
													semana</b
												>:
												{{
													generatedPlan.vocabulary.join(
														', '
													)
												}}
											</td>
										</tr>
										<tr>
											<td colspan="5">
												<b
													>Lecturas recomendadas/ o
													libro de la semana</b
												>: {{ generatedPlan.readings }}
											</td>
										</tr>
										<tr>
											<td colspan="5">
												<b>Observaciones</b>:
											</td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
						<p style="background-color: ">
							<b>Nota</b>:
							<i
								>Puedes copiar tu plan y pegarlo en Word para
								editarlo o imprimirlo.</i
							>
						</p>
						<div class="mat-card-actions">
							<button
								mat-flat-button
								(click)="generatedPlan = null"
							>
								Generar Otro Plan
							</button>
						</div>
					</div>
				</div>
			</div>
		</app-is-premium>
	`,
	styles: [
		`
			.container {
				max-width: 1400px;
				margin: 24px auto;
			}
			form {
				display: flex;
				flex-direction: column;
				gap: 16px;
			}
			.form-row {
				display: grid;
				grid-template-columns: 1fr 1fr;
				gap: 16px;
			}
			.resource-section {
				display: flex;
				flex-direction: column;
				gap: 8px;
			}
			mat-chip-listbox {
				display: flex;
				flex-wrap: wrap;
				gap: 8px;
			}
			.progress-section {
				margin-top: 16px;
			}
			.mat-card-actions {
				padding: 16px 0 0 !important;
				display: flex;
				justify-content: end;
				margin-top: 16px;
			}
			.plan-view {
				margin-top: 24px;
			}
			td,
			th {
				border: 1px solid #ccc;
				padding: 8px;
				vertical-align: top;
			}
			th {
				font-weight: bold;
				text-align: center;
			}
		`,
	],
})
export class MultigradeClassPlanGeneratorComponent implements OnInit, OnDestroy {
	sb = inject(MatSnackBar);
	fb = inject(FormBuilder);
	aiService = inject(AiService);
	#store = inject(Store);

	allClassSections: ClassSection[] = [];
	user = this.#store.selectSignal(selectAuthUser);
	generating = false;
	generatedPlan: ClassPlan | null = null;
	classroomResources = classroomResources;
	selectedGradesText = '';

	planForm = this.fb.group({
		classSections: [[], [Validators.required, Validators.minLength(2)]],
		subject: ['', Validators.required],
		date: [new Date().toISOString().split('T')[0], Validators.required],
		duration: [90, Validators.required],
		topics: ['', Validators.required],
		teachingStyle: ['innovador', Validators.required],
		resources: [['Pizarra', 'Libros de texto']],
	});

	destroy$ = new Subject<void>();

	ngOnInit(): void {
		this.#store.dispatch(loadSections());
		this.#store
			.select(selectAllClassSections)
			.pipe(takeUntil(this.destroy$))
			.subscribe((sections) => (this.allClassSections = sections));
	}

	ngOnDestroy() {
		this.destroy$.next();
		this.destroy$.complete();
	}

	get availableSubjects(): string[] {
		const selectedIds: string[] =
			this.planForm.get('classSections')?.value || [];
		if (selectedIds.length < 2) return [];
		const selectedSections = this.allClassSections.filter((s) =>
			selectedIds.includes(s._id),
		);
		if (!selectedSections.length) return [];
		return selectedSections.reduce((commonSubjects, section) => {
			return commonSubjects.filter((subject) =>
				section.subjects.includes(subject),
			);
		}, selectedSections[0].subjects);
	}

	async onSubmit(): Promise<void> {
		if (this.planForm.invalid) {
			this.sb.open(
				'Por favor, completa todos los campos requeridos.',
				'Ok',
				{ duration: 3000 },
			);
			return;
		}

		this.generating = true;
		this.generatedPlan = null;
		const formValue: any = this.planForm.value;

		const selectedSections = this.allClassSections.filter((s) =>
			formValue.classSections?.includes(s._id),
		);
		this.selectedGradesText = selectedSections
			.map((s) => s.name)
			.join(' y ');

		const prompt = multigradeClassPlanPrompt
			.replace('[grade_levels]', this.selectedGradesText)
			.replace(
				'[subject]',
				new PretifyPipe().transform(formValue.subject!),
			)
			.replace('[duration]', formValue.duration!.toString())
			.replace('[topics]', formValue.topics!)
			.replace(
				'[resources]',
				(formValue.resources as string[]).join(', '),
			)
			.replace('[teaching_style]', 'innovador'); // Estilo fijo por ahora

		try {
			const response = await this.aiService.geminiAi(prompt).toPromise();
			if (response) {
				const jsonStartsAt = response.response.indexOf('{');
				const jsonEndsAt = response.response.lastIndexOf('}') + 1;
				const jsonString = response.response.slice(
					jsonStartsAt,
					jsonEndsAt,
				);

				const parsedPlan = JSON.parse(jsonString);

				// Completamos el objeto del plan con datos del formulario y del usuario
				this.generatedPlan = {
					...parsedPlan,
					_id: `temp_${Date.now()}`,
					user: this.user()!,
					date: new Date(formValue.date!),
					section: selectedSections[0], // Usamos la primera sección para referencia
					subject: formValue.subject!,
				};

				this.sb.open('¡Plan multigrado generado con éxito!', 'Ok', {
					duration: 3000,
				});
			}
		} catch (error) {
			console.error('Error al generar el plan:', error);
			this.sb.open(
				'Hubo un error al generar el plan. Inténtalo de nuevo.',
				'Ok',
				{ duration: 4000 },
			);
		} finally {
			this.generating = false;
		}
	}
}
