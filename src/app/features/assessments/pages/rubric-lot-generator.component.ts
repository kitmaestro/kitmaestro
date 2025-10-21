import { Component, inject, OnInit } from '@angular/core';
import {
	FormArray,
	FormBuilder,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';
import { forkJoin, from, concatMap, of, EMPTY, finalize } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

// Importaciones de Material y otros módulos
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';

// Interfaces y Servicios del Core
import { ClassSection } from '../../../core';
import { Rubric } from '../../../core';
import { ClassSectionService } from '../../../core/services/class-section.service';
import { SubjectConceptListService } from '../../../core/services/subject-concept-list.service';
import { ContentBlockService } from '../../../core/services/content-block.service';
import { CompetenceService } from '../../../core/services/competence.service';
import { AiService } from '../../../core/services/ai.service';
import { RubricService } from '../../../core/services/rubric.service';
import { PretifyPipe } from '../../../shared/pipes/pretify.pipe';
import { IsPremiumComponent } from '../../../shared/ui/is-premium.component';

@Component({
	selector: 'app-rubric-lot-generator',
	standalone: true,
	imports: [
		CommonModule,
		ReactiveFormsModule,
		MatSelectModule,
		MatCardModule,
		MatSnackBarModule,
		MatButtonModule,
		MatIconModule,
		MatFormFieldModule,
		MatInputModule,
		MatProgressSpinnerModule,
		RouterLink,
		PretifyPipe,
		IsPremiumComponent,
	],
	template: `
		<app-is-premium minSubscriptionType="Plan Plus">
			<mat-card>
				<mat-card-header
					style="justify-content: space-between; align-items: center"
				>
					<h2 mat-card-title>Generador de Rúbricas por Lote</h2>
					<button mat-flat-button type="button" routerLink="/rubrics">
						Mis Rúbricas
					</button>
				</mat-card-header>
				<mat-card-content>
					@if (!generating) {
						<form
							[formGroup]="rubricLotForm"
							(ngSubmit)="onSubmit()"
							style="margin-top: 24px"
						>
							<p>
								Esta herramienta generará una rúbrica para
								<strong>cada tema</strong> disponible en la
								asignatura y grado seleccionados.
							</p>

							<div class="grid-2-cols">
								@if (sections.length) {
									<mat-form-field appearance="outline">
										<mat-label>Curso</mat-label>
										<mat-select
											formControlName="section"
											(selectionChange)="
												onSelectSection($event)
											"
										>
											@for (
												section of sections;
												track section._id
											) {
												<mat-option
													[value]="section._id"
													>{{
														section.name
													}}</mat-option
												>
											}
										</mat-select>
									</mat-form-field>
								} @else {
									@if (!loadingSections) {
										<div>
											<p>
												Para usar esta herramienta,
												primero debes crear una sección.
											</p>
											<button
												mat-raised-button
												color="accent"
												type="button"
												routerLink="/sections"
											>
												Crear Sección
											</button>
										</div>
									}
								}

								<mat-form-field appearance="outline">
									<mat-label>Asignatura</mat-label>
									<mat-select formControlName="subject">
										@for (
											subject of subjects;
											track subject
										) {
											<mat-option [value]="subject">{{
												subject | pretify
											}}</mat-option>
										}
									</mat-select>
								</mat-form-field>

								<mat-form-field appearance="outline">
									<mat-label>Tipo de Rúbrica</mat-label>
									<mat-select formControlName="rubricType">
										@for (
											type of rubricTypes;
											track type.id
										) {
											<mat-option [value]="type.id">{{
												type.label
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
                                    margin-top: 16px;
                                "
							>
								<h3>Niveles de Desempeño</h3>
								<button
									type="button"
									mat-mini-fab
									color="accent"
									[disabled]="
										rubricLevels.controls.length > 4
									"
									(click)="addRubricLevel()"
								>
									<mat-icon>add</mat-icon>
								</button>
							</div>

							<div formArrayName="levels">
								@for (
									level of rubricLevels.controls;
									track $index;
									let i = $index
								) {
									<div class="level-row">
										<mat-form-field appearance="outline">
											<mat-label
												>Nivel #{{ i + 1 }}</mat-label
											>
											<input
												[formControlName]="i"
												matInput
											/>
										</mat-form-field>
										<button
											(click)="deleteLevel(i)"
											type="button"
											mat-mini-fab
											color="warn"
										>
											<mat-icon>delete</mat-icon>
										</button>
									</div>
								}
							</div>

							<div style="text-align: end; margin-top: 20px">
								<button
									type="submit"
									[disabled]="rubricLotForm.invalid"
									mat-raised-button
									color="primary"
								>
									Generar Rúbricas
								</button>
							</div>
						</form>
					} @else {
						<div class="spinner-container">
							<mat-progress-spinner
								mode="indeterminate"
							></mat-progress-spinner>
							<h3>Generando rúbricas, por favor espera...</h3>
							<p>
								Este proceso puede tardar varios minutos
								dependiendo de la cantidad de temas.
							</p>
							<mat-card style="width: 100%; max-width: 600px">
								<mat-card-content>
									<h4>Progreso:</h4>
									@for (
										status of generationStatus;
										track status
									) {
										<div>{{ status }}</div>
									}
								</mat-card-content>
							</mat-card>
						</div>
					}
				</mat-card-content>
			</mat-card>
		</app-is-premium>
	`,
	styles: [
		`
			.grid-2-cols {
				display: grid;
				gap: 12px;
				grid-template-columns: 1fr;

				@media screen and (min-width: 1200px) {
					grid-template-columns: repeat(3, 1fr);
				}
			}

			mat-form-field {
				width: 100%;
			}

			.level-row {
				display: grid;
				gap: 12px;
				grid-template-columns: 1fr 42px;
				align-items: center;
			}

			.spinner-container {
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				gap: 16px;
				margin-top: 20px;
			}
		`,
	],
})
export class RubricLotGeneratorComponent implements OnInit {
	// Inyección de dependencias
	private fb = inject(FormBuilder);
	private sb = inject(MatSnackBar);
	private router = inject(Router);
	private sectionsService = inject(ClassSectionService);
	private sclService = inject(SubjectConceptListService);
	private contentBlockService = inject(ContentBlockService);
	private competenceService = inject(CompetenceService);
	private aiService = inject(AiService);
	private rubricService = inject(RubricService);

	// Estado del componente
	generating = false;
	loadingSections = true;
	generationStatus: string[] = [];

	// Datos para los selects
	sections: ClassSection[] = [];
	subjects: string[] = [];
	rubricTypes = [
		{ id: 'SINTETICA', label: 'Sintética (Una rubrica por estudiante)' },
		{
			id: 'ANALITICA',
			label: 'Analítica (Una rubrica para todos los estudiantes)',
		},
	];

	// Formulario reactivo
	rubricLotForm = this.fb.group({
		section: ['', Validators.required],
		subject: ['', Validators.required],
		rubricType: ['ANALITICA', Validators.required],
		levels: this.fb.array(
			[
				this.fb.control('Receptivo', Validators.required),
				this.fb.control('Resolutivo', Validators.required),
				this.fb.control('Autónomo', Validators.required),
				this.fb.control('Estratégico', Validators.required),
			],
			Validators.required,
		),
	});

	ngOnInit() {
		this.loadSections();
	}

	// Carga las secciones del usuario
	loadSections() {
		this.loadingSections = true;
		this.sectionsService
			.findSections()
			.pipe(finalize(() => (this.loadingSections = false)))
			.subscribe({
				next: (sections) => (this.sections = sections),
				error: (err) => {
					console.error('Error loading sections:', err);
					this.sb.open('No se pudieron cargar los cursos.', 'Ok', {
						duration: 3000,
					});
				},
			});
	}

	// Actualiza las asignaturas cuando se selecciona una sección
	onSelectSection(event: any) {
		const sectionId = event.value;
		const section = this.sections.find((s) => s._id === sectionId);
		if (section) {
			this.subjects = section.subjects;
			this.rubricLotForm.get('subject')?.setValue('');
		}
	}

	// Propiedad 'getter' para acceder fácilmente al FormArray de niveles
	get rubricLevels() {
		return this.rubricLotForm.get('levels') as FormArray;
	}

	// Añade un nuevo nivel de desempeño al formulario
	addRubricLevel() {
		if (this.rubricLevels.length < 5) {
			this.rubricLevels.push(this.fb.control('', Validators.required));
		}
	}

	// Elimina un nivel de desempeño del formulario
	deleteLevel(index: number) {
		this.rubricLevels.removeAt(index);
	}

	// --- Lógica principal de generación ---
	onSubmit() {
		if (this.rubricLotForm.invalid) {
			this.sb.open(
				'Por favor, complete todos los campos requeridos.',
				'Ok',
				{ duration: 3000 },
			);
			return;
		}

		this.generating = true;
		this.generationStatus = [];

		const {
			section: sectionId,
			subject,
			rubricType,
			levels,
		} = this.rubricLotForm.value;
		const section = this.sections.find((s) => s._id === sectionId);

		if (!section || !subject || !rubricType || !levels) {
			this.generating = false;
			return;
		}

		// 1. Obtener todos los temas (conceptos) para la asignatura y grado
		this.sclService
			.findAll({
				subject,
				grade: section.year,
				level: section.level,
			})
			.pipe(
				// 2. Procesar cada tema secuencialmente para no saturar el servicio de IA
				concatMap((subjectConceptLists) => {
					const allConcepts = subjectConceptLists.flatMap(
						(list) => list.concepts,
					);
					if (allConcepts.length === 0) {
						this.sb.open(
							'No se encontraron contenidos para la asignatura y grado seleccionados.',
							'Cerrar',
							{ duration: 5000 },
						);
						return EMPTY; // Termina el stream si no hay conceptos
					}
					this.generationStatus.push(
						`Se encontraron ${allConcepts.length} temas. Iniciando generación...`,
					);
					return from(allConcepts).pipe(
						concatMap((concept) =>
							this.generateAndSaveRubricForConcept(
								concept,
								section,
								subject,
								rubricType,
								levels as string[],
							),
						),
					);
				}),
				finalize(() => {
					this.generating = false;
					this.sb.open(
						'¡Proceso de generación por lote completado!',
						'Ok',
						{ duration: 4000 },
					);
					this.router.navigate(['/rubrics']);
				}),
			)
			.subscribe();
	}

	private generateAndSaveRubricForConcept(
		concept: string,
		section: ClassSection,
		subject: string,
		rubricType: string,
		levels: string[],
	) {
		this.generationStatus.push(`Generando rúbrica para: "${concept}"...`);

		// 3. Obtener datos necesarios para generar la rúbrica (indicadores, competencias, título)
		const dataFetch$ = forkJoin({
			contentBlocks: this.contentBlockService.findAll({
				subject,
				year: section.year,
				level: section.level,
				title: concept,
			}),
			competences: this.competenceService.findAll({
				subject,
				grade: section.year,
				level: section.level,
			}),
			aiTitle: this.generateAiTitleAndActivity(concept, section, subject),
		});

		return dataFetch$.pipe(
			concatMap(({ contentBlocks, competences, aiTitle }) => {
				// 4. Seleccionar 3 indicadores de logro al azar
				const allIndicators = contentBlocks.flatMap(
					(block) => block.achievement_indicators,
				);
				if (allIndicators.length === 0) {
					this.generationStatus.push(
						`   -> ⚠️ No se encontraron indicadores para "${concept}". Saltando.`,
					);
					return of(null); // Saltar si no hay indicadores
				}

				const selectedIndicators = this.getRandomItems(
					allIndicators,
					3,
				);
				const selectedCompetences = competences.flatMap(
					(entry) => this.getRandomItems(entry.entries, 1)[0] || [],
				);

				// 5. Construir el prompt para la IA
				const aiPrompt = this.buildRubricContentPrompt(
					concept,
					subject,
					section,
					rubricType,
					aiTitle.activity,
					selectedIndicators,
					levels,
				);

				// 6. Llamar a la IA para generar los criterios de la rúbrica
				return this.aiService.geminiAi(aiPrompt).pipe(
					map((result) => {
						// 7. Parsear la respuesta y construir el objeto Rúbrica
						try {
							const start = result.response.indexOf('{');
							const limit = result.response.lastIndexOf('}') + 1;
							const aiResponse = JSON.parse(
								result.response.slice(start, limit),
							) as any;

							const newRubric: Partial<Rubric> = {
								title: aiTitle.title,
								activity: aiTitle.activity,
								section: section._id,
								user: section.user,
								rubricType,
								competence: selectedCompetences,
								achievementIndicators: selectedIndicators,
								progressLevels: levels,
								criteria: aiResponse.criteria,
							} as any;
							return newRubric;
						} catch (e) {
							console.error('Error parsing AI response:', e);
							this.generationStatus.push(
								`   -> ❌ Error al procesar respuesta de IA para "${concept}".`,
							);
							return null;
						}
					}),
				);
			}),
			concatMap((rubric) => {
				// 8. Guardar la rúbrica en la base de datos
				if (!rubric) {
					return of(null);
				}
				return this.rubricService.create(rubric as Rubric).pipe(
					tap(() => {
						this.generationStatus.push(
							`   -> ✅ Rúbrica para "${concept}" guardada con éxito.`,
						);
					}),
					catchError((err) => {
						console.error('Error saving rubric:', err);
						this.generationStatus.push(
							`   -> ❌ Error al guardar rúbrica para "${concept}".`,
						);
						return of(null); // Continuar con el siguiente aunque falle
					}),
				);
			}),
		);
	}

	// --- Funciones de Ayuda ---

	private generateAiTitleAndActivity(
		concept: string,
		section: ClassSection,
		subject: string,
	) {
		const pretify = new PretifyPipe().transform;
		const prompt = `Sugiere un título breve (máx 8 palabras) y una actividad concisa (máx 12 palabras) para una rúbrica de evaluación sobre "${concept}" para ${pretify(subject)} de ${pretify(section.year)} de ${pretify(section.level)} (República Dominicana). Formato de respuesta: JSON válido con la interfaz { "title": string, "activity": string }. No incluyas "Rúbrica" ni "Evaluación" en el título.`;
		return this.aiService.geminiAi(prompt).pipe(
			map((res) => {
				try {
					const start = res.response.indexOf('{');
					const limit = res.response.lastIndexOf('}') + 1;
					return JSON.parse(res.response.slice(start, limit)) as {
						title: string;
						activity: string;
					};
				} catch {
					return {
						title: `Evaluación de: ${concept}`,
						activity: `Actividad sobre ${concept}`,
					};
				}
			}),
			catchError(() =>
				of({
					title: `Evaluación de: ${concept}`,
					activity: `Actividad sobre ${concept}`,
				}),
			),
		);
	}

	private buildRubricContentPrompt(
		concept: string,
		subject: string,
		section: ClassSection,
		rubricType: string,
		activity: string,
		indicators: string[],
		levels: string[],
	): string {
		const pretify = new PretifyPipe().transform;
		return `Crea el contenido de una rúbrica ${rubricType === 'SINTETICA' ? 'Sintética' : 'Analítica'} para evaluar "${concept}" de ${pretify(subject)} de ${section.year} grado de ${section.level}.
La actividad es: ${activity}.
Los criterios a evaluar se basan en estos 3 indicadores de logro:
- ${indicators.join('\n- ')}
Cada criterio tendrá ${levels.length} niveles de desempeño: ${levels.join(', ')}.
Tu respuesta debe ser un JSON válido con esta interfaz:
{
  "criteria": [
    {
      "indicator": "string",
      "maxScore": number,
      "criterion": [
        {
          "name": "string",
          "score": number
        }
      ]
    }
  ]
}
Asegúrate de que haya un objeto en el array "criteria" por cada uno de los 3 indicadores proporcionados. Asigna puntuaciones lógicas de 40 a 100 distribuidas entre los niveles.`;
	}

	private getRandomItems<T>(arr: T[], count: number): T[] {
		return [...arr].sort(() => 0.5 - Math.random()).slice(0, count);
	}
}
