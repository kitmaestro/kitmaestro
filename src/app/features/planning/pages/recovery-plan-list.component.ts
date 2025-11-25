import { Component, inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { Store } from '@ngrx/store';
import { downloadRecoveryPlan, loadRecoveryPlans, selectAllRecoveryPlans, selectIsLoadingManyRecoveryPlans } from '../../../store';
import { RecoveryPlan } from '../../../core';
import { RouterLink } from '@angular/router';
import { UpperCasePipe } from '@angular/common';
import { PretifyPipe } from '../../../shared';

@Component({
  selector: 'app-recovery-plan-list',
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    UpperCasePipe,
    PretifyPipe,
  ],
  template: `
    <div class="container">
      <div class="flex-header">
        <h1>Planes de Recuperación</h1>
        <button mat-flat-button routerLink="/planning/recovery-plan-generator">Nuevo Plan</button>
      </div>

      <table mat-table [dataSource]="dataSource()" class="mat-elevation-z8">

        <!-- Section Column -->
        <ng-container matColumnDef="section">
          <th mat-header-cell *matHeaderCellDef> Sección </th>
          <td mat-cell *matCellDef="let element"> {{element.section.name}} </td>
        </ng-container>

        <!-- Subject Column -->
        <ng-container matColumnDef="subject">
          <th mat-header-cell *matHeaderCellDef> Asignatura </th>
          <td mat-cell *matCellDef="let element"> {{element.subject | pretify}} </td>
        </ng-container>

        <!-- Period Column -->
        <ng-container matColumnDef="period">
          <th mat-header-cell *matHeaderCellDef> Período </th>
          <td mat-cell *matCellDef="let element"> {{element.period | uppercase}} </td>
        </ng-container>

        <!-- Students Column -->
        <ng-container matColumnDef="students">
          <th mat-header-cell *matHeaderCellDef> Estudiantes </th>
          <td mat-cell *matCellDef="let element"> {{element.students.length}} </td>
        </ng-container>

        <!-- Actions Column -->
        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef> Acciones </th>
          <td mat-cell *matCellDef="let element">
            <button mat-icon-button routerLink="/planning/recovery-plans/{{element._id}}">
              <mat-icon>open_in_new</mat-icon>
            </button>
            <button mat-icon-button (click)="downloadPlan(element)">
              <mat-icon>get_app</mat-icon>
            </button>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>
    </div>
  `,
  styles: `
    .container {
      padding: 2rem;
    }

    table {
      width: 100%;
      margin-top: 1rem;
    }

    .flex-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  `
})
export class RecoveryPlanListComponent implements OnInit {
  #store = inject(Store)
  displayedColumns: string[] = ['section', 'subject', 'period', 'students', 'actions'];
  dataSource = this.#store.selectSignal(selectAllRecoveryPlans);

  ngOnInit(): void {
    this.#store.dispatch(loadRecoveryPlans({ filters: {} }))
  }

  downloadPlan(plan: RecoveryPlan) {
    this.#store.dispatch(downloadRecoveryPlan({ recoveryPlan: plan }))
  }
}
