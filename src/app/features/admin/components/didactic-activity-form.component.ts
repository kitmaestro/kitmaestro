// src/app/features/admin/components/didactic-activity-form.component.ts
import { Component, inject, output, OnDestroy, OnInit, input } from '@angular/core';
import {
    ReactiveFormsModule,
    FormBuilder,
    Validators,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSelectModule } from '@angular/material/select';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';

import { createDidacticActivity, updateDidacticActivity } from '../../../store';
import {
    selectIsCreating,
    selectIsUpdating,
    selectCurrentActivity
} from '../../../store/didactic-activities/didactic-activities.selectors';
import { DidacticPlan } from '../../../core/models/didactic-sequence-plan';
import { selectAllResources } from '../../../store/activity-resources/activity-resources.selectors';
import { loadResources } from '../../../store/activity-resources/activity-resources.actions';

export interface DidacticActivityFormData {
    plan: string;
    blockTitle: string;
    orderInBlock: number;
    title: string;
    description: string;
    teacherNote: string;
    resources: string[];
    startingPage: number;
    endingPage: number;
    durationInMinutes: number;
}

@Component({
    selector: 'app-didactic-activity-form',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatSnackBarModule,
        MatFormFieldModule,
        MatInputModule,
        MatExpansionModule,
        MatSelectModule,
    ],
    template: `
		<div>
			<div>
				<h2>{{ activityId() ? 'Editar' : 'Crear' }} Actividad Didáctica</h2>
			</div>

			<div>
				<form [formGroup]="form" (ngSubmit)="onSubmit()">
					<div class="form-content">
						<!-- Información básica de la actividad -->
						<mat-form-field appearance="outline" class="full-width">
							<mat-label>Título de la Actividad</mat-label>
							<input matInput formControlName="title" required />
							<mat-error>Este campo es requerido</mat-error>
						</mat-form-field>

						<mat-form-field appearance="outline" class="full-width">
							<mat-label>Bloque</mat-label>
							<input matInput formControlName="blockTitle" required />
							<mat-error>Este campo es requerido</mat-error>
						</mat-form-field>

						<div class="form-row">
							<mat-form-field appearance="outline">
								<mat-label>Orden en el Bloque</mat-label>
								<input
									matInput
									type="number"
									formControlName="orderInBlock"
									min="1"
									required
								/>
								<mat-error>Este campo es requerido</mat-error>
							</mat-form-field>

							<mat-form-field appearance="outline">
								<mat-label>Duración (minutos)</mat-label>
								<input
									matInput
									type="number"
									formControlName="durationInMinutes"
									min="1"
									required
								/>
								<mat-error>Este campo es requerido</mat-error>
							</mat-form-field>
						</div>

						<div class="form-row">
							<mat-form-field appearance="outline">
								<mat-label>Página Inicial</mat-label>
								<input
									matInput
									type="number"
									formControlName="startingPage"
									min="1"
									required
								/>
								<mat-error>Este campo es requerido</mat-error>
							</mat-form-field>

							<mat-form-field appearance="outline">
								<mat-label>Página Final</mat-label>
								<input
									matInput
									type="number"
									formControlName="endingPage"
									min="1"
									required
								/>
								<mat-error>Este campo es requerido</mat-error>
							</mat-form-field>
						</div>

						<mat-form-field appearance="outline" class="full-width">
							<mat-label>Descripción/Instrucciones</mat-label>
							<textarea
								matInput
								formControlName="description"
								rows="4"
								required
							></textarea>
							<mat-error>Este campo es requerido</mat-error>
						</mat-form-field>

						<mat-form-field appearance="outline" class="full-width">
							<mat-label>Notas para el Docente</mat-label>
							<textarea
								matInput
								formControlName="teacherNote"
								rows="3"
							></textarea>
						</mat-form-field>

						<mat-form-field appearance="outline">
							<mat-label>Recursos</mat-label>
							<mat-select formControlName="resources" multiple>
								@for (resource of resourceOptions(); track resource._id) {
									<mat-option [value]="resource._id">{{ resource.title }}</mat-option>
								}
							</mat-select>
							<mat-error>Este campo es requerido</mat-error>
						</mat-form-field>
					</div>

					<div class="form-actions">
						<button
							mat-flat-button
							color="primary"
							type="submit"
							[disabled]="form.invalid || isCreating() || isUpdating()"
						>
							@if (isCreating() || isUpdating()) {
								<mat-spinner
									diameter="20"
									class="button-spinner"
								></mat-spinner>
							}
							{{ activityId() ? 'Actualizar' : 'Crear' }} Actividad
						</button>
					</div>
				</form>
			</div>
		</div>
	`,
    styles: `
		.form-content {
			display: flex;
			flex-direction: column;
			gap: 16px;
		}

		.full-width {
			width: 100%;
		}

		.form-row {
			display: flex;
			gap: 16px;
		}

		.form-row mat-form-field {
			flex: 1;
		}

		.resource-form {
			display: flex;
			flex-direction: column;
			gap: 16px;
			padding: 16px;
			border: 1px solid #e0e0e0;
			border-radius: 8px;
			margin-bottom: 16px;
		}

		.items-container,
		.table-container {
			display: flex;
			flex-direction: column;
			gap: 16px;
			padding: 16px;
			background-color: #f5f5f5;
			border-radius: 4px;
		}

		.item-row,
		.table-row {
			display: flex;
			gap: 16px;
			align-items: start;
		}

		.table-row mat-form-field {
			flex: 1;
		}

		.form-actions {
			display: flex;
			justify-content: flex-end;
			margin-top: 24px;
			padding-top: 16px;
			border-top: 1px solid #e0e0e0;
		}

		.button-spinner {
			display: inline-block;
			margin-right: 8px;
		}

		h3,
		h4 {
			margin: 16px 0 8px 0;
			color: rgba(0, 0, 0, 0.87);
		}
	`,
})
export class DidacticActivityFormComponent implements OnInit, OnDestroy {
    #fb = inject(FormBuilder);
    #store = inject(Store);
    #snackBar = inject(MatSnackBar);
    #destroy$ = new Subject<void>();

    plan = input.required<DidacticPlan>();
    activityId = input<string | null>(null);

    activityCreated = output<void>();
    activityUpdated = output<void>();

    isCreating = this.#store.selectSignal(selectIsCreating);
    isUpdating = this.#store.selectSignal(selectIsUpdating);
    currentActivity = this.#store.selectSignal(selectCurrentActivity);
	resourceOptions = this.#store.selectSignal(selectAllResources);

    form = this.#fb.group({
        plan: ['', Validators.required],
        blockTitle: ['', Validators.required],
        orderInBlock: [1, [Validators.required, Validators.min(1)]],
        title: ['', Validators.required],
        description: ['', Validators.required],
        teacherNote: [''],
        resources: [[] as string[]],
        startingPage: [1, [Validators.required, Validators.min(1)]],
        endingPage: [1, [Validators.required, Validators.min(1)]],
        durationInMinutes: [15, [Validators.required, Validators.min(1)]],
    });

    ngOnInit(): void {
        // Establecer el plan en el formulario
        this.form.get('plan')?.setValue(this.plan()._id);
		this.#store.dispatch(loadResources({ filters: {} }))

        // Si hay un activityId, cargar los datos de la actividad
        if (this.activityId()) {
            this.loadActivityData();
        }
    }

    loadActivityData(): void {
        // Aquí deberías implementar la carga de la actividad existente
        // Por ahora, asumimos que el currentActivity está disponible
        const activity = this.currentActivity();
        if (activity) {
            this.form.patchValue({
                blockTitle: activity.blockTitle,
                orderInBlock: activity.orderInBlock,
                title: activity.title,
                description: activity.description,
                teacherNote: activity.teacherNote,
                startingPage: activity.startingPage,
                endingPage: activity.endingPage,
                durationInMinutes: activity.durationInMinutes,
				resources: activity.resources.map(r => r._id)
            });
        }
    }

    onSubmit(): void {
        if (this.form.valid) {
            const formData = this.form.getRawValue() as DidacticActivityFormData;

            if (this.activityId()) {
                // Actualizar actividad existente
                this.#store.dispatch(updateDidacticActivity({
                    id: this.activityId()!,
                    data: formData
                }));
                this.activityUpdated.emit();
            } else {
                // Crear nueva actividad
                this.#store.dispatch(createDidacticActivity({
                    activity: formData
                }));
                this.activityCreated.emit();
            }

            // Resetear formulario si es una creación
            if (!this.activityId()) {
                this.form.reset({
                    plan: this.plan()._id,
                    orderInBlock: 1,
                    startingPage: 1,
                    endingPage: 1,
                    durationInMinutes: 15,
					resources: []
                });
            }
        } else {
            this.#snackBar.open(
                'Por favor, complete todos los campos requeridos',
                'Cerrar',
                {
                    duration: 5000,
                },
            );
        }
    }

    ngOnDestroy(): void {
        this.#destroy$.next();
        this.#destroy$.complete();
    }
}
