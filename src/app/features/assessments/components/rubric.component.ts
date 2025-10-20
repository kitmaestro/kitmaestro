import { Component, inject, input, signal, OnInit } from '@angular/core';
import { Rubric } from '../../../core';
import { Student } from '../../../core';
import { StudentsService } from '../../../core/services/students.service';
import { ClassSectionService } from '../../../core/services/class-section.service';
import { ClassSection } from '../../../core';

@Component({
	selector: 'app-rubric',
	template: `
		@if(rubric(); as rub) {
			<div style="width: 8.5in; padding: 0.35in" id="rubric">
				<div style="text-align: center">
					<h2 style="margin-bottom: 4px">R&uacute;brica</h2>
					<h3 style="margin-bottom: 4px">{{ rub.title }}</h3>
				</div>
				@if (section()) {
					<h3 style="text-align: end">
						{{ section()?.name }}
					</h3>
				}
				@if (rub.rubricType === "SINTETICA") {
					<div style="display: flex; gap: 12px; margin-bottom: 12px">
						<div style="font-weight: bold">Estudiante:</div>
						<div
							style="
								border-bottom: 1px solid black;
								width: 100%;
								flex: 1 1 auto;
							"
						></div>
						<div style="font-weight: bold">Fecha:</div>
						<div
							style="
								border-bottom: 1px solid black;
								width: 100%;
								flex: 1 1 auto;
							"
						></div>
					</div>
				}
				<h3 style="font-weight: bold; margin-bottom: 8px; margin-top: 8px">
					Competencias Espec&iacute;ficas
				</h3>
				<ul style="list-style: none; margin: 0; padding: 0">
					@for (item of rub.competence; track item) {
						<li>- {{ item }}</li>
					}
				</ul>
				<h3 style="font-weight: bold; margin-bottom: 8px; margin-top: 8px">
					Indicadores de Logro
				</h3>
				<ul style="list-style: none; margin: 0; padding: 0">
					@for (item of rub.achievementIndicators; track item) {
						<li>- {{ item }}</li>
					}
				</ul>
				<div style="margin-bottom: 12px; margin-top: 12px">
					<b>Evidencia o Actividad</b>: {{ rub.activity }}
				</div>
				@if (rub.rubricType === "SINTETICA") {
					<table style="border-collapse: collapse">
						<thead>
							<tr>
								<th rowspan="2">Criterios/Indicadores</th>
								<th [attr.colspan]="rub.progressLevels.length">
									Niveles de Desempe&ntilde;o
								</th>
							</tr>
							<tr>
								@for (level of rub.progressLevels; track $index) {
									<th>Nivel {{ $index + 1 }}<br />{{ level }}</th>
								}
							</tr>
						</thead>
						<tbody>
							@for (row of rub.criteria; track $index) {
								<tr>
									<td>
										{{ row.indicator }} ({{ row.maxScore }} puntos)
									</td>
									@for (item of row.criterion; track item) {
										<td>
											{{ item.name }} ({{ item.score }} puntos)
										</td>
									}
								</tr>
							}
						</tbody>
					</table>
				} @else {
					<table>
						<tbody>
							@for (row of rub.criteria; track $index) {
								<tr>
									<td [attr.colspan]="rub.progressLevels.length + 1">
										<b>Criterio o Indicador</b>: {{ row.indicator }}
									</td>
								</tr>
								<tr>
									<th rowspan="2">Estudiantes</th>
									@for (level of rub.progressLevels; track $index) {
										<th>Nivel {{ $index + 1 }}<br />{{ level }}</th>
									}
								</tr>
								<tr>
									@for (item of row.criterion; track item) {
										<td>
											{{ item.name }} ({{ item.score }} puntos)
										</td>
									}
								</tr>
								@for (student of students; track student._id) {
									<tr>
										<td style="min-width: fit-content">
											{{ student.firstname }}
											{{ student.lastname }}
										</td>
										@for (item of row.criterion; track item) {
											<td></td>
										}
									</tr>
								} @empty {
									@for (el of [].constructor(45); track $index) {
										<tr></tr>
										@for (item of row.criterion; track $index) {
											<td></td>
										}
									}
								}
							}
						</tbody>
					</table>
				}
			</div>
		}
	`,
	styles: `
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
export class RubricComponent implements OnInit {
	private studentService = inject(StudentsService);
	private sectionService = inject(ClassSectionService);

	rubric = input<Rubric>();
	students: Student[] = [];
	section = signal<ClassSection | null>(null);

	ngOnInit() {
		const rubric = this.rubric();
		if (rubric && rubric.section) {
			const section: string =
				typeof rubric.section === 'string'
					? rubric.section
					: rubric.section._id;
			this.studentService
				.findBySection(section)
				.subscribe((students) => (this.students = students));
			this.sectionService
				.findSection(section)
				.subscribe((s) => this.section.set(s));
		}
	}
}
