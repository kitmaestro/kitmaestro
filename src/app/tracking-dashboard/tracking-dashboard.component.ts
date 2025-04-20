import { Component } from '@angular/core';
import { InProgressComponent } from '../ui/alerts/in-progress/in-progress.component';
import { IsPremiumComponent } from '../ui/alerts/is-premium/is-premium.component';
import { MatCardModule } from '@angular/material/card';

@Component({
	selector: 'app-tracking-dashboard',
	imports: [InProgressComponent, IsPremiumComponent, MatCardModule],
	templateUrl: './tracking-dashboard.component.html',
	styleUrl: './tracking-dashboard.component.scss',
})
export class TrackingDashboardComponent {
	working = false;
}
