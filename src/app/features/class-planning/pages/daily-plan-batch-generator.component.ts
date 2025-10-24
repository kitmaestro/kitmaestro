import { Component, inject, Input, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { PretifyPipe } from '../../../shared/pipes/pretify.pipe';
import { UnitPlan } from '../../../core/models';
import { AiService } from '../../../core/services/ai.service';
import { ClassPlan, ClassSection } from '../../../core';
import { classroomResources } from '../../../config/constants';
import { IsPremiumComponent } from '../../../shared/ui/is-premium.component';
import { Store } from '@ngrx/store';
import {
	selectAuthUser,
	loadPlans,
	selectAllUnitPlans,
	selectUnitPlansIsLoading,
	createClassPlan,
	loadPlansSuccess,
} from '../../../store';

const classPlanPrompt = `
Eres un docente experto diseñando planes de clase diarios.
**Contexto de la Unidad:**
- **Asignatura:** class_subject
- **Grado:** class_year de class_level
- **Duración de esta clase:** class_duration minutos
- **Estilo de Docente:** teaching_style
- **Recursos Disponibles:** plan_resources
- **Competencias a desarrollar:** plan_compentece

**Tarea Específica para Hoy:**
Este es el plan de clases [plan_sequence] de la unidad. El enfoque principal de ESTA SESIÓN es trabajar en las siguientes actividades secuenciadas:
[class_topics]

**Tu Respuesta (JSON Válido):**
Basado en lo anterior, genera un plan de clases detallado con la siguiente estructura JSON. Asegúrate de que las actividades de inicio, desarrollo y cierre sean coherentes con las actividades específicas proporcionadas para hoy.
{
  "objective": "Intención pedagógica clara para ESTA sesión de clase.",
  "strategies": ["Estrategia de Enseñanza-Aprendizaje 1", "Estrategia 2"],
  "introduction": { "duration": 10, "activities": ["Actividad de inicio..."], "resources": ["Recurso 1"], "layout": "Organización de estudiantes" },
  "main": { "duration": 60, "activities": ["Actividad de desarrollo principal..."], "resources": ["Recurso 2"], "layout": "Organización" },
  "closing": { "duration": 20, "activities": ["Actividad de cierre..."], "resources": [], "layout": "Organización" },
  "competence": "Describe la competencia específica trabajada en esta sesión."
}
`;

// Interfaz para definir la estructura de un plan a generar
interface PlanToGenerate {
	subject: string;
	duration: number;
}
// --- COMPONENTE ---
@Component({
	selector: 'app-daily-plan-batch-generator',
	standalone: true,
	imports: [
		RouterModule,
		ReactiveFormsModule,
		MatSnackBarModule,
		MatButtonModule,
		MatProgressBarModule,
		MatIconModule,
		MatFormFieldModule,
		MatSelectModule,
		MatChipsModule,
		IsPremiumComponent,
	],
	template: `
		<app-is-premium minSubscriptionType="Plan Plus">
			<div class="container">
				<div>
					@if (!unitPlanInput) {
						<div class="header">
							<h2>Generador por Lotes de Planes Diarios</h2>
						</div>
					}
					<div>
						<form
							[formGroup]="generatorForm"
							(ngSubmit)="generateDailyPlansBatch()"
						>
							@if (!unitPlanInput) {
								<mat-form-field appearance="outline">
									<mat-label
										>Unidad de Aprendizaje Base</mat-label
									>
									<mat-select formControlName="unitPlan">
										@if (isLoadingUnits()) {
											<mat-option
												>Cargando
												unidades...</mat-option
											>
										}
										@for (
											plan of allUnitPlans();
											track $index
										) {
											<mat-option [value]="plan._id">{{
												plan.title
											}}</mat-option>
										}
									</mat-select>
								</mat-form-field>
							}
							<mat-form-field appearance="outline">
								<mat-label>Estilo de Enseñanza</mat-label>
								<mat-select formControlName="teachingStyle">
									@for (
										style of teachingStyles;
										track $index
									) {
										<mat-option [value]="style.id">{{
											style.label
										}}</mat-option>
									}
								</mat-select>
							</mat-form-field>
							<div class="resource-section">
								<mat-label
									><b>Recursos Disponibles</b></mat-label
								>
								<mat-chip-listbox
									formControlName="resources"
									multiple
								>
									@for (
										resource of availableResources;
										track $index
									) {
										<mat-chip-option [value]="resource">{{
											resource
										}}</mat-chip-option>
									}
								</mat-chip-listbox>
							</div>
							@if (isGenerating) {
								<div class="progress-section">
									<p>
										Generando planes diarios, por favor
										espere...
									</p>
									<mat-progress-bar
										mode="determinate"
										[value]="
											(plansGenerated /
												totalPlansToGenerate) *
											100
										"
									></mat-progress-bar>
									<p class="progress-label">
										{{ plansGenerated }} /
										{{ totalPlansToGenerate }} planes
										generados
									</p>
								</div>
							}
							<div class="mat-card-actions">
								<button
									mat-flat-button
									color="primary"
									type="submit"
									[disabled]="
										isGenerating || generatorForm.invalid
									"
								>
									<mat-icon>bolt</mat-icon>
									{{
										isGenerating
											? 'Generando...'
											: 'Iniciar Generación'
									}}
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</app-is-premium>
	`,
	styles: [
		`
			.container {
				width: 100%;
				max-width: 1400px;
				margin: 24px auto;
			}
			div form {
				display: flex;
				flex-direction: column;
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
			.progress-label {
				text-align: center;
				margin-top: 8px;
				font-weight: 500;
				color: #666;
			}
			div.mat-card-actions {
				display: flex;
				justify-content: end;
				padding: 16px 0 0 !important;
				gap: 8px;
			}
		`,
	],
})
export class DailyPlanBatchGeneratorComponent implements OnInit {
	@Input('plan') unitPlanInput: UnitPlan | null = null;
	private router = inject(Router);
	private sb = inject(MatSnackBar);
	private fb = inject(FormBuilder);
	private aiService = inject(AiService);
	private pretifyPipe = new PretifyPipe().transform;
	#store = inject(Store);

	user = this.#store.selectSignal(selectAuthUser);
	allUnitPlans = this.#store.selectSignal(selectAllUnitPlans);

	isLoadingUnits = this.#store.selectSignal(selectUnitPlansIsLoading);
	isGenerating = false;
	plansGenerated = 0;
	totalPlansToGenerate = 0;

	availableResources = classroomResources;
	teachingStyles = [
		{ id: 'tradicional', label: 'Docente Tradicional' },
		{ id: 'innovador', label: 'Docente Innovador(a)' },
		{ id: 'dinámico', label: 'Docente Dinámico(a)' },
		{ id: 'facilitador', label: 'Docente 3.0 (Facilitador/a)' },
	];

	generatorForm = this.fb.group({
		unitPlan: ['', Validators.required],
		teachingStyle: ['innovador', Validators.required],
		resources: [
			['Pizarra', 'Libros de texto', 'Cuadernos'],
			Validators.required,
		],
	});

	ngOnInit(): void {
		const res = localStorage.getItem('available-resources') as string;
		const resources = res ? JSON.parse(res) : null;
		if (resources && Array.isArray(resources) && resources.length > 0) {
			this.generatorForm.get('resources')?.setValue(resources);
		}
		if (this.unitPlanInput) {
			this.#store.dispatch(
				loadPlansSuccess({ plans: [this.unitPlanInput] }),
			);
			this.generatorForm
				.get('unitPlan')
				?.setValue(this.unitPlanInput._id);
		} else {
			this.#store.dispatch(loadPlans({}));
		}
	}

	async generateDailyPlansBatch(): Promise<void> {
		if (this.generatorForm.invalid) {
			this.handleError('Por favor, completa todos los campos.');
			return;
		}
		localStorage.setItem(
			'available-resources',
			JSON.stringify(this.generatorForm.value.resources),
		);

		const selectedUnitPlan = this.allUnitPlans().find(
			(p) => p._id === this.generatorForm.value.unitPlan,
		);

		if (!selectedUnitPlan || !selectedUnitPlan.section) {
			this.handleError(
				'La unidad de aprendizaje seleccionada es inválida.',
			);
			return;
		}

		const plansToGenerate = this.calculateRequiredPlans(
			selectedUnitPlan,
			selectedUnitPlan.section,
		);
		const sequencedActivities = this.sequenceActivitiesForUnit(
			selectedUnitPlan,
			plansToGenerate,
		);

		if (plansToGenerate.length === 0) {
			this.sb.open(
				'No se requieren planes diarios para esta unidad.',
				'Ok',
				{ duration: 5000 },
			);
			return;
		}

		this.isGenerating = true;
		this.totalPlansToGenerate = plansToGenerate.length;
		this.plansGenerated = 0;
		let currentDate = new Date();
		const subjectCounters = new Map<string, number>();

		for (const planInfo of plansToGenerate) {
			try {
				const counter = subjectCounters.get(planInfo.subject) || 0;
				const activitiesForThisClass =
					sequencedActivities.get(planInfo.subject)?.[counter] || [];

				await this.generateAndSaveSinglePlan(
					planInfo,
					currentDate,
					selectedUnitPlan,
					activitiesForThisClass,
				);

				this.plansGenerated++;
				subjectCounters.set(planInfo.subject, counter + 1);
				currentDate = this.getNextWorkDay(currentDate);
				await new Promise((resolve) => setTimeout(resolve, 2000));
			} catch (error) {
				this.handleError(
					`Error al generar plan para ${this.pretifyPipe(planInfo.subject)}.`,
				);
			}
		}

		this.isGenerating = false;
		this.sb.open('¡Planes diarios generados y guardados con éxito!', 'Ok', {
			duration: 5000,
		});
		this.router.navigateByUrl('/planning/class-plans/list');
	}

	private sequenceActivitiesForUnit(
		unitPlan: UnitPlan,
		plansToGenerate: PlanToGenerate[],
	): Map<string, string[][]> {
		const sequencedMap = new Map<string, string[][]>();

		for (const subject of unitPlan.subjects) {
			const teacherActivities =
				unitPlan.teacherActivities.find((a) => a.subject === subject)
					?.activities || [];
			const evaluationActivities =
				unitPlan.evaluationActivities.find((a) => a.subject === subject)
					?.activities || [];
			const allActivities = [
				...teacherActivities,
				...evaluationActivities,
			];

			const numClassesForSubject = plansToGenerate.filter(
				(p) => p.subject === subject,
			).length;
			if (numClassesForSubject === 0 || allActivities.length === 0) {
				sequencedMap.set(subject, []);
				continue;
			}

			const chunkSize = Math.ceil(
				allActivities.length / numClassesForSubject,
			);
			const chunks: string[][] = [];
			for (let i = 0; i < allActivities.length; i += chunkSize) {
				chunks.push(allActivities.slice(i, i + chunkSize));
			}
			sequencedMap.set(subject, chunks);
		}
		return sequencedMap;
	}

	private async generateAndSaveSinglePlan(
		planInfo: PlanToGenerate,
		date: Date,
		unitPlan: UnitPlan,
		activitiesForThisClass: string[],
	): Promise<void> {
		const { teachingStyle, resources } = this.generatorForm.value;
		if (!unitPlan.section || !this.user() || !teachingStyle || !resources)
			throw new Error('Datos de formulario insuficientes.');

		const subjectContents = unitPlan.contents
			.filter((c) => c.subject === planInfo.subject)
			.map((c) => `- ${c.title}: ${c.concepts.join(', ')}`)
			.join('\n');

		const activitiesText =
			activitiesForThisClass.length > 0
				? activitiesForThisClass.map((a) => `- ${a}`).join('\n')
				: 'Desarrollar actividades introductorias sobre el tema de la unidad.';

		const prompt = classPlanPrompt
			.replace('class_subject', this.pretifyPipe(planInfo.subject))
			.replace('class_duration', planInfo.duration.toString())
			.replace('class_topics', activitiesText)
			.replace('class_year', unitPlan.section.year)
			.replace('class_level', unitPlan.section.level)
			.replace('teaching_style', teachingStyle)
			.replace('plan_resources', (resources as string[]).join(', '))
			.replace(
				'plan_compentece',
				`Contenidos de la unidad: ${subjectContents}`,
			)
			.replace(
				'[plan_sequence]',
				`Este es el plan numero ${this.plansGenerated + 1} de ${this.totalPlansToGenerate}. Toma en cuenta los planes previos para mantener coherencia.`,
			);

		const aiResponse = await this.aiService.geminiAi(prompt).toPromise();
		if (!aiResponse?.response)
			throw new Error('Respuesta inválida de la IA.');

		const planJson = this.extractJson(aiResponse.response);
		if (!planJson)
			throw new Error('No se pudo extraer el JSON de la respuesta.');

		const newPlan: Partial<ClassPlan> = {
			...planJson,
			user: this.user()?._id,
			section: unitPlan.section._id,
			date: date,
			subject: planInfo.subject,
			duration: planInfo.duration,
			unitPlan: unitPlan._id,
		};

		this.#store.dispatch(createClassPlan({ plan: newPlan }));
	}

	// --- Métodos de Cálculo y Ayuda (sin cambios) ---
	private calculateRequiredPlans(
		unitPlan: UnitPlan,
		section: ClassSection,
	): PlanToGenerate[] {
		const { level, year } = section;
		const subjectsInUnit = unitPlan.subjects || [];
		const durationInWeeks = unitPlan.duration || 0;
		let weeklySchedule: PlanToGenerate[] = [];

		if (level === 'PRIMARIA') {
			const isFirstCycle = ['PRIMERO', 'SEGUNDO', 'TERCERO'].includes(
				year,
			);
			if (isFirstCycle) {
				weeklySchedule = [
					...this.createClassSessions(5, 1, 4, 'LENGUA_ESPANOLA'),
					...this.createClassSessions(5, 1, 4, 'MATEMATICA'),
					...this.createClassSessions(3, 1, 2, 'CIENCIAS_SOCIALES'),
					...this.createClassSessions(3, 1, 2, 'CIENCIAS_NATURALES'),
					...this.createClassSessions(2, 2, 0, 'FORMACION_HUMANA'),
					...this.createClassSessions(3, 3, 0, 'EDUCACION_ARTISTICA'),
					...this.createClassSessions(3, 3, 0, 'EDUCACION_FISICA'),
				];
			} else {
				weeklySchedule = [
					...this.createClassSessions(4, 1, 3, 'LENGUA_ESPANOLA'),
					...this.createClassSessions(4, 1, 3, 'MATEMATICA'),
					...this.createClassSessions(3, 1, 2, 'CIENCIAS_SOCIALES'),
					...this.createClassSessions(3, 1, 2, 'CIENCIAS_NATURALES'),
					...this.createClassSessions(2, 0, 2, 'INGLES'),
					...this.createClassSessions(2, 2, 0, 'FORMACION_HUMANA'),
					...this.createClassSessions(3, 3, 0, 'EDUCACION_FISICA'),
					...this.createClassSessions(3, 3, 0, 'EDUCACION_ARTISTICA'),
				];
			}
		} else if (level === 'SECUNDARIA') {
			weeklySchedule = [
				...this.createClassSessions(2, 2, 0, 'FRANCES'),
				...this.createClassSessions(2, 2, 0, 'FORMACION_HUMANA'),
				...this.createClassSessions(2, 2, 0, 'EDUCACION_ARTISTICA'),
				...this.createClassSessions(2, 2, 0, 'EDUCACION_FISICA'),
				...this.createClassSessions(3, 0, 3, 'CIENCIAS_NATURALES'),
				...this.createClassSessions(3, 0, 3, 'LENGUA_ESPANOLA'),
				...this.createClassSessions(2, 0, 2, 'INGLES'),
				...this.createClassSessions(3, 1, 2, 'CIENCIAS_SOCIALES'),
				...this.createClassSessions(4, 1, 3, 'MATEMATICA'),
			];
		}

		const filteredSchedule = weeklySchedule.filter((p) =>
			subjectsInUnit.includes(p.subject),
		);
		const totalPlans: PlanToGenerate[] = [];
		for (let i = 0; i < durationInWeeks; i++) {
			totalPlans.push(...filteredSchedule);
		}
		return totalPlans;
	}
	private createClassSessions(
		total: number,
		num45: number,
		num90: number,
		subject: string,
	): PlanToGenerate[] {
		const sessions: PlanToGenerate[] = [];
		for (let i = 0; i < num45; i++)
			sessions.push({ subject, duration: 45 });
		for (let i = 0; i < num90; i++)
			sessions.push({ subject, duration: 90 });
		return sessions;
	}
	private getNextWorkDay(date: Date): Date {
		const newDate = new Date(date);
		newDate.setDate(newDate.getDate() + 1);
		if (newDate.getDay() === 6) newDate.setDate(newDate.getDate() + 2); // Si es Sábado, pasa al Lunes
		if (newDate.getDay() === 0) newDate.setDate(newDate.getDate() + 1); // Si es Domingo, pasa al Lunes
		return newDate;
	}
	private extractJson(text: string): any {
		try {
			const start = text.indexOf('{');
			const end = text.lastIndexOf('}') + 1;
			if (start === -1 || end === 0) return null;
			return JSON.parse(text.slice(start, end));
		} catch (error) {
			console.error('Error al parsear JSON:', error, 'Texto:', text);
			return null;
		}
	}
	private handleError(message: string): void {
		this.sb.open(message, 'Ok', { duration: 5000 });
		this.isGenerating = false;
	}
}
