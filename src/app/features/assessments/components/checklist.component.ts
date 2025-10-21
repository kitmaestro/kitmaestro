import { Component, input, OnInit } from '@angular/core';
import { Checklist } from '../../../core';
import { PretifyPipe } from '../../../shared/pipes/pretify.pipe';

@Component({
	selector: 'app-checklist',
	template: `
		@if (checklist(); as list) {
			<div style="margin-top: 24px" class="checklist">
				<h1 style="text-align: center">"{{ list.title }}"</h1>
				<h2 style="text-align: center">{{ list.activityType }}</h2>
				<h3 style="text-align: center">Lista de Cotejo</h3>
				<p><b>Competencias Fundamentales</b>: {{ compNames }}</p>
					<p><b>Competencias Específicas</b>:</p>
					<ul>
						@for (comp of list.competence; track comp) {
							@for (entry of comp.entries; track entry) {
								<li>{{ entry }}</li>
							}
						}
					</ul>
					<p><b>Indicadores de Logro</b>:</p>
					<ul>
						@for (
							indicator of list.contentBlock.achievement_indicators;
							track indicator
						) {
							<li>{{ indicator }}</li>
						}
					</ul>
					<p><b>Evidencia</b>: {{ list.activity }}</p>
					<div style="display: flex">
						<span style="margin-right: 12px"><b>Nombre</b>:</span>
						<span
							style="border-bottom: 1px solid #424242; flex: 1 1 auto"
						></span>
						<span style="margin: 0 12px"><b>Curso</b>: </span>
						<span
							style="border-bottom: 1px solid #424242; flex: 1 1 auto"
						></span>
						<span style="margin: 0 12px"><b>Fecha</b>: </span>
						<span
							style="border-bottom: 1px solid #424242; flex: 1 1 auto"
						></span>
					</div>
					<table class="table">
						<thead>
							<tr>
								<th>Criterio de Evaluación</th>
								<th>Si</th>
								<th>No</th>
								<th>Observaciones</th>
							</tr>
						</thead>
						<tbody>
							@for (row of list.criteria; track row) {
								<tr>
									<td>{{ row }}</td>
									<td></td>
									<td></td>
									<td></td>
								</tr>
							}
						</tbody>
					</table>
				</div>
			</div>
		}
	`,
	styles: `
		.form-grid {
			display: grid;
			gap: 12px;
			grid-template-columns: 1fr;

			@media screen and (min-width: 960px) {
				grid-template-columns: 1fr 1fr;
			}

			@media screen and (min-width: 1200px) {
				grid-template-columns: 1fr 1fr 1fr;
			}
		}

		mat-form-field {
			width: 100%;
		}

		.table {
			width: 100%;
			border-collapse: collapse;
			margin-top: 24px;

			td,
			th {
				border: 1px solid #aaa;
				padding: 8px 12px;
			}
		}

		.checklist {
			max-width: 8.5in;
			margin: 24px auto;
			background-color: #fff;
			box-shadow: #ddd 4px 4px 8px;
			padding: 0.7in;
		}
	`,
})
export class ChecklistComponent implements OnInit {
	checklist = input<Checklist>();
	compNames = '';

	pretify(str: string) {
		return new PretifyPipe().transform(str);
	}

	ngOnInit() {
		const checklist = this.checklist();
		if (checklist) {
			this.compNames = checklist.competence
				.flatMap((c) => this.pretify(c.name))
				.join(', ');
		}
	}
}
