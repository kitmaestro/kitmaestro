import { Component } from '@angular/core';
import { IsPremiumComponent } from '../../ui/alerts/is-premium/is-premium.component';
import { MatCardModule } from '@angular/material/card';
import { InProgressComponent } from '../../ui/alerts/in-progress/in-progress.component';

@Component({
  selector: 'app-assessment-dashboard',
  standalone: true,
  imports: [
    IsPremiumComponent,
    InProgressComponent,
    MatCardModule,
  ],
  templateUrl: './assessment-dashboard.component.html',
  styleUrl: './assessment-dashboard.component.scss'
})
export class AssessmentDashboardComponent {
  working = false;
}
