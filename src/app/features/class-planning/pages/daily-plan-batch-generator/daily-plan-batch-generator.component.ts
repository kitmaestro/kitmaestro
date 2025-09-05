import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { UnitPlanService } from '../../../../core/services/unit-plan.service';
import { ClassPlansService } from '../../../../core/services/class-plans.service';
import { AiService } from '../../../../core/services/ai.service';
import { UserSettingsService } from '../../../../core/services/user-settings.service';
import { UnitPlan } from '../../../../core/interfaces/unit-plan';
import { UserSettings } from '../../../../core/interfaces/user-settings';
import {
	classPlanPrompt,
	classroomResources,
} from '../../../../config/constants';
import { PretifyPipe } from '../../../../shared/pipes/pretify.pipe';
import { ClassPlan } from '../../../../core/interfaces/class-plan';
import { ClassSection } from '../../../../core/interfaces/class-section';

// Interfaz para definir la estructura de un plan a generar
interface PlanToGenerate {
	subject: string;
	duration: number;
}

@Component({
	selector: 'app-daily-plan-batch-generator',
	standalone: true,
	imports: [
		CommonModule,
		RouterModule,
		ReactiveFormsModule,
		MatCardModule,
		MatSnackBarModule,
		MatButtonModule,
		MatProgressBarModule,
		MatIconModule,
		MatFormFieldModule,
		MatSelectModule,
		MatChipsModule,
	],
	template: `
		<div class="container">
			<mat-card>
				@if (!unitPlanInput) {
					<mat-card-header class="header">
						<mat-card-title>
							<h2>Generador por Lotes de Planes Diarios</h2>
						</mat-card-title>
					</mat-card-header>
				}
				<mat-card-content>
					<form
						[formGroup]="generatorForm"
						(ngSubmit)="generateDailyPlansBatch()"
					>
						<!-- Selector de Unidad de Aprendizaje -->
						 @if (!unitPlanInput) {
							 <mat-form-field appearance="outline">
								 <mat-label>Unidad de Aprendizaje Base</mat-label>
								 <mat-select formControlName="unitPlan">
									 <mat-option *ngIf="isLoadingUnits"
										 >Cargando unidades...</mat-option
									 >
									 <mat-option
										 *ngFor="let plan of allUnitPlans"
										 [value]="plan._id"
									 >
										 {{ plan.title }}
									 </mat-option>
								 </mat-select>
							 </mat-form-field>
						 }

						<!-- Selector de Estilo de Enseñanza -->
						<mat-form-field appearance="outline">
							<mat-label>Estilo de Enseñanza</mat-label>
							<mat-select formControlName="teachingStyle">
								<mat-option
									*ngFor="let style of teachingStyles"
									[value]="style.id"
								>
									{{ style.label }}
								</mat-option>
							</mat-select>
						</mat-form-field>

						<!-- Selector de Recursos -->
						<div class="resource-section">
							<mat-label>Recursos Disponibles</mat-label>
							<mat-chip-listbox
								formControlName="resources"
								multiple
							>
								<mat-chip-option
									*ngFor="let resource of availableResources"
									[value]="resource"
								>
									{{ resource }}
								</mat-chip-option>
							</mat-chip-listbox>
						</div>

						<!-- Sección de Progreso -->
						<div *ngIf="isGenerating" class="progress-section">
							<p>Generando planes diarios, por favor espere...</p>
							<mat-progress-bar
								mode="determinate"
								[value]="
									(plansGenerated / totalPlansToGenerate) *
									100
								"
							></mat-progress-bar>
							<p class="progress-label">
								{{ plansGenerated }} /
								{{ totalPlansToGenerate }} planes generados
							</p>
						</div>

						<mat-card-actions align="end">
							<button
								mat-stroked-button
								[routerLink]="['/unit-plans', 'list']"
							>
								Volver
							</button>
							<button
								mat-raised-button
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
						</mat-card-actions>
					</form>
				</mat-card-content>
			</mat-card>
		</div>
	`,
	styles: [
		`
			:host {
				display: flex;
				justify-content: center;
				padding: 24px;
			}
			.container {
				width: 100%;
				// max-width: 800px;
			}
			mat-card-content form {
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
			mat-card-actions {
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
	private unitPlanService = inject(UnitPlanService);
	private classPlanService = inject(ClassPlansService);
	private aiService = inject(AiService);
	private userSettingsService = inject(UserSettingsService);
	private pretifyPipe = new PretifyPipe();

	userSettings: UserSettings | null = null;
	allUnitPlans: UnitPlan[] = [];

	isLoadingUnits = true;
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
		this.userSettingsService
			.getSettings()
			.subscribe((settings) => (this.userSettings = settings));

		if (this.unitPlanInput) {
			// Si se proporciona un plan, se usa directamente
			this.allUnitPlans = [this.unitPlanInput];
			this.generatorForm
				.get('unitPlan')
				?.setValue(this.unitPlanInput._id);
			this.isLoadingUnits = false;
		} else {
			// Si no, se cargan todos los planes para el selector
			this.unitPlanService.findAll().subscribe({
				next: (plans) => {
					this.allUnitPlans = plans;
					this.isLoadingUnits = false;
				},
				error: () =>
					this.handleError(
						'No se pudieron cargar las unidades de aprendizaje.',
					),
			});
		}
	}

	async generateDailyPlansBatch(): Promise<void> {
		if (this.generatorForm.invalid) {
			this.handleError('Por favor, completa todos los campos.');
			return;
		}
		const resources = this.generatorForm.value.resources;
		if (resources && resources.length > 0) {
			localStorage.setItem(
				'available-resources',
				JSON.stringify(resources),
			);
		}

		const selectedUnitPlanId = this.generatorForm.value.unitPlan;
		const selectedUnitPlan = this.allUnitPlans.find(
			(p) => p._id === selectedUnitPlanId,
		);

		if (!selectedUnitPlan || !selectedUnitPlan.section) {
			this.handleError(
				'La unidad de aprendizaje seleccionada es inválida o no tiene un curso asociado.',
			);
			return;
		}

		const plansToGenerate = this.calculateRequiredPlans(
			selectedUnitPlan,
			selectedUnitPlan.section,
		);
		if (plansToGenerate.length === 0) {
			this.sb.open(
				'No se requieren planes diarios para las asignaturas de esta unidad.',
				'Ok',
				{ duration: 5000 },
			);
			return;
		}

		this.isGenerating = true;
		this.totalPlansToGenerate = plansToGenerate.length;
		this.plansGenerated = 0;
		let currentDate = new Date();

		for (const planInfo of plansToGenerate) {
			try {
				await this.generateAndSaveSinglePlan(
					planInfo,
					currentDate,
					selectedUnitPlan,
				);
				this.plansGenerated++;
				currentDate = this.getNextWorkDay(currentDate);
				await new Promise((resolve) => setTimeout(resolve, 2000)); // Intervalo de 2 segundos
			} catch (error) {
				console.error(
					`Error generando plan para ${planInfo.subject}:`,
					error,
				);
				this.sb.open(
					`Error al generar un plan para ${this.pretifyPipe.transform(planInfo.subject)}.`,
					'Ok',
					{ duration: 4000 },
				);
			}
		}

		this.isGenerating = false;
		this.sb.open('¡Planes diarios generados y guardados con éxito!', 'Ok', {
			duration: 5000,
		});
		this.router.navigate(['/class-plans', 'list']);
	}

	private async generateAndSaveSinglePlan(
		planInfo: PlanToGenerate,
		date: Date,
		unitPlan: UnitPlan,
	): Promise<void> {
		const { teachingStyle, resources } = this.generatorForm.value;
		if (
			!unitPlan.section ||
			!this.userSettings ||
			!teachingStyle ||
			!resources
		)
			throw new Error('Datos insuficientes.');

		const subjectContents = unitPlan.contents
			.filter((c) => c.subject === planInfo.subject)
			.map((c) => `- ${c.title}: ${c.concepts.join(', ')}`)
			.join('\n');

		const subjectActivities = (
			unitPlan.teacherActivities.find(
				(a) => a.subject === planInfo.subject,
			)?.activities || []
		)
			.concat(
				unitPlan.studentActivities.find(
					(a) => a.subject === planInfo.subject,
				)?.activities || [],
			)
			.map((a) => `- ${a}`)
			.join('\n');

		const prompt = classPlanPrompt
			.replace(
				'class_subject',
				this.pretifyPipe.transform(planInfo.subject),
			)
			.replace('class_duration', planInfo.duration.toString())
			.replace(
				'class_topics',
				`Basado en los siguientes contenidos de la unidad:\n${subjectContents}\n\nY las siguientes actividades generales:\n${subjectActivities}`,
			)
			.replace('class_year', unitPlan.section.year)
			.replace('class_level', unitPlan.section.level)
			.replace('teaching_style', teachingStyle)
			.replace('plan_resources', (resources as string[]).join(', '))
			.replace(
				'plan_compentece',
				'Generar indicadores de logro relevantes para los temas y actividades.',
			);

		const aiResponse = await this.aiService.geminiAi(prompt).toPromise();
		if (!aiResponse?.response)
			throw new Error('Respuesta inválida de la IA.');

		const planJson = this.extractJson(aiResponse.response);

		const newPlan: Partial<ClassPlan> = {
			...planJson,
			user: this.userSettings._id,
			section: unitPlan.section._id,
			date: date,
			subject: planInfo.subject,
			duration: planInfo.duration,
			unitPlan: unitPlan._id,
		};

		await this.classPlanService.addPlan(newPlan as ClassPlan).toPromise();
	}

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
		if (newDate.getDay() === 6) newDate.setDate(newDate.getDate() + 2);
		if (newDate.getDay() === 0) newDate.setDate(newDate.getDate() + 1);
		return newDate;
	}

	private extractJson(text: string): any {
		try {
			const start = text.indexOf('{');
			const end = text.lastIndexOf('}') + 1;
			if (start === -1 || end === 0)
				throw new Error('JSON no encontrado.');
			return JSON.parse(text.slice(start, end));
		} catch (error) {
			console.error('Error al parsear JSON:', error, 'Texto:', text);
			throw new Error('Respuesta de IA con formato JSON inválido.');
		}
	}

	private handleError(message: string): void {
		this.sb.open(message, 'Ok', { duration: 5000 });
		this.isGenerating = false;
		this.isLoadingUnits = false;
	}
}
