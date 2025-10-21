import { Component, Input } from '@angular/core';
import { Student, ObservationGuide } from '../../core/models';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DatePipe } from '@angular/common';

@Component({
	selector: 'app-observation-guide',
	imports: [MatCardModule, MatButtonModule, MatIconModule, DatePipe],
	template: `
		@if (guide) {
			@if (guide.individual) {
				@for (student of students; track $index) {
					<mat-card style="margin-bottom: 24px; margin-top: 24px">
						<mat-card-content>
							<div class="page" id="guide-{{ $index }}">
								<h2 mat-card-title>
									Gu&iacute;a de Observaci&oacute;n
								</h2>
								<div
									[style]="
										guide.date === ''
											? 'display: flex; gap: 12px;'
											: 'display: block;'
									"
								>
									<span><b>Fecha</b>: </span>
									@if (guide.date === '') {
										<div
											style="
												border-bottom: 1px solid black;
												flex: 1 1 auto;
											"
										>
											&nbsp;
										</div>
									} @else {
										{{ guide.date }}
									}
								</div>
								<div>
									<b>Estudiante Observado</b>:
									{{ student.firstname }}
									{{ student.lastname }}
								</div>
								<div>
									<b>Duraci&oacute;n</b>: {{ guide.duration }}
								</div>
								<div>
									<b>Descripci&oacute;n</b>:
									<div style="padding: 12px 0">
										{{ guide.description }}
									</div>
								</div>
								<div>
									<b>Competencias Espec&iacute;ficas</b>:
									<table
										style="
											display: block;
											width: 100%;
											margin-top: 12px;
											margin-bottom: 12px;
											border-collapse: collapse;
										"
									>
										<thead>
											<tr>
												@for (
													row of guide.competence;
													track $index
												) {
													<th>
														{{ row.fundamental }}
													</th>
												}
											</tr>
										</thead>
										<tbody>
											<tr>
												@for (
													row of guide.competence;
													track $index
												) {
													@for (
														item of row.items;
														track $index
													) {
														<td>{{ item }}</td>
													}
												}
											</tr>
										</tbody>
									</table>
								</div>
								<div style="padding-top: 12px">
									<b>Aspectos a Observar</b>:
									<ul
										style="
											list-style: none;
											padding: 0;
											display: block;
										"
									>
										@for (
											item of guide.aspects;
											track $index
										) {
											<li>{{ item }}</li>
										}
									</ul>
								</div>
								<div style="padding-top: 12px">
									<b>Registro</b>:
									@for (
										line of [].constructor(10);
										track $index
									) {
										<div
											style="border-bottom: 1px solid black"
										>
											&nbsp;
										</div>
									}
								</div>
							</div>
						</mat-card-content>
					</mat-card>
				}
			} @else {
				<mat-card style="margin-top: 24px">
					<mat-card-content>
						<div class="page" id="guide">
							<h2 mat-card-title>
								Gu&iacute;a de Observaci&oacute;n
							</h2>
							<h3 mat-card-subtitle>{{ guide.title }}</h3>
							<div
								[style]="
									guide.date === ''
										? 'display: flex; gap: 12px;'
										: 'display: block;'
								"
							>
								<span><b>Fecha</b>: </span>
								@if (guide.date === '') {
									<div
										style="
											border-bottom: 1px solid black;
											flex: 1 1 auto;
										"
									>
										&nbsp;
									</div>
								} @else {
									{{ guide.date | date: 'dd/MM/yyyy' }}
								}
							</div>
							<div>
								<b>Grupo Observado</b>: {{ guide.section.name }}
							</div>
							<div>
								<b>Duraci&oacute;n</b>: {{ guide.duration }}
							</div>
							<div>
								<b>Descripci&oacute;n</b>:
								<div style="padding: 12px 0">
									{{ guide.description }}
								</div>
							</div>
							<div>
								<b>Competencias Espec&iacute;ficas</b>:
								<table
									style="
										display: block;
										width: 100%;
										margin-top: 12px;
										margin-bottom: 12px;
										border-collapse: collapse;
									"
								>
									<thead>
										<tr>
											@for (
												row of guide.competence;
												track $index
											) {
												<th>{{ row.fundamental }}</th>
											}
										</tr>
									</thead>
									<tbody>
										<tr>
											@for (
												row of guide.competence;
												track $index
											) {
												@for (
													item of row.items;
													track $index
												) {
													<td>{{ item }}</td>
												}
											}
										</tr>
									</tbody>
								</table>
							</div>
							<div>
								<b>Aspectos a Observar</b>:
								<ul
									style="
										list-style: none;
										padding: 0;
										display: grid;
										gap: 4px 12px;
										grid-template-columns: 1fr 1fr;
									"
								>
									@for (item of guide.aspects; track $index) {
										<li>{{ item }}</li>
									}
								</ul>
							</div>
							<div>
								<b>Registro</b>:
								@for (
									line of [].constructor(10);
									track $index
								) {
									<div style="border-bottom: 1px solid black">
										&nbsp;
									</div>
								}
							</div>
						</div>
					</mat-card-content>
				</mat-card>
			}
		}
	`,
	styles: `
		.page {
			display: block;
			margin: 0 auto;
			padding: 12px;
			width: 8.5in;
		}

		thead,
		tr,
		tbody,
		td,
		th {
			border: 1px solid #ddd;
			text-align: start;
			padding: 12px;
		}
	`,
})
export class ObservationGuideComponent {
	@Input() guide: ObservationGuide | null = null;
	@Input() students: Student[] = [];
}
