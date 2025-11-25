import { Component, inject } from '@angular/core';
import { ClassPlansService } from '../../../core/services/class-plans.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClassPlan } from '../../../core';
import { PretifyPipe } from '../../../shared/pipes/pretify.pipe';

@Component({
	selector: 'app-class-plan-list',
	imports: [
		MatButtonModule,
		MatCardModule,
		MatListModule,
		DatePipe,
		RouterModule,
		MatIconModule,
		MatTableModule,
		PretifyPipe,
	],
	template: `
		<div class="header">
			<h2 class="title">Mis Planes Diarios</h2>
			<button
				class="title-button"
				mat-flat-button
				color="accent"
				routerLink="/planning/class-plans"
			>
				Crear Nuevo Plan
			</button>
		</div>

		<table
			mat-table
			[dataSource]="classPlans$"
			class="mat-elevation-z8"
			style="margin-top: 24px"
		>
			<ng-container matColumnDef="section">
				<th mat-header-cell *matHeaderCellDef>Curso</th>
				<td mat-cell *matCellDef="let plan">{{ plan.section.name }}</td>
			</ng-container>

			<ng-container matColumnDef="subject">
				<th mat-header-cell *matHeaderCellDef>Asignatura</th>
				<td mat-cell *matCellDef="let plan">
					{{ plan.subject | pretify }}
				</td>
			</ng-container>

			<ng-container matColumnDef="date">
				<th mat-header-cell *matHeaderCellDef>Fecha</th>
				<td mat-cell *matCellDef="let plan">
					{{
						plan.date
							? (plan.date | date: 'dd/MM/yyyy' : '+0400')
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
							style="display: none"
							(click)="deletePlan(plan._id)"
						>
							<mat-icon>delete</mat-icon>
						</button>
						<button mat-icon-button (click)="download(plan)">
							<mat-icon>download</mat-icon>
						</button>
						<button
							[routerLink]="[
								'/planning',
								'class-plans',
								plan._id,
							]"
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
			display: flex;
			justify-content: space-between;
			align-items: center;
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
export class ClassPlanListComponent {
	classPlansService = inject(ClassPlansService);
	classPlans$ = this.classPlansService.findAll();
	sb = inject(MatSnackBar);

	displayedColumns = ['section', 'subject', 'date', 'actions'];

	deletePlan(id: string) {
		this.classPlansService.deletePlan(id).subscribe((res) => {
			if (res.deletedCount === 1) {
				this.classPlans$ = this.classPlansService.findAll();
				this.sb.open('El Plan fue eliminado!', 'Ok', {
					duration: 2500,
				});
			}
		});
	}

	async download(plan: ClassPlan) {
		this.sb.open('Estamos descargando tu plan.', 'Ok', { duration: 2500 });
		await this.classPlansService.download(plan);
	}
}
