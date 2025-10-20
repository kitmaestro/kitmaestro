import { Component, inject, input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {
	FormArray,
	FormBuilder,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import { RubricService } from '../../../core/services/rubric.service';
import { ClassSectionService } from '../../../core/services/class-section.service';
import { UserService } from '../../../core/services/user.service';
import { Rubric } from '../../../core';
import { Router, RouterLink } from '@angular/router';
import { Student } from '../../../core';
import { StudentsService } from '../../../core/services/students.service';
import { AiService } from '../../../core/services/ai.service';
import { ClassSection } from '../../../core';
import { SubjectConceptListService } from '../../../core/services/subject-concept-list.service';
import { ContentBlockService } from '../../../core/services/content-block.service';
import { PretifyPipe } from '../../../shared/pipes/pretify.pipe';
import { ContentBlock } from '../../../core';
import { SubjectConceptList } from '../../../core';
import { CompetenceService } from '../../../core/services/competence.service';
import { RubricComponent } from '../components/rubric.component';
import { UnitPlan } from '../../../core/models';
import { forkJoin, map } from 'rxjs';
import { IsPremiumComponent } from '../../../shared/ui/is-premium.component';

@Component({
	selector: 'app-rubric-generator',
	imports: [
		ReactiveFormsModule,
		MatSelectModule,
		MatCardModule,
		MatSnackBarModule,
		MatButtonModule,
		MatIconModule,
		MatFormFieldModule,
		MatInputModule,
		RouterLink,
		PretifyPipe,
		RubricComponent,
		IsPremiumComponent,
	],
	template: `
		<app-is-premium>
			<mat-card>
				<mat-card-header
					style="justify-content: space-between; align-items: center"
				>
					<h2 mat-card-title>Generador de Rúbricas</h2>
					<button mat-flat-button type="button" routerLink="/rubrics">
						Mis R&uacute;bricas
					</button>
				</mat-card-header>
				<mat-card-content>
					<form
						[formGroup]="rubricForm"
						(ngSubmit)="onSubmit()"
						style="margin-top: 24px"
					>
						<div>
							<mat-form-field appearance="outline">
								<mat-label>T&iacute;tulo</mat-label>
								<input formControlName="title" matInput />
							</mat-form-field>
						</div>
						<div class="grid-3-cols">
							@if (sections.length) {
								<mat-form-field
									style="max-width: 100%"
									appearance="outline"
								>
									<mat-label>Curso</mat-label>
									<mat-select
										formControlName="section"
										(selectionChange)="onSelectSection($event)"
									>
										@for (section of sections; track section._id) {
											<mat-option [value]="section._id">{{
												section.name
											}}</mat-option>
										}
									</mat-select>
								</mat-form-field>
							} @else {
								@if (!loading) {
									<div>
										<div>
											Para usar esta herramienta, primero tienes que
											crear una secci&oacute;n.
										</div>
										<div>
											<button
												mat-raised-button
												color="accent"
												type="button"
												[routerLink]="['/sections']"
											>
												Crear Una Secci&oacute;n
											</button>
										</div>
									</div>
								}
							}
							<mat-form-field appearance="outline">
								<mat-label>Asignatura</mat-label>
								<mat-select
									formControlName="subject"
									(selectionChange)="onSubjectSelect($event)"
								>
									@for (subject of subjects; track subject) {
										<mat-option [value]="subject">{{
											subject | pretify
										}}</mat-option>
									}
								</mat-select>
							</mat-form-field>
							<mat-form-field appearance="outline">
								<mat-label>Contenido</mat-label>
								<mat-select
									formControlName="content"
									(selectionChange)="onConceptSelect($event)"
								>
									@for (list of subjectConceptLists; track list) {
										@for (concept of list.concepts; track concept) {
											<mat-option [value]="concept">{{
												concept
											}}</mat-option>
										}
									}
								</mat-select>
							</mat-form-field>
							<mat-form-field appearance="outline">
								<mat-label>Tipo de R&uacute;brica</mat-label>
								<mat-select formControlName="rubricType">
									@for (type of rubricTypes; track type) {
										<mat-option [value]="type.id">{{
											type.label
										}}</mat-option>
									}
								</mat-select>
							</mat-form-field>
							<div>
								<mat-form-field appearance="outline">
									<mat-label>Evidencia o Actividad</mat-label>
									<input formControlName="activity" matInput />
								</mat-form-field>
							</div>
							<div style="display: flex; gap: 12px">
								<mat-form-field appearance="outline">
									<mat-label>Calificación Mínima</mat-label>
									<input formControlName="minScore" matInput />
								</mat-form-field>
								<mat-form-field appearance="outline">
									<mat-label>Calificación Máxima</mat-label>
									<input formControlName="maxScore" matInput />
								</mat-form-field>
							</div>
						</div>
						<div>
							<mat-form-field appearance="outline">
								<mat-label>Indicadores de Logro</mat-label>
								<mat-select
									multiple
									formControlName="achievementIndicators"
								>
									@for (
										indicator of achievementIndicators;
										track indicator
									) {
										<mat-option [value]="indicator">{{
											indicator
										}}</mat-option>
									}
								</mat-select>
							</mat-form-field>
						</div>
						<div
							style="
								display: flex;
								justify-content: space-between;
								align-items: center;
							"
						>
							<h3>Niveles de desempe&ntilde;o</h3>
							<button
								type="button"
								mat-mini-fab
								[disabled]="rubricLevels.controls.length > 4"
								color="accent"
								(click)="addRubricLevel()"
							>
								<mat-icon>add</mat-icon>
							</button>
						</div>
						<div formArrayName="levels">
							@for (level of rubricLevels.controls; track $index) {
								<div
									style="
										display: grid;
										gap: 12px;
										grid-template-columns: 1fr 42px;
									"
								>
									<mat-form-field appearance="outline">
										<mat-label>Nivel #{{ $index + 1 }}</mat-label>
										<input [formControlName]="$index" matInput />
									</mat-form-field>
									<button
										(click)="deleteLevel($index)"
										type="button"
										mat-mini-fab
										color="warn"
										style="margin-top: 8px"
									>
										<mat-icon>delete</mat-icon>
									</button>
								</div>
							}
						</div>
						@if (
							rubric &&
							rubric.rubricType === "Analítica (Global)" &&
							students.length === 0
						) {
							<div
								style="
									text-align: center;
									padding: 20px;
									background-color: #46a7f5;
									color: white;
									margin-bottom: 15px;
								"
							>
								Ya que no tienes alumnos registrados en esta secci&oacute;n,
								te hemos dejado espacios en blanco. Para mejores resultados,
								ve a la secci&oacute;n y registra tus estudiantes.
								<br />
								<br />
								<button
									[routerLink]="['/sections', rubric.section]"
									type="button"
									mat-raised-button
									color="link"
								>
									Detalles de la Secci&oacute;n
								</button>
							</div>
						}
						<div style="text-align: end">
							<!-- hidden button since it's autosaved -->
							<button
								type="button"
								[disabled]="!rubric"
								mat-raised-button
								color="accent"
								style="margin-right: 12px; display: none"
								(click)="save()"
							>
								Guardar
							</button>
							<button
								type="submit"
								[disabled]="rubricForm.invalid || generating"
								mat-raised-button
								[color]="rubric ? 'link' : 'primary'"
							>
								{{
									generating
										? "Generando..."
										: rubric
											? "Regenerar"
											: "Generar"
								}}
							</button>
						</div>
					</form>
				</mat-card-content>
			</mat-card>

			@if (rubric) {
				<mat-card
					style="
						margin-top: 24px;
						width: fit-content;
						margin-left: auto;
						margin-right: auto;
					"
				>
					<mat-card-content style="width: fit-content">
						<app-rubric [rubric]="rubric"></app-rubric>
					</mat-card-content>
				</mat-card>
			}
		</app-is-premium>
	`,
	styles: `
		.grid-3-cols {
			display: grid;
			gap: 12px;
			grid-template-columns: 1fr;

			@media screen and (min-width: 960px) {
				grid-template-columns: repeat(2, 1fr);
			}

			@media screen and (min-width: 1200px) {
				grid-template-columns: repeat(3, 1fr);
			}

			& > div {
				max-width: 100%;
			}
		}

		mat-form-field {
			width: 100%;
			max-width: 100%;
		}

		mat-select,
		select,
		input,
		textarea {
			max-width: 100%;
		}

		table {
			border-collapse: collapse;
			border: 1px solid #ccc;
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
export class RubricGeneratorComponent implements OnInit {
	private sb = inject(MatSnackBar);
	private fb = inject(FormBuilder);
	private rubricService = inject(RubricService);
	private aiService = inject(AiService);
	private sectionsService = inject(ClassSectionService);
	private router = inject(Router);
	private UserService = inject(UserService);
	private studentsService = inject(StudentsService);
	private competenceService = inject(CompetenceService);
	private sclService = inject(SubjectConceptListService);
	private contentBlockService = inject(ContentBlockService);

	unitPlan = input<UnitPlan | null>(null);

	sections: ClassSection[] = [];
	subjects: string[] = [];
	contentBlocks: ContentBlock[] = [];
	subjectConceptLists: SubjectConceptList[] = [];
	achievementIndicators: string[] = [];

	// selected data
	section: ClassSection | null = null;

	competence: string[] = [];

	User$ = this.UserService.getSettings();

	rubricTypes = [
		{ id: 'SINTETICA', label: 'Sintética (Una rubrica por estudiante)' },
		{
			id: 'ANALITICA',
			label: 'Analítica (Una rubrica para todos los estudiantes)',
		},
	];

	rubric: Rubric | null = null;

	generating = false;
	loading = true;

	students: Student[] = [];

	rubricForm = this.fb.group({
		title: [''],
		minScore: [
			40,
			[Validators.required, Validators.min(0), Validators.max(100)],
		],
		maxScore: [
			100,
			[Validators.required, Validators.min(5), Validators.max(100)],
		],
		section: ['', Validators.required],
		subject: ['', Validators.required],
		content: ['', Validators.required],
		activity: ['', Validators.required],
		scored: [true],
		rubricType: ['SINTETICA', Validators.required],
		achievementIndicators: [[] as string[]],
		levels: this.fb.array([
			this.fb.control('Receptivo'),
			this.fb.control('Resolutivo'),
			this.fb.control('Autónomo'),
			this.fb.control('Estratégico'),
		]),
	});

	ngOnInit() {
		this.loadSections();
		const unitPlan = this.unitPlan();
		if (unitPlan) {
			this.rubricForm.patchValue({
				section: unitPlan.section._id,
				subject: unitPlan.subjects[0] || '',
				content: unitPlan.contents.length
					? unitPlan.contents[0].concepts.length
						? unitPlan.contents[0].concepts[0]
						: ''
					: '',
				activity: `Evaluación del plan de unidad: ${unitPlan.title}`,
				achievementIndicators: unitPlan.contents.flatMap(
					(c) => c.achievement_indicators,
				),
			});
			this.onSelectSection({ value: unitPlan.section._id });
			this.onSubjectSelect({ value: unitPlan.subjects[0] });
			if (
				unitPlan.contents.length &&
				unitPlan.contents[0].concepts.length
			)
				this.onConceptSelect({
					value: unitPlan.contents[0].concepts[0],
				});
		}
	}

	loadSections() {
		this.loading = true;
		this.sectionsService.findSections().subscribe({
			next: (sections) => {
				this.sections = sections;
			},
			error: (err) => {
				console.log(err);
				this.loading = false;
			},
			complete: () => {
				this.loading = false;
			},
		});
	}

	loadContentBlocks() {
		this.loading = true;
	}

	onSelectSection(event: any) {
		const id = event.value;
		const section = this.sections.find((s) => s._id === id);
		if (section) {
			this.section = section;
			this.subjects = section.subjects;
		}
	}

	onSubjectSelect(event: any) {
		const subject = event.value;
		if (this.section) {
			this.sclService
				.findAll({
					subject,
					grade: this.section.year,
					level: this.section.level,
				})
				.subscribe({
					next: (res) => {
						this.subjectConceptLists = res;
					},
				});
		}
	}

	onConceptSelect(event: any) {
		const concept = event.value;
		const subject = this.rubricForm.get('subject')?.value || '';
		if (this.section) {
			const rubricTitlePrompt = `Necesito que me sugieras un titulo breve y conciso para una rubrica de evaluacion para ${this.pretify(subject)} de ${this.pretify(this.section.year)} de ${this.pretify(this.section.level)} (Republica Dominicana), cuyo contenido es "${concept}". El titulo debe ser en maximo 8 palabras y debe resumir el contenido a evaluar. Tambien vas a sugerir una actividad a realizar, esta tambien debe ser breve y concisa, en maximo 12 palabras. Tu respuesta debe ser un json valido con esta interfaz: { title: string; activity: string; }. Evita incluir "Rubrica", "Evaluacion", la asignatura o el grado en el titulo, simplemente el titulo de la actividad que se va a realizar, algunos ejemplos validos son: "Comunicamos las conclusiones de nuestros experimentos de fosilización", "Leemos y aprendemos con el cuento 'La sombrilla que perdió los colores'" o "Escribiendo cuentos sobre el futuro". Evita explicar la actividad, esta debe ser suficientemente sugerente para que un docente, incluso sin experiencia, la entienda.`;
			this.generating = true;
			this.achievementIndicators = [];
			this.competence = [];
			this.contentBlocks = [];
			forkJoin([
				this.competenceService.findAll({
					subject,
					grade: this.section.year,
					level: this.section.level,
				}),
				this.contentBlockService.findAll({
					subject,
					year: this.section.year,
					level: this.section.level,
					title: concept,
				}),
				this.aiService
					.geminiAi(rubricTitlePrompt)
					.pipe(map((res) => res.response)),
			]).subscribe({
				next: ([competence, contentBlocks, ai]) => {
					this.generating = false;
					this.competence = competence.flatMap(
						(entry) =>
							entry.entries[
								Math.round(
									Math.random() * (entry.entries.length - 1),
								)
							],
					);
					this.contentBlocks = contentBlocks;
					contentBlocks.forEach((block) => {
						const indicators: string[] = [];
						block.achievement_indicators.forEach((indicator) => {
							if (!indicators.includes(indicator)) {
								indicators.push(indicator);
							}
						});
						this.achievementIndicators = indicators;
						this.rubricForm.patchValue({
							achievementIndicators: indicators.slice(0, 3),
						});
					});
					try {
						const start = ai.indexOf('{');
						const limit = ai.lastIndexOf('}') + 1;
						const obj = JSON.parse(ai.slice(start, limit)) as {
							title: string;
							activity: string;
						};
						if (obj.title) {
							this.rubricForm.patchValue({
								title: obj.title,
							});
						}
						if (obj.activity) {
							this.rubricForm.patchValue({
								activity: obj.activity,
							});
						}
					} catch (e) {
						console.log('Error parsing AI response', e);
					}
				},
				error: (err) => {
					this.generating = false;
					console.log(err);
				},
			});
		}
	}

	onSubmit() {
		this.generating = true;
		this.loadStudents();
		this.createRubric(this.rubricForm.value);
	}

	loadStudents() {
		const { section } = this.rubricForm.value;
		if (section) {
			this.studentsService
				.findBySection(section)
				.subscribe((students) => {
					this.students = students;
				});
		}
	}

	save() {
		const rubric: any = this.rubric;
		if (this.unitPlan()) rubric.unitPlan = this.unitPlan()?._id;
		this.rubricService.create(rubric).subscribe((res) => {
			if (res._id) {
				this.router.navigate(['/rubrics/', res._id]).then(() => {
					this.sb.open('El instrumento ha sido guardado.', 'Ok', {
						duration: 2500,
					});
				});
			}
		});
	}

	createRubric(formValue: any) {
		const {
			title,
			minScore,
			maxScore,
			section,
			subject,
			content,
			activity,
			scored,
			rubricType,
			levels,
			achievementIndicators,
		} = formValue;
		if (!this.section) return;
		const data: any = {
			title,
			minScore,
			maxScore,
			level: this.section.level,
			grade: this.section.year,
			section,
			subject: this.pretify(subject),
			content,
			activity,
			scored,
			rubricType,
			achievementIndicators,
			competence: this.competence,
			levels,
		};
		const text = `Necesito que me construyas en contenido de una rubrica ${rubricType === 'SINTETICA' ? 'Sintética (Una rubrica por estudiante)' : 'Analítica (Una rubrica para todos los estudiantes)'} para evaluar el contenido de "${content}" de ${data.subject} de ${this.section.year} grado de educación ${this.section.level}.
La rubrica sera aplicada tras esta actividad/evidencia: ${activity}.${scored ? ' La rubrica tendra un valor de ' + minScore + ' a ' + maxScore + ' puntos.' : ''}
Los criterios a evaluar deben estar basados en estos indicadores de logro:
- ${achievementIndicators.join('\n- ')}
Cada criterio tendra ${levels.length} niveles de desempeño: ${levels.map((el: string, i: number) => i + ') ' + el).join(', ')}.
Tu respuesta debe ser un json valido con esta interfaz:
{${title ? '' : '\n\ttitle: string;'}
  criteria: { // un objeto 'criteria' por cada indicador/criterio a evaluar
    indicator: string, // indicador a evaluar
    maxScore: number, // maxima calificacion para este indicador
    criterion: { // array de niveles de desempeño del estudiante acorde a los niveles proporcionados
      name: string, // criterio que debe cumplir (descripcion, osea que si el indicador es 'Lee y comprende el cuento', un criterio seria 'Lee el cuento deficientemente', otro seria 'Lee el cuento pero no comprende su contenido' y otro seria 'Lee el cuento de manera fluida e interpreta su contenido')
      score: number, // calificacion a asignar
    }[]
  }[];
}`;
		this.aiService.geminiAi(text).subscribe({
			next: (result) => {
				const start = result.response.indexOf('{');
				const limit = result.response.lastIndexOf('}') + 1;
				const obj = JSON.parse(result.response.slice(start, limit)) as {
					title?: string;
					criteria: {
						indicator: string;
						maxScore: number;
						criterion: { name: string; score: number }[];
					}[];
				};
				if (!obj) {
					this.sb.open(
						'Error al generar la rubrica. Intentalo de nuevo.',
						'Ok',
						{ duration: 2500 },
					);
					this.generating = false;
					return;
				}
				const rubric: any = {
					criteria: obj.criteria,
					title: obj.title ? obj.title : title,
					rubricType,
					section,
					competence: this.competence,
					achievementIndicators,
					activity,
					progressLevels: levels,
					user: this.section?.user,
				};
				this.rubric = rubric;
				this.generating = false;
				this.save();
			},
			error: (error) => {
				this.sb.open(
					'Error al generar la rubrica. Intentelo de nuevo.',
					'Ok',
					{ duration: 2500 },
				);
				console.log(error.message);
				this.generating = false;
			},
		});
	}

	addRubricLevel() {
		this.rubricLevels.push(this.fb.control(''));
	}

	deleteLevel(pos: number) {
		this.rubricLevels.removeAt(pos);
	}

	pretify(str: string) {
		return new PretifyPipe().transform(str);
	}

	yearIndex(grade: string): number {
		return [
			'PRIMERO',
			'SEGUNDO',
			'TERCERO',
			'CUARTO',
			'QUINTO',
			'SEXTO',
		].indexOf(grade);
	}

	get rubricLevels() {
		return this.rubricForm.get('levels') as FormArray;
	}
}
