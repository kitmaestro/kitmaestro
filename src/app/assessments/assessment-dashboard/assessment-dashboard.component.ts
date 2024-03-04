import { Component } from '@angular/core';
import { IsPremiumComponent } from '../../alerts/is-premium/is-premium.component';

@Component({
  selector: 'app-assessment-dashboard',
  standalone: true,
  imports: [
    IsPremiumComponent,
  ],
  templateUrl: './assessment-dashboard.component.html',
  styleUrl: './assessment-dashboard.component.scss'
})
export class AssessmentDashboardComponent {

}
