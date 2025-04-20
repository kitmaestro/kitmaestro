import { Component } from '@angular/core';
import { InProgressComponent } from '../ui/alerts/in-progress/in-progress.component';

@Component({
	selector: 'app-tools-dashboard',
	imports: [InProgressComponent],
	templateUrl: './tools-dashboard.component.html',
	styleUrl: './tools-dashboard.component.scss',
})
export class ToolsDashboardComponent {}
