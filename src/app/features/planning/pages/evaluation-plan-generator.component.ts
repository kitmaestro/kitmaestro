import {
	Component,
	inject,
	OnInit,
	OnDestroy,
	signal,
	effect,
} from '@angular/core';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectAuthUser } from '../../../store/auth/auth.selectors';
import {
	selectAllClassSections,
	selectIsLoadingSections,
} from '../../../store/class-sections/class-sections.selectors';
import { loadSections } from '../../../store/class-sections/class-sections.actions';
import {
	askGemini,
	loadUnitPlans,
	selectAiIsGenerating,
	selectAiSerializedResult,
	selectAllUnitPlans,
	selectUnitPlanIsLoading,
} from '../../../store';
import { ClassSection, EvaluationPlanService, UnitPlan } from '../../../core';
import { EvaluationPlan } from '../../../core/models/evaluation-plan';
import { EvaluationPlanComponent } from '../components';

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
					<mat-icon>arrow_back</mat-icon>
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
						<mat-label>{{
							isLoadingPlans()
								? 'Cargando...'
								: 'Unidad de Aprendizaje'
						}}</mat-label>
						<mat-select
							formControlName="plan"
							required
							(selectionChange)="onPlanChange()"
						>
							@if (isLoadingPlans()) {
								<mat-option disabled>Loading...</mat-option>
							} @else {
								@for (plan of unitPlans(); track plan._id) {
									<mat-option [value]="plan._id">
										{{ plan.title }}
									</mat-option>
								}
							}
						</mat-select>
					</mat-form-field>
				</div>

				<div class="cols-2">
					<mat-form-field appearance="outline">
						<mat-label>Tipos de Evaluación</mat-label>
						<mat-select
							formControlName="evaluationTypes"
							multiple
							required
						>
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
						<mat-label>Participantes</mat-label>
						<mat-select
							formControlName="evaluationParticipants"
							multiple
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
					<button
						mat-button
						color="primary"
						style="display: none;"
						[disabled]="!generatedPlan()"
						(click)="copyToClipboard()"
					>
						Copiar al Portapapeles
					</button>
					<button
						mat-flat-button
						color="accent"
						[disabled]="!generatedPlan()"
						(click)="downloadAsDocx()"
						style="margin-right: 8px"
					>
						<mat-icon>file_download</mat-icon>
						Descargar DOCX
					</button>
					<button
						mat-button
						color="primary"
						(click)="savePlan()"
						[disabled]="!generatedPlan()"
						style="margin-right: 8px; display: none;"
					>
						<mat-icon>save</mat-icon>
						Guardar Planificación
					</button>
					<button
						mat-button
						color="primary"
						(click)="generateEvaluationPlan()"
						[disabled]="generating()"
					>
						<mat-icon>bolt</mat-icon>
						@if (generating()) {
							<span>Generando...</span>
						} @else {
							@if (generatedPlan()) {
								<span>Regenerar Planificación</span>
							} @else {
								<span>Generar Planificación</span>
							}
						}
					</button>
				</div>
			</form>
		</div>

		@if (generatedPlan()) {
			<div style="padding-top: 16px">
				<app-evaluation-plan
					[plan]="generatedPlan()"
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
	private fb = inject(FormBuilder);
	private sb = inject(MatSnackBar);
	private epService = inject(EvaluationPlanService);

	user = this.store.selectSignal(selectAuthUser);
	classSections = this.store.selectSignal(selectAllClassSections);
	isLoadingSections = this.store.selectSignal(selectIsLoadingSections);
	isLoadingPlans = this.store.selectSignal(selectUnitPlanIsLoading);
	unitPlans = this.store.selectSignal(selectAllUnitPlans);

	generating = this.store.selectSignal(selectAiIsGenerating);
	generatedEvaluationEntries = this.store.selectSignal(
		selectAiSerializedResult,
	);
	generatedPlan = signal<EvaluationPlan | null>(null);
	destroy$ = new Subject<void>();
	selectedPlan = signal<UnitPlan | null>(null);

	basicInfoForm = this.fb.group({
		classSection: ['', Validators.required],
		plan: ['', Validators.required],
		evaluationTypes: [[] as string[], Validators.required],
		evaluationParticipants: [[] as string[], Validators.required],
	});

	constructor() {
		effect(() => {
			const user = this.user();
			const { evaluationEntries } = this.generatedEvaluationEntries();
			const classSection = this.classSections().find(
				(cs) => cs._id == this.basicInfoForm.value.classSection,
			);
			const unitPlan = this.unitPlans().find(
				(p) => p._id == this.basicInfoForm.value.plan,
			);
			if (!user || !classSection || !unitPlan || !evaluationEntries)
				return;

			const plan: EvaluationPlan = {
				_id: '',
				createdAt: '',
				updatedAt: '',
				user,
				classSection,
				unitPlan,
				evaluationTypes: this.basicInfoForm.value
					.evaluationTypes as string[],
				evaluationParticipants: this.basicInfoForm.value
					.evaluationParticipants as string[],
				competence: unitPlan.competence,
				contentBlocks: unitPlan.contents,
				evaluationEntries,
			};

			this.generatedPlan.set(plan);
			console.log(plan);
		});
	}

	ngOnInit() {
		this.store.dispatch(loadSections());
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
		const evaluationParticipants =
			formData.evaluationParticipants as string[];
		const evaluationTypes = formData.evaluationTypes as string[];
		const user = this.user();

		if (
			!plan ||
			!classSection ||
			!user ||
			!evaluationParticipants.length ||
			!evaluationTypes.length
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
			evaluationParticipants: evaluationParticipants.join(', '),
			evaluationTypes: evaluationTypes.join(', '),
		};

		const prompt = this.epService.buildEvaluationPlanPrompt(data);
		this.store.dispatch(askGemini({ question: prompt }));
	}

	onSectionChange(event: MatSelectChange) {
		this.basicInfoForm.get('plan')?.reset();
		const sectionId = event.value;
		this.store.dispatch(loadUnitPlans({ filters: { section: sectionId } }));
	}

	onPlanChange() {
		const plan = this.unitPlans().find(
			(plan) => plan._id === this.basicInfoForm.value.plan,
		);
		if (plan) {
			this.selectedPlan.set(plan);
		}
	}

	async downloadAsDocx(): Promise<void> {
		const plan = this.generatedPlan();
		if (!plan) return;
		const result = await this.epService.downloadAsDocx(plan);
		if (result)
			this.sb.open('Plan descargado correctamente', 'Ok', {
				duration: 3000,
			});
		else
			this.sb.open('Error al descargar el plan', 'Ok', {
				duration: 3000,
			});
	}

	savePlan() {
		if (!this.generatedPlan()) return;

		// TODO: Implementar guardado en base de datos cuando esté disponible el backend
		this.sb.open('Funcionalidad de guardado pronto disponible', 'Ok', {
			duration: 3000,
		});
	}

	async copyToClipboard(): Promise<void> {
		const plan = this.generatedPlan();
		if (!plan) return;
		await this.epService.copyToClipboard(plan);
	}

	get selectedSection() {
		const sectionId = this.basicInfoForm.value.classSection;
		return this.classSections().find((s) => s._id === sectionId);
	}
}
