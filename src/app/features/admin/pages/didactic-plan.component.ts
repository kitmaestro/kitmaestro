import { Component, inject, OnDestroy, signal } from '@angular/core';
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
import { MarkdownComponent } from 'ngx-markdown'

import {
	deleteSequence,
	fromDidacticPlans,
	loadDidacticActivities,
	loadSequencePlan,
} from '../../../store';
import { ActivityCardComponent, ConfirmationDialogComponent, PretifyPipe } from '../../../shared';
import { selectCurrentPlan } from '../../../store/didactic-sequence-plans/didactic-sequence-plans.selectors';
import { DidacticActivityFormComponent } from '../components/didactic-activity-form.component';
import { ActivityResourceFormComponent } from '../components/activity-resource-form.component';
import { selectAllActivities } from '../../../store/didactic-activities/didactic-activities.selectors';
import { ActivityResource } from '../../../core/models';
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
		ActivityResourceFormComponent,
		MarkdownComponent,
		ActivityCardComponent,
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
							<markdown [data]="plan.description" />

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
							<h3>Actividades Didácticas</h3>
							<div>
								@for (activity of activities(); track $index) {
									<app-activity-card (viewActivityResources)="viewActivityResources($event)" [activity]="activity" [index]="$index+1" />
								}
							</div>
						</div>
					</div>
					
					<!-- Sección para crear nueva actividad -->
					<div class="form-section">
						<h3>Crear Nueva Actividad</h3>
						<app-didactic-activity-form 
							[plan]="plan" 
							(activityCreated)="onActivityCreated()"
							(activityUpdated)="onActivityUpdated()"
						/>
					</div>
					<app-activity-resource-form
						(resourceCreated)="onResourceCreated($event)"
						(resourceUpdated)="onResourceUpdated($event)"
						(cancelled)="onResourceCancelled()"
					/>
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
			border: 1px solid #e0e0e0;
			border-radius: 8px;
			padding: 16px;
			background-color: #fafafa;
			margin-bottom: 16px;
		}

		.activity-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 12px;
		}

		.activity-actions {
			display: flex;
			gap: 8px;
		}

		.teacher-note {
			background-color: #fff3e0;
			border-left: 4px solid #ff9800;
			padding: 12px;
			margin: 12px 0;
			border-radius: 4px;
		}

		.activity-meta {
			display: flex;
			gap: 16px;
			margin: 12px 0;
			font-size: 14px;
			color: rgba(0, 0, 0, 0.6);
		}

		.resources-preview {
			margin-top: 12px;
		}

		.resources-list {
			display: flex;
			flex-wrap: wrap;
			gap: 8px;
			margin-top: 8px;
		}

		.resource-tag {
			background-color: #e3f2fd;
			color: #1976d2;
			padding: 4px 8px;
			border-radius: 16px;
			font-size: 12px;
			border: 1px solid #bbdefb;
		}

		.form-section {
			margin-top: 32px;
			padding: 24px;
			border: 1px solid #e0e0e0;
			border-radius: 8px;
			background-color: white;
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

		mat-dialog-container {
			position: fixed;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			background: white;
			padding: 24px;
			border-radius: 8px;
			box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
			z-index: 1000;
			max-width: 90vw;
			max-height: 90vh;
			overflow-y: auto;
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

	// Signals para el estado del diálogo de recursos
	showResourceDialog = signal(false);
	selectedResourceId = signal<string | null>(null);
	selectedActivityId = signal<string | null>(null);

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
		this.#store.dispatch(loadDidacticActivities({ filters: { plan: id } }));
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
				const sequence = plan.didacticSequence._id;
				this.#store.dispatch(deleteSequence({ id: plan._id }));
				this.#router.navigate(['/admin', 'didactic-sequences', sequence]);
			}
		});
	}

	// Métodos para manejar recursos
	viewActivityResources(activity: any) {
		// Aquí podrías implementar la visualización de recursos existentes
		// o la creación de nuevos recursos para esta actividad
		this.selectedActivityId.set(activity._id);
		this.openResourceDialog();
	}

	openResourceDialog(resourceId: string | null = null) {
		this.selectedResourceId.set(resourceId);
		this.showResourceDialog.set(true);
	}

	closeResourceDialog() {
		this.showResourceDialog.set(false);
		this.selectedResourceId.set(null);
		this.selectedActivityId.set(null);
	}

	onResourceCreated(resource: ActivityResource) {
		// Aquí puedes manejar el recurso creado
		// Por ejemplo, asociarlo a la actividad seleccionada
		console.log('Recurso creado:', resource);
		this.closeResourceDialog();

		// Mostrar mensaje de éxito
		this.#dialog.open(ConfirmationDialogComponent, {
			data: {
				title: 'Recurso Creado',
				message: `El recurso "${resource.title}" ha sido creado exitosamente.`,
				showCancel: false,
				confirmText: 'Aceptar'
			},
		});
	}

	onResourceUpdated(resource: ActivityResource) {
		// Manejar recurso actualizado
		console.log('Recurso actualizado:', resource);
		this.closeResourceDialog();

		this.#dialog.open(ConfirmationDialogComponent, {
			data: {
				title: 'Recurso Actualizado',
				message: `El recurso "${resource.title}" ha sido actualizado exitosamente.`,
				showCancel: false,
				confirmText: 'Aceptar'
			},
		});
	}

	onResourceCancelled() {
		this.closeResourceDialog();
	}

	onActivityCreated() {
		// Recargar actividades cuando se crea una nueva
		const plan = this.didacticPlan();
		if (plan) {
			this.#store.dispatch(loadDidacticActivities({ filters: { plan: plan._id } }));
		}
	}

	onActivityUpdated() {
		// Recargar actividades cuando se actualiza una
		const plan = this.didacticPlan();
		if (plan) {
			this.#store.dispatch(loadDidacticActivities({ filters: { plan: plan._id } }));
		}
	}

	ngOnDestroy() {
		this.#destroy$.next();
		this.#destroy$.complete();
	}
}