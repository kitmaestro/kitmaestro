import {
    ChangeDetectionStrategy,
    Component,
    inject,
    OnInit,
    signal,
    computed,
    OnDestroy,
} from '@angular/core'
import {
    ReactiveFormsModule,
    FormGroup,
    FormArray,
    Validators,
    NonNullableFormBuilder,
} from '@angular/forms'
import { CommonModule } from '@angular/common'
import { Store } from '@ngrx/store'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'

// Angular Material Modules
import { MatSidenavModule } from '@angular/material/sidenav'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatTableModule } from '@angular/material/table'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatSelectModule } from '@angular/material/select'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MatCardModule } from '@angular/material/card'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatListModule } from '@angular/material/list'

// NgRx State
import { fromDidacticSequences } from '../../../store'
import { DidacticSequence } from '../../../core/models'
import { createSequence, deleteSequence, DidacticSequenceDto, DidacticSequenceStateStatus, loadSequences, updateSequence } from '../../../store/didactic-sequences'
import { DidacticSequencePlan, SchoolLevel, SchoolSubject, SchoolYear } from '../../../core'

const GRADES: { value: SchoolYear, name: string }[] = [
]
const LEVELS: { value: SchoolLevel, name: string }[] = []
const SUBJECTS: { value: SchoolSubject, name: string }[] = []

@Component({
    selector: 'app-didactic-sequence-management',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatSidenavModule,
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
        <mat-sidenav-container class="management-container">
            <!-- Sidenav (Formulario) -->
            <mat-sidenav
                #sidenav
                [opened]="showForm()"
                mode="over"
                position="end"
                class="form-sidenav"
            >
                <div class="form-header">
                    <h2>
                        {{
                            selectedSequenceId()
                                ? 'Editar Secuencia'
                                : 'Nueva Secuencia'
                        }}
                    </h2>
                    <button
                        mat-icon-button
                        (click)="onCloseForm()"
                        aria-label="Cerrar formulario"
                    >
                        <mat-icon>close</mat-icon>
                    </button>
                </div>

                <form
                    [formGroup]="sequenceForm"
                    (ngSubmit)="onSubmit()"
                    class="form-container"
                >
                    <mat-form-field appearance="outline">
                        <mat-label>Nivel</mat-label>
                        <mat-select formControlName="level">
                            <mat-option
                                *ngFor="let level of levels"
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
                                *ngFor="let grade of grades"
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
                                *ngFor="let subject of subjects"
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
                                <mat-expansion-panel
                                    *ngFor="
                                        let plan of plans.controls;
                                        let i = index
                                    "
                                    [formGroupName]="i"
                                >
                                    <mat-expansion-panel-header>
                                        <mat-panel-title>
                                            Plan {{ i + 1 }}:
                                            {{
                                                plan.get('title')?.value ||
                                                    'Nuevo Plan'
                                            }}
                                        </mat-panel-title>
                                    </mat-expansion-panel-header>

                                    <mat-form-field appearance="outline">
                                        <mat-label>Título del Plan</mat-label>
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

                                    <!-- Aquí irían los FormArrays más anidados -->

                                    <button
                                        mat-icon-button
                                        color="warn"
                                        type="button"
                                        (click)="removePlan(i)"
                                        aria-label="Eliminar plan"
                                    >
                                        <mat-icon>delete</mat-icon>
                                    </button>
                                </mat-expansion-panel>
                            </mat-accordion>
                        </div>
                    </div>

                    <!-- Botones del Formulario -->
                    <div class="form-actions">
                        <button mat-button type="button" (click)="onCloseForm()">
                            Cancelar
                        </button>
                        <button
                            mat-flat-button
                            color="primary"
                            type="submit"
                            [disabled]="sequenceForm.invalid || isSaving()"
                        >
                            <mat-icon>save</mat-icon>
                            {{ isSaving() ? 'Guardando...' : 'Guardar' }}
                        </button>
                    </div>
                </form>
            </mat-sidenav>

            <!-- Contenido Principal (Tabla) -->
            <mat-sidenav-content class="content-area">
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
            </mat-sidenav-content>
        </mat-sidenav-container>
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

            .form-sidenav {
                width: 45%;
                max-width: 600px;
                padding: 1.5rem;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
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

            .form-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 1rem;
            }

            .form-container {
                display: flex;
                flex-direction: column;
                gap: 1rem;
            }

            .form-actions {
                display: flex;
                justify-content: flex-end;
                gap: 0.5rem;
                margin-top: 1rem;
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
export class DidacticSequenceManagementComponent implements OnInit, OnDestroy {
    #store = inject(Store)
    #fb = inject(NonNullableFormBuilder)
    #destroy$ = new Subject<void>()

    // Datos del Store (como signals)
    sequences = this.#store.selectSignal(fromDidacticSequences.selectAllSequences)
    isLoading = this.#store.selectSignal(fromDidacticSequences.selectIsLoadingMany)
    isCreating = this.#store.selectSignal(fromDidacticSequences.selectIsCreating)
    isUpdating = this.#store.selectSignal(fromDidacticSequences.selectIsUpdating)
    isSaving = computed(() => this.isCreating() || this.isUpdating())
    error = this.#store.selectSignal(fromDidacticSequences.selectSequencesError)

    // Estado local del UI
    showForm = signal(false)
    selectedSequenceId = signal<string | null>(null)

    // Formulario Reactivo
    sequenceForm!: FormGroup
    displayedColumns: string[] = ['subject', 'level', 'year', 'plansCount', 'actions']

    // Datos para Selects (Asumiendo que existen)
    levels = LEVELS
    grades = GRADES
    subjects = SUBJECTS

    ngOnInit(): void {
        this.initForm()
        this.#store.dispatch(loadSequences({ filters: {} }))

        // Escuchar por éxito en creación/actualización para cerrar el formulario
        this.#store
            .select(fromDidacticSequences.selectSequencesStatus)
            .pipe(takeUntil(this.#destroy$))
            .subscribe(status => {
                if (
                    status ===
                    DidacticSequenceStateStatus
                        .IDLING &&
                    this.showForm() &&
                    !this.isLoading() &&
                    !this.isSaving()
                ) {
                    // Si acababa de guardar (isSaving era true antes) y ahora está idling
                    // Podríamos necesitar un estado local extra, pero por ahora cerramos
                }
            })
    }

    ngOnDestroy(): void {
        this.#destroy$.next()
        this.#destroy$.complete()
    }

    initForm(): void {
        this.sequenceForm = this.#fb.group({
            level: ['', Validators.required],
            year: ['', Validators.required],
            subject: ['', Validators.required],
            tableOfContents: this.#fb.control('[]'), // Simplificado a JSON
            plans: this.#fb.array([]), // FormArray para planes
        })
    }

    // --- Getters del FormArray ---
    get plans(): FormArray {
        return this.sequenceForm.get('plans') as FormArray
    }

    // --- Métodos para gestionar Planes (FormArray) ---
    createPlanFormGroup(plan?: DidacticSequencePlan): FormGroup {
        // Simplificado - un DTO real necesitaría más FormArrays anidados aquí
        return this.#fb.group({
            title: [plan?.title || '', Validators.required],
            description: [plan?.description || ''],
            // ... Aquí irían los 'blocks', 'activities', etc.
        })
    }

    addPlan(): void {
        this.plans.push(this.createPlanFormGroup())
    }

    removePlan(index: number): void {
        this.plans.removeAt(index)
    }

    // --- Lógica de UI ---
    onNewSequence(): void {
        this.selectedSequenceId.set(null)
        this.sequenceForm.reset({
            level: '',
            year: '',
            subject: '',
            tableOfContents: '[]',
        })
        this.plans.clear()
        this.showForm.set(true)
    }

    onSelectSequence(sequence: DidacticSequence): void {
        this.selectedSequenceId.set(sequence._id)

        // Limpiar FormArray antes de parchear
        this.plans.clear()

        // Volver a llenar el FormArray con los datos de la secuencia
        sequence.plans.forEach(plan => {
            this.plans.push(this.createPlanFormGroup(plan))
        })

        // Parchear los valores principales
        this.sequenceForm.patchValue({
            level: sequence.level,
            year: sequence.year,
            subject: sequence.subject,
            tableOfContents: JSON.stringify(sequence.tableOfContents, null, 2),
        })

        this.showForm.set(true)
    }

    onCloseForm(): void {
        this.showForm.set(false)
        this.selectedSequenceId.set(null)
        this.sequenceForm.reset()
        this.plans.clear()
    }

    // --- Lógica CRUD (Store) ---
    onDeleteSequence(id: string): void {
        // En una app real, aquí iría un MatDialog de confirmación
        this.#store.dispatch(deleteSequence({ id }))
    }

    onSubmit(): void {
        if (this.sequenceForm.invalid) {
            return
        }

        const id = this.selectedSequenceId()
        const rawValue = this.sequenceForm.getRawValue()

        // Convertir los campos JSON de nuevo a objetos
        let dto: DidacticSequenceDto
        try {
            dto = {
                ...rawValue,
                tableOfContents: JSON.parse(rawValue.tableOfContents || '[]'),
                // Los planes ya están en el formato correcto desde el FormArray
            }
        } catch (e) {
            console.error('Error al parsear JSON del formulario', e)
            return // O mostrar un error al usuario
        }

        if (id) {
            this.#store.dispatch(
                updateSequence({
                    id,
                    data: dto as Partial<DidacticSequenceDto>,
                }),
            )
        } else {
            this.#store.dispatch(
                createSequence({
                    sequence: dto as DidacticSequenceDto,
                }),
            )
        }

        // Cierre optimista (o podríamos esperar al 'success' con el 'takeUntil')
        this.onCloseForm()
    }
}
