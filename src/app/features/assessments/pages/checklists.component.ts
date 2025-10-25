import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { Checklist } from '../../../core';
import { PretifyPipe } from '../../../shared/pipes/pretify.pipe';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { deleteChecklist, downloadChecklist, loadChecklists, loadCurrentSubscription, selectAllChecklists } from '../../../store';
import { selectCurrentSubscription } from '../../../store/user-subscriptions/user-subscriptions.selectors';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
	selector: 'app-checklists',
	imports: [
		MatButtonModule,
		MatIconModule,
		MatTableModule,
		MatTooltipModule,
		PretifyPipe,
		RouterLink,
	],
	template: `
		<div>
			<div>
				<div style="align-items: center; justify-content: space-between; display: flex;">
					<h2>Mis Listas de Cotejo</h2>
					<a
						mat-flat-button
						routerLink="/assessments/checklist-generator"
						>
						Crear Nueva
					</a>
				</div>
			</div>

			@if (checklists().length) {
				<table style="margin-top: 24px" mat-table [dataSource]="checklists()">
					<ng-container matColumnDef="classSection">
						<th mat-header-cell *matHeaderCellDef>Curso</th>
						<td mat-cell *matCellDef="let checklist">
							{{ checklist.section.name }}
						</td>
					</ng-container>
					<ng-container matColumnDef="subject">
						<th mat-header-cell *matHeaderCellDef>Asignatura</th>
						<td mat-cell *matCellDef="let checklist">
							{{ checklist.contentBlock.subject | pretify }}
						</td>
					</ng-container>
					<ng-container matColumnDef="unit">
						<th mat-header-cell *matHeaderCellDef>Unidad</th>
						<td mat-cell *matCellDef="let checklist">
							{{ checklist.contentBlock.title }}
						</td>
					</ng-container>
					<ng-container matColumnDef="title">
						<th mat-header-cell *matHeaderCellDef>Titulo</th>
						<td mat-cell *matCellDef="let checklist">
							{{ checklist.title }}
						</td>
					</ng-container>
					<ng-container matColumnDef="activity">
						<th mat-header-cell *matHeaderCellDef>Actividad</th>
						<td mat-cell *matCellDef="let checklist">
							{{ checklist.activity }}
						</td>
					</ng-container>
					<ng-container matColumnDef="actions">
						<th mat-header-cell *matHeaderCellDef>Acciones</th>
						<td mat-cell *matCellDef="let checklist">
							<div style="display: flex; gap: 12px">
								<button
									(click)="delete(checklist._id)"
									mat-icon-button
								>
									<mat-icon>delete</mat-icon>
								</button>
								<div [matTooltip]="isPremium() ? 'Descargar' : 'Necesitas una suscripcion para descargar'">
									<button
										(click)="download(checklist)"
										[disabled]="!isPremium()"
										mat-icon-button
									>
										<mat-icon>download</mat-icon>
									</button>
								</div>
								<a
									routerLink="/assessments/checklists/{{ checklist._id }}"
									mat-icon-button
									><mat-icon>open_in_new</mat-icon></a
								>
							</div>
						</td>
					</ng-container>
					<tr mat-header-row *matHeaderRowDef="['classSection', 'subject', 'unit', 'title', 'activity', 'actions']"></tr>
					<tr mat-row *matRowDef="let checklist; columns: ['classSection', 'subject', 'unit', 'title', 'activity', 'actions'];"></tr>
				</table>
			} @else {
				<div style="margin-top: 24px">
					<div>
						<p style="padding: 24px; text-align: center">
							No tienes ninguna lista de cotejo todavia. Empieza
							por
							<a mat-button routerLink="/assessments/checklist-generator"
								>crear una lista</a
							>
							ahora.
						</p>
					</div>
				</div>
			}
		</div>
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
export class ChecklistsComponent implements OnInit {
	#store = inject(Store)
	isPremium = this.#store.selectSignal(selectCurrentSubscription)
	checklists = this.#store.selectSignal(selectAllChecklists)
	
	ngOnInit() {
		this.#store.dispatch(loadChecklists())
		this.#store.dispatch(loadCurrentSubscription())
	}

	download(checklist: Checklist) {
		this.#store.dispatch(downloadChecklist({ checklist }))
	}

	delete(id: string) {
		this.#store.dispatch(deleteChecklist({ id }))
	}
}
