// src/app/features/admin/components/didactic-activity-form.component.ts
import { Component, inject, output, OnDestroy, signal, OnInit, input } from '@angular/core';
import {
    ReactiveFormsModule,
    FormBuilder,
    Validators,
    FormArray,
    FormGroup,
    FormControl,
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
import { ActivityResource } from '../../../core/models';

export interface DidacticActivityFormData {
    plan: string;
    blockTitle: string;
    orderInBlock: number;
    title: string;
    description: string;
    teacherNote: string;
    resources: ActivityResource[];
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

						<!-- Recursos de la actividad -->
						<h3>Recursos de la Actividad</h3>
						<div formArrayName="resources">
							@for (
								resource of resources.controls;
								track resource;
								let i = $index
							) {
								<div [formGroup]="resource" class="resource-form">
									<mat-form-field appearance="outline">
										<mat-label>Tipo de Recurso</mat-label>
										<mat-select formControlName="type" required>
											<mat-option value="VIDEO">Video</mat-option>
											<mat-option value="IMAGE">Imagen</mat-option>
											<mat-option value="TEXT_CONTENT">Texto</mat-option>
											<mat-option value="TOPIC_LIST">Lista de Temas</mat-option>
											<mat-option value="TABLE">Tabla</mat-option>
										</mat-select>
										<mat-error>Este campo es requerido</mat-error>
									</mat-form-field>

									<mat-form-field appearance="outline" class="full-width">
										<mat-label>Título del Recurso</mat-label>
										<input matInput formControlName="title" required />
										<mat-error>Este campo es requerido</mat-error>
									</mat-form-field>

									<!-- Campos específicos según el tipo de recurso -->
									@if (resource.get('type')?.value === 'VIDEO' || resource.get('type')?.value === 'IMAGE') {
										<mat-form-field appearance="outline" class="full-width">
											<mat-label>URL</mat-label>
											<input matInput formControlName="url" required />
											<mat-error>Este campo es requerido</mat-error>
										</mat-form-field>
									}

									@if (resource.get('type')?.value === 'TEXT_CONTENT') {
										<mat-form-field appearance="outline" class="full-width">
											<mat-label>Contenido</mat-label>
											<textarea
												matInput
												formControlName="content"
												rows="3"
												required
											></textarea>
											<mat-error>Este campo es requerido</mat-error>
										</mat-form-field>
									}

									@if (resource.get('type')?.value === 'TOPIC_LIST') {
										<div class="items-container">
											<h4>Elementos de la Lista</h4>
											<div formArrayName="items">
												@for (
													item of getResourceItems(resource).controls;
													track item;
													let j = $index
												) {
													<div class="item-row">
														<mat-form-field appearance="outline" class="full-width">
															<mat-label>Elemento {{ j + 1 }}</mat-label>
															<input matInput [formControl]="item" required />
															<mat-error>Este campo es requerido</mat-error>
														</mat-form-field>
														<button
															mat-icon-button
															color="warn"
															type="button"
															(click)="removeResourceItem(i, j)"
														>
															<mat-icon>delete</mat-icon>
														</button>
													</div>
												}
											</div>
											<button
												mat-button
												type="button"
												(click)="addResourceItem(i)"
											>
												<mat-icon>add</mat-icon>
												Agregar Elemento
											</button>
										</div>
									}

									@if (resource.get('type')?.value === 'TABLE') {
										<div class="table-container">
											<h4>Datos de la Tabla</h4>
											<mat-form-field appearance="outline" class="full-width">
												<mat-label>Encabezados (separados por coma)</mat-label>
												<input 
													matInput 
													[value]="getTableHeadersAsString(i)"
													(change)="updateTableHeaders(i, $event)"
													placeholder="Ej: Nombre, Edad, Ciudad"
												/>
											</mat-form-field>
											
											<h4>Filas</h4>
											<div formArrayName="tableData">
												<div formArrayName="rows">
													@for (
														row of getTableRows(resource).controls;
														track row;
														let j = $index
													) {
														<div class="table-row" formGroupName="{{row}}">
															@for (
																header of getTableHeaders(resource);
																track header;
																let k = $index
															) {
																<mat-form-field appearance="outline">
																	<mat-label>{{ header }}</mat-label>
																	<input matInput [formControlName]="k" required />
																</mat-form-field>
															}
															<button
																mat-icon-button
																color="warn"
																type="button"
																(click)="removeTableRow(i, j)"
															>
																<mat-icon>delete</mat-icon>
															</button>
														</div>
													}
												</div>
											</div>
											<button
												mat-button
												type="button"
												(click)="addTableRow(i)"
											>
												<mat-icon>add</mat-icon>
												Agregar Fila
											</button>
										</div>
									}

									<button
										mat-icon-button
										color="warn"
										type="button"
										(click)="removeResource(i)"
									>
										<mat-icon>delete</mat-icon>
									</button>
								</div>
							}
						</div>

						<button
							mat-button
							type="button"
							(click)="addResource()"
						>
							<mat-icon>add</mat-icon>
							Agregar Recurso
						</button>
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

    form = this.#fb.group({
        plan: ['', Validators.required],
        blockTitle: ['', Validators.required],
        orderInBlock: [1, [Validators.required, Validators.min(1)]],
        title: ['', Validators.required],
        description: ['', Validators.required],
        teacherNote: [''],
        resources: this.#fb.array([]),
        startingPage: [1, [Validators.required, Validators.min(1)]],
        endingPage: [1, [Validators.required, Validators.min(1)]],
        durationInMinutes: [15, [Validators.required, Validators.min(1)]],
    });

    get resources() {
        return this.form.get('resources') as FormArray<FormGroup>;
    }

    ngOnInit(): void {
        // Establecer el plan en el formulario
        this.form.get('plan')?.setValue(this.plan()._id);

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
            });

            // Cargar recursos
            this.resources.clear();
            activity.resources.forEach(resource => {
                this.addResource(resource);
            });
        }
    }

    // Métodos para gestionar recursos
    addResource(existingResource?: ActivityResource): void {
        const resourceGroup = this.#fb.group({
            type: [existingResource?.type || '', Validators.required],
            title: [existingResource?.title || '', Validators.required],
            url: [existingResource?.url || ''],
            content: [existingResource?.content || ''],
            items: this.#fb.array(existingResource?.items?.map(item => this.#fb.control(item)) || []),
            tableData: this.#fb.group({
                headers: this.#fb.array(existingResource?.tableData?.headers?.map(header => this.#fb.control(header)) || []),
                rows: this.#fb.array(existingResource?.tableData?.rows?.map(row =>
                    this.#fb.array(row.map(cell => this.#fb.control(cell)))
                ) || [])
            })
        });

        this.resources.push(resourceGroup);
    }

    removeResource(index: number): void {
        this.resources.removeAt(index);
    }

    // Métodos para gestionar items de lista
    getResourceItems(resourceGroup: FormGroup): FormArray<FormControl> {
        return resourceGroup.get('items') as FormArray<FormControl>;
    }

    addResourceItem(resourceIndex: number): void {
        const itemsArray = this.getResourceItems(this.resources.at(resourceIndex));
        itemsArray.push(this.#fb.control('', Validators.required));
    }

    removeResourceItem(resourceIndex: number, itemIndex: number): void {
        const itemsArray = this.getResourceItems(this.resources.at(resourceIndex));
        itemsArray.removeAt(itemIndex);
    }

    // Métodos para gestionar tablas
    getTableHeaders(resourceGroup: FormGroup): string[] {
        const headersArray = resourceGroup.get('tableData.headers') as FormArray;
        return headersArray.value || [];
    }

    getTableHeadersAsString(resourceIndex: number): string {
        const headers = this.getTableHeaders(this.resources.at(resourceIndex));
        return headers.join(', ');
    }

    updateTableHeaders(resourceIndex: number, event: any): void {
        const headersString = event.target.value;
        const headersArray = headersString.split(',').map((header: string) => header.trim()).filter(Boolean);

        const resourceGroup = this.resources.at(resourceIndex);
        const currentHeadersArray = resourceGroup.get('tableData.headers') as FormArray;

        // Limpiar y actualizar headers
        currentHeadersArray.clear();
        headersArray.forEach((header: string) => {
            currentHeadersArray.push(this.#fb.control(header));
        });

        // Actualizar estructura de rows para coincidir con los nuevos headers
        this.updateTableRowsStructure(resourceIndex);
    }

    getTableRows(resourceGroup: FormGroup) {
        const tableData = resourceGroup.get('tableData') as FormGroup;
        return tableData.get('rows') as FormArray;
    }

    addTableRow(resourceIndex: number): void {
        const resourceGroup = this.resources.at(resourceIndex);
        const rowsArray = this.getTableRows(resourceGroup);
        const headersCount = this.getTableHeaders(resourceGroup).length;

        const newRow: FormArray = this.#fb.array(
            Array(headersCount).fill('').map(() => this.#fb.control('', Validators.required))
        );

        rowsArray.push(newRow);
    }

    removeTableRow(resourceIndex: number, rowIndex: number): void {
        const resourceGroup = this.resources.at(resourceIndex);
        const rowsArray = this.getTableRows(resourceGroup);
        rowsArray.removeAt(rowIndex);
    }

    updateTableRowsStructure(resourceIndex: number): void {
        const resourceGroup = this.resources.at(resourceIndex);
        const rowsArray = this.getTableRows(resourceGroup);
        const headersCount = this.getTableHeaders(resourceGroup).length;

        // Actualizar cada fila existente para que tenga el número correcto de columnas
        for (let i = 0; i < rowsArray.length; i++) {
            const row = rowsArray.at(i) as FormArray;
            const currentColumns = row.length;

            if (currentColumns < headersCount) {
                // Agregar columnas faltantes
                for (let j = currentColumns; j < headersCount; j++) {
                    row.push(this.#fb.control('', Validators.required));
                }
            } else if (currentColumns > headersCount) {
                // Remover columnas excedentes
                for (let j = currentColumns - 1; j >= headersCount; j--) {
                    row.removeAt(j);
                }
            }
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
                });
                this.resources.clear();
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