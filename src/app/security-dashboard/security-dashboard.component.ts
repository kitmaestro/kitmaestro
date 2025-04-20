import { Component } from '@angular/core';
import { InProgressComponent } from '../ui/alerts/in-progress/in-progress.component';

@Component({
	selector: 'app-security-dashboard',
	imports: [InProgressComponent],
	templateUrl: './security-dashboard.component.html',
	styleUrl: './security-dashboard.component.scss',
})
export class SecurityDashboardComponent {}
