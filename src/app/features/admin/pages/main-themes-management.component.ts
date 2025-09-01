import {
    Component,
    signal,
    inject,
    ChangeDetectionStrategy,
    OnInit,
    OnDestroy,
    ViewEncapsulation,
    computed
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
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
    startWith
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
// NOTA: Se asume la existencia de un 'MainThemeService' con una estructura similar a 'ContentBlockService'
import { MainThemeService } from '../../../core/services/main-theme.service';
import { MainTheme } from '../../../core/interfaces/main-theme'; // Asumiendo que la interfaz está en esta ruta
import { ApiUpdateResponse } from '../../../core/interfaces/api-update-response';


@Component({
    selector: 'app-main-themes-management',
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
<mat-card class="main-themes-card">
  <mat-card-header>
    <mat-card-title>Gestión de Temas Principales</mat-card-title>
    <mat-card-subtitle>Administra los temas principales para la generación de contenido</mat-card-subtitle>
  </mat-card-header>

  <mat-card-content>
    <mat-expansion-panel [expanded]="showCreateForm()" (opened)="showCreateForm.set(true)" (closed)="onExpansionPanelClosed()">
      <mat-expansion-panel-header>
        <mat-panel-title>
          {{ editingThemeId() ? 'Editar Tema Principal' : 'Crear Nuevo Tema Principal' }}
        </mat-panel-title>
        <mat-panel-description>
          {{ showCreateForm() ? 'Cerrar para ver la lista' : 'Haz clic para añadir o editar un tema' }}
        </mat-panel-description>
      </mat-expansion-panel-header>

      <form [formGroup]="mainThemeForm" (ngSubmit)="onSubmit()" class="create-form">
        <div class="form-grid">
          <mat-form-field appearance="outline" class="form-field">
            <mat-label>Categoría</mat-label>
            <input matInput formControlName="category" required>
            @if(getFormControl('category')?.invalid && getFormControl('category')?.touched){ <mat-error>La categoría es requerida.</mat-error> }
          </mat-form-field>

          <mat-form-field appearance="outline" class="form-field">
            <mat-label>Nivel</mat-label>
            <mat-select formControlName="level" required>
              @for(level of levels; track level.value){ <mat-option [value]="level.value">{{level.viewValue}}</mat-option> }
            </mat-select>
             @if(getFormControl('level')?.invalid && getFormControl('level')?.touched){ <mat-error>Nivel es requerido.</mat-error> }
          </mat-form-field>

          <mat-form-field appearance="outline" class="form-field">
            <mat-label>Año/Grado</mat-label>
            <mat-select formControlName="year" required>
             @for(year of years; track year.value){ <mat-option [value]="year.value">{{year.viewValue}}</mat-option> }
            </mat-select>
            @if(getFormControl('year')?.invalid && getFormControl('year')?.touched){ <mat-error>Año/Grado es requerido.</mat-error> }
          </mat-form-field>

          <mat-form-field appearance="outline" class="form-field">
            <mat-label>Asignatura</mat-label>
            <mat-select formControlName="subject" required>
              @for(subject of subjects; track subject.value){ <mat-option [value]="subject.value">{{subject.viewValue}}</mat-option> }
            </mat-select>
             @if(getFormControl('subject')?.invalid && getFormControl('subject')?.touched){ <mat-error>Asignatura es requerida.</mat-error> }
          </mat-form-field>
        </div>

        <div class="textarea-grid">
          <mat-form-field appearance="outline" class="form-field textarea-field">
            <mat-label>Tópicos (uno por línea)</mat-label>
            <textarea matInput cdkTextareaAutosize formControlName="topicsStr" rows="5" required></textarea>
             @if(getFormControl('topicsStr')?.invalid && getFormControl('topicsStr')?.touched){ <mat-error>Al menos un tópico es requerido.</mat-error> }
          </mat-form-field>
        </div>

        <div class="form-actions">
          <button mat-stroked-button type="button" (click)="resetFormAndState()">Limpiar / Cancelar Edición</button>
          <button mat-raised-button color="primary" type="submit" [disabled]="mainThemeForm.invalid || isSubmitting()">
            @if(isSubmitting()){ <mat-spinner diameter="20" class="inline-spinner"></mat-spinner> {{ editingThemeId() ? 'Actualizando...' : 'Guardando...' }} }
            @else {
              <ng-container>
                <mat-icon>{{ editingThemeId() ? 'update' : 'save' }}</mat-icon>
                {{ editingThemeId() ? 'Actualizar Tema' : 'Guardar Tema' }}
              </ng-container>
            }
          </button>
        </div>
      </form>
    </mat-expansion-panel>

    <hr class="section-divider">

    <div class="filters-section">
      <h3>Filtrar Temas Principales</h3>
      <form [formGroup]="filterForm" class="filter-form">
        <mat-form-field appearance="outline" class="filter-field">
          <mat-label>Buscar por Categoría</mat-label>
          <input matInput formControlName="category" placeholder="Ej: El Universo">
        </mat-form-field>
        <mat-form-field appearance="outline" class="filter-field">
          <mat-label>Nivel</mat-label>
          <mat-select formControlName="level">
            <mat-option value="">Todos</mat-option>
            @for(level of levels; track level.value){ <mat-option [value]="level.value">{{level.viewValue}}</mat-option> }
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline" class="filter-field">
          <mat-label>Año/Grado</mat-label>
          <mat-select formControlName="year">
            <mat-option value="">Todos</mat-option>
             @for(year of years; track year.value){ <mat-option [value]="year.value">{{year.viewValue}}</mat-option> }
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline" class="filter-field">
          <mat-label>Asignatura</mat-label>
          <mat-select formControlName="subject">
            <mat-option value="">Todas</mat-option>
            @for(subject of subjects; track subject.value){ <mat-option [value]="subject.value">{{subject.viewValue}}</mat-option> }
          </mat-select>
        </mat-form-field>
        <button mat-stroked-button type="button" (click)="resetFilters()">
          <mat-icon>clear_all</mat-icon> Limpiar Filtros
        </button>
      </form>
    </div>

    @if(isLoadingThemes()){
      <div class="loading-indicator"><mat-spinner diameter="50"></mat-spinner><p>Cargando temas...</p></div>
    } @else if (filteredMainThemes().length === 0) {
      <p class="no-results">No se encontraron temas con los filtros aplicados.</p>
    } @else {
      <div class="table-container mat-elevation-z4">
        <table mat-table [dataSource]="filteredMainThemes()" class="main-themes-table">
          <ng-container matColumnDef="category">
            <th mat-header-cell *matHeaderCellDef> Categoría </th>
            <td mat-cell *matCellDef="let theme"> {{theme.category}} </td>
          </ng-container>
          <ng-container matColumnDef="level">
            <th mat-header-cell *matHeaderCellDef> Nivel </th>
            <td mat-cell *matCellDef="let theme"> {{getDisplayValue(levels, theme.level)}} </td>
          </ng-container>
          <ng-container matColumnDef="year">
            <th mat-header-cell *matHeaderCellDef> Año/Grado </th>
            <td mat-cell *matCellDef="let theme"> {{getDisplayValue(years, theme.year)}} </td>
          </ng-container>
          <ng-container matColumnDef="subject">
            <th mat-header-cell *matHeaderCellDef> Asignatura </th>
            <td mat-cell *matCellDef="let theme"> {{getDisplayValue(subjects, theme.subject)}} </td>
          </ng-container>
           <ng-container matColumnDef="topics">
            <th mat-header-cell *matHeaderCellDef> Tópicos </th>
            <td mat-cell *matCellDef="let theme">
              <mat-chip-listbox aria-label="Tópicos">
                 @for(topic of theme.topics.slice(0, 3); track topic){
                    <mat-chip>{{topic}}</mat-chip>
                 }
                 @if(theme.topics.length > 3){
                    <mat-chip>+{{theme.topics.length - 3}} más</mat-chip>
                 }
              </mat-chip-listbox>
            </td>
          </ng-container>
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef> Acciones </th>
            <td mat-cell *matCellDef="let theme">
              <button mat-icon-button color="primary" (click)="onEditTheme(theme)" matTooltip="Editar Tema">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button color="warn" (click)="onDeleteTheme(theme._id)" matTooltip="Eliminar Tema">
                <mat-icon>delete</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
        </div>
    }
  </mat-card-content>
</mat-card>
  `,
    // --- Inline Styles ---
    styles: [`
    :host { display: block; }
    .main-themes-card { margin: 0 auto; padding: 15px 25px 25px 25px; }
    .create-form, .filter-form { display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; }
    .form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px; }
    .textarea-grid { display: grid; grid-template-columns: 1fr; gap: 15px; margin-top: 15px; }
    .form-field { width: 100%; }
    .textarea-field textarea { min-height: 100px; }
    .form-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px; }
    .inline-spinner { display: inline-block; margin-right: 8px; vertical-align: middle; }

    .section-divider { margin: 30px 0; border: 0; border-top: 1px solid #eee; }
    .filters-section h3 { margin-bottom: 15px; }
    .filter-form { display: flex; flex-direction: row; flex-wrap: wrap; align-items: center; gap: 15px; }
    .filter-field { flex-grow: 1; min-width: 200px; }

    .loading-indicator { text-align: center; padding: 30px; }
    .loading-indicator p { margin-top: 10px; }
    .no-results { text-align: center; padding: 20px; color: #757575; font-style: italic; }
    .table-container { overflow-x: auto; }
    .main-themes-table { width: 100%; }
    .mat-column-actions { width: 120px; text-align: right; }
    .mat-column-topics .mat-mdc-chip-set { flex-wrap: nowrap; }
  `],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class MainThemesManagementComponent implements OnInit, OnDestroy {
    // --- Dependencies ---
    #fb = inject(FormBuilder);
    #mainThemeService = inject(MainThemeService);
    #snackBar = inject(MatSnackBar);

    // --- State Signals ---
    isLoadingThemes = signal(false);
    isSubmitting = signal(false);
    showCreateForm = signal(false);
    editingThemeId = signal<string | null>(null);

    allMainThemes = signal<MainTheme[]>([]);
    filteredMainThemes = signal<MainTheme[]>([]);

    // --- Form Definitions ---
    mainThemeForm = this.#fb.group({
        category: ['', Validators.required],
        level: ['', Validators.required],
        year: ['', Validators.required],
        subject: ['', Validators.required],
        topicsStr: ['', Validators.required],
    });

    filterForm = this.#fb.group({
        category: [''],
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
    readonly years = [
        { value: 'PRIMERO', viewValue: '1er Grado' }, { value: 'SEGUNDO', viewValue: '2do Grado' },
        { value: 'TERCERO', viewValue: '3er Grado' }, { value: 'CUARTO', viewValue: '4to Grado' },
        { value: 'QUINTO', viewValue: '5to Grado' }, { value: 'SEXTO', viewValue: '6to Grado' },
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
        { value: 'FORMACION_HUMANA', viewValue: 'Formación Integral Humana y Religiosa' },
    ];

    // --- Table ---
    displayedColumns: string[] = ['category', 'level', 'year', 'subject', 'topics', 'actions'];

    // --- Lifecycle Management ---
    #destroy$ = new Subject<void>();

    // --- OnInit ---
    ngOnInit(): void {
        this.#loadMainThemes();
        this.#listenForFilterChanges();
    }

    // --- OnDestroy ---
    ngOnDestroy(): void {
        this.#destroy$.next();
        this.#destroy$.complete();
    }

    // --- Private Methods ---

    #loadMainThemes(): void {
        this.isLoadingThemes.set(true);
        this.#mainThemeService.findAll({}).pipe(
            takeUntil(this.#destroy$),
            tap(themes => {
                this.allMainThemes.set(themes || []);
                this.#applyClientSideFilters(this.filterForm.value, themes || []);
            }),
            catchError(error => this.#handleError(error, 'Error al cargar los temas principales.')),
            finalize(() => this.isLoadingThemes.set(false))
        ).subscribe();
    }

    #listenForFilterChanges(): void {
        this.filterForm.valueChanges.pipe(
            takeUntil(this.#destroy$),
            startWith(this.filterForm.value),
            debounceTime(300),
            distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
            tap(filterValues => {
                this.#applyClientSideFilters(filterValues, this.allMainThemes());
            })
        ).subscribe();
    }

    #applyClientSideFilters(filters: any, sourceThemes: MainTheme[]): void {
        let themes = [...sourceThemes];
        if (filters.category) {
            themes = themes.filter(t => t.category.toLowerCase().includes(filters.category.toLowerCase()));
        }
        if (filters.level) {
            themes = themes.filter(t => t.level === filters.level);
        }
        if (filters.year) {
            themes = themes.filter(t => t.year === filters.year);
        }
        if (filters.subject) {
            themes = themes.filter(t => t.subject === filters.subject);
        }
        this.filteredMainThemes.set(themes);
    }

    #handleError(error: any, defaultMessage: string): Observable<never> {
        console.error(defaultMessage, error);
        const message = error?.error?.message || defaultMessage;
        this.#snackBar.open(message, 'Cerrar', { duration: 5000 });
        return EMPTY;
    }

    #splitStringToArray(str: string | undefined | null): string[] {
        if (!str) return [];
        return str.split('\n').map(item => item.trim()).filter(item => item.length > 0);
    }

    #joinArrayToString(arr: string[] | undefined | null): string {
        if (!arr) return '';
        return arr.join('\n');
    }

    // --- Public Methods ---

    getFormControl(name: string): AbstractControl | null {
        return this.mainThemeForm.get(name);
    }

    getDisplayValue(options: { value: string, viewValue: string }[], value: string): string {
        const option = options.find(opt => opt.value === value);
        return option ? option.viewValue : value;
    }

    resetFormAndState(): void {
        this.mainThemeForm.reset({
            category: '', level: '', year: '', subject: '', topicsStr: ''
        });
        this.editingThemeId.set(null);
        this.isSubmitting.set(false);
    }

    onExpansionPanelClosed(): void {
        if (!this.editingThemeId()) {
            this.resetFormAndState();
        }
        this.showCreateForm.set(false);
    }

    resetFilters(): void {
        this.filterForm.reset({ category: '', level: '', year: '', subject: '' });
    }

    onSubmit(): void {
        if (this.mainThemeForm.invalid) {
            this.mainThemeForm.markAllAsTouched();
            this.#snackBar.open('Por favor, completa todos los campos requeridos.', 'Cerrar', { duration: 3000 });
            return;
        }

        this.isSubmitting.set(true);
        const formValue = this.mainThemeForm.getRawValue();

        const themeData: Partial<MainTheme> = {
            category: formValue.category!,
            level: formValue.level!,
            year: formValue.year!,
            subject: formValue.subject!,
            topics: this.#splitStringToArray(formValue.topicsStr),
        };

        let operation$: Observable<MainTheme | ApiUpdateResponse>;
        const editingId = this.editingThemeId();

        if (editingId) {
            operation$ = this.#mainThemeService.update(editingId, themeData);
        } else {
            operation$ = this.#mainThemeService.create(themeData as MainTheme);
        }

        operation$.pipe(
            takeUntil(this.#destroy$),
            tap(() => {
                const category = themeData.category;
                const message = editingId
                    ? `Tema "${category}" actualizado exitosamente.`
                    : `Tema "${category}" creado exitosamente.`;
                this.#snackBar.open(message, 'Cerrar', { duration: 3000 });
                this.resetFormAndState();
                this.showCreateForm.set(false);
                this.#loadMainThemes();
            }),
            catchError(error => {
                this.isSubmitting.set(false);
                const action = editingId ? 'actualizar' : 'crear';
                return this.#handleError(error, `Error al ${action} el tema principal.`);
            }),
            finalize(() => this.isSubmitting.set(false))
        ).subscribe();
    }

    onEditTheme(theme: MainTheme): void {
        this.editingThemeId.set(theme._id);
        this.mainThemeForm.patchValue({
            category: theme.category,
            level: theme.level,
            year: theme.year,
            subject: theme.subject,
            topicsStr: this.#joinArrayToString(theme.topics),
        });
        this.showCreateForm.set(true);
        this.#snackBar.open(`Editando tema: "${theme.category}".`, 'Cerrar', { duration: 2000 });
    }

    onDeleteTheme(themeId: string): void {
        if (!confirm('¿Estás seguro de que deseas eliminar este tema principal?')) {
            return;
        }
        this.isLoadingThemes.set(true); // Indicate loading state during deletion
        this.#mainThemeService.delete(themeId).pipe(
            takeUntil(this.#destroy$),
            tap(response => {
                if (response && response.deletedCount > 0) {
                    this.#snackBar.open('Tema eliminado exitosamente.', 'Cerrar', { duration: 3000 });
                }
                this.#loadMainThemes();
            }),
            catchError(error => this.#handleError(error, 'Error al eliminar el tema.')),
            finalize(() => this.isLoadingThemes.set(false))
        ).subscribe();
    }
}
