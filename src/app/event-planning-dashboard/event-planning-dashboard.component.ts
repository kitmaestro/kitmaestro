import { Component } from '@angular/core';
import { InProgressComponent } from '../ui/alerts/in-progress/in-progress.component';

@Component({
	selector: 'app-event-planning-dashboard',
	imports: [InProgressComponent],
	templateUrl: './event-planning-dashboard.component.html',
	styleUrl: './event-planning-dashboard.component.scss',
})
export class EventPlanningDashboardComponent {}
