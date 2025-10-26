import { Component, inject, OnInit } from '@angular/core'
import { MatTableModule } from '@angular/material/table'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { RouterLink } from '@angular/router'
import { DatePipe } from '@angular/common'
import { Store } from '@ngrx/store'
import { selectAllGuides } from '../../../store/observation-guides/observation-guides.selectors'
import { deleteGuide, loadGuides } from '../../../store'

@Component({
	selector: 'app-observation-sheets',
	imports: [
		MatTableModule,
		MatButtonModule,
		MatIconModule,
		RouterLink,
		DatePipe,
	],
	template: `
		<div style="margin-bottom: 24px; display: flex; align-items: center; justify-content: space-between;">
			<h2>Gu&iacute;as de Observaci&oacute;n</h2>
			<button mat-flat-button routerLink="/assessments/observation-sheet-generator">
				<mat-icon>add</mat-icon>
				Nueva Gu&iacute;a
			</button>
		</div>
		<table
			mat-table
			[dataSource]="assessments()"
			class="mat-elevation-z8"
			style="margin-top: 24px"
		>
			<ng-container matColumnDef="title">
				<th mat-header-cell *matHeaderCellDef>T&iacute;tulo</th>
				<td mat-cell *matCellDef="let element">{{ element.title }}</td>
			</ng-container>
			<ng-container matColumnDef="date">
				<th mat-header-cell *matHeaderCellDef>Fecha</th>
				<td mat-cell *matCellDef="let element">
					{{ element.date | date: 'dd/MM/yyyy' }}
				</td>
			</ng-container>
			<ng-container matColumnDef="section">
				<th mat-header-cell *matHeaderCellDef>Curso</th>
				<td mat-cell *matCellDef="let element">
					{{ element.section.name }}
				</td>
			</ng-container>
			<ng-container matColumnDef="individual">
				<th mat-header-cell *matHeaderCellDef>Individual</th>
				<td mat-cell *matCellDef="let element">
					{{ element.individual ? 'Si' : 'No' }}
				</td>
			</ng-container>
			<ng-container matColumnDef="actions">
				<th mat-header-cell *matHeaderCellDef>Acciones</th>
				<td mat-cell *matCellDef="let element">
					<button
						(click)="deleteAssessment(element._id)"
						color="warn"
						style="display: none"
						mat-icon-button
					>
						<mat-icon>delete</mat-icon>
					</button>
					<button
						[routerLink]="[
							'/assessments/observation-sheets',
							element._id,
						]"
						color="primary"
						mat-icon-button
					>
						<mat-icon>open_in_new</mat-icon>
					</button>
				</td>
			</ng-container>

			<tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
			<tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
		</table>
	`,
})
export class ObservationSheetsComponent implements OnInit {
	#store = inject(Store)

	displayedColumns = ['title', 'date', 'section', 'individual', 'actions']

	assessments = this.#store.selectSignal(selectAllGuides)

	ngOnInit(): void {
		this.#store.dispatch(loadGuides())
	}

	deleteAssessment(id: string) {
		this.#store.dispatch(deleteGuide({ id }))
	}
}
