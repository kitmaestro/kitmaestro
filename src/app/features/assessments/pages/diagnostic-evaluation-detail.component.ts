import { Component, computed, inject, input, signal, OnInit } from '@angular/core';
import {
	DiagnosticEvaluationService,
	UserService,
} from '../../../core/services';
import { ClassSection, GeneratedEvaluation, User } from '../../../core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PretifyPipe } from '../../../shared/pipes/pretify.pipe';
import {
	AlignmentType,
	Document,
	HeadingLevel,
	Packer,
	Paragraph,
	TextRun,
} from 'docx';
import { saveAs } from 'file-saver';

@Component({
	selector: 'app-diagnostic-evaluation-detail',
	imports: [
		MatButtonModule,
		MatIconModule,
		MatTooltipModule,
		MatListModule,
		MatSnackBarModule,
		RouterLink,
		PretifyPipe,
	],
	template: `
		@if (evaluation(); as evaluation) {
			@if (evaluationInput()) {
				<header class="evaluation-header">
					<h1>{{ evaluation.title }}</h1>
					<h2>
						{{ evaluation.subject }}
						@if (classSection(); as section) {
							para {{ section.year | pretify }} de
							{{ section.level | pretify }}
						}
					</h2>
					<p>{{ evaluation.schoolYear }}</p>
					@if (User(); as user) {
						<p>
							{{ user.title }}. {{ user.firstname }}
							{{ user.lastname }}
						</p>
					}
				</header>

				<div class="student-info">
					<p>
						<strong>Nombre:</strong>
						___________________________________
					</p>
					<p><strong>Curso:</strong> _________</p>
					<p><strong>Fecha:</strong> _________</p>
				</div>

				@for (section of evaluation.sections; track section.title) {
					<section class="evaluation-section">
						<h3>{{ section.title }}</h3>
						<p class="instructions">
							<em>{{ section.instructions }}</em>
						</p>

						<ol class="question-list">
							@for (
								question of section.questions;
								track question.stem
							) {
								<li>
									<p class="question-stem">
										{{ question.stem }}
									</p>
									@if (
										question.type === 'multiple_choice' &&
										question.options
									) {
										<ul class="options-list">
											@for (
												option of question.options;
												track option
											) {
												<li>{{ option }}</li>
											}
										</ul>
									}
									<div class="answer-space"></div>
								</li>
							}
						</ol>
					</section>
				}
			} @else {
				<div>
					<div>
						<div
							style="width: 100%; display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;"
						>
							<h2>Detalle de la Evaluación Diagnóstica</h2>
							<div style="display: flex; gap: 8px;">
								<button
									mat-button
									routerLink="/assessments/diagnostic-evaluations"
								>
									<mat-icon>chevron_left</mat-icon>
									Volver al listado
								</button>
								<button
									mat-button
									style="display: none"
									(click)="
										deleteEvaluation(evaluation._id || '')
									"
								>
									<mat-icon>delete</mat-icon>
								</button>
								<button mat-button (click)="downloadDocx()">
									<mat-icon>download</mat-icon>
									Descargar Evaluación
								</button>
							</div>
						</div>
					</div>
					<div>
						<div
							style="padding: 1.25in; background-color: #fff; min-width: 8.5in margin-top: 24px;"
						>
							<header class="evaluation-header">
								<h1>{{ evaluation.title }}</h1>
								<h2>
									{{ evaluation.year | pretify }} de
									{{ evaluation.level | pretify }}
								</h2>
								<p>{{ schoolYear() }}</p>
								@if (User(); as user) {
									<p>
										{{ user.title }}. {{ user.firstname }}
										{{ user.lastname }}
									</p>
								}
							</header>

							<div class="student-info">
								<p>
									<strong>Nombre:</strong>
									___________________________________
								</p>
								<p><strong>Curso:</strong> _________</p>
								<p><strong>Fecha:</strong> _________</p>
							</div>

							@for (
								section of evaluation.sections;
								track section.title
							) {
								<section class="evaluation-section">
									<h3>{{ section.title }}</h3>
									<p class="instructions">
										<em>{{ section.instructions }}</em>
									</p>

									<ol class="question-list">
										@for (
											question of section.questions;
											track question.stem
										) {
											<li>
												<p class="question-stem">
													{{ question.stem }}
												</p>
												@if (
													question.type ===
														'multiple_choice' &&
													question.options
												) {
													<ul class="options-list">
														@for (
															option of question.options;
															track option
														) {
															<li>
																{{ option }}
															</li>
														}
													</ul>
												}
												<div class="answer-space"></div>
											</li>
										}
									</ol>
								</section>
							}
						</div>
					</div>
				</div>
			}
		}
	`,
	styles: `
		h2.title {
			font-size: 1.5rem;
			font-weight: 500;
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
	`,
})
export class DiagnosticEvaluationDetailComponent implements OnInit {
	private diagnosticEvaluationService = inject(DiagnosticEvaluationService);
	private route = inject(ActivatedRoute);
	private router = inject(Router);
	private sb = inject(MatSnackBar);
	private UserService = inject(UserService);

	private id = this.route.snapshot.paramMap.get('id') || '';
	evaluationInput = input<GeneratedEvaluation | null>(null);
	classSection = input<ClassSection | null>(null);

	User = signal<User | null>(null);

	evaluation = signal<GeneratedEvaluation | null>(null);

	schoolYear = computed(() => {
		const date = new Date();
		if (date.getMonth() < 6) {
			return `Año Escolar ${date.getFullYear() - 1} - ${date.getFullYear()}`;
		}
		return `Año Escolar ${date.getFullYear()} - ${date.getFullYear() + 1}`;
	});

	ngOnInit() {
		this.loadUser();
	}

	loadUser() {
		this.UserService.getSettings().subscribe({
			next: (settings) => {
				this.User.set(settings);
				if (this.evaluationInput()) {
					this.evaluation.set(this.evaluationInput());
				} else {
					this.loadEvaluations();
				}
			},
			error: (err) => console.error('Error loading user settings', err),
		});
	}

	loadEvaluations() {
		this.diagnosticEvaluationService.findOne(this.id).subscribe({
			next: (evaluation) => this.evaluation.set(evaluation),
			error: (err) => console.error('Error loading evaluations', err),
		});
	}

	deleteEvaluation(id: string) {
		if (!confirm('¿Estás seguro de que deseas eliminar esta evaluación?')) {
			return;
		}
		this.diagnosticEvaluationService.delete(id).subscribe({
			next: () => {
				this.router.navigateByUrl(
					'/assessments/diagnostic-evaluations',
				);
				this.sb.open('Evaluación eliminada exitosamente', 'Cerrar', {
					duration: 3000,
				});
			},
			error: (err) => console.error('Error deleting evaluation', err),
		});
	}

	/**
	 * Descarga la evaluación generada como un archivo DOCX.
	 */
	async downloadDocx(): Promise<void> {
		const evaluation = this.evaluation();
		if (!evaluation) return;

		const paragraphs: Paragraph[] = [
			new Paragraph({
				children: [
					new TextRun({
						text: evaluation.title,
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
						text: evaluation.subject,
						bold: true,
						size: 28,
					}),
				],
				heading: HeadingLevel.HEADING_1,
				alignment: AlignmentType.CENTER,
			}),
			new Paragraph({
				children: [
					new TextRun({ text: evaluation.schoolYear, size: 24 }),
				],
				alignment: AlignmentType.CENTER,
				spacing: { after: 400 },
			}),
			new Paragraph({
				text: 'Nombre: ___________________________________ Curso: _______ Fecha: ________',
				spacing: { after: 600 },
			}),
		];

		evaluation.sections.forEach((section) => {
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
		saveAs(
			blob,
			`evaluacion-diagnostica-${evaluation.title || 'sin-titulo'}.docx`,
		);
	}
}
