import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ClassSection } from '../../../core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PretifyPipe } from '../../../shared/pipes/pretify.pipe';
import { MarkdownComponent } from 'ngx-markdown';
import { IsPremiumComponent } from '../../../shared/ui/is-premium.component';
import { Store } from '@ngrx/store';
import {
	askGemini,
	askGeminiFailure,
	loadSections,
	selectAiIsGenerating,
	selectAiResult,
	selectAllClassSections,
	selectAuthUser,
	selectIsLoadingSections,
} from '../../../store';
import { filter, Subject, takeUntil } from 'rxjs';
import { Actions, ofType } from '@ngrx/effects';
import { saveAs } from 'file-saver';
import {
	Document,
	Packer,
	Paragraph,
	Table,
	TableCell,
	TableRow,
	WidthType,
	TextRun,
	HeadingLevel,
	BorderStyle,
} from 'docx';

@Component({
	selector: 'app-improvement-plan-generator',
	standalone: true,
	imports: [
		MatButtonModule,
		MatIconModule,
		MatSelectModule,
		MatInputModule,
		MatSnackBarModule,
		MatFormFieldModule,
		ReactiveFormsModule,
		MarkdownComponent,
		PretifyPipe,
		IsPremiumComponent,
	],
	template: `
		<app-is-premium>
			<div>
				<div
					style="justify-content: space-between; align-items: center; display: flex;"
				>
					<h2>Generador de Planes de Mejora</h2>
				</div>
				<div>
					<div style="margin-top: 24px">
						<form
							[formGroup]="improvementPlanForm"
							(ngSubmit)="onSubmit()"
						>
							<div class="grid-2">
								<div>
									<mat-form-field appearance="outline">
										<mat-label>Grado</mat-label>
										<mat-select
											formControlName="section"
											(selectionChange)="
												onSectionSelect($event)
											"
										>
											@for (
												section of sections();
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
								</div>
								<div>
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
								</div>
							</div>
							<div>
								<mat-form-field appearance="outline">
									<mat-label
										>Áreas de mejora identificadas (Una por
										línea)</mat-label
									>
									<textarea
										matInput
										formControlName="improvementAreas"
										placeholder="Ejemplo: Dificultad en resolución de problemas matemáticos, Comprensión lectora o Expresión escrita"
									></textarea>
								</mat-form-field>
							</div>
							<div>
								<mat-form-field appearance="outline">
									<mat-label
										>Fortalezas del estudiante/grupo (Una
										por línea)</mat-label
									>
									<textarea
										matInput
										formControlName="strengths"
										placeholder="Ejemplo: Buen trabajo en equipo, Creatividad en proyectos o Persistencia en tareas difíciles"
									></textarea>
								</mat-form-field>
							</div>
							<div class="grid-2">
								<div>
									<mat-form-field appearance="outline">
										<mat-label
											>Duración del plan
											(semanas)</mat-label
										>
										<input
											type="number"
											matInput
											formControlName="duration"
											min="1"
											max="52"
										/>
									</mat-form-field>
								</div>
								<div>
									<mat-form-field appearance="outline">
										<mat-label>Nivel de urgencia</mat-label>
										<mat-select
											formControlName="urgencyLevel"
										>
											<mat-option value="baja"
												>Baja</mat-option
											>
											<mat-option value="media"
												>Media</mat-option
											>
											<mat-option value="alta"
												>Alta</mat-option
											>
										</mat-select>
									</mat-form-field>
								</div>
							</div>
							<div
								style="display: flex; gap: 12px; justify-content: flex-end"
							>
								<button
									mat-flat-button
									color="primary"
									[disabled]="!result() || generating()"
									(click)="downloadDocx()"
									type="button"
								>
									<mat-icon>download</mat-icon> Descargar DOCX
								</button>
								<button
									mat-button
									[disabled]="
										improvementPlanForm.invalid ||
										generating()
									"
									type="submit"
								>
									<mat-icon>bolt</mat-icon>
									{{
										generating()
											? 'Generando...'
											: result()
												? 'Regenerar'
												: 'Generar'
									}}
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
			@if (result()) {
				<div style="margin-top: 24px">
					<div style="max-width: 8.5in; margin: 0 auto">
						<div>
							<div>
								<markdown [data]="result()"></markdown>
							</div>
						</div>
					</div>
				</div>
			}
		</app-is-premium>
	`,
	styles: `
		mat-form-field {
			width: 100%;
		}

		.grid-2 {
			display: grid;
			gap: 12px;
			grid-template-columns: 1fr 1fr;
		}
	`,
})
export class ImprovementPlanGeneratorComponent implements OnInit {
	#store = inject(Store);
	#actions$ = inject(Actions);
	private sb = inject(MatSnackBar);
	private fb = inject(FormBuilder);

	loadingSections = this.#store.selectSignal(selectIsLoadingSections);
	generating = this.#store.selectSignal(selectAiIsGenerating);
	sections = this.#store.selectSignal(selectAllClassSections);
	user = this.#store.selectSignal(selectAuthUser);
	result = this.#store.selectSignal(selectAiResult);

	subjects: string[] = [];
	section = signal<ClassSection | null>(null);

	destroy$ = new Subject<void>();

	improvementPlanForm = this.fb.group({
		section: ['', Validators.required],
		subject: ['', Validators.required],
		improvementAreas: ['', Validators.required],
		strengths: ['', Validators.required],
		duration: [
			4,
			[Validators.required, Validators.min(1), Validators.max(12)],
		],
		urgencyLevel: ['media', Validators.required],
	});

	ngOnInit() {
		this.#store.dispatch(loadSections());
	}

	ngOnDestroy() {
		this.destroy$.next();
		this.destroy$.complete();
	}

	onSectionSelect(event: any) {
		const sectionId: string = event.value;
		const section =
			this.sections().find((s) => s._id === sectionId) || null;
		if (section) {
			this.section.set(section);
			this.subjects = section.subjects;
		}
	}

	pretify(str: string) {
		return new PretifyPipe().transform(str);
	}

	generate(formData: any) {
		const section = this.section();
		const user = this.user();
		if (!section || !user) return;

		const question = `Eres un docente experto en educación de ${this.pretify(section.year)} grado de ${this.pretify(section.level)}. Necesitas crear un plan de mejora educativa para la asignatura de ${this.pretify(formData.subject)}.

INFORMACIÓN DEL CONTEXTO:
- Grado: ${this.pretify(section.name)}
- Asignatura: ${this.pretify(formData.subject)}
- Duración del plan: ${formData.duration} semanas
- Nivel de urgencia: ${formData.urgencyLevel}

ÁREAS DE MEJORA IDENTIFICADAS:
${formData.improvementAreas}

FORTALEZAS DEL ESTUDIANTE/GRUPO:
${formData.strengths}

ESTRUCTURA SOLICITADA PARA EL PLAN DE MEJORA:
1. Encabezado con información institucional
2. Diagnóstico situacional breve
3. Objetivos específicos y medibles
4. Estrategias de intervención concretas
5. Actividades específicas por semana
6. Recursos y materiales necesarios
7. Indicadores de evaluación y seguimiento
8. Cronograma de implementación

INSTRUCCIONES ESPECÍFICAS:
- El plan debe ser práctico y aplicable
- Incluir fechas estimadas y metas claras
- Considerar el nivel de urgencia: ${formData.urgencyLevel}
- Proponer actividades diferenciadas según las fortalezas identificadas
- Incluir métodos de evaluación formativa
- Ser realista con el tiempo disponible (${formData.duration} semanas)

FORMATO DE RESPUESTA:
Tu respuesta debe ser en formato markdown, lista para implementar. Usa **negritas** para los títulos principales y secciones importantes. Incluye tablas para el cronograma cuando sea apropiado.

ENCABEZADO SUGERIDO:
# ${user.schoolName}
## Plan de Mejora Educativa
### ${this.pretify(formData.subject)} - ${this.pretify(section.name)}
**Docente:** ${user.title}. ${user.firstname} ${user.lastname}
**Fecha de elaboración:** ${new Date().toISOString()} (en formato DD/MM/YYYY)
**Duración:** ${formData.duration} semanas`;

		this.#store.dispatch(askGemini({ question }));
		this.#actions$
			.pipe(
				ofType(askGeminiFailure),
				filter((e) => !!e),
				takeUntil(this.destroy$),
			)
			.subscribe((e) => {
				this.sb.open(
					e.error ||
						'Ha ocurrido un error al generar el plan de mejora.',
					'Ok',
					{ duration: 2500 },
				);
			});
	}

	onSubmit() {
		this.generate(this.improvementPlanForm.value);
	}

	async downloadDocx(): Promise<void> {
		const result = this.result();
		if (!result) {
			this.sb.open(
				'No hay plan de mejora generado para descargar.',
				'Ok',
				{ duration: 2500 },
			);
			return;
		}

		try {
			const doc = this.createDocument(result);
			const blob = await Packer.toBlob(doc);
			const section = this.section();
			const subject = this.improvementPlanForm.value.subject;
			const fileName =
				`plan-mejora-${subject}-${section?.name || 'grado'}.docx`.replace(
					/\s+/g,
					'-',
				);
			saveAs(blob, fileName);
			this.sb.open('Plan de mejora descargado exitosamente.', 'Ok', {
				duration: 2500,
			});
		} catch (error) {
			console.error('Error al generar el documento DOCX:', error);
			this.sb.open('Error al generar el documento.', 'Ok', {
				duration: 5000,
			});
		}
	}

	private createDocument(markdownContent: string): Document {
		const paragraphs = this.convertMarkdownToDocx(markdownContent);

		return new Document({
			sections: [
				{
					properties: {},
					children: paragraphs,
				},
			],
		});
	}

	private convertMarkdownToDocx(markdown: string): Paragraph[] {
		const lines = markdown.split('\n');
		const paragraphs: Paragraph[] = [];

		for (let i = 0; i < lines.length; i++) {
			const line = lines[i].trim();

			if (line === '') {
				paragraphs.push(new Paragraph({}));
				continue;
			}

			// Encabezados
			if (line.startsWith('# ')) {
				paragraphs.push(
					new Paragraph({
						text: line.substring(2),
						heading: HeadingLevel.HEADING_1,
						spacing: { after: 400 },
					}),
				);
			} else if (line.startsWith('## ')) {
				paragraphs.push(
					new Paragraph({
						text: line.substring(3),
						heading: HeadingLevel.HEADING_2,
						spacing: { after: 300 },
					}),
				);
			} else if (line.startsWith('### ')) {
				paragraphs.push(
					new Paragraph({
						text: line.substring(4),
						heading: HeadingLevel.HEADING_3,
						spacing: { after: 200 },
					}),
				);
			}
			// Listas
			else if (line.startsWith('- ') || line.startsWith('* ')) {
				const listItems = [line.substring(2)];
				// Agrupar items de lista consecutivos
				while (
					i + 1 < lines.length &&
					(lines[i + 1].startsWith('- ') ||
						lines[i + 1].startsWith('* '))
				) {
					i++;
					listItems.push(lines[i].substring(2));
				}

				listItems.forEach((item) => {
					paragraphs.push(
						new Paragraph({
							children: [
								new TextRun({ text: '• ', bold: true }),
								...this.processInlineFormatting(item),
							],
							spacing: { after: 100 },
						}),
					);
				});
			}
			// Tablas simples (detección básica)
			else if (line.includes('|') && !line.startsWith('|')) {
				const tableRows: TableRow[] = [];
				let j = i;

				// Procesar filas de tabla consecutivas
				while (j < lines.length && lines[j].includes('|')) {
					const cells = lines[j]
						.split('|')
						.map((cell) => cell.trim())
						.filter((cell) => cell !== '');
					if (cells.length > 0) {
						const tableCells = cells.map(
							(cell) =>
								new TableCell({
									children: [
										new Paragraph({
											children:
												this.processInlineFormatting(
													cell,
												),
										}),
									],
								}),
						);

						tableRows.push(
							new TableRow({
								children: tableCells,
							}),
						);
					}
					j++;
				}

				if (tableRows.length > 0) {
					paragraphs.push(new Paragraph({})); // Espacio antes de la tabla
					paragraphs.push(...this.createTable(tableRows));
					paragraphs.push(new Paragraph({})); // Espacio después de la tabla
					i = j - 1;
				} else {
					// Texto normal
					paragraphs.push(
						new Paragraph({
							children: this.processInlineFormatting(line),
							spacing: { after: 150 },
						}),
					);
				}
			}
			// Texto normal
			else {
				paragraphs.push(
					new Paragraph({
						children: this.processInlineFormatting(line),
						spacing: { after: 150 },
					}),
				);
			}
		}

		return paragraphs;
	}

	private processInlineFormatting(text: string): TextRun[] {
		const boldRegex = /\*\*(.*?)\*\*/g;
		const parts: TextRun[] = [];
		let lastIndex = 0;
		let match;

		while ((match = boldRegex.exec(text)) !== null) {
			// Texto antes del bold
			if (match.index > lastIndex) {
				parts.push(
					new TextRun({
						text: text.substring(lastIndex, match.index),
					}),
				);
			}
			// Texto en bold
			parts.push(
				new TextRun({
					text: match[1],
					bold: true,
				}),
			);
			lastIndex = match.index + match[0].length;
		}

		// Texto restante
		if (lastIndex < text.length) {
			parts.push(
				new TextRun({
					text: text.substring(lastIndex),
				}),
			);
		}

		return parts.length === 0 ? [new TextRun({ text })] : parts;
	}

	private createTable(rows: TableRow[]): Paragraph[] {
		if (rows.length === 0) return [];

		const table = new Table({
			width: { size: 100, type: WidthType.PERCENTAGE },
			borders: {
				top: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
				bottom: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
				left: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
				right: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
				insideHorizontal: {
					style: BorderStyle.SINGLE,
					size: 1,
					color: '000000',
				},
				insideVertical: {
					style: BorderStyle.SINGLE,
					size: 1,
					color: '000000',
				},
			},
			rows,
		});

		return [new Paragraph({ children: [table] })];
	}
}
