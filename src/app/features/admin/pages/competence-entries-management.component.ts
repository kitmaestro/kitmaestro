import {
	Component,
	signal,
	inject,
	ChangeDetectionStrategy,
	OnInit,
	OnDestroy,
	ViewEncapsulation,
} from '@angular/core';
import {
	FormBuilder,
	ReactiveFormsModule,
	Validators,
	AbstractControl,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
	Subject,
	Observable,
	takeUntil,
	tap,
	catchError,
	EMPTY,
	finalize,
	debounceTime,
	distinctUntilChanged,
	startWith,
} from 'rxjs';

// Angular Material Modules
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatChipsModule } from '@angular/material/chips';

// --- Core Services & Interfaces ---
import { CompetenceService } from '../../../core/services/competence.service';
import { CompetenceEntry } from '../../../core/interfaces/competence-entry';
import { ApiUpdateResponse } from '../../../core/interfaces/api-update-response';
import { ApiDeleteResponse } from '../../../core/interfaces/api-delete-response';
import { LevelName } from '../../../core/types/level-name';
import { GradeName } from '../../../core/types/grade-name';
import { SubjectName } from '../../../core/types/subject-name';

@Component({
	selector: 'app-competence-entries-management',
	standalone: true,
	imports: [
		CommonModule,
		ReactiveFormsModule,
		MatCardModule,
		MatFormFieldModule,
		MatSelectModule,
		MatInputModule,
		MatButtonModule,
		MatProgressSpinnerModule,
		MatSnackBarModule,
		MatIconModule,
		MatTableModule,
		MatPaginatorModule,
		MatSortModule,
		MatExpansionModule,
		MatChipsModule,
	],
	// --- Inline Template ---
	template: `
		<mat-card class="competence-entries-card">
			<mat-card-header>
				<mat-card-title>Gestión de Competencias</mat-card-title>
				<mat-card-subtitle
					>Administra las entradas de competencias y sus
					criterios</mat-card-subtitle
				>
			</mat-card-header>

			<mat-card-content>
				<mat-expansion-panel
					[expanded]="showCreateForm()"
					(opened)="showCreateForm.set(true)"
					(closed)="onExpansionPanelClosed()"
				>
					<mat-expansion-panel-header>
						<mat-panel-title>
							{{
								editingCompetenceId()
									? 'Editar Competencia'
									: 'Crear Nueva Competencia'
							}}
						</mat-panel-title>
						<mat-panel-description>
							{{
								showCreateForm()
									? 'Cerrar para ver la lista'
									: 'Haz clic para añadir o editar una competencia'
							}}
						</mat-panel-description>
					</mat-expansion-panel-header>

					<form
						[formGroup]="competenceForm"
						(ngSubmit)="onSubmit()"
						class="create-form"
					>
						<div class="form-grid">
							<mat-form-field
								appearance="outline"
								class="form-field"
							>
								<mat-label>Nombre de la Competencia</mat-label>
								<input
									matInput
									formControlName="name"
									required
								/>
								@if (
									getFormControl('name')?.invalid &&
									getFormControl('name')?.touched
								) {
									<mat-error
										>El nombre es requerido.</mat-error
									>
								}
							</mat-form-field>

							<mat-form-field
								appearance="outline"
								class="form-field"
							>
								<mat-label>Nivel</mat-label>
								<mat-select formControlName="level" required>
									@for (level of levels; track level.value) {
										<mat-option [value]="level.value">{{
											level.viewValue
										}}</mat-option>
									}
								</mat-select>
								@if (
									getFormControl('level')?.invalid &&
									getFormControl('level')?.touched
								) {
									<mat-error>Nivel es requerido.</mat-error>
								}
							</mat-form-field>

							<mat-form-field
								appearance="outline"
								class="form-field"
							>
								<mat-label>Año/Grado</mat-label>
								<mat-select formControlName="grade" required>
									@for (grade of grades; track grade.value) {
										<mat-option [value]="grade.value">{{
											grade.viewValue
										}}</mat-option>
									}
								</mat-select>
								@if (
									getFormControl('grade')?.invalid &&
									getFormControl('grade')?.touched
								) {
									<mat-error
										>Año/Grado es requerido.</mat-error
									>
								}
							</mat-form-field>

							<mat-form-field
								appearance="outline"
								class="form-field"
							>
								<mat-label>Asignatura</mat-label>
								<mat-select formControlName="subject" required>
									@for (
										subject of subjects;
										track subject.value
									) {
										<mat-option [value]="subject.value">{{
											subject.viewValue
										}}</mat-option>
									}
								</mat-select>
								@if (
									getFormControl('subject')?.invalid &&
									getFormControl('subject')?.touched
								) {
									<mat-error
										>Asignatura es requerida.</mat-error
									>
								}
							</mat-form-field>
						</div>

						<div class="textarea-grid">
							<mat-form-field
								appearance="outline"
								class="form-field textarea-field"
							>
								<mat-label>Entradas (una por línea)</mat-label>
								<textarea
									matInput
									cdkTextareaAutosize
									formControlName="entriesStr"
									rows="5"
									required
								></textarea>
								@if (
									getFormControl('entriesStr')?.invalid &&
									getFormControl('entriesStr')?.touched
								) {
									<mat-error
										>Al menos una entrada es
										requerida.</mat-error
									>
								}
							</mat-form-field>

							<mat-form-field
								appearance="outline"
								class="form-field textarea-field"
							>
								<mat-label
									>Criterios de Evaluación (uno por
									línea)</mat-label
								>
								<textarea
									matInput
									cdkTextareaAutosize
									formControlName="criteriaStr"
									rows="5"
									required
								></textarea>
								@if (
									getFormControl('criteriaStr')?.invalid &&
									getFormControl('criteriaStr')?.touched
								) {
									<mat-error
										>Al menos un criterio es
										requerido.</mat-error
									>
								}
							</mat-form-field>
						</div>

						<div class="form-actions">
							<button
								mat-stroked-button
								type="button"
								(click)="resetFormAndState()"
							>
								Limpiar / Cancelar Edición
							</button>
							<button
								mat-raised-button
								color="primary"
								type="submit"
								[disabled]="
									competenceForm.invalid || isSubmitting()
								"
							>
								@if (isSubmitting()) {
									<mat-spinner
										diameter="20"
										class="inline-spinner"
									></mat-spinner>
									{{
										editingCompetenceId()
											? 'Actualizando...'
											: 'Guardando...'
									}}
								} @else {
									<ng-container>
										<mat-icon>{{
											editingCompetenceId()
												? 'update'
												: 'save'
										}}</mat-icon>
										{{
											editingCompetenceId()
												? 'Actualizar Competencia'
												: 'Guardar Competencia'
										}}
									</ng-container>
								}
							</button>
						</div>
					</form>
				</mat-expansion-panel>

				<hr class="section-divider" />

				<div class="filters-section">
					<h3>Filtrar Competencias</h3>
					<form [formGroup]="filterForm" class="filter-form">
						<mat-form-field
							appearance="outline"
							class="filter-field"
						>
							<mat-label>Buscar por Nombre</mat-label>
							<input
								matInput
								formControlName="name"
								placeholder="Ej: Competencia Comunicativa"
							/>
						</mat-form-field>
						<mat-form-field
							appearance="outline"
							class="filter-field"
						>
							<mat-label>Nivel</mat-label>
							<mat-select formControlName="level">
								<mat-option value="">Todos</mat-option>
								@for (level of levels; track level.value) {
									<mat-option [value]="level.value">{{
										level.viewValue
									}}</mat-option>
								}
							</mat-select>
						</mat-form-field>
						<mat-form-field
							appearance="outline"
							class="filter-field"
						>
							<mat-label>Año/Grado</mat-label>
							<mat-select formControlName="grade">
								<mat-option value="">Todos</mat-option>
								@for (grade of grades; track grade.value) {
									<mat-option [value]="grade.value">{{
										grade.viewValue
									}}</mat-option>
								}
							</mat-select>
						</mat-form-field>
						<mat-form-field
							appearance="outline"
							class="filter-field"
						>
							<mat-label>Asignatura</mat-label>
							<mat-select formControlName="subject">
								<mat-option value="">Todas</mat-option>
								@for (
									subject of subjects;
									track subject.value
								) {
									<mat-option [value]="subject.value">{{
										subject.viewValue
									}}</mat-option>
								}
							</mat-select>
						</mat-form-field>
						<button
							mat-stroked-button
							type="button"
							(click)="resetFilters()"
						>
							<mat-icon>clear_all</mat-icon> Limpiar Filtros
						</button>
					</form>
				</div>

				@if (isLoadingCompetences()) {
					<div class="loading-indicator">
						<mat-spinner diameter="50"></mat-spinner>
						<p>Cargando competencias...</p>
					</div>
				} @else if (filteredCompetences().length === 0) {
					<p class="no-results">
						No se encontraron competencias con los filtros
						aplicados.
					</p>
				} @else {
					<div class="table-container mat-elevation-z4">
						<table
							mat-table
							[dataSource]="filteredCompetences()"
							class="competence-entries-table"
						>
							<ng-container matColumnDef="name">
								<th mat-header-cell *matHeaderCellDef>
									Nombre
								</th>
								<td mat-cell *matCellDef="let item">
									{{ item.name }}
								</td>
							</ng-container>
							<ng-container matColumnDef="level">
								<th mat-header-cell *matHeaderCellDef>Nivel</th>
								<td mat-cell *matCellDef="let item">
									{{ getDisplayValue(levels, item.level) }}
								</td>
							</ng-container>
							<ng-container matColumnDef="grade">
								<th mat-header-cell *matHeaderCellDef>
									Año/Grado
								</th>
								<td mat-cell *matCellDef="let item">
									{{ getDisplayValue(grades, item.grade) }}
								</td>
							</ng-container>
							<ng-container matColumnDef="subject">
								<th mat-header-cell *matHeaderCellDef>
									Asignatura
								</th>
								<td mat-cell *matCellDef="let item">
									{{
										getDisplayValue(subjects, item.subject)
									}}
								</td>
							</ng-container>
							<ng-container matColumnDef="actions">
								<th mat-header-cell *matHeaderCellDef>
									Acciones
								</th>
								<td mat-cell *matCellDef="let item">
									<button
										mat-icon-button
										color="primary"
										(click)="onEditCompetence(item)"
										matTooltip="Editar Competencia"
									>
										<mat-icon>edit</mat-icon>
									</button>
									<button
										mat-icon-button
										color="warn"
										(click)="onDeleteCompetence(item._id)"
										matTooltip="Eliminar Competencia"
									>
										<mat-icon>delete</mat-icon>
									</button>
								</td>
							</ng-container>

							<tr
								mat-header-row
								*matHeaderRowDef="displayedColumns"
							></tr>
							<tr
								mat-row
								*matRowDef="let row; columns: displayedColumns"
							></tr>
						</table>
					</div>
				}
			</mat-card-content>
		</mat-card>
	`,
	// --- Inline Styles ---
	styles: [
		`
			:host {
				display: block;
			}
			.competence-entries-card {
				margin: 0 auto;
				padding: 15px 25px 25px 25px;
			}
			.create-form,
			.filter-form {
				display: flex;
				flex-direction: column;
				gap: 10px;
				margin-bottom: 20px;
			}
			.form-grid {
				display: grid;
				grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
				gap: 15px;
			}
			.textarea-grid {
				display: grid;
				grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
				gap: 15px;
				margin-top: 15px;
			}
			.form-field {
				width: 100%;
			}
			.textarea-field textarea {
				min-height: 100px;
			}
			.form-actions {
				display: flex;
				justify-content: flex-end;
				gap: 10px;
				margin-top: 20px;
			}
			.inline-spinner {
				display: inline-block;
				margin-right: 8px;
				vertical-align: middle;
			}

			.section-divider {
				margin: 30px 0;
				border: 0;
				border-top: 1px solid #eee;
			}
			.filters-section h3 {
				margin-bottom: 15px;
			}
			.filter-form {
				display: flex;
				flex-direction: row;
				flex-wrap: wrap;
				align-items: center;
				gap: 15px;
			}
			.filter-field {
				flex-grow: 1;
				min-width: 200px;
			}

			.loading-indicator {
				text-align: center;
				padding: 30px;
			}
			.loading-indicator p {
				margin-top: 10px;
			}
			.no-results {
				text-align: center;
				padding: 20px;
				color: #757575;
				font-style: italic;
			}
			.table-container {
				overflow-x: auto;
			}
			.competence-entries-table {
				width: 100%;
			}
			.mat-column-actions {
				width: 120px;
				text-align: right;
			}
		`,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
})
export class CompetenceEntriesManagementComponent implements OnInit, OnDestroy {
	// --- Dependencies ---
	#fb = inject(FormBuilder);
	#competenceService = inject(CompetenceService);
	#snackBar = inject(MatSnackBar);

	// --- State Signals ---
	isLoadingCompetences = signal(false);
	isSubmitting = signal(false);
	showCreateForm = signal(false);
	editingCompetenceId = signal<string | null>(null);

	allCompetences = signal<CompetenceEntry[]>([]);
	filteredCompetences = signal<CompetenceEntry[]>([]);

	// --- Form Definitions ---
	competenceForm = this.#fb.group({
		name: ['', Validators.required],
		level: ['', Validators.required],
		grade: ['', Validators.required],
		subject: ['', Validators.required],
		entriesStr: ['', Validators.required],
		criteriaStr: ['', Validators.required],
	});

	filterForm = this.#fb.group({
		name: [''],
		level: [''],
		grade: [''],
		subject: [''],
	});

	// --- Fixed Select Options ---
	readonly levels: { value: LevelName; viewValue: string }[] = [
		{ value: 'PRIMARIA', viewValue: 'Primaria' },
		{ value: 'SECUNDARIA', viewValue: 'Secundaria' },
	];
	readonly grades: { value: GradeName; viewValue: string }[] = [
		{ value: 'PRIMERO', viewValue: '1er Grado' },
		{ value: 'SEGUNDO', viewValue: '2do Grado' },
		{ value: 'TERCERO', viewValue: '3er Grado' },
		{ value: 'CUARTO', viewValue: '4to Grado' },
		{ value: 'QUINTO', viewValue: '5to Grado' },
		{ value: 'SEXTO', viewValue: '6to Grado' },
	];
	readonly subjects: { value: SubjectName; viewValue: string }[] = [
		{ value: 'LENGUA_ESPANOLA', viewValue: 'Lengua Española' },
		{ value: 'MATEMATICA', viewValue: 'Matemática' },
		{ value: 'CIENCIAS_SOCIALES', viewValue: 'Ciencias Sociales' },
		{ value: 'CIENCIAS_NATURALES', viewValue: 'Ciencias Naturales' },
		{ value: 'INGLES', viewValue: 'Inglés' },
		{ value: 'FRANCES', viewValue: 'Francés' },
		{ value: 'EDUCACION_ARTISTICA', viewValue: 'Educación Artística' },
		{ value: 'EDUCACION_FISICA', viewValue: 'Educación Física' },
		{
			value: 'FORMACION_HUMANA',
			viewValue: 'Formación Integral Humana y Religiosa',
		},
		{ value: 'TALLERES_OPTATIVOS', viewValue: 'Talleres Optativos' },
	];

	// --- Table ---
	displayedColumns: string[] = [
		'name',
		'level',
		'grade',
		'subject',
		'actions',
	];

	// --- Lifecycle Management ---
	#destroy$ = new Subject<void>();

	// --- OnInit ---
	ngOnInit(): void {
		this.#loadCompetences();
		this.#listenForFilterChanges();
	}

	// --- OnDestroy ---
	ngOnDestroy(): void {
		this.#destroy$.next();
		this.#destroy$.complete();
	}

	// --- Private Methods ---

	#loadCompetences(): void {
		this.isLoadingCompetences.set(true);
		this.#competenceService
			.findAll()
			.pipe(
				takeUntil(this.#destroy$),
				tap((competences) => {
					this.allCompetences.set(competences || []);
					this.#applyClientSideFilters(
						this.filterForm.value,
						competences || [],
					);
				}),
				catchError((error) =>
					this.#handleError(
						error,
						'Error al cargar las competencias.',
					),
				),
				finalize(() => this.isLoadingCompetences.set(false)),
			)
			.subscribe();
	}

	#listenForFilterChanges(): void {
		this.filterForm.valueChanges
			.pipe(
				takeUntil(this.#destroy$),
				startWith(this.filterForm.value),
				debounceTime(300),
				distinctUntilChanged(
					(prev, curr) =>
						JSON.stringify(prev) === JSON.stringify(curr),
				),
				tap((filterValues) => {
					this.#applyClientSideFilters(
						filterValues,
						this.allCompetences(),
					);
				}),
			)
			.subscribe();
	}

	#applyClientSideFilters(filters: any, source: CompetenceEntry[]): void {
		let items = [...source];
		if (filters.name) {
			items = items.filter((i) =>
				i.name.toLowerCase().includes(filters.name.toLowerCase()),
			);
		}
		if (filters.level) {
			items = items.filter((i) => i.level === filters.level);
		}
		if (filters.grade) {
			items = items.filter((i) => i.grade === filters.grade);
		}
		if (filters.subject) {
			items = items.filter((i) => i.subject === filters.subject);
		}
		this.filteredCompetences.set(items);
	}

	#handleError(error: any, defaultMessage: string): Observable<never> {
		console.error(defaultMessage, error);
		const message = error?.error?.message || defaultMessage;
		this.#snackBar.open(message, 'Cerrar', { duration: 5000 });
		return EMPTY;
	}

	#splitStringToArray(str: string | undefined | null): string[] {
		if (!str) return [];
		return str
			.split('\n')
			.map((item) => item.trim())
			.filter((item) => item.length > 0);
	}

	#joinArrayToString(arr: string[] | undefined | null): string {
		if (!arr) return '';
		return arr.join('\n');
	}

	// --- Public Methods ---

	getFormControl(name: string): AbstractControl | null {
		return this.competenceForm.get(name);
	}

	getDisplayValue(
		options: { value: string; viewValue: string }[],
		value: string,
	): string {
		const option = options.find((opt) => opt.value === value);
		return option ? option.viewValue : value;
	}

	resetFormAndState(): void {
		this.competenceForm.reset({
			name: '',
			level: '',
			grade: '',
			subject: '',
			entriesStr: '',
			criteriaStr: '',
		});
		this.editingCompetenceId.set(null);
		this.isSubmitting.set(false);
	}

	onExpansionPanelClosed(): void {
		if (!this.editingCompetenceId()) {
			this.resetFormAndState();
		}
		this.showCreateForm.set(false);
	}

	resetFilters(): void {
		this.filterForm.reset({ name: '', level: '', grade: '', subject: '' });
	}

	onSubmit(): void {
		if (this.competenceForm.invalid) {
			this.competenceForm.markAllAsTouched();
			this.#snackBar.open(
				'Por favor, completa todos los campos requeridos.',
				'Cerrar',
				{ duration: 3000 },
			);
			return;
		}

		this.isSubmitting.set(true);
		const formValue = this.competenceForm.getRawValue();

		const competenceData: Partial<CompetenceEntry> = {
			name: formValue.name!,
			level: formValue.level as LevelName,
			grade: formValue.grade as GradeName,
			subject: formValue.subject as SubjectName,
			entries: this.#splitStringToArray(formValue.entriesStr),
			criteria: this.#splitStringToArray(formValue.criteriaStr),
		};

		let operation$: Observable<CompetenceEntry | ApiUpdateResponse>;
		const editingId = this.editingCompetenceId();

		if (editingId) {
			operation$ = this.#competenceService.update(
				editingId,
				competenceData,
			);
		} else {
			operation$ = this.#competenceService.createCompetence(
				competenceData as CompetenceEntry,
			);
		}

		operation$
			.pipe(
				takeUntil(this.#destroy$),
				tap(() => {
					const name = competenceData.name;
					const message = editingId
						? `Competencia "${name}" actualizada exitosamente.`
						: `Competencia "${name}" creada exitosamente.`;
					this.#snackBar.open(message, 'Cerrar', { duration: 3000 });
					this.resetFormAndState();
					this.showCreateForm.set(false);
					this.#loadCompetences();
				}),
				catchError((error) => {
					this.isSubmitting.set(false);
					const action = editingId ? 'actualizar' : 'crear';
					return this.#handleError(
						error,
						`Error al ${action} la competencia.`,
					);
				}),
				finalize(() => this.isSubmitting.set(false)),
			)
			.subscribe();
	}

	onEditCompetence(competence: CompetenceEntry): void {
		this.editingCompetenceId.set(competence._id);
		this.competenceForm.patchValue({
			name: competence.name,
			level: competence.level,
			grade: competence.grade,
			subject: competence.subject,
			entriesStr: this.#joinArrayToString(competence.entries),
			criteriaStr: this.#joinArrayToString(competence.criteria),
		});
		this.showCreateForm.set(true);
		this.#snackBar.open(
			`Editando competencia: "${competence.name}".`,
			'Cerrar',
			{ duration: 2000 },
		);
	}

	onDeleteCompetence(id: string): void {
		if (
			!confirm('¿Estás seguro de que deseas eliminar esta competencia?')
		) {
			return;
		}
		this.isLoadingCompetences.set(true);
		this.#competenceService
			.delete(id)
			.pipe(
				takeUntil(this.#destroy$),
				tap((response) => {
					if (response && response.deletedCount > 0) {
						this.#snackBar.open(
							'Competencia eliminada exitosamente.',
							'Cerrar',
							{ duration: 3000 },
						);
					}
					this.#loadCompetences();
				}),
				catchError((error) =>
					this.#handleError(
						error,
						'Error al eliminar la competencia.',
					),
				),
				finalize(() => this.isLoadingCompetences.set(false)),
			)
			.subscribe();
	}
}
