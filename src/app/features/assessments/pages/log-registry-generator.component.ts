import { Component, OnInit, inject } from '@angular/core'
import { LogRegistryEntry } from '../../../core'
import { MatSnackBarModule } from '@angular/material/snack-bar'
import { MatDialog, MatDialogModule } from '@angular/material/dialog'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { LogRegistryEntryFormComponent } from '../../../shared/ui/log-registry-entry-form.component'
import { LogRegistryEntryDetailsComponent } from '../components/log-registry-entry-details.component'
import { MatTableModule } from '@angular/material/table'
import { MatCardModule } from '@angular/material/card'
import { Student } from '../../../core'
import { LogRegistryEntryEditFormComponent } from '../../../shared/ui/log-registry-entry-edit-form.component'
import { IsPremiumComponent } from '../../../shared/ui/is-premium.component'
import { DatePipe } from '@angular/common'
import { Store } from '@ngrx/store'
import { selectAllEntries } from '../../../store/log-registry-entries/log-registry-entries.selectors'
import { deleteLogRegistryEntry, loadLogRegistryEntries } from '../../../store'

@Component({
	selector: 'app-log-registry-generator',
	imports: [
		MatDialogModule,
		MatSnackBarModule,
		MatButtonModule,
		MatCardModule,
		MatIconModule,
		MatTableModule,
		IsPremiumComponent,
		DatePipe,
	],
	template: `
		<app-is-premium>
			<div>
				<div style="display: flex; justify-content: space-between; align-items: center;">
					<h2>Registro Anecdótico</h2>
					<button
						style="margin-left: auto"
						(click)="createLogRegistryEntry()"
						mat-flat-button
					>
						<mat-icon>add</mat-icon>
						Nueva Entrada
					</button>
				</div>
			</div>
			<table
				mat-table
				[dataSource]="entries()"
				style="margin-top: 24px"
				class="mat-elevation-z4"
			>
				<ng-container matColumnDef="date">
					<th mat-header-cell *matHeaderCellDef>Fecha</th>
					<td mat-cell *matCellDef="let element">
						{{ element.date | date: 'dd/MM/yyyy' }}
					</td>
				</ng-container>

				<ng-container matColumnDef="time">
					<th mat-header-cell *matHeaderCellDef>Hora</th>
					<td mat-cell *matCellDef="let element">
						{{ element.date | date: 'hh:mm a' }}
					</td>
				</ng-container>

				<ng-container matColumnDef="grade">
					<th mat-header-cell *matHeaderCellDef>Grado</th>
					<td mat-cell *matCellDef="let element">
						{{ element.section.name }}
					</td>
				</ng-container>

				<ng-container matColumnDef="students">
					<th mat-header-cell *matHeaderCellDef>Estudiante(s)</th>
					<td mat-cell *matCellDef="let element">
						{{ studentNames(element.students) }}
					</td>
				</ng-container>

				<ng-container matColumnDef="place">
					<th mat-header-cell *matHeaderCellDef>Lugar</th>
					<td mat-cell *matCellDef="let element">
						{{ element.place }}
					</td>
				</ng-container>

				<ng-container matColumnDef="event">
					<th mat-header-cell *matHeaderCellDef>Evento</th>
					<td mat-cell *matCellDef="let element">
						{{ element.type }}
					</td>
				</ng-container>

				<ng-container matColumnDef="actions">
					<th mat-header-cell *matHeaderCellDef>Acciones</th>
					<td mat-cell *matCellDef="let element">
						<button
							style="margin-right: 12px"
							color="warn"
							(click)="deleteLogRegistryEntry(element._id)"
							mat-icon-button
						>
							<mat-icon>delete</mat-icon>
						</button>
						<button
							style="margin-right: 12px"
							color="accent"
							(click)="editLogRegistryEntry(element)"
							mat-icon-button
						>
							<mat-icon>edit</mat-icon>
						</button>
						<button
							color="primary"
							(click)="showLogRegistryEntry(element)"
							mat-icon-button
						>
							<mat-icon>open_in_new</mat-icon>
						</button>
					</td>
				</ng-container>

				<tr mat-header-row *matHeaderRowDef="labels"></tr>
				<tr mat-row *matRowDef="let row; columns: labels"></tr>
			</table>
		</app-is-premium>
	`,
})
export class LogRegistryGeneratorComponent implements OnInit {
	#store = inject(Store)
	private dialog = inject(MatDialog)
	entries = this.#store.selectSignal(selectAllEntries)

	labels = ['date', 'time', 'grade', 'students', 'event', 'actions']

	eventTypes = [
		'Mejora de comportamiento',
		'Mejora de escritura',
		'Mejora de lectura',
		'Mejora de comprensión',
		'Mejora en matemática',
		'Interrupción de la clase',
		'Salida sin permiso',
		'Comportamiento inadecuado en clase',
		'Pelea',
		'Incumplimiento de acuerdo',
		'Asignación no entregada',
		'Asignación no satisfactoria',
	]

	ngOnInit(): void {
		this.#store.dispatch(loadLogRegistryEntries())
	}

	createLogRegistryEntry() {
		this.dialog.open(LogRegistryEntryFormComponent, {
			maxWidth: '960px',
			width: '75%',
		})
	}

	editLogRegistryEntry(entry: LogRegistryEntry) {
		this.dialog.open(LogRegistryEntryEditFormComponent, {
			data: entry,
			maxWidth: '960px',
			width: '75%',
		})
	}

	showLogRegistryEntry(entry: LogRegistryEntry) {
		const ref = this.dialog.open(LogRegistryEntryDetailsComponent, {
			data: entry,
			maxWidth: '960px',
			width: '75%',
		})
		ref.afterClosed().subscribe((res) => {
			if (res) {
				this.editLogRegistryEntry(entry)
			}
		})
	}

	studentNames(students: Student[]) {
		return students.map((s) => s.firstname + ' ' + s.lastname).join(', ')
	}

	deleteLogRegistryEntry(id: string) {
		this.#store.dispatch(deleteLogRegistryEntry({ id }))
	}
}
