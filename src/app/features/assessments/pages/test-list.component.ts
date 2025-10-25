import { Component, inject, OnInit } from '@angular/core'
import { Test } from '../../../core'
import { MatDialog, MatDialogModule } from '@angular/material/dialog'
import { MatCardModule } from '@angular/material/card'
import { MatTableModule } from '@angular/material/table'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { TestComponent } from '../components/test.component'
import { RouterLink } from '@angular/router'
import { PretifyPipe } from '../../../shared/pipes/pretify.pipe'
import { Store } from '@ngrx/store'
import { selectAllTests, selectIsLoadingMany } from '../../../store/tests/tests.selectors'
import { deleteTest, downloadTest, loadTests } from '../../../store'

@Component({
	selector: 'app-test-list',
	imports: [
		MatDialogModule,
		MatCardModule,
		MatButtonModule,
		MatTableModule,
		MatIconModule,
		RouterLink,
		PretifyPipe,
	],
	template: `
		<div>
			<div
				style="justify-content: space-between; align-items: center; display: flex;"
			>
				<h2>Mis Exámenes</h2>
				<button mat-flat-button routerLink="/assessments/test-generator">
					<mat-icon>add</mat-icon>
					Generar Ex&aacute;men
				</button>
			</div>
		</div>

		@if (tests().length) {
			<div style="margin-top: 24px">
				<table mat-table [dataSource]="tests()" class="mat-elevation-z8">
					<ng-container matColumnDef="grade">
						<th mat-header-cell *matHeaderCellDef>Sección</th>
						<td mat-cell *matCellDef="let element">
							{{ element.section.name }} ({{
								element.section.year | pretify
							}}
							de {{ element.section.level | pretify }})
						</td>
					</ng-container>
					<ng-container matColumnDef="subject">
						<th mat-header-cell *matHeaderCellDef>Asignatura</th>
						<td mat-cell *matCellDef="let element">
							{{ element.subject | pretify }}
						</td>
					</ng-container>
					<ng-container matColumnDef="actions">
						<th mat-header-cell *matHeaderCellDef>Acciones</th>
						<td mat-cell *matCellDef="let element">
							<div style="display: flex; gap: 12px">
								<button
									[disabled]="loading()"
									title="Eliminar"
									mat-icon-button
									(click)="delete(element._id)"
								>
									<mat-icon>delete</mat-icon>
								</button>
								<button
									[disabled]="loading()"
									title="Descargar Word"
									mat-icon-button
									(click)="download(element)"
								>
									<mat-icon>download</mat-icon>
								</button>
								<a
									title="Abrir"
									mat-icon-button
									routerLink="/assessments/tests/{{ element._id }}"
									><mat-icon>open_in_new</mat-icon></a
								>
							</div>
						</td>
					</ng-container>

					<tr mat-header-row *matHeaderRowDef="columns"></tr>
					<tr mat-row *matRowDef="let row; columns: columns"></tr>
				</table>
			</div>
		}
	`,
})
export class TestListComponent implements OnInit {
	#store = inject(Store)
	dialog = inject(MatDialog)
	loading = this.#store.selectSignal(selectIsLoadingMany)

	tests = this.#store.selectSignal(selectAllTests)

	columns = ['grade', 'subject', 'actions']

	ngOnInit() {
		this.#store.dispatch(loadTests({ filters: {} }))
	}

	delete(id: string) {
		this.#store.dispatch(deleteTest({ id }))
	}

	open(test: Test) {
		this.dialog.open(TestComponent, {
			data: test,
		})
	}

	async download(test: Test) {
		this.#store.dispatch(downloadTest({ test }))
	}
}
