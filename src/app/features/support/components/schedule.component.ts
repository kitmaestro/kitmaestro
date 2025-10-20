import { Component, inject, Input } from '@angular/core'
import { ClassSchedule } from '../../../core'
import { MatCardModule } from '@angular/material/card'
import { DatePipe } from '@angular/common'
import { Store } from '@ngrx/store'
import { selectAuthUser } from '../../../store/auth/auth.selectors'

@Component({
	selector: 'app-schedule',
	imports: [MatCardModule, DatePipe],
	template: `
		@if (schedule) {
			<mat-card>
				<mat-card-header>
					<mat-card-title>
						{{ schedule.section.name }} -
						{{ user()?.schoolName }} -
						{{ pretifyFormat(schedule.format) }}
					</mat-card-title>
				</mat-card-header>
				<mat-card-content>
					<table>
						<thead>
							<tr>
								<th style="max-width: fit-content">Hora</th>
								<th>Lunes</th>
								<th>Martes</th>
								<th>Miercoles</th>
								<th>Jueves</th>
								<th>Viernes</th>
							</tr>
						</thead>
						<tbody>
							@for (
								period of classPeriods;
								track period;
								let hour = $index
							) {
								<tr>
									<td
										style="
											max-width: fit-content;
											font-weight: bold;
										"
									>
										{{
											stringToDate(hours[hour].startTime)
												| date: 'hh:mm a'
										}}
										-
										{{
											stringToDate(hours[hour].endTime)
												| date: 'hh:mm a'
										}}
									</td>
									@if (hours[hour].classSession) {
										@for (day of daysOfWeek; track day) {
											<td>
												{{
													findSubject(
														day,
														hours[hour].startTime
													)
												}}
											</td>
										}
									} @else {
										<td
											style="
												text-align: center;
												font-weight: bold;
											"
											colspan="5"
										>
											{{ hours[hour].label }}
										</td>
									}
								</tr>
							}
						</tbody>
					</table>
				</mat-card-content>
			</mat-card>
		}
	`,
	styles: `
		mat-form-field {
			width: 100%;
		}

		.grid-2 {
			display: grid;
			gap: 12px;
			grid-template-columns: 1fr;

			@media screen and (min-width: 960px) {
				grid-template-columns: 1fr 1fr;
			}
		}

		table {
			width: 100%;
			table-layout: fixed;
			border-collapse: collapse;
		}

		td,
		th {
			padding: 8px;
			border: 1px solid #ccc;
			text-align: center;
		}
	`,
})
export class ScheduleComponent {
	@Input() schedule: ClassSchedule | null = null
	#store = inject(Store)
	user = this.#store.selectSignal(selectAuthUser)

	classPeriods = [null, 0, 1, null, 2, 3, null, 4, 5, null, 6, 7]
	daysOfWeek = [1, 2, 3, 4, 5]
	hours = [
		{
			classSession: false,
			startTime: '08:00',
			endTime: '08:15',
			label: 'Acto Cívico',
		},
		{
			classSession: true,
			startTime: '08:15',
			endTime: '09:00',
		},
		{
			classSession: true,
			startTime: '09:00',
			endTime: '09:45',
		},
		{
			classSession: false,
			startTime: '09:45',
			endTime: '10:15',
			label: 'Recreo',
		},
		{
			classSession: true,
			startTime: '10:15',
			endTime: '11:00',
		},
		{
			classSession: true,
			startTime: '11:00',
			endTime: '11:45',
		},
		{
			classSession: false,
			startTime: '11:45',
			endTime: '12:45',
			label: 'Almuerzo',
		},
		{
			classSession: true,
			startTime: '12:45',
			endTime: '13:30',
		},
		{
			classSession: true,
			startTime: '13:30',
			endTime: '14:15',
		},
		{
			classSession: false,
			startTime: '14:15',
			endTime: '14:30',
			label: 'Receso',
		},
		{
			classSession: true,
			startTime: '14:30',
			endTime: '15:15',
		},
		{
			classSession: true,
			startTime: '15:15',
			endTime: '16:00',
		},
	]

	stringToDate(str: string) {
		const date = new Date()
		const [hours, minutes] = str.split(':')
		if (hours && minutes) {
			date.setHours(+hours)
			date.setMinutes(+minutes)
		}
		return date
	}

	findSubject(day: number, hour: string) {
		if (this.schedule) {
			const period = this.schedule.periods.find(
				(p) => p.startTime === hour && p.dayOfWeek === day,
			)
			if (period) {
				return this.pretify(period.subject)
			}
		}
		return ''
	}

	pretifyFormat(str: string) {
		if (str === 'JEE') return 'Jornada Extendida'
		if (str === 'MATUTINA') return 'Matutina'
		if (str === 'VESPERTINA') return 'Vespertina'
		if (str === 'NOCTURNA') return 'Nocturna'
		if (str === 'SABATINA') return 'Sabatina'
		return 'error'
	}

	pretify(str: string) {
		switch (str) {
			case 'LENGUA_ESPANOLA':
				return 'Lengua Española'
			case 'MATEMATICA':
				return 'Matemática'
			case 'CIENCIAS_SOCIALES':
				return 'Ciencias Sociales'
			case 'CIENCIAS_NATURALES':
				return 'Ciencias de la Naturaleza'
			case 'INGLES':
				return 'Inglés'
			case 'FRANCES':
				return 'Francés'
			case 'FORMACION_HUMANA':
				return 'Formación Integral Humana y Religiosa'
			case 'EDUCACION_FISICA':
				return 'Educación Física'
			case 'EDUCACION_ARTISTICA':
				return 'Educación Artística'
			case 'TALLERES_OPTATIVOS':
				return 'Talleres Optativos'
			default:
				return str
		}
	}
}
