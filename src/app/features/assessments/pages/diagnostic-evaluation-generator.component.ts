import { Component, effect, inject, OnInit, signal, OnDestroy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';

// Importaciones de Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// Servicios y modelos de la aplicación
import { ClassSection } from '../../../core';

// Librería para generar DOCX
import {
	Document,
	Packer,
	Paragraph,
	TextRun,
	HeadingLevel,
	AlignmentType,
} from 'docx';
import { saveAs } from 'file-saver';
import { ContentBlock, GeneratedEvaluation } from '../../../core';
import { PretifyPipe } from '../../../shared/pipes/pretify.pipe';
import { DiagnosticEvaluationDetailComponent } from './diagnostic-evaluation-detail.component';
import { IsPremiumComponent } from '../../../shared/ui/is-premium.component';
import { Store } from '@ngrx/store';
import {
	askGemini,
	createEvaluation,
	createEvaluationFailed,
	createEvaluationSuccess,
	loadBlocks,
	loadSections,
	loadSectionsSuccess,
	selectAiIsGenerating,
	selectAiSerializedResult,
	selectAllClassSections,
	selectAllContentBlocks,
	selectAuthUser,
} from '../../../store';
import { Actions, ofType } from '@ngrx/effects';
import { Subject, takeUntil } from 'rxjs';

@Component({
	selector: 'app-diagnostic-evaluation-generator',
	standalone: true,
	imports: [
		ReactiveFormsModule,
		MatCardModule,
		MatFormFieldModule,
		MatInputModule,
		MatSelectModule,
		MatButtonModule,
		MatIconModule,
		MatProgressSpinnerModule,
		PretifyPipe,
		RouterLink,
		DiagnosticEvaluationDetailComponent,
		IsPremiumComponent,
	],
	template: `
		<app-is-premium>
			<div>
				<div class="header no-print">
					<h2 class="title">
						Generador de Evaluaciones Diagnósticas
					</h2>
					<button
						mat-button
						routerLink="/assessments/diagnostic-evaluations"
					>
						Mis Evaluaciones
					</button>
				</div>
				<div>
					<div class="no-print">
						<form
							[formGroup]="evaluationForm"
							(ngSubmit)="generateEvaluation()"
							class="form-container"
						>
							<div class="cols-2">
								<mat-form-field appearance="outline">
									<mat-label>Grado</mat-label>
									<mat-select
										formControlName="classSection"
										required
										(selectionChange)="
											onClassSectionChange()
										"
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
									<mat-label>Asignatura</mat-label>
									<mat-select
										formControlName="subject"
										required
										(selectionChange)="onSubjectChange()"
									>
										@for (
											subject of subjects();
											track subject
										) {
											@if (
												subject !== 'TALLERES_OPTATIVOS'
											) {
												<mat-option [value]="subject">
													{{ subject | pretify }}
												</mat-option>
											}
										}
									</mat-select>
								</mat-form-field>
							</div>

							<mat-form-field appearance="outline">
								<mat-label>Temas a Evaluar</mat-label>
								<mat-select
									formControlName="topics"
									required
									multiple
								>
									@for (
										block of contentBlocks();
										track block._id
									) {
										<mat-option [value]="block._id">{{
											block.title
										}}</mat-option>
									}
								</mat-select>
							</mat-form-field>

							<!-- <mat-form-field appearance="outline" class="question-count">
								<mat-label>Cantidad de Preguntas</mat-label>
								<input matInput type="number" formControlName="questionCount" min="3" max="20" required>
							</mat-form-field> -->

							<div class="actions">
								<button
									mat-flat-button
									[disabled]="!evaluation"
									color="accent"
									(click)="saveEvaluation()"
								>
									<mat-icon>save</mat-icon>
									Guardar
								</button>
								<button
									mat-button
									[disabled]="!evaluation"
									color="accent"
									(click)="downloadDocx()"
								>
									<mat-icon>download</mat-icon>
									Descargar DOCX
								</button>
								<button
									mat-button
									type="submit"
									[disabled]="
										generating() || evaluationForm.invalid
									"
								>
									<mat-icon>auto_awesome</mat-icon>
									{{
										generating()
											? 'Generando...'
											: evaluation
												? 'Regenerar Evaluación'
												: 'Generar Evaluación'
									}}
								</button>
							</div>
						</form>
					</div>

					<!-- Resultados de la Evaluación -->
					@if (!generating() && evaluation) {
						<div class="results-container">
							<div id="printable-area" class="evaluation-preview">
								<app-diagnostic-evaluation-detail
									[classSection]="classSection"
									[evaluationInput]="evaluation"
								></app-diagnostic-evaluation-detail>
							</div>
						</div>
					}
				</div>
			</div>
		</app-is-premium>
	`,
	styles: `
		:host {
			display: block;
			padding: 16px;
		}

		div.header {
			padding-bottom: 16px;
			display: flex;
			justify-content: space-between;
			align-items: center;
		}

		h2.title {
			font-size: 1.5rem;
			font-weight: 500;
		}

		.form-container {
			display: flex;
			flex-direction: column;
			gap: 8px;
		}

		.cols-2 {
			display: grid;
			gap: 16px;
			grid-template-columns: 1fr;

			@media screen and (min-width: 768px) {
				grid-template-columns: repeat(2, 1fr);
			}
		}

		.question-count {
			max-width: 200px;
		}

		.actions {
			display: flex;
			justify-content: flex-end;
			margin-top: 16px;
		}

		.actions button {
			display: flex;
			align-items: center;
			gap: 8px;
			min-width: 180px;
			justify-content: center;
		}

		.results-container {
			margin-top: 32px;
			border-top: 1px solid #e0e0e0;
			padding-top: 24px;
		}

		.result-actions {
			justify-content: center;
			gap: 16px;
			margin-bottom: 24px;
		}

		.evaluation-preview {
			padding: 24px;
			border: 1px solid #ccc;
			border-radius: 8px;
			background-color: #fff;
			font-family: 'Times New Roman', Times, serif;
			color: #000;
		}

		.evaluation-header {
			text-align: center;
			margin-bottom: 24px;
		}

		.evaluation-header h1 {
			font-size: 24px;
			font-weight: bold;
			margin: 0;
		}

		.evaluation-header h2 {
			font-size: 20px;
			font-weight: bold;
			margin: 8px 0;
		}

		.student-info {
			margin-bottom: 24px;
			display: flex;
			justify-content: space-between;
			flex-wrap: wrap;
		}

		.evaluation-section {
			margin-bottom: 24px;
		}

		.evaluation-section h3 {
			font-size: 18px;
			font-weight: bold;
			border-bottom: 1px solid #333;
			padding-bottom: 4px;
			margin-bottom: 12px;
		}

		.instructions {
			margin-bottom: 16px;
		}

		ol.question-list {
			padding-left: 20px;
		}

		ul.options-list {
			list-style-type: none;
			padding-left: 20px;
			margin: 8px 0;
		}

		.question-stem {
			font-weight: normal;
		}

		.answer-space {
			height: 60px;
			/* Espacio para respuestas escritas */
		}

		/* Estilos para impresión */
		@media print {
			body * {
				visibility: hidden;
			}

			.no-print,
			.no-print * {
				display: none !important;
			}

			#printable-area,
			#printable-area * {
				visibility: visible;
			}

			#printable-area {
				position: absolute;
				left: 0;
				top: 0;
				width: 100%;
				border: none;
				padding: 0;
				margin: 0;
			}
		}
	`,
})
export class DiagnosticEvaluationGeneratorComponent implements OnInit, OnDestroy {
	// Inyección de dependencias
	private fb = inject(FormBuilder);
	private sb = inject(MatSnackBar);
	private router = inject(Router);
	#store = inject(Store);
	#actions$ = inject(Actions);
	#destroy$ = new Subject<void>();

	private pretifySubject = new PretifyPipe().transform;

	contentBlocks = this.#store.selectSignal(selectAllContentBlocks);
	subjects = signal<string[]>([]);

	// Estado del componente
	generating = this.#store.selectSignal(selectAiIsGenerating);
	classSections = this.#store.selectSignal(selectAllClassSections);
	user = this.#store.selectSignal(selectAuthUser);
	result = this.#store.selectSignal(selectAiSerializedResult);
	evaluation: GeneratedEvaluation | null = null;

	// Formulario reactivo para la configuración de la evaluación
	evaluationForm = this.fb.group({
		classSection: ['', Validators.required],
		subject: ['', Validators.required],
		topics: [[] as string[], Validators.required],
	});

	constructor() {
		effect(() => {
			const result: GeneratedEvaluation = this.result();
			const user = this.user();
			const selectedSection = this.classSection;
			if (result && user && selectedSection) {
				const { title, subject, schoolYear, sections } = result;
				const { year, level } = this.prevGrade(selectedSection);
				this.evaluation = {
					user,
					year,
					level,
					title,
					subject,
					schoolYear,
					sections,
				} as any;
			}
		});
	}

	ngOnInit(): void {
		this.#store.dispatch(loadSections());
		this.#actions$
			.pipe(ofType(loadSectionsSuccess))
			.subscribe(({ sections }) => {
				if (sections.length) {
					this.evaluationForm
						.get('classSection')
						?.setValue(sections[0]._id || '');
					this.onClassSectionChange();
				} else {
					this.sb.open(
						'Para usar esta herramienta, necesitas crear al menos una sección.',
						'Ok',
						{ duration: 5000 },
					);
				}
			});
	}

	ngOnDestroy() {
		this.#destroy$.next();
		this.#destroy$.complete();
	}

	onClassSectionChange(): void {
		const section = this.classSection;
		if (section && section.subjects.length) {
			this.subjects.set(section.subjects);
			this.evaluationForm.get('subject')?.setValue(section.subjects[0]);
			this.onSubjectChange();
		} else {
			this.evaluationForm.get('subject')?.setValue('');
		}
	}

	onSubjectChange(): void {
		const section = this.classSection;
		const subject = this.evaluationForm.value.subject;
		if (section && subject) {
			const { year, level } = this.prevGrade(section);
			this.#store.dispatch(
				loadBlocks({ filters: { year, subject, level } }),
			);
		}
	}

	/**
	 * Genera la evaluación diagnóstica utilizando el servicio de IA.
	 */
	generateEvaluation(): void {
		if (this.evaluationForm.invalid) {
			this.sb.open(
				'Por favor, completa todos los campos requeridos.',
				'Ok',
				{ duration: 3000 },
			);
			return;
		}

		this.evaluation = null;
		const formValue = this.evaluationForm.value;
		const selectedSection = this.classSection;

		if (!selectedSection) {
			this.sb.open('Sección de clase no válida.', 'Cerrar');
			return;
		}

		const selectedBlocks = this.contentBlocks().filter((block) =>
			formValue.topics?.includes(block._id),
		);
		if (selectedBlocks.length === 0) {
			this.sb.open(
				'Por favor, selecciona al menos un tema válido.',
				'Ok',
				{ duration: 3000 },
			);
			return;
		}

		const topicsDescriptions = selectedBlocks
			.map((block) => this.blockToString(block))
			.join('\n');

		const question = this.createPrompt(
			selectedSection,
			formValue.subject!,
			topicsDescriptions,
			20,
		);

		this.#store.dispatch(askGemini({ question }));
	}

	private blockToString(block: ContentBlock) {
		return `Unidad Tematica: ${block.title}.\n (Conceptos: ${block.concepts.join(', ')} Procedimientos: ${block.procedures.join(', ')} Actitudes: ${block.attitudes.join(', ')} Indicadores de logro: ${block.achievement_indicators.join(', ')})`;
	}

	/**
	 * Crea el prompt para la IA a partir de los datos del formulario.
	 */
	private createPrompt(
		section: ClassSection,
		subject: string,
		topics: string,
		count: number,
	): string {
		const subjectName = this.pretifySubject(subject);
		const gradeName = `${section.year.toLowerCase()} de secundaria`;

		return `
Actúa como un experto pedagogo y crea una evaluación diagnóstica para estudiantes de ${gradeName}.
La evaluación es para la asignatura de ${subjectName}.
Los temas a evaluar, que repasan conceptos del año anterior, son estos:
${topics}.
La evaluación debe contener ${count} preguntas en total, distribuidas en diferentes temas.

Genera la evaluación en formato JSON. La estructura debe ser la siguiente:
{
    "title": "Prueba Diagnóstica",
    "subject": "${subjectName}",
    "schoolYear": "Año Escolar 2024-2025",
    "sections": [
        {
        "title": "Tema I: Selección Múltiple",
        "instructions": "Encierra la letra de la respuesta correcta.",
        "questions": [
            {
            "type": "multiple_choice",
            "stem": "Pregunta de selección múltiple...",
            "options": ["a) Opción A", "b) Opción B", "c) Opción C", "d) Opción D"]
            }
        ]
        },
        {
        "title": "Tema II: Desarrollo",
        "instructions": "Resuelve los siguientes problemas mostrando el procedimiento.",
        "questions": [
            {
            "type": "open_ended",
            "stem": "Problema o pregunta de desarrollo..."
            }
        ]
        }
    ]
}
Asegúrate de que las preguntas sean apropiadas para el nivel académico de ${gradeName} y cubran los temas solicitados. Incluye al menos dos secciones con tipos de preguntas diferentes (multiple_choice, open_ended, calculation). El JSON debe ser válido y no incluir comentarios ni texto fuera del objeto JSON.
    `;
	}

	/**
	 * Descarga la evaluación generada como un archivo DOCX.
	 */
	async downloadDocx(): Promise<void> {
		if (!this.evaluation) return;

		const paragraphs: Paragraph[] = [
			new Paragraph({
				children: [
					new TextRun({
						text: this.evaluation.title,
						bold: true,
						size: 32,
					}),
				],
				heading: HeadingLevel.TITLE,
				alignment: AlignmentType.CENTER,
			}),
			new Paragraph({
				children: [
					new TextRun({
						text: this.evaluation.subject,
						bold: true,
						size: 28,
					}),
				],
				heading: HeadingLevel.HEADING_1,
				alignment: AlignmentType.CENTER,
			}),
			new Paragraph({
				children: [
					new TextRun({ text: this.evaluation.schoolYear, size: 24 }),
				],
				alignment: AlignmentType.CENTER,
				spacing: { after: 400 },
			}),
			new Paragraph({
				text: 'Nombre: ___________________________________ Curso: _______ Fecha: ________',
				spacing: { after: 600 },
			}),
		];

		this.evaluation.sections.forEach((section) => {
			paragraphs.push(
				new Paragraph({
					children: [
						new TextRun({
							text: section.title,
							bold: true,
							size: 24,
						}),
					],
					heading: HeadingLevel.HEADING_2,
					spacing: { before: 400, after: 200 },
				}),
				new Paragraph({
					children: [
						new TextRun({
							text: section.instructions,
							italics: true,
						}),
					],
					spacing: { after: 200 },
				}),
			);

			section.questions.forEach((q, index) => {
				paragraphs.push(
					new Paragraph({
						children: [
							new TextRun({ text: `${index + 1}. ${q.stem}` }),
						],
						spacing: { after: 100 },
					}),
				);
				if (q.type === 'multiple_choice' && q.options) {
					q.options.forEach((opt) => {
						paragraphs.push(
							new Paragraph({
								children: [new TextRun(opt)],
								indent: { left: 720 }, // 0.5 inch indent
							}),
						);
					});
				}
				// Agrega espacio extra después de cada pregunta para las respuestas
				paragraphs.push(new Paragraph({ text: '\n\n' }));
			});
		});

		const doc = new Document({
			sections: [
				{
					properties: {},
					children: paragraphs,
				},
			],
		});

		const blob = await Packer.toBlob(doc);
		saveAs(blob, 'evaluacion-diagnostica.docx');
	}

	/**
	 * Activa la función de impresión del navegador.
	 */
	printEvaluation(): void {
		window.print();
	}

	prevGrade(section: ClassSection): { year: string; level: string } {
		const yearMap: Record<string, string> = {
			PRIMERO: 'SEXTO',
			SEGUNDO: 'PRIMERO',
			TERCERO: 'SEGUNDO',
			CUARTO: 'TERCERO',
			QUINTO: 'CUARTO',
			SEXTO: 'QUINTO',
		};
		if (section.year === 'PRIMERO' && section.level === 'PRIMARIA') {
			return { year: 'PRIMERO', level: 'PRIMARIA' };
		}
		if (section.year === 'PRIMERO' && section.level === 'SECUNDARIA') {
			return { year: 'SEXTO', level: 'PRIMARIA' };
		}
		return {
			year: yearMap[section.year] || section.year,
			level: section.level,
		};
	}

	saveEvaluation(): void {
		const evaluation: any = this.evaluation;
		if (!evaluation) return;
		this.#store.dispatch(createEvaluation({ evaluation }));
		this.#actions$
			.pipe(ofType(createEvaluationSuccess), takeUntil(this.#destroy$))
			.subscribe(({ evaluation }) => {
				this.router
					.navigate([
						'/assessments',
						'diagnostic-evaluations',
						evaluation._id,
					])
					.then(() => {
						this.sb.open(
							'Evaluación guardada exitosamente en tu cuenta.',
							'Ok',
							{ duration: 3000 },
						);
					});
			});
		this.#actions$
			.pipe(ofType(createEvaluationFailed), takeUntil(this.#destroy$))
			.subscribe(({ error }) => {
				console.error('Error al guardar la evaluación:', error);
				this.sb.open(
					'Hubo un error al guardar la evaluación. Inténtalo de nuevo.',
					'Ok',
					{ duration: 4000 },
				);
			});
	}

	// Getters y helpers
	get classSection(): ClassSection | null {
		const sectionId = this.evaluationForm.value.classSection;
		return this.classSections().find((s) => s._id === sectionId) || null;
	}
}
