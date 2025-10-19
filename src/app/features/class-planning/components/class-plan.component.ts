import { Component, inject, Input, OnInit } from '@angular/core';
import { ClassPlan } from '../../../core/interfaces/class-plan';
import { DatePipe } from '@angular/common';
import { User } from '../../../core/interfaces';
import { AuthService } from '../../../core/services/auth.service';
import { ClassSection } from '../../../core/interfaces/class-section';
import { PretifyPipe } from '../../../shared/pipes';

@Component({
	selector: 'app-class-plan',
	imports: [
		DatePipe,
		PretifyPipe,
	],
	template: `
		@if (classPlan) {
			<div class="shadow">
				<div class="page" id="class-plan">
					<table>
						<thead>
							<tr>
								<td style="width: 160px">
									<b>Fecha</b>:
									{{
										classPlan.date
											| date: 'dd/MM/yyyy' : 'UTC+4'
									}}
								</td>
								<td style="width: 280px">
									<b>Grado y Sección</b>:
									{{
										section?.name || classPlan.section.name
									}}
								</td>
								<td>
									<b>Docente</b>: {{ user?.title }}.
									{{ user?.firstname }} {{ user?.lastname }}
								</td>
								<td colspan="2">
									<b>Área Curricular</b>:
									{{ (classPlan.subject || '') | pretify }}
								</td>
							</tr>
							<tr>
								<td colspan="5">
									<b
										>Estrategias y técnicas de
										enseñanza-aprendizaje</b
									>: {{ classPlan.strategies.join(', ') }}
								</td>
							</tr>
							<tr>
								<td colspan="5">
									<b>Intencion Pedag&oacute;gica</b>:
									{{ classPlan.objective }}
								</td>
							</tr>
							<tr>
								<th>Momento / Duración</th>
								<th style="width: 18%">
									Competencias Especificas
								</th>
								<th>Actividades</th>
								<th style="width: 18%">
									Organización de los Estudiantes
								</th>
								<th style="width: 15%">Recursos</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>
									<b>Inicio</b> ({{
										classPlan.introduction.duration
									}}
									Minutos)
								</td>
								<td rowspan="4">{{ classPlan.competence }}</td>
								<td>
									<ul
										style="margin: 0; padding: 0; list-style: none"
									>
										@for (
											actividad of classPlan.introduction
												.activities;
											track actividad
										) {
											<li>{{ actividad }}</li>
										}
									</ul>
								</td>
								<td>
									{{ classPlan.introduction.layout }}
								</td>
								<td>
									<ul
										style="margin: 0; padding: 0; list-style: none"
									>
										@for (
											recurso of classPlan.introduction
												.resources;
											track recurso
										) {
											<li>- {{ recurso }}</li>
										}
									</ul>
								</td>
							</tr>
							<tr>
								<td>
									<b>Desarrollo</b> ({{
										classPlan.main.duration
									}}
									Minutos)
								</td>
								<td>
									<ul
										style="margin: 0; padding: 0; list-style: none"
									>
										@for (
											actividad of classPlan.main
												.activities;
											track actividad
										) {
											<li>{{ actividad }}</li>
										}
									</ul>
								</td>
								<td>
									{{ classPlan.main.layout }}
								</td>
								<td>
									<ul
										style="margin: 0; padding: 0; list-style: none"
									>
										@for (
											recurso of classPlan.main.resources;
											track recurso
										) {
											<li>- {{ recurso }}</li>
										}
									</ul>
								</td>
							</tr>
							<tr>
								<td>
									<b>Cierre</b> ({{
										classPlan.closing.duration
									}}
									Minutos)
								</td>
								<td>
									<ul
										style="margin: 0; padding: 0; list-style: none"
									>
										@for (
											actividad of classPlan.closing
												.activities;
											track actividad
										) {
											<li>{{ actividad }}</li>
										}
									</ul>
								</td>
								<td>
									{{ classPlan.closing.layout }}
								</td>
								<td>
									<ul
										style="margin: 0; padding: 0; list-style: none"
									>
										@for (
											recurso of classPlan.closing
												.resources;
											track recurso
										) {
											<li>- {{ recurso }}</li>
										}
									</ul>
								</td>
							</tr>
							<tr>
								<td><b>Actividades Complementarias</b></td>
								<td>
									<ul
										style="margin: 0; padding: 0; list-style: none"
									>
										@for (
											actividad of classPlan.supplementary
												.activities;
											track actividad
										) {
											<li>{{ actividad }}</li>
										}
									</ul>
								</td>
								<td>
									{{ classPlan.supplementary.layout }}
								</td>
								<td>
									<ul
										style="margin: 0; padding: 0; list-style: none"
									>
										@for (
											recurso of classPlan.supplementary
												.resources;
											track recurso
										) {
											<li>- {{ recurso }}</li>
										}
									</ul>
								</td>
							</tr>
							<tr>
								<td colspan="5">
									<b>Vocabulario del día/de la semana</b>:
									{{ classPlan.vocabulary.join(', ') }}
								</td>
							</tr>
							<tr>
								<td colspan="5">
									<b
										>Lecturas recomendadas/ o libro de la
										semana</b
									>:
									{{ classPlan.readings }}
								</td>
							</tr>
							<tr>
								<td colspan="5"><b>Observaciones</b>:</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		}
	`,
	styles: `
		table {
			border-collapse: collapse;
			border: 1px solid gray;
			background-color: white;
			width: 100%;
		}

		mat-form-field {
			width: 100%;
		}

		.page {
			padding: 0.5in;
			margin: 42px auto;
			background-color: white;
			min-width: 1400px;
		}

		.shadow {
			box-shadow: 10px 10px 14px 0px rgba(0, 0, 0, 0.75);
			-webkit-box-shadow: 10px 10px 14px 0px rgba(0, 0, 0, 0.75);
			-moz-box-shadow: 10px 10px 14px 0px rgba(0, 0, 0, 0.75);
		}

		td,
		th {
			border: 1px solid #ccc;
			padding: 8px;
		}

		.controls-container-6 {
			display: grid;
			gap: 12px;
			grid-template-columns: 1fr;

			@media screen and (min-width: 960px) {
				grid-template-columns: repeat(2, 1fr);
			}

			@media screen and (min-width: 1200px) {
				grid-template-columns: repeat(3, 1fr);
			}
		}

		@media screen and (max-width: 959px) {
			h2.title {
				display: block;
				width: 100%;
				margin-bottom: 12px;
			}

			.title-button {
				display: block;
				width: 100%;
				margin-bottom: 24px;
			}

			.header {
				display: block;
			}
		}

		.title-button {
			margin-left: auto;
		}
	`,
})
export class ClassPlanComponent implements OnInit {
	@Input() classPlan: ClassPlan | null = null;
	@Input() section: ClassSection | null = null;
	userService = inject(AuthService);
	user: User | null = null;

	ngOnInit() {
		this.userService.profile().subscribe((user) => {
			if (user._id) {
				this.user = user;
			}
		});
	}
}
