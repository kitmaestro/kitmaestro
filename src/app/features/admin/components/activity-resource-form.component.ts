// src/app/features/admin/components/activity-resource-form.component.ts
import { Component, inject, output, OnDestroy, signal, OnInit, input } from '@angular/core';
import {
    ReactiveFormsModule,
    FormBuilder,
    Validators,
    FormArray,
    FormGroup,
    ValidatorFn,
    ValidationErrors,
    AbstractControl,
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
import { Subject, takeUntil } from 'rxjs';

import {
    createResource,
    updateResource
} from '../../../store/activity-resources/activity-resources.actions';
import {
    selectIsCreating,
    selectIsUpdating,
    selectCurrentResource
} from '../../../store/activity-resources/activity-resources.selectors';
import { ActivityResourceType } from '../../../core';
import { ActivityResource } from '../../../core/models';

export interface ActivityResourceFormData {
    type: ActivityResourceType;
    title: string;
    url?: string;
    content?: string;
    items?: string[];
    tableData?: {
        headers: string[];
        rows: string[][];
    };
}

@Component({
    selector: 'app-activity-resource-form',
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
		<div class="resource-form-container">
			<div class="form-header">
				<h2>{{ resourceId() ? 'Editar' : 'Crear' }} Recurso</h2>
			</div>

			<div class="form-content">
				<form [formGroup]="form" (ngSubmit)="onSubmit()">
					<!-- Tipo de Recurso -->
					<mat-form-field appearance="outline" class="full-width">
						<mat-label>Tipo de Recurso</mat-label>
						<mat-select formControlName="type" required (selectionChange)="onTypeChange()">
							<mat-option value="VIDEO">Video</mat-option>
							<mat-option value="IMAGE">Imagen</mat-option>
							<mat-option value="TEXT_CONTENT">Contenido de Texto</mat-option>
							<mat-option value="TOPIC_LIST">Lista de Temas</mat-option>
							<mat-option value="TABLE">Tabla</mat-option>
						</mat-select>
						<mat-error>Este campo es requerido</mat-error>
					</mat-form-field>

					<!-- Título del Recurso -->
					<mat-form-field appearance="outline" class="full-width">
						<mat-label>Título del Recurso</mat-label>
						<input matInput formControlName="title" required />
						<mat-error>Este campo es requerido</mat-error>
					</mat-form-field>

					<!-- Campos específicos según el tipo de recurso -->
					@if (showUrlField()) {
						<mat-form-field appearance="outline" class="full-width">
							<mat-label>URL</mat-label>
							<input 
								matInput 
								formControlName="url" 
								[required]="showUrlField()"
								placeholder="https://ejemplo.com/recurso" 
							/>
							<mat-error>La URL es requerida para este tipo de recurso</mat-error>
						</mat-form-field>
					}

					@if (showContentField()) {
						<mat-form-field appearance="outline" class="full-width">
							<mat-label>Contenido</mat-label>
							<textarea
								matInput
								formControlName="content"
								rows="6"
								[required]="showContentField()"
								placeholder="Ingrese el contenido textual aquí..."
							></textarea>
							<mat-error>El contenido es requerido para este tipo de recurso</mat-error>
						</mat-form-field>
					}

					@if (showItemsField()) {
						<div class="items-section">
							<h3>Elementos de la Lista</h3>
							<div formArrayName="items" class="items-container">
								@for (
									item of items.controls;
									track item;
									let i = $index
								) {
									<div class="item-row">
										<mat-form-field appearance="outline" class="full-width">
											<mat-label>Elemento {{ i + 1 }}</mat-label>
											<input 
												matInput 
												[formControlName]="i"
												[required]="showItemsField()"
												placeholder="Ingrese un elemento de la lista..." 
											/>
											<mat-error>Este campo es requerido</mat-error>
										</mat-form-field>
										<button
											mat-icon-button
											color="warn"
											type="button"
											(click)="removeItem(i)"
											[disabled]="items.length <= 1"
										>
											<mat-icon>delete</mat-icon>
										</button>
									</div>
								}
							</div>
							<button
								mat-stroked-button
								type="button"
								(click)="addItem()"
								class="add-button"
							>
								<mat-icon>add</mat-icon>
								Agregar Elemento
							</button>
						</div>
					}

					@if (showTableField()) {
						<div class="table-section">
							<h3>Configuración de la Tabla</h3>
							
							<!-- Encabezados de la tabla -->
							<mat-form-field appearance="outline" class="full-width">
								<mat-label>Encabezados (separados por coma)</mat-label>
								<input 
									matInput 
									[value]="getTableHeadersAsString()"
									(change)="updateTableHeaders($event)"
									placeholder="Ej: Nombre, Edad, Ciudad, País"
									required
								/>
								<mat-error>Los encabezados son requeridos para las tablas</mat-error>
							</mat-form-field>

							<!-- Filas de la tabla -->
							<div class="table-rows-section">
								<h4>Filas de la Tabla</h4>
								<div formArrayName="tableData">
									<div formArrayName="rows" class="rows-container">
										@for (
											row of tableRows.controls;
											track row;
											let i = $index
										) {
											<div [formGroup]="getRowGroup(i)" class="table-row">
												@for (
													header of tableHeaders();
													track header;
													let j = $index
												) {
													<mat-form-field appearance="outline" class="table-cell">
														<mat-label>{{ header }}</mat-label>
														<input 
															matInput 
															[formControlName]="j" 
															required
															[placeholder]="'Valor para ' + header" 
														/>
														<mat-error>Este campo es requerido</mat-error>
													</mat-form-field>
												}
												<button
													mat-icon-button
													color="warn"
													type="button"
													(click)="removeTableRow(i)"
													[disabled]="tableRows.length <= 1"
												>
													<mat-icon>delete</mat-icon>
												</button>
											</div>
										}
									</div>
								</div>
								<button
									mat-stroked-button
									type="button"
									(click)="addTableRow()"
									class="add-button"
								>
									<mat-icon>add</mat-icon>
									Agregar Fila
								</button>
							</div>
						</div>
					}

					<!-- Botones de acción -->
					<div class="form-actions">
						<button
							mat-button
							type="button"
							(click)="onCancel()"
						>
							Cancelar
						</button>
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
							{{ resourceId() ? 'Actualizar' : 'Crear' }} Recurso
						</button>
					</div>
				</form>
			</div>
		</div>
	`,
    styles: `
		.resource-form-container {
			padding: 16px;
		}

		.form-header {
			margin-bottom: 24px;
		}

		.form-header h2 {
			margin: 0;
			color: rgba(0, 0, 0, 0.87);
		}

		.form-content {
			display: flex;
			flex-direction: column;
			gap: 20px;
		}

		.full-width {
			width: 100%;
		}

		.items-section,
		.table-section {
			border: 1px solid #e0e0e0;
			border-radius: 8px;
			padding: 20px;
			background-color: #fafafa;
		}

		.items-section h3,
		.table-section h3 {
			margin-top: 0;
			margin-bottom: 16px;
			color: rgba(0, 0, 0, 0.87);
		}

		.table-section h4 {
			margin: 20px 0 16px 0;
			color: rgba(0, 0, 0, 0.75);
		}

		.items-container,
		.rows-container {
			display: flex;
			flex-direction: column;
			gap: 12px;
			margin-bottom: 16px;
		}

		.item-row {
			display: flex;
			gap: 12px;
			align-items: start;
		}

		.table-row {
			display: flex;
			gap: 12px;
			align-items: start;
			padding: 12px;
			background-color: white;
			border-radius: 4px;
			border: 1px solid #e0e0e0;
		}

		.table-cell {
			flex: 1;
			min-width: 120px;
		}

		.add-button {
			width: 100%;
		}

		.form-actions {
			display: flex;
			justify-content: flex-end;
			gap: 12px;
			margin-top: 24px;
			padding-top: 20px;
			border-top: 1px solid #e0e0e0;
		}

		.button-spinner {
			display: inline-block;
			margin-right: 8px;
		}

		mat-error {
			font-size: 12px;
		}
	`,
})
export class ActivityResourceFormComponent implements OnInit, OnDestroy {
    #fb = inject(FormBuilder);
    #store = inject(Store);
    #snackBar = inject(MatSnackBar);
    #destroy$ = new Subject<void>();
    
    // Inputs
    resourceId = input<string | null>(null);
    
    // Outputs
    resourceCreated = output<ActivityResource>();
    resourceUpdated = output<ActivityResource>();
    cancelled = output<void>();

    // Selectors del store
    isCreating = this.#store.selectSignal(selectIsCreating);
    isUpdating = this.#store.selectSignal(selectIsUpdating);
    currentResource = this.#store.selectSignal(selectCurrentResource);

    // Signals para mostrar/ocultar campos dinámicos
    showUrlField = signal(false);
    showContentField = signal(false);
    showItemsField = signal(false);
    showTableField = signal(false);
    tableHeaders = signal<string[]>([]);

    form = this.#fb.group({
        type: ['', Validators.required],
        title: ['', Validators.required],
        url: [''],
        content: [''],
        items: this.#fb.array([]),
        tableData: this.#fb.group({
            headers: this.#fb.array([]),
            rows: this.#fb.array([])
        })
    });

    // Getters para los FormArrays
    get items(): FormArray {
        return this.form.get('items') as FormArray<FormControl>;
    }

    get tableData(): FormGroup {
        return this.form.get('tableData') as FormGroup;
    }

    get tableHeadersArray(): FormArray {
        return this.tableData.get('headers') as FormArray;
    }

    get tableRows(): FormArray {
        return this.tableData.get('rows') as FormArray<FormArray>;
    }

    ngOnInit(): void {
        // Si hay un resourceId, cargar los datos del recurso
        if (this.resourceId()) {
            this.loadResourceData();
        } else {
            // Para nuevos recursos, agregar un elemento por defecto a las listas
            this.addItem();
            this.addTableRow();
        }

        // Escuchar cambios en el tipo para actualizar campos visibles
        this.form.get('type')?.valueChanges
            .pipe(takeUntil(this.#destroy$))
            .subscribe(() => {
                this.updateFieldVisibility();
            });
    }

    ngOnDestroy(): void {
        this.#destroy$.next();
        this.#destroy$.complete();
    }

    loadResourceData(): void {
        const resource = this.currentResource();
        if (resource) {
            this.form.patchValue({
                type: resource.type,
                title: resource.title,
                url: resource.url || '',
                content: resource.content || '',
            });

            // Cargar items si existen
            if (resource.items && resource.items.length > 0) {
                this.items.clear();
                resource.items.forEach(item => {
                    this.items.push(this.#fb.control(item, Validators.required));
                });
            }

            // Cargar tabla si existe
            if (resource.tableData) {
                this.tableHeadersArray.clear();
                resource.tableData.headers.forEach(header => {
                    this.tableHeadersArray.push(this.#fb.control(header, Validators.required));
                });

                this.tableRows.clear();
                resource.tableData.rows.forEach(row => {
                    const rowArray = this.#fb.array(
                        row.map(cell => this.#fb.control(cell, Validators.required))
                    );
                    this.tableRows.push(rowArray);
                });

                this.tableHeaders.set(resource.tableData.headers);
            }

            this.updateFieldVisibility();
        }
    }

    updateFieldVisibility(): void {
        const type = this.form.get('type')?.value as ActivityResourceType;

        this.showUrlField.set(type === 'VIDEO' || type === 'IMAGE');
        this.showContentField.set(type === 'TEXT_CONTENT');
        this.showItemsField.set(type === 'TOPIC_LIST');
        this.showTableField.set(type === 'TABLE');

        // Actualizar validadores según el tipo
        this.updateValidators(type);
    }

    updateValidators(type: ActivityResourceType): void {
        const urlControl = this.form.get('url');
        const contentControl = this.form.get('content');
        const itemsControl = this.form.get('items');

        // Resetear validadores
        urlControl?.clearValidators();
        contentControl?.clearValidators();
        itemsControl?.clearValidators();

        // Aplicar validadores según el tipo
        if (type === 'VIDEO' || type === 'IMAGE') {
            urlControl?.setValidators([Validators.required]);
        } else if (type === 'TEXT_CONTENT') {
            contentControl?.setValidators([Validators.required]);
        } else if (type === 'TOPIC_LIST') {
            // Validar que haya al menos un item
            itemsControl?.setValidators([this.minLengthArrayValidator(1)]);
        }

        // Actualizar estado de validación
        urlControl?.updateValueAndValidity();
        contentControl?.updateValueAndValidity();
        itemsControl?.updateValueAndValidity();
    }

    minLengthArrayValidator(min: number): ValidatorFn {
        return (control: AbstractControl) => {
            return control.value.length >= min ? null : { minLengthArray: true } as ValidationErrors;
        };
    }

    onTypeChange(): void {
        // Limpiar campos que no son relevantes para el nuevo tipo
        const type = this.form.get('type')?.value as ActivityResourceType;

        if (type !== 'VIDEO' && type !== 'IMAGE') {
            this.form.patchValue({ url: '' });
        }
        if (type !== 'TEXT_CONTENT') {
            this.form.patchValue({ content: '' });
        }
        if (type !== 'TOPIC_LIST') {
            this.items.clear();
        }
        if (type !== 'TABLE') {
            this.tableHeadersArray.clear();
            this.tableRows.clear();
            this.tableHeaders.set([]);
        }
    }

    // Métodos para gestionar items de lista
    addItem(): void {
        this.items.push(this.#fb.control('', Validators.required));
    }

    removeItem(index: number): void {
        if (this.items.length > 1) {
            this.items.removeAt(index);
        }
    }

    // Métodos para gestionar tablas
    getTableHeadersAsString(): string {
        return this.tableHeadersArray.value.join(', ');
    }

    updateTableHeaders(event: any): void {
        const headersString = event.target.value;
        const headersArray: string[] = headersString.split(',')
            .map((header: string) => header.trim())
            .filter(Boolean);

        // Actualizar headers
        this.tableHeadersArray.clear();
        headersArray.forEach(header => {
            this.tableHeadersArray.push(this.#fb.control(header, Validators.required));
        });

        this.tableHeaders.set(headersArray);

        // Actualizar estructura de filas
        this.updateTableRowsStructure();
    }

    getRowGroup(index: number): FormGroup {
        return this.tableRows.at(index) as FormGroup;
    }

    addTableRow(): void {
        const headersCount = this.tableHeadersArray.length;
        const newRow = this.#fb.array(
            Array(headersCount).fill('').map(() => this.#fb.control('', Validators.required))
        );
        this.tableRows.push(newRow);
    }

    removeTableRow(index: number): void {
        if (this.tableRows.length > 1) {
            this.tableRows.removeAt(index);
        }
    }

    updateTableRowsStructure(): void {
        const headersCount = this.tableHeadersArray.length;

        // Actualizar cada fila existente
        for (let i = 0; i < this.tableRows.length; i++) {
            const row = this.tableRows.at(i) as FormArray;
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
            const formData = this.prepareFormData();

            if (this.resourceId()) {
                // Actualizar recurso existente
                this.#store.dispatch(updateResource({
                    id: this.resourceId()!,
                    data: formData
                }));
                this.resourceUpdated.emit(this.currentResource()!);
            } else {
                // Crear nuevo recurso
                this.#store.dispatch(createResource({
                    resource: formData
                }));
                // El resourceCreated se emitirá cuando la creación sea exitosa
            }

            // Resetear formulario si es una creación exitosa
            if (!this.resourceId()) {
                this.form.reset();
                this.items.clear();
                this.tableHeadersArray.clear();
                this.tableRows.clear();
                this.tableHeaders.set([]);
                this.addItem();
                this.addTableRow();
            }
        } else {
            this.#snackBar.open(
                'Por favor, complete todos los campos requeridos correctamente',
                'Cerrar',
                { duration: 5000 }
            );
        }
    }

    prepareFormData(): Partial<ActivityResourceFormData> {
        const rawValue = this.form.getRawValue();
        const type = rawValue.type as ActivityResourceType;

        const formData: Partial<ActivityResourceFormData> = {
            type: type,
        };
        if (rawValue.title) {
            formData.title = rawValue.title
        }

        // Incluir solo los campos relevantes para el tipo seleccionado
        if ((type === 'VIDEO' || type === 'IMAGE') && rawValue.url) {
            formData.url = rawValue.url;
        } else if (type === 'TEXT_CONTENT' && rawValue.content) {
            formData.content = rawValue.content;
        } else if (type === 'TOPIC_LIST' && rawValue.items.length > 0) {
            formData.items = rawValue.items as string[];
        } else if (type === 'TABLE' && rawValue.tableData) {
            formData.tableData = {
                headers: rawValue.tableData?.headers as string[],
                rows: rawValue.tableData?.rows as string[][]
            };
        }

        return formData;
    }

    onCancel(): void {
        this.cancelled.emit();
    }
}
