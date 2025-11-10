import { Component, effect, inject, OnInit, OnDestroy } from '@angular/core';
import {
	FormArray,
	FormBuilder,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { EstimationScale } from '../../../core';
import { PdfService } from '../../../core/services/pdf.service';
import { EstimationScaleComponent } from '../components/estimation-scale.component';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { Subject, take, takeUntil } from 'rxjs';
import {
	askGemini,
	createScale,
	createScaleSuccess,
	loadBlocks,
	loadBlocksSuccess,
	loadEntries,
	loadSections,
	selectAiIsGenerating,
	selectAiSerializedResult,
	selectAllClassSections,
	selectAllCompetenceEntries,
	selectAuthUser,
	selectCreatingEstimationScale,
} from '../../../store';
import { PretifyPipe } from '../../../shared';

@Component({
	selector: 'app-estimation-scale-generator',
	imports: [
		EstimationScaleComponent,
		ReactiveFormsModule,
		MatFormFieldModule,
		MatSnackBarModule,
		MatButtonModule,
		MatSelectModule,
		MatInputModule,
		MatIconModule,
		PretifyPipe,
	],
	template: `
		<div>
			<div
				style="margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center;"
			>
				<h2>Generador de Escala de Estimaci&oacute;n</h2>
				<button mat-button routerLink="/assessments/estimation-scales">
					<mat-icon>assignment_turned_in</mat-icon>
					Mis Escalas de Estimaci&oacute;n
				</button>
			</div>
			<div>
				<form [formGroup]="scaleForm" (ngSubmit)="onSubmit()">
					<div>
						<mat-form-field appearance="outline">
							<mat-label>T&iacute;tulo</mat-label>
							<input
								formControlName="title"
								matInput
								type="tex"
							/>
						</mat-form-field>
					</div>
					<div class="grid-2">
						<div>
							<mat-form-field appearance="outline">
								<mat-label>Curso</mat-label>
								<mat-select
									formControlName="section"
									(selectionChange)="onSectionSelect($event)"
								>
									@for (
										section of sections();
										track section._id
									) {
										<mat-option [value]="section._id">{{
											section.name
										}}</mat-option>
									}
								</mat-select>
							</mat-form-field>
						</div>
						<div>
							<mat-form-field appearance="outline">
								<mat-label>Asignatura</mat-label>
								<mat-select
									formControlName="subject"
									(selectionChange)="onSubjectChange($event)"
								>
									@for (subject of subjects; track $index) {
										<mat-option [value]="subject">
											{{ subject | pretify }}
										</mat-option>
									}
								</mat-select>
							</mat-form-field>
						</div>
					</div>
					<div>
						<mat-form-field appearance="outline">
							<mat-label>Competencias Fundamentales</mat-label>
							<mat-select multiple formControlName="competence">
								@for (
									competence of competenceOptions;
									track competence
								) {
									<mat-option [value]="competence">{{
										competence
									}}</mat-option>
								}
							</mat-select>
						</mat-form-field>
					</div>
					<div>
						<mat-form-field appearance="outline">
							<mat-label>Indicadores de Logro</mat-label>
							<mat-select
								multiple
								formControlName="achievementIndicators"
							>
								@for (
									indicator of achievementIndicatorOptions;
									track indicator
								) {
									<mat-option [value]="indicator">{{
										indicator
									}}</mat-option>
								}
							</mat-select>
						</mat-form-field>
					</div>
					<div class="grid-2-1">
						<div>
							<mat-form-field appearance="outline">
								<mat-label>Evidencia o Actividad</mat-label>
								<input matInput formControlName="activity" />
							</mat-form-field>
						</div>
						<div>
							<mat-form-field appearance="outline">
								<mat-label>Cantidad de Criterios</mat-label>
								<input
									matInput
									type="number"
									formControlName="qty"
									min="3"
									max="15"
								/>
							</mat-form-field>
						</div>
					</div>
					<div formArrayName="levels" style="margin-bottom: 12px">
						<h3>Niveles de Desempe&ntilde;o</h3>
						@for (level of scaleLevels.controls; track $index) {
							<div style="display: flex">
								<div style="flex: 1 1 auto">
									<mat-form-field appearance="outline">
										<mat-label
											>Nivel {{ $index + 1 }}</mat-label
										>
										<input
											type="text"
											matInput
											[formControlName]="$index"
										/>
									</mat-form-field>
								</div>
								@if (scaleLevels.controls.length > 3) {
									<button
										type="button"
										mat-icon-button
										color="warn"
										(click)="removeLevel($index)"
									>
										<mat-icon>delete</mat-icon>
									</button>
								}
							</div>
						}
						<button
							style="width: 100%"
							type="button"
							mat-flat-button
							(click)="addLevel()"
							color="accent"
						>
							<mat-icon>add</mat-icon>
							Agregar Nivel
						</button>
					</div>
					<div style="text-align: end">
						<button
							type="submit"
							mat-button
							[disabled]="
								scaleForm.invalid || generating() || saving()
							"
						>
							<mat-icon>bolt</mat-icon>
							@if (generating()) {
								Generando...
							} @else {
								@if (estimationScale) {
									Regenerar
								} @else {
									Generar
								}
							}
						</button>
						@if (estimationScale) {
							<button
								style="margin-left: 12px; display: none;"
								type="button"
								[disabled]="saving() || generating()"
								mat-button
								color="accent"
								(click)="print()"
							>
								<mat-icon>download</mat-icon>
								Descargar
							</button>
							<button
								style="margin-left: 12px"
								type="button"
								[disabled]="saving() || generating()"
								mat-flat-button
								color="primary"
								(click)="save()"
							>
								<mat-icon>save</mat-icon>
								Guardar
							</button>
						}
					</div>
				</form>
			</div>
		</div>

		@if (estimationScale) {
			<div style="padding-bottom: 42px;">
				<app-estimation-scale [estimationScale]="estimationScale" />
			</div>
		}
	`,
	styles: `
		mat-form-field {
			min-width: 100%;
		}

		.grid-2 {
			display: grid;
			gap: 12px;
			grid-template-columns: 1fr;

			@media screen and (min-width: 960px) {
				grid-template-columns: 1fr 1fr;
			}
		}

		.grid-2-1 {
			display: grid;
			gap: 12px;
			grid-template-columns: 1fr;

			@media screen and (min-width: 960px) {
				grid-template-columns: 2fr 1fr;
			}
		}

		table {
			border-collapse: collapse;
			border: 1px solid #ccc;
			width: 100%;
		}

		td,
		tr,
		th {
			border: 1px solid #ccc;
		}

		td,
		th {
			padding: 12px;
		}
	`,
})
export class EstimationScaleGeneratorComponent implements OnInit, OnDestroy {
	#store = inject(Store);
	#actions$ = inject(Actions);
	private pdfService = inject(PdfService);
	private router = inject(Router);
	private sb = inject(MatSnackBar);
	private fb = inject(FormBuilder);

	public user = this.#store.selectSignal(selectAuthUser);
	public estimationScale: EstimationScale | null = null;
	public sections = this.#store.selectSignal(selectAllClassSections);
	public subjects: string[] = [];
	public competenceOptions: string[] = [];
	public achievementIndicatorOptions: string[] = [];
	public competenceCol = this.#store.selectSignal(selectAllCompetenceEntries);
	saving = this.#store.selectSignal(selectCreatingEstimationScale);
	generating = this.#store.selectSignal(selectAiIsGenerating);
	aiResult = this.#store.selectSignal(selectAiSerializedResult);

	private pretify = new PretifyPipe().transform;

	#destroy$ = new Subject<void>();

	public scaleForm = this.fb.group({
		title: ['', Validators.required],
		section: ['', Validators.required],
		subject: ['', Validators.required],
		competence: [['Comunicativa'], Validators.required],
		achievementIndicators: [[] as string[], Validators.required],
		activity: ['', Validators.required],
		qty: [5, [Validators.required, Validators.min(3), Validators.max(15)]],
		criteria: [[] as string[]],
		levels: this.fb.array([
			this.fb.control('Iniciado'),
			this.fb.control('En Proceso'),
			this.fb.control('Logrado'),
		]),
	});

	constructor() {
		this.competenceOptions = this.getCompentenceOptions();
		effect(() => {
			const aiResult: { criteria: string[] } = this.aiResult();
			const user = this.user();
			if (aiResult && user) {
				const {
					activity,
					subject,
					section: sectionId,
					title,
				} = this.scaleForm.value;
				const competence = this.competenceCol()
					.map((col) => col.entries)
					.flat();
				const achievementIndicators =
					this.scaleForm.get('achievementIndicators')?.value || [];
				const levels = this.scaleLevels.value || [];
				const section = this.sections().find(
					(s) => s._id === sectionId,
				);

				this.estimationScale = {
					user,
					achievementIndicators,
					activity,
					competence,
					criteria: aiResult.criteria,
					levels,
					title,
					section,
					subject,
				} as any;
			}
		});
	}

	ngOnInit(): void {
		this.#store.dispatch(loadSections());
	}

	ngOnDestroy() {
		this.#destroy$.next();
		this.#destroy$.complete();
	}

	loadCompetences(id?: string) {
		const sectionId = id || this.scaleForm.get('grade')?.value;
		if (!sectionId) return;

		const section = this.sections().find((g) => g._id === sectionId);
		if (!section) return;

		const subject = this.scaleForm.get('subject')?.value;
		if (!subject) return;

		const { year: grade, level } = section;
		this.#store.dispatch(
			loadEntries({ filters: { grade, level, subject } }),
		);
	}

	onSubmit() {
		const { qty, activity, subject, section, title } = this.scaleForm.value;
		const competence = this.competenceCol()
			.map((col) => col.entries)
			.flat();
		const levels = this.scaleLevels.value;
		const gradeStr = this.selectedSection
			? `${this.selectedSection.year.toLowerCase()} de educacion ${this.selectedSection.level === 'PRIMARIA' ? 'primaria' : 'secundaria'}`
			: '';
		const question = `Necesito que me escribas una lista con ${qty} criterios para evaluar (con una escala de estimacion) una actividad de ${this.pretify(subject || '')} que he realizado con mis alumnos de ${gradeStr}: "${activity}".
Las competencias que voy a evaluar son estas:
- ${competence.join('\n- ')}

Los indicadores de logro que pretendo lograr son estos:
- ${this.selectedIndicators.join('\n- ')}

Responde con un JSON con esta interfaz:
{
  criteria: string[] // los criterios para evaluar
}

Ya tengo los niveles de desempeno, asi que solo necesito los criterios. Los criterios deben ser claros y concisos, mientras mas breves (sin exagerar), mejor.`;
		this.#store.dispatch(askGemini({ question }));
	}

	save() {
		const scale: any = this.estimationScale;
		scale.user = this.user()?._id;
		this.#store.dispatch(createScale({ scale }));
		this.#actions$
			.pipe(
				ofType(createScaleSuccess),
				take(1),
				takeUntil(this.#destroy$),
			)
			.subscribe(({ scale }) => {
				this.router.navigate([
					'/assessments/estimation-scales/',
					scale._id,
				]);
			});
	}

	onSectionSelect(event: any) {
		const { value } = event;
		if (!value) {
			this.subjects = [];
			return;
		}
		const section = this.sections().find((s) => s._id === value);
		if (section) {
			this.subjects = section.subjects as any;
		} else {
			this.subjects = [];
		}
		this.loadCompetences(value);
		this.competenceOptions = this.getCompentenceOptions(value);
	}

	onSubjectChange(event: any) {
		const { value } = event;
		if (!value) {
			this.achievementIndicatorOptions = [];
			return;
		}
		const sectionId = this.scaleForm.get('section')?.value;
		const section = this.sections().find((s) => s._id === sectionId);
		this.loadCompetences(sectionId || '');
		if (section) {
			const { year, level } = section;
			const subject = value;
			this.#store.dispatch(
				loadBlocks({ filters: { year, level, subject } }),
			);
			this.#actions$
				.pipe(
					ofType(loadBlocksSuccess),
					take(1),
					takeUntil(this.#destroy$),
				)
				.subscribe(({ blocks }) => {
					if (blocks.length) {
						this.achievementIndicatorOptions = blocks
							.map((block) => block.achievement_indicators)
							.reduce((prev, curr) => {
								curr.forEach((s) => {
									if (!prev.includes(s)) {
										prev.push(s);
									}
								});
								return prev;
							}, [] as string[]);
					} else {
						this.achievementIndicatorOptions = [];
					}
				});
		} else {
			this.achievementIndicatorOptions = [];
		}
	}

	getCompentenceOptions(id?: string): string[] {
		const primary = [
			'Comunicativa',
			'Pensamiento Lógico, Creativo y Crítico Resolución de Problemas Tecnológica y Científica',
			'Ética y Ciudadana Desarrollo Personal y Espiritual Ambiental y de la Salud',
		];
		const secondary = [
			'Comunicativa',
			'Pensamiento Lógico, Creativo y Crítico',
			'Resolución de Problemas',
			'Tecnológica y Científica',
			'Ética y Ciudadana',
			'Desarrollo Personal y Espiritual',
			'Ambiental y de la Salud',
		];
		const sectionId = id || this.scaleForm.get('grade')?.value;
		if (!sectionId) {
			return secondary;
		}

		const section = this.sections().find((g) => g._id === sectionId);
		if (!section) {
			return secondary;
		}

		if (section.level === 'PRIMARIA') {
			return primary;
		}

		return secondary;
	}

	addLevel() {
		this.scaleLevels.push(this.fb.control(''));
	}

	removeLevel(index: number) {
		this.scaleLevels.removeAt(index);
	}

	print() {
		if (!this.estimationScale) return;
		this.sb.open(
			'Ya estamos exportando tu instrumento. Espera un momento.',
			'Ok',
			{ duration: 2500 },
		);
		this.pdfService.exportTableToPDF(
			'estimation-scale',
			this.estimationScale.title,
		);
	}

	get selectedSection() {
		return this.sections().find(
			(section) => section._id === this.scaleForm.get('section')?.value,
		);
	}

	get scaleLevels(): FormArray {
		return this.scaleForm.get('levels') as FormArray;
	}

	get selectedIndicators(): string[] {
		return this.scaleForm.get('achievementIndicators')?.value as string[];
	}
}
