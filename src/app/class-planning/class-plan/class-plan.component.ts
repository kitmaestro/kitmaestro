import { Component } from '@angular/core';
import { IsPremiumComponent } from '../../alerts/is-premium/is-premium.component';

@Component({
  selector: 'app-class-plan',
  standalone: true,
  imports: [
    IsPremiumComponent,
  ],
  templateUrl: './class-plan.component.html',
  styleUrl: './class-plan.component.scss'
})
export class ClassPlanComponent {

}
