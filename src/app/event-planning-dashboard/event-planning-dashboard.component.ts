import { Component } from '@angular/core';
import { InProgressComponent } from '../alerts/in-progress/in-progress.component';

@Component({
  selector: 'app-event-planning-dashboard',
  standalone: true,
  imports: [
    InProgressComponent,
  ],
  templateUrl: './event-planning-dashboard.component.html',
  styleUrl: './event-planning-dashboard.component.scss'
})
export class EventPlanningDashboardComponent {

}
