import { Component } from '@angular/core';
import { InProgressComponent } from '../ui/alerts/in-progress/in-progress.component';

@Component({
	selector: 'app-tasks-dashboard',
	imports: [InProgressComponent],
	templateUrl: './tasks-dashboard.component.html',
	styleUrl: './tasks-dashboard.component.scss',
})
export class TasksDashboardComponent {}
