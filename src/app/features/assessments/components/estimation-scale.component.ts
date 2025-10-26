import { Component, computed, inject, input } from "@angular/core";
import { EstimationScale } from "../../../core";
import { Store } from "@ngrx/store";
import { selectAuthUser } from "../../../store";

@Component({
    selector: 'app-estimation-scale',
    template: `
        @if (estimationScale(); as data) {
            <div style="margin-top: 24px">
				<div>
					<div
						style="width: 8.5in; padding: 0.35in; margin: 0 auto"
						id="estimation-scale"
					>
						@if (data.section) {
							<div style="text-align: center">
								<h2 style="margin: 0px">
									{{ user()?.schoolName }}
								</h2>
								<h3 style="margin: 0px">
									A&ntilde;o Escolar {{ schoolYear() }}
								</h3>
								<h3 style="margin: 0px">
									{{ user()?.title }}. {{ user()?.firstname }}
									{{ user()?.lastname }}
								</h3>
								<h2 style="margin: 0px">
									Escala de Estimaci&oacute;n
								</h2>
								<h3 style="margin: 0px">
									{{ data.title }}
								</h3>
							</div>
							<h3 style="text-align: end">
								{{ data.section.name }}
							</h3>
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
							@for (
								item of data.competence;
								track item
							) {
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
						<ul
							style="list-style: none; margin: 0 0 12px; padding: 0"
						>
							@for (
								item of data.achievementIndicators;
								track item
							) {
								<li>- {{ item }}</li>
							}
						</ul>
						<p>
							<b>Evidencia o Actividad</b>:
							{{ data.activity }}
						</p>
						<table>
							<thead>
								<tr>
									<th>Indicador o Criterio</th>
									@for (
										level of data.levels;
										track level
									) {
										<th>{{ level }}</th>
									}
									<th>Observaciones</th>
								</tr>
							</thead>
							<tbody>
								@for (
									row of data.criteria;
									track row
								) {
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
				</div>
			</div>
        }
    `,
    styles: `
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
    `
})
export class EstimationScaleComponent {
    #store = inject(Store)
    estimationScale = input<EstimationScale>()

    user = this.#store.selectSignal(selectAuthUser)

    schoolYear = computed(() => {
        const date = new Date()
        if (date.getMonth() < 6) {
            return date.getFullYear() - 1 + ' - ' + date.getFullYear()
        }
        return date.getFullYear() + ' - ' + (date.getFullYear() + 1)
    })
}
