import { Component } from '@angular/core';
import { InProgressComponent } from '../../ui/alerts/in-progress/in-progress.component';

@Component({
  selector: 'app-unit-plan-edit',
  standalone: true,
  imports: [
    InProgressComponent,
  ],
  templateUrl: './unit-plan-edit.component.html',
  styleUrl: './unit-plan-edit.component.scss'
})
export class UnitPlanEditComponent {
  working = false;
}
