import { Component, inject, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';

import {
	deleteSequence,
	fromDidacticPlans,
	loadActivities,
	loadDidacticActivities,
	loadSequencePlan,
} from '../../../store';
import { ConfirmationDialogComponent, PretifyPipe } from '../../../shared';
import { selectCurrentPlan } from '../../../store/didactic-sequence-plans/didactic-sequence-plans.selectors';
import { DidacticActivityFormComponent } from '../components/didactic-activity-form.component';
import { selectAllActivities, selectCurrentActivity } from '../../../store/didactic-activities/didactic-activities.selectors';
const { selectIsLoadingOneSequencePlan, selectIsDeletingSequencePlan } =
	fromDidacticPlans;

@Component({
	selector: 'app-didactic-sequence-details',
	standalone: true,
	imports: [
		RouterModule,
		MatCardModule,
		MatButtonModule,
		MatIconModule,
		MatProgressSpinnerModule,
		MatDialogModule,
		MatTabsModule,
		MatListModule,
		PretifyPipe,
		DidacticActivityFormComponent,
	],
	template: `
		<div class="container">
			@if (isLoading()) {
				<div class="spinner-container">
					<mat-spinner diameter="40"></mat-spinner>
				</div>
			} @else if (didacticPlan(); as plan) {
				<div>
					<div
						style="display: flex; justify-content: space-between; align-items: center;"
					>
						<h2>
							Secuencia Didáctica -
							{{ plan.didacticSequence.level | pretify }} -
							{{ plan.didacticSequence.year | pretify }} -
							{{ plan.didacticSequence.subject | pretify }}
						</h2>
						<div class="header-actions">
							<button
								mat-button
								color="primary"
								[routerLink]="[
									'/admin/didactic-sequence-plans',
									plan._id,
									'edit',
								]"
							>
								<mat-icon>edit</mat-icon>
								Editar
							</button>
							<button
								mat-button
								color="warn"
								(click)="onDelete()"
								[disabled]="isDeleting()"
							>
								<mat-icon>delete</mat-icon>
								Eliminar
							</button>
							<button
								mat-button
								routerLink="/admin/didactic-sequences/{{plan.didacticSequence._id}}"
							>
								<mat-icon>arrow_back</mat-icon>
								Volver
							</button>
						</div>
					</div>

					<div class="plan-item">
						<h3>{{ plan.title }}</h3>
						<div>
							<h3>Descripción:</h3>
							<p [innerHTML]="plan.description.replaceAll('\n', '<br><br>')"></p>

							<h3>
								Competencias Específicas:
							</h3>
							<mat-list dense>
								@for (
									competence of plan.specificCompetencies;
									track competence.name
								) {
									<mat-list-item>
										<span
											matListItemTitle
											>{{
												competence.name
											}}</span
										>
										<span
											matListItemLine
											>{{
												competence.description
											}}</span
										>
									</mat-list-item>
								}
							</mat-list>
							<h3>Actividades Didacticas</h3>
							<div>
								@for (activity of activities(); track $index) {
									<div class="activity-item">
										<h4>{{ $index + 1 }}. {{ activity.title }} ({{ activity.durationInMinutes }} minutos)</h4>
										<p [innerHTML]="activity.description.replaceAll('\n', '<br><br>')"></p>
									</div>
								}
							</div>
						</div>
					</div>
					<div>
						<app-didactic-activity-form [plan]="plan" />
					</div>
				</div>
			} @else {
				<div>
					<div class="not-found">
						<mat-icon>error_outline</mat-icon>
						<h3>Plan no encontrado</h3>
						<button
							mat-raised-button
							routerLink="/admin/didactic-sequences"
						>
							Volver al listado
						</button>
					</div>
				</div>
			}
		</div>
	`,
	styles: `
		.container {
			padding: 16px;
		}

		.spinner-container {
			display: flex;
			justify-content: center;
			padding: 40px;
		}

		.header-actions {
			display: flex;
			gap: 8px;
			margin-left: auto;
		}

		.tab-content {
			padding: 16px 0;
		}

		.content-item,
		.plan-item,
		.block-item,
		.activity-item {
			margin-bottom: 16px;
		}

		.page-info {
			color: rgba(0, 0, 0, 0.54);
			font-size: 14px;
		}

		.block-item {
			margin-left: 16px;
			border-left: 3px solid #3f51b5;
		}

		.activity-item {
			margin-left: 16px;
			border-left: 3px solid #ff9800;
			padding-left: 16px;
		}

		.not-found {
			text-align: center;
			padding: 40px;
			color: rgba(0, 0, 0, 0.54);
		}

		.not-found mat-icon {
			font-size: 48px;
			width: 48px;
			height: 48px;
			margin-bottom: 16px;
		}

		h3,
		h4 {
			margin-top: 16px;
			margin-bottom: 8px;
			color: rgba(0, 0, 0, 0.87);
		}

		strong {
			color: rgba(0, 0, 0, 0.87);
		}
	`,
})
export class DidacticPlanComponent implements OnDestroy {
	#store = inject(Store);
	#route = inject(ActivatedRoute);
	#router = inject(Router);
	#dialog = inject(MatDialog);
	#destroy$ = new Subject<void>();
	#pretify = new PretifyPipe().transform;

	isLoading = this.#store.selectSignal(selectIsLoadingOneSequencePlan);
	isDeleting = this.#store.selectSignal(selectIsDeletingSequencePlan);
	didacticPlan = this.#store.selectSignal(selectCurrentPlan);

	activities = this.#store.selectSignal(selectAllActivities);

	constructor() {
		const id = this.#route.snapshot.paramMap.get('id');
		if (!id) {
			this.#router.navigateByUrl('/admin/didactic-sequences');
			return;
		}
		this.#store.dispatch(loadSequencePlan({ id }));
		this.#store.dispatch(loadDidacticActivities({ filters: { plan: id } }))
	}

	onDelete() {
		const plan = this.didacticPlan();
		if (!plan) return;

		const dialogRef = this.#dialog.open(ConfirmationDialogComponent, {
			data: {
				title: 'Eliminar Plan',
				message: `¿Estás seguro de que deseas eliminar el plan "${this.#pretify(plan.title)}"? Esta acción no se puede deshacer.`,
			},
		});

		dialogRef.afterClosed().subscribe((result) => {
			if (result) {
				const sequence = plan.didacticSequence._id
				this.#store.dispatch(deleteSequence({ id: plan._id }));
				this.#router.navigate(['/admin','didactic-sequences', sequence]);
			}
		});
	}

	ngOnDestroy() {
		this.#destroy$.next();
		this.#destroy$.complete();
	}
}
