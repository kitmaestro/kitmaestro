import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { tap } from 'rxjs';
import { UnitPlanService } from '../../../core/services/unit-plan.service';
import { PretifyPipe } from '../../../shared/pipes/pretify.pipe';
import { UnitPlan } from '../../../core/interfaces/unit-plan';
import { ClassPlansService } from '../../../core/services/class-plans.service';
import { ClassPlan } from '../../../core/interfaces';

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
		<mat-card>
			<mat-card-header class="header">
				<h2 mat-card-title class="title">Mis Unidades de Aprendizaje</h2>
				<button
					mat-raised-button
					class="title-button"
					color="accent"
					[routerLink]="['/unit-plans']"
				>
					Crear Nueva Unidad
				</button>
			</mat-card-header>
			<mat-card-content></mat-card-content>
		</mat-card>

		<table
			mat-table
			[dataSource]="unitPlans$"
			class="mat-elevation-z8"
			style="margin-top: 24px"
		>
			<ng-container matColumnDef="title">
				<th mat-header-cell *matHeaderCellDef>T&iacute;tulo</th>
				<td mat-cell *matCellDef="let plan">{{ plan.title }}</td>
			</ng-container>

			<ng-container matColumnDef="section">
				<th mat-header-cell *matHeaderCellDef>Curso</th>
				<td mat-cell *matCellDef="let plan">
					@if (plan.sections && plan.sections.length) {
						@for (section of plan.sections; track $index) {
							{{ $index > 0 ? ", " : "" }}{{ section.name }}
						}
					} @else {
						{{ plan.section ? plan.section.name : "No Asignado" }}
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
							? (plan.createdAt | date: "dd/MM/yyyy" : "+0400")
							: "N/A"
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
							[routerLink]="['/unit-plans', plan._id]"
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
export class UnitPlanListComponent {
	unitPlansService = inject(UnitPlanService);
	classPlanService = inject(ClassPlansService);
	unitPlans$ = this.unitPlansService
		.findAll()
		.pipe(tap(() => (this.loading = false)));
	sb = inject(MatSnackBar);
	classPlans: ClassPlan[] = [];

	displayedColumns = ['title', 'section', 'subject', 'date', 'actions'];

	loading = true;

	ngOnInit() {
		this.classPlanService.findAll().subscribe((plans) => {
			this.classPlans = plans;
		});
	}

	deletePlan(id: string) {
		this.unitPlansService.delete(id).subscribe((result) => {
			if (result.deletedCount === 1) {
				this.sb.open('El Plan fue eliminado!', 'Ok', {
					duration: 2500,
				});
				this.unitPlans$ = this.unitPlansService.findAll();
			}
		});
	}

	async download(plan: UnitPlan) {
		await this.unitPlansService.download(plan, this.classPlans.filter(cp => cp.unitPlan === plan._id));
		this.sb.open('Se ha descargado tu plan', 'Ok', { duration: 2500 });
	}
}
