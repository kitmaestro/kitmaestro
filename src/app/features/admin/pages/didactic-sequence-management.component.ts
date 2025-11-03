import {
	ChangeDetectionStrategy,
	Component,
	inject,
	OnInit,
	signal,
	computed,
	OnDestroy,
} from '@angular/core';
import {
	ReactiveFormsModule,
	FormGroup,
	FormArray,
	Validators,
	NonNullableFormBuilder,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';

// Angular Material Modules
import {
	MatDialogModule,
	MatDialog,
	MAT_DIALOG_DATA,
	MatDialogRef,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';

// NgRx State
import { fromDidacticSequences } from '../../../store';
import { DidacticSequence } from '../../../core/models';
import {
	createSequence,
	deleteSequence,
	DidacticSequenceDto,
	loadSequences,
	updateSequence,
} from '../../../store/didactic-sequences';
import {
	DidacticPlan,
	SchoolLevel,
	SchoolSubject,
	SchoolYear,
} from '../../../core';

const GRADES: { value: SchoolYear; name: string }[] = [
	{ value: 'PRIMERO', name: 'Primero' },
	{ value: 'SEGUNDO', name: 'Segundo' },
	{ value: 'TERCERO', name: 'Tercero' },
	{ value: 'CUARTO', name: 'Cuarto' },
	{ value: 'QUINTO', name: 'Quinto' },
	{ value: 'SEXTO', name: 'Sexto' },
];
const LEVELS: { value: SchoolLevel; name: string }[] = [
	{ value: 'PRE_PRIMARIA', name: 'Inicial' },
	{ value: 'PRIMARIA', name: 'Primaria' },
	{ value: 'SECUNDARIA', name: 'Secundaria' },
];
const SUBJECTS: { value: SchoolSubject; name: string }[] = [
	{ value: 'LENGUA_ESPANOLA', name: 'Lengua Española' },
	{ value: 'MATEMATICA', name: 'Matemática' },
	{ value: 'CIENCIAS_SOCIALES', name: 'Ciencias Sociales' },
	{ value: 'CIENCIAS_NATURALES', name: 'Ciencias Naturales' },
	{ value: 'EDUCACION_ARTISTICA', name: 'Educación Artística' },
	{ value: 'EDUCACION_FISICA', name: 'Educación Física' },
	{
		value: 'FORMACION_HUMANA',
		name: 'Formación Integral Humana y Religiosa',
	},
	{ value: 'INGLES', name: 'Inglés' },
	{ value: 'FRANCES', name: 'Francés' },
];

// Componente del Dialog
@Component({
	selector: 'app-sequence-form-dialog',
	standalone: true,
	imports: [
		CommonModule,
		ReactiveFormsModule,
		MatDialogModule,
		MatButtonModule,
		MatIconModule,
		MatFormFieldModule,
		MatInputModule,
		MatSelectModule,
		MatProgressSpinnerModule,
		MatCardModule,
		MatExpansionModule,
		MatListModule,
	],
	template: `
		<div class="dialog-header">
			<h2 mat-dialog-title>
				{{
					data.selectedSequenceId
						? 'Editar Secuencia'
						: 'Nueva Secuencia'
				}}
			</h2>
			<button
				mat-icon-button
				(click)="onClose()"
				aria-label="Cerrar formulario"
			>
				<mat-icon>close</mat-icon>
			</button>
		</div>

		<mat-dialog-content class="dialog-content">
			<form
				[formGroup]="sequenceForm"
				(ngSubmit)="onSubmit()"
				class="form-container"
			>
				<mat-form-field appearance="outline">
					<mat-label>Nivel</mat-label>
					<mat-select formControlName="level">
						<mat-option
							*ngFor="let level of data.levels"
							[value]="level.value"
						>
							{{ level.name }}
						</mat-option>
					</mat-select>
				</mat-form-field>

				<mat-form-field appearance="outline">
					<mat-label>Grado</mat-label>
					<mat-select formControlName="year">
						<mat-option
							*ngFor="let grade of data.grades"
							[value]="grade.value"
						>
							{{ grade.name }}
						</mat-option>
					</mat-select>
				</mat-form-field>

				<mat-form-field appearance="outline">
					<mat-label>Asignatura</mat-label>
					<mat-select formControlName="subject">
						<mat-option
							*ngFor="let subject of data.subjects"
							[value]="subject.value"
						>
							{{ subject.name }}
						</mat-option>
					</mat-select>
				</mat-form-field>

				<!-- FormArray para Planes -->
				<div class="form-array-container">
					<h3>Planes Didácticos</h3>
					<button
						mat-stroked-button
						type="button"
						(click)="addPlan()"
						class="add-button"
					>
						<mat-icon>add</mat-icon> Agregar Plan
					</button>

					<div formArrayName="plans" class="array-list">
						<mat-accordion>
							@for (plan of plans.controls; track $index) {
								<mat-expansion-panel [formGroupName]="$index">
									<mat-expansion-panel-header>
										<mat-panel-title>
											Plan {{ $index + 1 }}:
											{{
												plan.get('title')?.value ||
													'Nuevo Plan'
											}}
										</mat-panel-title>
									</mat-expansion-panel-header>

									<div>
										<mat-form-field appearance="outline">
											<mat-label
												>Título del Plan</mat-label
											>
											<input
												matInput
												formControlName="title"
											/>
										</mat-form-field>

										<mat-form-field appearance="outline">
											<mat-label>Descripción</mat-label>
											<textarea
												matInput
												formControlName="description"
												rows="3"
											></textarea>
										</mat-form-field>
									</div>

									<button
										mat-icon-button
										color="warn"
										type="button"
										(click)="removePlan($index)"
										aria-label="Eliminar plan"
									>
										<mat-icon>delete</mat-icon>
									</button>
								</mat-expansion-panel>
							}
						</mat-accordion>
					</div>
				</div>
			</form>
		</mat-dialog-content>

		<mat-dialog-actions align="end" class="dialog-actions">
			<button mat-button type="button" (click)="onClose()">
				Cancelar
			</button>
			<button
				mat-flat-button
				color="primary"
				type="submit"
				(click)="onSubmit()"
				[disabled]="sequenceForm.invalid || data.isSaving"
			>
				<mat-icon>save</mat-icon>
				{{ data.isSaving ? 'Guardando...' : 'Guardar' }}
			</button>
		</mat-dialog-actions>
	`,
	styles: [
		`
			.dialog-header {
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 16px 24px 0;
			}

			.dialog-content {
				max-height: 70vh;
				overflow-y: auto;
				padding: 16px 24px;
			}

			.dialog-actions {
				padding: 8px 24px 16px;
			}

			.form-container {
				display: flex;
				flex-direction: column;
				gap: 1rem;
			}

			.form-array-container {
				border: 1px solid #e0e0e0;
				border-radius: 8px;
				padding: 1rem;
			}

			.form-array-container h3 {
				margin-top: 0;
			}

			.array-list {
				display: flex;
				flex-direction: column;
				gap: 0.5rem;
				margin-top: 1rem;
			}

			.add-button {
				width: 100%;
			}

			mat-expansion-panel {
				background: #f9f9f9;
			}
		`,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SequenceFormDialogComponent implements OnInit {
	#fb = inject(NonNullableFormBuilder);
	#dialogRef = inject(MatDialogRef);

	data = inject<{
		selectedSequenceId: string | null;
		sequence?: DidacticSequence;
		levels: any[];
		grades: any[];
		subjects: any[];
		isSaving: boolean;
	}>(MAT_DIALOG_DATA);

	sequenceForm!: FormGroup;

	ngOnInit(): void {
		this.initForm();

		if (this.data.sequence) {
			this.loadSequenceData(this.data.sequence);
		}
	}

	initForm(): void {
		this.sequenceForm = this.#fb.group({
			level: ['PRIMARIA', Validators.required],
			year: ['', Validators.required],
			subject: ['', Validators.required],
			tableOfContents: this.#fb.control('[]'),
			plans: this.#fb.array([]),
		});
	}

	get plans(): FormArray {
		return this.sequenceForm.get('plans') as FormArray;
	}

	createPlanFormGroup(plan?: DidacticPlan): FormGroup {
		return this.#fb.group({
			title: [plan?.title || '', Validators.required],
			description: [plan?.description || ''],
		});
	}

	addPlan(): void {
		this.plans.push(this.createPlanFormGroup());
	}

	removePlan(index: number): void {
		this.plans.removeAt(index);
	}

	loadSequenceData(sequence: DidacticSequence): void {
		this.plans.clear();
		sequence.plans.forEach((plan) => {
			this.plans.push(this.createPlanFormGroup(plan));
		});

		this.sequenceForm.patchValue({
			level: sequence.level,
			year: sequence.year,
			subject: sequence.subject,
			tableOfContents: JSON.stringify(sequence.tableOfContents, null, 2),
		});
	}

	onClose(): void {
		this.#dialogRef.close();
	}

	onSubmit(): void {
		if (this.sequenceForm.invalid) {
			return;
		}

		const rawValue = this.sequenceForm.getRawValue();

		let dto: DidacticSequenceDto;
		try {
			dto = {
				...rawValue,
				tableOfContents: JSON.parse(rawValue.tableOfContents || '[]'),
			};
		} catch (e) {
			console.error('Error al parsear JSON del formulario', e);
			return;
		}

		this.#dialogRef.close({
			sequence: dto,
			id: this.data.selectedSequenceId,
		});
	}
}

// Componente principal
@Component({
	selector: 'app-didactic-sequence-management',
	standalone: true,
	imports: [
		CommonModule,
		ReactiveFormsModule,
		MatDialogModule,
		MatButtonModule,
		MatIconModule,
		MatTableModule,
		MatFormFieldModule,
		MatInputModule,
		MatSelectModule,
		MatProgressSpinnerModule,
		MatCardModule,
		MatExpansionModule,
		MatToolbarModule,
		MatListModule,
	],
	template: `
		<div class="management-container">
			<!-- Contenido Principal (Tabla) -->
			<div class="content-area">
				<div class="content-header">
					<h1>Gestión de Secuencias Didácticas</h1>
					<button
						mat-flat-button
						color="primary"
						(click)="onNewSequence()"
					>
						<mat-icon>add</mat-icon>
						Nueva Secuencia
					</button>
				</div>

				<mat-card>
					<mat-card-content>
						<div
							*ngIf="isLoading(); else tableContent"
							class="spinner-container"
						>
							<mat-progress-spinner
								mode="indeterminate"
								diameter="50"
							></mat-progress-spinner>
						</div>

						<ng-template #tableContent>
							<div
								*ngIf="sequences().length === 0"
								class="empty-state"
							>
								<mat-icon>notes</mat-icon>
								<p>No hay secuencias didácticas creadas.</p>
							</div>

							<table
								mat-table
								[dataSource]="sequences()"
								*ngIf="sequences().length > 0"
								class="mat-elevation-z4"
							>
								<!-- Columna Asignatura -->
								<ng-container matColumnDef="subject">
									<th mat-header-cell *matHeaderCellDef>
										Asignatura
									</th>
									<td mat-cell *matCellDef="let seq">
										{{ seq.subject }}
									</td>
								</ng-container>

								<!-- Columna Nivel -->
								<ng-container matColumnDef="level">
									<th mat-header-cell *matHeaderCellDef>
										Nivel
									</th>
									<td mat-cell *matCellDef="let seq">
										{{ seq.level }}
									</td>
								</ng-container>

								<!-- Columna Grado -->
								<ng-container matColumnDef="year">
									<th mat-header-cell *matHeaderCellDef>
										Grado
									</th>
									<td mat-cell *matCellDef="let seq">
										{{ seq.year }}
									</td>
								</ng-container>

								<!-- Columna # Planes -->
								<ng-container matColumnDef="plansCount">
									<th mat-header-cell *matHeaderCellDef>
										Planes
									</th>
									<td mat-cell *matCellDef="let seq">
										{{ seq.plans.length }}
									</td>
								</ng-container>

								<!-- Columna Acciones -->
								<ng-container matColumnDef="actions">
									<th
										mat-header-cell
										*matHeaderCellDef
										class="actions-cell"
									>
										Acciones
									</th>
									<td
										mat-cell
										*matCellDef="let seq"
										class="actions-cell"
									>
										<button
											mat-icon-button
											color="primary"
											(click)="onSelectSequence(seq)"
											aria-label="Editar secuencia"
										>
											<mat-icon>edit</mat-icon>
										</button>
										<button
											mat-icon-button
											color="warn"
											(click)="onDeleteSequence(seq._id)"
											aria-label="Eliminar secuencia"
										>
											<mat-icon>delete_outline</mat-icon>
										</button>
									</td>
								</ng-container>

								<tr
									mat-header-row
									*matHeaderRowDef="displayedColumns"
								></tr>
								<tr
									mat-row
									*matRowDef="
										let row;
										columns: displayedColumns
									"
								></tr>
							</table>
						</ng-template>
					</mat-card-content>
				</mat-card>
			</div>
		</div>
	`,
	styles: [
		`
			:host {
				display: block;
				height: 100%;
			}

			.management-container {
				height: 100%;
			}

			.content-area {
				padding: 1.5rem;
			}

			.content-header {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 1rem;
			}

			.spinner-container,
			.empty-state {
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				min-height: 200px;
				color: #888;
			}

			.empty-state mat-icon {
				font-size: 48px;
				width: 48px;
				height: 48px;
			}

			mat-card-content {
				padding: 0;
			}

			mat-table {
				width: 100%;
			}

			.actions-cell {
				text-align: right;
			}
		`,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DidacticSequenceManagementComponent implements OnInit, OnDestroy {
	#store = inject(Store);
	#dialog = inject(MatDialog);
	#destroy$ = new Subject<void>();

	// Datos del Store (como signals)
	sequences = this.#store.selectSignal(
		fromDidacticSequences.selectAllSequences,
	);
	isLoading = this.#store.selectSignal(
		fromDidacticSequences.selectIsLoadingMany,
	);
	isCreating = this.#store.selectSignal(
		fromDidacticSequences.selectIsCreating,
	);
	isUpdating = this.#store.selectSignal(
		fromDidacticSequences.selectIsUpdating,
	);
	isSaving = computed(() => this.isCreating() || this.isUpdating());
	error = this.#store.selectSignal(
		fromDidacticSequences.selectSequencesError,
	);

	// Estado local del UI
	selectedSequenceId = signal<string | null>(null);

	displayedColumns: string[] = [
		'subject',
		'level',
		'year',
		'plansCount',
		'actions',
	];

	// Datos para Selects
	levels = LEVELS;
	grades = GRADES;
	subjects = SUBJECTS;

	ngOnInit(): void {
		this.#store.dispatch(loadSequences({ filters: {} }));
	}

	ngOnDestroy(): void {
		this.#destroy$.next();
		this.#destroy$.complete();
	}

	onNewSequence(): void {
		this.openSequenceFormDialog(null);
	}

	onSelectSequence(sequence: DidacticSequence): void {
		this.openSequenceFormDialog(sequence);
	}

	openSequenceFormDialog(sequence: DidacticSequence | null): void {
		const dialogRef = this.#dialog.open(SequenceFormDialogComponent, {
			width: '600px',
			maxWidth: '90vw',
			maxHeight: '90vh',
			data: {
				selectedSequenceId: sequence?._id || null,
				sequence: sequence || undefined,
				levels: this.levels,
				grades: this.grades,
				subjects: this.subjects,
				isSaving: this.isSaving(),
			},
		});

		dialogRef.afterClosed().subscribe((result) => {
			if (result) {
				this.handleFormSubmit(result.sequence, result.id);
			}
		});
	}

	handleFormSubmit(dto: DidacticSequenceDto, id: string | null): void {
		if (id) {
			this.#store.dispatch(
				updateSequence({
					id,
					data: dto as Partial<DidacticSequenceDto>,
				}),
			);
		} else {
			this.#store.dispatch(
				createSequence({
					sequence: dto as DidacticSequenceDto,
				}),
			);
		}
	}

	onDeleteSequence(id: string): void {
		this.#store.dispatch(deleteSequence({ id }));
	}
}
