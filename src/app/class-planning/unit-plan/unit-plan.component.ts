import { Component } from '@angular/core';
import { IsPremiumComponent } from '../../ui/alerts/is-premium/is-premium.component';

@Component({
  selector: 'app-unit-plan',
  standalone: true,
  imports: [
    IsPremiumComponent,
  ],
  templateUrl: './unit-plan.component.html',
  styleUrl: './unit-plan.component.scss'
})
export class UnitPlanComponent {

}
