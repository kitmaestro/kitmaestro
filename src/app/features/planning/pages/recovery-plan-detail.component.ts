import { Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { downloadRecoveryPlan, loadRecoveryPlan, selectCurrentRecoveryPlan } from '../../../store';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { RecoveryPlanComponent } from '../components/recovery-plan.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-recovery-plan-detail',
  imports: [
    RecoveryPlanComponent,
    RouterLink,
    MatButtonModule,
  ],
  template: `
    <div class="flex-header">
      <h1>Plan de Recuperación</h1>
      <div class="">
        <button style="margin-right: 12px;" mat-button routerLink="/planning/recovery-plans">Volver</button>
        <button mat-flat-button (click)="download()">Descargar</button>
      </div>
    </div>
    <app-recovery-plan [recoveryPlan]="recoveryPlan()" />
  `,
  styles: `
    .flex-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  `
})
export class RecoveryPlanDetailComponent implements OnInit {
  #route = inject(ActivatedRoute);
  #router = inject(Router);
  #store = inject(Store);
  recoveryPlan = this.#store.selectSignal(selectCurrentRecoveryPlan);

  ngOnInit() {
    const id = this.#route.snapshot.paramMap.get('id');
    if (!id) {
      this.#router.navigateByUrl('/planning/recovery-plans');
      return;
    }
    this.#store.dispatch(loadRecoveryPlan({ id }));
  }

  download() {
    this.#store.dispatch(downloadRecoveryPlan({ recoveryPlan: this.recoveryPlan()! }));
  }
}
