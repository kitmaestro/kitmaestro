import {
	Component,
	signal,
	inject,
	ChangeDetectionStrategy,
	OnInit,
	OnDestroy,
	ViewEncapsulation,
	computed,
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
import { ActivatedRoute } from '@angular/router';

// Angular Material Modules
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table'; // For displaying the list
import { MatPaginatorModule } from '@angular/material/paginator'; // Optional pagination
import { MatSortModule } from '@angular/material/sort'; // Optional sorting
import { MatExpansionModule } from '@angular/material/expansion'; // For the creation form panel
import { MatChipsModule } from '@angular/material/chips'; // For displaying array items

// --- Core Services & Interfaces (Using new structure paths) ---
import { ContentBlockService } from '../../../core/services/content-block.service';
import {
	ContentBlock,
	SchoolLevel,
	SchoolSubject,
	SchoolYear,
} from '../../../core';
import { ApiUpdateResponse } from '../../../core';

@Component({
	selector: 'app-content-blocks-management',
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
		<mat-card class="content-blocks-card">
			<mat-card-header>
				<mat-card-title>Gestión de Bloques de Contenido</mat-card-title>
				<mat-card-subtitle
					>Administra los bloques de contenido
					curricular</mat-card-subtitle
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
								editingBlockId()
									? 'Editar Bloque de Contenido'
									: 'Crear Nuevo Bloque de Contenido'
							}}
						</mat-panel-title>
						<mat-panel-description>
							{{
								showCreateForm()
									? 'Cerrar para ver la lista'
									: 'Haz clic para añadir o editar un bloque'
							}}
						</mat-panel-description>
					</mat-expansion-panel-header>

					<form
						[formGroup]="contentBlockForm"
						(ngSubmit)="onSubmit()"
						class="create-form"
					>
						<div class="form-grid">
							<mat-form-field
								appearance="outline"
								class="form-field"
							>
								<mat-label>Título</mat-label>
								<input
									matInput
									formControlName="title"
									required
								/>
								@if (
									getFormControl('title')?.invalid &&
									getFormControl('title')?.touched
								) {
									<mat-error>Título es requerido.</mat-error>
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
								<mat-select formControlName="year" required>
									@for (
										year of createFormYears();
										track year.value
									) {
										<mat-option [value]="year.value">{{
											year.viewValue
										}}</mat-option>
									}
								</mat-select>
								@if (
									getFormControl('year')?.invalid &&
									getFormControl('year')?.touched
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

							<mat-form-field
								appearance="outline"
								class="form-field"
							>
								<mat-label>Orden</mat-label>
								<input
									matInput
									type="number"
									formControlName="order"
									required
									min="1"
								/>
								@if (
									getFormControl('order')?.invalid &&
									getFormControl('order')?.touched
								) {
									<mat-error
										>Orden es requerido (mínimo
										1).</mat-error
									>
								}
							</mat-form-field>
						</div>

						<div class="textarea-grid">
							<mat-form-field
								appearance="outline"
								class="form-field textarea-field"
							>
								<mat-label>Conceptos (uno por línea)</mat-label>
								<textarea
									matInput
									cdkTextareaAutosize
									formControlName="conceptsStr"
									rows="3"
								></textarea>
							</mat-form-field>

							<mat-form-field
								appearance="outline"
								class="form-field textarea-field"
							>
								<mat-label
									>Procedimientos (uno por línea)</mat-label
								>
								<textarea
									matInput
									cdkTextareaAutosize
									formControlName="proceduresStr"
									rows="3"
								></textarea>
							</mat-form-field>

							<mat-form-field
								appearance="outline"
								class="form-field textarea-field"
							>
								<mat-label
									>Actitudes y Valores (uno por
									línea)</mat-label
								>
								<textarea
									matInput
									cdkTextareaAutosize
									formControlName="attitudesStr"
									rows="3"
								></textarea>
							</mat-form-field>

							<mat-form-field
								appearance="outline"
								class="form-field textarea-field"
							>
								<mat-label
									>Indicadores de Logro (uno por
									línea)</mat-label
								>
								<textarea
									matInput
									cdkTextareaAutosize
									formControlName="achievementIndicatorsStr"
									rows="3"
								></textarea>
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
									contentBlockForm.invalid || isSubmitting()
								"
							>
								@if (isSubmitting()) {
									<mat-spinner
										diameter="20"
										class="inline-spinner"
									></mat-spinner>
									{{
										editingBlockId()
											? 'Actualizando...'
											: 'Guardando...'
									}}
								} @else {
									<ng-container>
										<mat-icon>{{
											editingBlockId() ? 'update' : 'save'
										}}</mat-icon>
										{{
											editingBlockId()
												? 'Actualizar Bloque'
												: 'Guardar Bloque'
										}}
									</ng-container>
								}
							</button>
						</div>
					</form>
				</mat-expansion-panel>

				<hr class="section-divider" />

				<div class="filters-section">
					<h3>Filtrar Bloques de Contenido</h3>
					<form [formGroup]="filterForm" class="filter-form">
						<mat-form-field
							appearance="outline"
							class="filter-field"
						>
							<mat-label>Buscar por Título</mat-label>
							<input
								matInput
								formControlName="title"
								placeholder="Ej: Los Ecosistemas"
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
							<mat-select formControlName="year">
								<mat-option value="">Todos</mat-option>
								@for (
									year of filterYearsForFilter();
									track year.value
								) {
									<mat-option [value]="year.value">{{
										year.viewValue
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

				@if (isLoadingBlocks()) {
					<div class="loading-indicator">
						<mat-spinner diameter="50"></mat-spinner>
						<p>Cargando bloques...</p>
					</div>
				} @else if (filteredContentBlocks().length === 0) {
					<p class="no-results">
						No se encontraron bloques de contenido con los filtros
						aplicados.
					</p>
				} @else {
					<div class="table-container mat-elevation-z4">
						<table
							mat-table
							[dataSource]="filteredContentBlocks()"
							class="content-blocks-table"
						>
							<ng-container matColumnDef="title">
								<th mat-header-cell *matHeaderCellDef>
									Título
								</th>
								<td mat-cell *matCellDef="let block">
									{{ block.title }}
								</td>
							</ng-container>
							<ng-container matColumnDef="level">
								<th mat-header-cell *matHeaderCellDef>Nivel</th>
								<td mat-cell *matCellDef="let block">
									{{ getDisplayValue(levels, block.level) }}
								</td>
							</ng-container>
							<ng-container matColumnDef="year">
								<th mat-header-cell *matHeaderCellDef>
									Año/Grado
								</th>
								<td mat-cell *matCellDef="let block">
									{{ getDisplayValue(allYears, block.year) }}
								</td>
							</ng-container>
							<ng-container matColumnDef="subject">
								<th mat-header-cell *matHeaderCellDef>
									Asignatura
								</th>
								<td mat-cell *matCellDef="let block">
									{{
										getDisplayValue(subjects, block.subject)
									}}
								</td>
							</ng-container>
							<ng-container matColumnDef="order">
								<th mat-header-cell *matHeaderCellDef>Orden</th>
								<td mat-cell *matCellDef="let block">
									{{ block.order }}
								</td>
							</ng-container>
							<ng-container matColumnDef="actions">
								<th mat-header-cell *matHeaderCellDef>
									Acciones
								</th>
								<td mat-cell *matCellDef="let block">
									<button
										mat-icon-button
										color="primary"
										(click)="onEditBlock(block)"
										matTooltip="Editar Bloque"
									>
										<mat-icon>edit</mat-icon>
									</button>
									<button
										mat-icon-button
										color="warn"
										(click)="onDeleteBlock(block._id)"
										matTooltip="Eliminar Bloque"
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
			.content-blocks-card {
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
				min-height: 80px;
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
			}
			.filter-field {
				margin-right: 15px;
				margin-bottom: 10px;
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
			.content-blocks-table {
				width: 100%;
			}
			.mat-column-actions {
				width: 120px;
				text-align: right;
			}
			.mat-mdc-form-field {
				font-size: 0.9em;
			}
		`,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
})
export class ContentBlocksManagementComponent implements OnInit, OnDestroy {
	// --- Dependencies ---
	#route = inject(ActivatedRoute);
	#fb = inject(FormBuilder);
	#contentBlockService = inject(ContentBlockService);
	#snackBar = inject(MatSnackBar);

	// --- State Signals ---
	isLoadingBlocks = signal(false);
	isSubmitting = signal(false);
	showCreateForm = signal(false);
	editingBlockId = signal<string | null>(null); // To track if we are editing

	allContentBlocks = signal<ContentBlock[]>([]);
	filteredContentBlocks = signal<ContentBlock[]>([]);

	// --- Form Definitions ---
	contentBlockForm = this.#fb.group({
		title: ['', Validators.required],
		level: ['', Validators.required],
		year: ['', Validators.required],
		subject: ['', Validators.required],
		order: [1, [Validators.required, Validators.min(1)]],
		conceptsStr: [''],
		proceduresStr: [''],
		attitudesStr: [''],
		achievementIndicatorsStr: [''],
	});

	filterForm = this.#fb.group({
		title: [''],
		level: [''],
		year: [''],
		subject: [''],
	});

	// --- Fixed Select Options ---
	readonly levels = [
		{ value: 'PRE_PRIMARIA', viewValue: 'Inicial' },
		{ value: 'PRIMARIA', viewValue: 'Primaria' },
		{ value: 'SECUNDARIA', viewValue: 'Secundaria' },
	];
	readonly allYears = [
		{ value: 'PRIMERO', viewValue: '1er Grado' },
		{ value: 'SEGUNDO', viewValue: '2do Grado' },
		{ value: 'TERCERO', viewValue: '3er Grado' },
		{ value: 'CUARTO', viewValue: '4to Grado' },
		{ value: 'QUINTO', viewValue: '5to Grado' },
		{ value: 'SEXTO', viewValue: '6to Grado' },
	];
	readonly subjects = [
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
	];

	// Dynamic years for the CREATE/EDIT form based on its selected level
	createFormYears = computed(() => {
		const selectedLevel = this.contentBlockForm.get('level')?.value;
		// For now, assume all years are available regardless of level in create form,
		// or implement specific logic if needed. The user's latest provided 'allYears'
		// seems to cover PRIMARIA and SECUNDARIA up to 6to.
		return this.allYears;
	});

	// Dynamic years for the FILTER form based on its selected level
	filterYearsForFilter = computed(() => {
		// Renamed to avoid confusion
		const selectedLevel = this.filterForm.get('level')?.value;
		if (selectedLevel === 'PRIMARIA' || selectedLevel === 'SECUNDARIA') {
			// Assuming 'PRIMERO' to 'SEXTO' map to 1-6 for filtering
			// This logic might need adjustment if year values are not directly comparable to numbers
			return this.allYears; // For now, show all, adjust if specific filtering is needed
		}
		return this.allYears;
	});

	// --- Table ---
	displayedColumns: string[] = [
		'title',
		'level',
		'year',
		'subject',
		'order',
		'actions',
	]; // Added 'order'

	// --- Lifecycle Management ---
	#destroy$ = new Subject<void>();

	// --- OnInit ---
	ngOnInit(): void {
		const { level, year, subject } = this.#route.snapshot.queryParams;
		const filters: any = {};
		if (level) {
			filters.level = level;
			this.filterForm.get('level')?.setValue(level);
		}
		if (year) {
			filters.year = year;
			this.filterForm.get('year')?.setValue(year);
		}
		if (subject) {
			filters.subject = subject;
			this.filterForm.get('subject')?.setValue(subject);
		}
		this.#loadContentBlocks(filters);
		this.#listenForFilterChanges();
	}

	// --- OnDestroy ---
	ngOnDestroy(): void {
		this.#destroy$.next();
		this.#destroy$.complete();
	}

	// --- Private Methods ---

	#loadContentBlocks(filters?: any): void {
		this.isLoadingBlocks.set(true);
		this.#contentBlockService
			.findAll(filters)
			.pipe(
				takeUntil(this.#destroy$),
				tap((blocks) => {
					this.allContentBlocks.set(blocks || []);
					// Apply client-side filtering if filters are present, otherwise show all
					if (filters && Object.keys(filters).length > 0) {
						this.#applyClientSideFilters(filters, blocks || []);
					} else {
						this.filteredContentBlocks.set(blocks || []);
					}
				}),
				catchError((error) =>
					this.#handleError(
						error,
						'Error al cargar los bloques de contenido.',
					),
				),
				finalize(() => this.isLoadingBlocks.set(false)),
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
					const activeFilters: any = {};
					if (filterValues.title)
						activeFilters.title = filterValues.title;
					if (filterValues.level)
						activeFilters.level = filterValues.level;
					if (filterValues.year)
						activeFilters.year = filterValues.year;
					if (filterValues.subject)
						activeFilters.subject = filterValues.subject;
					// Client-side filtering based on allContentBlocks
					this.#applyClientSideFilters(
						activeFilters,
						this.allContentBlocks(),
					);
				}),
			)
			.subscribe();
	}

	#applyClientSideFilters(filters: any, sourceBlocks: ContentBlock[]): void {
		let blocks = [...sourceBlocks];
		if (filters.title) {
			blocks = blocks.filter((b) =>
				b.title.toLowerCase().includes(filters.title.toLowerCase()),
			);
		}
		if (filters.level) {
			blocks = blocks.filter((b) => b.level === filters.level);
		}
		if (filters.year) {
			blocks = blocks.filter((b) => b.year === filters.year);
		}
		if (filters.subject) {
			blocks = blocks.filter((b) => b.subject === filters.subject);
		}
		this.filteredContentBlocks.set(blocks);
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
		return this.contentBlockForm.get(name);
	}

	getDisplayValue(
		options: { value: string; viewValue: string }[],
		value: string,
	): string {
		const option = options.find((opt) => opt.value === value);
		return option ? option.viewValue : value;
	}

	resetFormAndState(): void {
		// Renamed for clarity
		this.contentBlockForm.reset({
			title: '',
			level: '',
			year: '',
			subject: '',
			order: 1,
			conceptsStr: '',
			proceduresStr: '',
			attitudesStr: '',
			achievementIndicatorsStr: '',
		});
		this.editingBlockId.set(null); // Clear editing state
		this.isSubmitting.set(false); // Ensure submitting state is reset
		// this.showCreateForm.set(false); // Optionally close panel
	}

	onExpansionPanelClosed(): void {
		// If panel is closed and we are not actively editing, ensure form is reset
		if (!this.editingBlockId()) {
			this.resetFormAndState();
		}
		this.showCreateForm.set(false);
	}

	resetFilters(): void {
		this.filterForm.reset({ title: '', level: '', year: '', subject: '' });
		this.filteredContentBlocks.set([...this.allContentBlocks()]); // Reset to show all blocks
	}

	onSubmit(): void {
		// Renamed from onCreateSubmit
		if (this.contentBlockForm.invalid) {
			this.contentBlockForm.markAllAsTouched();
			this.#snackBar.open(
				'Por favor, completa todos los campos requeridos.',
				'Cerrar',
				{ duration: 3000 },
			);
			return;
		}

		this.isSubmitting.set(true);
		const formValue = this.contentBlockForm.getRawValue();

		const blockData: Partial<ContentBlock> = {
			title: formValue.title!,
			level: formValue.level! as SchoolLevel | undefined,
			year: formValue.year! as SchoolYear | undefined,
			subject: formValue.subject! as SchoolSubject | undefined,
			order: formValue.order!,
			concepts: this.#splitStringToArray(formValue.conceptsStr),
			procedures: this.#splitStringToArray(formValue.proceduresStr),
			attitudes: this.#splitStringToArray(formValue.attitudesStr),
			achievement_indicators: this.#splitStringToArray(
				formValue.achievementIndicatorsStr,
			),
		};

		let operation$: Observable<ContentBlock | ApiUpdateResponse>;

		if (this.editingBlockId()) {
			operation$ = this.#contentBlockService.update(
				this.editingBlockId()!,
				blockData,
			);
		} else {
			operation$ = this.#contentBlockService.create(
				blockData as ContentBlock,
			);
		}

		operation$
			.pipe(
				takeUntil(this.#destroy$),
				tap(() => {
					const title = blockData.title;
					if (this.editingBlockId()) {
						this.#snackBar.open(
							`Bloque "${title}" actualizado exitosamente.`,
							'Cerrar',
							{ duration: 3000 },
						);
					} else {
						this.#snackBar.open(
							`Bloque "${title}" creado exitosamente.`,
							'Cerrar',
							{ duration: 3000 },
						);
					}
					this.resetFormAndState();
					this.showCreateForm.set(false);
					const { level, year, subject } = this.filterForm.value;
					const filters: any = {};
					if (level) filters.level = level;
					if (year) filters.year = year;
					if (subject) filters.subject = subject;
					this.#loadContentBlocks(filters);
				}),
				catchError((error) => {
					this.isSubmitting.set(false);
					const action = this.editingBlockId()
						? 'actualizar'
						: 'crear';
					return this.#handleError(
						error,
						`Error al ${action} el bloque de contenido.`,
					);
				}),
				finalize(() => this.isSubmitting.set(false)),
			)
			.subscribe();
	}

	onEditBlock(block: ContentBlock): void {
		this.editingBlockId.set(block._id);
		this.contentBlockForm.patchValue({
			title: block.title,
			level: block.level,
			year: block.year,
			subject: block.subject,
			order: block.order,
			conceptsStr: this.#joinArrayToString(block.concepts),
			proceduresStr: this.#joinArrayToString(block.procedures),
			attitudesStr: this.#joinArrayToString(block.attitudes),
			achievementIndicatorsStr: this.#joinArrayToString(
				block.achievement_indicators,
			),
		});
		this.showCreateForm.set(true); // Open form for editing
		this.#snackBar.open(`Editando bloque: "${block.title}".`, 'Cerrar', {
			duration: 2000,
		});
	}

	onDeleteBlock(blockId: string): void {
		if (
			!confirm(
				'¿Estás seguro de que deseas eliminar este bloque de contenido?',
			)
		) {
			return;
		}
		this.isLoadingBlocks.set(true);
		this.#contentBlockService
			.delete(blockId)
			.pipe(
				takeUntil(this.#destroy$),
				tap((response) => {
					// Check if response has deletedCount and it's greater than 0 for more robust success check
					if (response && response.deletedCount > 0) {
						this.#snackBar.open(
							'Bloque eliminado exitosamente.',
							'Cerrar',
							{ duration: 3000 },
						);
					}
					const { level, year, subject } = this.filterForm.value;
					const filters: any = {};
					if (level) filters.level = level;
					if (year) filters.year = year;
					if (subject) filters.subject = subject;
					this.#loadContentBlocks(filters);
				}),
				catchError((error) => {
					this.isLoadingBlocks.set(false);
					return this.#handleError(
						error,
						'Error al eliminar el bloque.',
					);
				}),
				finalize(() => this.isLoadingBlocks.set(false)),
			)
			.subscribe();
	}
}
