import { Component, inject, OnInit } from '@angular/core';
import {
	FormArray,
	FormBuilder,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { AiService } from '../../../core/services/ai.service';
import { User } from '../../../core/interfaces';
import { EstimationScaleService } from '../../../core/services/estimation-scale.service';
import { ClassSectionService } from '../../../core/services/class-section.service';
import { CompetenceService } from '../../../core/services/competence.service';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ClassSection } from '../../../core/interfaces/class-section';
import { CompetenceEntry } from '../../../core/interfaces/competence-entry';
import { ContentBlockService } from '../../../core/services/content-block.service';
import { EstimationScale } from '../../../core/interfaces/estimation-scale';
import { PdfService } from '../../../core/services/pdf.service';

@Component({
	selector: 'app-estimation-scale',
	imports: [
		ReactiveFormsModule,
		MatSnackBarModule,
		MatCardModule,
		MatFormFieldModule,
		MatSelectModule,
		MatInputModule,
		MatButtonModule,
		MatIconModule,
	],
	template: `
		<mat-card>
			<mat-card-header>
				<mat-card-title
					>Generador de Escala de Estimaci&oacute;n</mat-card-title
				>
			</mat-card-header>
			<mat-card-content>
				<form [formGroup]="scaleForm" (ngSubmit)="onSubmit()">
					<div>
						<mat-form-field appearance="outline">
							<mat-label>T&iacute;tulo</mat-label>
							<input formControlName="title" matInput type="tex" />
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
									@for (section of sections; track section._id) {
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
										<mat-option [value]="subject">{{
											pretifySubject(subject)
										}}</mat-option>
									}
								</mat-select>
							</mat-form-field>
						</div>
					</div>
					<div>
						<mat-form-field appearance="outline">
							<mat-label>Competencias Fundamentales</mat-label>
							<mat-select multiple formControlName="competence">
								@for (competence of competenceOptions; track $index) {
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
									track $index
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
										<mat-label>Nivel {{ $index + 1 }}</mat-label>
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
							Agregar Nivel
						</button>
					</div>
					<div style="text-align: end">
						<button
							type="submit"
							mat-flat-button
							[color]="estimationScale ? 'link' : 'primary'"
							[disabled]="scaleForm.invalid || generating || saving"
						>
							@if (generating) {
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
								style="margin-left: 12px"
								type="button"
								[disabled]="saving || generating"
								mat-flat-button
								color="accent"
								(click)="print()"
							>
								Descargar
							</button>
							<button
								style="margin-left: 12px"
								type="button"
								[disabled]="saving || generating"
								mat-flat-button
								color="primary"
								(click)="save()"
							>
								Guardar
							</button>
						}
					</div>
				</form>
			</mat-card-content>
		</mat-card>

		@if (estimationScale) {
			<mat-card style="margin-top: 24px">
				<mat-card-content>
					<div
						style="width: 8.5in; padding: 0.35in; margin: 0 auto"
						id="estimation-scale"
					>
						@if (selectedSection) {
							<div style="text-align: center">
								<h2 style="margin: 0px">
									{{ selectedSection.school.name }}
								</h2>
								<h3 style="margin: 0px">
									A&ntilde;o Escolar {{ schoolYear }}
								</h3>
								<h3 style="margin: 0px">
									{{ user?.title }}. {{ user?.firstname }}
									{{ user?.lastname }}
								</h3>
								<h2 style="margin: 0px">Escala de Estimaci&oacute;n</h2>
								<h3 style="margin: 0px">{{ estimationScale.title }}</h3>
							</div>
							<h3 style="text-align: end">{{ selectedSection.name }}</h3>
						}
						<div
							style="
								display: grid;
								gap: 12px;
								margin-bottom: 12px;
								grid-template-columns: 3fr 1fr;
							"
						>
							<div style="display: flex; gap: 12px">
								<div style="font-weight: bold">Estudiante:</div>
								<div
									style="
										border-bottom: 1px solid black;
										width: 100%;
										flex: 1 1 auto;
									"
								></div>
							</div>
							<div style="display: flex; gap: 12px">
								<div style="font-weight: bold">Fecha:</div>
								<div
									style="
										border-bottom: 1px solid black;
										width: 100%;
										flex: 1 1 auto;
									"
								></div>
							</div>
						</div>
						<h3
							style="
								font-weight: bold;
								margin-bottom: 8px;
								margin-top: 8px;
							"
						>
							Competencias Espec&iacute;ficas
						</h3>
						<ul style="list-style: none; margin: 0; padding: 0">
							@for (item of estimationScale.competence; track item) {
								<li>- {{ item }}</li>
							}
						</ul>
						<h3
							style="
								font-weight: bold;
								margin-bottom: 8px;
								margin-top: 8px;
							"
						>
							Indicadores de Logro
						</h3>
						<ul style="list-style: none; margin: 0 0 12px; padding: 0">
							@for (
								item of estimationScale.achievementIndicators;
								track item
							) {
								<li>- {{ item }}</li>
							}
						</ul>
						<p>
							<b>Evidencia o Actividad</b>: {{ estimationScale.activity }}
						</p>
						<table>
							<thead>
								<tr>
									<th>Indicador o Criterio</th>
									@for (
										level of estimationScale.levels;
										track level
									) {
										<th>{{ level }}</th>
									}
									<th>Observaciones</th>
								</tr>
							</thead>
							<tbody>
								@for (row of estimationScale.criteria; track row) {
									<tr>
										<td>{{ row }}</td>
										<td></td>
										<td></td>
										<td></td>
										<td></td>
									</tr>
								}
							</tbody>
						</table>
					</div>
				</mat-card-content>
			</mat-card>
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
export class EstimationScaleComponent implements OnInit {
	private estimationScaleService = inject(EstimationScaleService);
	private contentBlockService = inject(ContentBlockService);
	private competenceService = inject(CompetenceService);
	private sectionService = inject(ClassSectionService);
	private authService = inject(AuthService);
	private pdfService = inject(PdfService);
	private aiService = inject(AiService);
	private router = inject(Router);
	private sb = inject(MatSnackBar);
	private fb = inject(FormBuilder);

	public user: User | null = null;
	public estimationScale: EstimationScale | null = null;
	public sections: ClassSection[] = [];
	public subjects: string[] = [];
	public competenceOptions: string[];
	public achievementIndicatorOptions: string[] = [];
	public competenceCol: CompetenceEntry[] = [];

	public schoolYear =
		new Date().getMonth() > 6
			? `${new Date().getFullYear()} - ${new Date().getFullYear() + 1}`
			: `${new Date().getFullYear() - 1} - ${new Date().getFullYear()}`;
	saving = false;
	generating = false;

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
	}

	ngOnInit(): void {
		this.sectionService.findSections().subscribe((sections) => {
			if (sections.length) {
				this.sections = sections;
			}
		});
		this.authService.profile().subscribe((user) => {
			if (user) {
				this.user = user;
			}
		});
	}

	loadCompetences(id?: string) {
		const sectionId = id || this.scaleForm.get('grade')?.value;
		if (!sectionId) return;

		const section = this.sections.find((g) => g._id === sectionId);
		if (!section) return;

		this.competenceService
			.findByGrade(section.year)
			.subscribe((competence) => {
				this.competenceCol = competence.filter(
					(c) => c.subject === this.scaleForm.value.subject,
				);
			});
	}

	onSubmit() {
		this.generating = true;
		const { qty, activity, subject, section, title } = this.scaleForm.value;
		const competence = this.competenceCol.map((col) => col.entries).flat();
		const levels = this.scaleLevels.value;
		const gradeStr = this.selectedSection
			? `${this.selectedSection.year.toLowerCase()} de educacion ${this.selectedSection.level === 'PRIMARIA' ? 'primaria' : 'secundaria'}`
			: '';
		const query = `Necesito que me escribas una lista con ${qty} criterios para evaluar (con una escala de estimacion) una actividad de ${this.pretifySubject(subject || '')} que he realizado con mis alumnos de ${gradeStr}: "${activity}".
Las competencias que voy a evaluar son estas:
- ${competence.join('\n- ')}

Los indicadores de logro que pretendo lograr son estos:
- ${this.selectedIndicators.join('\n- ')}

Responde con un JSON con esta interfaz:
{
  criteria: string[]; // los criterios para evaluar
}

Ya tengo los niveles de desempeno, asi que solo necesito los criterios. Los criterios deben ser claros y concisos, mientras mas breves (sin exagerar), mejor.`;
		this.aiService.geminiAi(query).subscribe({
			next: (result) => {
				const start = result.response.indexOf('{');
				const limit = result.response.indexOf('}') + 1;
				const obj = JSON.parse(result.response.slice(start, limit)) as {
					criteria: string[];
				};
				const scale: any = {
					achievementIndicators: this.selectedIndicators,
					activity,
					competence,
					levels,
					section,
					subject,
					title,
					user: this.user?._id,
					criteria: obj.criteria,
				};
				this.scaleForm.get('criteria')?.setValue(obj.criteria);
				this.estimationScale = scale;
				this.generating = false;
			},
			error: (err) => {
				console.log(err.message);
				this.sb.open(
					'Ha ocurrido un error al generar, intentelo de nuevo.',
					'Ok',
					{ duration: 2500 },
				);
				this.generating = false;
			},
		});
	}

	save() {
		this.saving = true;
		const scale: any = this.estimationScale;
		scale.user = this.user?._id;
		this.estimationScaleService.create(scale).subscribe({
			next: (res) => {
				if (res._id) {
					this.router
						.navigate(['/assessments/estimation-scales/', res._id])
						.then(() => {
							this.sb.open(
								'Se ha guardado el instrumento',
								'Ok',
								{ duration: 2500 },
							);
						});
				}
			},
			error: (err) => {
				this.sb.open('Error al guardar', 'Ok', { duration: 2500 });
				this.saving = false;
			},
		});
	}

	pretifySubject(name: string) {
		switch (name) {
			case 'LENGUA_ESPANOLA':
				return 'Lengua Española';
			case 'MATEMATICA':
				return 'Matemática';
			case 'CIENCIAS_SOCIALES':
				return 'Ciencias Sociales';
			case 'CIENCIAS_NATURALES':
				return 'Ciencias de la Naturaleza';
			case 'INGLES':
				return 'Inglés';
			case 'FRANCES':
				return 'Francés';
			case 'FORMACION_HUMANA':
				return 'Formación Integral Humana y Religiosa';
			case 'EDUCACION_FISICA':
				return 'Educación Física';
			case 'EDUCACION_ARTISTICA':
				return 'Educación Artística';
			default:
				return 'Talleres Optativos';
		}
	}

	onSectionSelect(event: any) {
		const { value } = event;
		if (!value) {
			this.subjects = [];
			return;
		}
		const section = this.sections.find((s) => s._id === value);
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
		const section = this.sections.find((s) => s._id === sectionId);
		this.loadCompetences(sectionId || '');
		if (section) {
			const { year, level } = section;
			const subject = value;
			this.contentBlockService
				.findAll({ year, level, subject })
				.subscribe({
					next: (blocks) => {
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
					},
				});
		} else {
			this.achievementIndicatorOptions = [];
		}
	}

	getCompentenceOptions(id?: string): string[] {
		const primary = [
			'Comunicativa',
			'Pensamiento Lógico, Creativo y Crítico; Resolución de Problemas; Tecnológica y Científica',
			'Ética y Ciudadana; Desarrollo Personal y Espiritual; Ambiental y de la Salud',
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

		const section = this.sections.find((g) => g._id === sectionId);
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
		return this.sections.find(
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
