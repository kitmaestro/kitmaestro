import { Component, inject, OnDestroy, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators, FormArray, FormGroup } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { MatExpansionModule } from '@angular/material/expansion';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';

import { createSequence, DidacticSequenceDto, fromDidacticSequences } from '../../../store';
import { PretifyPipe } from '../../../shared/pipes/pretify.pipe';

const { selectIsCreating } = fromDidacticSequences;

@Component({
  selector: 'app-didactic-sequence-creator',
  standalone: true,
  imports: [
    RouterModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatStepperModule,
    MatExpansionModule,
    PretifyPipe
  ],
  template: `
    <div class="container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Crear Nueva Secuencia Didáctica</mat-card-title>
          <button
            mat-button
            routerLink="/admin/didactic-sequences">
            <mat-icon>arrow_back</mat-icon>
            Volver
          </button>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <mat-stepper linear #stepper>

              <!-- Paso 1: Información Básica -->
              <mat-step [stepControl]="basicInfoForm">
                <ng-template matStepLabel>Información Básica</ng-template>

                <div class="step-content">
                  <div class="form-row">
                    <mat-form-field appearance="outline">
                      <mat-label>Nivel</mat-label>
                      <mat-select formControlName="level" required>
                        @for (level of schoolLevels; track level) {
                          <mat-option [value]="level">
                            {{ level | pretify }}
                          </mat-option>
                        }
                      </mat-select>
                      <mat-error>Este campo es requerido</mat-error>
                    </mat-form-field>

                    <mat-form-field appearance="outline">
                      <mat-label>Año</mat-label>
                      <mat-select formControlName="year" required>
                        @for (year of schoolYears; track year) {
                          <mat-option [value]="year">
                            {{ year | pretify }}
                          </mat-option>
                        }
                      </mat-select>
                      <mat-error>Este campo es requerido</mat-error>
                    </mat-form-field>

                    <mat-form-field appearance="outline">
                      <mat-label>Materia</mat-label>
                      <mat-select formControlName="subject" required>
                        @for (subject of schoolSubjects; track subject) {
                          <mat-option [value]="subject">
                            {{ subject | pretify }}
                          </mat-option>
                        }
                      </mat-select>
                      <mat-error>Este campo es requerido</mat-error>
                    </mat-form-field>
                  </div>
                </div>

                <div class="stepper-actions">
                  <button mat-button matStepperNext [disabled]="basicInfoForm.invalid">
                    Siguiente
                    <mat-icon>arrow_forward</mat-icon>
                  </button>
                </div>
              </mat-step>

              <!-- Paso 2: Tabla de Contenidos -->
              <mat-step [stepControl]="tableOfContentsForm">
                <ng-template matStepLabel>Tabla de Contenidos</ng-template>

                <div class="step-content">
                  <div formArrayName="tableOfContents">
                    @for (item of tableOfContents.controls; track item; let i = $index) {
                      <mat-expansion-panel>
                        <mat-expansion-panel-header>
                          <mat-panel-title>
                            Unidad {{ i + 1 }}: {{ item.get('title')?.value || 'Sin título' }}
                          </mat-panel-title>
                        </mat-expansion-panel-header>

                        <div [formGroup]="item" class="content-item-form">
                          <mat-form-field appearance="outline">
                            <mat-label>Título de la Unidad</mat-label>
                            <input matInput formControlName="title" required>
                            <mat-error>Este campo es requerido</mat-error>
                          </mat-form-field>

                          <mat-form-field appearance="outline">
                            <mat-label>Página Inicial</mat-label>
                            <input matInput type="number" formControlName="startingPage" required min="1">
                            <mat-error>Debe ser un número válido</mat-error>
                          </mat-form-field>

                          <h4>Temas</h4>
                          <div formArrayName="topics">
                            @for (topic of getTopics(item).controls; track topic; let j = $index) {
                              <div [formGroup]="topic" class="topic-form">
                                <mat-form-field appearance="outline">
                                  <mat-label>Título del Tema</mat-label>
                                  <input matInput formControlName="title" required>
                                  <mat-error>Este campo es requerido</mat-error>
                                </mat-form-field>

                                <mat-form-field appearance="outline">
                                  <mat-label>Página Inicial</mat-label>
                                  <input matInput type="number" formControlName="startingPage" required min="1">
                                  <mat-error>Debe ser un número válido</mat-error>
                                </mat-form-field>

                                <mat-form-field appearance="outline">
                                  <mat-label>Orden</mat-label>
                                  <input matInput type="number" formControlName="order" required min="1">
                                  <mat-error>Debe ser un número válido</mat-error>
                                </mat-form-field>

                                <button
                                  mat-icon-button
                                  color="warn"
                                  type="button"
                                  (click)="removeTopic(item, j)">
                                  <mat-icon>delete</mat-icon>
                                </button>
                              </div>
                            }
                          </div>

                          <button
                            mat-button
                            type="button"
                            (click)="addTopic(item)">
                            <mat-icon>add</mat-icon>
                            Agregar Tema
                          </button>
                        </div>

                        <mat-action-row>
                          <button
                            mat-button
                            color="warn"
                            type="button"
                            (click)="removeContentItem(i)">
                            <mat-icon>delete</mat-icon>
                            Eliminar Unidad
                          </button>
                        </mat-action-row>
                      </mat-expansion-panel>
                    }
                  </div>

                  <button
                    mat-raised-button
                    type="button"
                    (click)="addContentItem()"
                    class="add-button">
                    <mat-icon>add</mat-icon>
                    Agregar Unidad
                  </button>
                </div>

                <div class="stepper-actions">
                  <button mat-button matStepperPrevious>
                    <mat-icon>arrow_back</mat-icon>
                    Anterior
                  </button>
                  <button
                    mat-raised-button
                    color="primary"
                    type="submit"
                    [disabled]="form.invalid || isCreating()">
                    @if (isCreating()) {
                      <mat-spinner diameter="20" class="button-spinner"></mat-spinner>
                    }
                    Crear Secuencia
                  </button>
                </div>
              </mat-step>

            </mat-stepper>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: `
    .container {
      padding: 16px;
    }

    .step-content {
      padding: 16px 0;
      min-height: 400px;
    }

    .form-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 16px;
      margin-bottom: 16px;
    }

    .content-item-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .topic-form {
      display: grid;
      grid-template-columns: 1fr 100px 80px auto;
      gap: 8px;
      align-items: start;
      padding: 16px;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      margin-bottom: 8px;
    }

    .add-button {
      margin-top: 16px;
    }

    .stepper-actions {
      display: flex;
      justify-content: space-between;
      margin-top: 16px;
    }

    .button-spinner {
      display: inline-block;
      margin-right: 8px;
    }

    mat-expansion-panel {
      margin-bottom: 8px;
    }

    h4 {
      margin: 16px 0 8px 0;
      color: rgba(0, 0, 0, 0.87);
    }
  `
})
export class DidacticSequenceCreatorComponent implements OnDestroy {
  #fb = inject(FormBuilder);
  #store = inject(Store);
  #router = inject(Router);
  #snackBar = inject(MatSnackBar);
  #destroy$ = new Subject<void>();

  isCreating = signal(false);

  schoolLevels = [
	'PRE_PRIMARIA',
	'PRIMARIA',
	'SECUNDARIA'
  ]
  schoolYears = [
	'PRIMERO',
	'SEGUNDO',
	'TERCERO',
	'CUARTO',
	'QUINTO',
	'SEXTO'
  ]
  schoolSubjects = [
	'LENGUA_ESPANOLA',
	'MATEMATICA',
	'CIENCIAS_SOCIALES',
	'CIENCIAS_NATURALES',
	'INGLES',
	'FRANCES',
	'FORMACION_HUMANA',
	'EDUCACION_FISICA',
	'EDUCACION_ARTISTICA'
  ]

  form = this.#fb.group({
    level: ['', Validators.required],
    year: ['', Validators.required],
    subject: ['', Validators.required],
    tableOfContents: this.#fb.array([], Validators.required)
  });

  get basicInfoForm() {
    return this.#fb.group({
      level: this.form.get('level'),
      year: this.form.get('year'),
      subject: this.form.get('subject')
    });
  }

  get tableOfContentsForm() {
    return this.#fb.group({
      tableOfContents: this.form.get('tableOfContents')
    });
  }

  get tableOfContents() {
    return this.form.get('tableOfContents') as FormArray<FormGroup>;
  }

  constructor() {
    this.#store.select(selectIsCreating)
      .pipe(takeUntil(this.#destroy$))
      .subscribe(isCreating => this.isCreating.set(isCreating));

    this.addContentItem();
  }

  addContentItem() {
    const itemGroup = this.#fb.group({
      title: ['', Validators.required],
      startingPage: [1, [Validators.required, Validators.min(1)]],
      topics: this.#fb.array([], Validators.required)
    });
    this.tableOfContents.push(itemGroup);
  }

  removeContentItem(index: number) {
    this.tableOfContents.removeAt(index);
  }

  getTopics(contentItem: FormGroup): FormArray<FormGroup> {
    return contentItem.get('topics') as FormArray<FormGroup>;
  }

  addTopic(contentItem: FormGroup) {
    const topicGroup = this.#fb.group({
      title: ['', Validators.required],
      startingPage: [1, [Validators.required, Validators.min(1)]],
      order: [1, [Validators.required, Validators.min(1)]]
    });
    this.getTopics(contentItem).push(topicGroup);
  }

  removeTopic(contentItem: FormGroup, index: number) {
    this.getTopics(contentItem).removeAt(index);
  }

  onSubmit() {
	const sequence: DidacticSequenceDto = this.form.getRawValue() as DidacticSequenceDto;
    if (this.form.valid) {
      this.#store.dispatch(createSequence({ sequence }));
      this.#router.navigate(['/admin/didactic-sequences']);
    } else {
      this.#snackBar.open('Por favor, complete todos los campos requeridos', 'Cerrar', {
        duration: 5000
      });
    }
  }

  ngOnDestroy() {
    this.#destroy$.next();
    this.#destroy$.complete();
  }
}
