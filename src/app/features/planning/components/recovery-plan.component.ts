import { Component, Input } from '@angular/core';
import { RecoveryPlan } from '../../../core/models';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recovery-plan',
  templateUrl: './recovery-plan.component.html',
  standalone: true,
  imports: [CommonModule],
})
export class RecoveryPlanComponent {
  @Input() recoveryPlan: RecoveryPlan;
}
