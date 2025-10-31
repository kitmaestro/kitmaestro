import { Component, inject, OnDestroy, signal } from '@angular/core'
import { RouterModule } from '@angular/router'
import { MatTableModule } from '@angular/material/table'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MatDialog, MatDialogModule } from '@angular/material/dialog'
import { Store } from '@ngrx/store'
import { Subject, takeUntil } from 'rxjs'

import { DidacticSequence } from '../../../core/models'
import {
    loadSequences,
    deleteSequence,
    fromDidacticSequences
} from '../../../store'
import { ConfirmationDialogComponent, PretifyPipe } from '../../../shared'
const {
    selectAllSequences,
    selectIsLoadingMany,
    selectIsDeleting
} = fromDidacticSequences

@Component({
    selector: 'app-didactic-sequences',
    standalone: true,
    imports: [
        RouterModule,
        MatTableModule,
        MatButtonModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatDialogModule,
        PretifyPipe,
    ],
    template: `
    <div class="container">
      <div>
        <div class="flex">
          <h2>Secuencias Didácticas</h2>
          <a 
            mat-flat-button 
            color="primary" 
            routerLink="/admin/didactic-sequences/new"
            class="add-button">
            <mat-icon>add</mat-icon>
            Nueva Secuencia
          </a>
        </div>

        <div>
          @if (isLoading()) {
            <div class="spinner-container">
              <mat-spinner diameter="40"></mat-spinner>
            </div>
          } @else {
            <table mat-table [dataSource]="sequences()" class="mat-elevation-z1">
              
              <ng-container matColumnDef="level">
                <th mat-header-cell *matHeaderCellDef>Nivel</th>
                <td mat-cell *matCellDef="let sequence">{{ sequence.level | pretify }}</td>
              </ng-container>

              <ng-container matColumnDef="year">
                <th mat-header-cell *matHeaderCellDef>Año</th>
                <td mat-cell *matCellDef="let sequence">{{ sequence.year | pretify }}</td>
              </ng-container>

              <ng-container matColumnDef="subject">
                <th mat-header-cell *matHeaderCellDef>Materia</th>
                <td mat-cell *matCellDef="let sequence">{{ sequence.subject | pretify }}</td>
              </ng-container>

              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Opciones</th>
                <td mat-cell *matCellDef="let sequence">
                  <div class="actions-container">
                    <button 
                      mat-icon-button 
                      color="primary"
                      routerLink="/admin/didactic-sequences/{{sequence._id}}"
                      [disabled]="isDeleting()"
                      title="Ver detalles">
                      <mat-icon>visibility</mat-icon>
                    </button>
                    <button 
                      mat-icon-button 
                      color="warn"
                      (click)="onDelete(sequence)"
                      [disabled]="isDeleting()"
                      title="Eliminar secuencia">
                      <mat-icon>delete</mat-icon>
                    </button>
                  </div>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>

            @if (sequences().length === 0) {
              <div class="no-data">
                <mat-icon>inbox</mat-icon>
                <p>No hay secuencias didácticas registradas</p>
              </div>
            }
          }
        </div>
      </div>
    </div>
  `,
    styles: `
    .container {
      padding: 16px;
    }
    
    .add-button {
      margin-left: auto;
    }
    
    div.flex {
      display: flex;
      align-items: center;
      margin-bottom: 16px;
    }
    
    .spinner-container {
      display: flex;
      justify-content: center;
      padding: 40px;
    }
    
    table {
      width: 100%;
    }
    
    .actions-container {
      display: flex;
      gap: 8px;
    }
    
    .no-data {
      text-align: center;
      padding: 40px;
      color: rgba(0, 0, 0, 0.54);
    }
    
    .no-data mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 16px;
    }
  `
})
export class DidacticSequencesComponent implements OnDestroy {
    #store = inject(Store)
    #dialog = inject(MatDialog)
    #destroy$ = new Subject<void>()
    #pretify = (new PretifyPipe()).transform

    sequences = signal<DidacticSequence[]>([])
    isLoading = signal(false)
    isDeleting = signal(false)

    displayedColumns: string[] = ['level', 'year', 'subject', 'actions']

    constructor() {
        this.#store.select(selectAllSequences)
            .pipe(takeUntil(this.#destroy$))
            .subscribe(sequences => this.sequences.set(sequences))

        this.#store.select(selectIsLoadingMany)
            .pipe(takeUntil(this.#destroy$))
            .subscribe(isLoading => this.isLoading.set(isLoading))

        this.#store.select(selectIsDeleting)
            .pipe(takeUntil(this.#destroy$))
            .subscribe(isDeleting => this.isDeleting.set(isDeleting))

        this.loadSequences()
    }

    loadSequences() {
        this.#store.dispatch(loadSequences({ filters: {} }))
    }

    onDelete(sequence: DidacticSequence) {
        const dialogRef = this.#dialog.open(ConfirmationDialogComponent, {
            data: {
                title: 'Eliminar Secuencia',
                message: `¿Estás seguro de que deseas eliminar la secuencia de ${this.#pretify(sequence.level)} - ${this.#pretify(sequence.year)} - ${this.#pretify(sequence.subject)}?`
            }
        })

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.#store.dispatch(deleteSequence({ id: sequence._id }))
            }
        })
    }

    ngOnDestroy() {
        this.#destroy$.next()
        this.#destroy$.complete()
    }
}
