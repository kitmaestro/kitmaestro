import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PretifyPipe } from '../../../shared/pipes/pretify.pipe';
import { UnitPlan } from '../../../core/models';
import { Store } from '@ngrx/store';
import { selectAuthUser } from '../../../store/auth/auth.selectors';
import { selectClassPlans } from '../../../store/class-plans/class-plans.selectors';
import { selectAllUnitPlans } from '../../../store/unit-plans/unit-plans.selectors';
import { loadClassPlans } from '../../../store/class-plans/class-plans.actions';
import {
	deleteUnitPlan,
	downloadUnitPlan,
	loadUnitPlans,
} from '../../../store/unit-plans/unit-plans.actions';

@Component({
	selector: 'app-unit-plan-list',
	imports: [
		MatButtonModule,
		MatCardModule,
		MatListModule,
		MatTableModule,
		DatePipe,
		RouterModule,
		MatIconModule,
		PretifyPipe,
	],
	template: `
		<div class="header">
			<h2 class="title">Mis Unidades de Aprendizaje</h2>
			<button
				mat-flat-button
				class="title-button"
				[routerLink]="['/planning', 'unit-plans']"
			>
				Crear Nueva Unidad
			</button>
		</div>

		<table
			mat-table
			[dataSource]="unitPlans$"
			class="mat-elevation-z8"
			style="margin-top: 24px"
		>
			<ng-container matColumnDef="title">
				<th mat-header-cell *matHeaderCellDef>T&iacute;tulo</th>
				<td mat-cell *matCellDef="let plan">
					<a [routerLink]="['/planning', 'unit-plans', plan._id]">{{
						plan.title
					}}</a>
				</td>
			</ng-container>

			<ng-container matColumnDef="section">
				<th mat-header-cell *matHeaderCellDef>Curso</th>
				<td mat-cell *matCellDef="let plan">
					@if (plan.sections && plan.sections.length) {
						@for (section of plan.sections; track $index) {
							{{ $index > 0 ? ', ' : '' }}{{ section.name }}
						}
					} @else {
						{{ plan.section ? plan.section.name : 'No Asignado' }}
					}
				</td>
			</ng-container>

			<ng-container matColumnDef="subject">
				<th mat-header-cell *matHeaderCellDef>Asignaturas</th>
				<td mat-cell *matCellDef="let plan">
					@for (subject of plan.subjects; track $index) {
						@if ($index > 0) {
							<span>, </span>
						}
						<span>{{ subject | pretify }}</span>
					}
				</td>
			</ng-container>

			<ng-container matColumnDef="date">
				<th mat-header-cell *matHeaderCellDef>Fecha</th>
				<td mat-cell *matCellDef="let plan">
					{{
						plan.createdAt
							? (plan.createdAt | date: 'dd/MM/yyyy' : '+0400')
							: 'N/A'
					}}
				</td>
			</ng-container>

			<ng-container matColumnDef="actions">
				<th mat-header-cell *matHeaderCellDef>Acciones</th>
				<td mat-cell *matCellDef="let plan">
					<div>
						<button
							mat-icon-button
							color="warn"
							(click)="deletePlan(plan._id)"
						>
							<mat-icon>delete</mat-icon>
						</button>
						<button mat-icon-button (click)="download(plan)">
							<mat-icon>download</mat-icon>
						</button>
						<button
							[routerLink]="['/planning', 'unit-plans', plan._id]"
							mat-icon-button
						>
							<mat-icon>open_in_new</mat-icon>
						</button>
					</div>
				</td>
			</ng-container>

			<tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
			<tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
		</table>
	`,
	styles: `
		.header {
			justify-content: space-between;
			align-items: center;
			display: flex;
			margin-bottom: 24px;
		}

		a {
			text-decoration: none;
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
export class UnitPlanListComponent implements OnInit {
	#store = inject(Store);
	user = this.#store.selectSignal(selectAuthUser);
	unitPlans$ = this.#store.select(selectAllUnitPlans);
	classPlans = this.#store.selectSignal(selectClassPlans);

	displayedColumns = ['title', 'section', 'subject', 'date', 'actions'];

	loading = true;

	ngOnInit() {
		this.#store.dispatch(loadClassPlans({}));
		this.#store.dispatch(loadUnitPlans({}));
	}

	deletePlan(id: string) {
		this.#store.dispatch(deleteUnitPlan({ id }));
	}

	async download(plan: UnitPlan) {
		const user = this.user();
		console.log(this.classPlans())
		const classPlans = this.classPlans().filter(
			(c) =>
				c.unitPlan ? (typeof c.unitPlan === 'string'
					? c.unitPlan
					: (c.unitPlan as UnitPlan)._id) === plan._id : false,
		);
		if (!user) return;
		this.#store.dispatch(downloadUnitPlan({ plan, classPlans, user }));
	}
}
